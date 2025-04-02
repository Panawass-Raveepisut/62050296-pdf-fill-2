const express = require('express');
const { PDFDocument } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3002;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ฟังก์ชันแทรกช่องว่าง
function formatWithSpaces(input) {
  return input.split('').join('    '); // แทรกช่องว่างระหว่างแต่ละตัวอักษร
}

// Main form selection page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve each form-filling HTML file
app.get('/fill-re01', (req, res) => res.sendFile(path.join(__dirname, 'fill-re01.html')));
app.get('/fill-re05', (req, res) => res.sendFile(path.join(__dirname, 'fill-re05.html')));

// PDF generation route for RE01 (example)
app.post('/submit-re01', async (req, res) => {
  const { date, subject, to, fullname, faculty, studentId, major, phone, minor, address, email, reason, signature } = req.body;

  try {
    const pdfPath = path.join(__dirname, 'pdfforms', 'RE01.pdf');
    const fontPath = 'C:\\Users\\panaw\\AppData\\Local\\Microsoft\\Windows\\Fonts\\THSarabunNew.ttf';

    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = fs.readFileSync(fontPath);
    const customFont = await pdfDoc.embedFont(fontBytes);

    const page = pdfDoc.getPages()[0];
    const fontSize = 12;

    page.drawText(date, { x: 100, y: 700, size: fontSize, font: customFont });
    page.drawText(subject, { x: 100, y: 670, size: fontSize, font: customFont });
    page.drawText(to, { x: 100, y: 640, size: fontSize, font: customFont });
    page.drawText(fullname, { x: 100, y: 610, size: fontSize, font: customFont });
    page.drawText(faculty, { x: 100, y: 580, size: fontSize, font: customFont });
    page.drawText(formatWithSpaces(studentId), { x: 100, y: 550, size: fontSize, font: customFont });
    page.drawText(major, { x: 100, y: 520, size: fontSize, font: customFont });
    page.drawText(phone, { x: 100, y: 490, size: fontSize, font: customFont });
    page.drawText(minor, { x: 100, y: 460, size: fontSize, font: customFont });
    page.drawText(address, { x: 100, y: 430, size: fontSize, font: customFont });
    page.drawText(email, { x: 100, y: 400, size: fontSize, font: customFont });
    page.drawText(reason, { x: 100, y: 370, size: fontSize, font: customFont });

    const signatureImageBytes = signature.split(',')[1];
    const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
    const signatureDims = signatureImage.scale(0.5);
    page.drawImage(signatureImage, { x: 100, y: 250, width: signatureDims.width, height: signatureDims.height });

    const pdfBytes = await pdfDoc.save();
    const outputPath = path.join(__dirname, 'filled_RE01.pdf');
    fs.writeFileSync(outputPath, pdfBytes);

    res.send('Form submitted successfully! <a href="/filled_RE01.pdf">Download PDF</a>');
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send(`Failed to generate PDF: ${error.message}`);
  }
});

// PDF generation route for RE05 (already implemented)
app.post('/submit-re05', async (req, res) => {
  const { date, name, studentId, faculty, phone, major, reason, courseCode, section, courseName, credits, instructor, studentSignature } = req.body;

  try {
    const pdfPath = path.join(__dirname, 'pdfforms', 'RE05.pdf');
    const fontPath = 'C:\\Users\\panaw\\AppData\\Local\\Microsoft\\Windows\\Fonts\\THSarabunNew.ttf';

    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = fs.readFileSync(fontPath);
    const customFont = await pdfDoc.embedFont(fontBytes);

    const page = pdfDoc.getPages()[0];
    const fontSize = 12;

    page.drawText(date, { x: 450, y: 745, size: fontSize, font: customFont });
    page.drawText(name, { x: 100, y: 715, size: fontSize, font: customFont });
    page.drawText(formatWithSpaces(studentId), { x: 450, y: 715, size: fontSize, font: customFont });
    page.drawText(faculty, { x: 100, y: 695, size: fontSize, font: customFont });
    page.drawText(phone, { x: 115, y: 678, size: fontSize, font: customFont });
    page.drawText(major, { x: 380, y: 695, size: fontSize, font: customFont });
    page.drawText(reason, { x: 50, y: 640, size: fontSize, font: customFont });
    page.drawText(formatWithSpaces(courseCode), { x: 55, y: 510, size: fontSize, font: customFont });
    page.drawText(section, { x: 180, y: 510, size: fontSize, font: customFont });
    page.drawText(courseName, { x: 220, y: 510, size: fontSize, font: customFont });
    page.drawText(credits, { x: 375, y: 510, size: fontSize, font: customFont });
    page.drawText(instructor, { x: 400, y: 510, size: fontSize, font: customFont });

    const signatureImageBytes = studentSignature.split(',')[1];
    const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
    const signatureDims = signatureImage.scale(0.5);
    page.drawImage(signatureImage, { x: 420, y: 295, width: signatureDims.width, height: signatureDims.height });

    const pdfBytes = await pdfDoc.save();
    const outputPath = path.join(__dirname, 'filled_RE05.pdf');
    fs.writeFileSync(outputPath, pdfBytes);

    res.send('Form submitted successfully! <a href="/filled_RE05.pdf">Download PDF</a>');
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send(`Failed to generate PDF: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
