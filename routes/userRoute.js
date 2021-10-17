import { Router } from "express";
import auth from '../middleware/auth';
import User from "../models/User";

const router = Router()
// get user
router.get('/', auth, async(req,res)=>{
    try {
        const user = await User.findById(req.user._id).select("-password -__v")
        if(!user)
            return res.status(400).json({msg: "user does not exist"})

        res.json(user)
    } catch (err) {
        return res.status(500).json(err.msg)
    }
})

export default router