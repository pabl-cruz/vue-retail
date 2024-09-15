<!--Lista de productos-->
<script>
//importar base de datos de firebase
import { db } from '../firebaseConfig.js'
//importar funcionalidades para ver y alterar tabla desde firestore
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'

export default {
  data() {
    return {
      products: [],
      //booleano para agregar producto y visualizarlo
      showAddProduct: false,
      selectedProduct: null,
      //objeto para captar valores de producto agregado
      productForm: {
        name: '',
        price: 0,
        description: ''
      }
    }
  },
  //ejecutar funcion asincrona cuando se cree componente
  async created() {
    //llamar a db para fetch products
    await this.fetchProducts()
  },
  //logica de metodos
  methods: {
    //OBTENER PRODUCTO
    async fetchProducts() {
      //buscar y capturar toda la info de la coleccion products
      const querySnapshot = await getDocs(collection(db, 'products'))
      //asignar db a variable vue
      this.products = querySnapshot.docs
        //mapear arreglo de doc por id, agregar todas las propiedades en data
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        //clasificar datos de db segun orden alfabetico
        .sort((a, b) => a.name.localeCompare(b.name))
    },
    //EDITAR PRODUCTO
    editProduct(id) {
      //encontrar producto por id
      const product = this.products.find((product) => product.id === id)
      this.productForm = { ...product }
      this.selectedProduct = id
      this.showAddProduct = true
    },
    //ELIMINAR PRODUCTO
    async deleteProduct(id) {
      //invocar funcion de firestore para eliminar elemento de tabla
      await deleteDoc(doc(db, 'products', id))
      //ejecutar de nuevo fetch para mostrar tabla actualizada
      await this.fetchProducts()
    },
    //AGREGAR Y EDITAR PRODUCTO
    async submitProduct() {
      //es un producto editado?
      if (this.selectedProduct) {
        await updateDoc(doc, (db, 'products', this.selectedProduct, this.productForm))
      } else {
        //si es un producto nuevo
        await addDoc(collection(db, 'products'), this.productForm)
      }
      //limpiar formulario
      this.cancel()
      await this.fetchProducts()
    },
    //LIMPIAR O REFRESCAR FORMULARIO
    cancel() {
      this.showAddProduct = false
      this.selectedProduct = null
      this.productForm = { name: '', price: 0, description: '' }
    }
  }
}
</script>

<template>
  <div class="product-list-container">
    <h1>Lista de Productos</h1>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Price</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.name }}</td>
          <td>$ {{ product.price }}</td>
          <td>{{ product.description }}</td>
          <td>
            <!--llamar a funcion editProduct con el parametro de id de product-->
            <button class="btn-small" @click="editProduct(product.id)">Editar</button>
            <button class="btn-small btn-danger" @click="deleteProduct(product.id)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="showAddProduct = true">Agregar nuevo producto</button>
    <!--formulario para agregar o eliminar producto-->
    <div v-if="showAddProduct || selectedProduct" class="product-form">
      <input v-model="productForm.name" placeholder="Nombre de Producto" />
      <input v-model="productForm.price" placeholder="Precio" />
      <textarea v-model="productForm.description" placeholder="Descripción de producto"></textarea>

      <button @click="submitProduct">Agregar Producto a lista</button>
      <button @click="cancel">Cancelar</button>
    </div>
  </div>
</template>
<style scoped>
.product-list-container {
  max-width: 800px;
  margin: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th {
  background-color: #f5f5f5;
}
th,
td {
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
  background-color: #007bff;
  color: white;
}

.btn-small.btn-danger {
  background-color: #dc3545;
}
.btn-small:hover,
.btn-danger:hover {
  opacity: 0.77;
}
.product-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}
.product-form input,
.product-form textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.product-form button:hover {
  background-color: #218838;
}
.product-form button {
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #28a745;
  color: white;
}
</style>
