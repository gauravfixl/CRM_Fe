import { axiosInstance as axios } from "@/lib/axios";

/**
 * Fetches all products for a specific firm.
 * @param {string} firmId - Firm ID.
 */
export const getAllProducts = async (firmId) => {
  const url = `/product/getAllProducts/${firmId}`;
  const response = await axios.get(url);
  return response;
};

/**
 * Creates a new product.
 * @param {Object} form - Product data.
 */
export const createProduct = async (form) => {
  const url = `/product/createProduct`;
  const response = await axios.post(url, form);
  return response;
};

/**
 * Updates a product by ID.
 * @param {string} id - Product ID.
 * @param {Object} form - Updated product data.
 */
export const updateProduct = async (id, form) => {
  const url = `/product/updateProduct/${id}`;
  const response = await axios.patch(url, form);
  return response;
};

/**
 * Soft deletes a product by ID.
 * @param {string} id - Product ID.
 */
export const softDeleteProduct = async (id) => {
  const url = `/product/softDeleteProduct/${id}`;
  const response = await axios.patch(url, { delete: true }); // Assuming delete field in body as per controller
  return response;
};

/**
 * Hard deletes a product by ID.
 * @param {string} id - Product ID.
 */
export const deleteProduct = async (id) => {
  const url = `/product/deleteProduct/${id}`;
  const response = await axios.delete(url);
  return response;
};

/**
 * Fetches single product details.
 * @param {string} id - Product ID.
 */
export const getProductDetails = async (id) => {
  const url = `/product/getProductDetails/${id}`;
  const response = await axios.get(url);
  return response;
};
