import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import Layout from "../../components/layout/layout"
import { SET_AUTH_DETAILS, SET_NAVBAR_TITLE, SET_ONLY_LOGGED_IN_STATUS } from "../../state/actions"
import styles from '../../styles/Auth.module.scss'
import Link from 'next/link'
import { useState } from "react"
import { ALL_FIELDS_ARE_REQUIRED, INVALID_EMAIL } from "../../consts/errors";
import { isEmailValid} from '../../utils/validators';
import { signIn } from "../../external_api/users/index"
import ProgressIndicator from '../../components/progress_indicator/progress_indicator'


const SignIn = ()=>{

    const dispatch = useDispatch()

    const state = useSelector(state =>state)
    
    useEffect(()=>{
        dispatch({type:SET_NAVBAR_TITLE,payload: 'Welcome'})
    },[])

    const [error, setError] = useState('')

    const emailInputRef = useRef(null)
    const passwordInputRef = useRef(null)

    const [isProcessing,setIsProcessing] = useState(false)

    const formSubmittedHandler = async (event) =>{

        event.preventDefault()

        setError('')

        const email = emailInputRef.current.value;
        const password = passwordInputRef.current.value

        validateInput(email,password)

        setIsProcessing(true)

        const {errorMsg,result} = await signIn(email,password)

        if(errorMsg){
            return setError(errorMsg)
        }

        dispatch({type: SET_AUTH_DETAILS, payload: result})

        dispatch({type: SET_ONLY_LOGGED_IN_STATUS, payload: true})

    }

    const validateInput = (email,password) =>{

        if(!email?.trim() || !password?.trim()){
            return setError(ALL_FIELDS_ARE_REQUIRED)
        }

        if(!isEmailValid(email)){
            return setError(INVALID_EMAIL)
        }
    }

    return (
        <Layout title='Sign in'>

            <section className={styles.main}>
                <div className={error? styles.error:styles.noerror}>{error?error:''}</div>
                <form onSubmit={formSubmittedHandler}>
                    <label for='email'>Email</label>
                    <input type='email' id='email' ref={emailInputRef}/>
                    <label for='password'>Password</label>
                    <input type='password' id='password' ref={passwordInputRef}/>
                    
                    <div className={styles.group1}>
                        <p>Sign in</p>
                        <button type='submit'>
                            {isProcessing?
                                <ProgressIndicator min={true}/>:
                                <FontAwesomeIcon icon={faArrowRight}/>
                            }
                        </button>
                    </div>
                    <div className={styles.group2}>
                        <Link href='/auth/signup'><p>Sign up</p></Link>
                        <Link href='/auth/forgot_password'><p>Forgot password</p></Link>
                    </div>
                </form>
            </section>

        </Layout>
    )
}

export default SignIn