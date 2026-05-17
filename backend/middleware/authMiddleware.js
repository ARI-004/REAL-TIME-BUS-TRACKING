/** @format */
import jwt from "jsonwebtoken";
import Bus from "../models/bus.js";

export const protectBus = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.bus = await Bus.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Token invalid or expired" });
  }
};
