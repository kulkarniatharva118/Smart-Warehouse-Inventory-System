package com.warehouse.smart_warehouse.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI warehouseOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Smart Warehouse Inventory API")
                        .version("1.0.0")
                        .description(
                                "REST API for managing warehouse products, stock, "
                                + "categories, inventory summaries, and low-stock alerts."
                        ));
    }
}