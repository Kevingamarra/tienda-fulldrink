import { verifyToken } from "../utils/jwt.js";

export function adminAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    let token = null;

    if (
      authorization &&
      authorization.startsWith("Bearer ")
    ) {
      token = authorization.slice(7);
    }

    if (!token) {
      token = req.cookies?.adminToken;
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "No autenticado",
      });
    }

    const payload = verifyToken(token);

    if (payload.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Acceso denegado",
      });
    }

    req.admin = payload;

    next();
  } catch {
    return res.status(401).json({
      status: "error",
      message: "Sesión inválida o vencida",
    });
  }
}
