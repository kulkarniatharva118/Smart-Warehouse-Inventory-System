# Smart Warehouse Inventory API

A Spring Boot REST API for managing warehouse products and inventory.

## Features

- Create products
- View all products
- View product by ID
- Update product
- Delete product
- Search products by name or SKU
- Prevent duplicate SKUs
- Update stock quantity
- Find low-stock products
- Filter products by category
- Pagination and sorting
- Inventory summary
- Category-wise statistics
- Input validation
- Global exception handling
- Swagger/OpenAPI documentation
- CORS configuration

## Technologies Used

- Java 25
- Spring Boot
- Spring Web
- Spring Data JPA
- PostgreSQL
- Maven
- Swagger/OpenAPI
- Hibernate Validator

## Database Configuration

Update the database settings in:

```text
src/main/resources/application.properties

spring.datasource.url=jdbc:postgresql://localhost:5432/smart_warehouse
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

server.port=8080