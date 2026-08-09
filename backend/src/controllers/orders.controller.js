import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import DeliveryReservation from "../models/DeliveryReservation.js";
import {
  isValidDeliveryDate,
  isValidSlot,
  getReservationKey,
} from "../utils/deliverySchedule.js";

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      items,
      customerName,
      customerPhone,
      deliveryType,
      deliveryDate,
      deliverySlot,
      address = "",
      paymentMethod,
      notes = "",
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "El pedido está vacío",
      });
    }

    if (!customerName?.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Ingresá tu nombre",
      });
    }

    if (!customerPhone?.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Ingresá tu teléfono",
      });
    }

    if (!["envio", "retiro"].includes(deliveryType)) {
      return res.status(400).json({
        status: "error",
        message: "Tipo de entrega inválido",
      });
    }

    if (!isValidDeliveryDate(deliveryDate)) {
      return res.status(400).json({
        status: "error",
        message:
          "Las entregas y retiros están disponibles únicamente viernes y sábado",
      });
    }

    if (!isValidSlot(deliveryType, deliverySlot)) {
      return res.status(400).json({
        status: "error",
        message: "Horario inválido",
      });
    }

    if (deliveryType === "envio" && !address.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Ingresá la dirección de entrega",
      });
    }

    if (!["efectivo", "transferencia"].includes(paymentMethod)) {
      return res.status(400).json({
        status: "error",
        message: "Forma de pago inválida",
      });
    }

    let createdOrder;

    await session.withTransaction(async () => {
      const normalizedItems = [];
      let total = 0;

      for (const requestedItem of items) {
        const quantity = Number(requestedItem.quantity);

        if (!Number.isInteger(quantity) || quantity <= 0) {
          throw new Error("INVALID_QUANTITY");
        }

        const product = await Product.findOneAndUpdate(
          {
            frontendId: requestedItem.id,
            active: true,
            stock: { $gte: quantity },
          },
          {
            $inc: {
              stock: -quantity,
            },
          },
          {
            new: true,
            session,
          }
        );

        if (!product) {
          const currentProduct = await Product.findOne({
            frontendId: requestedItem.id,
          }).session(session);

          if (!currentProduct || !currentProduct.active) {
            throw new Error(
              `UNAVAILABLE:${requestedItem.name}`
            );
          }

          throw new Error(
            `STOCK:${currentProduct.name}:${currentProduct.stock}`
          );
        }

        const subtotal = product.price * quantity;

        normalizedItems.push({
          frontendId: product.frontendId,
          name: product.name,
          quantity,
          unitPrice: product.price,
          subtotal,
        });

        total += subtotal;
      }

      const orders = await Order.create(
        [
          {
            items: normalizedItems,
            total,
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim(),
            deliveryType,
            deliveryDate,
            deliverySlot,
            address:
              deliveryType === "envio"
                ? address.trim()
                : "",
            paymentMethod,
            notes: notes.trim(),
            status: "pending",
            stockReserved: true,
          },
        ],
        {
          session,
        }
      );

      createdOrder = orders[0];

      if (deliveryType === "envio") {
        await DeliveryReservation.create(
          [
            {
              reservationKey: getReservationKey(
                deliveryDate,
                deliverySlot
              ),
              deliveryDate,
              deliverySlot,
              order: createdOrder._id,
            },
          ],
          {
            session,
          }
        );
      }
    });

    res.status(201).json({
      status: "success",
      message:
        deliveryType === "envio"
          ? "Pedido creado, stock y horario reservados"
          : "Pedido creado y stock reservado",
      payload: createdOrder,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        status: "error",
        message:
          "Ese horario de envío acaba de ser reservado. Elegí otro.",
      });
    }

    if (error.message === "INVALID_QUANTITY") {
      return res.status(400).json({
        status: "error",
        message: "Cantidad inválida",
      });
    }

    if (error.message.startsWith("UNAVAILABLE:")) {
      const [, name] = error.message.split(":");

      return res.status(404).json({
        status: "error",
        message: `${name} ya no está disponible`,
      });
    }

    if (error.message.startsWith("STOCK:")) {
      const [, name, available] =
        error.message.split(":");

      return res.status(409).json({
        status: "error",
        message:
          Number(available) === 0
            ? `${name} se quedó sin stock`
            : `Solo quedan ${available} unidades de ${name}`,
      });
    }

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  } finally {
    await session.endSession();
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.json({
      status: "success",
      payload: orders,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const confirmOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    let confirmedOrder;

    await session.withTransaction(async () => {
      const order = await Order.findById(
        req.params.id
      ).session(session);

      if (!order) {
        throw new Error("ORDER_NOT_FOUND");
      }

      if (order.status !== "pending") {
        throw new Error(
          `ORDER_STATUS:${order.status}`
        );
      }

      /*
        Compatibilidad con pedidos viejos:
        si no tenían stock reservado,
        lo descontamos al confirmar.
      */
      if (!order.stockReserved) {
        for (const item of order.items) {
          const product =
            await Product.findOneAndUpdate(
              {
                frontendId: item.frontendId,
                active: true,
                stock: { $gte: item.quantity },
              },
              {
                $inc: {
                  stock: -item.quantity,
                },
              },
              {
                new: true,
                session,
              }
            );

          if (!product) {
            const currentProduct =
              await Product.findOne({
                frontendId: item.frontendId,
              }).session(session);

            throw new Error(
              `STOCK:${item.name}:${currentProduct?.stock ?? 0}`
            );
          }
        }

        order.stockReserved = true;
      }

      order.status = "confirmed";
      order.confirmedAt = new Date();

      confirmedOrder = await order.save({
        session,
      });
    });

    res.json({
      status: "success",
      message: "Pedido confirmado",
      payload: confirmedOrder,
    });
  } catch (error) {
    if (error.message === "ORDER_NOT_FOUND") {
      return res.status(404).json({
        status: "error",
        message: "Pedido no encontrado",
      });
    }

    if (error.message.startsWith("ORDER_STATUS:")) {
      return res.status(409).json({
        status: "error",
        message: "El pedido ya fue procesado",
      });
    }

    if (error.message.startsWith("STOCK:")) {
      const [, name, available] =
        error.message.split(":");

      return res.status(409).json({
        status: "error",
        message:
          Number(available) === 0
            ? `${name} se quedó sin stock`
            : `Solo quedan ${available} unidades de ${name}`,
      });
    }

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  } finally {
    await session.endSession();
  }
};

export const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    let cancelledOrder;

    await session.withTransaction(async () => {
      const order = await Order.findById(
        req.params.id
      ).session(session);

      if (!order) {
        throw new Error("ORDER_NOT_FOUND");
      }

      if (order.status !== "pending") {
        throw new Error(
          `ORDER_STATUS:${order.status}`
        );
      }

      if (order.stockReserved) {
        for (const item of order.items) {
          await Product.findOneAndUpdate(
            {
              frontendId: item.frontendId,
            },
            {
              $inc: {
                stock: item.quantity,
              },
            },
            {
              session,
            }
          );
        }

        order.stockReserved = false;
      }

      if (
        order.deliveryType === "envio" &&
        order.deliveryDate &&
        order.deliverySlot
      ) {
        await DeliveryReservation.deleteOne(
          {
            reservationKey: getReservationKey(
              order.deliveryDate,
              order.deliverySlot
            ),
          },
          {
            session,
          }
        );
      }

      order.status = "cancelled";
      order.cancelledAt = new Date();

      cancelledOrder = await order.save({
        session,
      });
    });

    res.json({
      status: "success",
      message:
        "Pedido cancelado y stock liberado",
      payload: cancelledOrder,
    });
  } catch (error) {
    if (error.message === "ORDER_NOT_FOUND") {
      return res.status(404).json({
        status: "error",
        message: "Pedido no encontrado",
      });
    }

    if (error.message.startsWith("ORDER_STATUS:")) {
      return res.status(409).json({
        status: "error",
        message: "El pedido ya fue procesado",
      });
    }

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  } finally {
    await session.endSession();
  }
};
