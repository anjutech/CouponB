import { nanoid } from 'nanoid';
import logger from '../utility/logger.js';
import prisma from '../db/db.js';
import { softDelete } from '../utility/softDelete.js';
const BASE_URL = process.env.BASE_URL;
export const createCoupon = async (req, res) => {
  const { product_id, product_name, remarks, quantity } = req.body;
  const { user_id } = req.user;

  try {
    if (!product_id || !product_name || !quantity ||!remarks) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }
    const productExists = await prisma.product.findFirst({
      where: {
        product_id: parseInt(product_id)
      }
    });
    if (!productExists) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    const find = await prisma.user.findUnique({ where: { user_id } });
    if (!find) {
      return res.status(404).json({ success: false, message: "Created by details not found!" });
    }
    const couponHistory = await prisma.coupon_History.create({
      data: {
        created_by: parseInt(user_id),
        created_by_username: find.name,
        product_id: parseInt(product_id),
        product_name,
        quantity:parseInt(quantity),
        remarks
      }
    });


    const generateUniqueCodes = async (count) => {
      const codes = new Set();

      while (codes.size < count) {
        const newCode = nanoid(10).toUpperCase();

        const existingCoupon = await prisma.coupon.findFirst({
          where: { couponCode: newCode }
        });

        if (!existingCoupon) {
          codes.add(newCode);
        }
      }

      return Array.from(codes);
    };
    const generateUniqueCodeId = async () => {
      while (true) {
        const codeId = nanoid(10).toUpperCase();
        const existing = await prisma.coupon.findFirst({
          where: { CodeId: codeId }
        });

        if (!existing) return codeId;
      }
    };

    const uniqueCouponCodes = await generateUniqueCodes(quantity);
    const CodeId = await generateUniqueCodeId();
    const formattedUrl = `${BASE_URL}/api/coupon/get_product/${CodeId}`;
    const couponsData = uniqueCouponCodes.map(code => ({
      couponCode: code,
      couponUrl: formattedUrl,
      CodeId: CodeId,
      product_id: parseInt(product_id),
      product_name,
      created_by: parseInt(user_id),
      created_by_username: find.name,
      coupon_history_id: couponHistory.coupon_history_id,
      remarks
    }));
    logger.info(`${quantity} Coupons are generated of product ${product_name}`)
    await prisma.coupon.createMany({ data: couponsData, skipDuplicates: true });

    res.status(201).json({
      success: true,
      message: 'Coupon History and Coupons created successfully',
      coupon: couponsData,
      couponHistory: couponHistory
    });
  } catch (error) {
    logger.error('Error creating coupons:', {
      error: error.message,
      stack: error.stack,
      product_id: req.body.product_id,
      created_by: req.body.created_by
    });
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getProductDetailsByUniqueID = async (req, res) => {
  const { CodeId } = req.params;
  try {
    if (!CodeId) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }
    const batch = await prisma.coupon.findUnique({
      where: { CodeId: CodeId }
    });
    if (!batch) return res.status(404).json({ success: false, message: 'RedeemCode not found' });
    res.status(201).json({ success: true, batch });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
export const getAllActiveCoupons = async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      where: { del: false }
    });
    res.status(201).json({ success: true, message: 'SuccessFully Fetch Data !', data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const getAllActiveCouponsWithQuantity = async (req, res) => {
  try {
    const coupons = await prisma.coupon_History.findMany({
      where: { del: false }
    });
    res.status(201).json({ success: true, message: 'SuccessFully Fetch Data !', data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createScanCoupon = async (req, res) => {
  try {
    const {
      influencer_customer_name,
      scanned_By_name,
      mobile,
      product_id,
      product_name,
      coupon_history_id,
      CodeId,
      couponCode,
      couponUrl,
      paymentType,
      accountHolder,
      accountNumber,
      ifscCode,
      bankName,
      upiID,
      upiProvider
    } = req.body;

    if (!influencer_customer_name || !scanned_By_name || !mobile ||
      !product_id || !product_name || !couponCode) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const coupon = await prisma.coupon.findFirst({
      where: { couponCode, del: false }
    });
    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: 'Invalid coupon code'
      });
    }
    const existingRecord = await prisma.scanned_by.findUnique({
      where: { mobile }
    });

    let scannedBy;

    if (existingRecord) {
      // Record exists, update it
      scannedBy = await prisma.scanned_by.update({
        where: { mobile },
        data: {
          influencer_customer_name,
          scanned_By_name,
          paymentType,
          accountHolder,
          accountNumber,
          ifscCode,
          bankName,
          upiID,
          upiProvider
        }
      });
    } else {
      // Record doesn't exist, create it
      scannedBy = await prisma.scanned_by.create({
        data: {
          influencer_customer_name,
          scanned_By_name,
          mobile,
          paymentType,
          accountHolder,
          accountNumber,
          ifscCode,
          bankName,
          upiID,
          upiProvider
        }
      });
    }

    const existingResult = await prisma.coupon_scanned_history.findUnique({
      where: { mobile }
    });
    if (!existingResult) {
      await prisma.coupon_scanned_history.create({
        data: {
          scannedBy_id: scannedBy.scannedBy_id,
          product_id: parseInt(product_id),
          product_name,
          coupon_history_id: coupon_history_id,
          CodeId,
          couponCode,
          mobile,
          couponUrl,
          paymentType,
          accountHolder,
          accountNumber,
          ifscCode,
          bankName,
          upiID,
          upiProvider
        },
        include: {
          scannedBy: true
        }
      });
    } else {
      return res.status(404).json({
        success: false,
        error: 'Mobile Number is Already Used Scanner and Coupon Code Before'
      });
    }
    await prisma.coupon.update({
      where: { couponCode },
      data: {
        del: true
      }
    });
    logger.info(`Coupon scanned successfully`, {
      couponCode,
      mobile,
      product_id,
      scanned_by: scanned_By_name
    });

    res.status(201).json({
      success: true,
      message: 'Coupon scan created successfully',
    });

  } catch (error) {
    logger.error('Error creating coupon scan:', {
      error: error.message,
      couponCode: req.body.couponCode,
      mobile: req.body.mobile
    });
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
export const deleteCouponFromCouponHistory = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ success: false, error: "Product ID is required" });
    }

    await softDelete('coupon_History', 'coupon_history_id', parseInt(id));

    res.status(200).json({ success: true, message: "Successfully soft deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};