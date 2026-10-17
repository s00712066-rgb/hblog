const express = require("express");

const router = express.Router();

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

module.exports = router;