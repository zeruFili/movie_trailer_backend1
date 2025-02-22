const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User_Model");
require('dotenv').config();


const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const secret = process.env.SECRET_KEY; 
      const decode = jwt.verify(token, secret);
      // valid token
      req.user = await User.findById(decode.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json({ error: "Not authorized" });
    }
  }

  if (!token) {
    res.status(401).json({ error: "Token not found" });
  }
});
const adminValidator = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Protected only for admin" });
  }
};

module.exports = { protect , adminValidator};