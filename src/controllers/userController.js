import prisma from '../db/db.js';
import { generateRandomNumber } from '../utility/genarateRandomNumber.js';
import redis from '../db/redishClient.js';
import { generateToken } from '../utility/jwtUtils.js';

export const sendOtp = async (req, res) => {
  const { mobile } = req.body;

  try {
    if (!mobile) {
      return res.status(400).json({ success: false, error: "Mobile number is required" });
    }

    const user = await prisma.user.findFirst({ where: { mobile } });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found or wrong number" });
    }

    const otp = generateRandomNumber(4); 
    await redis.setEx(`otp:${mobile}`, 300, otp); 

    res.status(200).json({ success: true, message: "OTP sent successfully", otp }); 
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const verifyOtpLogin = async (req, res) => {
  const { mobile, otp } = req.body;

  try {
    if (!mobile || !otp) {
      return res.status(400).json({ success: false, error: "Mobile and OTP are required" });
    }
  const user = await prisma.user.findUnique({ where: { mobile } });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    const storedOtp = await redis.get(`otp:${mobile}`);

    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

  

    await redis.del(`otp:${mobile}`); 
    
    const token = await generateToken({ user_id : user.user_id, mobile: user.mobile });

    res.status(200).json({
      success: true,
      message: "Login successful via OTP",
      token,
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


export const logoutUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (token) {
      await redis.del(token); 
    }
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
     res.status(500).json({ success: false, message: 'Unable To Logout !' ,error:error.message});

  }
};

export const createUser = async (req, res) => {
  const { name, email, mobile } = req.body;

  try {
    if (!name || !email || !mobile) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { mobile} });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        mobile
      },
    });

    res.status(201).json({ success: true, message: 'User registered successfully', data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
       where: {
    del: false
  }
  });

    if (!users.length) {
      return res.status(200).json({success:false, message: "No users found " });
    }

    res.status(200).json({success:true,
      message: `Found ${users.length} user${users.length > 1 ? 's' : ''} `,
      data: users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({success:false, error: error.message});
  }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

  try {
      if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }
        await softDelete('user', 'user_id', parseInt(id));
    

    res.status(200).json({success:true,
      message: "User has been deleted "
    });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(404).json({success:false, error: "Cannot delete — user not found " });
  }
};
