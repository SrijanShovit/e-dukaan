import '../styles/globals.css'
import Layout from '../Components/Layout'

//wrapping entire components within Layout
function MyApp({ Component, pageProps }) {
  return (<Layout>
  <Component {...pageProps} />
  </Layout>
  ) 
}

export default MyApp
