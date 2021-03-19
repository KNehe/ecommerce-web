import { ADD_ITEM_TO_CART, REMOVE_ITEM_FROM_CART, SET_AUTH_DETAILS, 
    SET_NAVBAR_TITLE, SET_SHIPPING_DETAILS, SET_SINGLE_ORDER,
    SET_ONLY_LOGGED_IN_STATUS,
    SET_CURRENT_ACTIVITY,
    RESET_CART,
    CHANGE_NAME} from '../../actions'

import {HYDRATE} from 'next-redux-wrapper'

const initialState = {
    cart:[],
    navBarTitle: '',
    ShippingDetails: {},
    userId: '',
    singleOrder:{},
    isLoggedIn: false,
    jwt: '',
    email: '',
    name:'',
    currentActivity:''
}

const reducer = (state={...initialState},action) =>{

    switch (action.type) {
        case HYDRATE:
            console.log(state, action)
            return{...state,...action.payload}
        case ADD_ITEM_TO_CART:
            return {
                ...state,
                cart: state.cart.concat(action.payload)
            }
        case REMOVE_ITEM_FROM_CART:
            return {
                ...state,
                cart: state.cart.filter(product=>{
                    return product._id != action.payload._id
                } )
            }
        case SET_NAVBAR_TITLE:
            return {
                ...state,
                navBarTitle: action.payload
            }  
        case SET_SHIPPING_DETAILS:
            return{
                ...state,
                ShippingDetails: action.payload
            }
        case SET_SINGLE_ORDER:
            return{
                ...state,
                singleOrder: action.payload
            }  
        case SET_AUTH_DETAILS:
            return{
                ...state,
                jwt: action.payload.token,
                email: action.payload.user.email,
                name: action.payload.user.name,
                userId: action.payload.user.id
            }
        case SET_ONLY_LOGGED_IN_STATUS:
            return{
                    ...state,
                    isLoggedIn: action.payload
                }
        case SET_CURRENT_ACTIVITY:
            return{
                ...state,
                currentActivity: action.payload
            } 
        case RESET_CART:
            return{
                ...state,
                cart: state.cart.length = 0
            }
        case CHANGE_NAME:
            return{
                ...state,
                name:action.payload
            }              
        default:
            return {...state}
    }
}

export {reducer}