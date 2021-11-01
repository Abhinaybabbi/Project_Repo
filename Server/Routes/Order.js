const { json } = require("body-parser");
const express = require("express");
const requireLogin = require("../middleware/requireLogin");
const Order = require("../Models/order");
const router = express.Router();

const Orders = require("../Models/order");





router.get("/",async function(req,res){
    try{
        const orders= await Order.find();
        return res.json({
            status:"sucess",
            data:{
                orders
            }
        })
    }catch(e){
        res.json({
            status:"Failed",
            message: e.message
        })
    }
})
router.post("/",requireLogin,async (req,res)=> {
    const data = new Order({
        totalItems: req.body.totalItems,
        totalPrice:req.body.totalPrice,
        address : req.body.address,
        orderTimestamp : req.body.timestamps,
        user: req.user._id
    });
    const order = await Order.create(data,(err,res)=>{
        if(err){
            console.log(err);
        }else{
            console.log("order created successfully");
        }

    });
    res.json({
        status:"sucess",
        data:{
            data
        }

    })


});

router.put("/:id",async function(req,res){

});


module.exports = router;

