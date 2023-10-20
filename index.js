const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

//  middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dtfuxds.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandCollection = client.db("ProductDB").collection("brand");
    const productCollection = client.db("ProductDB").collection("product");
    const cartCollection = client.db("ProductDB").collection("cart");

    // get brand
    app.get("/brand", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      // console.log(result)
      res.send(result);
    });

    // brand card
    app.get("/product/:brand", async (req, res) => {
      const brand = req.params.brand;
      // console.log(brand)
      const query = { brand: brand };
      // console.log(query)
      const result = await productCollection.find(query).toArray();
      res.send(result);
    });

    // brand card details
    app.get("/singleProduct/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id)
      const query = { _id: new ObjectId(id) };
      // console.log(query)
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    // update Product
    app.put("/updateProduct/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = req.body;
      const product = {
        $set: {
          name: updateProduct.name,
          brand: updateProduct.brand,
          type: updateProduct.type,
          price: updateProduct.price,
          details: updateProduct.details,
          photo: updateProduct.photo,
          rating: updateProduct.rating,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });

    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      // console.log(newProduct)
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    // cart method
    app.post("/cart", async (req, res) => {
      const newCart = req.body;
      console.log(newCart);
      const result = await cartCollection.insertOne(newCart);
      res.send(result);
    });
    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      req.send(result);
    });
    app.get("/cart/:email", async (req, res) => {
      const email = decodeURIComponent(req.params.email);
      console.log(email);
      const query = { email: email };
      console.log(query);
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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
  res.send("shopify server is running");
});

app.listen(port, () => {
  console.log(`shopify server ${port}`);
});
