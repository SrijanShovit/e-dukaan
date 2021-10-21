import {parseCookies} from 'nookies'
import baseUrl from '../helpers/baseUrl'
import cookie from 'js-cookie'
import {useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'

import StripeCheckout from 'react-stripe-checkout'
const Cart = ({error,products}) => {
    
    
    const {token} = parseCookies()
    const router = useRouter()
    const [cartProducts,setCartProducts] = useState(products)
    let price = 0;
    if (!token) {
        return(
            <div className='center-align'>
                <h3>Please Login to view your cart</h3>
                <Link href="/login"><a><button className='btn #1565c0 blue darken-3'>Login</button></a></Link>

            </div>
        )
    }
    if (error){
        M.toast({html:error,classes:'red'})
        cookie.remove('user')
        cookie.remove('token')
        router.push('/login')
    }

    const handleRemove = async (pid) => {
        const res = await fetch(`${baseUrl}/api/cart`,{
            method:'DELETE',
            headers:{
                'Content-Type': 'application/json',
                "Authorization": token
            },
            body: JSON.stringify({
                productId:pid
            })
        })
        const res2 = await res.json()
        setCartProducts(res2)

    }

    const CartItems = () => {
        price = 0
        return(

            <>
            {
                
                cartProducts.map(item => {
                    price  = price + item.quantity * item.product.price
                    return(
                        <div style={{display: 'flex',margin: '20px'}}>
                            <img src={item.product.mediaUrl} style={{width:'30%'}}/>
                            <div style={{marginLeft:'20px'}}>
                                <h6>{item.product.name}</h6>
                                <h6>{item.quantity} x ₹ {item.product.price}</h6>
                                <button className='btn red' onClick={() =>{handleRemove(item.product._id)}}>Remove</button>
                            </div>
                        </div>
                    )
                })
            }
            </>
        )
    }

    const handleCheckout = async (paymentInfo) => {
        console.log(paymentInfo)
        const res = await fetch(`${baseUrl}/api/payment`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                "Authorization": token
            },
            body: JSON.stringify({
                paymentInfo
            })
        })
        const res2 = await res.json()
        console.log(res2)

    }

    const TotalPrice = () => {
        return(
            // display flex is used for row-wise
            <div className='container' style={{display: 'flex', justifyContent: 'space-between'}}>
            <h5>Grand Total: ₹{price}</h5>
            {
                products.length !== 0 && 
                <StripeCheckout
                name = 'e-dukaan'
                amount = {price*100}
                image= {products.length > 0 ? products[0].product.mediaUrl : ''}
                currency = 'INR'
                shippingAddress = {true}
                billingAddress = {true}
                zipCode = {true}
                stripeKey='pk_test_51JmiqLSExKa31KSBN5hJH7HonBY0jJgj260w71y8MRVr5lHEUhVDCMLwBbVXSTyLS41BTSYX81MMSHdz0swAmOoW00h47NPH6N'
                token = {(paymentInfo)=>handleCheckout(paymentInfo)}
    
                >
                <button className='btn blue'>Checkout</button>
                </StripeCheckout>

            }
           
            </div>
        )
    }
    return (
        <div className="container">
         <CartItems/>
         <TotalPrice/>
        </div>
    )
}

export async function getServerSideProps(context){
    const {token} = parseCookies(context)
    if (!token){
        return {
            props: { products:[]}
        }
    }
    const res = await fetch(`${baseUrl}/api/cart`,{
        headers: {
            'Authorization':token
        }
    })
    const products = await res.json()
    if (products.error){
        return {
            props: {error:products.error}
        }
    }
    console.log(products)
    return {
        props: { products}
    }
}

export default Cart
