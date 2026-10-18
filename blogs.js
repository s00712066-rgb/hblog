const express = require("express");

const router = express.Router();

const {ObjectId} = require("mongodb");

router.get('/api/posts', async (req,res) => {
  
    try{
      
    const db = req.app.locals.db;
    
    let storage = await db.collection("posts").find({}).toArray();
  
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

});

router.get('/api/posts/:id', async (req,res) => {
  
   if (!ObjectId.isValid(req.params.id)){
     return res.status(400).json({message:"Invalid blog id"});
   }
   
   else{
     const blogId = new ObjectId(req.params.id);
     
     try{
      const db = req.app.locals.db;
      const blog = await db.collection("posts").findOne({_id: blogId});
      
      if (!blog){
        return res.status(404).json({message:"No blog found"});
      }
      
     return res.status(200).json(blog);
   }
   catch(error){
     console.log("Something went wrong");
   }
  }
});

module.exports = router;