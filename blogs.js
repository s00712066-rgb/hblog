const express = require("express");
const router = express.Router();
const {ObjectId} = require("mongodb");

// 1. FIRST - all posts + filtering
router.get('/api/posts', async (req,res) => {
  const category = req.query.category;
  try{
    const db = req.app.locals.db;
    const filter = {};
    if (category && category !== 'All'){
        filter.category = category;
    }
    const result = await db.collection('posts').find(filter).toArray();
    return res.status(200).json(result);
  }
  catch(error){
    console.error(error);
    return res.status(500).json({message:"Something went wrong"});
  }
});

// 2. SECOND - single post
router.get('/api/posts/:id', async (req,res) => {
   if (!ObjectId.isValid(req.params.id)){
     return res.status(400).json({message:"Invalid blog id"});
   }
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
     console.error(error);
     return res.status(500).json({message:"Something went wrong"});
   }
});

module.exports = router;