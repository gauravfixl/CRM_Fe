import { create } from "ipfs-http-client";

// Infura example (you can swap to Pinata/Web3.Storage etc.)
// Note: Infura requires authentication now, so this might fail without project ID/Secret.
const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

/**
 * Uploads a file to IPFS.
 * @param {File} file - The file to upload.
 * @returns {Promise<string>} The IPFS URL of the uploaded file.
 */
export const uploadToIPFS = async (file: File): Promise<string> => {
  try {
    const added = await client.add(file);
    return `https://ipfs.infura.io/ipfs/${added.path}`;
  } catch (err) {
    console.error("IPFS upload error:", err);
    return "";
  }
};
