import express from "express";
import Order from "../models/Order.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🛒 Sipariş oluştur (login zorunlu)
router.post("/", requireAuth, async (req, res) => {
  try {
    const order = await Order.create({
      user: req.user._id,
      shippingInfo: {
        name: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
        address: req.user.address || "",
        phone: req.user.phone || "",
      },
      items: req.body.items,
      total: req.body.total,
      paymentMethod: req.body.paymentMethod,
      paid: false,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("ORDER CREATE ERROR:", err);
    res.status(500).json({ message: "Sipariş oluşturulamadı" });
  }
});

// 👑 Admin – tüm siparişler
router.get("/", requireAuth, async (req, res) => {
  try {
    if (req.user.email !== "fawaddilawar24@gmail.com") {
      return res.status(403).json({ message: "Yetkiniz yok" });
    }

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("items.productId")
      .populate("user", "firstName lastName email address phone");

    const ordersWithImages = orders.map(order => ({
      ...order._doc,
      items: order.items.map(i => ({
        id: i.productId?._id,
        name: i.productId?.name || "Ürün silinmiş",
        price: i.productId?.price || 0,
        images: i.productId?.images?.map(img =>
          img.startsWith("http") ? img : `http://localhost:5000${img}`
        ) || [],
        quantity: i.quantity
      }))
    }));

    res.json(ordersWithImages);
  } catch (err) {
    console.error("ADMIN ORDERS ERROR:", err);
    res.status(500).json({ message: "Siparişler alınamadı" });
  }
});

// 👤 Müşteri – kendi siparişleri
router.get("/my", requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.productId");

    const ordersWithImages = orders.map(order => ({
      ...order._doc,
      items: order.items.map(i => ({
        id: i.productId?._id,
        name: i.productId?.name || "Ürün silinmiş",
        price: i.productId?.price || 0,
        images: i.productId?.images?.map(img =>
          img.startsWith("http") ? img : `http://localhost:5000${img}`
        ) || [],
        quantity: i.quantity
      }))
    }));

    res.json(ordersWithImages);
  } catch (err) {
    console.error("MY ORDERS ERROR:", err);
    res.status(500).json({ message: "Siparişler getirilemedi" });
  }
});

// 🟢 Ödeme alındı endpoint (admin)
router.post("/:id/pay", requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Sipariş bulunamadı" });

    if (req.user.email !== "fawaddilawar24@gmail.com") {
      return res.status(403).json({ message: "Yetkiniz yok" });
    }

    order.paid = true;
    await order.save();

    res.json({ message: "Ödeme alındı", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Bir hata oluştu" });
  }
});

// 📦 Admin – kargo durumu güncelle
router.put("/:id/delivery", requireAuth, async (req, res) => {
  try {
    if (req.user.email !== "fawaddilawar24@gmail.com") {
      return res.status(403).json({ message: "Yetkiniz yok" });
    }

    const { deliveryStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Sipariş bulunamadı" });

    order.deliveryStatus = deliveryStatus;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error("DELIVERY UPDATE ERROR:", err);
    res.status(500).json({ message: "Durum güncellenemedi" });
  }
});

export default router;
