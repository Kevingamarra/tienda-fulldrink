import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import productsRouter from "./routes/products.routes.js";
import ordersRouter from "./routes/orders.routes.js";
import adminRouter from "./routes/admin.routes.js";
import uploadsRouter from "./routes/uploads.routes.js";
import deliveryRouter from "./routes/delivery.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://tienda-fulldrink.onrender.com",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Origen no permitido por CORS")
      );
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Full Drinks API funcionando",
  });
});

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/admin", adminRouter);
app.use("/api/uploads", uploadsRouter);
app.use("/api/delivery", deliveryRouter);

export default app;
