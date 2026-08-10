import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";
import { generateToken } from "../utils/jwt.js";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email y contraseña son obligatorios",
      });
    }

    const admin = await Admin.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!admin) {
      return res.status(401).json({
        status: "error",
        message: "Credenciales inválidas",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      admin.password
    );

    if (!validPassword) {
      return res.status(401).json({
        status: "error",
        message: "Credenciales inválidas",
      });
    }

    const token = generateToken(admin);

    const isProduction =
      process.env.NODE_ENV === "production";

    res.cookie("adminToken", token, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      maxAge: 8 * 60 * 60 * 1000,
    });

    res.json({
      status: "success",
      message: "Login correcto",
      payload: {
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const currentAdmin = async (req, res) => {
  res.json({
    status: "success",
    payload: req.admin,
  });
};

export const logoutAdmin = async (req, res) => {
  const isProduction =
    process.env.NODE_ENV === "production";

  res.clearCookie("adminToken", {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });

  res.json({
    status: "success",
    message: "Sesión cerrada",
  });
};
