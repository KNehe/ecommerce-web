import { ADD_ITEM_TO_CART, REMOVE_ITEM_FROM_CART, SET_NAVBAR_TITLE} from '../actions'

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
        case SET_NAVBAR_TITLE:
            return {
                ...state,
                navBarTitle: action.payload
            }    
        default:
            return {...state}
    }
}

export default Reducer;