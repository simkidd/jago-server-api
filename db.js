import mongoose from 'mongoose'

const connectDB = async()=>{
    try {
        const db = await mongoose.connect(process.env.MONGO_URL)
        console.log("Mongodb Connected");
        
        return db
    } catch (err) {
        console.log(err);
        process.exit(1)
    }
}

export default connectDB