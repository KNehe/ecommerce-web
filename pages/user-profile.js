import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles/UserProfile.module.scss'
import Layout from '../components/layout/layout'
import { SET_NAVBAR_TITLE } from '../state/actions';
import { USER_PROFILE } from '../consts/navbar_titles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faUser } from '@fortawesome/free-solid-svg-icons';

const UserProfile = () =>{

   const dispatch = useDispatch()
   const {name, email} = useSelector(state => state)

   useEffect(()=>{
    dispatch({type: SET_NAVBAR_TITLE, payload: USER_PROFILE})
   })
    
return (
    <Layout title={USER_PROFILE}>
        <section className={styles.main}>
            <div className={styles.profile}>
                
                <div className={styles.avatar}>
                    <FontAwesomeIcon icon={faUser}/>
                </div>

                <div className={styles.profile_nest}>
                    
                <div className={styles.input_group}>
                    <label htmlFor='name'>Name</label>
                    <div className={styles.inputANDicon}>
                        <input type='text' id='name' value={name} disabled={true}/>
                        <FontAwesomeIcon icon={faPencilAlt}/>
                    </div>
                    </div>
                    <div className={styles.input_group}>
                        <label htmlFor='email'>Email</label>
                        <div  className={styles.inputANDicon}> 
                            <input type='email' id='email' value={email} disabled={true}/>
                            <FontAwesomeIcon icon={faPencilAlt}/>
                        </div>
                    </div>
                    <button type='button' >Sign Out</button>
                </div>

            </div>

        </section>
    </Layout>
    
)    
}

export default UserProfile;