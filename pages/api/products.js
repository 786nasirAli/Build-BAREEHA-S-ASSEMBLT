import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data/products.json");

function readData() {
  const jsonData = fs.readFileSync(dataFilePath, "utf8");
  return JSON.parse(jsonData);
}

function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const products = readData();
        res.status(200).json(products);
      } catch (error) {
        res.status(500).json({ error: "Failed to read products" });
      }
      break;

    case "POST":
      try {
        const products = readData();
        const newProduct = {
          id: Date.now(), // Simple ID generation
          ...req.body,
        };
        products.push(newProduct);
        writeData(products);
        res.status(201).json(newProduct);
      } catch (error) {
        res.status(500).json({ error: "Failed to add product" });
      }
      break;

    case "PUT":
      try {
        const products = readData();
        const { id } = req.query;
        const productIndex = products.findIndex(
          (p) => p.id.toString() === id.toString(),
        );

        if (productIndex === -1) {
          return res.status(404).json({ error: "Product not found" });
        }

        products[productIndex] = { ...products[productIndex], ...req.body };
        writeData(products);
        res.status(200).json(products[productIndex]);
      } catch (error) {
        res.status(500).json({ error: "Failed to update product" });
      }
      break;

    case "DELETE":
      try {
        const products = readData();
        const { id } = req.query;
        const filteredProducts = products.filter(
          (p) => p.id.toString() !== id.toString(),
        );

        if (filteredProducts.length === products.length) {
          return res.status(404).json({ error: "Product not found" });
        }

        writeData(filteredProducts);
        res.status(200).json({ message: "Product deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Failed to delete product" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
