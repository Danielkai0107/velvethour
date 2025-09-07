<template>
  <div class="max-w-7xl mx-auto">
    <!-- 頁面標題和新增按鈕 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">合約清單</h1>
      <button
        @click="showAddModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150"
      >
        新增合約
      </button>
    </div>

    <!-- 篩選器 -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >狀態篩選</label
          >
          <select
            v-model="statusFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部狀態</option>
            <option value="待確認">待確認</option>
            <option value="已確認">已確認</option>
            <option value="進行中">進行中</option>
            <option value="已完成">已完成</option>
            <option value="已取消">已取消</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >客戶姓名</label
          >
          <input
            v-model="customerFilter"
            type="text"
            placeholder="搜尋客戶姓名"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >合約單號</label
          >
          <input
            v-model="contractNumberFilter"
            type="text"
            placeholder="搜尋合約單號"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors duration-150"
          >
            清除篩選
          </button>
        </div>
      </div>
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
      <p class="mt-2 text-gray-600">載入中...</p>
    </div>

    <!-- 合約表格 -->
    <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                合約單號
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                客戶資訊
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                使用期間
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                狀態
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                總金額
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="contract in filteredContracts"
              :key="contract.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ contract.合約單號 }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ formatDate(contract.合約建立日期時間) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ contract.客戶姓名 }}
                </div>
                <div class="text-sm text-gray-500">{{ contract.電話 }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatDate(contract.使用開始時間) }} ~
                </div>
                <div class="text-sm text-gray-500">
                  {{ formatDate(contract.使用結束時間) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(contract.處理狀態)"
                >
                  {{ contract.處理狀態 }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                NT$ {{ contract.合約總金額.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <router-link
                    :to="`/contracts/${contract.id}`"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    查看
                  </router-link>
                  <button
                    @click="editContract(contract)"
                    class="text-gray-600 hover:text-gray-900"
                  >
                    編輯
                  </button>
                  <button
                    @click="deleteContract(contract)"
                    class="text-red-600 hover:text-red-900"
                  >
                    刪除
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 空狀態 -->
      <div v-if="filteredContracts.length === 0" class="text-center py-12">
        <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">沒有合約</h3>
        <p class="mt-1 text-sm text-gray-500">開始建立您的第一份合約</p>
        <div class="mt-6">
          <button
            @click="showAddModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150"
          >
            新增合約
          </button>
        </div>
      </div>
    </div>

    <!-- 新增/編輯模態框 -->
    <ContractModal
      v-if="showAddModal || showEditModal"
      :show="showAddModal || showEditModal"
      :contract="editingContract"
      @close="closeModal"
      @save="saveContract"
    />
  </div>
</template>

<script>
import { DocumentTextIcon } from "@heroicons/vue/24/outline";
import { contractService } from "../services/firestore.js";
import ContractModal from "../components/ContractModal.vue";

export default {
  name: "ContractList",
  components: {
    DocumentTextIcon,
    ContractModal,
  },
  data() {
    return {
      contracts: [],
      loading: true,
      showAddModal: false,
      showEditModal: false,
      editingContract: null,
      statusFilter: "",
      customerFilter: "",
      contractNumberFilter: "",
    };
  },
  computed: {
    filteredContracts() {
      return this.contracts.filter((contract) => {
        const matchesStatus =
          !this.statusFilter || contract.處理狀態 === this.statusFilter;
        const matchesCustomer =
          !this.customerFilter ||
          contract.客戶姓名
            .toLowerCase()
            .includes(this.customerFilter.toLowerCase());
        const matchesContractNumber =
          !this.contractNumberFilter ||
          contract.合約單號.includes(this.contractNumberFilter);

        return matchesStatus && matchesCustomer && matchesContractNumber;
      });
    },
  },
  async mounted() {
    await this.loadContracts();
  },
  methods: {
    async loadContracts() {
      try {
        this.loading = true;
        this.contracts = await contractService.getAll();
      } catch (error) {
        console.error("載入合約清單失敗:", error);
        alert("載入合約清單失敗，請稍後再試");
      } finally {
        this.loading = false;
      }
    },
    editContract(contract) {
      this.editingContract = { ...contract };
      this.showEditModal = true;
    },
    async deleteContract(contract) {
      if (!confirm(`確定要刪除合約 "${contract.合約單號}" 嗎？`)) {
        return;
      }

      try {
        await contractService.delete(contract.id);
        await this.loadContracts();
        alert("合約已刪除");
      } catch (error) {
        console.error("刪除合約失敗:", error);
        alert("刪除合約失敗，請稍後再試");
      }
    },
    async saveContract(contractData) {
      try {
        if (this.editingContract && this.editingContract.id) {
          // 編輯模式
          await contractService.update(this.editingContract.id, contractData);
          alert("合約已更新");
        } else {
          // 新增模式
          await contractService.create(contractData);
          alert("合約已新增");
        }

        await this.loadContracts();
        this.closeModal();
      } catch (error) {
        console.error("儲存合約失敗:", error);
        alert("儲存合約失敗，請稍後再試");
      }
    },
    closeModal() {
      this.showAddModal = false;
      this.showEditModal = false;
      this.editingContract = null;
    },
    clearFilters() {
      this.statusFilter = "";
      this.customerFilter = "";
      this.contractNumberFilter = "";
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
  },
};
</script>
