import Area from "../models/Area.model.js";
import { generateAndSendReport } from "../services/report.service.js";

/**
 * POST /api/intelligence/action
 * Handles report generation and email dispatch based on admin selection
 */
export const handleAction = async (req, res) => {
  try {
    const { plotId, areaId, actionType } = req.body;

    // 1. Fetch Area and Plot Data
    const area = await Area.findOne({ areaId });
    if (!area) return res.status(404).json({ message: "Area not found" });

    const plot = area.plots.find((p) => p.plotId === plotId);
    if (!plot) return res.status(404).json({ message: "Plot not found" });

    // 2. Prepare Data for the PDF Service
    const reportPayload = {
      plotId: plot.plotId,
      ownerName: plot.ownerName,
      areaName: area.areaName,
      status: plot.compliance.status,
      deviation: plot.compliance.deviationPercent,
      satImageUrl: area.satelliteImage.imageUrl, // Cloudinary link
    };

    // 3. Logic for Recipient Determination
    let recipientEmail = "";

    if (actionType === "SEND_TO_SELF") {
      // req.user is now fully populated by the async protect middleware
      recipientEmail = req.user.email;
    } else if (actionType === "ISSUE_WARNING") {
      // Use owner email if available, otherwise fallback to the current admin
      recipientEmail = plot.ownerEmail || req.user.email;
      plot.compliance.status = "WARNING_SENT";
    }

    // --- CRITICAL SAFETY CHECK ---
    // Prevents Nodemailer "No recipients defined" error
    if (!recipientEmail) {
      return res.status(400).json({
        message: "Action aborted",
        error:
          "Recipient email is missing. Ensure the user is logged in or the plot has an owner email.",
      });
    }

    // 4. Update Audit History in the Database
    plot.compliance.actionHistory.push({
      actionType: actionType,
      details: `Official report dispatched to ${recipientEmail}`,
      timestamp: new Date(),
    });

    await area.save();

    // 5. Generate PDF and Send Email
    // Awaiting ensures we catch SMTP/Network errors before responding
    await generateAndSendReport(reportPayload, recipientEmail);

    res.status(200).json({
      message: `Action ${actionType} executed successfully`,
      recipient: recipientEmail,
      plotStatus: plot.compliance.status,
    });
  } catch (err) {
    console.error("Action Execution Error:", err.message);
    res.status(500).json({
      message: "Failed to execute action",
      error: err.message,
    });
  }
};
