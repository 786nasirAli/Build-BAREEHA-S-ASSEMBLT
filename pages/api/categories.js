import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data/categories.json");

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
        const categories = readData();
        res.status(200).json(categories);
      } catch (error) {
        res.status(500).json({ error: "Failed to read categories" });
      }
      break;

    case "POST":
      try {
        const categories = readData();
        const newCategory = req.body;

        // Check if category ID already exists
        if (categories.find((cat) => cat.id === newCategory.id)) {
          return res.status(400).json({ error: "Category ID already exists" });
        }

        categories.push(newCategory);
        writeData(categories);
        res.status(201).json(newCategory);
      } catch (error) {
        res.status(500).json({ error: "Failed to add category" });
      }
      break;

    case "PUT":
      try {
        const categories = readData();
        const { id } = req.query;
        const categoryIndex = categories.findIndex((cat) => cat.id === id);

        if (categoryIndex === -1) {
          return res.status(404).json({ error: "Category not found" });
        }

        categories[categoryIndex] = {
          ...categories[categoryIndex],
          ...req.body,
        };
        writeData(categories);
        res.status(200).json(categories[categoryIndex]);
      } catch (error) {
        res.status(500).json({ error: "Failed to update category" });
      }
      break;

    case "DELETE":
      try {
        const categories = readData();
        const { id } = req.query;
        const filteredCategories = categories.filter((cat) => cat.id !== id);

        if (filteredCategories.length === categories.length) {
          return res.status(404).json({ error: "Category not found" });
        }

        writeData(filteredCategories);
        res.status(200).json({ message: "Category deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Failed to delete category" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
