
import { createApp } from "vue";
import App from "./App.vue";
// import './style.css'
import router from "./router/index";
import { createVuetify } from "vuetify";
import "vuetify/styles";

import * as component from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";


// Crear la instancia de Vuetify
const vuetify = createVuetify({
  components: {
    ...component, // Aquí importas todos los componentes de Vuetify
    
  },
 
  directives, // Aquí registras todas las directivas de Vuetify
  ssr: true, // Habilitar el soporte para SSR si es necesario
});

const app = createApp(App);

// Usa el enrutador de Vue y Vuetify en la aplicación
app.use(router);
app.use(vuetify);

// Monta la aplicación
app.mount("#app");
