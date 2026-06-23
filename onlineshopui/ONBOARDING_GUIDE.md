# 🚀 Fullstack E-Commerce Application - Interactive Onboarding Guide

## Test User Credentials
Use these credentials throughout the onboarding:
- **Email**: `onboarduser@example.com`
- **First Name**: `onboarduser`
- **Last Name**: `onboarduser`
- **Password**: `onboarduser`

## Onboarding Steps

### Step 1: Open the Homepage
1. Open your browser and navigate to: **http://localhost:4200**
2. You should see the application homepage with product catalog

**What to observe**: Navigation bar, product listings, Sign In/Register buttons

---

### Step 2: Register a New Account
1. Click on the **"Register"** or **"Sign Up"** link in the navigation
2. Fill in the registration form:
   - Email: `onboarduser@example.com`
   - First Name: `onboarduser`
   - Last Name: `onboarduser`
   - Password: `onboarduser`
   - Confirm Password: `onboarduser` (if required)
3. Click **"Register"** or **"Sign Up"** button
4. You should see a success message or be redirected

**What to observe**: Registration form validation, success confirmation

---

### Step 3: Sign In
1. If not automatically logged in, click **"Sign In"** or **"Login"** in the navigation
2. Enter credentials:
   - Email/Username: `onboarduser@example.com`
   - Password: `onboarduser`
3. Click **"Sign In"** or **"Login"** button
4. You should be logged in and see your name or email in the navigation

**What to observe**: Login successful, user menu appears, navigation updates

---

### Step 4: Browse Product Catalog
1. From the homepage, view the available products
2. Note product names, prices, and images

**What to observe**: Product grid/list layout, product images, pricing information

---

### Step 5: View Product Details
1. Click on any product card to view its details
2. Review product information:
   - Product name
   - Description
   - Price
   - Available quantity (if shown)

**What to observe**: Detailed product page, "Add to Cart" button

---

### Step 6: Add Product to Cart
1. On the product detail page, click **"Add to Cart"** button
2. You should see a confirmation (toast notification, popup, or cart icon update)

**What to observe**: Cart icon updates with item count, success message appears

---

### Step 7: View Shopping Cart
1. Click on the **cart icon** or **"Cart"** link in the navigation
2. Verify your selected product appears in the cart
3. Review:
   - Product name and price
   - Quantity selector
   - Total price

**What to observe**: Cart contents, quantity controls, total calculation

---

### Step 8: Create an Order (Checkout)
1. In the cart view, click **"Checkout"**, **"Create Order"**, or **"Place Order"** button
2. Complete any required checkout steps:
   - Shipping address (if required)
   - Payment information (if required)
3. Confirm and submit the order
4. You should see an order confirmation with an order ID

**What to observe**: Order confirmation message, order number/ID

---

### Step 9: View Order History
1. Navigate to **"Orders"**, **"My Orders"**, or **"Order History"** in the navigation
2. Verify your newly created order appears in the list
3. Review order details:
   - Order ID
   - Order date
   - Order status
   - Products in the order
   - Total amount

**What to observe**: Order list, order status, order details

---

## 🎉 Onboarding Complete!

You've successfully:
- ✅ Registered a new user account
- ✅ Logged into the application
- ✅ Browsed the product catalog
- ✅ Viewed product details
- ✅ Added a product to your cart
- ✅ Created an order
- ✅ Viewed your order history

## Additional Exploration

Feel free to explore additional features:
- Add multiple products to cart
- Update quantities in cart
- Remove items from cart
- Browse different product categories (if available)
- Update your profile (if available)
- Log out and log back in

## Troubleshooting

If you encounter any issues:
1. **Registration fails**: Check if the email is already in use, try a different one
2. **Login fails**: Verify credentials, check browser console for errors
3. **Products don't load**: Check backend API is running at http://localhost:3000/api
4. **Cart issues**: Check browser console, try refreshing the page
5. **Order creation fails**: Check backend logs for database/API errors

## Backend API Endpoints (for reference)

If you want to verify backend functionality:
- **Base URL**: http://localhost:3000/api
- **Health Check**: GET /health or /actuator/health
- **Products**: GET /products
- **Register**: POST /auth/register
- **Login**: POST /auth/login
- **Cart**: GET /cart, POST /cart
- **Orders**: GET /orders, POST /orders

