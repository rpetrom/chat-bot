<script setup>
import Navegacion from "./components/Navegacion.vue";
import ChatBot from "./components/ChatBot.vue";
</script>

<template>
  <v-app style="background-color: #f5f5f5">
    
    <v-layout>
      <ChatBot />
    </v-layout>
  </v-app>
</template>

<style>
.custom-input {
  margin: 10px 25px;
  border-radius: 20px !important;
}
.bot-message table {
  border-collapse: collapse;
  width: 100%;
}

.bot-message th,
.bot-message td {
  border: 1px solid #ccc;
  padding: 5px;
}

.bot-message th {
  background-color: #f5f5f5;
}
.bot-message li{
  margin-left: 20px;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #555ceeaa);
  cursor: pointer;
}
</style>
