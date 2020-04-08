export function getCartItemQuantity( cart, id ) {
    return cart.find( item => item.product.id === id ).quantity;
}


export const getTotalPriceOfCartItems = (cartItems) => {
    if(!cartItems.length > 0){
        return 0; 
    }

    return cartItems.reduce((a,b) => {
        return !(b.quantity > 1) && a + +b.product.price || +b.product.price * b.quantity
    },0); 

}