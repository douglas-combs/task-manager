package com.taskmanager.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(TaskNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleTaskNotFoundException(TaskNotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                ex.getMessage(),
                HttpStatus.NOT_FOUND.value(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ValidationErrorResponse errorResponse = new ValidationErrorResponse(
                "Validation failed",
                HttpStatus.BAD_REQUEST.value(),
                LocalDateTime.now(),
                errors
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "An unexpected error occurred",
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    public static class ErrorResponse {
        private final String message;
        private final int status;
        private final LocalDateTime timestamp;

        public ErrorResponse(String message, int status, LocalDateTime timestamp) {
            this.message = message;
            this.status = status;
            this.timestamp = timestamp;
        }

        public String getMessage() {
            return message;
        }

        public int getStatus() {
            return status;
        }

        public LocalDateTime getTimestamp() {
            return timestamp;
        }
    }

    public static class ValidationErrorResponse {
        private final String message;
        private final int status;
        private final LocalDateTime timestamp;
        private final Map<String, String> errors;

        public ValidationErrorResponse(String message, int status, LocalDateTime timestamp, Map<String, String> errors) {
            this.message = message;
            this.status = status;
            this.timestamp = timestamp;
            this.errors = errors;
        }

        public String getMessage() {
            return message;
        }

        public int getStatus() {
            return status;
        }

        public LocalDateTime getTimestamp() {
            return timestamp;
        }

        public Map<String, String> getErrors() {
            return errors;
        }
    }
} 