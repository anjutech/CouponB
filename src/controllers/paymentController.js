import { PrismaClient,PaymentType } from '@prisma/client';
const prisma = new PrismaClient();


export const payment = async (req, res) => {
  const {
    paymentType,
    accountHolder,
    accountNumber,
    ifscCode,
    bankName,
    upiID,
    upiProvider,
    couponCode
  } = req.body;

  try {
    if (!paymentType) {
      return res.status(400).json({success:false, error: "Payment type is required" });
    }

    if (!Object.values(PaymentType).includes(paymentType)) {
      return res.status(400).json({ success:false,
        error: "Invalid payment type. Must be one of: " + Object.values(PaymentType).join(', ')
      });
    }

    if (paymentType === PaymentType.BANK) {
      if (!accountHolder || !accountNumber || !ifscCode || !bankName) {
        return res.status(400).json({ success:false,error: "All bank fields are required" });
      }
    } else if (paymentType === PaymentType.UPI) {
      if (!upiID || !upiProvider) {
        return res.status(400).json({success:false, error: "UPI ID and Provider are required" });
      }
    } 

    const payment = await prisma.payments.create({
      data: {
        paymentType,
        accountHolder,
        accountNumber,
        ifscCode,
        bankName,
        upiID,
        upiProvider,
        couponCode
      }
    });

    res.status(201).json({success:true,
      message: 'Payment recorded successfully.',
      data: payment
    });
  } catch (err) {
    res.status(500).json({success:false, error: err.message });
  }
};