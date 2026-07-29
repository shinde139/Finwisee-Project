package com.example.user.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.user.dto.CategoryExpenseDTO;
import com.example.user.dto.DashboardResponse;
import com.example.user.dto.MonthlyExpenseDTO;

@Service
public class ReportService {

    @Autowired
    private DashboardService dashboardService;

    public byte[] generateExcel(Integer userId) throws IOException {

        DashboardResponse dashboard =
                dashboardService.getDashboard(userId);

        List<CategoryExpenseDTO> categories =
                dashboardService.getExpenseByCategory(userId);

        List<MonthlyExpenseDTO> monthly =
                dashboardService.getMonthlyExpense(userId);

        Workbook workbook = new XSSFWorkbook();

        createSummarySheet(workbook, dashboard);

        createCategorySheet(workbook, categories);

        createMonthlySheet(workbook, monthly);

        ByteArrayOutputStream out =
                new ByteArrayOutputStream();

        workbook.write(out);

        workbook.close();

        return out.toByteArray();

    }

    private void createSummarySheet(
            Workbook workbook,
            DashboardResponse dashboard) {

        Sheet sheet =
                workbook.createSheet("Summary");

        int rowNum = 0;

        Row title = sheet.createRow(rowNum++);
        title.createCell(0)
                .setCellValue("FINWISE REPORT");

        rowNum++;

        Row header = sheet.createRow(rowNum++);

        header.createCell(0).setCellValue("Field");
        header.createCell(1).setCellValue("Amount");

        Row income = sheet.createRow(rowNum++);
        income.createCell(0).setCellValue("Total Income");
        income.createCell(1)
                .setCellValue(dashboard.getTotalIncome());

        Row expense = sheet.createRow(rowNum++);
        expense.createCell(0).setCellValue("Total Expense");
        expense.createCell(1)
                .setCellValue(dashboard.getTotalExpense());

        Row saving = sheet.createRow(rowNum++);
        saving.createCell(0).setCellValue("Total Saving");
        saving.createCell(1)
                .setCellValue(dashboard.getTotalSaving());

        Row budget = sheet.createRow(rowNum++);
        budget.createCell(0).setCellValue("Total Budget");
        budget.createCell(1)
                .setCellValue(dashboard.getTotalBudget());

        Row balance = sheet.createRow(rowNum++);
        balance.createCell(0).setCellValue("Balance");
        balance.createCell(1)
                .setCellValue(dashboard.getBalance());

        sheet.autoSizeColumn(0);
        sheet.autoSizeColumn(1);

    }

    private void createCategorySheet(
            Workbook workbook,
            List<CategoryExpenseDTO> categories) {

        Sheet sheet =
                workbook.createSheet("Expense By Category");

        int row = 0;

        Row header = sheet.createRow(row++);

        header.createCell(0).setCellValue("Category");
        header.createCell(1).setCellValue("Amount");

        for (CategoryExpenseDTO dto : categories) {

            Row r = sheet.createRow(row++);

            r.createCell(0)
                    .setCellValue(dto.getCategory());

            r.createCell(1)
                    .setCellValue(dto.getTotal());

        }

        sheet.autoSizeColumn(0);
        sheet.autoSizeColumn(1);

    }

    private void createMonthlySheet(
            Workbook workbook,
            List<MonthlyExpenseDTO> monthly) {

        Sheet sheet =
                workbook.createSheet("Monthly Expense");

        int row = 0;

        Row header = sheet.createRow(row++);

        header.createCell(0).setCellValue("Month");
        header.createCell(1).setCellValue("Expense");

        for (MonthlyExpenseDTO dto : monthly) {

            Row r = sheet.createRow(row++);

            r.createCell(0)
                    .setCellValue(dto.getMonth());

            r.createCell(1)
                    .setCellValue(dto.getTotal());

        }

        sheet.autoSizeColumn(0);
        sheet.autoSizeColumn(1);

    }

}