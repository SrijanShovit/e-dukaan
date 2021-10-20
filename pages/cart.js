import {parseCookies} from 'nookies'
import baseUrl from '../helpers/baseUrl'
import cookie from 'js-cookie'
import {useRouter} from 'next/router'
const Cart = ({error}) => {
    const {token} = parseCookies()
    const router = useRouter()

    if (error){
        M.toast({html:error,classes:'red'})
        cookie.remove('user')
        cookie.remove('token')
        router.push('/login')
    }
    return (
        <div>
            cart
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
