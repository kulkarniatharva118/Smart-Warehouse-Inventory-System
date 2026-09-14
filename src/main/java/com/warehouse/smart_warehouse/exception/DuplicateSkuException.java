package com.warehouse.smart_warehouse.exception;

public class DuplicateSkuException extends RuntimeException {

    public DuplicateSkuException(String message) {
        super(message);
    }
}