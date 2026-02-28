const express = require("express");
const cors = require("cors");
const { nanoid } = require("nanoid");

const app = express();
const port = 3000;

let products = [
  { id: nanoid(6), name: "Молоко 3.2%", category: "Молочные продукты", description: "Молоко пастеризованное 3.2% жирности", price: 89, stock: 50 },
  { id: nanoid(6), name: "Хлеб белый", category: "Хлебобулочные", description: "Белый хлеб нарезной", price: 45, stock: 30 },
  { id: nanoid(6), name: "Сыр Российский", category: "Молочные продукты", description: "Сыр полутвёрдый Российский", price: 320, stock: 25 },
  { id: nanoid(6), name: "Яйца куриные", category: "Яйца", description: "Яйца куриные С1, 10 шт", price: 95, stock: 40 },
  { id: nanoid(6), name: "Масло сливочное", category: "Молочные продукты", description: "Масло сливочное 82.5%", price: 180, stock: 20 },
  { id: nanoid(6), name: "Сок апельсиновый", category: "Напитки", description: "Сок апельсиновый 1 л", price: 120, stock: 35 },
  { id: nanoid(6), name: "Йогурт натуральный", category: "Молочные продукты", description: "Йогурт без добавок 125 г", price: 65, stock: 45 },
  { id: nanoid(6), name: "Колбаса докторская", category: "Мясные изделия", description: "Колбаса варёная докторская", price: 280, stock: 15 },
  { id: nanoid(6), name: "Крупа гречневая", category: "Крупы", description: "Гречневая крупа ядрица 1 кг", price: 85, stock: 60 },
  { id: nanoid(6), name: "Макароны спагетти", category: "Макаронные изделия", description: "Спагетти из твёрдых сортов пшеницы", price: 55, stock: 70 },
  { id: nanoid(6), name: "Творог 9%", category: "Молочные продукты", description: "Творог зернёный 9% жирности", price: 140, stock: 30 },
];

app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
      console.log("Body:", req.body);
    }
  });
  next();
});

function findProductOr404(id, res) {
  const product = products.find((p) => p.id == id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return null;
  }
  return product;
}

app.post("/api/products", (req, res) => {
  const { name, category, description, price, stock } = req.body;
  const newProduct = {
    id: nanoid(6),
    name: (name || "").trim(),
    category: (category || "").trim(),
    description: (description || "").trim(),
    price: Number(price),
    stock: Number(stock),
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;
  res.json(product);
});

app.patch("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;
  const { name, category, description, price, stock } = req.body;
  const hasUpdates =
    name !== undefined ||
    category !== undefined ||
    description !== undefined ||
    price !== undefined ||
    stock !== undefined;
  if (!hasUpdates) {
    return res.status(400).json({ error: "Nothing to update" });
  }
  if (name !== undefined) product.name = name.trim();
  if (category !== undefined) product.category = category.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  res.json(product);
});

app.delete("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const exists = products.some((p) => p.id === id);
  if (!exists) return res.status(404).json({ error: "Product not found" });
  products = products.filter((p) => p.id !== id);
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
