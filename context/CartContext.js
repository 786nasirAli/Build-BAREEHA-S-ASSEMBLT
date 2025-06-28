import { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "react-hot-toast";

// Cart actions
const CART_ACTIONS = {
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  CLEAR_CART: "CLEAR_CART",
  LOAD_CART: "LOAD_CART",
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id,
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item._id === action.payload._id
            ? {
                ...item,
                quantity: item.quantity + (action.payload.quantity || 1),
              }
            : item,
        );
        return {
          ...state,
          items: updatedItems,
          totalItems: updatedItems.reduce(
            (total, item) => total + item.quantity,
            0,
          ),
          totalPrice: updatedItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
          ),
        };
      }

      const newItems = [
        ...state.items,
        { ...action.payload, quantity: action.payload.quantity || 1 },
      ];
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: newItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
      };
    }

    case CART_ACTIONS.REMOVE_FROM_CART: {
      const updatedItems = state.items.filter(
        (item) => item._id !== action.payload,
      );
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce(
          (total, item) => total + item.quantity,
          0,
        ),
        totalPrice: updatedItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const updatedItems = state.items.map((item) =>
        item._id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item,
      );
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce(
          (total, item) => total + item.quantity,
          0,
        ),
        totalPrice: updatedItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };

    case CART_ACTIONS.LOAD_CART:
      return action.payload;

    default:
      return state;
  }
};

// Initial cart state
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Create context
const CartContext = createContext();

// Cart provider component
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("bareehas-cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("bareehas-cart", JSON.stringify(cart));
  }, [cart]);

  // Cart actions
  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_TO_CART,
      payload: { ...product, quantity },
    });
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: productId });
    toast.success("Item removed from cart");
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id: productId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    toast.success("Cart cleared");
  };

  const getCartItemCount = () => cart.totalItems;

  const getCartTotal = () => cart.totalPrice;

  const isInCart = (productId) => {
    return cart.items.some((item) => item._id === productId);
  };

  const getCartItem = (productId) => {
    return cart.items.find((item) => item._id === productId);
  };

  const value = {
    cart,
    items: cart.items || [], // Provide safe access to items
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
    getCartTotal,
    isInCart,
    getCartItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
