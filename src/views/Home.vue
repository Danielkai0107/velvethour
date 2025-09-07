<template>
  <div class="max-w-7xl mx-auto">
    <!-- 歡迎區域 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">
        歡迎使用禮服租借管理系統
      </h1>
      <p class="text-gray-600">管理您的禮服庫存和租借合約</p>
    </div>

    <!-- 統計卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <SparklesIcon class="h-8 w-8 text-blue-500" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">總禮服數量</h3>
            <p class="text-2xl font-bold text-blue-600">
              {{ stats.totalDresses }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <DocumentTextIcon class="h-8 w-8 text-green-500" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">進行中合約</h3>
            <p class="text-2xl font-bold text-green-600">
              {{ stats.activeContracts }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CurrencyDollarIcon class="h-8 w-8 text-purple-500" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">本月營收</h3>
            <p class="text-2xl font-bold text-purple-600">
              NT$ {{ stats.monthlyRevenue.toLocaleString() }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">快速操作</h2>
        <div class="space-y-3">
          <router-link
            to="/dresses"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150"
          >
            <SparklesIcon class="h-5 w-5 text-blue-500 mr-3" />
            <span class="text-gray-900">管理禮服</span>
          </router-link>
          <router-link
            to="/contracts"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150"
          >
            <DocumentTextIcon class="h-5 w-5 text-green-500 mr-3" />
            <span class="text-gray-900">管理合約</span>
          </router-link>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">最近活動</h2>
        <div class="space-y-3">
          <div
            v-if="recentActivities.length === 0"
            class="text-gray-500 text-center py-4"
          >
            暫無活動記錄
          </div>
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex items-center p-3 border border-gray-200 rounded-lg"
          >
            <div class="flex-1">
              <p class="text-sm text-gray-900">{{ activity.description }}</p>
              <p class="text-xs text-gray-500">
                {{ formatDate(activity.date) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  SparklesIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
} from "@heroicons/vue/24/outline";
import { dressService, contractService } from "../services/firestore.js";

export default {
  name: "Home",
  components: {
    SparklesIcon,
    DocumentTextIcon,
    CurrencyDollarIcon,
  },
  data() {
    return {
      stats: {
        totalDresses: 0,
        activeContracts: 0,
        monthlyRevenue: 0,
      },
      recentActivities: [],
    };
  },
  async mounted() {
    await this.loadStats();
  },
  methods: {
    async loadStats() {
      try {
        // 獲取禮服統計
        const dresses = await dressService.getAll();
        this.stats.totalDresses = dresses.length;

        // 獲取合約統計
        const contracts = await contractService.getAll();
        this.stats.activeContracts = contracts.filter(
          (contract) =>
            contract.處理狀態 === "進行中" || contract.處理狀態 === "已確認"
        ).length;

        // 計算本月營收
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        this.stats.monthlyRevenue = contracts
          .filter((contract) => {
            if (!contract.合約建立日期時間) return false;
            const contractDate = contract.合約建立日期時間.toDate();
            return (
              contractDate.getMonth() === currentMonth &&
              contractDate.getFullYear() === currentYear
            );
          })
          .reduce((sum, contract) => sum + (contract.合約總金額 || 0), 0);
      } catch (error) {
        console.error("載入統計資料失敗:", error);
      }
    },
    formatDate(date) {
      if (!date) return "";
      if (date.toDate) {
        return date.toDate().toLocaleDateString("zh-TW");
      }
      return new Date(date).toLocaleDateString("zh-TW");
    },
  },
};
</script>
