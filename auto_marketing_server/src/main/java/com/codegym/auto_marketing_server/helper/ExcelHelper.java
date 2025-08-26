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

            validateHeader(sheet.getRow(0));

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
    private static void validateHeader(Row headerRow) {
        if (headerRow == null) {
            throw new ExcelValidationException("Không tìm thấy hàng tiêu đề (header) trong file Excel");
        }

        int expectedColumns = CampaignColumn.values().length;
        int actualColumns = headerRow.getLastCellNum();

        if (actualColumns > expectedColumns) {
            throw new ExcelValidationException("File chứa nhiều cột hơn quy định, chỉ được phép có " + expectedColumns + " cột");
        }

        for (CampaignColumn column : CampaignColumn.values()) {
            Cell cell = headerRow.getCell(column.getIndex());
            if (cell == null || cell.getCellType() == CellType.BLANK) {
                throw new ExcelValidationException("Cột tiêu đề '" + column.getHeader() + "' không được để trống");
            }
            String headerValue = cell.getStringCellValue().trim();
            if (!headerValue.equalsIgnoreCase(column.getHeader())) {
                throw new ExcelValidationException("Cột số " + (column.getIndex() + 1) + " phải là '"
                        + column.getHeader() + "', nhưng hiện tại là '" + headerValue + "'");
            }
        }
    }

    private static void validateAndParseRow(Row row, CampaignDTO dto) throws ExcelValidationException {
        List<String> rowErrors = new ArrayList<>();
        int allowedColumns = CampaignColumn.values().length;
        for (int i = allowedColumns; i < row.getLastCellNum(); i++) {
            Cell extraCell = row.getCell(i);
            if (extraCell != null && extraCell.getCellType() != CellType.BLANK) {
                rowErrors.add("Không được nhập dữ liệu ở cột số " + (i + 1) + " (ngoài phạm vi cho phép)");
            }
        }
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
                    }
                }
            } catch (ExcelValidationException e) {
                rowErrors.add(e.getMessage());
            }
        }

        dto.setStatus(CampaignStatus.DRAFT);

        if (dto.getStartDate() != null && dto.getEndDate() != null) {
            if (dto.getEndDate().isBefore(dto.getStartDate())) {
                rowErrors.add("Ngày kết thúc nên đặt bằng hoặc sau ngày bắt đầu");
            }
        }

        if (!rowErrors.isEmpty()) {
            throw new ExcelValidationException(String.join("\n", rowErrors));
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
        if (cell == null || cell.getCellType() == CellType.BLANK) {
            throw new ExcelValidationException(fieldName + " không được để trống");
        }

        // Chỉ chấp nhận cell dạng DATE
        if (cell.getCellType() != CellType.NUMERIC || !DateUtil.isCellDateFormatted(cell)) {
            throw new ExcelValidationException(fieldName + " phải là ngày/tháng/năm hợp lệ (dd/MM/yyyy)");
        }

        try {
            return cell.getLocalDateTimeCellValue().toLocalDate();
        } catch (Exception e) {
            throw new ExcelValidationException(fieldName + " không đúng định dạng ngày (dd/MM/yyyy)");
        }
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
