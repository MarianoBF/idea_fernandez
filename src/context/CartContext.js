import {useState, useEffect, useContext, createContext} from "react";
import {getFirestore} from "../firebase";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({children}) => {
  const [allProducts, setAllProducts] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    try {
      const local = localStorage.getItem("CartZ");
      if (local?.length > 0) {
        const existingCart = JSON.parse(local);
        setCartProducts(existingCart);
      }
    } catch {
      console.log("Unable to recover previous order");
    } finally {
      const db = getFirestore();
      const itemCollection = db.collection("products");
      itemCollection
        .get()
        .then(data => {
          setAllProducts(data.docs.map(item => item.data()));
        })
        .catch(error => console.log(error));
    }
  }, []);

  const addItem = (quantity, product_id, option) => {
    const filtered = cartProducts.filter(item => item.id === product_id);
    if (
      filtered.length === 0 ||
      (option && filtered[0].option.value !== option)
    ) {
      const retrieveProduct = allProducts.filter(
        item => item.id === product_id
      );
      const newCart = [
        ...cartProducts,
        {
          id: product_id,
          quantity,
          option,
          name: retrieveProduct[0].name,
          price: retrieveProduct[0].price,
          stock: retrieveProduct[0].stock,
          image: retrieveProduct[0].image,
        },
      ];
      setCartProducts(newCart);
      localStorage.setItem("CartZ", JSON.stringify(newCart));
    }
  };

  const removeItem = (product_id, option) => {
    let filtered;
    console.log(option, cartProducts);
    if (option) {
      const otherOptions = cartProducts
        .filter(item => item.id === product_id)
        .filter(item => item.option.value !== option.value);
      const otherProds = cartProducts.filter(item => item.id !== product_id);
      filtered = [...otherProds, ...otherOptions];
      console.log(filtered);
    } else {
      filtered = cartProducts.filter(item => item.id !== product_id);
    }
    setCartProducts(filtered);
    localStorage.setItem("CartZ", JSON.stringify(filtered));
  };

  const clear = () => {
    setCartProducts([]);
    localStorage.setItem("CartZ", []);
  };

  const isInCart = product_id => {
    return !(
      cartProducts.filter(item => +item.id === +product_id).length === 0
    );
  };

  const isOptionInCart = (product_id, option) => {
    const product = cartProducts.filter(item => +item.id === +product_id);
    const match = product.filter(item => item.option.value === option);
    return match.length > 0;
  };

  const getTotalNumberOfItems = () => {
    const reducer = (prev, cur) => prev + cur.quantity;
    const totalItems = cartProducts.reduce(reducer, 0);
    return totalItems;
  };

  const getTotalPrice = () => {
    const reducer = (prev, cur) => prev + cur.quantity * cur.price;
    const totalPrice = cartProducts.reduce(reducer, 0);
    return totalPrice;
  };

  const increaseQuantity = (product_id, option) => {
    let position;
    const newProducts = [...cartProducts];
    if (option?.name) {
      position = newProducts.findIndex(
        item => item.option.value === option.value && +item.id === +product_id
      );
    } else {
      position = cartProducts.findIndex(item => +item.id === +product_id);
    }
    if (newProducts[position].quantity <= newProducts[position].stock) {
      newProducts[position].quantity++;
      setCartProducts(newProducts);
    }
  };

  const decreaseQuantity = (product_id, option) => {
    let position;
    const newProducts = [...cartProducts];
    if (option?.name) {
      position = newProducts.findIndex(
        item => item.option.value === option.value && +item.id === +product_id
      );
    } else {
      position = cartProducts.findIndex(item => +item.id === +product_id);
    }
    if (newProducts[position].quantity >= 2) {
      newProducts[position].quantity--;
      setCartProducts(newProducts);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        addItem,
        removeItem,
        clear,
        isInCart,
        isOptionInCart,
        getTotalNumberOfItems,
        getTotalPrice,
        increaseQuantity,
        decreaseQuantity,
      }}>
      {children}
    </CartContext.Provider>
  );
};
