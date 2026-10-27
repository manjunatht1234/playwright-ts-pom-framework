import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly titleHeader: Locator;
  readonly inventoryList: Locator;

  constructor(page: Page) {
    super(page);
    this.titleHeader = page.locator('[data-test="title"]');
    this.inventoryList = page.locator('[data-test="inventory-item"]');
  }

  async getTitleText(): Promise<string> {
    return (await this.titleHeader.textContent()) || '';
  }
}