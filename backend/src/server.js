import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

await connectDB();

app.listen(PORT, () => {
  console.log(`Servidor Full Drinks corriendo en http://localhost:${PORT}`);
});
