const express = require("express");

const {validate} = require("./validation.js");

const {connectDB} = require('./db.js');

const router = express.Router();

router.post('/api/posts', (req,res) => {
    
 const error = validate(req.body);
 if(error){
  return res.status(400).json({message: error});
 }
    
 else{
  const blog = {
    title: req.body.title,
    category: req.body.category,
    contents: req.body.contents,
    author: "H-Tech",
    createdAt: new Date()
  }
  
  async function post(){
    try{
     const db = req.app.locals.db;
     
     const posted = await db.collection("posts").insertOne(blog);
     
     const saved = {
       _id: posted.insertedId, ...blog
     }
     
     return res.status(201).json({message:"blog created successfully", blog:saved })
    }
    catch(error){
      console.error(error);
      return res.status(500).json({message: "Something went wrong"});      
    }
  }
  
  post();
 }
});

module.exports = router;