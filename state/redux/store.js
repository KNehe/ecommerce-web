import {createStore} from 'redux'
import {createWrapper,HYDRATE} from 'next-redux-wrapper'
import { ADD_ITEM_TO_CART, REMOVE_ITEM_FROM_CART, SET_NAVBAR_TITLE, SET_SHIPPING_DETAILS, SET_SINGLE_ORDER} from '../actions'

const initialState = {
    cart:[],
    navBarTitle: '',
    ShippingDetails: {},
    userId: null,
    singleOrder:{}
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
        default:
            return {...state}
    }
}

const makeStore = context => createStore(reducer)

export const wrapper = createWrapper(makeStore,{debug:true})