import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles/UserProfile.module.scss'
import Layout from '../components/layout/layout'
import { CHANGE_EMAIL, CHANGE_NAME, SET_CURRENT_ACTIVITY, SET_NAVBAR_TITLE } from '../state/actions';
import { USER_PROFILE } from '../consts/navbar_titles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import BackDrop from '../components/backdrop/backdrop'
import Modal from '../components/modal/modal'
import { useState } from 'react';
import { CHANGING_EMAIL, CHANGING_NAME, VIEWING_PROFILE } from '../consts/activities';
import { isJwtValid, updateEmail, updateName } from '../external_api/users';
import { useRouter} from 'next/router'
import ProgressIndicator from '../components/progress_indicator/progress_indicator'

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

   }

   const signinBtnHandler = event =>{

    event.preventDefault()
    
    dispatch({type: SET_CURRENT_ACTIVITY,payload: VIEWING_PROFILE})

    router.push('/auth/signin')
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
                        </>:
                        <>
                            <label htmlFor='email'>Email</label>
                            <input type='email' id='email' ref={emailInputRef} required/>
                        </>
                    }
                    <button type='submit'                            
                            disabled={isProcessing}
                    >
                     {isProcessing ? <ProgressIndicator min={true}/>: 'Save'}
                    </button>
                </form>
            </div>
        </Modal>

        <section className={styles.main}>
            {initLoad ? <ProgressIndicator/>:
            <>
                { !isLoggedIn  || !jwtValid?
                    
                    //Show when user isn't logged in or jwt expired
                    <div className={styles.no_profile_access_display}>
                        {!jwtValid?
                            <p>Session expired. Please sign in to see profile</p>:
                            <p>Please sign in to see profile</p>
                        }
                        <div className={styles.btn_signin}
                            onClick={signinBtnHandler}
                        >
                            Sign in
                        </div>
                    </div>:

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
                                <button type='button' >Sign Out</button>
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