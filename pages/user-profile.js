import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles/UserProfile.module.scss'
import Layout from '../components/layout/layout'
import { CHANGE_EMAIL, CHANGE_NAME, RESET_AUTH_DETAILS, SET_CURRENT_ACTIVITY, SET_NAVBAR_TITLE } from '../state/actions';
import { USER_PROFILE } from '../consts/navbar_titles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import BackDrop from '../components/backdrop/backdrop'
import Modal from '../components/modal/modal'
import { useState } from 'react';
import { CHANGING_EMAIL, CHANGING_NAME, SIGNING_OUT, VIEWING_PROFILE } from '../consts/activities';
import { isJwtValid, updateEmail, updateName } from '../external_api/users';
import { useRouter} from 'next/router'
import ProgressIndicator from '../components/progress_indicator/progress_indicator'
import SignInRequest from "../components/signin_request/signin_request";

const UserProfile = () =>{

   const dispatch = useDispatch()

   const {name, email,jwt,userId, currentActivity, isLoggedIn} = useSelector(state => state)

   const [ isModalVisible , setModalVisibility ] = useState(false)

   const nameInputRef = useRef(null)

   const emailInputRef = useRef(null)

   const [error,setError] = useState('')

   const [jwtValid,setJwtValidity] = useState(false)

   const router = useRouter()

   const [initLoad , setInitLoad ] = useState(true)

   const [ isProcessing, setProcessing] = useState(false)

   useEffect(async ()=>{
    
    
    dispatch({type: SET_NAVBAR_TITLE, payload: USER_PROFILE})

    const isValid = await isJwtValid(jwt) 

    setJwtValidity(isValid)

    router.prefetch('/auth/signin')

    router.prefetch('/')

    setError('')

    if (typeof isValid !== 'undefined') {
        setInitLoad(false)
    }
   },[])


   const onBackDropClickedHandler = event =>{
       
      event.preventDefault()

       setModalVisibility(false)

       setProcessing(false)
   }

   const handleIconClick = (event,activity) =>{

       event.preventDefault()
       
       dispatch({type: SET_CURRENT_ACTIVITY,payload: activity})
 
       setModalVisibility(true)

       setError('')

   }

   const updateHandler =  async event =>{

    event.preventDefault()
    
    const newName = nameInputRef?.current?.value;

    const newEmail = emailInputRef?.current?.value;
  
    if(currentActivity === CHANGING_NAME){
       
        if(!newName){
            return
        }
        
        setProcessing(true)

        const {result, errorMsg} = await updateName(newName,userId,jwt)
       
        if(errorMsg){
            setProcessing(false)
            setModalVisibility(false)
            setError(errorMsg)
            return
        }

        dispatch({type:CHANGE_NAME,payload:result.name})
        setProcessing(false)
        setModalVisibility(false)

    }

    if(currentActivity === CHANGING_EMAIL){
       
        if(!newEmail){
            return
        }
        
        setProcessing(true)

        const {result, errorMsg} = await updateEmail(newEmail,userId,jwt)
       
        if(errorMsg){
            setProcessing(false)
            setModalVisibility(false)
            setError(errorMsg)
            return
        }

        dispatch({type:CHANGE_EMAIL,payload:result.email})
        setProcessing(false)
        setModalVisibility(false)

    }

    if(currentActivity === SIGNING_OUT){
        setProcessing(true)
        await router.push('/')
        dispatch({type:RESET_AUTH_DETAILS})
    }

   }

   const signinBtnHandler = async event =>{

    event.preventDefault()
    
    dispatch({type: SET_CURRENT_ACTIVITY,payload: VIEWING_PROFILE})

    await router.push('/auth/signin')
   }

   const signoutBtnHandler = event =>{

    event.preventDefault()
    
    dispatch({type: SET_CURRENT_ACTIVITY, payload: SIGNING_OUT})

    setModalVisibility(true)
   }
    
return (
    <Layout title={USER_PROFILE}>

        <BackDrop isVisible={isModalVisible} clickHandler={onBackDropClickedHandler}/>
       
        <Modal isVisible={isModalVisible}>
            <div className={styles.edit_sec}>
                <form onSubmit={updateHandler}>
                    {currentActivity === CHANGING_NAME ?
                        <>
                            <label htmlFor='name'>Name</label>
                            <input type='text' id='name' ref={nameInputRef} required/>
                        </>: currentActivity === CHANGING_EMAIL?
                        <>
                            <label htmlFor='email'>Email</label>
                            <input type='email' id='email' ref={emailInputRef} required/>
                        </>: ''
                    }
                    <button type='submit'                            
                            disabled={isProcessing}
                    >
                        {isProcessing ? 
                            <ProgressIndicator min={true}/>:
                            currentActivity === SIGNING_OUT ?
                            'Confirm sign out': 'Save'
                        }
                    </button>
                </form>
            </div>
        </Modal>

        <section className={styles.main}>
            {initLoad ? <ProgressIndicator/>:
            <>
                { !isLoggedIn  || !jwtValid?
                    
                    //Show when user isn't logged in or jwt expired
                  <SignInRequest 
                    isLoggedIn={isLoggedIn} 
                    jwtValid={jwtValid} 
                    click={signinBtnHandler}
                   />:

                    <div className={styles.profile}>
                        
                        <div className={styles.avatar}>
                            <FontAwesomeIcon icon={faUser}/>
                        </div>

                        <div className={styles.profile_nest}>
                            
                            {error?
                            // error from api
                                <div className={styles.error_message}>{error}</div>: ''
                            }
                            
                            <div className={styles.input_group}>
                                <label htmlFor='name'>Name</label>
                                <div className={styles.inputANDicon}>
                                    <input type='text' id='name' value={name} disabled={true}/>
                                    <FontAwesomeIcon icon={faPencilAlt} onClick={(event)=>handleIconClick(event,CHANGING_NAME)}/>
                                </div>
                                </div>
                                    <div className={styles.input_group}>
                                        <label htmlFor='email'>Email</label>
                                        <div  className={styles.inputANDicon}> 
                                            <input type='email' id='email' value={email} disabled={true}/>
                                            <FontAwesomeIcon icon={faPencilAlt} onClick={(event)=>handleIconClick(event,CHANGING_EMAIL)}/>
                                        </div>
                                    </div>
                                <button type='button' onClick={signoutBtnHandler}>Sign Out</button>
                        </div>

                    </div>
                    
                }
            </> 
            }
        </section>
    
    </Layout>
    
)    
}



export default UserProfile;