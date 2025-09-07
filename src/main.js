import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "./firebase.js";
import router from "./router";

createApp(App).use(router).mount("#app");
