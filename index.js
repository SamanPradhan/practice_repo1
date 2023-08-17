const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
let DATABASE = process.env.DATABASE;
const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Book = mongoose.model("Book", {
  title: String,
  author: String,
  genre: String,
  description: String,
  price: String,
});

// Add Book API
app.post("/addBook", async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.json(newBook);
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ error: "Failed to add book" });
  }
});

// Retrieve Books API
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});
app.get("/filterBooks/:genre", async (req, res) => {
  try {
    const { genre } = req.params;
    const books = await Book.find({ genre });
    res.json(books);
  } catch (error) {
    console.error("Error filtering books:", error);
    res.status(500).json({ error: "Failed to filter books" });
  }
});

app.get("/sortBooks/:sortBy", async (req, res) => {
  try {
    const { sortBy } = req.params;
    console.log(sortBy);
    const books = await Book.find().sort({ price: sortBy });
    res.json(books);
  } catch (error) {
    console.error("Error sorting books:", error);
    res.status(500).json({ error: "Failed to sort books" });
  }
});
// Delete Book API
app.delete("/deleteBook/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
