import Link from 'next/link'
import baseUrl from '../helpers/baseUrl'


const Home = ({ products }) => {

  const productlist = products.map(product => {
    return (<div className="card pcard" key={product._id}>
      <div className="card-image">
        <img src={product.mediaUrl} />
        <span className="card-title">{product.name}</span>
      </div>
      <div className="card-content">
      ₹ {product.price}
      </div>
      <div className="card-action">
        <Link href={'/product/[id]'} as={`/product/${product._id}`}><a>View Product Details</a></Link>
      </div>
    </div>)
  })
  console.log(products)
  return (
    <div className="rootcard">
      {productlist}
    </div>
  )
}

export async function getStaticProps() {
  const res = await fetch(`${baseUrl}/api/products`)
  const data = await res.json()
  return {
    props: {
      products: data
    }
  }

}

//this function will run only on server side
//getStaticProps is used for non user specific pgs like landing pg->made ready before request by user
//getServerSideProps is used for user specific pgs like cart->prepared only when requested


export default Home
