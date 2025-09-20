import { createRouter, createWebHistory } from "vue-router";
import DressList from "../views/DressList.vue";
import DressDetail from "../views/DressDetail.vue";
import ContractList from "../views/ContractList.vue";
import ContractDetail from "../views/ContractDetail.vue";
import ContractTemplate from "../views/ContractTemplate.vue";
import CalendarView from "../views/CalendarView.vue";
import StaffList from "../views/StaffList.vue";
import StaffDetail from "../views/StaffDetail.vue";
import OptionsManagement from "../views/OptionsManagement.vue";

const routes = [
  {
    path: "/",
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
  {
    path: "/contract-template",
    name: "ContractTemplate",
    component: ContractTemplate,
  },
  {
    path: "/calendar",
    name: "CalendarView",
    component: CalendarView,
  },
  {
    path: "/staff",
    name: "StaffList",
    component: StaffList,
  },
  {
    path: "/staff/:id",
    name: "StaffDetail",
    component: StaffDetail,
    props: true,
  },
  {
    path: "/options",
    name: "OptionsManagement",
    component: OptionsManagement,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
