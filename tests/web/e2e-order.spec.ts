import { test, expect } from '../../fixtures/pageFixtures';
import { checkoutData } from '../../test-data/checkoutData';
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
    const targetProduct = {
      slug: 'sauce-labs-backpack',
      name: 'Sauce Labs Backpack',
      price: '$29.99',
    };

    const customerDetails = {
      firstName: 'John',
      lastName: 'Doe',
      postalCode: '560001',
    };

    // Step 1: Locate 'Sauce Labs Backpack' and click 'Add to cart'
    await inventoryPage.addProductToCart(targetProduct.slug);

    // Step 2: Verify shopping cart badge displays '1'
    await expect(inventoryPage.cartBadge).toBeVisible();
    await expect(inventoryPage.cartBadge).toHaveText('1');

    // Step 3: Click shopping cart icon
    await inventoryPage.openCart();
    await expect(page).toHaveURL(/.*cart\.html/);

    // Step 4: Verify cart contains exactly one item with correct name and price
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.itemName).toHaveText(targetProduct.name);
    await expect(cartPage.itemPrice).toHaveText(targetProduct.price);

    // Step 5: Click 'Checkout'
    await cartPage.clickCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    // Step 6: Enter customer information and click 'Continue'
    await checkoutPage.fillCustomerInformation(
      customerDetails.firstName,
      customerDetails.lastName,
      customerDetails.postalCode
    );

    // Step 7: Verify Checkout Overview displays item total, tax, and total price
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    await expect(checkoutPage.summarySubtotal).toContainText('Item total: $29.99');
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
    await inventoryPage.addProductToCart('sauce-labs-backpack');
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
});