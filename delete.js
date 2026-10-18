const express = require("express");

const router = express.Router();

const {ObjectId} = require("mongodb");

router.delete('/api/post/:id', async (req,res) => {
  
  if (!ObjectId.isValid(req.params.id)){
    return res.status(400).json({message:"Invalid blog Id"});
  }
  
  else{
    const blogId = new ObjectId(req.params.id);
    
    const db = req.app.locals.db;
    
    try{
    const result = await db.collection('posts').deleteOne({_id: blogId});
    
    if (result.deletedCount === 0){
      return res.status(404).json({message:"Blog not found"});
    }
    return res.status(200).json({message:'Blog successfully deleted'});
    }
    catch(error){
      return res.status(500).json({message:'Something went wrong'});
    }
  }
});

module.exports = router;