import { test, expect } from '../fixtures/testFixtures';
import { testUsers } from '../test-data/userData';

test.describe('Authentication Scenarios', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('TC_01 - Login with standard_user', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(
      testUsers.standardUser.username,
      testUsers.standardUser.password
    );

    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(inventoryPage.titleHeader).toBeVisible();
    await expect(inventoryPage.titleHeader).toHaveText('Products');
  });

  test('TC_02 - Display error for locked_out_user', async ({ loginPage }) => {
    await loginPage.login(
      testUsers.lockedOutUser.username,
      testUsers.lockedOutUser.password
    );

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

  test('TC_03 - Display error for invalid credentials', async ({ loginPage }) => {
    await loginPage.login(
      testUsers.invalidUser.username,
      testUsers.invalidUser.password
    );

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });
});