import { createSlice } from "@reduxjs/toolkit";
const storedCart = localStorage.getItem('cart');
const initialCart = storedCart ? JSON.parse(storedCart) : [];
const initialState = {
  carts: initialCart,
  subtotal: 0,
};
const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addtoCart: (state, action) => {
      const existingProductIndex = state.carts.findIndex(
        (product) => product.id === action.payload.id
      );
      if (existingProductIndex !== -1)
       {
        state.carts[existingProductIndex].qty += 1;
      }
      else
       {
        const product = { ...action.payload, qty: 1 };
        state.carts.push(product);
      }
      // state.subtotal = state.carts.reduce((total, product) => {
      //   return total + product.qty * product.price;
      // }, 0);
      // console.log(action.payload);
      // const product={...action.payload,qty:1};
      // console.log(product);
      // state.carts.push(product);
      localStorage.setItem('cart',JSON.stringify(state.carts));

    },
    removefromCart: (state, action) => {
      const productIndex = state.carts.findIndex((x) => x.id === action.payload.id);
      if (productIndex !== -1) {
        const currentQty = state.carts[productIndex].qty;
        if (currentQty > 1) {
          state.carts[productIndex].qty -= 1;
        }
        else {
          state.carts = state.carts.filter((x) => x.id !== action.payload.id);
        }
      }
      // state.subtotal = state.carts.reduce((total, product) => {
      //   return total + product.qty * product.price;
      // }, 0);

    },
    removefromCross: (state, action) => {
          state.carts = state.carts.filter((x) => x.id !== action.payload.id);
          localStorage.removeItem('cart');
    },
    Subtotal: (state, action) => {
      state.subtotal = state.carts.reduce((total, product) => {
        return total + product.qty * product.price;
      }, 0);
    },

  },
});

export default CartSlice.reducer;
export const { addtoCart, removefromCart, Subtotal,removefromCross} = CartSlice.actions;
