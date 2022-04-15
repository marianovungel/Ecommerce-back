require('dotenv').config()
const express = require('express')
const app = express()
// require('./database')

//importações
const mongoose = require('mongoose')
const morgan = require('morgan')
const authRouter = require('./routes/auth.routes')
const userRouter = require('./routes/user.routes')
const productRouter = require('./routes/product.routes')
const cartRouter = require('./routes/cart.routes')
const orderRouter = require('./routes/order.routes')





//
app.use(morgan())
app.use(express.json())
mongoose.connect(process.env.URL_MONGDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//usar as importações
app.use('/auth', authRouter)
app.use('/product', productRouter)
app.use('/user', userRouter)
app.use('/order', orderRouter)
app.use('/cart', cartRouter)





port = process.env.PORT;
app.listen(port, console.log('porta '+ port))