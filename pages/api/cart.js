import jwt from 'jsonwebtoken'
import Cart from '../../models/Cart'

export default async (req,res) => {
    const {authorization} = req.headers;
    if (!authorization){
        return res.status(401).json({error:"You must be logged in"})

    }
    try {
        const {userId} = jwt.verify(authorization,process.env.JWT_SECRET)
        const cart = await Cart.findOne({user : userId})
        return res.status(200).json(cart.products)
    } catch (error) {
        return res.status(401).json({error:"You must be logged in"})
        
    }


}