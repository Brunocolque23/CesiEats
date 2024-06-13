import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import livreurModel from "../models/livreurModel.js";
import developModel from "../models/developModel.js";
import restaurantModel from "../models/restaurantModel.js";
import servicetechniqueModel from "../models/servicetechniqueModel.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { ToastContainer, toast } from 'react-toastify'; // Importa 'toast'

dotenv.config();

// Create token
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

// Login user
const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({success: false, message: "User does not exist"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({success: false, message: "Invalid credentials"});
        }
        
        const token = createToken(user._id);
        toast.success(user.role);
        res.json({success: true, token, role: user.role, email: user.email});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"});
    }
}

// Register user
const registerUser = async (req, res) => {
    const {name, email, password, role} = req.body;
    try {
        // Check if user already exists
        const exists = await userModel.findOne({email});
        if (exists) {
            return res.json({success: false, message: "User already exists"});
        }

        // Validate email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({success: false, message: "Please enter a valid email"});
        }
        if (password.length < 8) {
            return res.json({success: false, message: "Please enter a strong password"});
        }

        // Hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({name, email, password: hashedPassword, role});
        const user = await newUser.save();
        
        //console.log(name);
        //console.log(email);
        
        // If role is "restaurateur", create new restaurant for the user
        if (role === "restaurateur") {
            
            const newRestaurant = new restaurantModel({ name: `${name}'s Restaurant`, email,password });
            await newRestaurant.save();
            //console.log(role);
            
        }
        if (role === "livreur") {
            const newLivreur = new livreurModel({ name: name, email,password });
            await newLivreur.save();
            //console.log(role);
            
        }
        if (role === "developtiers") {
            const newDevelop = new developModel({ name: name, email,password });
            await newDevelop.save();
            //console.log(role);
            
        }
        if (role === "servicetechnique") {
            const newServicetechnique = new servicetechniqueModel({ name: name, email,password });
            await newServicetechnique.save();
            //console.log(role);
            
        }
        

        const token = createToken(user._id);
        res.json({success: true, token, role: user.role});

    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"});
    }
}

// Forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        // Recherche de l'utilisateur par email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        // Génération du token de réinitialisation de mot de passe
        const resetToken = crypto.randomBytes(32).toString("hex");
        // const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        const resetPasswordExpire = Date.now() + 24 * 60 * 60 * 1000; // Token expires in 24 hours

        // Enregistrement du token et de la date d'expiration dans la base de données
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = resetPasswordExpire;
        await user.save();

        // Envoi du token de réinitialisation par email
        const resetUrl = `${req.protocol}://localhost:5174/resetpassword/${resetToken}`;
        const message = `You are receiving this email because you have requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: " CESI EATS - Mot de passe oublié ",
            text: message
        };
        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Email sent" });
    } catch (error) {
        console.error("Error occurred in forgotPassword:", error.message);
        res.json({ success: false, message: `Error: ${error.message}` });
    }
}

// Reset password
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Hachage du token
        // const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Recherche de l'utilisateur par le token de réinitialisation de mot de passe
        // console.log(hashedToken)
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({ success: false, message: "Invalid or expired token" });
        }

        // Hachage du nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Mise à jour du mot de passe de l'utilisateur et suppression du token de réinitialisation
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error("Error occurred in resetPassword:", error.message);
        res.json({ success: false, message: `Error: ${error.message}` });
    }
};

// Get user details
const getUserDetails = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password -resetPasswordToken -resetPasswordExpire');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Update user
const updateUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        if (name) user.name = name;
        if (email) {
            if (!validator.isEmail(email)) {
                return res.status(400).json({ message: 'Invalid email' });
            }
            user.email = email;
        }
        if (password) {
            if (password.length < 8) {
                return res.status(400).json({ message: 'Password must be at least 8 characters long' });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        if (role) user.role = role;

        await user.save();
        res.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        console.error("Error occurred in updateUser:", error.message);
        res.status(500).json({ success: false, message: `Error: ${error.message}` });
    }
}

// Delete user
const deleteUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await userModel.findByIdAndDelete(decoded.id);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error occurred in deleteUser:", error.message);
        res.status(500).json({ success: false, message: `Error: ${error.message}` });
    }
}

export { loginUser, registerUser, forgotPassword, resetPassword, getUserDetails, updateUser, deleteUser };
