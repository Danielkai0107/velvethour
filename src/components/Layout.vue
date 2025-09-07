<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- 側邊欄 -->
    <div class="w-64 bg-white shadow-sm border-r border-gray-200">
      <div class="p-6">
        <h1 class="text-xl font-semibold text-gray-900">禮服租借系統</h1>
      </div>

      <nav class="mt-6">
        <div class="px-3">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors duration-150"
            :class="[
              $route.path === item.href ||
              ($route.path.startsWith(item.href) && item.href !== '/')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
            ]"
          >
            <component
              :is="item.icon"
              class="mr-3 h-5 w-5 flex-shrink-0"
              :class="[
                $route.path === item.href ||
                ($route.path.startsWith(item.href) && item.href !== '/')
                  ? 'text-blue-500'
                  : 'text-gray-400 group-hover:text-gray-500',
              ]"
            />
            {{ item.name }}
          </router-link>
        </div>
      </nav>
    </div>

    <!-- 主要內容區域 -->
    <div class="flex-1 flex flex-col">
      <!-- 頂部導航欄 -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-6 py-4">
          <h2 class="text-lg font-semibold text-gray-900">{{ pageTitle }}</h2>
        </div>
      </header>

      <!-- 內容區域 -->
      <main class="flex-1 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import {
  HomeIcon,
  SparklesIcon,
  DocumentTextIcon,
} from "@heroicons/vue/24/outline";

export default {
  name: "Layout",
  components: {
    HomeIcon,
    SparklesIcon,
    DocumentTextIcon,
  },
  data() {
    return {
      navigation: [
        { name: "首頁", href: "/", icon: HomeIcon },
        { name: "禮服清單", href: "/dresses", icon: SparklesIcon },
        { name: "合約清單", href: "/contracts", icon: DocumentTextIcon },
      ],
    };
  },
  computed: {
    pageTitle() {
      const routeMap = {
        "/": "首頁",
        "/dresses": "禮服清單",
        "/contracts": "合約清單",
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
};
</script>
