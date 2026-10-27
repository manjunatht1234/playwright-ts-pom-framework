// pages/CartPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly itemName: Locator;
  readonly itemPrice: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.itemName = page.locator('[data-test="inventory-item-name"]');
    this.itemPrice = page.locator('[data-test="inventory-item-price"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}