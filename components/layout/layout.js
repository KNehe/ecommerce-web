import Head from 'next/head'

const Layout = ({children, title})=>{
return(
    <div>
        <Head>
            <title>{title}</title>
            <link rel="icon" href="/favicon.ico" />
       </Head>

        <nav>nav</nav>

        {children}
    </div>
)
}

export default Layout;