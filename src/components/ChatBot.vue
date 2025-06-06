<!-- src/components/ChatBot.vue -->
<template>
  <v-card
    class="chat-card"
    title="OPTIFOOD IA"
    subtitle="Tu asistente inteligente"
    elevation="3"
    v-show="showChat"
  >
    <template v-slot:prepend>
      <img :src="robotIcon" width="50" height="50" />
    </template>

    <template v-slot:append>
      <v-btn icon="mdi-plus" @click="newChat" variant="text"></v-btn>
    </template>
    <v-divider></v-divider>
    <!-- este el metodo del chat la plantilla del chat  -->
    <v-card-text class="chat-window" style="overflow-y: auto">
      <!-- en "msg, i" recojo todo los mensajes o respuestas y lo guardo en la arrays-->
      <div
        v-for="(msg, i) in messages"
        :key="i"
        class="mb-2 d-flex"
        :class="msg.sender === 'Bot' ? 'justify-start' : 'justify-end'"
      >
        <div class="d-flex container-bot" v-if="msg.sender === 'Bot'">
          <img :src="robotIcon" width="30" height="30" class="bot-icon" />
          <v-card class="bot-message">
            <div class="pa-2" v-html="msg.text"></div>
            <p class="date pa-1">{{ msg.date }}</p>
          </v-card>
        </div>
        <div class="d-flex" v-if="msg.sender === 'Tu'">
          <v-card class="user-message pa-2">
            <p style="color: white">{{ msg.text }}</p>
            <p class="date-user">{{ msg.date }}</p>
          </v-card>
          <img :src="usesrIcon" width="30" height="30" class="user-icon" />
        </div>
      </div>
    </v-card-text>

    <v-text-field
      :disabled="limitReached"
      class="custom-input"
      width="90%"
      bg-color="black"
      v-model="userMessage"
      label="Responder pregunta..."
      @keyup.enter="sendUserMessage"
      variant="solo"
      density="compact"
      hide-details
      single-line
      @click:append-inner="sendUserMessage"
    >
      <template v-slot:append-inner>
        <img
          :src="sendIcon"
          width="30"
          height="30"
          @click="sendMessage"
          style="cursor: pointer"
        />
      </template>
    </v-text-field>
  </v-card>

  <div
    class="chat-action logo"
    @click="showChat = !showChat"
    v-show="!showChat"
  >
    <img :src="robotIcon" width="60" height="60" />
  </div>
</template>
<script setup>
import { ref } from "vue";
import robotIcon from "../assets/bot-icon.png";
import usesrIcon from "../assets/user-mensaje-2.png";
import sendIcon from "../assets/send-icon.png";
import { markdownToHtml } from "../services/markdowntohtml";
import axios from "axios";
import { sendMessageToOpenAI } from "../services/openia";
const showChat = ref(true);
</script>
<script>
export default {
  data() {
    return {
      userMessage: "",
      limitReached: false,
      apiBackend: import.meta.env.VITE_API_BACKEND,
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      writting: false,
      currentQuestionIndex: 0,
      messages: [
        {
          sender: "Bot",
          text: "¡Hola! Soy Optifood IA, tu asistente personal. Estoy aquí para ayudarte a reducir el desperdicio de alimentos. Solo puedo responder una pregunta.",
          date: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        },
        {
          sender: "Bot",
          text: "Por favor, responde las siguientes preguntas:",
          date: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        },
      ],
      /* guardo en el arrays las respuestas del usuario */
      dataSend: {
        country: "Colombia",
        category: null,
        purchased_tons: null,
        wasted_tons: null,
        total_value: null,
        sales_volume: null,
        storage_temperature: null,
        rotation_method: null,
        lead_time_days: null,
        order_frequency: null,
        shelf_life_days: null,
        additional_context: null,
      },
      questions: [
        "¿En qué país se encuentra la empresa?",
        "Escriba la categoría del alimento",
        "¿Cuántas toneladas ha comprado la empresa?",
        "¿Cuántas toneladas se han desperdiciado?",
        "¿Cuál es el valor total de las compras?",
        "¿Cuánto es el volumen de ventas?",
        "¿Cuál es la temperatura de almacenamiento?",
        "¿Cuál es el método de rotación?",
        "¿Cuántos días toma el tiempo de entrega?",
        "¿Cuál es la frecuencia de pedido?",
        "¿Cuántos días de vida útil tiene el producto?",
        "¿Tienes alguna otra información adicional?",
      ],
      questionKeys: [
        "country",
        "category",
        "purchased_tons",
        "wasted_tons",
        "total_value",
        "sales_volume",
        "storage_temperature",
        "rotation_method",
        "lead_time_days",
        "order_frequency",
        "shelf_life_days",
        "additional_context",
      ],
    };
  },
  mounted() {
    this.askNextQuestion();
  },
  methods: {
    async newChat() {
      this.messages = [
        {
          sender: "Bot",
          text: "¡Hola! Soy Optifood IA, tu asistente personal. Estoy aqui para ayudarte a reducir el desperdicio de alimentos en casa. Solo puedo responder una pregunta.",
          date: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        },
      ];
      this.userMessage = "";
      this.limitReached = false;
    },
    async askNextQuestion() {
      if (this.currentQuestionIndex < this.questions.length) {
        const question = this.questions[this.currentQuestionIndex];
        this.messages.push({
          sender: "Bot",
          text: markdownToHtml(
            `**${this.currentQuestionIndex + 1}. ${question}**`
          ),
          date: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        });
      } else {
        this.messages.push({
          sender: "Bot",
          text: markdownToHtml(
            "✅ **Gracias por responder. Procesando información...**"
          ),
          date: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        });
        /* llamamos la funcion para accder al backend */
        this.sendMessage();
      }
    },
    /* aqui el usuario responde la pregunta  */
    sendUserMessage() {
      if (!this.userMessage.trim()) return;

      // Mostrar mensaje del usuario
      this.messages.push({
        sender: "Tu",
        text: this.userMessage,
        date: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      });

      // Guardar respuesta en el campo correcto
      const key = this.questionKeys[this.currentQuestionIndex];
      if (key) {
        const value = this.userMessage.trim();
        const numericKeys = [
          "purchased_tons",
          "wasted_tons",
          "total_value",
          "sales_volume",
          "lead_time_days",
          "shelf_life_days",
          "storage_temperature",
        ];
        if (numericKeys.includes(key) && isNaN(parseFloat(value))) {
          this.messages.push({
            sender: "Bot",
            text: markdownToHtml(
              `⚠️ Por favor, ingresa un valor numérico válido para **${this.questions[
                this.currentQuestionIndex
              ].toLowerCase()}**.`
            ),
            date: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
          });
          this.userMessage = "";
          this.$nextTick(() => {
            const chatWindow = document.querySelector(".chat-window");
            chatWindow.scrollTop = chatWindow.scrollHeight;
          });
          return;
        }
        this.dataSend[key] = numericKeys.includes(key)
          ? parseFloat(value)
          : value;
      }

      this.userMessage = "";
      this.currentQuestionIndex++;
      this.$nextTick(() => {
        const chatWindow = document.querySelector(".chat-window");
        chatWindow.scrollTop = chatWindow.scrollHeight;
      });

      this.askNextQuestion();
    },

    /*   implemento la funcion  que trae la respuesta del backend*/
    async sendMessage() {
      try {
        this.userMessage = "";
        this.limitReached = true;
        const response = await axios.post(
          `${this.apiBackend}/api/v1/process/process`,
          {
            country: this.dataSend.country,
            category: this.dataSend.category,
            purchased_tons: this.dataSend.purchased_tons,
            wasted_tons: this.dataSend.wasted_tons,
            total_value: this.dataSend.total_value,
            sales_volume: this.dataSend.sales_volume,
            storage_temperature: this.dataSend.storage_temperature,
            rotation_method: this.dataSend.rotation_method,
            lead_time_days: this.dataSend.lead_time_days,
            order_frequency: this.dataSend.order_frequency,
            shelf_life_days: this.dataSend.shelf_life_days,
            additional_context: this.dataSend.additional_context,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        this.messages.push({
          sender: "Bot",
          text: markdownToHtml("**Generando informe...**"),
          date: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        });
        const informe = response.data;

        const markdown = await this.JsonToMarkdownWithOpenAI(informe);
        this.messages.pop();
        this.messages.push({
          sender: "Bot",
          text: markdown,
          date: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        });
        this.messages.push({
          sender: "Bot",
          text: markdownToHtml(
            "**Gracias por usar nuestro service de Optifood IA. ¡Hasta luego!**"
          ),
          date: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        });
      } catch (error) {
        console.log(error);
      }

      this.$nextTick(() => {
        const chatWindow = document.querySelector(".chat-window");
        chatWindow.scrollTop = chatWindow.scrollHeight;
      });
    },
    async JsonToMarkdownWithOpenAI(jsonInforme) {
      const mensajes = [
        {
          role: "system",
          content:
            "Eres un profesional que analiza informes de desperdicio y transcribes el informe de manera clara y concisa.",
        },
        {
          role: "user",
          content: `
            Analiza y presenta este informe de desperdicio en alimentos con el siguiente formato:
            - Usa formato markdown para presentar el informe.
            - Usa títulos y subtítulos para secciones importantes (como causas raíz, acciones inmediatas, etc.) minimo h2.
            - Presenta listas con viñetas claras e indentación.
            - Usa tablas con bordes para mostrar acciones (con columnas: Acción, Responsable, Días, KPI, Ahorro estimado) y deja espacios entre cada una para una correcta visualización.
            - Separa visualmente cada sección con espacios en blanco.
            - Usa formato markdown para presentar el informe.
            
            
            Aquí está el JSON del informe del backend:
   
            \`\`\`json
            ${JSON.stringify(jsonInforme, null, 2)}
            \`\`\`
            `,
        },
      ];

      try {
        const response = await axios.post(
          `https://api.openai.com/v1/chat/completions`,
          {
            model: "gpt-4o-mini",
            messages: mensajes,
            temperature: 0.4,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.apiKey}`,
            },
          }
        );
        const markdown = response.data.choices[0].message.content;
        return markdownToHtml(markdown);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.chat-card {
  width: 100%;
  max-width: 600px;
  position: fixed;
  bottom: 5px;
  height: calc(100%);
  right: 0px;
  margin: 0 10px;
}

@media (max-width: 600px) {
  .chat-card {
    margin: 0 auto;
  }
}

.chat-window {
  background-color: #eceff1;

  width: 100%;
  height: calc(100% - 140px);
  box-shadow: inset 0px 0px 10px rgb(177, 175, 175);
}

.date {
  font-size: 0.7rem;
  color: #706c6c;
  margin-top: 5px;
}
.date-user {
  color: #ddd8d8;
  margin-top: 5px;
}
.bot-message {
  border-radius: 10px 10px 10px 1px !important;
  margin-left: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: normal !important;
  background-color: #ffffff;
}

.user-message {
  border-radius: 10px 10px 3px 10px !important;
  background: linear-gradient(90deg, #3b67df, #8430f1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0px !important;
}
@media (max-width: 600px) {
  .bot-message {
    font-size: 0.7rem !important;
    max-width: 95% !important;
  }
  .user-message {
    font-size: 0.7rem !important;
  }
  .bot-icon {
    width: 20px !important;
    height: 20px !important;
  }
  .user-icon {
    width: 20px !important;
    height: 20px !important;
  }
}

.custom-input {
  margin: 10px 25px;
  border-radius: 20px !important;
}

.chat-action {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 1000;
}

@media (max-width: 600px) {
  .chat-action {
    right: 10px;
    bottom: 10px;
  }
}
</style>
