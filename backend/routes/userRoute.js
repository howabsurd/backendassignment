const express = require("express");
const router = express.Router();
const {
  registerUser,
  signOut,
  loginUser,
  getProfileapp,
  verifyToken,
  updateUserDetails,
  getAllusers,
} = require("../controllers/userController");

// Register new user
router.post("/register", registerUser);
router.post("/signout", signOut);
router.post("/login", loginUser);
router.get("/profile", verifyToken, getProfileapp);
router.put("/profile", verifyToken, updateUserDetails);
router.get("/allusers", verifyToken, getAllusers);

module.exports = router;
