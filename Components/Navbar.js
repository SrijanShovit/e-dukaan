import Link from 'next/link'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'
import cookie from 'js-cookie'

const Navbar = () => {
  const router = useRouter()
  const cookieuser = parseCookies()
  const user = cookieuser.user ? JSON.parse(JSON.stringify(cookieuser.user)) :""
  
  //function to darken the route on clicking
  function isActive(route) {
    //passed route is compared with actual route
    if (route == router.pathname) {
      return "active"
    } else {
      return ""
    }
  }
  return (
    <div>
      <nav>
        <div className="nav-wrapper #4a148c purple darken-4">
          <Link href='/'><a className="brand-logo left">E-dukaan</a></Link>
          <ul className="right">
          <li className={isActive('/cart')}><Link href='/cart'><a>Cart</a></Link></li>
            {user.role == 'admin' &&
            user.role == 'root' &&

              <li className={isActive('/create')}><Link href='/create'><a>Create</a></Link> </li>
            }
            {user ?
              <>
                <li className={isActive('/account')}><Link href='/account'><a>Account</a></Link></li>
                <li><button className="btn red"
                onClick={() =>{
                  cookie.remove('token')
                  cookie.remove('user')
                  router.push('/login')
                }}
                >Logout</button></li>
              </>
              :
              <>
                <li className={isActive('/login')}><Link href='/login'><a>Login</a></Link></li>
                <li className={isActive('/signup')}><Link href='/signup'><a>Signup</a></Link> </li>
              </>
            }


          </ul>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
