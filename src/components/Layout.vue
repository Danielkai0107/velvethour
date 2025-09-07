<template>
  <div class="d-flex min-vh-100 bg-light">
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
            class="nav-link d-flex align-items-center py-2 px-3 mb-1 rounded text-decoration-none sidebar-link"
            :class="[
              $route.path === item.href ||
              ($route.path.startsWith(item.href) && item.href !== '/')
                ? 'bg-primary text-white'
                : 'text-dark hover-bg-light',
            ]"
          >
            <i :class="item.icon" class="sidebar-icon"></i>
            <span class="sidebar-text">{{ item.name }}</span>
          </router-link>
        </div>
      </nav>

      <!-- 用戶資訊 -->
      <div class="mt-auto p-3 border-top sidebar-user">
        <div class="d-flex align-items-center">
          <div class="bg-secondary rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 32px; height: 32px;">
            <i class="bi bi-person text-white"></i>
          </div>
          <div class="sidebar-user-info">
            <div class="fw-semibold">管理員</div>
            <small class="text-muted">系統管理者</small>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要內容區域 -->
    <div class="flex-grow-1 d-flex flex-column">

      <!-- 內容區域 -->
      <main class="flex-grow-1 p-4 bg-light">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: "Layout",
  data() {
    return {
      navigation: [
        { name: "禮服清單", href: "/", icon: "bi bi-gem" },
        { name: "合約清單", href: "/contracts", icon: "bi bi-file-text" },
        { name: "設定", href: "/settings", icon: "bi bi-gear" },
      ],
    };
  },
  computed: {
    pageTitle() {
      const routeMap = {
        "/": "禮服清單",
        "/contracts": "合約清單",
        "/settings": "設定",
      };

      if (this.$route.path.startsWith("/dresses/")) {
        return "禮服詳情";
      }
      if (this.$route.path.startsWith("/contracts/")) {
        return "合約詳情";
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
  },
};
</script>
