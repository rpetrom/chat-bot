<template>
  <v-app-bar color="success" dark height="50">
    <v-app-bar-title>OptiFood IA</v-app-bar-title>

    <v-spacer />
    <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none" />
    <div class="d-none d-md-flex">
      
      <v-btn class="boton" text to="/alimentos">Alimentos</v-btn>
      <v-btn class="boton" text to="/medio">Medio ambiente</v-btn>
      <v-btn class="boton" text to="/conocenos">Conócenos</v-btn>
      <v-btn class="boton" text to="/mision">Misión</v-btn>
      <v-btn class="boton" text to="/contacto">Contacto</v-btn>
    </div>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary class="d-md-none">
    <v-list>
      <v-list-item to="/alimentos" title="Alimentos" />
      <v-list-item to="/medio" title="Medio ambiente" />
      <v-list-item to="/conocenos" title="Conócenos" />
      <v-list-item to="/mision" title="Misión" />
      <v-list-item to="/contacto" title="Contacto" />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(false)
</script>

<style scoped>
.boton:hover {
  cursor: pointer;
}
.v-app-bar {
  box-shadow: none !important;
}
</style>
