const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.get('/', (req,res)=>{
    res.send('server is running correctly')
})


// mongoDB


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://seam_snu:@cluster0.4rme0sq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    // Send a ping to confirm a successful connection

    const database = client.db("insertDB");
    const userCollection = database.collection("users");

    app.get('/user', async(req,res)=> {
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.post('/user', async (req,res)=>{
        const user = req.body;
        console.log(user);
        const result = await userCollection.insertOne(user);
        res.send(result)
    })

    app.delete('/user/:id',async (req,res)=>{
        const id = req.params.id;
        console.log(id);
        const query = {_id : new ObjectId (id) }
        const result = await userCollection.deleteOne(query)
        res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})