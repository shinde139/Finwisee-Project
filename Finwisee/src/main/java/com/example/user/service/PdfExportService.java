package com.example.user.service;

import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.io.font.constants.StandardFonts;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.user.dto.TransactionResponseDTO;
import com.example.user.repository.ExpenseRepository;
import com.example.user.repository.IncomeRepository;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PdfExportService {

    private static final Logger logger = LoggerFactory.getLogger(PdfExportService.class);

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    public byte[] generateTransactionPdf(Integer userId) throws Exception {
        logger.info("=== GENERATING PDF FOR USER ID: {} ===", userId);
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc, PageSize.A4);
        document.setMargins(50, 50, 50, 50);

        // Colors
        Color primaryColor = new DeviceRgb(7, 11, 40);
        Color whiteColor = new DeviceRgb(255, 255, 255);
        Color greenColor = new DeviceRgb(0, 200, 100);
        Color redColor = new DeviceRgb(255, 50, 50);
        Color grayColor = new DeviceRgb(150, 150, 150);
        Color blueColor = new DeviceRgb(0, 150, 255);

        // Fonts
        PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
        PdfFont normalFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);

        // ============ HEADER ============
        document.add(new Paragraph("Transaction History")
                .setFont(boldFont)
                .setFontSize(24)
                .setFontColor(primaryColor)
                .setTextAlignment(TextAlignment.CENTER));

        document.add(new Paragraph("Complete record of all your expenses with running balance")
                .setFont(normalFont)
                .setFontSize(12)
                .setFontColor(grayColor)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20));

        // ============ USER INFO ============
        document.add(new Paragraph("User: John Doe")
                .setFont(normalFont)
                .setFontSize(10)
                .setFontColor(grayColor)
                .setTextAlignment(TextAlignment.RIGHT)
                .setMarginBottom(5));

        String currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy"));
        document.add(new Paragraph("Generated on: " + currentDate)
                .setFont(normalFont)
                .setFontSize(10)
                .setFontColor(grayColor)
                .setTextAlignment(TextAlignment.RIGHT)
                .setMarginBottom(20));

        // ============ SUMMARY CARDS (ONLY) ============
        Double totalIncome = incomeRepository.getTotalIncome(userId);
        if (totalIncome == null) totalIncome = 0.0;
        
        Double totalExpense = expenseRepository.getTotalExpense(userId);
        if (totalExpense == null) totalExpense = 0.0;
        
        Double balance = totalIncome - totalExpense;
        
        List<TransactionResponseDTO> transactions = transactionService.getTransactions(userId);
        int totalTransactions = 0;
        if (transactions != null) {
            // Count only expenses
            totalTransactions = (int) transactions.stream()
                    .filter(t -> "EXPENSE".equals(t.getTransactionType()))
                    .count();
        }

        // Summary Table - 4 columns (NO TRANSACTION TABLE)
        float[] summaryWidths = {25, 25, 25, 25};
        Table summaryTable = new Table(UnitValue.createPercentArray(summaryWidths));
        summaryTable.setWidth(UnitValue.createPercentValue(100));
        summaryTable.setMarginBottom(20);

        // Available Balance
        Cell balanceCell = new Cell()
                .add(new Paragraph("Available Balance")
                        .setFont(normalFont)
                        .setFontSize(10)
                        .setFontColor(grayColor))
                .add(new Paragraph(String.format("%.2f", balance))
                        .setFont(boldFont)
                        .setFontSize(18)
                        .setFontColor(greenColor))
                .setBackgroundColor(new DeviceRgb(17, 24, 60))
                .setPadding(12);
        summaryTable.addCell(balanceCell);

        // Total Income
        Cell incomeCell = new Cell()
                .add(new Paragraph("Total Income")
                        .setFont(normalFont)
                        .setFontSize(10)
                        .setFontColor(grayColor))
                .add(new Paragraph(String.format("%.2f", totalIncome))
                        .setFont(boldFont)
                        .setFontSize(18)
                        .setFontColor(blueColor))
                .setBackgroundColor(new DeviceRgb(17, 24, 60))
                .setPadding(12);
        summaryTable.addCell(incomeCell);

        // Total Expenses
        Cell expenseCell = new Cell()
                .add(new Paragraph("Total Expenses")
                        .setFont(normalFont)
                        .setFontSize(10)
                        .setFontColor(grayColor))
                .add(new Paragraph(String.format("%.2f", totalExpense))
                        .setFont(boldFont)
                        .setFontSize(18)
                        .setFontColor(redColor))
                .setBackgroundColor(new DeviceRgb(17, 24, 60))
                .setPadding(12);
        summaryTable.addCell(expenseCell);

        // Total Transactions
        Cell transactionCell = new Cell()
                .add(new Paragraph("Total Transactions")
                        .setFont(normalFont)
                        .setFontSize(10)
                        .setFontColor(grayColor))
                .add(new Paragraph(String.valueOf(totalTransactions))
                        .setFont(boldFont)
                        .setFontSize(18)
                        .setFontColor(whiteColor))
                .setBackgroundColor(new DeviceRgb(17, 24, 60))
                .setPadding(12);
        summaryTable.addCell(transactionCell);

        document.add(summaryTable);

        // ============ FOOTER ============
        document.add(new Paragraph("FIN WISEE - Smart Finance Tracker")
                .setFont(normalFont)
                .setFontSize(8)
                .setFontColor(grayColor)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20));

        document.close();
        logger.info("PDF generated successfully for user {}", userId);

        return outputStream.toByteArray();
    }
}