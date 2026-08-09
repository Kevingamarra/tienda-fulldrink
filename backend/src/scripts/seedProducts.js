import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";

dotenv.config();

const products = [
  { frontendId: "gin-01", name: "Beefeater 24", category: "gin", price: 35000, stock: 1, size: "700 ml", type: "product" },
  { frontendId: "gin-02", name: "Beefeater Blackberry", category: "gin", price: 31000, stock: 1, size: "700 ml", type: "product" },
  { frontendId: "gin-03", name: "Bombay Bramble", category: "gin", price: 35000, stock: 1, size: "700 ml", type: "product" },
  { frontendId: "gin-04", name: "Gordon's Premium Pink", category: "gin", price: 16000, stock: 1, size: "700 ml", type: "product" },

  { frontendId: "vodka-01", name: "Sernova Clásico", category: "vodka", price: 4500, stock: 4, size: "700 ml", type: "product" },
  { frontendId: "vodka-02", name: "Sernova Wild Berries", category: "vodka", price: 6000, stock: 2, size: "700 ml", type: "product" },
  { frontendId: "vodka-03", name: "Sernova Tropical Passion", category: "vodka", price: 6000, stock: 12, size: "700 ml", type: "product" },
  { frontendId: "vodka-04", name: "Mayor Galaxy Gum", category: "vodka", price: 9500, stock: 6, size: "700 ml", type: "product" },

  { frontendId: "whisky-01", name: "Jack Daniel's Tennessee Apple", category: "whisky", price: 45000, stock: 1, size: "1 Litro", type: "product" },
  { frontendId: "whisky-02", name: "Jack Daniel's Tennessee Blackberry", category: "whisky", price: 70000, stock: 2, size: "750 ml", type: "product" },

  { frontendId: "espumante-01", name: "Chandon Délice", category: "espumantes", price: 15000, stock: 4, size: "750 ml", type: "product" },

  { frontendId: "combo-01", name: "Combo 01", category: "combos", price: 14000, stock: 1, type: "combo" },
  { frontendId: "combo-02", name: "Combo 02", category: "combos", price: 14000, stock: 1, type: "combo" },
  { frontendId: "combo-03", name: "Combo 03", category: "combos", price: 36000, stock: 1, type: "combo" },
  { frontendId: "combo-04", name: "Combo 04", category: "combos", price: 36000, stock: 1, type: "combo" },
  { frontendId: "combo-05", name: "Combo 05", category: "combos", price: 20000, stock: 1, type: "combo" },
  { frontendId: "combo-06", name: "Combo 06", category: "combos", price: 40000, stock: 1, type: "combo" },
  { frontendId: "combo-07", name: "Combo 07", category: "combos", price: 21000, stock: 1, type: "combo" },
  { frontendId: "combo-08", name: "Combo 08", category: "combos", price: 21000, stock: 1, type: "combo" },
  { frontendId: "combo-09", name: "Combo 09", category: "combos", price: 32000, stock: 1, type: "combo" },
  { frontendId: "combo-10", name: "Combo 10", category: "combos", price: 40000, stock: 1, type: "combo" },
  { frontendId: "combo-11", name: "Combo 11", category: "combos", price: 10000, stock: 1, type: "combo" },
  { frontendId: "combo-12", name: "Combo 12", category: "combos", price: 10000, stock: 1, type: "combo" },
];

async function seed() {
  try {
    await connectDB();

    await Product.deleteMany({});

    const inserted = await Product.insertMany(products);

    console.log(`Catálogo importado correctamente: ${inserted.length} registros`);
  } catch (error) {
    console.error("Error importando catálogo:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
