package com.warehouse.smart_warehouse.dto;

public class CategorySummary {

    private String category;
    private long productCount;
    private long totalQuantity;

    public CategorySummary() {
    }

    public CategorySummary(
            String category,
            long productCount,
            long totalQuantity) {

        this.category = category;
        this.productCount = productCount;
        this.totalQuantity = totalQuantity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public long getProductCount() {
        return productCount;
    }

    public void setProductCount(long productCount) {
        this.productCount = productCount;
    }

    public long getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(long totalQuantity) {
        this.totalQuantity = totalQuantity;
    }
}