<script>
//importar base de datos de firebase
import { db } from '../firebaseConfig.js'
//importar funcionalidades para ver y alterar tabla desde firestore
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'

export default {
  data() {
    return {
      orders: [],
      //almacenar la orden actual para ser editada
      currentOrder: null,
      //almacenar los datos editados de la orden seleccionada
      editedOrder: {}
    }
  },
  async created() {
    await this.fetchOrders()
  },
  methods: {
    //OBTENER ORDENES
    async fetchOrders() {
      //buscar y capturar toda la info de la coleccion products
      const querySnapshot = await getDocs(collection(db, 'orders'))
      //asignar db a variable vue
      this.orders = querySnapshot.docs
        //mapear arreglo de doc por id, agregar todas las propiedades en data
        .map((doc) => ({ id: doc.id, ...doc.data() }))
    },
    //ELIMINAR ORDEN
    async deleteOrder(id) {
      await deleteDoc(doc(db, 'orders', id))
      await this.fetchOrders()
    },
    //EDITAR ORDEN
    async editOrder(id) {
      const orderDoc = doc(db, 'orders', id)
      //actualizar documento con los datos nuevos de la orden en coleccion 'orders'
      await updateDoc(orderDoc, this.editedOrder)
      //refrescar lista de ordenes
      await this.fetchOrders()
      this.currentOrder = null
    },

    //SELECCIONAR ORDEN
    setCurrentOrder(order) {
      //asignar orden seleccionada a variable currentOrder
      this.currentOrder = order
      //copiar los detalles de la orden a la orden editada
      this.editedOrder = { ...order }
    }
  }
}
</script>
<template>
  <div class="orders-list-container">
    <h1>Lista de ordenes</h1>
    <table class="orders-table">
      <thead>
        <tr>
          <th>Número de Orden</th>
          <th>Productos</th>
          <th>Total</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.orderNumber }}</td>
          <td>
            <ul v-for="product in order.products" :key="product.id">
              <li>
                {{ product.name }}
                -
                {{ product.quantity }}
              </li>
            </ul>
          </td>
          <td>${{ order.total }}</td>
          <td>
            <button class="btn-small" @click="setCurrentOrder(order)">Editar</button>
            <button class="btn-small btn-danger" @click="deleteOrder(order.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <router-link to="/create-order" class="add-order-link">Agregar nueva orden</router-link>
    <!--formulario para editar orden-->
    <!--aparecerá formulario si se selecciona una orden-->
    <div v-if="currentOrder" class="edit-order-form">
      <h2>Editar Orden</h2>
      <form @submit.prevent="editOrder(currentOrder.id)">
        <label for="orderNumber">Número de orden</label>
        <input type="text" v-model="editedOrder.orderNumber" id="orderNumber" required />
        <label for="total">Total</label>
        <input type="number" v-model="editedOrder.total" id="total" required />

        <button class="btn-small" type="submit">Guardar</button>
        <button type="button" class="btn-small" @click="currentOrder = null">Cancelar</button>
      </form>
    </div>
  </div>
</template>
<style scoped>
.orders-list-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
}
.orders-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.orders-table th {
  background-color: #f5f5f5;
}
.orders-table th,
.orders-table td {
  border: 1px solid #cccccc;
  padding: 8px;
  text-align: left;
}
.btn-small {
  padding: 5px 10px;
  font-size: 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-small.btn-danger {
  background-color: #dc3545;
  color: #ffffff;
}
.btn-small:hover,
.btn-danger:hover {
  opacity: 0.77;
}
.add-order-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 15px;
  text-decoration: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
}
.add-order-link:hover {
  background-color: #0056b3;
}
</style>
