import { test, expect } from '../../fixtures/pageFixtures';
import { checkoutData } from '../../test-data/checkoutData';
import { products } from '../../test-data/productData';
import { testUsers } from '../../test-data/userData';

test.describe('E2E Checkout Flow', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    // Precondition: Logged in (standard_user) and located on inventory.html
    await loginPage.open();
    await loginPage.login(
      testUsers.standardUser.username,
      testUsers.standardUser.password
    );
    await expect(inventoryPage.titleHeader).toHaveText('Products');
  });

  test('TC_E2E_01 - End-to-end single product purchase workflow', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // Step 1: Locate 'Sauce Labs Backpack' and click 'Add to cart'
    await inventoryPage.addProductToCart(products.sauceLabsBackpack.slug);

    // Step 2: Verify shopping cart badge displays '1'
    await expect(inventoryPage.cartBadge).toBeVisible();
    await expect(inventoryPage.cartBadge).toHaveText('1');

    // Step 3: Click shopping cart icon
    await inventoryPage.openCart();
    await expect(page).toHaveURL(/.*cart\.html/);

    // Step 4: Verify cart contains exactly one item with correct name and price
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.itemName).toHaveText(products.sauceLabsBackpack.name);
    await expect(cartPage.itemPrice).toHaveText(products.sauceLabsBackpack.price);

    // Step 5: Click 'Checkout'
    await cartPage.clickCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    // Step 6: Enter customer information and click 'Continue'
    await checkoutPage.fillCustomerInformation(
      checkoutData.validCustomer.firstName,
      checkoutData.validCustomer.lastName,
      checkoutData.validCustomer.postalCode
    );

    // Step 7: Verify Checkout Overview displays item total, tax, and total price
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    await expect(checkoutPage.summarySubtotal).toContainText(
      `Item total: ${products.sauceLabsBackpack.price}`
    );
    await expect(checkoutPage.summaryTax).toContainText('Tax: $2.40');
    await expect(checkoutPage.summaryTotal).toContainText('Total: $32.39');

    // Step 8: Click 'Finish'
    await checkoutPage.finishOrder();

    // Expected Result: Confirmation page displays order success and dispatch messages
    await expect(page).toHaveURL(/.*checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toBeVisible();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    await expect(checkoutPage.completeText).toContainText(
      'Your order has been dispatched'
    );
  });
  test('TC_E2E_02 - Checkout Step One validation - missing First Name', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addProductToCart(products.sauceLabsBackpack.slug);
    await inventoryPage.openCart();
    await cartPage.clickCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    // Leave First Name blank and enter the remaining customer information.
    await checkoutPage.enterLastName(checkoutData.missingFirstName.lastName);
    await checkoutPage.enterPostalCode(checkoutData.missingFirstName.postalCode);

    await checkoutPage.clickContinue();

    // Assert: Form submission is halted and user remains on checkout-step-one.html
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    // Assert: Error banner appears with the expected validation message
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toHaveText(
      checkoutData.missingFirstName.expectedError
    );
  });
  test('TC_E2E_03 - Checkout Step One validation - missing Last Name', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addProductToCart(products.sauceLabsBackpack.slug);
    await inventoryPage.openCart();
    await cartPage.clickCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    // 1. Enter valid First Name
    await checkoutPage.enterFirstName(checkoutData.missingLastName.firstName);

    // 2. Leave 'Last Name' field blank (no input action required)

    // 3. Enter valid Postal Code
    await checkoutPage.enterPostalCode(checkoutData.missingLastName.postalCode);

    // 4. Click 'Continue'
    await checkoutPage.clickContinue();

    // Assert: Form submission is halted and user remains on checkout-step-one.html
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    // Assert: Error banner appears with the expected validation message
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toHaveText(
      checkoutData.missingLastName.expectedError
    );
  });

  test('TC_E2E_04 - Checkout Step One validation - missing Postal Code', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addProductToCart(products.sauceLabsBackpack.slug);
    await inventoryPage.openCart();
    await cartPage.clickCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    // 1. Enter valid First Name and Last Name
    await checkoutPage.enterFirstName(checkoutData.missingPostalCode.firstName);
    await checkoutPage.enterLastName(checkoutData.missingPostalCode.lastName);

    // 2. Leave 'Postal Code' field blank (no input action required)

    // 3. Click 'Continue'
    await checkoutPage.clickContinue();

    // Assert: Form submission is halted and user remains on checkout-step-one.html
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    // Assert: Error banner appears with the expected validation message
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toHaveText(
      checkoutData.missingPostalCode.expectedError
    );
  });
  test('TC_E2E_05 - Cancel checkout at Step One and verify navigation back to cart', async ({
      page,
      checkoutPage,
      cartPage,
      inventoryPage,
    }) => {
      await inventoryPage.addProductToCart(products.sauceLabsBackpack.slug);
      await inventoryPage.openCart();
      await cartPage.clickCheckout();
      await expect(page).toHaveURL(/.*checkout-step-one\.html/);

      await checkoutPage.clickCancel();

      await expect(page).toHaveURL(/.*cart\.html/);
      await expect(inventoryPage.cartBadge).toBeVisible();
      await expect(inventoryPage.cartBadge).toHaveText('1');
      await expect(cartPage.cartItems).toHaveCount(1);
      await expect(cartPage.itemName).toHaveText(products.sauceLabsBackpack.name);
    });
 
  test('TC_E2E_06 - Cancel checkout at Overview (Step Two) and verify navigation back to inventory', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // Preconditions: User is logged in, item added to cart, and navigated to checkout overview
    await loginPage.open();
    await loginPage.login(
      testUsers.standardUser.username,
      testUsers.standardUser.password
    );
    await inventoryPage.addProductToCart(products.sauceLabsBackpack.slug);
    await inventoryPage.openCart();
    await cartPage.clickCheckout();

    await checkoutPage.fillCustomerInformation(
      checkoutData.validCustomer.firstName,
      checkoutData.validCustomer.lastName,
      checkoutData.validCustomer.postalCode
    );

    // Verify reached Step Two: Overview
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);

    // 1. Review order details (verify overview container is displayed)
    await expect(checkoutPage.summarySubtotal).toBeVisible();

    // 2. Click 'Cancel' button on the overview page
    await checkoutPage.clickCancel();

    // Assert: User is redirected back to /inventory.html
    await expect(page).toHaveURL(/.*inventory\.html/);

    // Assert: Product catalog renders properly
    await expect(inventoryPage.titleHeader).toBeVisible();
    await expect(inventoryPage.titleHeader).toHaveText('Products');

    // Assert: Shopping cart badge retains the item
    await expect(inventoryPage.cartBadge).toBeVisible();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});