import express from 'express'
import connectDB from './db'
import dotenv from 'dotenv'
import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute'


// initialize dependencies
const app = express()
dotenv.config()

// middlewares
app.use(express.json())

// custom routes
app.use('/auth', authRoute)
app.use('/user', userRoute)

// home route
app.get('/', (req,res)=>{
  res.json({msg: "Backend is running..."})
})

// server config
const startServer = async()=>{
  try {
    await connectDB()
    app.listen(process.env.PORT, ()=>{
      console.log(`Server Started On Port ${process.env.PORT}`);
    })
  } catch (err) {
    console.log(err);
    process.exit(1)
  }
}

startServer()