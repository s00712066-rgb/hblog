const express = require("express");

const app = express();

const {connectDB} = require('./db.js');

const getRoute = require("./blogs.js");

const postRoute = require("./post.js");

const cors = require("cors");

app.use(cors({
  origin:'http://localhost:7700'
}));

app.use(express.json());

app.use( (req,res,next) => {
  console.log(`Request received: ${req.method},${req.url}`);
  next();
});

async function startServer(){
  try{
   const db = await connectDB();
   app.locals.db = db;
   
    app.use(getRoute);
    app.use(postRoute);
    
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