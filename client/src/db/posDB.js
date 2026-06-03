// src/db/posDB.js
import Dexie from "dexie";

const db = new Dexie("POSDatabase");

db.version(1).stores({
  products: "++id, name, price, category, stock, barcode",
  orders: "++id, createdAt, total, paymentMethod, status",
  orderItems: "++id, orderId, productId, quantity, price",
  categories: "++id, name",
  pendingSync: "++id, type, data, createdAt", 
});

export default db;