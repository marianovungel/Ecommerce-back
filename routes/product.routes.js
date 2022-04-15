const router = require('express').Router()
const Product = require('../models/Product')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')

//criar
router.post('/', verifyTokenAndAdmin, async (req, res)=>{
    const newProduct = new Product(req.body);
    try{
        const criateProduct = await newProduct.save();
        res.status(200).json(criateProduct)
    }catch(err){
        res.status(500).json(err)
    }
})

//editar
router.put('/:id', verifyTokenAndAdmin, async (req, res)=>{
    try{
        const newProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})

        res.status(200).json(newProduct)

    }catch(err){
        res.status(500).json(err)
    }
})

//delete
router.delete('/:id', verifyTokenAndAdmin, async (req, res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Produto deletado com sucesso!")
    }catch(err){
        res.status(500).json(err)
    }
})

//get byId
router.get('/find/:id', async (req, res)=>{
    try{
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    }catch(err){
        res.status(500).json(err)
    }
})

//get all
router.get('/', verifyTokenAndAdmin, async (req, res)=>{
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try{
        let products;
        if(qNew){
            products = await Product.find().sort({_id: -1}).limit(5)
        }else if(qCategory){
            products = await Product.find({categories: {$in:[qCategory],}})
        }else{
            products = await Product.find()
        }
        res.status(200).json(products)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;