<template>
  <div class="max-w-4xl mx-auto">
    <!-- 載入狀態 -->
    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
      <p class="mt-2 text-gray-600">載入中...</p>
    </div>

    <!-- 合約詳情 -->
    <div
      v-else-if="contract"
      class="bg-white rounded-lg shadow-sm overflow-hidden"
    >
      <!-- 返回按鈕 -->
      <div class="px-6 py-4 border-b border-gray-200">
        <button
          @click="$router.back()"
          class="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-150"
        >
          <ArrowLeftIcon class="h-5 w-5 mr-2" />
          返回列表
        </button>
      </div>

      <div class="p-6">
        <!-- 合約標題 -->
        <div class="flex justify-between items-start mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              {{ contract.合約單號 }}
            </h1>
            <div class="flex items-center">
              <span
                class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                :class="getStatusClass(contract.處理狀態)"
              >
                {{ contract.處理狀態 }}
              </span>
              <span class="ml-4 text-gray-500">
                建立時間: {{ formatDate(contract.合約建立日期時間) }}
              </span>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">合約總金額</p>
            <p class="text-2xl font-bold text-blue-600">
              NT$ {{ contract.合約總金額.toLocaleString() }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- 客戶資訊 -->
          <div>
            <h2 class="text-lg font-medium text-gray-900 mb-4">客戶資訊</h2>
            <div class="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <span class="text-sm font-medium text-gray-500">姓名:</span>
                <span class="ml-2 text-gray-900">{{ contract.客戶姓名 }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">電話:</span>
                <span class="ml-2 text-gray-900">{{ contract.電話 }}</span>
              </div>
              <div v-if="contract.email">
                <span class="text-sm font-medium text-gray-500">Email:</span>
                <span class="ml-2 text-gray-900">{{ contract.email }}</span>
              </div>
              <div v-if="contract.三圍">
                <span class="text-sm font-medium text-gray-500">三圍:</span>
                <span class="ml-2 text-gray-900">{{ contract.三圍 }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">承辦人:</span>
                <span class="ml-2 text-gray-900">{{ contract.承辦人 }}</span>
              </div>
            </div>
          </div>

          <!-- 使用期間 -->
          <div>
            <h2 class="text-lg font-medium text-gray-900 mb-4">使用期間</h2>
            <div class="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <span class="text-sm font-medium text-gray-500">開始時間:</span>
                <span class="ml-2 text-gray-900">{{
                  formatDateTime(contract.使用開始時間)
                }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">結束時間:</span>
                <span class="ml-2 text-gray-900">{{
                  formatDateTime(contract.使用結束時間)
                }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">使用天數:</span>
                <span class="ml-2 text-gray-900">{{ calculateDays() }} 天</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 禮服清單 -->
        <div class="mt-8">
          <h2 class="text-lg font-medium text-gray-900 mb-4">禮服清單</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full bg-gray-50 rounded-lg overflow-hidden">
              <thead class="bg-gray-100">
                <tr>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    禮服編號
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    數量
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    單價
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    小計
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="item in contract.禮服清單" :key="item.禮服ID">
                  <td class="px-4 py-3">
                    <div class="flex items-center">
                      <router-link
                        :to="`/dresses/${item.禮服ID}`"
                        class="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        {{ getDressNumber(item.禮服ID) }}
                      </router-link>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-gray-900">{{ item.數量 }}</td>
                  <td class="px-4 py-3 text-gray-900">
                    NT$ {{ item.單價.toLocaleString() }}
                  </td>
                  <td class="px-4 py-3 text-gray-900">
                    NT$ {{ item.小計.toLocaleString() }}
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-100">
                <tr>
                  <td
                    colspan="3"
                    class="px-4 py-3 text-right font-medium text-gray-900"
                  >
                    總計:
                  </td>
                  <td class="px-4 py-3 font-bold text-blue-600">
                    NT$ {{ contract.合約總金額.toLocaleString() }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- 備註 -->
        <div v-if="contract.備注" class="mt-8">
          <h2 class="text-lg font-medium text-gray-900 mb-4">備註</h2>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-gray-900 whitespace-pre-wrap">{{ contract.備注 }}</p>
          </div>
        </div>

        <!-- 操作按鈕 -->
        <div class="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
          <button
            @click="editContract"
            class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150"
          >
            編輯合約
          </button>
          <button
            @click="deleteContract"
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-150"
          >
            刪除
          </button>
        </div>

        <!-- 時間戳記 -->
        <div class="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
          <p>建立時間: {{ formatDateTime(contract.創建時間) }}</p>
          <p v-if="contract.更新時間">
            更新時間: {{ formatDateTime(contract.更新時間) }}
          </p>
        </div>
      </div>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else class="text-center py-12">
      <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">找不到合約</h3>
      <p class="mt-1 text-sm text-gray-500">該合約可能已被刪除或不存在</p>
      <div class="mt-6">
        <router-link
          to="/contracts"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150"
        >
          返回合約清單
        </router-link>
      </div>
    </div>

    <!-- 編輯模態框 -->
    <ContractModal
      v-if="showEditModal"
      :show="showEditModal"
      :contract="contract"
      @close="showEditModal = false"
      @save="saveContract"
    />
  </div>
</template>

<script>
import { ArrowLeftIcon, DocumentTextIcon } from "@heroicons/vue/24/outline";
import { contractService, dressService } from "../services/firestore.js";
import ContractModal from "../components/ContractModal.vue";

export default {
  name: "ContractDetail",
  components: {
    ArrowLeftIcon,
    DocumentTextIcon,
    ContractModal,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      contract: null,
      loading: true,
      showEditModal: false,
      dresses: [],
    };
  },
  async mounted() {
    await Promise.all([this.loadContract(), this.loadDresses()]);
  },
  methods: {
    async loadContract() {
      try {
        this.loading = true;
        this.contract = await contractService.getById(this.id);
      } catch (error) {
        console.error("載入合約詳情失敗:", error);
        this.contract = null;
      } finally {
        this.loading = false;
      }
    },
    async loadDresses() {
      try {
        this.dresses = await dressService.getAll();
      } catch (error) {
        console.error("載入禮服清單失敗:", error);
      }
    },
    editContract() {
      this.showEditModal = true;
    },
    async deleteContract() {
      if (!confirm(`確定要刪除合約 "${this.contract.合約單號}" 嗎？`)) {
        return;
      }

      try {
        await contractService.delete(this.contract.id);
        alert("合約已刪除");
        this.$router.push("/contracts");
      } catch (error) {
        console.error("刪除合約失敗:", error);
        alert("刪除合約失敗，請稍後再試");
      }
    },
    async saveContract(contractData) {
      try {
        await contractService.update(this.contract.id, contractData);
        alert("合約已更新");
        await this.loadContract();
        this.showEditModal = false;
      } catch (error) {
        console.error("更新合約失敗:", error);
        alert("更新合約失敗，請稍後再試");
      }
    },
    getDressNumber(dressId) {
      const dress = this.dresses.find((d) => d.id === dressId);
      return dress ? dress.編號 : dressId;
    },
    calculateDays() {
      if (!this.contract.使用開始時間 || !this.contract.使用結束時間) {
        return 0;
      }

      const start = this.contract.使用開始時間.toDate
        ? this.contract.使用開始時間.toDate()
        : new Date(this.contract.使用開始時間);
      const end = this.contract.使用結束時間.toDate
        ? this.contract.使用結束時間.toDate()
        : new Date(this.contract.使用結束時間);

      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },
    getStatusClass(status) {
      const statusClasses = {
        待確認: "bg-yellow-100 text-yellow-800",
        已確認: "bg-blue-100 text-blue-800",
        進行中: "bg-green-100 text-green-800",
        已完成: "bg-gray-100 text-gray-800",
        已取消: "bg-red-100 text-red-800",
      };
      return statusClasses[status] || "bg-gray-100 text-gray-800";
    },
    formatDate(date) {
      if (!date) return "";
      if (date.toDate) {
        return date.toDate().toLocaleDateString("zh-TW");
      }
      return new Date(date).toLocaleDateString("zh-TW");
    },
    formatDateTime(date) {
      if (!date) return "";
      if (date.toDate) {
        return date.toDate().toLocaleString("zh-TW");
      }
      return new Date(date).toLocaleString("zh-TW");
    },
  },
};
</script>
