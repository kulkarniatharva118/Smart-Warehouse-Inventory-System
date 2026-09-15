# Smart Warehouse – Inventory Management System

A full-stack web-based inventory management system for managing warehouse
products, monitoring stock levels, searching inventory, tracking low-stock
items, and viewing inventory statistics through a centralized dashboard.

The system uses a JavaScript frontend, a Spring Boot REST API, and PostgreSQL
for persistent data storage. It also includes validation, global exception
handling, pagination, sorting, inventory analytics, Swagger/OpenAPI
documentation, and cloud deployment.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Objectives](#objectives)
- [Target Users](#target-users)
- [Scope](#scope)
- [Key Features](#key-features)
- [Functional Modules](#functional-modules)
- [Non-Functional Requirements](#non-functional-requirements)
- [System Architecture](#system-architecture)
- [Application Workflow](#application-workflow)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Frontend](#frontend)
- [Backend](#backend)
- [Database Design](#database-design)
- [REST API](#rest-api)
- [Inventory Management Logic](#inventory-management-logic)
- [Search, Filtering, Pagination and Sorting](#search-filtering-pagination-and-sorting)
- [Inventory Analytics](#inventory-analytics)
- [Validation and Error Handling](#validation-and-error-handling)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Installation and Local Setup](#installation-and-local-setup)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Security Considerations](#security-considerations)
- [Screenshots](#screenshots)
- [Limitations](#limitations)
- [Future Enhancements](#future-enhancements)
- [Conclusion](#conclusion)
- [Project Status](#project-status)
- [Contributors](#contributors)
- [License](#license)

---

# Project Overview

Smart Warehouse is a full-stack Inventory Management System developed to
provide a centralized and user-friendly platform for warehouse inventory
operations.

The application allows users to:

- View all products
- Add new products
- Update product information
- Delete products
- Search products by name or SKU
- Filter products by category
- Find low-stock products
- Update stock quantities
- Increase and decrease stock
- View inventory statistics
- View category-wise inventory statistics
- Sort and paginate product records
- Export warehouse product data as CSV
- Access REST API documentation through Swagger/OpenAPI

The application follows a client-server architecture in which the frontend
communicates with a Spring Boot REST API. The backend uses Spring Data JPA and
Hibernate for persistence and PostgreSQL as the relational database.

---

# Problem Statement

Warehouse inventory management requires maintaining accurate information about
products, stock quantities, categories, pricing, and availability.

When inventory is managed manually or through disconnected systems, several
problems can arise:

- Difficulty maintaining accurate inventory records
- Time-consuming product updates
- Difficulty identifying low-stock items
- Inefficient searching of product records
- Increased possibility of data-entry errors
- Lack of centralized inventory visibility
- Difficulty obtaining useful inventory statistics

Smart Warehouse addresses these problems by providing a centralized digital
inventory management system with CRUD operations, stock management, search,
filtering, analytics, validation, and persistent database storage.

---

# Objectives

The primary objectives of the project are:

1. Develop a centralized warehouse inventory management system.
2. Implement complete CRUD operations for products.
3. Provide efficient stock quantity management.
4. Provide search functionality for inventory records.
5. Support category-based filtering.
6. Detect low-stock products.
7. Provide inventory summary statistics.
8. Provide category-wise inventory statistics.
9. Implement pagination and sorting for product data.
10. Store inventory information in PostgreSQL.
11. Develop RESTful APIs using Spring Boot.
12. Implement validation and global exception handling.
13. Provide API documentation using Swagger/OpenAPI.
14. Deploy the application for online access.
15. Demonstrate practical full-stack software engineering concepts.

---

# Target Users

The intended users include:

- Warehouse operators
- Inventory managers
- Store administrators
- Small business owners
- Users responsible for maintaining product inventory

---

# Scope

## Included in the Current System

The current version includes:

- Product creation
- Product retrieval
- Product update
- Product deletion
- Product search by name
- Product search by SKU
- Category filtering
- Low-stock filtering
- Stock quantity updates
- Inventory summaries
- Category-wise summaries
- Pagination
- Sorting
- CSV export
- Input validation
- Global exception handling
- REST API documentation
- PostgreSQL persistence
- Cloud deployment

## Outside the Current Scope

The current version does not implement:

- User authentication
- Login and registration
- Role-based access control
- CAPTCHA
- Multiple warehouse locations
- Supplier management
- Purchase-order management
- Shipment tracking
- Barcode or QR-code scanning
- Advanced demand forecasting
- Enterprise audit logging

These features are considered future enhancements.

---

# Key Features

## Product Management

The system supports complete product CRUD operations:

- Create product
- View product
- Update product
- Delete product

A product contains information such as:

- Product ID
- Name
- SKU
- Category
- Description
- Price
- Quantity

---

## Stock Management

The system provides dedicated stock-management functionality.

Users can:

- Set the exact stock quantity
- Increase stock
- Decrease stock
- View the current quantity
- Prevent negative stock values

---

## Search

Products can be searched by:

- Product name
- SKU

Search operations are handled through backend API endpoints.

---

## Category Filtering

Products can be filtered using their category.

This allows users to view inventory belonging to a particular product category.

---

## Low-Stock Monitoring

The system provides a dedicated low-stock endpoint.

A user can provide a threshold and retrieve products whose quantity is less
than or equal to that threshold.

The dashboard uses a low-stock threshold of 10 units.

---

## Pagination and Sorting

The product listing API supports:

- Page number
- Page size
- Sort field
- Sort direction

The page size is restricted to a safe range of 1 to 100 records.

---

## Inventory Summary

The system calculates:

- Total number of products
- Total quantity of inventory
- Total inventory value
- Number of low-stock products
- Number of categories

---

## Category Summary

The system also provides category-wise statistics including:

- Category name
- Product count
- Total quantity

---

## CSV Export

The frontend provides the ability to export warehouse product data as a CSV
file for external use or reporting.

---

# Functional Modules

## Module 1 – Dashboard and Inventory Monitoring

The dashboard provides an overview of the warehouse state.

It displays inventory statistics and low-stock information to help the user
quickly understand the current inventory situation.

---

## Module 2 – Product Management

This module manages the complete product lifecycle.

Functions:

- Add product
- View products
- View product by ID
- Edit product
- Delete product

---

## Module 3 – Stock Management

This module manages product quantities.

Functions:

- Set stock quantity
- Increase stock
- Decrease stock
- Validate stock quantity
- Prevent negative stock

---

## Module 4 – Search and Filtering

This module allows users to locate relevant inventory records through:

- Name search
- SKU search
- Category filtering
- Low-stock filtering

---

## Module 5 – Inventory Analytics

The analytics module provides:

- Overall inventory summary
- Category-wise inventory summary
- Total inventory value
- Low-stock count
- Product count
- Quantity totals

---

## Module 6 – Data Export

The frontend provides CSV export functionality for warehouse product records.

---

# Non-Functional Requirements

## Performance

The application should efficiently handle normal inventory operations and
return product data within reasonable response times.

## Usability

The user interface should provide clear navigation and understandable
inventory information.

## Reliability

Valid changes to product and stock data should be persisted consistently.

## Maintainability

The project is separated into frontend and backend components, while the
backend uses controller, service, repository, model, DTO, configuration, and
exception packages.

## Security

Database credentials and other environment-specific configuration should not
be stored directly in source control. CORS should be configured for intended
frontend origins.

## Scalability

The REST-based architecture separates presentation, application logic, and
data storage so that the system can be expanded in future versions.

## Error Handling

Invalid input and application errors are handled using validation and a global
exception-handling mechanism.

---

# System Architecture

The application uses a layered client-server architecture.

```text
                     ┌──────────────────────┐
                     │        User          │
                     │ Warehouse Operator   │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │      Frontend        │
                     │   HTML/CSS/JS        │
                     │                      │
                     │ Dashboard            │
                     │ Products             │
                     │ Add Product          │
                     │ Search / Export      │
                     └──────────┬───────────┘
                                │
                              HTTP
                                │
                                ▼
                     ┌──────────────────────┐
                     │     Spring Boot      │
                     │      REST API        │
                     │                      │
                     │ Controller           │
                     │ Service              │
                     │ Repository           │
                     │ DTOs                 │
                     │ Exception Handling   │
                     └──────────┬───────────┘
                                │
                         JPA / Hibernate
                                │
                                ▼
                     ┌──────────────────────┐
                     │     PostgreSQL       │
                     │       Database       │
                     └──────────────────────┘