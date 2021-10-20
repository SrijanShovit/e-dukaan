import jwt from 'jsonwebtoken'
import Cart from '../../models/Cart'

export default async (req, res) => {
    switch (req.method) {
        case 'GET':
            await fetchUserCart(req, res)
            break
        
        case 'PUT':
            await addProduct(req, res)
    }
}

//making middleware using higher order component
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
            return res.status(401).json({error:"You must be logged in"})
            
        }
    }
}

//wrapping with higher order component
const fetchUserCart = Authenticated(async (req,res) => {
       
        const cart = await Cart.findOne({user : req.userId})
        return res.status(200).json(cart.products)    

})

const addProduct = Authenticated(async (req, res)=>{
    const {quantity,productId} = req.body

    const cart = await Cart.findOne({user: req.userId})
    //checking whether product(sent from frontend) has already been added to cart via id
    const pExists = cart.products.some(pdoc => productId === pdoc.product.toString())
    if (pExists) {
        await Cart.findOneAndUpdate({_id:cart._id,"products.product":productId},
            //we have to update a sub-document
            {$inc:{"products.$.quantity":quantity}}
            )
    }else {
        const newProduct = {
            quantity,product:productId
        }
        //finding logged in user's cart's id
        await Cart.findOneAndUpdate({_id:cart._id},{$push:{products:newProduct}})
        
    }
    return res.status(200).json({message:'product added to cart'})  
})