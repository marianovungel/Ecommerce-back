const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');

//get
router.get('/', async (req, res)=>{
try{
  const userget = await User.find()
  res.send(userget)
}catch(err){
    res.status(500).json(err)
}
})
//cadastrar
router.post("/register", async(req, res)=>{
  try{
      //usando bcrypt para incriptar a senha
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(req.body.password, salt)
      const nerUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPass,
      });

      const user = await nerUser.save();
      res.status(200).json(user);
  }catch(err){
      res.status(500).json(err);
  }
  
});

//LOGIN
router.post("/login", async(req, res)=>{
  try{
      const user = await User.findOne({ username: req.body.username});
      !user && res.status(400).json("credencial errada");

      const validated = await bcrypt.compare(req.body.password, user.password);
      if(!validated){
          return res.status(400).json("credencial errada");
      }

      const accessToken = jwt.sign({
        id: user._id,
        isAdmin: user.isAdmin,
      }, process.env.JWT_SEC, {expiresIn: "3d"})
      const {password, ...others} = user._doc;
      res.status(200).json({...others, accessToken});
  }catch(err){
      res.status(500).json(err);
  }
  
});

module.exports = router;