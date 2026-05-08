const pool = require("./db");
const { estimateDelivery } = require("../utils/checkoutPricing");

const COUPONS = {
  SAVE10: { type: "percent", value: 10 },
  FLAT500: { type: "flat", value: 500 },
  FREESHIP: { type: "ship", value: 0 }
};

const calculateDiscount = (couponCode, subtotal, shippingCharge) => {
  if (!couponCode) return 0;
  const coupon = COUPONS[couponCode.toUpperCase()];
  if (!coupon) return 0;
  if (coupon.type === "percent") return Number((subtotal * coupon.value) / 100);
  if (coupon.type === "flat") return Math.min(subtotal, coupon.value);
  if (coupon.type === "ship") return shippingCharge;
  return 0;
};

const OrderModel = {
  async createFromCart(userId, payload) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [userRows] = await conn.query(
        "SELECT id, email, name FROM users WHERE id = ?",
        [userId]
      );

      if (!userRows.length) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }

      const [cartItems] = await conn.query(`
        SELECT
          cart.id,
          cart.product_id,
          cart.quantity,
          products.name,
          products.price,
          products.stock
        FROM cart
        JOIN products ON cart.product_id = products.id
        WHERE cart.user_id = ?
        ORDER BY cart.id ASC
      `, [userId]);

      if (!cartItems.length) {
        const error = new Error("Cart is empty");
        error.statusCode = 400;
        throw error;
      }

      for (const item of cartItems) {
        if (Number(item.quantity) > Number(item.stock)) {
          const error = new Error(`Insufficient stock for ${item.name}`);
          error.statusCode = 400;
          throw error;
        }
      }

      const subtotal = cartItems.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
      );
      const delivery = estimateDelivery({
        cartItems,
        subtotal,
        city: payload?.city,
        state: payload?.state,
        postalCode: payload?.postalCode,
        paymentMethod: payload?.paymentMethod || "upi"
      });
      const shippingCharge = delivery.shippingCharge;
      const couponCode = payload?.couponCode?.trim() || null;
      const discountAmount = calculateDiscount(couponCode, subtotal, shippingCharge);
      const totalPrice = Math.max(0, subtotal + shippingCharge - discountAmount);
      const [orderRes] = await conn.query(
        `INSERT INTO orders (
          user_id,
          total_price,
          status,
          customer_name,
          customer_email,
          shipping_address,
          shipping_city,
          shipping_state,
          shipping_postal_code,
          payment_method,
          coupon_code,
          discount_amount,
          shipping_charge,
          subtotal,
          delivery_distance_km,
          delivery_zone,
          delivery_eta,
          payment_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          totalPrice,
          "pending",
          payload?.customerName || userRows[0].name || "Customer",
          userRows[0].email,
          payload?.addressLine || payload?.addressLine1 || "",
          payload?.city || "",
          payload?.state || "",
          payload?.postalCode || "",
          payload?.paymentMethod || "upi",
          couponCode,
          discountAmount,
          shippingCharge,
          subtotal,
          delivery.distanceKm,
          delivery.zone,
          delivery.eta,
          payload?.paymentMethod === "cod" ? "pending_on_delivery" : "pending"
        ]
      );

      for (const item of cartItems) {
        await conn.query(
          "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
          [orderRes.insertId, item.product_id, item.quantity, item.price]
        );
        await conn.query(
          "UPDATE products SET stock = stock - ? WHERE id = ?",
          [item.quantity, item.product_id]
        );
      }

      await conn.query("DELETE FROM cart WHERE user_id = ?", [userId]);
      await conn.commit();

      return {
        orderId: orderRes.insertId,
        totalPrice,
        status: "pending",
        subtotal,
        shippingCharge,
        deliveryDistanceKm: delivery.distanceKm,
        deliveryZone: delivery.zone,
        deliveryEta: delivery.eta,
        discountAmount,
        couponCode
      };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  async getAllByUser(userId) {
    const [rows] = await pool.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    return rows;
  },

  async getById(userId, orderId) {
    const [orders] = await pool.query(
      "SELECT * FROM orders WHERE id = ? AND user_id = ?",
      [orderId, userId]
    );

    if (!orders.length) return null;

    const [items] = await pool.query(`
      SELECT
        order_items.id,
        order_items.quantity,
        order_items.unit_price,
        products.id AS product_id,
        products.name,
        products.image_url,
        products.material,
        products.color
      FROM order_items
      JOIN products ON order_items.product_id = products.id
      WHERE order_items.order_id = ?
      ORDER BY order_items.id ASC
    `, [orderId]);

    return { ...orders[0], items };
  },

  async cancel(userId, orderId) {
    const [orders] = await pool.query(
      "SELECT * FROM orders WHERE id = ? AND user_id = ?",
      [orderId, userId]
    );

    if (!orders.length) return 0;

    if (["cancelled", "delivered"].includes(orders[0].status)) {
      const error = new Error("This order can no longer be cancelled");
      error.statusCode = 400;
      throw error;
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [items] = await conn.query(
        "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
        [orderId]
      );

      for (const item of items) {
        await conn.query(
          "UPDATE products SET stock = stock + ? WHERE id = ?",
          [item.quantity, item.product_id]
        );
      }

      await conn.query(
        "UPDATE orders SET status = 'cancelled' WHERE id = ? AND user_id = ?",
        [orderId, userId]
      );

      await conn.commit();
      return 1;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
};

module.exports = OrderModel;
