package com.warehouse.smart_warehouse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.warehouse.smart_warehouse.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findBySkuContainingIgnoreCase(String sku);
    List<Product> findByNameContainingIgnoreCaseOrSkuContainingIgnoreCase(
        String name,
        String sku
    );
    boolean existsBySku(String sku);
    boolean existsBySkuAndIdNot(String sku, Long id);
    List<Product> findByQuantityLessThanEqual(int threshold);
    List<Product> findByCategoryIgnoreCase(String category);
}
