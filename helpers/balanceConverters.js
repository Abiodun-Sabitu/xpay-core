// balanceHelpers.js
import Decimal from "decimal.js";

/**
 * Converts a balance string from the database to a Decimal for safe arithmetic.
 * @param {string} balanceString - The balance string fetched from the database.
 * @return {Decimal} - A Decimal object representing the balance.
 */
export function numeralize(amountInString) {
  return new Decimal(amountInString);
}

/**
 * Converts a Decimal balance to a string for storage in the database.
 * @param {Decimal} decimalValue - The Decimal representation of the balance.
 * @return {string} - The balance formatted as a string with two decimal places.
 */
export function deNumeralize(decimalValue) {
  return decimalValue.toFixed(2); // Ensures the balance is a string with two decimal places.
}

/**
 * Provides the standard opening balance for new wallets as a formatted string.
 * @return {string} - The opening balance as a string formatted to two decimal places.
 */
export function getOpeningBalance() {
  const openingBalance = new Decimal(0.0);
  return openingBalance.toFixed(2); // "0.00"
}
