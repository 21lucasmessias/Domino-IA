const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://waldyrturquetti:root@cluster0.m9ciwz9.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const initDB = async () => {
  
  try {
    await client.connect();
    const collection = client.db("test").collection("devices");
    console.log(client);
    console.log(collection);
    // client.close();
  } catch(err){
    console.log(err);
  }
  
}

initDB();