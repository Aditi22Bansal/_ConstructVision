const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
require("dotenv").config();

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

// Create an inventory item
app.post("/inventory", async (req, res) => {
    try {
        const item = await prisma.inventory.create({ data: req.body });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all inventory items
app.get("/inventory", async (req, res) => {
    const items = await prisma.inventory.findMany();
    res.json(items);
});

// Update an inventory item
app.put("/inventory/:id", async (req, res) => {
    try {
        const item = await prisma.inventory.update({
            where: { id: parseInt(req.params.id) },
            data: req.body
        });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an inventory item
app.delete("/inventory/:id", async (req, res) => {
    try {
        await prisma.inventory.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => console.log("Backend running on port 3001"));
