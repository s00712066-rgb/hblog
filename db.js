require("dotenv").config();

const {MongoClient} = require("mongodb");

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

async function connectDB(){
  try {
    await client.connect();
    console.log('Connected to mongoDB Atlas');
    
    return client.db("hBlog");
  }
  catch (error) {
    console.error('Mongo connection failed', error.message);
    
    throw error;
  }
  
}

module.exports = {connectDB,client};

