 const express = require('express');
 const cors = require('cors');
 const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
 const app =express()
 const port =process.env.PORT || 5000;
 require('dotenv').config();

//  middleware
app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dtfuxds.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const brandCollection=client.db('ProductDB').collection('brand')
    const productCollection=client.db('ProductDB').collection('product')


    // get brand
    app.get('/brand', async(req,res)=>{
        const cursor=brandCollection.find();
        const result=await cursor.toArray();
        // console.log(result)
        res.send(result)
    })

    // brand card
    app.get('/product/:brand', async(req,res)=>{
      const brand=req.params.brand;
      console.log(brand)
      const query={brand :brand}
      console.log(query)
      const result= await productCollection.find(query).toArray()
      res.send(result)
    })

    // brand card details
    app.get('/singleProduct/:id', async(req,res)=>{
      const id=req.params.id;
      console.log(id)
      const query={_id :new ObjectId (id)}
      console.log(query)
      const result= await productCollection.findOne(query)
      res.send(result)
    })


    app.post('/product', async(req, res)=>{
        const newProduct=req.body;
        // console.log(newProduct)
        const result =await productCollection.insertOne(newProduct)
        res.send(result)
    })

    // cart method



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req,res)=>{
    res.send('shopify server is running')
})

app.listen(port, ()=>{
    console.log(`shopify server ${port}`)
})