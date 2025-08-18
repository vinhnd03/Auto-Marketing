package com.codegym.auto_marketing_server.helper;

import com.codegym.auto_marketing_server.dto.CampaignDTO;
import com.codegym.auto_marketing_server.enums.CampaignStatus;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ExcelHelper {

    public static class ExcelValidationException extends RuntimeException {
        public ExcelValidationException(String message) {
            super(message);
        }
    }
    public static final String TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    public static boolean isExcelFile(MultipartFile file) {
        return TYPE.equals(file.getContentType());
    }

    public static List<CampaignDTO> excelToCampaigns(InputStream is) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            List<CampaignDTO> campaigns = new ArrayList<>();
            List<String> errors = new ArrayList<>();

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Skip header

                try {
                    CampaignDTO dto = new CampaignDTO();
                    validateAndParseRow(row, dto);
                    campaigns.add(dto);
                } catch (ExcelValidationException e) {
                    errors.add("Row " + (row.getRowNum() + 1) + ": " + e.getMessage());
                }
            }

            if (!errors.isEmpty()) {
                throw new ExcelValidationException(String.join("\n", errors));
            }

            return campaigns;
        }
    }

    private static void validateAndParseRow(Row row, CampaignDTO dto) throws ExcelValidationException {
        // Validate và parse từng cell
        dto.setName(getStringValue(row.getCell(0), "Name"));
        dto.setDescription(getStringValue(row.getCell(1), "Description"));
        dto.setStartDate(getDateValue(row.getCell(2), "Start Date"));
        dto.setEndDate(getDateValue(row.getCell(3), "End Date"));
        dto.setStatus(getStatusValue(row.getCell(4)));

        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new ExcelValidationException("End date must be after start date");
        }
    }

    private static String getStringValue(Cell cell, String fieldName) throws ExcelValidationException {
        if (cell == null || cell.getCellType() == CellType.BLANK) {
            throw new ExcelValidationException(fieldName + " is required");
        }
        return cell.getStringCellValue();
    }

    private static LocalDate getDateValue(Cell cell, String fieldName) throws ExcelValidationException {
        if (cell == null) {
            throw new ExcelValidationException(fieldName + " is required");
        }
        try {
            return cell.getLocalDateTimeCellValue().toLocalDate();
        } catch (Exception e) {
            throw new ExcelValidationException(fieldName + " must be a valid date");
        }
    }

    private static CampaignStatus getStatusValue(Cell cell) throws ExcelValidationException {
        String status = getStringValue(cell, "Status");
        try {
            return CampaignStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ExcelValidationException("Invalid status value: " + status);
        }
    }
}
