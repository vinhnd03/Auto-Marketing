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
                if (row.getRowNum() == 0) continue; // skip header

                try {
                    CampaignDTO dto = new CampaignDTO();
                    validateAndParseRow(row, dto);
                    campaigns.add(dto);
                } catch (ExcelValidationException e) {
                    errors.add("Hàng " + (row.getRowNum() + 1) + ": " + e.getMessage());
                }
            }

            if (!errors.isEmpty()) {
                throw new ExcelValidationException(String.join("\n", errors));
            }

            return campaigns;
        }
    }

    private static void validateAndParseRow(Row row, CampaignDTO dto) throws ExcelValidationException {
        List<String> rowErrors = new ArrayList<>();

        for (CampaignColumn column : CampaignColumn.values()) {
            Cell cell = row.getCell(column.getIndex());
            try {
                switch (column.getType()) {
                    case STRING -> {
                        dtoSetString(dto, column, cell);
                    }
                    case NUMERIC -> {
                        if (column == CampaignColumn.START_DATE) {
                            dto.setStartDate(getDateValue(cell, column.getHeader()));
                        } else if (column == CampaignColumn.END_DATE) {
                            dto.setEndDate(getDateValue(cell, column.getHeader()));
                        }
                    }
                    default -> {
                        // ignore other types
                    }
                }
            } catch (ExcelValidationException e) {
                rowErrors.add(e.getMessage());
            }
        }

        // Set default status
        dto.setStatus(CampaignStatus.DRAFT);

        // Validate logic startDate <= endDate
        if (dto.getStartDate() != null && dto.getEndDate() != null) {
            if (dto.getEndDate().isBefore(dto.getStartDate())) {
                rowErrors.add("Ngày kết thúc nên đặt bằng hoặc sau ngày bắt đầu");
            }
        }

        if (!rowErrors.isEmpty()) {
            throw new ExcelValidationException(String.join("; ", rowErrors));
        }
    }

    private static void dtoSetString(CampaignDTO dto, CampaignColumn column, Cell cell) throws ExcelValidationException {
        if (cell == null || cell.getCellType() == CellType.BLANK) {
            throw new ExcelValidationException(column.getHeader() + " không được để trống");
        }
        if (cell.getCellType() != CellType.STRING) {
            throw new ExcelValidationException(column.getHeader() + " phải là chữ");
        }
        String value = cell.getStringCellValue().trim();
        if (column == CampaignColumn.NAME) dto.setName(value);
        else if (column == CampaignColumn.DESCRIPTION) dto.setDescription(value);
    }

    private static LocalDate getDateValue(Cell cell, String fieldName) throws ExcelValidationException {
        if (cell == null) throw new ExcelValidationException(fieldName + " không được để trống");
        if (!DateUtil.isCellDateFormatted(cell)) {
            throw new ExcelValidationException(fieldName + " phải là ngày hợp lệ");
        }
        return cell.getLocalDateTimeCellValue().toLocalDate();
    }

    public enum CampaignColumn {
        NAME(0, "Tên chiến dịch", CellType.STRING),
        DESCRIPTION(1, "Chi tiết", CellType.STRING),
        START_DATE(2, "Ngày bắt đầu", CellType.NUMERIC),
        END_DATE(3, "Ngày kết thúc", CellType.NUMERIC);

        private final int index;
        private final String header;
        private final CellType type;

        CampaignColumn(int index, String header, CellType type) {
            this.index = index;
            this.header = header;
            this.type = type;
        }

        public int getIndex() { return index; }
        public String getHeader() { return header; }
        public CellType getType() { return type; }
    }
}
