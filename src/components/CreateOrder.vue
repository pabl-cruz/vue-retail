<script>
import { db } from '../firebaseConfig'
import { collection, addDoc, getDocs } from 'firebase/firestore'

export default {
  data() {
    return {
      newOrder: {
        orderNumber: '',
        products: [],
        total: 0
      },
      availableProducts: []
    }
  },
  async created() {
    await this.fetchProducts()
  },
  methods: {
    async fetchProducts() {
      const querySnapshot = await getDocs(collection(db, 'products'))
      this.availableProducts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        quantity: 0
      }))
    },
    //AGREGAR PRODUCTO A ORDEN
    addProductToOrder(selectedProduct) {
      if (selectedProduct.quantity <= 0) {
        alert('Por favor, agregue una cantidad valida')
        return
      }
      const productTotal = selectedProduct.price * selectedProduct.quantity
      const productToAdd = {
        ...selectedProduct,
        total: productTotal
      }
      this.newOrder.products.push(productToAdd)
      this.calculateOrderTotal()
    },
    //CALCULAR TOTAL DE ORDEN
    calculateOrderTotal() {
      this.newOrder.total = this.newOrder.products.reduce((acc, product) => acc + product.total, 0)
    },
    //BUSCAR SI SE AGREGO PRODUCTO
    isProductAdded(product) {
      this.newOrder.products.some((item) => item.id === product.id)
    },
    //REMOVER PRODUCTO DE ORDEN
    removeProductFromOrder(index) {
      this.newOrder.products.splice(index, 1)
    },
    //SUBIR ORDEN
    async submitOrder() {
      if (this.newOrder.products.length === 0) {
        alert('Por favor, agregue al menos un producto en su orden')
        return
      }
      await addDoc(collection(db, 'orders'), this.newOrder)
      alert('Orden creada con éxito')
      this.resetOrderForm()
    },
    //REINICIAR VALORES
    resetOrderForm() {
      this.newOrder = { orderNumber: '', products: [], total: 0 }
      this.availableProducts.forEach((product) => (product.quantity = 0))
    }
  }
}
</script>

<template>
  <div class="create-order-container">
    <h1>Crear nueva orden</h1>
    <!--crear nueva orden con submitOrder-->
    <form @submit.prevent="submitOrder">
      <input v-model="newOrder.orderNumber" placeholder="Order Number" class="input-style" />
      <table class="product-selection-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Agregar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in availableProducts" :key="product.id">
            <td>{{ product.name }}</td>
            <td>${{ product.price }}</td>
            <td>
              <input
                type="number"
                v-model="product.quantity"
                min="0"
                placeholder="Cantidad"
                class="input-style"
              />
            </td>
            <td>
              <button
                type="button"
                @click="addProductToOrder(product)"
                class="add-button"
                :disabled="isProductAdded(product)"
              >
                Agregar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Productos seleccionados:</h2>
      <ul>
        <li v-for="(item, index) in newOrder.products" :key="index">
          {{ item.name }} - Cantidad: {{ item.quantity }} - Total: ${{ item.total }}
          <button @click="removeProductFromOrder(index)" class="btn-small btn-danger">
            Remove
          </button>
        </li>
      </ul>
      <p>
        <strong>Total de Orden: ${{ newOrder.total }}</strong>
      </p>
      <button type="submit" class="submit-button">Agregar orden</button>
    </form>
  </div>
</template>
<style scoped>
.create-order-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
}
label {
  display: block;
  margin-bottom: 5px;
}
input[type='number'],
input[type='text'] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  background-color: #e9ecef;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn-small {
  padding: 5px 10px;
  font-size: 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-danger {
  background-color: #dc3545;
  color: white;
}
.btn-small:hover,
.btn-danger:hover {
  opacity: 0.77;
}
h2,
p {
  margin-top: 28px;
}
.product-selection-table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

.product-selection-table th {
  background-color: #f5f5f5;
}
.product-selection-table th,
.product-selection-table td {
  border: 1px solid #cccccc;
  padding: 8px;
  text-align: left;
}
.product-selection-table input[type='number'] {
  max-width: 80px;
}

.product-selection-table th:nth-child(1) {
  width: 50%;
}
.product-selection-table th:nth-child(2),
.product-selection-table th:nth-child(3) {
  width: 15%;
}
.product-selection-table th:nth-child(4) {
  width: 15%;
}
.input-style {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}
.add-button[disabled] {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
