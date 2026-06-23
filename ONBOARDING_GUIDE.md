# 🎯 E-Commerce Application - Interactive Onboarding Guide

Welcome to the fullstack e-commerce application! This guide will walk you through the complete user journey.

## 📋 Prerequisites

All services should be running:
- ✅ Database: `cd docker/development && docker-compose up -d`
- ✅ Backend: `cd onlineshopapi && mvn spring-boot:run -Dspring-boot.run.profiles=local`
- ✅ Frontend: `cd onlineshopui && npm start`

**URLs:**
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api

## 🚀 Complete User Journey

### Test User Credentials
Use these credentials throughout the onboarding:
- **Email**: `onboarduser@example.com`
- **First Name**: `onboarduser`
- **Last Name**: `onboarduser`
- **Password**: `onboarduser`

---

## Step-by-Step Walkthrough

### 1️⃣ Homepage & Product Catalog

**Action:** Open http://localhost:4200 in your browser

**What to observe:**
- Application loads with navigation bar
- Product catalog displays available items
- Login/Register options visible in navigation

**Screenshot this:** Save as `01-homepage.png`

---

### 2️⃣ User Registration

**Action:** Click on "Sign Up" or "Register" button

**What to do:**
1. Fill in the registration form:
   - Email: `onboarduser@example.com`
   - First Name: `onboarduser`
   - Last Name: `onboarduser`
   - Password: `onboarduser`
2. Click "Register" or "Sign Up" button

**API Endpoint (for reference):**
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "onboarduser@example.com",
  "firstName": "onboarduser",
  "lastName": "onboarduser",
  "password": "onboarduser"
}
```

**What to observe:**
- Success message appears
- Redirected to login page or automatically logged in
- User account created in database

**Screenshot this:** Save as `02-registration.png`

---

### 3️⃣ User Login

**Action:** Navigate to login page (if not auto-logged in)

**What to do:**
1. Enter credentials:
   - Email/Username: `onboarduser@example.com`
   - Password: `onboarduser`
2. Click "Login" or "Sign In" button

**API Endpoint (for reference):**
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "onboarduser@example.com",
  "password": "onboarduser"
}
```

**What to observe:**
- Authentication successful
- JWT token stored (check browser dev tools > Application > Local Storage)
- User redirected to main app view
- Navigation shows user is logged in

**Screenshot this:** Save as `03-login-success.png`

---

### 4️⃣ Browse Products

**Action:** View the product catalog

**What to observe:**
- Grid/list of products displayed
- Each product shows:
  - Product image
  - Name
  - Price
  - Brief description
  - "View Details" or similar button

**API Endpoint (for reference):**
```
GET http://localhost:3000/api/products
```

**Screenshot this:** Save as `04-product-catalog.png`

---

### 5️⃣ View Product Details

**Action:** Click on any product card or "View Details" button

**What to observe:**
- Detailed product page opens
- Shows:
  - Full product image
  - Complete description
  - Price
  - Available quantity
  - "Add to Cart" button
  - Product category

**API Endpoint (for reference):**
```
GET http://localhost:3000/api/products/{id}
```

**Screenshot this:** Save as `05-product-detail.png`

---

### 6️⃣ Add Product to Cart

**Action:** Click "Add to Cart" button

**What to observe:**
- Success notification appears
- Cart icon updates (shows item count)
- Product added to shopping cart

**What to observe:**
- Cart badge shows "1" or increments
- Success message: "Product added to cart"

**Screenshot this:** Save as `06-add-to-cart.png`

---

### 7️⃣ View Shopping Cart

**Action:** Click on cart icon in navigation

**What to observe:**
- Cart page displays
- Shows:
  - Product(s) added
  - Quantity (with +/- controls)
  - Individual price
  - Total price
  - "Checkout" or "Create Order" button

**Screenshot this:** Save as `07-cart-view.png`

---

### 8️⃣ Create Order

**Action:** Click "Checkout" or "Create Order" button

**What to do:**
1. Review order summary
2. Fill in any required shipping/payment info (if applicable)
3. Confirm order

**API Endpoint (for reference):**
```
POST http://localhost:3000/api/orders
Content-Type: application/json
Authorization: Bearer {your-jwt-token}

{
  "items": [
    {
      "productId": 1,
      "quantity": 1
    }
  ]
}
```

**What to observe:**
- Order confirmation page
- Order ID displayed
- Order summary with items and total
- Success message
- Cart is cleared

**Screenshot this:** Save as `08-order-created.png`

---

### 9️⃣ View Order History

**Action:** Navigate to "Orders" or "My Orders" page

**What to observe:**
- List of all user orders
- Each order shows:
  - Order ID
  - Order date
  - Total amount
  - Order status
  - Items purchased
- Your newly created order appears at the top

**API Endpoint (for reference):**
```
GET http://localhost:3000/api/orders
Authorization: Bearer {your-jwt-token}
```

**Screenshot this:** Save as `09-orders-page.png`

---

## 🎉 Onboarding Complete!

You have successfully:
- ✅ Registered a new user account
- ✅ Logged in with credentials
- ✅ Browsed the product catalog
- ✅ Viewed product details
- ✅ Added items to shopping cart
- ✅ Created an order
- ✅ Viewed order history

## 📸 Screenshot Checklist

Save all screenshots in: `onboarding-screenshots-[timestamp]/`

- [ ] `01-homepage.png` - Initial application view
- [ ] `02-registration.png` - User registration form
- [ ] `03-login-success.png` - Successful authentication
- [ ] `04-product-catalog.png` - Product listing
- [ ] `05-product-detail.png` - Individual product view
- [ ] `06-add-to-cart.png` - Cart update confirmation
- [ ] `07-cart-view.png` - Shopping cart with items
- [ ] `08-order-created.png` - Order confirmation
- [ ] `09-orders-page.png` - Order history view

## 🧪 Testing Notes

### Common Issues & Solutions

**Issue: Registration fails**
- Check backend logs for errors
- Verify database is running
- Ensure email is unique (not already registered)

**Issue: Login fails**
- Verify credentials are correct
- Check if user was successfully registered
- Review backend authentication logs

**Issue: Products not loading**
- Verify backend is running on port 3000
- Check database has product data
- Review browser console for API errors

**Issue: Cart empty after adding items**
- Check if user is logged in
- Verify cart API endpoints are working
- Review browser local storage/session storage

**Issue: Order creation fails**
- Ensure cart has items
- Check authentication token is valid
- Review backend order controller logs

## 🔧 Advanced: API Testing with curl

Test the backend APIs directly:

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "onboarduser@example.com",
    "firstName": "onboarduser",
    "lastName": "onboarduser",
    "password": "onboarduser"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "onboarduser@example.com",
    "password": "onboarduser"
  }'
```

### Get Products
```bash
curl -X GET http://localhost:3000/api/products
```

### Create Order (replace TOKEN with actual JWT)
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "items": [{"productId": 1, "quantity": 1}]
  }'
```

---

## 📚 Additional Resources

- **Frontend Code**: `onlineshopui/src/app/`
- **Backend API**: `onlineshopapi/src/main/java/msg/onlineshopapi/`
- **Database Schema**: `docker/development/docker-compose.yml`

For questions or issues, review the application logs in each service terminal.

**Happy Shopping! 🛒**
