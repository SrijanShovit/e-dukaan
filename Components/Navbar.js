import Link from 'next/link'
import {useRouter} from 'next/router'

const Navbar = () => {
  const router = useRouter()
  //function to darken the route on clicking
  function isActive(route) {
    //passed route is compared with actual route
    if (route == router.pathname){
      return "active"
    }else{
      return ""
    }
  }
    return (
        <div>
              <nav>
    <div className="nav-wrapper #4a148c purple darken-4">
      <Link href='/'><a className="brand-logo left">E-dukaan</a></Link>
      <ul className="right">
        <li className={isActive('/login')}><Link href='/login'><a>Login</a></Link></li>
        <li className={isActive('/signup')}><Link href='/signup'><a>Signup</a></Link> </li>     
        <li className={isActive('/create')}><Link href='/create'><a>Create</a></Link> </li>     
      </ul>
    </div>
  </nav>
        </div>
    )
}

export default Navbar
