<template>
  <div class="container-fluid">
    <!-- 頁面標題和新增按鈕 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0 fw-bold">合約清單</h1>
      <div class="d-flex gap-2">
        <!-- 清空所選按鈕 -->
        <button
          v-if="cartItemCount > 0"
          @click="clearCart"
          class="btn btn-outline-danger"
          style="font-size: 14px;"
          :title="`清空購物車中的 ${cartItemCount} 件禮服`"
        >
          <i class="bi bi-trash3 me-2"></i>清空 ({{ cartItemCount }})
        </button>

        <!-- 新增合約按鈕 -->
        <button
          @click="showAddModal = true"
          class="btn btn-outline-primary d-flex align-items-center"
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
          "
          :title="
            cartItemCount > 0
              ? `新增合約 (購物車有 ${cartItemCount} 件禮服)`
              : '新增合約'
          "
        >
          <i class="bi bi-plus-lg me-2"></i>
          <span>新增合約</span>
          <!-- 購物車數量提示 -->
          <span
            v-if="cartItemCount > 0"
            class="badge bg-danger ms-2"
            style="
              font-size: 10px;
              width: 20px;
              height: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            {{ cartItemCount > 99 ? "99+" : cartItemCount }}
          </span>
        </button>
      </div>
    </div>

    <!-- 搜尋篩選器 -->
    <div class="bg-white rounded-4 shadow-sm border-0 mb-4 p-4">
      <!-- 關鍵字搜尋 -->
      <div class="mb-4">
        <input
          v-model="filters.關鍵字"
          type="text"
          class="form-control"
          placeholder="搜尋合約單號、客戶姓名..."
          style="font-size: 14px"
          @input="applyFilters"
        />
      </div>

      <div class="row g-3">
        <!-- 承辦人篩選 -->
        <div class="col-md-3">
          <h6 class="fw-semibold mb-2" style="font-size: 14px">承辦人</h6>
          <select
            v-model="filters.承辦人"
            class="form-select"
            style="font-size: 14px"
            @change="applyFilters"
          >
            <option value="">全部承辦人</option>
            <option v-for="staff in staffOptions" :key="staff" :value="staff">
              {{ staff }}
            </option>
          </select>
        </div>


        <!-- 開始日期篩選 -->
        <div class="col-md-3">
          <h6 class="fw-semibold mb-2" style="font-size: 14px">開始日期</h6>
          <input
            v-model="filters.開始日期"
            type="date"
            class="form-control"
            style="font-size: 14px"
            @change="applyFilters"
          />
        </div>

        <!-- 結束日期篩選 -->
        <div class="col-md-3">
          <h6 class="fw-semibold mb-2" style="font-size: 14px">結束日期</h6>
          <input
            v-model="filters.結束日期"
            type="date"
            class="form-control"
            style="font-size: 14px"
            @change="applyFilters"
          />
        </div>
      </div>

      <!-- 清除篩選按鈕 -->
      <div class="mt-3">
        <button
          @click="clearFilters"
          class="btn btn-outline-secondary btn-sm"
          style="font-size: 13px"
        >
          <i class="bi bi-x-circle me-1"></i>清除篩選
        </button>
      </div>
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
      <p class="mt-2 text-muted">載入中...</p>
    </div>

    <!-- 合約表格 -->
    <div v-else class="bg-white rounded-4 shadow-sm border-0 overflow-hidden">
      <div class="p-0">
        <div class="table-responsive custom-scrollbar" style="overflow-x: auto">
          <table
            class="table mb-0"
            style="
              border-collapse: separate;
              border-spacing: 0;
              min-width: 1000px;
            "
          >
            <thead>
              <tr class="border-0" style="background-color: #f8f9fa">
                <th
                  class="border-0 fw-normal text-muted py-4 px-4"
                  style="font-size: 14px; min-width: 150px; white-space: nowrap"
                >
                  合約單號
                </th>
                <th
                  class="border-0 fw-normal text-muted py-4 px-4"
                  style="font-size: 14px; min-width: 160px; white-space: nowrap"
                >
                  客戶姓名
                </th>
                <th
                  class="border-0 fw-normal text-muted py-4 px-4"
                  style="font-size: 14px; min-width: 120px; white-space: nowrap"
                >
                  承辦人
                </th>
                <th
                  class="border-0 fw-normal text-muted py-4 px-4"
                  style="font-size: 14px; min-width: 200px; white-space: nowrap"
                >
                  時間資訊
                </th>
                <th
                  class="border-0 fw-normal text-muted py-4 px-4"
                  style="font-size: 14px; min-width: 150px; white-space: nowrap"
                >
                  總金額
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="contract in filteredContracts"
                :key="contract.id"
                class="border-0 table-row-hover"
                style="
                  cursor: pointer;
                  border-bottom: 1px solid #f0f0f0 !important;
                "
                @click="goToContractDetail(contract.id)"
              >
                <td
                  class="py-4 px-4 border-0"
                  style="border-bottom: 1px solid #f0f0f0; white-space: nowrap"
                >
                  <div class="fw-semibold text-dark" style="font-size: 15px">
                    {{ contract.合約單號 }}
                  </div>
                  <small class="text-muted" style="font-size: 12px"
                    >建立: {{ formatDate(contract.合約建立日期時間) }}</small
                  >
                </td>
                <td
                  class="py-4 px-4 border-0"
                  style="border-bottom: 1px solid #f0f0f0; white-space: nowrap"
                >
                  <div class="fw-semibold text-dark" style="font-size: 15px">
                    {{ contract.客戶姓名 }}
                  </div>
                  <small class="text-muted" style="font-size: 12px">{{
                    contract.電話
                  }}</small>
                </td>
                <td
                  class="py-4 px-4 border-0"
                  style="border-bottom: 1px solid #f0f0f0; white-space: nowrap"
                >
                  <div class="fw-semibold text-dark" style="font-size: 15px">
                    {{ contract.承辦人 || "未指定" }}
                  </div>
                </td>
                <td
                  class="py-4 px-4 border-0"
                  style="border-bottom: 1px solid #f0f0f0;"
                >
                  <div class="fw-semibold text-dark" style="font-size: 15px">
                    {{ formatDateRange(contract.租用開始時間, contract.租用結束時間) }}
                  </div>
                  <small class="text-muted" style="font-size: 12px">
                    禮服檔期至: {{ formatDateOnly(contract.下次可用時間) }}
                  </small>
                </td>
                <td
                  class="py-4 px-4 border-0"
                  style="border-bottom: 1px solid #f0f0f0; white-space: nowrap"
                >
                  <div class="fw-semibold text-dark" style="font-size: 15px">
                    NT$ {{ contract.合約總金額?.toLocaleString() || 0 }}
                  </div>
                  <small class="text-muted" style="font-size: 12px"
                    >{{ contract.禮服清單?.length || 0 }} 件禮服</small
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 空狀態 -->
      <div
        v-if="!loading && filteredContracts.length === 0"
        class="text-center py-5"
      >
        <span class="mt-3 text-muted" style="font-size: 14px;">
          {{ contracts.length === 0 ? "暫無合約" : "沒有符合條件的合約" }}
        </span>
      </div>
    </div>

    <!-- 新增模態框 -->
    <ContractModal
      v-if="showAddModal"
      :show="showAddModal"
      :contract="null"
      @close="closeModal"
      @save="saveContract"
    />
  </div>
</template>

<script>
import { contractService } from "../services/firestore.js";
import { cartService } from "../services/cart.js";
import ContractModal from "../components/ContractModal.vue";

export default {
  name: "ContractList",
  components: {
    ContractModal,
  },
  data() {
    return {
      contracts: [],
      loading: true,
      showAddModal: false,
      cartItemCount: 0,
      cartUnsubscribe: null,
      filters: {
        關鍵字: "",
        承辦人: "",
        開始日期: "",
        結束日期: "",
      },
    };
  },
  computed: {
    filteredContracts() {
      let filtered = this.contracts;

      // 關鍵字搜尋 (合約單號和客戶姓名)
      if (this.filters.關鍵字) {
        const keyword = this.filters.關鍵字.toLowerCase();
        filtered = filtered.filter(contract => 
          (contract.合約單號 && contract.合約單號.toLowerCase().includes(keyword)) ||
          (contract.客戶姓名 && contract.客戶姓名.toLowerCase().includes(keyword))
        );
      }

      // 承辦人篩選
      if (this.filters.承辦人) {
        filtered = filtered.filter(contract => 
          contract.承辦人 === this.filters.承辦人
        );
      }


      // 開始日期篩選
      if (this.filters.開始日期) {
        const filterStartDate = new Date(this.filters.開始日期);
        filtered = filtered.filter(contract => {
          const contractStartDate = this.parseDate(contract.租用開始時間);
          if (!contractStartDate) return false;
          const contractDateOnly = new Date(contractStartDate.getFullYear(), contractStartDate.getMonth(), contractStartDate.getDate());
          return contractDateOnly >= filterStartDate;
        });
      }

      // 結束日期篩選
      if (this.filters.結束日期) {
        const filterEndDate = new Date(this.filters.結束日期);
        filtered = filtered.filter(contract => {
          const contractEndDate = this.parseDate(contract.租用結束時間);
          if (!contractEndDate) return false;
          const contractDateOnly = new Date(contractEndDate.getFullYear(), contractEndDate.getMonth(), contractEndDate.getDate());
          return contractDateOnly <= filterEndDate;
        });
      }

      return filtered;
    },
    staffOptions() {
      // 從合約中提取所有承辦人選項
      const staffSet = new Set();
      this.contracts.forEach(contract => {
        if (contract.承辦人) {
          staffSet.add(contract.承辦人);
        }
      });
      return Array.from(staffSet).sort();
    },
  },
  async mounted() {
    await this.loadContracts();

    // 初始化購物車項目數量
    this.updateCartItemCount();

    // 監聽購物車變化
    this.cartUnsubscribe = cartService.subscribe(() => {
      this.updateCartItemCount();
    });
  },
  watch: {
    // 監聽路由變化，確保切換回此頁面時重新載入資料
    '$route'(to, from) {
      if (to.name === 'ContractList' && from.name !== 'ContractList') {
        this.loadContracts();
      }
    }
  },
  beforeUnmount() {
    // 取消監聽
    if (this.cartUnsubscribe) {
      this.cartUnsubscribe();
    }
  },
  methods: {
    async loadContracts() {
      try {
        this.loading = true;
        this.contracts = await contractService.getAll();
      } catch (error) {
        console.error("載入合約清單失敗:", error);
        this.showToast("載入合約清單失敗，請稍後再試", "error");
      } finally {
        this.loading = false;
      }
    },
    goToContractDetail(contractId) {
      this.$router.push(`/contracts/${contractId}`);
    },
    async saveContract(contractData) {
      try {
        // 只處理新增模式
        await contractService.create(contractData);
        this.showToast("合約已新增", "success");
        await this.loadContracts();
        this.closeModal();
      } catch (error) {
        console.error("儲存合約失敗:", error);
        this.showToast("儲存合約失敗，請稍後再試", "error");
      }
    },
    closeModal() {
      this.showAddModal = false;
    },
    updateCartItemCount() {
      this.cartItemCount = cartService.getItemCount();
    },
    clearCart() {
      // 顯示確認對話框
      if (confirm(`確定要清空購物車中的 ${this.cartItemCount} 件禮服嗎？`)) {
        try {
          cartService.clearCart();
          this.showToast("購物車已清空", "success");
        } catch (error) {
          console.error("清空購物車失敗:", error);
          this.showToast("清空購物車失敗，請稍後再試", "error");
        }
      }
    },
    formatDate(date) {
      if (!date) return "未設定";

      let dateObj;
      if (date.toDate && typeof date.toDate === "function") {
        dateObj = date.toDate();
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        dateObj = new Date(date);
      }

      return dateObj.toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
    formatDateTime(date) {
      if (!date) return "未設定";

      let dateObj;
      if (date.toDate && typeof date.toDate === "function") {
        dateObj = date.toDate();
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        dateObj = new Date(date);
      }

      return (
        dateObj.toLocaleDateString("zh-TW", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }) +
        " " +
        dateObj.toLocaleTimeString("zh-TW", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    },
    formatDateRange(startDate, endDate) {
      if (!startDate || !endDate) return "未設定";

      const formatSingleDate = (date) => {
        let dateObj;
        if (date.toDate && typeof date.toDate === "function") {
          dateObj = date.toDate();
        } else if (date instanceof Date) {
          dateObj = date;
        } else {
          dateObj = new Date(date);
        }

        return dateObj.toLocaleDateString("zh-TW", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).replace(/\//g, "/");
      };

      const start = formatSingleDate(startDate);
      const end = formatSingleDate(endDate);
      
      return `${start}-${end}`;
    },
    formatDateOnly(date) {
      if (!date) return "未設定";

      let dateObj;
      if (date.toDate && typeof date.toDate === "function") {
        dateObj = date.toDate();
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        dateObj = new Date(date);
      }

      return dateObj.toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
    parseDate(dateValue) {
      if (!dateValue) return null;
      
      if (dateValue.toDate && typeof dateValue.toDate === "function") {
        return dateValue.toDate();
      } else if (dateValue instanceof Date) {
        return dateValue;
      } else {
        return new Date(dateValue);
      }
    },
    applyFilters() {
      // 篩選會透過 computed property 自動更新
      // 這個方法主要用於觸發重新計算
    },
    clearFilters() {
      this.filters = {
        關鍵字: "",
        承辦人: "",
        開始日期: "",
        結束日期: "",
      };
    },
    showToast(message, type = "info") {
      // 簡單的 toast 通知實現
      const toastContainer = document.createElement("div");
      toastContainer.className = `alert alert-${
        type === "error" ? "danger" : type
      } position-fixed top-0 start-50 translate-middle-x mt-3`;
      toastContainer.style.zIndex = "9999";
      toastContainer.innerHTML = `
        <div class="d-flex align-items-center">
          <i class="bi bi-${
            type === "success"
              ? "check-circle"
              : type === "warning"
              ? "exclamation-triangle"
              : "info-circle"
          } me-2"></i>
          ${message}
        </div>
      `;

      document.body.appendChild(toastContainer);

      setTimeout(() => {
        if (document.body.contains(toastContainer)) {
          document.body.removeChild(toastContainer);
        }
      }, 3000);
    },
  },
};
</script>

<style scoped>
/* 隱藏滾動條但保持滾動功能 */
.custom-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.custom-scrollbar::-webkit-scrollbar {
  width: 0px; /* WebKit */
  background: transparent; /* Chrome/Safari/Webkit */
}
</style>
