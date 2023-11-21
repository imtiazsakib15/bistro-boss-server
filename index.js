const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ka66nst.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  const menuCollection = await client.db("bistroDb").collection("menu");
  const reviewCollection = await client.db("bistroDb").collection("reviews");
  const cartCollection = await client.db("bistroDb").collection("carts");

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Get all menu from database
    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });
    // Get all reviews from database
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });
    // Get all carts from database filtering by email
    app.get("/carts", async (req, res) => {
      const email = req.query?.email;
      const result = await cartCollection.find({email}).toArray();
      res.send(result);
    });
    
    // Post cart details to database
    app.post("/carts", async (req, res) => {
      const cart = req.body;
      const result = await cartCollection.insertOne(cart);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Boss is running!!!");
});
app.listen(port, () => {
  console.log(`Boss is running on port ${port}`);
});
