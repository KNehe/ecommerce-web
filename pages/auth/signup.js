import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect,useState,useRef } from "react"
import { useDispatch,useSelector } from "react-redux"
import Layout from "../../components/layout/layout"
import { SET_AUTH_DETAILS, SET_NAVBAR_TITLE, SET_ONLY_LOGGED_IN_STATUS } from "../../state/actions"
import styles from '../../styles/Auth.module.scss'
import Link from 'next/link'
import { useRouter } from "next/router"
import { ALL_FIELDS_ARE_REQUIRED, INVALID_EMAIL } from "../../consts/errors";
import {signUp} from '../../external_api/users/index'
import ProgressIndicator from '../../components/progress_indicator/progress_indicator'
import { isEmailValid} from '../../utils/validators';
import { navigate } from "../../utils/navigator_helper";
import { CREATE_ACCOUNT } from "../../consts/navbar_titles"
import { useAuthRedirect, usePreFetch } from "../../utils/hooks"


const SignIn = ()=>{

    const dispatch = useDispatch()

    const router = useRouter()

    const {currentActivity,jwt,isLoggedIn} = useSelector(state => state)
    
    const [loadingScreen,setScreenLoad] = useState(true)

    useEffect(()=>{
        dispatch({type:SET_NAVBAR_TITLE,payload: CREATE_ACCOUNT})
        
        usePreFetch(currentActivity,router)

        useAuthRedirect(isLoggedIn,jwt,router,setScreenLoad)

    },[])

    const [error, setError] = useState('')
    
    const nameInputRef = useRef(null)
    const emailInputRef = useRef(null)
    const passwordInputRef = useRef(null)

    const [isProcessing,setIsProcessing] = useState(false)

    const [isSubmitBtnEnabled, setSubmitBtnEnabledState] = useState(false)
    
    const validateInput = (name,email,password) =>{

        if(!name?.trim() || !email?.trim() || !password?.trim()){
            setError(ALL_FIELDS_ARE_REQUIRED)
            return false
        }

        if(!isEmailValid(email)){
            setError(INVALID_EMAIL)
            return false
        }
    }

    const formSubmittedHandler = async event =>{

        event.preventDefault()
        
        setError('')

        setSubmitBtnEnabledState(true)
        
        const name = nameInputRef.current.value;
        const email = emailInputRef.current.value;
        const password = passwordInputRef.current.value

        if(validateInput(name,email,password) === false){
            setSubmitBtnEnabledState(false)
            return
        }

        setIsProcessing(true)

        const {errorMsg,result} = await signUp(name,email,password)

        if(errorMsg){
            setIsProcessing(false)
            setSubmitBtnEnabledState(false)
            return setError(errorMsg)
        }

        dispatch({type: SET_AUTH_DETAILS, payload: result})

        dispatch({type: SET_ONLY_LOGGED_IN_STATUS, payload: true})

        navigate(currentActivity,router)
    }


    return (
        <>
        {loadingScreen?
            <ProgressIndicator/>:
            <Layout title='Sign up'>

                <section className={styles.main}>
            <div className={error? styles.error:styles.noerror}>{error?error:''}</div>

                <form onSubmit={formSubmittedHandler}>
                    <label htmFor='name'>Name</label>
                    <input type='text' id='name' ref={nameInputRef}/>                    
                    <label htmFor='email'>Email</label>
                    <input type='email' id='email' ref={emailInputRef}/>
                    <label htmFor='password'>Password</label>
                    <input type='password' id='password' ref={passwordInputRef}/>
                    
                    <div className={styles.group1}>
                        <p>Sign up</p>
                        <button type='submit' disabled={isSubmitBtnEnabled}>
                            {isProcessing?
                                <ProgressIndicator min={true}/>:
                                <FontAwesomeIcon icon={faArrowRight}/>
                            }
                        </button>
                    </div>
                    <div className={styles.group2}>
                        <Link href='/auth/signin'><p>Sign in</p></Link> 
                    </div>
                </form>
            </section>

            </Layout>
        }
        </>
    )
}

export default SignIn