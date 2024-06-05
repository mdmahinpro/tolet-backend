const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = 5000;

const app = express();

const verifiedToken = (req, res, next) => {
  console.log("Hi");
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  });
};

app.use(cors());
app.use(express.json());
app.use(cookieParser());

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
    const usersCollection = toletDB.collection("usersCollection");

    app.post("/jwt", async (req, res) => {
      const email = req.body;
      const token = jwt.sign(email, process.env.SECRET_KEY, {
        expiresIn: "1hr",
      });
      res.send({ token });
    });

    app.get("/tolets", async (req, res) => {
      const allTolets = toletsCollection.find();
      const result = await allTolets.toArray();
      res.send(result);
    });

    app.post("/adduser", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get("/tolets/:id", async (req, res) => {
      const id = req.params.id;
      const tolet = await toletsCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(tolet);
    });

    app.post("/tolets", verifiedToken, async (req, res) => {
      const toletData = req.body;
      const result = await toletsCollection.insertOne(toletData);
      res.send(result);
    });

    app.patch("/tolets/:id", verifiedToken, async (req, res) => {
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

    app.delete("/tolets/:id", verifiedToken, async (req, res) => {
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
