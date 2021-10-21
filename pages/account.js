import {parseCookies} from 'nookies'


const Account = () => {
    const cookie = parseCookies()
    console.log(cookie)
    // const user = cookie.user ? JSON.parse(JSON.stringify(cookie.user)) :""
    // console.log('User:', user)
    return (
        <div>hi ac</div>
        // <div className='container'>
        // <div className='center-align'>
        //     <h4>{user.name}</h4>
        //     <h4>{user.email}</h4>
        // </div>     
        // </div>
    )
}

export async function getServerSideProps(context){
    const {token} = parseCookies(context)
    if (!token){
        const {res} = context
        res.writeHead(302,{Location: '/login'})
        res.end()
    }
    return {
        props: {}
    }
}
export default Account
