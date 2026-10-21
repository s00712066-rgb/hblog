const express = require("express");

require("dotenv").config();

const app = express();

const session = require("express-session");

const bcrypt = require("bcryptjs");

const {connectDB} = require('./db.js');

const getRoute = require("./blogs.js");

const postRoute = require("./post.js");

const updateRoute = require("./update.js");

const deleteRoute = require("./delete.js");

const requireAdmin = require("./auth.js");

const cors = require("cors");

app.use(cors({
  origin:'http://localhost:7700'
}));

app.use(express.json());

app.use(session({
 secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false,
  cookie:{
    httpOnly:true,
    secure:false,
    sameSite:'lax',
    maxAge:1000*60*60
  }
}));

app.use( (req,res,next) => {
  console.log(`Request received: ${req.method},${req.url}`);
  next();
});

app.post("/auth/login", async (req,res) =>{
  const {username, password} = req.body;
  
  if (typeof password !=="string" || password.trim()===""){
      return res.status(400).json({message:"password is invalid"})
  }
  
  else if (typeof username!=="string" || username.trim()===""){
      return res.status(400).json({message:"invalid username"});
  }
  
  else if (username !== process.env.USER_NAME){
    return res.status(401).json({message:"Invalid username or password"});
  }
  
  try{
    const isMatched = await      bcrypt.compare(password, process.env.PASSWORD_HASH);
  
  if(!isMatched){
      return res.status(401).json({message:"Invalid username or password"});
  }
  
      await new Promise((resolve, reject) =>{
          
      req.session.regenerate( (error) => {
          
     if (error){
       return reject(error)
     }
     
     resolve();
   });
   
  });
  
  req.session.isAdmin = true;
  
  await new Promise((resolve, reject) => {
  req.session.save((error) => {
    if (error) {
      return reject(error);
    }

    resolve();
  });
});
  return res.status(200).json({message: "Login successful"});
 }
  catch(error){
    console.error(error);
    return res.status(500).json({message:"Something went wrong"});
  }
  
});

async function startServer(){
  try{
   const db = await connectDB();
   app.locals.db = db;
   
    app.use(getRoute);
    app.use(postRoute);
    app.use(updateRoute);
    app.use(deleteRoute);
    
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

