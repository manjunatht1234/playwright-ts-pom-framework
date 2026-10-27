import { test, expect } from '../../fixtures/pageFixtures';
import { testUsers } from '../../test-data/userData';

test.describe('Authentication Scenarios', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('TC_AUTH_01 - Login with standard_user', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(
      testUsers.standardUser.username,
      testUsers.standardUser.password
    );

    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(inventoryPage.titleHeader).toBeVisible();
    await expect(inventoryPage.titleHeader).toHaveText('Products');
  });

  test('TC_AUTH_02 - Display error for locked_out_user', async ({ loginPage }) => {
    await loginPage.login(
      testUsers.lockedOutUser.username,
      testUsers.lockedOutUser.password
    );

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

  test('TC_AUTH_03 - Login attempt with empty credentials', async ({ loginPage }) => {
    // 1. Leave username and password empty, then click Login
    await loginPage.clickLogin();

    // 2. Verify error banner visibility and error message text
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username is required'
    );
  });

test('TC_AUTH_04 - Login attempt with missing password', async ({ loginPage }) => {
    // 1. Enter valid username
    await loginPage.enterUsername(testUsers.standardUser.username);

    // 2. Leave password blank & 3. Click Login
    await loginPage.clickLogin();

    // Assert: Error banner appears with the expected validation text
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Password is required'
    );
});
test('TC_AUTH_05 - Login attempt with missing username', async ({ loginPage }) => {
    // 1. Leave username blank (no action needed on username field)
    
    // 2. Enter valid password
    await loginPage.enterPassword(testUsers.standardUser.password);

    // 3. Click Login
    await loginPage.clickLogin();

    // Assert: Error banner appears with the required username validation message
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username is required'
    );
  });

  test('TC_AUTH_06 - Login attempt with invalid password', async ({ loginPage }) => {
    // 1. Enter valid username
    await loginPage.enterUsername(testUsers.standardUser.username);

    // 2. Enter incorrect password
    await loginPage.enterPassword('incorrect_secret_sauce');

    // 3. Click Login
    await loginPage.clickLogin();

    // Assert: Error banner appears with credential mismatch message
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('TC_AUTH_07 - Verify form submission via Enter key', async ({ page, loginPage, inventoryPage }) => {
    // 1. Enter valid username
    await loginPage.enterUsername(testUsers.standardUser.username);

    // 2. Enter valid password
    await loginPage.enterPassword(testUsers.standardUser.password);

    // 3. Press Enter key from the password field
    await loginPage.passwordInput.press('Enter');

    // Assert: Form submits and user is redirected to /inventory.html
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(inventoryPage.titleHeader).toBeVisible();
    await expect(inventoryPage.titleHeader).toHaveText('Products');
  });

  test('TC_AUTH_08 - Direct URL access restriction without authentication', async ({ page, loginPage }) => {
    // 1. Attempt to navigate directly to the protected route without authenticating
    await page.goto('/inventory.html');

    // Assert: Application redirects back to root login page
    await expect(page).toHaveURL(/.*saucedemo\.com\/?$/);

    // Assert: Unauthorized access error message is displayed
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(
      "Epic sadface: You can only access '/inventory.html' when you are logged in."
    );
  });

  test('TC_AUTH_10 - Authentication handling with performance_glitch_user', async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    // 1. Enter performance glitch user
    await loginPage.enterUsername('performance_glitch_user');

    // 2. Enter valid password
    await loginPage.enterPassword('secret_sauce');

    // 3. Click Login
    await loginPage.clickLogin();

    // Assert: System tolerates the ~5s backend latency and redirects to inventory
    // An explicit 15s timeout protects against CI/CD network jitter
    await expect(page).toHaveURL(/.*inventory\.html/, { timeout: 15000 });
    await expect(inventoryPage.titleHeader).toBeVisible();
    await expect(inventoryPage.titleHeader).toHaveText('Products');
  });
test('TC_AUTH_11 - Authentication and asset loading check with problem_user', async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    // 1. Enter problem_user, 2. Enter valid password, 3. Click Login
    await loginPage.login(
      testUsers.problemUser.username,
      testUsers.problemUser.password
    );

    // Expected Result: Verify redirection to the inventory dashboard
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(inventoryPage.titleHeader).toBeVisible();

    // 4. Verify inventory images render the broken fallback asset (sl-404)
    await expect(inventoryPage.itemImages.first()).toBeVisible();
    const imageElements = await inventoryPage.itemImages.all();
    
    expect(imageElements.length).toBeGreaterThan(0);

    // Assert that every inventory item displays the broken 'sl-404' image asset
    for (const image of imageElements) {
      await expect(image).toHaveAttribute('src', /sl-404/);
    }
  });

  test('TC_AUTH_12 - Successful authentication with error_user', async ({
  page,
  loginPage,
  inventoryPage,
}) => {
  // 1. Authenticate with error_user credentials
  await loginPage.login(
    testUsers.errorUser.username,
    testUsers.errorUser.password
  );

  // 2. Expected Result: Verify redirection to inventory.html and header visibility
  await expect(page).toHaveURL(/.*inventory\.html/);
  await expect(inventoryPage.titleHeader).toBeVisible();
  await expect(inventoryPage.titleHeader).toHaveText('Products');
});

  test('TC_AUTH_13 - Authentication and layout integrity check with visual_user', async ({
    page,
    loginPage,
    inventoryPage,
  }, testInfo) => {
    // 1. Enter visual_user, 2. Enter valid password, 3. Click Login
    await loginPage.login(
      testUsers.visualUser.username,
      testUsers.visualUser.password
    );

    // Expected Result: Navigates to /inventory.html
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(inventoryPage.titleHeader).toBeVisible();

    // 4. Inspect UI element alignment via Bounding Box inspection
    const cartBox = await inventoryPage.getShoppingCartBoundingBox();
    expect(cartBox).not.toBeNull();

    // Attach bounding box metrics to the report for layout telemetry
    await testInfo.attach('cart_bounding_box_metrics', {
      body: JSON.stringify(cartBox, null, 2),
      contentType: 'application/json',
    });

    // Verify visual alignment / layout shift detection
    // Approach A: Element snapshot comparison (detects pixel/layout shifts)
    // To generate or update the baseline, run with the --update-snapshots flag
    await expect(inventoryPage.shoppingCartContainer).toHaveScreenshot(
      'visual-user-cart.png',
      {
        maxDiffPixelRatio: 0.1,
      }
    );
  });













    

});