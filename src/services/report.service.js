import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
import fs from "fs";
import axios from "axios";
import path from "path";

/**
 * Main Service to Generate and Dispatch Reports
 */
export const generateAndSendReport = async (reportData, recipientEmail) => {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const fileName = `CSIDC_Audit_${reportData.plotId || "Bulk"}_${Date.now()}.pdf`;
    const filePath = path.join(process.cwd(), "uploads", fileName);
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // --- 1. OFFICIAL HEADER ---
    doc
      .fillColor("#1a5276")
      .fontSize(20)
      .text("CHHATTISGARH STATE INDUSTRIAL DEVELOPMENT CORP.", {
        align: "center",
      });
    doc
      .fontSize(10)
      .fillColor("black")
      .text("GEO-AI MONITORING & COMPLIANCE CELL", { align: "center" });
    doc.moveDown();
    doc.moveTo(50, 100).lineTo(545, 100).stroke();

    // --- 2. QR CODE GENERATION ---
    // Links to a "Public View" or specific record (Dummy link for now)
    const qrData = `https://geo-audit-csidc.gov.in/verify/${reportData.plotId}`;
    const qrBuffer = await QRCode.toBuffer(qrData);
    doc.image(qrBuffer, 460, 110, { width: 80 });

    // --- 3. PLOT INFORMATION ---
    doc.moveDown(2);
    doc.fontSize(14).font("Helvetica-Bold").text("OFFICIAL AUDIT DOSSIER");
    doc.fontSize(10).font("Helvetica").moveDown();
    doc.text(`Plot ID: ${reportData.plotId}`);
    doc.text(`Owner: ${reportData.ownerName}`);
    doc.text(`Region: ${reportData.areaName}`);
    doc.text(`Status: ${reportData.status}`, {
      stroke: reportData.status === "ENCROACHED",
    });
    doc.text(`Deviation: ${reportData.deviation}%`);
    doc.text(`Generated: ${new Date().toLocaleString()}`);

    // --- 4. SIDE-BY-SIDE VISUALS (The "Bamboozle") ---
    doc.moveDown(2);
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("SATELLITE EVIDENCE VS. MASTER PLAN");

    try {
      // Fetch Satellite Image from Cloudinary
      const response = await axios.get(reportData.satImageUrl, {
        responseType: "arraybuffer",
      });
      const satImageBuffer = Buffer.from(response.data);

      // Draw Side-by-Side
      doc.image(satImageBuffer, 50, 300, { width: 240, height: 180 });
      doc.rect(50, 300, 240, 180).stroke(); // Border
      doc.text("CURRENT SURVEILLANCE", 50, 485, {
        width: 240,
        align: "center",
      });

      // Placeholder for Planned (Using same image for demo, or dummy)
      doc.image(satImageBuffer, 305, 300, { width: 240, height: 180 });
      doc.rect(305, 300, 240, 180).stroke();
      doc.text("APPROVED MASTER PLAN", 305, 485, {
        width: 240,
        align: "center",
      });
    } catch (err) {
      doc.text("[Image Evidence Unavailable]", 50, 350);
    }

    // --- 5. DIGITAL SIGNATURE ---
    // doc.moveDown(10);
    // doc
    //   .fontSize(10)
    //   .font("Helvetica-Oblique")
    //   .text("Electronically verified by CSIDC Monitoring Cell.");

    // // Path to a signature image (Make sure to put a 'sig.png' in your assets or uploads)
    // const sigPath = path.join(process.cwd(), "assets", "signature.png");
    // if (fs.existsSync(sigPath)) {
    //   doc.image(sigPath, 50, 680, { width: 100 });
    // }
    // doc.text("Authorized Signatory", 50, 750);

    // --- 5. DIGITAL SIGNATURE (Cloudinary Version) ---
    doc.moveDown(10);
    doc
      .fontSize(10)
      .font("Helvetica-Oblique")
      .text("Electronically verified by CSIDC Monitoring Cell.");

    try {
      // Replace this URL with your actual Cloudinary Signature URL
      const sigUrl =
        "https://res.cloudinary.com/dtcde3gnt/image/upload/v1770899414/download_dnpiv6.png";

      // Fetch the signature image
      const sigResponse = await axios.get(sigUrl, {
        responseType: "arraybuffer",
      });
      const sigBuffer = Buffer.from(sigResponse.data);

      // Place the signature on the PDF
      doc.image(sigBuffer, 50, 680, { width: 100 });
    } catch (err) {
      console.error("Signature overlay failed:", err.message);
      doc.text("[Signature Image Unavailable]", 50, 700);
    }

    doc.text("Authorized Signatory", 50, 750);

    doc.end();

    stream.on("finish", async () => {
      try {
        await sendEmail(recipientEmail, filePath, fileName, reportData);
        resolve(fileName);
      } catch (err) {
        reject(err);
      }
    });
  });
};

const sendEmail = async (to, filePath, fileName, data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"CSIDC Geo-Audit" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: `AUDIT REPORT: ${data.plotId} - ${data.status}`,
    text: `Respected Authority,\n\nPlease find the attached official audit report for Plot ${data.plotId}.\nStatus: ${data.status}\n\nThis is an automated system-generated report.`,
    attachments: [{ filename: fileName, path: filePath }],
  });
};
