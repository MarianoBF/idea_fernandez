import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Image from "react-bootstrap/Image";

export default function Cart({products, cartMethods, finished}) {
  const styles = {
    Image: {
      maxHeight: "50px",
      width: "70px",
      objectFit: "contain",
      margin: "2px auto",
    },
    Table: {
      textAlign: "center",
      verticalAlign: "middle",
    },
    Total: {
      background: "lightblue",
      fontSize: "1.3rem",
      fontWeigth: "bold",
    },
    SmallButton: {
      fontSize: "0.8rem",
    },
    ItemCount: {
      display: "flex",
      flexWrap: "no-wrap",
      flexDirection: "row",
      alignItems: "center",
      height: "100%",
    }
  };

  const {remove, clear, total, increaseQuantity, decreaseQuantity} =
    cartMethods;

  const productsInCart = products.map(item => {
    return (
      <tr key={item.id}>
        <td>
          <Image style={styles.Image} src={item.image} rounded />
        </td>
        <td>{item.name}</td>
        <td>
        <div div class="container-fluid d-flex justify-content-around align-items-center">
        {!finished&&
          <Button
            onClick={() => decreaseQuantity(item.id)}
            style={styles.SmallButton}>
            -
          </Button>}
          {item.quantity}{!finished&&
          <Button
            onClick={() => increaseQuantity(item.id)}
            style={styles.SmallButton}>
            +
          </Button>}
          </div>
        </td>
        <td>${item.price}</td>
        <td>${item.price * item.quantity}</td>
        {!finished&&<td>
          <Button style={styles.SmallButton} onClick={() => remove(item.id)}>
            Borrar
          </Button>
        </td>}
      </tr>
    );
  });

  return (
    <div>
      <h2>
        {finished
          ? "Este es el detalle de la orden que realizó"
          : "Productos en el carrito"}
      </h2>

      <Table striped bordered hover responsive style={styles.Table}>
        <thead>
          <tr>
            <th></th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio unitario</th>
            <th>Precio total</th>
            {!finished&&<th>Borrar producto</th>}
          </tr>
        </thead>
        <tbody>{productsInCart}</tbody>
        <tfoot>
          <tr>
            <td>Total: </td>
            <td></td>
            <td></td>
            <td></td>
            <td style={styles.Total}>${total()}</td>
            {!finished&&<td>
              <Button style={styles.SmallButton} onClick={clear}>
                Vaciar Carrito
              </Button>
            </td>}
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}
