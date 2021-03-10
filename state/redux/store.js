import {createStore, applyMiddleware} from 'redux'
import {createWrapper,HYDRATE} from 'next-redux-wrapper'
import { ADD_ITEM_TO_CART, REMOVE_ITEM_FROM_CART, SET_NAVBAR_TITLE, SET_SHIPPING_DETAILS, SET_SINGLE_ORDER} from '../actions'
import logger from 'redux-logger'

const initialState = {
    cart:[],
    navBarTitle: '',
    ShippingDetails: {},
    userId: '',
    singleOrder:{},
    isLoggedIn: false,
    jwt: '',
    email: '',
    name:''
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

const makeConfiguredStore = reducer => createStore(reducer,undefined,applyMiddleware(logger))

//const makeStore = context => createStore(reducer)

const makeStore = () =>{
    
    const isServer = typeof window === 'undefined'

    if(isServer){
        return makeConfiguredStore(reducer)
    }else{
        const {persistStore,persistReducer} = require('redux-persist')
        const storage = require('redux-persist/lib/storage').default

        const persistConfig = {
            key: 'nextjs',
            whitelist: ['cart','navBarTitle','ShippingDetails','userId','singleOrder','isLoggedIn','jwt','email','name'],
            storage
        }

        const persistedReducer = persistReducer(persistConfig,reducer)
        const store = makeConfiguredStore(persistedReducer)

        store.__persistor = persistStore(store)

        return store
    }
}

export const wrapper = createWrapper(makeStore,{debug:true})