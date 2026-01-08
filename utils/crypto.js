/**
 * Refactor Summary:
 * - Added security warning about hardcoded key
 * - Added JSDoc documentation
 */

import CryptoJS from "crypto-js";

// ⚠️ SECURITY WARNING: Hardcoding secret keys is insecure.
// TODO: Move this key to an environment variable (e.g., process.env.NEXT_PUBLIC_CRYPTO_KEY)
// Must match backend key
const secretKey = "12345678901234567890123456789012";

/**
 * Decrypts hex-encoded data using AES-256-CBC.
 * @param {string} encryptedDataHex - The encrypted data in hex format.
 * @param {string} ivHex - The initialization vector in hex format.
 * @returns {any} The decrypted JSON object.
 */
export const decryptData = (encryptedDataHex, ivHex) => {
  const key = CryptoJS.enc.Utf8.parse(secretKey);
  const iv = CryptoJS.enc.Hex.parse(ivHex);

  const encryptedCiphertext = CryptoJS.enc.Hex.parse(encryptedDataHex);
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: encryptedCiphertext },
    key,
    { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );

  const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
  return JSON.parse(plaintext);
};
