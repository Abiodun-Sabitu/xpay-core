// accountNumberGenerator.js
import crypto from "crypto";

export function generateAccountNumber(currency) {
  let prefix;
  switch (currency) {
    case "NGN":
      prefix = "001";
      break;
    case "USD":
      prefix = "002";
      break;
    case "GBP":
      prefix = "003";
      break;
    default:
      throw new Error("Unsupported currency");
  }
  // generate random 7 digits number and affix to the relevant prefix
  const randomNumber = crypto.randomInt(0, 9999999).toString().padStart(7, "0");
  return `${prefix}${randomNumber}`;
}
