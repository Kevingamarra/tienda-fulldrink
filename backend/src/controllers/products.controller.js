import Product from "../models/Product.js";

/* PÚBLICO: solo productos activos */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      active: true,
    }).sort({
      createdAt: -1,
    });

    res.json({
      status: "success",
      payload: products,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

/* PÚBLICO: producto activo por frontendId */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      frontendId: req.params.id,
      active: true,
    });

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    res.json({
      status: "success",
      payload: product,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

/* ADMIN: activos + inactivos */
export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.json({
      status: "success",
      payload: products,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

/* ADMIN: crear producto */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      stock = 0,
      size = "",
      image = "",
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        status: "error",
        message: "El nombre es obligatorio",
      });
    }

    if (!category?.trim()) {
      return res.status(400).json({
        status: "error",
        message: "La categoría es obligatoria",
      });
    }

    if (
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return res.status(400).json({
        status: "error",
        message: "Precio inválido",
      });
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({
        status: "error",
        message: "Stock inválido",
      });
    }

    const normalizedCategory = category
      .trim()
      .toLowerCase();

    const categoryProducts = await Product.find({
      category: normalizedCategory,
      type: "product",
    })
      .select("frontendId")
      .lean();

    const usedNumbers = categoryProducts
      .map((product) => {
        const prefix = `${normalizedCategory}-`;

        if (!product.frontendId?.startsWith(prefix)) {
          return 0;
        }

        const number = Number(
          product.frontendId.slice(prefix.length)
        );

        return Number.isInteger(number) ? number : 0;
      });

    const nextNumber =
      (usedNumbers.length > 0
        ? Math.max(...usedNumbers)
        : 0) + 1;

    const frontendId =
      `${normalizedCategory}-${String(nextNumber).padStart(2, "0")}`;

    const product = await Product.create({
      frontendId,
      name: name.trim(),
      category: normalizedCategory,
      price,
      stock,
      size: size.trim(),
      image: image.trim(),
      type: "product",
      active: true,
    });

    res.status(201).json({
      status: "success",
      message: "Producto creado correctamente",
      payload: product,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

/* ADMIN: editar producto */
export const updateProduct = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "category",
      "price",
      "stock",
      "size",
      "image",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.name !== undefined) {
      if (
        typeof updates.name !== "string" ||
        !updates.name.trim()
      ) {
        return res.status(400).json({
          status: "error",
          message: "Nombre inválido",
        });
      }

      updates.name = updates.name.trim();
    }

    if (updates.category !== undefined) {
      if (
        typeof updates.category !== "string" ||
        !updates.category.trim()
      ) {
        return res.status(400).json({
          status: "error",
          message: "Categoría inválida",
        });
      }

      updates.category = updates.category
        .trim()
        .toLowerCase();
    }

    if (updates.price !== undefined) {
      if (
        typeof updates.price !== "number" ||
        !Number.isFinite(updates.price) ||
        updates.price < 0
      ) {
        return res.status(400).json({
          status: "error",
          message: "Precio inválido",
        });
      }
    }

    if (updates.stock !== undefined) {
      if (
        !Number.isInteger(updates.stock) ||
        updates.stock < 0
      ) {
        return res.status(400).json({
          status: "error",
          message: "Stock inválido",
        });
      }
    }

    if (updates.size !== undefined) {
      updates.size = String(updates.size).trim();
    }

    if (updates.image !== undefined) {
      updates.image = String(updates.image).trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No hay datos para actualizar",
      });
    }

    const product = await Product.findOneAndUpdate(
      {
        frontendId: req.params.id,
        type: "product",
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    res.json({
      status: "success",
      message: "Producto actualizado correctamente",
      payload: product,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

/* ADMIN: activar/desactivar */
export const toggleProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      frontendId: req.params.id,
      type: "product",
    });

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    product.active = !product.active;

    await product.save();

    res.json({
      status: "success",
      message: product.active
        ? "Producto activado"
        : "Producto desactivado",
      payload: product,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

/* ADMIN: eliminación lógica */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      frontendId: req.params.id,
      type: "product",
    });

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    product.active = false;

    await product.save();

    res.json({
      status: "success",
      message:
        "Producto eliminado de la tienda correctamente",
      payload: product,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
