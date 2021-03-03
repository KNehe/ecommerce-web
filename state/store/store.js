import { createContext, useReducer} from 'react'
import Reducer from '../reducers/reducer'

export const Context = createContext()

const Store = ({children}) =>{

    const initialState = {
        cart:[],
        navBarTitle: '',
        ShippingDetails: {},
        userId: null,
        singleOrder:{}
    }

    const [state,dispatch] = useReducer(Reducer,initialState)

    return(
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    );
}


export default Store