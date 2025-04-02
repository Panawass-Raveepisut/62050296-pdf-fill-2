const express = require('express');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// เส้นทางสำหรับหน้า fill.html
app.get('/fill', (req, res) => {
    res.sendFile(path.join(__dirname, 'fill.html')); // เปลี่ยนให้เป็น path ที่ถูกต้องของ fill.html
});

// เส้นทางสำหรับการส่งข้อมูล
app.post('/submit', async (req, res) => {
    const {
        date,
        subject,
        to,
        name,
        faculty,
        studentId,
        major,
        phone,
        minor,
        address,
        email,
        reason,
    } = req.body;

    const pdfPath = path.join(__dirname, 'pdf-lib', 'RE01.pdf'); // เปลี่ยนให้เป็น path ที่ถูกต้องของ RE01.pdf
    const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfPath));
    const page = pdfDoc.getPages()[0];

    // โหลดฟอนต์ที่รองรับภาษาไทย
    const fontPath = path.join(__dirname, 'path/to/your-font.ttf'); // เปลี่ยนให้เป็น path ที่ถูกต้องของฟอนต์
    const customFont = await pdfDoc.embedFont(fs.readFileSync(fontPath));

    // กรอกข้อมูลลงใน PDF โดยใช้ตำแหน่ง x, y ที่กำหนด
    page.drawText(date, { x: 100, y: 700, size: 12, font: customFont, color: rgb(0, 0, 0) });
    page.drawText(subject, { x: 100, y: 670, size: 12, font: customFont, color: rgb(0, 0, 0) });
    page.drawText(to, { x: 100, y: 640, size: 12, font: customFont, color: rgb(0, 0, 0) });
    page.drawText(name, { x: 100, y: 610, size: 12, font: customFont, color: rgb(0, 0, 0) });
    page.drawText(faculty, { x: 100, y: 580, size: 12, font: customFont, color: rgb(0, 0, 0) });
    page.drawText(studentId, { x: 100, y: 550, size: 12, font: customFont, color: rgb(0, 0, 0) });
    page.drawText(major, { x: 100, y: 520, size: 12, font: customFont, color: rgb(0, 0, 0) });
    page.drawText(phone, { x: 100, y: 490, size: 12, font: customFont, color: rgb(0, 0, 0) });
    page.drawText(minor, { x: 100, y: 460, size: 12, font: customFont, color: rgb(0, 0, 0) });
    page.drawText(address, { x: 100, y: 430, size: 12, font: customFont, color: rgb(0, 0, 0) });
    page.drawText(email, { x: 100, y: 400, size: 12, font: customFont, color: rgb(0, 0, 0) });
    page.drawText(reason, { x: 100, y: 370, size: 12, font: customFont, color: rgb(0, 0, 0) });

    // บันทึกไฟล์ PDF ที่กรอกข้อมูลแล้ว
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(path.join(__dirname, 'filled_RE01.pdf'), pdfBytes);

    res.json({ success: true, message: 'PDF generated successfully!' });
});

// เริ่มเซิร์ฟเวอร์
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/fill`);
});
