package com.warehouse.smart_warehouse.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
public class Product {
    @Id 
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name cannot be blank")
    private String name;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "SKU cannot be blank")
    private String sku;

    private String category;

    private String description;

    @PositiveOrZero(message = "Price must be zero or greater")
    private double price;
    
    @PositiveOrZero(message = "Quantity must be zero or greater")
    private int quantity;
    
    public Product(){
    }

    public Product(String name,String sku,String category, String description,double price,int quantity){
        this.name = name;
        this.sku = sku;
        this.category=category;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
    }

    public String getName(){
        return name;
    }
    public void setName(String name){
        this.name = name;
    }
    public String getSku(){
        return sku;
    }
    public void setSku(String sku){
        this.sku = sku;
    }
    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }
    public String getDescription(){
        return description;
    }
    public void setDescription(String description){
        this.description = description;
    }
    public double  getPrice(){
        return price;
    }
    public void setPrice(double price){
        this.price = price;
    }
    public int getQuantity(){
        return quantity;
    }
    public void setQuantity(int quantity){
        this.quantity = quantity;
    }
    public Long getId(){
        return id;
    }
    public void setId(Long id){
        this.id = id;
    }
}