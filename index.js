const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());

// sets POST request header, content-type, body etc.
app.use(express.json());

// configure MongoDB

const uri =
  "mongodb+srv://alavi1223:Ro1zEwJaDfcJXchr@dg1223.za2ri3i.mongodb.net/?retryWrites=true&w=majority";

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

    const database = client.db("usersDB");
    const userCollection = database.collection("users");

    // GET
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // POST
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log("new user: ", user);

      // store data in DB
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // DELETE
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Please delete from database: ", id);
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
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
  res.send("Simple CRUD is running...");
});

app.listen(port, () => {
  console.log(`Simple CRUD is running on port ${port}`);
});
