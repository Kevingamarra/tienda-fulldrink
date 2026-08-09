import jwt from "jsonwebtoken";

export function generateToken(admin) {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    }
  );
}

export function verifyToken(token) {
  return jwt.verify(
    token,
    process.env.JWT_SECRET
  );
}
