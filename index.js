const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

console.log(process.env.DB_PASSWORD)
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.l9yjteg.mongodb.net/?retryWrites=true&w=majority`;

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

    const servicesCollocation = client.db('car-doctor').collection('services')
    const bookingCollocation = client.db('car-doctor').collection('booking')

    app.get('/services', async(req,res)=>{
      const cursor = servicesCollocation.find();
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/service/:id', async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = {
        projection: {  title: 1, price: 1, service_id:1, img:1 },
      };
      const service = await servicesCollocation.findOne(query,options);
      res.send(service)
    })

    // booking

    app.get('/booking',async(req,res)=>{
      console.log(req.query.email);
      let query = {}
      if(req.query?.email){
        query={email:req.query?.email}
      }
      const result = await bookingCollocation.find(query).toArray()
      res.send(result)
    })

    app.post('/booking',async(req,res) => {
      const booking = req.body;
      console.log(booking);
      const result = await bookingCollocation.insertOne(booking);
      res.send(result)
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Hello word')
})

app.listen(port,()=>{
    console.log('cars doctor running on port', port);
})
