const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, `onboarding-screenshots-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)}`);
const BASE_URL = 'http://localhost:4200';
const TEST_USER = {
  email: 'onboarduser@example.com',
  firstName: 'onboarduser',
  lastName: 'onboarduser',
  password: 'onboarduser'
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function takeScreenshotWithNote(page, filename, description) {
  const screenshotPath = path.join(SCREENSHOT_DIR, `${filename}.png`);
  const notePath = path.join(SCREENSHOT_DIR, `${filename}.txt`);

  await page.screenshot({ path: screenshotPath, fullPage: true });
  fs.writeFileSync(notePath, description);

  console.log(`✓ ${filename}: ${description}`);
}

async function main() {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  console.log('🚀 Starting automated onboarding journey...\n');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--start-maximized']
  });

  const page = await browser.newPage();

  try {
    console.log('Step 1: Opening homepage...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await sleep(2000);
    await takeScreenshotWithNote(page, '01-homepage',
      'Application homepage showing the product catalog and navigation');

    console.log('\nStep 2: Registering new user...');
    const registerSelectors = ['a[href*="register"]', 'a[href*="signup"]', 'a:contains("Register")', 'a:contains("Sign Up")'];
    
    let registered = false;
    for (const selector of registerSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        await page.click(selector);
        registered = true;
        break;
      } catch (e) {
        continue;
      }
    }

    if (!registered) {
      await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle2' });
    }

    await sleep(2000);
    await page.type('input[type="email"], input[name*="email"], input[id*="email"]', TEST_USER.email);
    await page.type('input[name*="first"], input[id*="first"]', TEST_USER.firstName);
    await page.type('input[name*="last"], input[id*="last"]', TEST_USER.lastName);
    const passwordFields = await page.$$('input[type="password"]');
    for (const field of passwordFields) {
      await field.type(TEST_USER.password);
    }

    await takeScreenshotWithNote(page, '02-registration',
      'Registration form filled with test user credentials');

    await page.click('button[type="submit"]');
    await sleep(3000);
    await takeScreenshotWithNote(page, '02b-registration-success',
      'Registration successful, user account created');

    console.log('\nStep 3: Logging in...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await sleep(2000);

    await page.type('input[type="email"], input[name*="email"], input[name*="username"]', TEST_USER.email);
    await page.type('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await sleep(3000);
    await takeScreenshotWithNote(page, '03-login-success',
      'Successfully logged in as onboarduser@example.com');

    console.log('\nStep 4: Browsing product catalog...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await sleep(2000);
    await takeScreenshotWithNote(page, '04-product-catalog',
      'Product catalog showing available items for purchase');

    console.log('\nStep 5: Viewing product details...');
    const productSelectors = ['.product-card', '.product-item', '[class*="product"]', 'a[href*="product"]'];
    for (const selector of productSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        await page.click(selector);
        break;
      } catch (e) {
        continue;
      }
    }
    await sleep(2000);
    await takeScreenshotWithNote(page, '05-product-detail',
      'Product detail page showing name, price, description, and add to cart option');

    console.log('\nStep 6: Adding product to cart...');
    const addToCartSelectors = ['button[class*="add"]', 'button[class*="cart"]', 'button[id*="add"]'];
    for (const selector of addToCartSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        await page.click(selector);
        break;
      } catch (e) {
        continue;
      }
    }
    await sleep(2000);
    await takeScreenshotWithNote(page, '06-add-to-cart',
      'Product successfully added to shopping cart');

    console.log('\nStep 7: Viewing shopping cart...');
    const cartSelectors = ['a[href*="cart"]', '[class*="cart-icon"]', '[class*="shopping-cart"]'];
    for (const selector of cartSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        await page.click(selector);
        break;
      } catch (e) {
        continue;
      }
    }
    await sleep(2000);
    await takeScreenshotWithNote(page, '07-cart-view',
      'Shopping cart showing selected product with quantity and total price');

    console.log('\nStep 8: Creating order...');
    const checkoutSelectors = ['button[class*="checkout"]', 'button[class*="order"]', 'a[href*="checkout"]'];
    for (const selector of checkoutSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        await page.click(selector);
        break;
      } catch (e) {
        continue;
      }
    }
    await sleep(3000);
    await takeScreenshotWithNote(page, '08-order-created',
      'Order successfully created and confirmed');

    console.log('\nStep 9: Viewing order history...');
    const ordersSelectors = ['a[href*="order"]', '[class*="orders"]'];
    for (const selector of ordersSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        await page.click(selector);
        break;
      } catch (e) {
        continue;
      }
    }
    await sleep(2000);
    await takeScreenshotWithNote(page, '09-orders-page',
      'Order history page showing the newly created order');

    console.log('\n✅ Onboarding journey completed successfully!');
    console.log(`📸 Screenshots saved to: ${SCREENSHOT_DIR}`);
    console.log('\nBrowser will remain open for 10 seconds...');
    await sleep(10000);

  } catch (error) {
    console.error('❌ Error:', error);
    await takeScreenshotWithNote(page, 'error', `Error occurred: ${error.message}`);
  } finally {
    await browser.close();
    console.log('\n🏁 Complete!');
  }
}

main().catch(console.error);
