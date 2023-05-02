import React from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Button } from "@mui/material";

function PdfTable({ data, formatData }) {
  const generatePdf = async () => {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const formattedData = formatData(data);
    const cellWidth = width / 3;
    const cellHeight = 25;
    const textHeight = 14;
    let x = 50;
    let y = height - 50;

    const underlineWidth = width * 0.8;
    const underlineHeight = 1;

    formattedData.forEach(({ label, value }) => {
      if (value) {
        const labelLines = [];
        let currentLine = "";
        for (let i = 0; i < label.length; i++) {
          if (currentLine.length >= 30) {
            labelLines.push(currentLine);
            currentLine = "";
          }
          currentLine += label.charAt(i);
        }
        labelLines.push(currentLine);

        let lineY = y;
        labelLines.forEach((line) => {
          page.drawText(line, {
            x,
            y: lineY,
            size: textHeight,
            font: timesRomanFont,
          });
          lineY -= textHeight + 2;
        });

        page.drawText(value, {
          x: x + cellWidth,
          y,
          size: textHeight,
          font: timesRomanFont,
        });

        const underlineY = lineY + textHeight - 5;
        page.drawRectangle({
          x,
          y: underlineY,
          width: underlineWidth,
          height: underlineHeight,
          color: rgb(0, 0, 0),
          fillOpacity: 1,
        });

        const labelHeight = labelLines.length * (textHeight + 2);
        y -= Math.max(labelHeight, cellHeight) + 20;
      }
    });

    const pdfBytes = await pdfDoc.save();
    const pdfUrl = URL.createObjectURL(
      new Blob([pdfBytes], { type: "application/pdf" })
    );
    window.open(pdfUrl);
  };
  return <Button onClick={generatePdf}>Generate PDF</Button>;
}

export default PdfTable;
