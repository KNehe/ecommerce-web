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
import { googleAuth, signIn } from "../../external_api/users/index"
import ProgressIndicator from '../../components/progress_indicator/progress_indicator'
import { navigate } from "../../utils/navigator_helper";
import { useRouter } from "next/router"
import { WELCOME } from "../../consts/navbar_titles"
import { useAuthRedirect, usePreFetch } from "../../utils/hooks"
import GoogleLogin from "react-google-login"


const SignIn = ({appSecret})=>{

    const dispatch = useDispatch()

    const router = useRouter()

    const {currentActivity,jwt,isLoggedIn} = useSelector(state => state)

    const [loadingScreen,setScreenLoad] = useState(true)

    useEffect(()=>{
        dispatch({type:SET_NAVBAR_TITLE,payload: WELCOME})
        
        usePreFetch(currentActivity,router)

        useAuthRedirect(isLoggedIn,jwt,router,setScreenLoad)
    
    },[])

    const [error, setError] = useState('')

    const emailInputRef = useRef(null)
    const passwordInputRef = useRef(null)

    const [isProcessing,setIsProcessing] = useState(false)

    const [isSubmitBtnEnabled, setSubmitBtnEnabledState] = useState(false)


    const formSubmittedHandler = async (event) =>{

        event.preventDefault()

        setError('')

        setSubmitBtnEnabledState(true)

        const email = emailInputRef.current.value;
        const password = passwordInputRef.current.value

        if(validateInput(email,password) === false){
            setSubmitBtnEnabledState(false)
            return
        }

        setIsProcessing(true)

        const {errorMsg,result} = await signIn(email,password)

        if(errorMsg){
            setIsProcessing(false)
            setSubmitBtnEnabledState(false)
            return setError(errorMsg)
        }

        dispatch({type: SET_AUTH_DETAILS, payload: result})

        dispatch({type: SET_ONLY_LOGGED_IN_STATUS, payload: true})

        navigate(currentActivity,router)

    }

    const validateInput = (email,password) =>{

        if(!email?.trim() || !password?.trim()){
            setError(ALL_FIELDS_ARE_REQUIRED)
            return false;
        }

        if(!isEmailValid(email)){
            setError(INVALID_EMAIL)
            return false;
        }
    }
    
    const onGoogleLoginFailure = (res) =>{
        let error = res.error == 'popup_closed_by_user'? 'Pop up closed' : res.error
        if(res){
            setError(error)
            setSubmitBtnEnabledState(false)
            return 
        }
    }
    
    const  refreshTokenSetup = (response) =>{
        //timin to renew access token
        const refreshTiming = (response.tokenObj.expires_in || 3600 -5 * 60) * 1000
        const refreshToken = async () =>{
            const newAuthResponse = await response.reloadAuthResponse();
            refreshTiming = (newAuthResponse.expires_in || 3660 -5 * 60) * 1000
console.log('new auth token', newAuthResponse.id_token)
            //setup the other timer after the first time
            setTimeout(refreshToken,refreshTiming)
        }
        //setup first refresh timer
        setTimeout(refreshToken,refreshTiming)
    }

    const onGoogleLoginSuccess = async (response) =>  {

        setSubmitBtnEnabledState(true)

        setError('')

        refreshTokenSetup(response)

        const name = response?.profileObj?.name
        const email = response?.profileObj?.email

        if(!name || !email){
           return setError('An error occurred')
        }
        
        setScreenLoad(true)

        const {errorMsg,result} = await googleAuth(name,email,appSecret)
        
        if(errorMsg){
            setError(errorMsg)
            setSubmitBtnEnabledState(false)
            setScreenLoad(false)
            return 
        }

        dispatch({type: SET_AUTH_DETAILS, payload: result})

        dispatch({type: SET_ONLY_LOGGED_IN_STATUS, payload: true})

        navigate(currentActivity,router)

    } 

    return (
        <>
            {loadingScreen ?
            <ProgressIndicator/>:
            <Layout title='Sign in'>
                <section className={styles.main}>
                    <div className={error? styles.error:styles.noerror}>{error?error:''}</div>
                   <GoogleLogin
                    clientId='40283411941-pogp16dkoh4cf683vafpj7029pobqe3d.apps.googleusercontent.com'
                    buttonText='Login With Google'
                    onSuccess={onGoogleLoginSuccess}
                    onFailure={onGoogleLoginFailure}
                    cookiePolicy={'single_host_origin'}
                    disabled={isSubmitBtnEnabled}
                    style={{ marginBottom:'10em', borderRadius:'20px'}} 
                    className={styles.google_btn}                   
                   />
                   
                   <p style={{textAlign:'center', marginBottom:'1.5em'}}>OR</p>

                    <form onSubmit={formSubmittedHandler}>
                        <label htmlFor='email'>Email</label>
                        <input type='email' id='email' ref={emailInputRef}/>
                        <label htmlFor='password'>Password</label>
                        <input type='password' id='password' ref={passwordInputRef}/>
                        
                        <div className={styles.group1}>
                            <p>Sign in</p>
                            <button type='submit' disabled={isSubmitBtnEnabled}>
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
            } 
        </>     
    )
}

export default SignIn

export async function getStaticProps(){
    const appSecret = process.env.NEHE_APP_SECRET;
    return {
        props:{ appSecret }
    }
}