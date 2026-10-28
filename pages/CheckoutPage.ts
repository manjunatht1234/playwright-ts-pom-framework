// pages/CheckoutPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  // Step One: Information Form
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  

  // Step Two: Overview
  readonly summarySubtotal: Locator;
  readonly summaryTax: Locator;
  readonly summaryTotal: Locator;
  readonly finishButton: Locator;

  // Step Three: Complete
  readonly completeHeader: Locator;
  readonly completeText: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    this.summarySubtotal = page.locator('[data-test="subtotal-label"]');
    this.summaryTax = page.locator('[data-test="tax-label"]');
    this.summaryTotal = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');

    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }
  
  async enterFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  async enterLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  async enterPostalCode(postalCode: string): Promise<void> {
    await this.postalCodeInput.fill(postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async fillCustomerInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }
}