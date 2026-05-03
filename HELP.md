# 🛍️ Full Stack E-Commerce Application — Help Guide

A complete help reference for setting up, running, and working with this full-stack e-commerce web application built with **Spring Boot 2.7** (Java) on the backend and **React 18 + Vite** on the frontend.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Project Structure](#project-structure)
5. [Backend Setup (Spring Boot)](#backend-setup-spring-boot)
6. [Frontend Setup (React + Vite)](#frontend-setup-react--vite)
7. [REST API Reference](#rest-api-reference)
8. [Application Features](#application-features)
9. [Frontend Pages & Routes](#frontend-pages--routes)
10. [Common Issues & Troubleshooting](#common-issues--troubleshooting)
11. [Useful Commands](#useful-commands)

---

## Project Overview

This is a full-stack e-commerce web application that allows users to browse products, manage a shopping cart, place orders, and manage their account. It also includes admin capabilities such as adding, updating, and deleting products.

---

## Tech Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Backend  | Java 8+, Spring Boot 2.7, Spring Data JPA, H2   |
| Frontend | React 18, Vite 5, Bootstrap 5, Axios            |
| Database | H2 (in-memory, default) / MySQL (optional)      |
| Build    | Maven (backend), npm (frontend)                 |

---

## Prerequisites

Make sure the following are installed before running the project:

- **Java 8+** — [Download](https://adoptium.net/)
- **Maven 3.6+** — [Download](https://maven.apache.org/download.cgi) *(or use the included `mvnw` wrapper)*
- **Node.js 18+ & npm** — [Download](https://nodejs.org/)
- A browser (Chrome, Firefox, Edge, etc.)

> **No MySQL required by default.** The backend uses an embedded H2 in-memory database out of the box.

---

## Project Structure

```
FullStack_E-Commerce_Website_using_Java-main/
├── Backend/                        # Spring Boot REST API
│   ├── src/
│   │   └── main/
│   │       ├── java/com/cart/ecom_proj/
│   │       │   ├── EcomProjApplication.java   # Main entry point
│   │       │   ├── controller/                # REST controllers
│   │       │   │   ├── AuthController.java    # Auth endpoints
│   │       │   │   ├── OrderController.java   # Order endpoints
│   │       │   │   └── ProductController.java # Product endpoints
│   │       │   ├── model/                     # JPA entity classes
│   │       │   ├── repo/                      # Spring Data JPA repos
│   │       │   └── service/                   # Business logic layer
│   │       └── resources/
│   │           └── application.properties     # App configuration
│   ├── pom.xml                                # Maven build config
│   └── mvnw / mvnw.cmd                        # Maven wrapper scripts
│
├── Frontend/                       # React + Vite frontend
│   ├── src/
│   │   ├── components/             # All page components
│   │   │   ├── Home.jsx            # Product listing page
│   │   │   ├── Product.jsx         # Product detail page
│   │   │   ├── Cart.jsx            # Shopping cart
│   │   │   ├── CheckoutPopup.jsx   # Checkout modal
│   │   │   ├── Orders.jsx          # User order history
│   │   │   ├── AddProduct.jsx      # Add new product (admin)
│   │   │   ├── UpdateProduct.jsx   # Edit product (admin)
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Register.jsx        # Registration page
│   │   │   ├── Profile.jsx         # User profile page
│   │   │   └── Navbar.jsx          # Navigation bar
│   │   ├── Context/
│   │   │   └── Context.jsx         # Global app state (React Context)
│   │   ├── App.jsx                 # Root component + routing
│   │   ├── axios.jsx               # Axios base URL config
│   │   └── main.jsx                # App entry point
│   ├── package.json
│   └── vite.config.js
│
├── seed.js                         # Optional seed script
└── README.md
```

---

## Backend Setup (Spring Boot)

### 1. Navigate to the Backend directory

```bash
cd Backend
```

### 2. Run with Maven Wrapper (recommended)

**Windows:**
```cmd
mvnw.cmd spring-boot:run
```

**macOS / Linux:**
```bash
./mvnw spring-boot:run
```

### 3. Run with Maven (if installed globally)

```bash
mvn spring-boot:run
```

The backend will start at **`http://localhost:8080`**.

---

### Optional: Switch to MySQL

By default the app uses H2 (in-memory). To use MySQL instead:

1. Create a database in MySQL:
   ```sql
   CREATE DATABASE ecomdb;
   ```

2. Update `Backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/ecomdb
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
   ```

3. Add the MySQL dependency to `pom.xml` (replace the H2 entry):
   ```xml
   <dependency>
       <groupId>com.mysql</groupId>
       <artifactId>mysql-connector-j</artifactId>
       <scope>runtime</scope>
   </dependency>
   ```

---

## Frontend Setup (React + Vite)

### 1. Navigate to the Frontend directory

```bash
cd Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The frontend will be available at **`http://localhost:5173`**.

> The frontend is pre-configured to call the backend at `http://localhost:8080`. See `src/axios.jsx` to change the base URL if needed.

---

## REST API Reference

All endpoints are prefixed with `/api`. The backend runs on port **8080** by default.

### 🛒 Products — `/api`

| Method | Endpoint                        | Description                        |
|--------|---------------------------------|------------------------------------|
| GET    | `/api/products`                 | Get all products                   |
| GET    | `/api/product/{id}`             | Get a product by ID                |
| GET    | `/api/product/{id}/image`       | Get product image (binary)         |
| GET    | `/api/products/search?keyword=` | Search products by keyword         |
| POST   | `/api/product`                  | Add a new product (multipart form) |
| PUT    | `/api/product/{id}`             | Update a product (multipart form)  |
| DELETE | `/api/product/{id}`             | Delete a product                   |

**POST / PUT request format** (multipart/form-data):
- `product` — JSON part with product fields (name, price, category, etc.)
- `imageFile` — the uploaded image file

---

### 🔐 Auth — `/api/auth`

| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| POST   | `/api/auth/register`   | Register a new user             |
| POST   | `/api/auth/login`      | Login (returns user info)       |
| PUT    | `/api/auth/profile/{id}` | Update user profile           |

**Login request body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

---

### 📦 Orders — `/api/orders`

| Method | Endpoint                     | Description                   |
|--------|------------------------------|-------------------------------|
| POST   | `/api/orders`                | Place a new order             |
| GET    | `/api/orders/user/{email}`   | Fetch all orders for a user   |

**POST order request body (example):**
```json
{
  "userEmail": "user@example.com",
  "items": [
    { "productId": 1, "productName": "Widget", "quantity": 2, "price": 19.99 }
  ],
  "totalAmount": 39.98,
  "address": "123 Main St"
}
```

---

## Application Features

| Feature               | Description                                                         |
|-----------------------|---------------------------------------------------------------------|
| 🏠 Product Listing    | Browse all products with images, prices, and category filters       |
| 🔍 Product Search     | Search products by name or keyword from the Navbar                  |
| 📄 Product Detail     | View full product info, description, and add to cart                |
| 🛒 Shopping Cart      | Add/remove items, update quantities, view subtotal                  |
| 💳 Checkout           | Checkout modal with address and order placement                     |
| 📦 Order History      | View past orders tied to the logged-in user                         |
| 🔐 Auth               | Register a new account and login/logout                             |
| 👤 User Profile       | View and edit name, phone, address, and password                    |
| ➕ Add Product        | Admin form to add a new product with image upload                   |
| ✏️ Update Product     | Admin form to edit an existing product and image                    |
| 🗑️ Delete Product    | Admin option to remove a product permanently                        |

---

## Frontend Pages & Routes

| Route                    | Component        | Description                      |
|--------------------------|------------------|----------------------------------|
| `/`                      | `Home`           | Product listing / home page      |
| `/product/:id`           | `Product`        | Product detail page              |
| `/cart`                  | `Cart`           | Shopping cart view               |
| `/add_product`           | `AddProduct`     | Admin: add a new product         |
| `/product/update/:id`    | `UpdateProduct`  | Admin: edit an existing product  |
| `/login`                 | `Login`          | User login page                  |
| `/register`              | `Register`       | User registration page           |
| `/profile`               | `Profile`        | User profile page                |
| `/orders`                | `Orders`         | User order history               |

---

## Common Issues & Troubleshooting

### ❌ Backend won't start

- **Port 8080 in use?** Change the port in `application.properties`:
  ```properties
  server.port=8081
  ```
  Then update `Frontend/src/axios.jsx` to match.

- **Java version?** Check with `java -version`. Must be Java 8 or higher.

- **Maven not found?** Use the wrapper: `./mvnw` (Linux/Mac) or `mvnw.cmd` (Windows).

---

### ❌ Frontend can't connect to backend

- Ensure the backend is running on `http://localhost:8080`.
- Check `Frontend/src/axios.jsx` for the correct base URL.
- Make sure CORS is not blocked — the backend uses `@CrossOrigin` on all controllers.

---

### ❌ Images not displaying

- Product images are stored as binary data (`byte[]`) in the database.
- They are fetched from `/api/product/{id}/image`. If an image is missing, re-add the product with an image file.

---

### ❌ H2 Console Access (for debugging)

If you want to inspect the in-memory database, add to `application.properties`:
```properties
spring.h2.console.enabled=true
spring.datasource.url=jdbc:h2:mem:testdb
```
Then visit: **`http://localhost:8080/h2-console`**

---

### ❌ npm install fails

- Delete `node_modules` and `package-lock.json`, then re-run `npm install`.
- Ensure Node.js 18+ is installed: `node -v`.

---

## Useful Commands

### Backend

```bash
# Run the app
./mvnw spring-boot:run          # Linux/Mac
mvnw.cmd spring-boot:run        # Windows

# Build a JAR
./mvnw clean package

# Run the built JAR
java -jar target/ecom-proj-0.0.1-SNAPSHOT.jar
```

### Frontend

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint the code
npm run lint
```

---

> **Tip:** Run the **backend first**, then the **frontend**. The React app will be unable to load any products if the Spring Boot server is not already running.
