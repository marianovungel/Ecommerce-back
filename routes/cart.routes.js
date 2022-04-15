const router = require('express').Router()
const Cart = require('../models/Cart')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')

//criar
router.post('/', verifyToken, async (req, res)=>{
    const newCart = new Cart(req.body);
    try{
        const criateCart = await newCart.save();
        res.status(200).json(criateCart)
    }catch(err){
        res.status(500).json(err)
    }
})

//editar
router.put('/:id', verifyTokenAndAuthorization, async (req, res)=>{
    try{
        const newCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})

        res.status(200).json(newCart)

    }catch(err){
        res.status(500).json(err)
    }
})

//delete
router.delete('/:id', verifyTokenAndAuthorization, async (req, res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart deletado com sucesso!")
    }catch(err){
        res.status(500).json(err)
    }
})

//get byId
router.get('/find/:id', async (req, res)=>{
    try{
        const cart = await Cart.findOne({id: req.params.id})
        res.status(200).json(cart)
    }catch(err){
        res.status(500).json(err)
    }
})

//get all
router.get('/', verifyTokenAndAdmin, async (req, res)=>{
    try{
        const cart = await Cart.find()
        res.status(200).json(cart)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;