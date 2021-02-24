import Head from 'next/head'
import { useContext } from 'react';
import { Context } from '../../state/store/store';

const Layout = ({children, title})=>{
    const [state,_] = useContext(Context)
return(
    <div>
        <Head>
            <title>{title}</title>
            <link rel="icon" href="/favicon.ico" />
       </Head>

        <nav>nav {state.cart.length}</nav>

        {children}
    </div>
)
}

export default Layout;