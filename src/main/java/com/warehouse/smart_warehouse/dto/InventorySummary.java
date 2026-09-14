package com.warehouse.smart_warehouse.dto;

public class InventorySummary {

    private long totalProducts;
    private long totalQuantity;
    private double totalInventoryValue;
    private long lowStockProducts;
    private long totalCategories;

    public InventorySummary() {
    }

    public InventorySummary(
            long totalProducts,
            long totalQuantity,
            double totalInventoryValue,
            long lowStockProducts,
            long totalCategories) {

        this.totalProducts = totalProducts;
        this.totalQuantity = totalQuantity;
        this.totalInventoryValue = totalInventoryValue;
        this.lowStockProducts = lowStockProducts;
        this.totalCategories = totalCategories;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(long totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public double getTotalInventoryValue() {
        return totalInventoryValue;
    }

    public void setTotalInventoryValue(double totalInventoryValue) {
        this.totalInventoryValue = totalInventoryValue;
    }

    public long getLowStockProducts() {
        return lowStockProducts;
    }

    public void setLowStockProducts(long lowStockProducts) {
        this.lowStockProducts = lowStockProducts;
    }

    public long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(long totalCategories) {
        this.totalCategories = totalCategories;
    }
}