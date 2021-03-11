import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import Layout from "../../components/layout/layout"
import { SET_NAVBAR_TITLE } from "../../state/actions"
import styles from '../../styles/Auth.module.scss'

const SignIn = ()=>{

    const dispatch = useDispatch()
    
    useEffect(()=>{
        dispatch({type:SET_NAVBAR_TITLE,payload: 'Sign in'})
    },[])

    return (
        <Layout title='Welcome'>

            <section className={styles.main}>
                <form>
                    <label for='email'>Email</label>
                    <input type='email' id='email'/>
                    <label for='password'>Password</label>
                    <input type='password' id='password'/>
                    
                    <div className={styles.group1}>
                        <p>Sign in</p>
                        <button>
                            <FontAwesomeIcon icon={faArrowRight}/>
                        </button>
                    </div>
                    <div className={styles.group2}>
                        <p>Sign up</p>
                        <p>Forgot password</p>
                    </div>
                </form>
            </section>

        </Layout>
    )
}

export default SignIn