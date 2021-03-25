import Head from 'next/head'
import NavBar from '../navbar/navbar'

const Layout = ({children, title})=>{
return(
    <div>
        <Head>
            <title>{title}</title>
            <link rel="icon" href="/favicon.ico" />
       </Head>

       <NavBar/>

        {children}
    </div>
)
}

export default Layout;