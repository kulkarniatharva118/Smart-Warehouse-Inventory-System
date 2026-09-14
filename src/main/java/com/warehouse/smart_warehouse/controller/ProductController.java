package com.warehouse.smart_warehouse.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.warehouse.smart_warehouse.dto.CategorySummary;
import com.warehouse.smart_warehouse.dto.InventorySummary;
import com.warehouse.smart_warehouse.dto.StockRequest;
import com.warehouse.smart_warehouse.model.Product;
import com.warehouse.smart_warehouse.service.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService=productService;
    }
    @PostMapping
    public Product addProduct(@Valid @RequestBody Product product) {
        return productService.addProduct(product);
    }
    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String query) {
        return productService.searchProducts(query);
    }
    @GetMapping("/search/sku")
    public List<Product> searchProductsBySku(@RequestParam String sku) {
        return productService.searchProductsBySku(sku);
    }
    @GetMapping("/low-stock")
    public List<Product> getLowStockProducts(
            @RequestParam int threshold) {

        return productService.getLowStockProducts(threshold);
    }
    @GetMapping("/category")
    public List<Product> getProductsByCategory(
            @RequestParam String category) {

        return productService.getProductsByCategory(category);
    }
    @GetMapping("/summary")
    public ResponseEntity<InventorySummary> getInventorySummary() {

        InventorySummary summary =
                productService.getInventorySummary();

        return ResponseEntity.ok(summary);
    }
    @GetMapping("/category-summary")
    public ResponseEntity<List<CategorySummary>> getCategorySummary() {

        List<CategorySummary> summary =
                productService.getCategorySummary();

        return ResponseEntity.ok(summary);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(product -> ResponseEntity.ok(product))
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        if (page < 0) {
            return ResponseEntity.badRequest().build();
        }

        if (size < 1 || size > 100) {
            return ResponseEntity.badRequest().build();
        }

        Page<Product> products = productService.getAllProducts(
                page,
                size,
                sortBy,
                direction
        );

        return ResponseEntity.ok(products);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody Product updatedProduct) {

        return productService.updateProduct(id, updatedProduct)
                .map(product -> ResponseEntity.ok(product))
                .orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(
            @PathVariable Long id) {

        boolean deleted = productService.deleteProduct(id);

        Map<String, String> response = new HashMap<>();

        if (deleted) {
            response.put("message", "Product deleted successfully");
            return ResponseEntity.ok(response);
        }

        response.put("error", "Product not found");

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }
    @PatchMapping("/{id}/stock")
    public ResponseEntity<Product> updateStock(
            @PathVariable Long id,
            @Valid @RequestBody StockRequest stockRequest) {

        return productService.updateStock(
                        id,
                        stockRequest.getQuantity()
                )
                .map(product -> ResponseEntity.ok(product))
                .orElse(ResponseEntity.notFound().build());
    }

}