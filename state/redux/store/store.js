import {createStore, applyMiddleware} from 'redux'
import {createWrapper} from 'next-redux-wrapper'
import logger from 'redux-logger'
import {reducer} from "../reducer/reducer";

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
            whitelist: ['cart','navBarTitle','ShippingDetails','userId','singleOrder','isLoggedIn','jwt','email','name','currentActivity'],
            storage
        }

        const persistedReducer = persistReducer(persistConfig,reducer)
        const store = makeConfiguredStore(persistedReducer)

        store.__persistor = persistStore(store)

        return store
    }
}

export const wrapper = createWrapper(makeStore,{debug:true})