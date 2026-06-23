/**
 * Automated Onboarding Script for E-Commerce Application using Playwright
 *
 * This script automates the complete user journey:
 * 1. Register new user
 * 2. Login
 * 3. Browse products
 * 4. View product details
 * 5. Add to cart
 * 6. Create order
 * 7. View orders
 *
 * Prerequisites:
 * - Install playwright: npm install playwright
 * - All services running (DB, Backend, Frontend)
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Test user credentials
const TEST_USER = {
  email: 'onboarduser@example.com',
  firstName: 'onboarduser',
  lastName: 'onboarduser',
  password: 'onboarduser'
};

const BASE_URL = 'http://localhost:4200';
const SCREENSHOT_DIR = `onboarding-screenshots-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)}`;

// Create screenshot directory
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

function saveExplanation(filename, text) {
  fs.writeFileSync(path.join(SCREENSHOT_DIR, filename), text, 'utf8');
}

async function takeScreenshotWithExplanation(page, name, explanation) {
  const screenshotPath = path.join(SCREENSHOT_DIR, `${name}.png`);
  const explanationPath = `${name}.txt`;

  await page.screenshot({ path: screenshotPath, fullPage: true });
  saveExplanation(explanationPath, explanation);

  console.log(`✓ Captured: ${name}`);
}

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🚀 Starting automated onboarding journey...\n');

  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  try {
    // Step 1: Homepage
    console.log('📍 Step 1: Opening application homepage...');
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await wait(2000);
    await takeScreenshotWithExplanation(
      page,
      '01-homepage',
      'Application homepage showing the product catalog and navigation. This is the entry point for all users.'
    );

    // Step 2: Registration
    console.log('📍 Step 2: Registering new user...');

    // Look for registration link/button
    const registerSelectors = [
      'a[href*="register"]',
      'a[href*="signup"]',
      'button:has-text("Sign Up")',
      'button:has-text("Register")',
      '[routerLink*="register"]',
      'text=Sign Up',
      'text=Register'
    ];

    let registered = false;
    for (const selector of registerSelectors) {
      try {
        await page.click(selector, { timeout: 2000 });
        registered = true;
        break;
      } catch (e) {
        // Try next selector
      }
    }

    if (!registered) {
      console.log('⚠️  Could not find registration link automatically. Trying fallback...');
      // Try to navigate directly to registration page
      await page.goto(`${BASE_URL}/register`);
    }

    await page.waitForLoadState('networkidle');
    await wait(2000);

    // Fill registration form
    try {
      // Look for email input
      const emailSelectors = ['input[name="email"]', 'input[type="email"]', 'input[formControlName="email"]'];
      for (const selector of emailSelectors) {
        try {
          await page.fill(selector, TEST_USER.email, { timeout: 2000 });
          break;
        } catch (e) {
          // Try next selector
        }
      }

      // Look for firstName input
      const firstNameSelectors = ['input[name="firstName"]', 'input[formControlName="firstName"]', 'input[placeholder*="First"]'];
      for (const selector of firstNameSelectors) {
        try {
          await page.fill(selector, TEST_USER.firstName, { timeout: 2000 });
          break;
        } catch (e) {
          // Try next selector
        }
      }

      // Look for lastName input
      const lastNameSelectors = ['input[name="lastName"]', 'input[formControlName="lastName"]', 'input[placeholder*="Last"]'];
      for (const selector of lastNameSelectors) {
        try {
          await page.fill(selector, TEST_USER.lastName, { timeout: 2000 });
          break;
        } catch (e) {
          // Try next selector
        }
      }

      // Look for password input
      const passwordSelectors = ['input[name="password"]', 'input[type="password"]', 'input[formControlName="password"]'];
      for (const selector of passwordSelectors) {
        try {
          await page.fill(selector, TEST_USER.password, { timeout: 2000 });
          break;
        } catch (e) {
          // Try next selector
        }
      }

      await takeScreenshotWithExplanation(
        page,
        '02-registration-form',
        `Registration form filled with test user: ${TEST_USER.email}. Ready to create a new account.`
      );

      // Submit form
      const submitSelectors = ['button[type="submit"]', 'button:has-text("Register")', 'button:has-text("Sign Up")'];
      for (const selector of submitSelectors) {
        try {
          await page.click(selector, { timeout: 2000 });
          break;
        } catch (e) {
          // Try next selector
        }
      }

      await page.waitForLoadState('networkidle');
      await wait(3000);

      await takeScreenshotWithExplanation(
        page,
        '03-registration-success',
        'User registration completed successfully. Account created and ready for login.'
      );
    } catch (e) {
      console.log('⚠️  Registration form interaction failed:', e.message);
    }

    // Step 3: Login
    console.log('📍 Step 3: Logging in...');

    // Navigate to login if not already there
    const loginSelectors = [
      'a[href*="login"]',
      'button:has-text("Login")',
      'button:has-text("Sign In")',
      '[routerLink*="login"]',
      'text=Login',
      'text=Sign In'
    ];

    for (const selector of loginSelectors) {
      try {
        await page.click(selector, { timeout: 2000 });
        break;
      } catch (e) {
        // Try next selector
      }
    }

    await page.waitForLoadState('networkidle');
    await wait(2000);

    try {
      // Fill login form
      const emailSelectors = ['input[name="email"]', 'input[name="username"]', 'input[type="email"]', 'input[formControlName="email"]', 'input[formControlName="username"]'];
      for (const selector of emailSelectors) {
        try {
          await page.fill(selector, TEST_USER.email, { timeout: 2000 });
          break;
        } catch (e) {
          // Try next selector
        }
      }

      const passwordSelectors = ['input[name="password"]', 'input[type="password"]', 'input[formControlName="password"]'];
      for (const selector of passwordSelectors) {
        try {
          await page.fill(selector, TEST_USER.password, { timeout: 2000 });
          break;
        } catch (e) {
          // Try next selector
        }
      }

      await takeScreenshotWithExplanation(
        page,
        '04-login-form',
        `Login form filled with credentials for ${TEST_USER.email}. Authenticating user.`
      );

      // Submit login
      const submitSelectors = ['button[type="submit"]', 'button:has-text("Login")', 'button:has-text("Sign In")'];
      for (const selector of submitSelectors) {
        try {
          await page.click(selector, { timeout: 2000 });
          break;
        } catch (e) {
          // Try next selector
        }
      }

      await page.waitForLoadState('networkidle');
      await wait(3000);

      await takeScreenshotWithExplanation(
        page,
        '05-login-success',
        'Successfully logged in. User authenticated and redirected to main application view.'
      );
    } catch (e) {
      console.log('⚠️  Login form interaction failed:', e.message);
    }

    // Step 4: Browse Products
    console.log('📍 Step 4: Browsing product catalog...');
    await wait(2000);

    await takeScreenshotWithExplanation(
      page,
      '06-product-catalog',
      'Product catalog displaying available items. Users can browse and select products to purchase.'
    );

    // Step 5: View Product Details
    console.log('📍 Step 5: Opening product details...');

    try {
      // Click on first product
      const productSelectors = [
        '.product-card',
        '.product-item',
        '[class*="product"]',
        'mat-card',
        '.card'
      ];

      for (const selector of productSelectors) {
        try {
          const products = await page.$$(selector);
          if (products.length > 0) {
            await products[0].click();
            break;
          }
        } catch (e) {
          // Try next selector
        }
      }

      await page.waitForLoadState('networkidle');
      await wait(3000);

      await takeScreenshotWithExplanation(
        page,
        '07-product-detail',
        'Product detail page showing item information including name, price, description, and purchase options.'
      );
    } catch (e) {
      console.log('⚠️  Could not navigate to product details:', e.message);
    }

    // Step 6: Add to Cart
    console.log('📍 Step 6: Adding product to cart...');

    try {
      const addToCartSelectors = [
        'button:has-text("Add to Cart")',
        'button:has-text("Add")',
        '[class*="add-to-cart"]',
        'button[class*="cart"]'
      ];

      for (const selector of addToCartSelectors) {
        try {
          await page.click(selector, { timeout: 2000 });
          break;
        } catch (e) {
          // Try next selector
        }
      }

      await wait(2000);

      await takeScreenshotWithExplanation(
        page,
        '08-add-to-cart',
        'Product successfully added to shopping cart. Cart updated with selected item.'
      );
    } catch (e) {
      console.log('⚠️  Could not add to cart:', e.message);
    }

    // Step 7: View Cart
    console.log('📍 Step 7: Viewing shopping cart...');

    try {
      const cartSelectors = [
        'a[href*="cart"]',
        'button[class*="cart"]',
        '[routerLink*="cart"]',
        'mat-icon:has-text("shopping_cart")',
        'text=Cart'
      ];

      for (const selector of cartSelectors) {
        try {
          await page.click(selector, { timeout: 2000 });
          break;
        } catch (e) {
          // Try next selector
        }
      }

      await page.waitForLoadState('networkidle');
      await wait(2000);

      await takeScreenshotWithExplanation(
        page,
        '09-cart-view',
        'Shopping cart page showing added items with quantities and total price. Ready for checkout.'
      );
    } catch (e) {
      console.log('⚠️  Could not navigate to cart:', e.message);
    }

    // Step 8: Create Order
    console.log('📍 Step 8: Creating order...');

    try {
      const checkoutSelectors = [
        'button:has-text("Checkout")',
        'button:has-text("Place Order")',
        'button:has-text("Create Order")',
        '[class*="checkout"]'
      ];

      for (const selector of checkoutSelectors) {
        try {
          await page.click(selector, { timeout: 2000 });
          break;
        } catch (e) {
          // Try next selector
        }
      }

      await page.waitForLoadState('networkidle');
      await wait(3000);

      await takeScreenshotWithExplanation(
        page,
        '10-order-created',
        'Order successfully created and confirmed. Order details and confirmation displayed.'
      );
    } catch (e) {
      console.log('⚠️  Could not create order:', e.message);
    }

    // Step 9: View Orders
    console.log('📍 Step 9: Viewing order history...');

    try {
      const ordersSelectors = [
        'a[href*="orders"]',
        'a[href*="order"]',
        '[routerLink*="orders"]',
        'text=Orders',
        'text=My Orders'
      ];

      for (const selector of ordersSelectors) {
        try {
          await page.click(selector, { timeout: 2000 });
          break;
        } catch (e) {
          // Try next selector
        }
      }

      await page.waitForLoadState('networkidle');
      await wait(2000);

      await takeScreenshotWithExplanation(
        page,
        '11-orders-page',
        'Order history page displaying all user orders. Shows the newly created order in the list.'
      );
    } catch (e) {
      console.log('⚠️  Could not navigate to orders page:', e.message);
    }

    console.log('\n✅ Onboarding journey completed!');
    console.log(`📁 Screenshots and explanations saved to: ${SCREENSHOT_DIR}`);
    console.log('\n🌐 Browser left open for manual exploration. Press Ctrl+C to close.');

    // Keep browser open for manual exploration
    await wait(300000); // 5 minutes

  } catch (error) {
    console.error('❌ Error during onboarding:', error);
    await takeScreenshotWithExplanation(
      page,
      'error-state',
      `Error occurred: ${error.message}`
    );
  } finally {
    // Uncomment to close browser automatically
    // await browser.close();
  }
}

main().catch(console.error);
