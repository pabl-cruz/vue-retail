<script>
export default {
  name: 'App'
}
</script>

<template>
  <div id="app">
    <h1>Bienvenidos a nuestra tienda</h1>
    <nav>
      <router-link to="/products">Lista de Productos</router-link>
      <router-link to="/orders">Lista de Ordenes</router-link>
      <router-link to="/create-order">Crear Orden</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style>
nav a {
  margin: 0 1rem;
}
</style>
