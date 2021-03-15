import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { route } from "next/dist/next-server/server/router"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import Layout from "../../components/layout/layout"
import { SET_NAVBAR_TITLE } from "../../state/actions"
import styles from '../../styles/Auth.module.scss'
import { ALL_FIELDS_ARE_REQUIRED, PASWORDS_DONT_MATCH } from "../../consts/errors";
import { resetPassword } from "../../external_api/users"
import ProgressIndicator from '../../components/progress_indicator/progress_indicator'
import Link from 'next/link'

const ResetPassword = ({token})=>{

    const dispatch = useDispatch()

    const router = useRouter()
    
    useEffect(()=>{
        dispatch({type:SET_NAVBAR_TITLE,payload: 'Reset password'})
        
        if(!token){
            router.push('/')
        }
        
    },[])

    const [error, setError] = useState('')

    const newPasswordInputRef = useRef(null)
    const confirmPasswordInputRef = useRef(null)

    const [isProcessing,setIsProcessing] = useState(false)

    const [isSubmitBtnEnabled, setSubmitBtnEnabledState] = useState(false)
    
    const [successMsg,setSuccessMsg] = useState('')

    const onFormSubmittedHandler = async event =>{

        event.preventDefault()
        
        setError('')

        setSubmitBtnEnabledState(true)

        const newPassword = newPasswordInputRef.current.value;
        const confirmPassword = confirmPasswordInputRef.current.value

        if(validateInput(newPassword,confirmPassword) === false){
            setSubmitBtnEnabledState(false)
            return
        }

        setIsProcessing(true)

        const {errorMsg,result} = await resetPassword(token,confirmPassword)

        if(errorMsg){
            setIsProcessing(false)
            setSubmitBtnEnabledState(false)
            return setError(errorMsg)
        }

        setIsProcessing(false)
        setSubmitBtnEnabledState(false)
        setSuccessMsg(result)
    }

    const validateInput = (newPassword,confirmPassword) =>{

        if(!newPassword?.trim() || !confirmPassword?.trim()){
            setError(ALL_FIELDS_ARE_REQUIRED)
            return false;
        }
        if(newPassword != confirmPassword){
            setError(PASWORDS_DONT_MATCH)
            return false
        }
    }

    return (
        <Layout title='Reset password'>

            <section className={styles.main}>
            {successMsg?
                <div className={styles.success_message}>
                    <p>{successMsg}</p>
                    <p><Link href='/auth/signin'><a style={{color:'#fff', textDecoration:'underline', fontSize:'.8em', fontWeight:'500'}}>Sign in</a></Link></p>
                </div>:
                <>
                    <div className={error? styles.error:styles.noerror}>{error?error:''}</div>
                    <form onSubmit={onFormSubmittedHandler}>
                    <label htmlFor='newPassword'>New password</label>
                    <input type='password' id='newPassword' ref={newPasswordInputRef}/>
                    <label htmlFor='oldPassword'>Old password</label>
                    <input type='password' id='oldPassword' ref={confirmPasswordInputRef}/>
                    
                    <div className={styles.group1}>
                        <p>Reset password</p>
                        <button type="submit" disabled={isSubmitBtnEnabled}>
                            {isProcessing?
                                    <ProgressIndicator min={true}/>:
                                    <FontAwesomeIcon icon={faArrowRight}/>
                                }
                        </button>
                    </div>
                </form>
                </>
            }
            </section>

        </Layout>
    )
}

export function getServerSideProps(context) {

    const token = context?.query?.token || null

    return {
      props: {token}
    };
  }

export default ResetPassword