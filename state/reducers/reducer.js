import { ADD_ITEM_TO_CART} from '../actions'

const Reducer = (state,action) =>{
    switch (action.type) {
        case ADD_ITEM_TO_CART:
            return {
                ...state,
                cart: state.cart.concat(action.payload)
            }         
        default:
            return state
    }
}

export default Reducer;