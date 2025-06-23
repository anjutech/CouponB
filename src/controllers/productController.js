import logger from '../utility/logger.js';

import prisma from '../db/db.js';
import { softDelete } from '../utility/softDelete.js';
// Crud for Product
// Create
export const create = async (req, res) => {
  const { product_name, points, remarks } = req.body;
  const { user_id} = req.user;

  try {
    if (!product_name || !points || !remarks) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const find = await prisma.user.findUnique({ where: { user_id } });

    if (!find) {
      return res.status(404).json({ success: false, message: "Created by details not found!" });
    }

    const product = await prisma.product.create({
      data: {
        created_by: user_id,
        created_by_username: find.name,
        product_name,
        points,
        remarks,
      },
    });

    logger.info(`New Product Created: ${product_name}`);
    res.status(201).json({ success: true, message: "Successfully listed product!", data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({success:false, error: "Product ID is required" });
    }

    await softDelete('product', 'product_id', parseInt(id));

    res.status(200).json({ success:true,message: "Successfully soft deleted" });
  } catch (err) {
    res.status(500).json({success:false, error: err.message });
  }
};
// Read All
export const getAllProducts = async (req, res) => {
  try {
const products = await prisma.product.findMany({
  where: {
    del: false
  }
});
    if (!products.length) {
      return res.status(200).json({success:false,
        message: "No products found ",
        data: []
      });
    }

    res.status(200).json({success:true,
      message: `Found ${products.length} product${products.length > 1 ? 's' : ''} `,
      data: products
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({success:false,
      error: "Something went wrong while fetching products ",
      details: err.message
    });
  }
};

// Read One
export const getProductById = async (req, res) => {
      const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({success:false, error: "All fields are required" });
    }
    const product = await prisma.product.findUnique({
      where: { product_id: parseInt(id) },
    });
    if (!product) return res.status(404).json({success:false, error: 'Product not found' });
    res.status(200).json({success:true,message:"Successfully Fetched !",product});
  } catch (err) {
    res.status(500).json({success:false, error: err.message });
  }
};

export const update = async (req, res) => {
  const {  product_id,created_by, created_by_username, product_name, points, remarks } = req.body;

  try {
    if (!product_id || !created_by || !created_by_username || !product_name || !points || !remarks) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { product_id: parseInt(product_id) },
    });

    if (!existingProduct) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    const updatedProduct = await prisma.product.update({
      where: { product_id: parseInt(product_id) },
      data: { created_by, created_by_username, product_name, points, remarks },
    });

    logger.info(`Product Updated ${product_name}`);
    res.status(200).json({ success: true, message: "Successfully Updated Product!", data: updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


