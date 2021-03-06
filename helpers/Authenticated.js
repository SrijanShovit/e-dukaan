//making middleware using higher order component

import jwt from 'jsonwebtoken'

function Authenticated(icomponent){
    return (req,res) => {
        const {authorization} = req.headers;
        if (!authorization){
            return res.status(401).json({error:"You must be logged in"})
        }
        try {
            const {userId} = jwt.verify(authorization,process.env.JWT_SECRET)
            req.userId = userId
            return icomponent(req,res)
        } catch (error) {
            console.log(error)
            return res.status(401).json({error:"You must be logged in"})
            
        }
    }
}

export default Authenticated