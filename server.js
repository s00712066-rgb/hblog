const express = require("express");

const app = express();

const {connectDB} = require('./db.js');

const {validate} = require('./validation.js');

const cors = require("cors");

app.use(cors({
  origin:'http://localhost:7700'
}));

app.use(express.json());

const {ObjectId} = require("mongodb");

let db;

app.use( (req,res,next) => {
  console.log(`Request received: ${req.method},${req.url}`);
  next();
});

app.get('/api/posts',(req,res) => {
  async function getposts(){
    try{
    let storage =await db.collection("posts").find({}).toArray();
  
    if (storage.length === 0){
      return res.status(200).json({message:"No Posts Yet"});
      }
     
    else{
      return res.status(200).json(storage);
    }
  }
  catch(error){
     return res.status(500).json({message:"Something went wrong"});
  }
}
getposts();
});


/////////////////////////////////////////////////////////
async function startServer(){
  try{
    db =await connectDB();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  }
  catch(error){
    console.error("Database connection failed", error.message);
  }
}

startServer();