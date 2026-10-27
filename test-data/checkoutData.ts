// test-data/checkoutData.ts
export const checkoutData = {
  missingFirstName: {
    firstName: '',
    lastName: 'Doe',
    postalCode: '560001',
    expectedError: 'Error: First Name is required',
  },
  missingLastName: {
    firstName: 'John',
    lastName: '',
    postalCode: '560001',
    expectedError: 'Error: Last Name is required',
  },
  missingPostalCode: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '',
    expectedError: 'Error: Postal Code is required',
  },
  validCustomer: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '560001',
  },
};