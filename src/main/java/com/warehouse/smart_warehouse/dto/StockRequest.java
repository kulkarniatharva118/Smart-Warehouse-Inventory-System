package com.warehouse.smart_warehouse.dto;

import jakarta.validation.constraints.NotNull;

public class StockRequest {
    @NotNull(message = "Quantity change cannot be null")
    private Integer quantity;

    public StockRequest(){}

    public StockRequest(Integer quantity){
        this.quantity=quantity;
    }
    public Integer getQuantity(){
        return quantity;
    }
    public void setQuantity(Integer quantity){
        this.quantity=quantity;
    }
}