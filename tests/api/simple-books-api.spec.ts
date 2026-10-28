import { test, expect } from '@playwright/test';
import { randomBytes } from 'node:crypto';
import { getEnv } from '../../utils';
import { generateRandomEmail } from '../../utils/dataGenerator';

const BASE_URL = getEnv('BOOKS_API_BASE_URL', 'https://simple-books-api.click');

test.describe('Simple Books API - Health Check', () => {
  test('TC_API_01 - Verify API service health status (GET /status)', async ({ request }) => {
    // 1. Send GET request to /status
    const response = await request.get(`${BASE_URL}/status`);

    // 2. Validate HTTP response status code is 200 OK
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    // 3. Validate response body contains status 'OK'
    const body = await response.json();
    expect(body).toEqual({ status: 'OK' });
    expect(body.status).toBe('OK');
  });
});

test('TC_API_02 - Retrieve list of books with type and limit query filters (GET /books)', async ({ request }) => {
    // 1. Send GET request to /books with query parameters: type=fiction and limit=2
    const response = await request.get(`${BASE_URL}/books`, {
      params: {
        type: 'fiction',
        limit: 2,
      },
    });

    // 2. Assert HTTP response status code is 200 OK
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    // 3. Verify returned array length is <= 2 and all items have type 'fiction'
    const books = await response.json();

    expect(Array.isArray(books)).toBeTruthy();
    expect(books.length).toBeGreaterThan(0);
    expect(books.length).toBeLessThanOrEqual(2);

    for (const book of books) {
      expect(book).toHaveProperty('id');
      expect(book).toHaveProperty('name');
      expect(book.type).toBe('fiction');
    }
  });
  test('TC_API_03 - Retrieve single book by valid ID and verify schema (GET /books/:bookId)', async ({ request }) => {
    const bookId = 1;

    // 1. Send GET request to /books/1
    const response = await request.get(`${BASE_URL}/books/${bookId}`);

    // 2. Validate HTTP response status code is 200 OK
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    // 3. Validate response schema includes id, name, author, isbn, type, price, current-stock, available
    const book = await response.json();

    // Metadata value and identifier verification
    expect(book.id).toBe(bookId);
    expect(book.name).toBe('The Russian');

    // Field type & contract validation
    expect(typeof book.name).toBe('string');
    expect(typeof book.author).toBe('string');
    expect(typeof book.isbn).toBe('string');
    expect(typeof book.type).toBe('string');
    expect(typeof book.price).toBe('number');
    expect(typeof book['current-stock']).toBe('number');
    expect(typeof book.available).toBe('boolean');

    // Boundary / sanity checks
    expect(book.price).toBeGreaterThan(0);
    expect(book['current-stock']).toBeGreaterThanOrEqual(0);
  });
test('TC_API_04 - Retrieve book with non-existent ID (GET /books/:bookId - Negative)', async ({ request }) => {
    const invalidBookId = 99999;

    // 1. Send GET request to /books/99999
    const response = await request.get(`${BASE_URL}/books/${invalidBookId}`);

    // 2. Assert HTTP response status code is 404 Not Found
    expect(response.status()).toBe(404);
    expect(response.ok()).toBeFalsy();

    // 3. Validate error response payload
    const errorBody = await response.json();
    expect(errorBody).toHaveProperty('error');
    expect(errorBody.error).toBe(`No book with id ${invalidBookId}`);
    expect(errorBody).toEqual({ error: 'No book with id 99999' });
  });
  test('TC_API_05 - Register new API client and obtain Bearer access token (POST /api-clients)', async ({ request }) => {
    // 1. Generate unique clientName and clientEmail
    const uniqueEmail = generateRandomEmail('test', 'example.com');
    const clientPayload = {
      clientName: 'QA Automation',
      clientEmail: uniqueEmail,
    };

    // 2. Send POST request to /api-clients with payload
    const response = await request.post(`${BASE_URL}/api-clients`, {
      data: clientPayload,
    });

    // 3. Assert status code 201 Created
    expect(response.status()).toBe(201);
    expect(response.ok()).toBeTruthy();

    // 4. Extract and verify accessToken is a non-empty string
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('accessToken');
    expect(typeof responseBody.accessToken).toBe('string');
    expect(responseBody.accessToken.trim().length).toBeGreaterThan(0);
  });
  test('TC_API_06 - Register client with already registered email (POST /api-clients - Duplicate)', async ({ request }) => {
    // Pre-condition: Register a client to guarantee the email already exists
    const existingEmail = generateRandomEmail('duplicate.client', 'example.com');
    const clientPayload = {
      clientName: 'QA Automation',
      clientEmail: existingEmail,
    };

    const initialRegistration = await request.post(`${BASE_URL}/api-clients`, {
      data: clientPayload,
    });
    expect(initialRegistration.status()).toBe(201);

    // 1. Send POST request to /api-clients with the existing email
    const duplicateResponse = await request.post(`${BASE_URL}/api-clients`, {
      data: clientPayload,
    });

    // 2. Assert HTTP status code is 409 Conflict
    expect(duplicateResponse.status()).toBe(409);
    expect(duplicateResponse.ok()).toBeFalsy();

    // 3. Verify error message indicates duplicate client
    const errorBody = await duplicateResponse.json();
    expect(errorBody).toHaveProperty('error');
    expect(errorBody.error).toBe('API client already registered. Try a different email.');
    expect(errorBody).toEqual({
      error: 'API client already registered. Try a different email.',
    });
  });
  test('TC_API_07 - Create order for an in-stock book with valid Bearer token (POST /orders)', async ({ request }) => {
  // Precondition: Register a client to obtain a fresh access token
  const uniqueEmail = `qa_order_${Date.now()}_${Math.floor(Math.random() * 1000)}@example.com`;
  const authResponse = await request.post(`${BASE_URL}/api-clients`, {
    data: {
      clientName: 'QA Automation',
      clientEmail: uniqueEmail,
    },
  });

  expect(authResponse.status()).toBe(201);
  const authBody = await authResponse.json();
  const accessToken = authBody.accessToken; // Declared and defined locally

  const orderPayload = {
    bookId: 1,
    customerName: 'Alex',
  };

  // 1. Set Authorization header: 'Bearer <token>'
  // 2. Send POST request to /orders with bookId and customerName
  const response = await request.post(`${BASE_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: orderPayload,
  });

  // 3. Assert status code 201 Created
  expect(response.status()).toBe(201);
  expect(response.ok()).toBeTruthy();

  // 4. Verify response body contains created: true and orderId string
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('created', true);
  expect(responseBody.created).toBe(true);
  expect(responseBody).toHaveProperty('orderId');
  expect(typeof responseBody.orderId).toBe('string');
  expect(responseBody.orderId.trim().length).toBeGreaterThan(0);
});
test('TC_API_08 - Submit order without Authorization Bearer token (POST /orders - Tricky/Auth)', async ({ request }) => {
    const orderPayload = {
      bookId: 1,
      customerName: 'Alex',
    };

    // 1. Send POST request to /orders with valid payload but missing Authorization header
    const response = await request.post(`${BASE_URL}/orders`, {
      data: orderPayload,
    });

    // 2. Assert HTTP response status code is 401 Unauthorized
    expect(response.status()).toBe(401);
    expect(response.ok()).toBeFalsy();

    // 3. Verify error message indicates missing Authorization header
    const errorBody = await response.json();
    expect(errorBody).toHaveProperty('error');
    expect(errorBody.error).toBe('Missing Authorization header.');
  });
  test('TC_API_09 - Retrieve all customer orders using Bearer token (GET /orders)', async ({ request }) => {
    // 1. Generate guaranteed unique client credentials (prevents 409 duplicate collisions)
    const uniqueId = randomBytes(4).toString('hex');
    const uniqueEmail = `qa_orders_${Date.now()}_${uniqueId}@example.com`;

    // 2. Register client and obtain Bearer access token
    const authResponse = await request.post(`${BASE_URL}/api-clients`, {
      data: {
        clientName: `QA_${uniqueId}`,
        clientEmail: uniqueEmail,
      },
    });

    // Guard: Verify registration succeeded before proceeding
    if (authResponse.status() !== 201) {
      const err = await authResponse.text();
      throw new Error(`Client registration failed with status ${authResponse.status()}: ${err}`);
    }
    expect(authResponse.status()).toBe(201);

    const authBody = await authResponse.json();
    const accessToken = authBody.accessToken;
    expect(accessToken, 'Access token must be present').toBeTruthy();

    // 3. Create an order as a precondition so orders list contains at least one record
    const createOrderResponse = await request.post(`${BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        bookId: 1,
        customerName: 'Alex',
      },
    });

    // Guard: Print exact response body if creation fails
    if (createOrderResponse.status() !== 201) {
      const err = await createOrderResponse.text();
      throw new Error(`Order creation failed with status ${createOrderResponse.status()}: ${err}`);
    }
    expect(createOrderResponse.status()).toBe(201);

    const { orderId } = await createOrderResponse.json();
    expect(orderId).toBeDefined();

    // 4. Send GET request to /orders with Authorization header
    const response = await request.get(`${BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // 5. Assert status code 200 OK
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    // 6. Verify array contains the created orderId
    const orders = await response.json();
    expect(Array.isArray(orders)).toBeTruthy();
    expect(orders.length).toBeGreaterThanOrEqual(1);

    const matchedOrder = orders.find((order: { id: string }) => order.id === orderId);
    expect(matchedOrder).toBeDefined();
    expect(matchedOrder).toMatchObject({
      id: orderId,
      bookId: 1,
      customerName: 'Alex',
    });
  });
  test('TC_API_10 - Retrieve specific order by orderId (GET /orders/:orderId)', async ({ request }) => {
    // 1. Precondition: Register client to acquire a fresh Bearer token
    const uniqueId = randomBytes(4).toString('hex');
    const clientEmail = `qa_order_${Date.now()}_${uniqueId}@example.com`;

    const authResponse = await request.post(`${BASE_URL}/api-clients`, {
      data: {
        clientName: `Client_${uniqueId}`,
        clientEmail,
      },
    });
    expect(authResponse.status()).toBe(201);
    const { accessToken } = await authResponse.json();

    // 2. Precondition: Create an order to retrieve
    const targetBookId = 1;
    const targetCustomerName = 'Alex';

    const createResponse = await request.post(`${BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        bookId: targetBookId,
        customerName: targetCustomerName,
      },
    });
    expect(createResponse.status()).toBe(201);
    const { orderId } = await createResponse.json();
    expect(orderId).toBeDefined();

    // 3. Send GET request to /orders/:orderId with Authorization header
    const response = await request.get(`${BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // 4. Assert status code 200 OK
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    // 5. Verify response fields match the order schema
    const orderDetails = await response.json();
    expect(orderDetails.id).toBe(orderId);
    expect(orderDetails.bookId).toBe(targetBookId);
    expect(orderDetails.customerName).toBe(targetCustomerName);
    expect(orderDetails.quantity).toBe(1);
    expect(typeof orderDetails.timestamp).toBe('number');
  });
  test('TC_API_11 - Update customer name on existing order (PATCH /orders/:orderId - Tricky)', async ({ request }) => {
    // 1. Precondition: Register client to acquire a fresh Bearer token
    const uniqueId = randomBytes(4).toString('hex');
    const clientEmail = `qa_patch_${Date.now()}_${uniqueId}@example.com`;

    const authResponse = await request.post(`${BASE_URL}/api-clients`, {
      data: {
        clientName: `Client_${uniqueId}`,
        clientEmail,
      },
    });
    expect(authResponse.status()).toBe(201);
    const { accessToken } = await authResponse.json();

    // 2. Precondition: Create an initial order to update
    const createResponse = await request.post(`${BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        bookId: 1,
        customerName: 'Alex',
      },
    });
    expect(createResponse.status()).toBe(201);
    const { orderId } = await createResponse.json();
    expect(orderId).toBeDefined();

    // 3. Step 1: Send PATCH request to /orders/:orderId with updated customerName in body
    const updatedCustomerName = 'Alex Updated';
    const patchResponse = await request.patch(`${BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        customerName: updatedCustomerName,
      },
    });

    // 4. Step 2: Assert HTTP status code 204 No Content
    expect(patchResponse.status()).toBe(204);

    // 5. Step 3: Send GET /orders/:orderId to verify updated customerName persisted
    const getResponse = await request.get(`${BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    expect(getResponse.status()).toBe(200);

    const orderDetails = await getResponse.json();
    expect(orderDetails.id).toBe(orderId);
    expect(orderDetails.customerName).toBe(updatedCustomerName);
    expect(orderDetails.bookId).toBe(1);
  });
  test('TC_API_12 - Delete order by orderId (DELETE /orders/:orderId - Tricky/State)', async ({ request }) => {
    // 1. Precondition: Register client to acquire a fresh Bearer token
    const uniqueId = randomBytes(4).toString('hex');
    const clientEmail = `qa_delete_${Date.now()}_${uniqueId}@example.com`;

    const authResponse = await request.post(`${BASE_URL}/api-clients`, {
      data: {
        clientName: `Client_${uniqueId}`,
        clientEmail,
      },
    });
    expect(authResponse.status()).toBe(201);
    const { accessToken } = await authResponse.json();

    // 2. Precondition: Create an order to delete
    const createResponse = await request.post(`${BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        bookId: 1,
        customerName: 'Alex',
      },
    });
    expect(createResponse.status()).toBe(201);
    const { orderId } = await createResponse.json();
    expect(orderId).toBeDefined();

    // 3. Step 1: Send DELETE request to /orders/:orderId with Authorization header
    const deleteResponse = await request.delete(`${BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // 4. Step 2: Assert HTTP status code 204 No Content
    expect(deleteResponse.status()).toBe(204);

    // 5. Step 3: Send GET /orders/:orderId to verify order no longer exists
    const getResponse = await request.get(`${BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // 6. Assert subsequent GET returns 404 Not Found
    expect(getResponse.status()).toBe(404);
    expect(getResponse.ok()).toBeFalsy();

    const errorBody = await getResponse.json();
    expect(errorBody).toHaveProperty('error');
    expect(errorBody.error).toBe(`No order with id ${orderId}.`);
  });
  test('TC_API_13 - Delete already deleted order (DELETE /orders/:orderId - Idempotency/Negative)', async ({ request }) => {
    // 1. Precondition: Register client to acquire a fresh Bearer token
    const uniqueId = randomBytes(4).toString('hex');
    const clientEmail = `qa_idempotent_${Date.now()}_${uniqueId}@example.com`;

    const authResponse = await request.post(`${BASE_URL}/api-clients`, {
      data: {
        clientName: `Client_${uniqueId}`,
        clientEmail,
      },
    });
    expect(authResponse.status()).toBe(201);
    const { accessToken } = await authResponse.json();

    // 2. Precondition: Create an order
    const createResponse = await request.post(`${BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        bookId: 1,
        customerName: 'Alex',
      },
    });
    expect(createResponse.status()).toBe(201);
    const { orderId } = await createResponse.json();
    expect(orderId).toBeDefined();

    // 3. Precondition: Perform initial deletion (Order is now deleted)
    const initialDeleteResponse = await request.delete(`${BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    expect(initialDeleteResponse.status()).toBe(204);

    // 4. Step 1: Send duplicate DELETE request to /orders/:orderId with Authorization header
    const duplicateDeleteResponse = await request.delete(`${BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // 5. Step 2: Assert HTTP status code is 404 Not Found
    expect(duplicateDeleteResponse.status()).toBe(404);
    expect(duplicateDeleteResponse.ok()).toBeFalsy();

    // 6. Step 3: Verify error response indicates non-existent order
    const errorBody = await duplicateDeleteResponse.json();
    expect(errorBody).toHaveProperty('error');
    expect(errorBody.error).toBe(`No order with id ${orderId}.`);
    expect(errorBody).toEqual({
      error: `No order with id ${orderId}.`,
    });
  });
