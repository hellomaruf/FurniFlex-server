const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 3000;

// middleware------------------>
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.0o9qayn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const usersCollection = client.db("FurniFlex").collection("users");

    // Added user in database -------------------->
    app.post("/user", async (req, res) => {
      const userInfo = req.body;
      console.log(userInfo);
      const query = { email: userInfo?.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User is already Exist", insertedId: null });
      }
      const result = await usersCollection.insertOne(userInfo);
      res.send(result);
    });

    app.post("/isUserSignUp", async (req, res) => {
      const loginInfo = req.body;
      const query = { email: loginInfo?.email };
      const isSignUp = await usersCollection.findOne(query);
      if (isSignUp) {
        return res.send({ message: "User has signed up", insertedId: null });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("FurniFlex Database is Running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
