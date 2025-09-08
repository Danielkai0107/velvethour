<template>
  <div class="d-flex bg-light" style="width: 100dvw; height: 100dvh; overflow: hidden;">
    <!-- 側邊欄 -->
    <div class="bg-white shadow-sm border-end sidebar">
      <!-- Logo 區域 -->
      <div class="p-4 border-bottom d-flex justify-content-center">
        <img 
          src="/src/assets/images/logo.png" 
          alt="Logo" 
          class="sidebar-logo"
        />
      </div>

      <!-- 導航選單 -->
      <nav class="py-3 sidebar-nav">
        <div class="px-3">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            class="nav-link d-flex align-items-center py-2 px-3 mb-1 rounded text-decoration-none sidebar-link position-relative"
            :class="[
              $route.path === item.href ||
              ($route.path.startsWith(item.href) && item.href !== '/')
                ? 'bg-primary text-white'
                : 'text-dark hover-bg-light',
            ]"
          >
            <div class="d-flex align-items-center position-relative">
              <i :class="item.icon" class="sidebar-icon"></i>
              <!-- 小螢幕紅點 - 浮在圖示右上角 -->
              <span 
                v-if="item.href === '/contracts' && cartItemCount > 0"
                class="d-lg-none position-absolute rounded-circle bg-danger"
                style="width: 8px; height: 8px; top: -2px; right: -2px; border: 1px solid white;"
              ></span>
              <span class="sidebar-text">{{ item.name }}</span>
            </div>
            <!-- 大螢幕購物車指示器 -->
            <span 
              v-if="item.href === '/contracts' && cartItemCount > 0"
              class="badge bg-danger d-none d-lg-flex align-items-center justify-content-center"
              style="font-size: 10px; width: 20px ; height: 20px; position: absolute;right: 6px;"
            >
              {{ cartItemCount > 99 ? '99+' : cartItemCount }}
            </span>
          </router-link>
        </div>
      </nav>

    </div>

    <!-- 主要內容區域 -->
    <div class="flex-grow-1 d-flex flex-column" style="min-width: 0; overflow: hidden;">
      <!-- 頂部導航欄 -->
      <!-- <header class="bg-white shadow-sm border-bottom" style="flex-shrink: 0;">
        <div class="d-flex justify-content-between align-items-center px-4 py-3">
          <div>
            <h2 class="mb-0 fw-bold text-dark">{{ pageTitle }}</h2>
            <small class="text-muted">{{ getCurrentDate() }}</small>
          </div>
          <div class="d-flex align-items-center">
            <div class="input-group me-3" style="width: 300px;">
              <input type="text" class="form-control" placeholder="搜尋訂單、客戶或商品...">
              <button class="btn btn-outline-secondary" type="button">
                <i class="bi bi-search"></i>
              </button>
            </div>
            <button class="btn btn-outline-secondary">
              <i class="bi bi-funnel"></i>
            </button>
          </div>
        </div>
      </header> -->

      <!-- 內容區域 - 只有這裡可以滾動 -->
      <main class="flex-grow-1 p-4 bg-light" style="overflow-y: auto; min-height: 0;">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { cartService } from '../services/cart.js';

export default {
  name: "Layout",
  data() {
    return {
      navigation: [
        { name: "禮服清單", href: "/", icon: "bi bi-gem" },
        { name: "合約清單", href: "/contracts", icon: "bi bi-file-text" },
        { name: "承辦人清單", href: "/staff", icon: "bi bi-people" },
        { name: "設定", href: "/settings", icon: "bi bi-gear" },
      ],
      cartItemCount: 0,
      cartUnsubscribe: null,
    };
  },
  mounted() {
    // 初始化購物車項目數量
    this.updateCartItemCount();
    
    // 監聽購物車變化
    this.cartUnsubscribe = cartService.subscribe(() => {
      this.updateCartItemCount();
    });
  },
  beforeUnmount() {
    // 取消監聽
    if (this.cartUnsubscribe) {
      this.cartUnsubscribe();
    }
  },
  computed: {
    pageTitle() {
      const routeMap = {
        "/": "禮服清單",
        "/contracts": "合約清單",
        "/staff": "承辦人清單",
        "/settings": "設定",
      };

      if (this.$route.path.startsWith("/dresses/")) {
        return "禮服詳情";
      }
      if (this.$route.path.startsWith("/contracts/")) {
        return "合約詳情";
      }
      if (this.$route.path.startsWith("/staff/")) {
        return "承辦人詳情";
      }

      return routeMap[this.$route.path] || "系統管理";
    },
  },
  methods: {
    getCurrentDate() {
      const now = new Date();
      return now.toLocaleDateString('zh-TW', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    },
    updateCartItemCount() {
      this.cartItemCount = cartService.getItemCount();
    },
  },
};
</script>
