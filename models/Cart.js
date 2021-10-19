import mongoose from 'mongoose';
//objectId is used to relate one model's field to another model

const {ObjectId} = mongoose.Schema.Types

const cartSchema = new mongoose.Schema({
    user:{
        type: ObjectId,
        ref:'user'
    },
    products:[{
        quantity:{type:Number,default:1},
        product:{type:ObjectId,ref:'product'}
    }]
})

export default  mongoose.models.Cart || mongoose.model('Cart', cartSchema)