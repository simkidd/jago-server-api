import { Router } from "express";
import User from "../models/User";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const router = Router()

// register
router.post('/register', async (req, res) => {
  try {
    const { name, email, username, password } = req.body
    // validate inputs
    if (!name || !email || !username || !password)
      return res.status(400).json({ msg: "all fields are required" })

    const user_email = await User.findOne({ email })
    if (user_email)
      return res.status(400).json({ msg: "email already exists." })

    const user_name = await User.findOne({ username })
    if (user_name)
      return res.status(400).json({ msg: "username not available" })
    if (password.length < 6)
      return res.status(400).json({ msg: "password must be at least 6 characters" })

    // password encryption
    const salt = await bcrypt.genSalt(10)
    const hashedPsw = await bcrypt.hash(password, salt)

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPsw
    })

    // generate auth token on success
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    })

    await newUser.save()

    res.json({
      msg: "register success",
      token,
      user: {
        ...newUser._doc,
        password: ""
      }
    })
  } catch (err) {
    console.log(err);
    return res.status(500).json(err.msg)
  }
});

// login
router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body
    // validate inputs
    if ((!!email && !!username) || (!email && !username))
      return res.status(400).json({ msg: "enter email or username." })
    if (!password)
      return res.status(400).json({ msg: "password is required." })

    const user = await User.findOne(email ? { email } : { username })
    if (!user)
      return res.status(400).json({ msg: "user not found." })

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid)
      return res.status(400).json({ msg: "incorrect password" })

    // generate auth token on success
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    })

    res.json({
      msg: "login success",
      token,
      user: {
        ...user._doc,
        password: ""
      }
    })
  } catch (err) {
    return res.status(500).json(err.msg)
  }
})



export default router