import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import ItemList from "./ItemList";
import {MOCKPRODUCTS} from "../../utils/mockProducts";
import {MOCKCATEGORIES} from "../../utils/mockCategories";

export default function ItemListContainer({greeting, handleShowDetails}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const {id_category} = useParams();

  //MOCK REQUEST FOR PRODUCT LIST
  useEffect(() => {
    const getProducts = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(MOCKPRODUCTS);
      }, 500);
    }, []);
    getProducts.then(data => {
      if (id_category === undefined) {
        setProducts(data);
      } else {
        let filtered = [...data];
        filtered = filtered.filter((item) => item.category === +id_category);
        setProducts(filtered);
      }
    });
  }, [id_category]);

  //MOCK REQUEST FOR CATEGORY LIST
  useEffect(() => {
    const getCategories = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(MOCKCATEGORIES);
      }, 500);
    }, []);
    getCategories.then(data => setCategories(data));
  });

  const [category, setCategory] = useState("");

  useEffect(() => {
    if (id_category === undefined) {
      setCategory("todas las categorías");
    } else {
      const categoryFilter = categories.filter(
        item => item.id === +id_category
      );
      setCategory("la categoría " + categoryFilter[0]?.name);
    }
  }, [categories, id_category, category]);

  const handleAdd = (e, quantity) => {
    const itemName = e.target.parentNode.getAttribute("name");
    const product = products.filter(item => item.name === itemName);
    const previousStock = product[0].stock;
    if (previousStock >= quantity) {
      const newProducts = [...products];
      const position = products.findIndex(item => item.name === itemName);
      newProducts[position].stock = previousStock - quantity;
      setProducts(newProducts);
      alert("Sumar al carrito " + quantity + " unidades del " + itemName);
    } else {
      alert("No hay stock suficiente, solo queda(n) " + previousStock);
    }
  };

  return (
    <div>
      <h1 style={{textAlign: "center"}}>
        {greeting}, desde aquí podrás ver un listado de {category}{" "}
      </h1>
      <ItemList
        handleAdd={handleAdd}
        handleShowDetails={handleShowDetails}
        products={products}
      />
    </div>
  );
}
