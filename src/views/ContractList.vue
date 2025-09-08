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
        <div class="table-responsive" style="overflow-x: auto">
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
                  style="font-size: 14px; min-width: 160px; white-space: nowrap"
                >
                  租用開始時間
                </th>
                <th
                  class="border-0 fw-normal text-muted py-4 px-4"
                  style="font-size: 14px; min-width: 160px; white-space: nowrap"
                >
                  租用結束時間
                </th>
                <th
                  class="border-0 fw-normal text-muted py-4 px-4"
                  style="font-size: 14px; min-width: 100px; white-space: nowrap"
                >
                  狀態
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
                  style="border-bottom: 1px solid #f0f0f0; white-space: nowrap"
                >
                  <span class="text-dark" style="font-size: 15px">{{
                    formatDateTime(contract.租用開始時間)
                  }}</span>
                </td>
                <td
                  class="py-4 px-4 border-0"
                  style="border-bottom: 1px solid #f0f0f0; white-space: nowrap"
                >
                  <span class="text-dark" style="font-size: 15px">{{
                    formatDateTime(contract.租用結束時間)
                  }}</span>
                </td>
                <td
                  class="py-4 px-4 border-0"
                  style="border-bottom: 1px solid #f0f0f0; white-space: nowrap"
                >
                  <span
                    :class="['badge', getStatusBadgeClass(contract.處理狀態)]"
                    style="font-size: 12px; padding: 6px 12px"
                  >
                    {{ contract.處理狀態 }}
                  </span>
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
        <i class="bi bi-file-text display-1 text-muted"></i>
        <h3 class="mt-3 text-muted">
          {{ contracts.length === 0 ? "沒有合約" : "沒有符合條件的合約" }}
        </h3>
        <p class="mt-1 text-muted">
          {{
            contracts.length === 0 ? "開始建立您的第一份合約" : "請調整篩選條件"
          }}
        </p>
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
    };
  },
  computed: {
    filteredContracts() {
      // 目前顯示所有合約，可以後續添加篩選邏輯
      return this.contracts;
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
    getStatusBadgeClass(status) {
      const statusClasses = {
        待確認: "bg-warning text-dark",
        已確認: "bg-info text-white",
        進行中: "bg-success text-white",
        已完成: "bg-secondary text-white",
        已取消: "bg-danger text-white",
      };
      return statusClasses[status] || "bg-secondary text-white";
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
