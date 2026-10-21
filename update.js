const express = require("express");

const {validate} = require('./validation.js');

const {ObjectId} = require("mongodb");

const requireAdmin = require("./auth.js");

const router = express.Router();

router.patch('/api/posts/:id', requireAdmin, async (req,res) => {
  
  if (!ObjectId.isValid(req.params.id)){
    return res.status(400).json({message:"Invalid blog Id"});
  }
  
  else {
    const error = validate(req.body);
    if(error){
      return res.status(400).json({message: error});
    }
    
    else{
    const editId = new ObjectId(req.params.id);
    
    try{
      
      const {
        title,
        category,
        contents
      } = req.body;
      
      const db = req.app.locals.db;
      
      const blog = await db.collection('posts').updateOne({_id: editId},{$set: {
        title,
        category,
        contents,
        updatedAt : new Date()
      }
      });
      
      if (blog.matchedCount === 0){
        return res.status(404).json({message:"post not found"});
      }
      
      return res.status(200).json({message:"Blog updated successfully"});
    }
    catch(error){
      console.error(error);
      return res.status(500).json({message:"Something went wrong"});
    }
   }
  }
})

module.exports = router;