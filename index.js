const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { useParams } = require("react-router-dom");

const port = 5000;

const app = express();
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://mahinbinraihan123:NEtl3gUupQ9jmQRJ@cluster0.iymbxs0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    await client.connect();
    const toletDB = client.db("toletDB");
    const toletsCollection = toletDB.collection("toletsCollection");

    app.get("/tolets", async (req, res) => {
      const allTolets = toletsCollection.find();
      const result = await allTolets.toArray();
      res.send(result);
    });

    app.get("/tolets/:id", async (req, res) => {
      const id = req.params.id;
      const tolet = await toletsCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(tolet);
    });

    app.post("/tolets", async (req, res) => {
      const toletData = req.body;
      const result = await toletsCollection.insertOne(toletData);
      res.send(result);
    });

    app.patch("/tolets/:id", async (req, res) => {
      const id = req.params.id;
      const updatedTolet = req.body;
      const result = await toletsCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        { $set: updatedTolet }
      );
      res.send(result);
    });

    app.delete("/tolets/:id", async (req, res) => {
      const id = req.params.id;
      const result = await toletsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    console.log("Database is connected");
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running");
});

app.listen(port, (req, res) => {
  console.log(`App is listening on port ${port}`);
});
