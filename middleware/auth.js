import jwt from 'jsonwebtoken';


const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")
        if (!token)
            return res.status(400).json({ msg: "access denied" })

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err)
                return res.status(400).json({ msg: "invalid token" })

            req.user = user
            next()
        })

    } catch (err) {
        return res.status(500).json(err.msg)
    }
}

export default auth