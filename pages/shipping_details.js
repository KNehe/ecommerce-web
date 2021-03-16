import styles from '../styles/ShippingDetails.module.scss'
import Layout from '../components/layout/layout'
import { useEffect, useRef, useState } from 'react'
import { SET_NAVBAR_TITLE, SET_SHIPPING_DETAILS } from '../state/actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faCity, faHome, faMailBulk, faPhone, faUser } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { SHIPPING_DETAILS } from '../consts/navbar_titles'

const ShippingDetails = () =>{

    const dispatch = useDispatch()

    const [errorMessage,setErrorMessage] = useState('')

    const router =  useRouter()

    useEffect(()=>{
        dispatch({type: SET_NAVBAR_TITLE, payload: SHIPPING_DETAILS})
    },[])

    const nameInputRef = useRef(null)
    const phoneInputRef = useRef(null)
    const addressInputRef = useRef(null)
    const cityInputRef = useRef(null)
    const postalCodeInputRef = useRef(null)
    const countryInputRef = useRef(null)

    const onFormSubmittedHandler = event =>{
        
        event.preventDefault();

        const name = nameInputRef?.current?.value
        const phoneContact = phoneInputRef?.current?.value
        const addressLine = addressInputRef?.current?.value
        const city  = cityInputRef?.current?.value
        const postalCode = postalCodeInputRef?.current?.value
        const country = countryInputRef?.current?.value

        if(!name || !phoneContact || !addressInputRef ||
            !city || !addressLine || !postalCode || !country
          ){
              setErrorMessage('All fields are required')
              return setTimeout(()=>{
                  setErrorMessage('')
              },4000)
          }
        
        const shippingDetails = {
            name,
            phoneContact,
            addressLine,
            city,
            postalCode,
            country
        }

        dispatch({type: SET_SHIPPING_DETAILS, payload: {...shippingDetails}})

        router.push('/payment_method');
    }

    return(   
        <Layout title='Shipping details'>
            <section className={styles.shipping_form_sec}>
                <div className={errorMessage?styles.errorMessage:styles.errorNoMessage}><p>{errorMessage}</p></div>
                <form onSubmit={onFormSubmittedHandler}>
                    <div className={styles.input_group}>
                        <FontAwesomeIcon icon={faUser} />
                        <div>
                            <label htmlFor='name'>Enter name</label>
                            <input type='text' id='name' ref={nameInputRef}/>
                        </div>
                    </div>
                    <div className={styles.input_group}>
                        <FontAwesomeIcon icon={faPhone} />
                        <div>
                            <label htmlFor='phone_number'>Enter phone number</label>
                            <input type='text' id='phone_number' ref={phoneInputRef}/>
                        </div>
                    </div>
                    <div className={styles.input_group}>
                        <FontAwesomeIcon icon={faHome} />
                        <div>
                            <label htmlFor='address_line'>Enter address line</label>
                            <input type='text' id='address_line' ref={addressInputRef}/>
                        </div>
                    </div>
                    <div className={styles.input_group}>
                        <FontAwesomeIcon icon={faBuilding} />
                        <div>
                            <label htmlFor='city'>Enter city</label>
                            <input type='text' id='city' ref={cityInputRef}/>
                        </div>
                    </div>
                    <div className={styles.input_group}>
                        <FontAwesomeIcon icon={faMailBulk} />
                        <div>
                            <label htmlFor='postal_code'>Enter postal code</label>
                            <input type='text' id='postal_code' ref={postalCodeInputRef}/>
                        </div>
                    </div>
                    <div className={styles.input_group}>
                        <FontAwesomeIcon icon={faCity} />
                        <div>
                            <label htmlFor='country'>Enter country</label>
                            <input type='text' id='country' ref={countryInputRef}/>
                        </div>
                    </div>
                    <input type='submit' value='Continue' />
                </form>
            </section>
        </Layout>
     )
}

export default ShippingDetails;