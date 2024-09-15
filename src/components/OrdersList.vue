<script>
//importar base de datos de firebase
import { db } from '../firebaseConfig.js'
//importar funcionalidades para ver y alterar tabla desde firestore
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'

export default {
  data() {
    return {
      orders: []
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
      this.products = querySnapshot.docs
        //mapear arreglo de doc por id, agregar todas las propiedades en data
        .map((doc) => ({ id: doc.id, ...doc.data() }))
    },
    //ELIMINAR ORDEN
    async deleteOrder(id) {
      await deleteDoc(doc(db, 'orders', id))
      await this.fetchOrders()
    }
    //EDITAR ORDEN
    //editOrder(id) {}
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
          <th>Total</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.orderNumber }}</td>
          <td>${{ order.total }}</td>
          <td>
            <!--<button class="btn-small" @click="editOrder(order.id)">Editar</button>-->
            <button class="btn-small btn-danger" @click="deleteOrder(order.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <router-link to="/create-order" class="add-order-link">Agregar nueva orden</router-link>
  </div>
</template>
<style scoped>
.orders-list-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
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
.btn-small.btn-danger {
  background-color: #dc3545;
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
