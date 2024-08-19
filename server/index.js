const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const Card = require("./modals/card");

app.use(express.json());
app.use(cors());
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

mongoose
  .connect("mongodb://localhost:27017/helpcenter", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  });

app.get("/ping", (req, res) => {
  res.send("Server is running");
});

app.post("/cards", async (req, res) => {
  try {
    const card = new Card(req.body);
    await card.save();
    res.status(201).send(card);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/cards", async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/cards/:title?", async (req, res) => {
  try {
    const title = req.params.title;
    console.log("Search title:", title); 
    let cards;

    if (title) {
      cards = await Card.find({
        title: { $regex: new RegExp(`^${title}`, "i") },
      });
    } else {
      cards = await Card.find({});
    }

    if (!cards.length) return res.status(404).send("No cards found");
    res.send(cards);
  } catch (err) {
    console.error("Error:", err); 
    res.status(500).send(err);
  }
});



