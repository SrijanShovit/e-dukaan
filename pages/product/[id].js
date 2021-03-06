import { useRouter } from 'next/router'

import cookie2 from 'js-cookie'
import { parseCookies } from 'nookies'
import baseUrl from '../../helpers/baseUrl'
import {useRef,useEffect,useState} from 'react'
const Product = ({ product }) => {
    const [qty,setQty] = useState(1)
    const router = useRouter()
    const modalRef = useRef(null)
    const cookie = parseCookies()
    const user = cookie.user ? JSON.parse(JSON.stringify(cookie.user)) :""
    useEffect(()=>{
        M.Modal.init(modalRef.current)
    },[])
    if (router.isFallback) {
        return (
            <h3>loading...</h3>
        )
    }

    const getModal = () => {
        return (
            <div id="modal1" className="modal" ref={modalRef}>
                <div className="modal-content">
                    <h4>{product.name}</h4>
                    <p>Are you sure you want to delete this?</p>
                </div>
                <div className="modal-footer">
                    <button className="btn waves-effect waves-light align-left #ec407a pink lighten-1"  style={{margin:'5px'}}>Cancel
                    </button>
                    <button className="btn waves-effect waves-light #03a9f4 light-blue"
                    onClick={() =>deleteProduct()}
                    >Yes
                    </button>
                </div>
            </div>
        )
    }

    const deleteProduct = async () => {
        const res = await fetch (`${baseUrl}/api/product/${product._id}`,{
            method: 'DELETE',
        })
        await res.json()
        router.push('/')
    }

    const addToCart = async () => {
        const res = await fetch(`${baseUrl}/api/cart`,{
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': cookie.token
            },
            body: JSON.stringify({
                quantity:qty,
                productId: product._id,
            })
        })
        const res2 = await res.json()
        if (res2.error){
            M.toast({html:error,classes:'red'})
            cookie2.remove('user')
            cookie2.remove('token')
            router.push('/login')
        }
        M.toast({html: res2.message,classes:'green'})
    }
    return (
        <div className="container center-align">
            <h3>{product.name}</h3>
            <img src={product.mediaUrl} style={{ width: '30%' }} />
            <h5>Rs {product.price}</h5>
            <input type="number"
                style={{ width: '400px', margin: '10px' }}
                min="1"
                value = {qty}
                onChange={(e)=>setQty(Number(e.target.value))}
                placeholder="Quantity" />
                {user ?
                
            <button className="btn waves-effect waves-light #673ab7 deep-purple"
            onClick={()=>addToCart()}
            >Add to Cart
                <i className="material-icons right">add</i>
            </button>
             :
            <button className="btn waves-effect waves-light #673ab7 deep-purple"
            onClick={()=>router.push('/login')}
            >Login to add
                <i className="material-icons right">add</i>
            </button>
           

                }
            <p className="left-align">{product.description}</p>
            {
                user.role == 'admin' && 
                user.role == 'root' && 
            <button data-target="modal1" className="btn modal-trigger waves-effect waves-light #d32f2f red darken-2">Delete
                <i className="material-icons right">delete</i>
            </button>
            }
            
            {getModal()}
        </div>
    )
}

// export async function getServerSideProps({params:{id}}){
//     const res = await fetch(`http://localhost:3000/api/product/${id}`)
//     const data = await res.json()
//     return {
//         props: {product:data},
//     }
// }
export async function getStaticProps({ params: { id } }) {
    const res = await fetch(`${baseUrl}/api/product/${id}`)
    const data = await res.json()
    return {
        props: { product: data },
    }
}

//using getStaticPath we have pass id of products to prepare them during build only
export async function getStaticPaths() {
    return {
        paths: [
            { params: { id: "616bf51d2fa3d7586034d90f" } }
        ],
        fallback: true
    }
}

export default Product