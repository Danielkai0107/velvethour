import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import DressList from "../views/DressList.vue";
import DressDetail from "../views/DressDetail.vue";
import ContractList from "../views/ContractList.vue";
import ContractDetail from "../views/ContractDetail.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/dresses",
    name: "DressList",
    component: DressList,
  },
  {
    path: "/dresses/:id",
    name: "DressDetail",
    component: DressDetail,
    props: true,
  },
  {
    path: "/contracts",
    name: "ContractList",
    component: ContractList,
  },
  {
    path: "/contracts/:id",
    name: "ContractDetail",
    component: ContractDetail,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
