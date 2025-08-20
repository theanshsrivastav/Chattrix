import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


export const signUp = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        if(!fullName || !email || !password || !bio){
            return res.json({success: false, message: "Missing Details"});
        }
        // Check if user exists
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.json({ message: 'User already exists' });
        }

        // Hash password----------encrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user----------------adding new user to the database
        const user = new User({
        fullName,
        email,
        password: hashedPassword,
        bio
        });

        await user.save();              // saving user to db

        const token = generateToken(user._id);
        res.json({success: true, userData: user, token, message:"Account created successfully"});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check user exists
        const userData = await User.findOne({ email });

        // Check password
        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) return res.json({success:false, message: 'Invalid email or password' });

        // Generate JWT
        const token = generateToken(userData._id);
        res.json({success: true, userData, token, message:"Login successful"});

    } catch (error) {
        console.error(error.message);
        res.json({success: false, message: error.message });
    }
};


// controller to check if user is authenticated
export const checkAuth = (req, res)=>{
    res.json({success: true, user: req.user});
}

// Controller to update profile details
export const updateProfile = async (req, res)=>{
    try {
        const {profilePic, bio, fullName} = req.body;

        const userId = req.user._id;
        let updatedUser;

        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new: true});
        } else{
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName}, {new: true});
        }
        res.json({success: true, user: updatedUser});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, user: error.message});
    }
}

