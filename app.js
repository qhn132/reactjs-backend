import express from 'express'
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import expressValidator from 'express-validator';


const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();
dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());
app.use(expressValidator());

   
//Routes Middlewares
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);


//db connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Mongo DB Connected')
});

mongoose.connection.on('error', err => {     
    console.log(`DB connection error: ${err.message}` )
})

//PORT
const port = process.env.PORT || 8000
app.listen(port, () => { 
    console.log('localhost:',port)
})

