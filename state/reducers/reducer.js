import { ADD_ITEM_TO_CART, REMOVE_ITEM_FROM_CART} from '../actions'

const Reducer = (state,action) =>{
    switch (action.type) {
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
        default:
            return state
    }
}

export default Reducer;