package com.codegym.auto_marketing_server.exception;

import com.codegym.auto_marketing_server.helper.ExcelHelper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler{
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<String> handleNullPointer(NullPointerException ex){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Null value" + ex.getMessage());
    }

    @ExceptionHandler(ExcelHelper.ExcelValidationException.class)
    public ResponseEntity<String> handleExcelValidationException(ExcelHelper.ExcelValidationException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }
}
