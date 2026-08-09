import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import readline from "readline";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

await connectDB();

try {
  const email = (await ask("Email: ")).trim().toLowerCase();
  const password = (await ask("Contraseña: ")).trim();

  if (!email || !password) {
    throw new Error("Email y contraseña son obligatorios.");
  }

  const existing = await Admin.findOne({ email });

  if (existing) {
    throw new Error("Ya existe un administrador con ese email.");
  }

  const hash = await bcrypt.hash(password, 12);

  await Admin.create({
    email,
    password: hash,
    role: "admin",
  });

  console.log("\n✅ Administrador creado correctamente.");
} catch (error) {
  console.log("\n❌", error.message);
}

rl.close();
await mongoose.disconnect();
