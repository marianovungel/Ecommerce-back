const router = require('express').Router()
const Order = require('../models/Order')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')

//criar
router.post('/', verifyToken, async (req, res)=>{
    const newOrder = new Order(req.body);
    try{
        const criateOrder = await newOrder.save();
        res.status(200).json(criateOrder)
    }catch(err){
        res.status(500).json(err)
    }
})

//editar
router.put('/:id', verifyTokenAndAdmin, async (req, res)=>{
    try{
        const newOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})

        res.status(200).json(newOrder)

    }catch(err){
        res.status(500).json(err)
    }
})

//delete
router.delete('/:id', verifyTokenAndAdmin, async (req, res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order deletado com sucesso!")
    }catch(err){
        res.status(500).json(err)
    }
})

//get byId
router.get('/find/:id', async (req, res)=>{
    try{
        const order = await Order.findOne({id: req.params.id})
        res.status(200).json(order)
    }catch(err){
        res.status(500).json(err)
    }
})

//get all
router.get('/', verifyTokenAndAdmin, async (req, res)=>{
    try{
        const order = await Order.find()
        res.status(200).json(order)
    }catch(err){
        res.status(500).json(err)
    }
})

//get monthly income
router.get('/income', verifyTokenAndAdmin, async (req, res)=>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.setMonth() -1))
    const previousMonthMonth = new Date(date.setMonth(date.setMonth() -1))

    try{
        const income = await User.aggregate([
            {$match: {createdAt: {$gte: previousMonthMonth}}},
            {$project:{
                month: {$month: "$createdAt"},
                sales:"$amount"
            },
        },
        {$group: { _id:"$month", total:{$sum: "$sales"}}}
            
        ])
        res.status(500).json(income)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;