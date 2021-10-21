import {parseCookies} from 'nookies'
import baseUrl from '../helpers/baseUrl'
import {useEffect,useRef} from 'react'
const Account = ({orders}) => {
    const orderCard = useRef(null)
    const cookie = parseCookies()
    
    const user = cookie.user ? JSON.parse(cookie.user) :"User not found"
    
    useEffect(() => {
        M.Collapsible.init(orderCard.current)

    }, [])

    const OrderHistory = () => {
        return (
            <ul className="collapsible" ref={orderCard}>
                {orders.reverse().map(item => {
                    return (
                            <li key={item._id}>
                            <div className="collapsible-header"><i className="material-icons">folder</i>{item.createdAt}</div>
                            <div className="collapsible-body">
                                <h5>Total :  ₹ {item.total}</h5>
                                {
                                    item.products.map(pitem=>{
                                        return (
                                            <h6 key={pitem._id}>{pitem.product.name} x {pitem.quantity}</h6>
                                        )
                                    })
                                }
                            </div>
                            </li>

                    )
                    })}
            
          </ul>
        )
    }
    return (
       
        <div className='container'>
        <div className='center-align'>
            <h4>{user.name}</h4>
            <h4>{user.email}</h4>
        </div>    
        <h3>Order History</h3>
        {
            orders.length == 0
            ?
            <div className='center-align container'>
                <h3>You have no orders</h3>
            </div>
            :
            <OrderHistory/> 
        }
        </div>
    )
}

export async function getServerSideProps(context){
    const {token} = parseCookies(context)
    if (!token){
        const {res} = context
        res.writeHead(302,{Location: '/login'})
        res.end()
    }

    const res =   await fetch(`${baseUrl}/api/orders`,{
        method: 'GET',
        headers:{
          "Authorization": token
        }
    })
        
    const res2 = await res.json()
        
    console.log(res2)
    
    return {
        props: {orders:res2}
    }
}
export default Account
