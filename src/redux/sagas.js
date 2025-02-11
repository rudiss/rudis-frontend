import { call, put, takeLatest, all } from 'redux-saga/effects';
import * as Api from './api';
import { ADDRESS_BALANCE, ADDRESS_TRANSACTIONS } from './actions';

/**
 * Generic saga to handle API requests
 *
 * 1. Create a generic saga handler to eliminate duplication.
 * 2. Pass API function & action types dynamically to make it reusable.
 * 3. Refactor the existing sagas to use the common handler.
 * 4. Ensure error handling remains consistent.
 *
 * @param {Object} action - The action object dispatched from a component.
 * @param {Function} apiFunction - The API function to be called.
 */

// Generic saga to handle API requests
function* handleApiCall(action, apiFunction) {
  const { payload, type } = action;

  try {
    yield put({ type: `${type}_REQUEST` });

    // Execute the API call dynamically
    const response = yield call(apiFunction, payload);

    yield put({
      type: `${type}_SUCCESS`,
      payload,
      response: response?.data,
    });
  } catch (error) {
    yield put({ type: `${type}_ERROR` });
  }
}

// Attach API calls dynamically
function* loadAddressBalance(action) {
  yield handleApiCall(action, Api.getAddressBalance);
}

function* loadAddressTransactions(action) {
  yield handleApiCall(action, Api.getAddressTransactions);
}

// Root Saga
export default function* sagas() {
  yield all([
    takeLatest(ADDRESS_BALANCE, loadAddressBalance),
    takeLatest(ADDRESS_TRANSACTIONS, loadAddressTransactions),
    // Add new sagas here
  ]);
}
