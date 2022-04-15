const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')

//editar
router.put('/:id', verifyTokenAndAuthorization, async (req, res)=>{
    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt)
        req.body.password = hashedPass;
    }
    try{
        const uploadUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})

        res.status(200).json(uploadUser)

    }catch(err){
        res.status(500).json(err)
    }
})

//delete
router.delete('/:id', verifyTokenAndAuthorization, async (req, res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("Usuário deletado com sucesso!")
    }catch(err){
        res.status(500).json(err)
    }
})

//get byId
router.get('/find/:id', verifyTokenAndAdmin, async (req, res)=>{
    try{
        const user = await User.findById(req.params.id)
        const { password, ...outher } = user._doc;
        res.status(200).json(outher)
    }catch(err){
        res.status(500).json(err)
    }
})

//get all
router.get('/', verifyTokenAndAdmin, async (req, res)=>{
    const query = req.query.new;
    try{
        const user = query ? await User.find().sort({_id: -1}).limit(5) : await User.find()
        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err)
    }
})

//get all
router.get('/stats', verifyTokenAndAdmin, async (req, res)=>{
    const date = new Date();
    const lastyear = new Date(date.setFullYear(date.getFullYear() -1))
    try{
        const data = await User.aggregate([
            {$match: {createdAt: {$gte: lastyear}}},
            {$project:{
                month: {$month: "$createdAt"},
            }},
            {$group: { _id:"$month", total:{$sum: 1}}}
        ])
        res.status(500).json(data)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;