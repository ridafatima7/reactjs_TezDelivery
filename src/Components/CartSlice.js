import { createSlice } from "@reduxjs/toolkit";
const storedCart = localStorage.getItem('cart');
const initialCart = storedCart ? JSON.parse(storedCart) : [];
const initialState = {
  carts: initialCart.items || [],
  additionalItems: initialCart.additionalItems || [],
  // carts: initialCart,
  subtotal: 0,
};
const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addtoCart: (state, action) => {
      const existingProductIndex = state.carts.findIndex(
        (product) => product.id === action.payload.id && 
        (!action.payload.variationTitle)
      );
      const existingVariationIndex = state.carts.findIndex(
        (product) => {
          console.log('Comparing product.variationPrice:', product.productTitle, 'with action.payload.variationPrice:', action.payload.productTitle);
          return product.id === action.payload.id && 
          product.productTitle === action.payload.productTitle;
        }
      );
      if (existingProductIndex !== -1  ) {
        state.carts[existingProductIndex].qty += 1;
      } 
     
      else if (existingVariationIndex !== -1  ) {
        state.carts[existingVariationIndex].qty += 1;
      } 
      else 
      {
        console.log(existingVariationIndex)
        const product = { ...action.payload, qty: action.payload.qty || 1 };
        state.carts.push(product);
      }
      // state.subtotal = state.carts.reduce((total, product) => {
      //   return total + product.qty * product.price;
      // }, 0);
      // console.log(action.payload);
      // const product={...action.payload,qty:1};
      // console.log(product);
      // state.carts.push(product);
      localStorage.setItem('cart', JSON.stringify(state.carts));

    },
    addAdditionalProductToCart: (state, action) => {
      const existingIndex = state.additionalItems.findIndex(item => item.id === action.payload.id);

      if (existingIndex !== -1) {
        state.additionalItems[existingIndex] = {
          ...state.additionalItems[existingIndex],    // Spread operator to copy existing properties like id
          name: action.payload.name,
          qty: action.payload.qty
        };
      } else {
        const product = { ...action.payload };
        state.additionalItems.push(product);
      }
      localStorage.setItem('cart', JSON.stringify({ items: state.carts, additionalItems: state.additionalItems }));
    },
    removefromCart: (state, action) => {
      const productIndex = state.carts.findIndex((x) => x.id === action.payload.id && x.name === action.payload.name);
      if (productIndex !== -1) {
        const currentQty = state.carts[productIndex].qty;
        if (currentQty > 1) {
          state.carts[productIndex].qty -= 1;
        }
        else {
          console.log(action.payload.name)
          state.carts = state.carts.filter((x) => x.id !== action.payload.id || x.name !== action.payload.name );
          if (state.carts.length > 0) {
            localStorage.setItem('cart', JSON.stringify(state.carts));
          } else {
            state.additionalItems = [];
            localStorage.removeItem('cart');
          }
        }
      }
   

    },
    removefromCross: (state, action) => {
      state.carts = state.carts.filter((x) => x.id !== action.payload.id ||  x.name !== action.payload.name );
      if (state.carts.length === 0) {
        state.additionalItems = [];
      }
      if (state.carts.length > 0) {
        localStorage.setItem('cart', JSON.stringify(state.carts));
      } else {
        state.additionalItems = [];
        localStorage.removeItem('cart');
      }
      
    },
    deleteAdditionalProduct: (state, action) => {
      state.additionalItems = state.additionalItems.filter(item => item.id !== action.payload.id);
      localStorage.setItem('cart', JSON.stringify({ items: state.carts, additionalItems: state.additionalItems }));
    },
    Subtotal: (state, action) => {
      console.log(state.carts);
      state.subtotal = state.carts.reduce((total, product) => {
        return total + product.qty * (product.exclusivePrice > 0 ? product.exclusivePrice : product.price);
      }, 0);

      console.log(state.subtotal);
      localStorage.setItem('subtotal', JSON.stringify(state.subtotal));
    },
    clearCart: (state) => {
      state.carts = [];
      state.additionalItems = [];
      state.subtotal = 0;
      localStorage.removeItem('cart'); 
    },

  },
});

export default CartSlice.reducer;
export const { addtoCart, removefromCart, Subtotal, removefromCross,clearCart, addAdditionalProductToCart,deleteAdditionalProduct } = CartSlice.actions;
