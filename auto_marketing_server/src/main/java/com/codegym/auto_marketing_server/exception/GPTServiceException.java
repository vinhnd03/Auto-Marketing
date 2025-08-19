package com.codegym.auto_marketing_server.exception;

/**
 * Custom exception for GPT Service operations
 */
public class GPTServiceException extends RuntimeException {
    
    public GPTServiceException(String message) {
        super(message);
    }
    
    public GPTServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
