import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly titleHeader: Locator;
  readonly inventoryList: Locator;
  readonly itemImages: Locator;
  readonly sortDropdown: Locator;
  readonly addToCartButtons: Locator;
  readonly shoppingCartContainer: Locator;
  readonly shoppingCartLink: Locator;
  readonly headerSecondaryContainer: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.titleHeader = page.locator('[data-test="title"]');
    this.inventoryList = page.locator('[data-test="inventory-item"]');
    this.itemImages = page.locator('[data-test="inventory-item"] img');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.addToCartButtons = page.locator('button[data-test^="add-to-cart"]');
    this.shoppingCartContainer = page.locator('#shopping_cart_container');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.headerSecondaryContainer = page.locator('.header_secondary_container');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async selectSortOption(value: string): Promise<void> {
    await this.sortDropdown.selectOption(value);
  }

  async clickFirstAddToCart(): Promise<void> {
    await this.addToCartButtons.first().click();
  }
  async getTitleText(): Promise<string> {
    return (await this.titleHeader.textContent()) || '';
  }

  async getAllImageSources(): Promise<string[]> {
    return await this.itemImages.evaluateAll((imgs) =>
      imgs.map((img) => (img as HTMLImageElement).src)
    );
  }
async getShoppingCartBoundingBox() {
    return await this.shoppingCartLink.boundingBox();
  }
  async addProductToCart(productSlug: string): Promise<void> {
    await this.page.locator(`[data-test="add-to-cart-${productSlug}"]`).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }



}