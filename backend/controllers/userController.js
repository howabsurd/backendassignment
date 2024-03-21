const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../data/users");
const User = require("../models/userModel");

const secretKey = "secret"; // Change this to a secure secret key

const createToken = (email, role) => {
  return jwt.sign({ email, role }, secretKey, { expiresIn: "3d" });
};

exports.registerUser = async (req, res) => {
  const {
    email,
    password,
    username,
    role,
    profile: { bio, phone, photo, public },
  } = req.body;

  try {
    const user = await User.signup(
      email,
      password,
      username,
      role,
      bio,
      phone,
      photo,
      public
    );

    // create a token
    const token = createToken(email, role);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(email, role);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.signOut = (req, res) => {
  // Clear the token from local storage
  res.clearCookie("token"); // Assuming you're using cookies to store the token
  res.status(200).json({ message: "Signout successful" });
};

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

exports.getProfileapp = async (req, res) => {
  try {
    const { email } = req.user;
    // Search for the user profile in the database
    const userProfile = await User.findOne({ email });
    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }
    res.json(userProfile);
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUserDetails = async (req, res) => {
  const { email } = req.user; // Get email from decoded token
  const {
    name,
    username,
    password,
    role,
    profile: { bio, phone, photo, public },
  } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Update user details
    if (name) user.name = name;
    if (role) user.role = role;
    if (username) user.username = username;
    if (bio) user.profile.bio = bio;
    if (phone) user.profile.phone = phone;
    if (photo) user.profile.photo = photo;
    if (public !== undefined) user.profile.public = public;
    if (password) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save the updated user to the database
    await user.save();

    return res
      .status(200)
      .json({ message: "User details updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
};

exports.getAllusers = async (req, res) => {
  try {
    const { role } = req.user;

    if (role === "admin") {
      const users = await User.find();
      return res.status(200).json({ users });
    }

    const publicUsers = await User.find({ "profile.public": true });
    return res.status(200).json({ users: publicUsers });
  } catch (error) {
    console.error("Error retrieving users:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
