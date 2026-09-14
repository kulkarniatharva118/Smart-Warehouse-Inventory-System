package com.warehouse.smart_warehouse.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.warehouse.smart_warehouse.dto.CategorySummary;
import com.warehouse.smart_warehouse.dto.InventorySummary;
import com.warehouse.smart_warehouse.exception.DuplicateSkuException;
import com.warehouse.smart_warehouse.model.Product;
import com.warehouse.smart_warehouse.repository.ProductRepository;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    

    public ProductService(ProductRepository productRepository){
    this.productRepository=productRepository;
    }
    public Product addProduct(Product product) {
        if (productRepository.existsBySku(product.getSku())) {
            throw new DuplicateSkuException("SKU already exists");
        }

        return productRepository.save(product);
    }
    public Page<Product> getAllProducts(
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort.Direction sortDirection =
                direction.equalsIgnoreCase("desc")
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortDirection, sortBy)
        );

        return productRepository.findAll(pageable);
    }
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
    public Optional<Product> updateProduct(
            Long id,
            Product updatedProduct) {

        Optional<Product> existingProduct =
                productRepository.findById(id);

        if (existingProduct.isEmpty()) {
            return Optional.empty();
        }

        if (productRepository.existsBySkuAndIdNot(
                updatedProduct.getSku(),
                id)) {

            throw new DuplicateSkuException("SKU already exists");
        }

        Product product = existingProduct.get();

        product.setName(updatedProduct.getName());
        product.setSku(updatedProduct.getSku());
        product.setCategory(updatedProduct.getCategory());
        product.setDescription(updatedProduct.getDescription());
        product.setPrice(updatedProduct.getPrice());
        product.setQuantity(updatedProduct.getQuantity());

        return Optional.of(productRepository.save(product));
    }
    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }

        return false;
    }
    public List<Product> searchProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }
    public List<Product> searchProductsBySku(String sku) {
        return productRepository.findBySkuContainingIgnoreCase(sku);
    }
    public List<Product> searchProducts(String query) {
        return productRepository
                .findByNameContainingIgnoreCaseOrSkuContainingIgnoreCase(
                        query,
                        query
                );
    }
    public Optional<Product> updateStock(Long id, int quantity) {

        Optional<Product> existingProduct =
                productRepository.findById(id);

        if (existingProduct.isPresent()) {

            if (quantity < 0) {
                throw new IllegalArgumentException(
                        "Stock quantity cannot become negative"
                );
            }

            Product product = existingProduct.get();

            product.setQuantity(quantity);

            return Optional.of(productRepository.save(product));
        }

        return Optional.empty();
    }
    public List<Product> getLowStockProducts(int threshold) {
        return productRepository.findByQuantityLessThanEqual(threshold);
    }
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }
    public InventorySummary getInventorySummary() {

    List<Product> products = productRepository.findAll();

    long totalProducts = products.size();

    long totalQuantity = products.stream()
            .mapToLong(Product::getQuantity)
            .sum();

    double totalInventoryValue = products.stream()
            .mapToDouble(product ->
                    product.getPrice() * product.getQuantity())
            .sum();

    long lowStockProducts = products.stream()
            .filter(product -> product.getQuantity() <= 10)
            .count();

    Set<String> categories = new HashSet<>();

    for (Product product : products) {
        if (product.getCategory() != null
                && !product.getCategory().isBlank()) {

            categories.add(product.getCategory().toLowerCase());
        }
    }

    long totalCategories = categories.size();

    return new InventorySummary(
            totalProducts,
            totalQuantity,
            totalInventoryValue,
            lowStockProducts,
            totalCategories
    );
    }
    public List<CategorySummary> getCategorySummary() {

    List<Product> products = productRepository.findAll();

    Map<String, CategorySummary> summaryMap = new LinkedHashMap<>();

    for (Product product : products) {

        String category = product.getCategory();

        if (category == null || category.isBlank()) {
            category = "Uncategorized";
        }

        CategorySummary summary = summaryMap.get(category);

        if (summary == null) {

            summary = new CategorySummary(
                    category,
                    0,
                    0
            );

            summaryMap.put(category, summary);
        }

        summary.setProductCount(
                summary.getProductCount() + 1
        );

        summary.setTotalQuantity(
                summary.getTotalQuantity()
                        + product.getQuantity()
        );
    }

    return new ArrayList<>(summaryMap.values());
}

}