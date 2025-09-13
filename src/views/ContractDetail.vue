<template>
  <div class="container-fluid">
    <!-- 返回按鈕 -->
    <div class="mb-4">
      <button
        @click="$router.back()"
        class="btn btn-outline-secondary"
        style="font-size: 14px"
      >
        <i class="bi bi-arrow-left me-2"></i>返回列表
      </button>
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
      <p class="mt-2 text-muted">載入中...</p>
    </div>

    <!-- 合約詳情 -->
    <div v-else-if="contract" class="row">
      <div class="col-12">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4">
            <!-- 1. 禮服圖卡 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">合約禮服</h5>

              <!-- 禮服圖卡網格 -->
              <div class="row g-3" v-if="contractDresses.length > 0">
                <div
                  v-for="(item, index) in contract.禮服清單"
                  :key="index"
                  class="col-lg-3 col-md-4 col-sm-6"
                >
                  <div
                    class="card h-100 shadow-sm border-0"
                    style="
                      cursor: pointer;
                      transition: transform 0.2s ease-in-out;
                    "
                    @click="showDressDetail(item.禮服ID)"
                    @mouseenter="showHoverEffect"
                    @mouseleave="hideHoverEffect"
                  >
                    <!-- 圖片 -->
                    <div
                      class="card-img-top position-relative"
                      style="height: 200px; overflow: hidden"
                    >
                      <img
                        v-if="getDressById(item.禮服ID)?.圖片?.[0]"
                        :src="getDressById(item.禮服ID).圖片[0]"
                        :alt="getDressById(item.禮服ID).編號"
                        class="w-100 h-100"
                        style="object-fit: contain; background-color: #f8f9fa"
                      />
                      <div
                        v-else
                        class="w-100 h-100 bg-light d-flex align-items-center justify-content-center"
                      >
                        <i
                          class="bi bi-image text-muted"
                          style="font-size: 2rem"
                        ></i>
                      </div>

                      <!-- 數量標籤 -->
                      <div class="position-absolute top-0 end-0 m-2">
                        <span class="badge bg-primary">{{ item.數量 }} 件</span>
                      </div>

                      <!-- 點擊提示 -->
                      <div
                        class="hover-tip position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-75 text-white text-center py-1"
                        style="opacity: 0; transition: opacity 0.2s"
                      >
                        <small
                          ><i class="bi bi-eye me-1"></i>點擊查看詳情</small
                        >
                      </div>
                    </div>

                    <!-- 卡片內容 -->
                    <div class="card-body">
                      <h6 class="card-title fw-bold mb-1">
                        {{ getDressById(item.禮服ID)?.編號 || item.禮服ID }}
                      </h6>
                      <p class="card-text text-muted small mb-0">
                        {{ getDressInfo(item.禮服ID) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 如果沒有禮服 -->
              <div v-else class="text-center py-4 bg-light rounded">
                <i class="bi bi-gem display-4 text-muted"></i>
                <p class="mt-2 text-muted">此合約尚未選擇禮服</p>
              </div>
            </div>

            <!-- 2. 合約單號 -->
            <div class="mb-4">
              <h5 class="card-title mb-2">合約單號</h5>
              <h2 class="text-primary fw-bold">{{ contract.合約單號 }}</h2>
            </div>

            <!-- 3. 客戶資訊 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">客戶資訊</h5>
              <div class="row g-3">
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">客戶姓名</small>
                    <strong class="text-dark">{{ contract.客戶姓名 }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">電話</small>
                    <strong class="text-dark">{{ contract.電話 }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6" v-if="contract.email">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">Email</small>
                    <strong class="text-dark">{{ contract.email }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6" v-if="contract.三圍">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">三圍</small>
                    <strong class="text-dark">{{ contract.三圍 }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">承辦人</small>
                    <strong class="text-dark">{{ contract.承辦人 }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">處理狀態</small>
                    <span
                      :class="['badge', getStatusBadgeClass(contract.處理狀態)]"
                    >
                      {{ contract.處理狀態 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4. 租用時間 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">租用時間</h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="border rounded p-3">
                    <small class="text-muted d-block">租用開始時間</small>
                    <strong class="text-dark">{{
                      formatDateTime(contract.租用開始時間)
                    }}</strong>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="border rounded p-3">
                    <small class="text-muted d-block">租用結束時間</small>
                    <strong class="text-dark">{{
                      formatDateTime(contract.租用結束時間)
                    }}</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- 5. 金額詳情 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">金額詳情</h5>

              <!-- 禮服項目明細 -->
              <div class="border rounded p-3 mb-3">
                <h6 class="fw-semibold mb-3">禮服項目明細</h6>
                <div class="table-responsive">
                  <table class="table table-sm mb-0">
                    <thead>
                      <tr>
                        <th>禮服編號</th>
                        <th>數量</th>
                        <th>單價</th>
                        <th>小計</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in contract.禮服清單"
                        :key="index"
                      >
                        <td>
                          {{ getDressById(item.禮服ID)?.編號 || item.禮服ID }}
                        </td>
                        <td>{{ item.數量 }}</td>
                        <td>NT$ {{ item.單價?.toLocaleString() || 0 }}</td>
                        <td class="fw-semibold">
                          NT$ {{ item.小計?.toLocaleString() || 0 }}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr class="border-top">
                        <td colspan="3" class="fw-semibold">合約總金額</td>
                        <td class="fw-bold text-primary">
                          NT$ {{ contract.合約總金額?.toLocaleString() || 0 }}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <!-- 6. 備註 -->
            <div class="mb-4" v-if="contract.備注">
              <h5 class="card-title mb-3">備註</h5>
              <div class="border rounded p-3">
                <p class="mb-0 text-dark" style="white-space: pre-wrap">
                  {{ contract.備注 }}
                </p>
              </div>
            </div>

            <!-- 7. 建立＆編輯時間 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">時間記錄</h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="border rounded p-3">
                    <small class="text-muted d-block">合約建立時間</small>
                    <strong class="text-dark">{{
                      formatDateTime(
                        contract.合約建立日期時間 || contract.創建時間
                      )
                    }}</strong>
                  </div>
                </div>
                <div class="col-md-6" v-if="contract.更新時間">
                  <div class="border rounded p-3">
                    <small class="text-muted d-block">最後編輯時間</small>
                    <strong class="text-dark">{{
                      formatDateTime(contract.更新時間)
                    }}</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- 操作按鈕 -->
            <div class="d-flex gap-3 justify-content-end mt-4 pt-3 border-top">
              <button @click="editContract" class="btn btn-primary">
                <i class="bi bi-pencil-square me-2"></i>編輯合約
              </button>
              <button @click="deleteContract" class="btn btn-outline-danger">
                <i class="bi bi-trash me-2"></i>刪除合約
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else class="text-center py-5">
      <i class="bi bi-file-text display-1 text-muted"></i>
      <h3 class="mt-3 text-muted">找不到合約</h3>
      <p class="mt-1 text-muted">該合約可能已被刪除或不存在</p>
      <div class="mt-4">
        <router-link to="/contracts" class="btn btn-primary">
          <i class="bi bi-arrow-left me-2"></i>返回合約清單
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

    <!-- 禮服詳情 Popup -->
    <DressDetailModal
      v-if="showDressDetailModal"
      :show="showDressDetailModal"
      :dress="selectedDress"
      @close="closeDressDetail"
    />
  </div>
</template>

<script>
import { contractService, dressService } from "../services/firestore.js";
import ContractModal from "../components/ContractModal.vue";
import DressDetailModal from "../components/DressDetailModal.vue";

export default {
  name: "ContractDetail",
  components: {
    ContractModal,
    DressDetailModal,
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
      showDressDetailModal: false,
      selectedDress: null,
      availableDresses: [], // 用於顯示禮服資訊
    };
  },
  computed: {
    contractDresses() {
      if (!this.contract?.禮服清單) return [];
      return this.contract.禮服清單.map((item) => {
        const dress = this.getDressById(item.禮服ID);
        return {
          ...item,
          dress: dress,
        };
      });
    },
  },
  async mounted() {
    await this.loadDresses();
    await this.loadContract();
  },
  methods: {
    async loadDresses() {
      try {
        this.availableDresses = await dressService.getAll();
      } catch (error) {
        console.error("載入禮服清單失敗:", error);
      }
    },

    async loadContract() {
      try {
        this.loading = true;
        this.contract = await contractService.getById(this.id);
      } catch (error) {
        console.error("載入合約詳情失敗:", error);
        this.showToast("載入合約詳情失敗，請稍後再試", "error");
        this.contract = null;
      } finally {
        this.loading = false;
      }
    },

    getDressById(dressId) {
      return this.availableDresses.find((dress) => dress.id === dressId) || {};
    },

    getDressInfo(dressId) {
      const dress = this.getDressById(dressId);
      if (!dress.顏色) return "禮服資訊載入中...";
      return `${dress.顏色} | ${dress.裙型} | ${dress.袖型} | ${dress.領型}`;
    },

    showDressDetail(dressId) {
      const dress = this.getDressById(dressId);
      if (dress && dress.id) {
        this.selectedDress = dress;
        this.showDressDetailModal = true;
      } else {
        this.showToast("找不到禮服資訊", "warning");
      }
    },

    closeDressDetail() {
      this.showDressDetailModal = false;
      this.selectedDress = null;
    },

    showHoverEffect(event) {
      event.currentTarget.style.transform = "translateY(-2px)";
      const hoverTip = event.currentTarget.querySelector(".hover-tip");
      if (hoverTip) {
        hoverTip.style.opacity = "1";
      }
    },

    hideHoverEffect(event) {
      event.currentTarget.style.transform = "translateY(0)";
      const hoverTip = event.currentTarget.querySelector(".hover-tip");
      if (hoverTip) {
        hoverTip.style.opacity = "0";
      }
    },

    editContract() {
      this.showEditModal = true;
    },

    async deleteContract() {
      if (
        !confirm(
          `確定要刪除合約 "${this.contract.合約單號}" 嗎？\n\n此操作無法復原！`
        )
      ) {
        return;
      }

      try {
        await contractService.delete(this.contract.id);
        this.showToast("合約已刪除", "success");

        // 延遲跳轉，讓用戶看到成功訊息
        setTimeout(() => {
          this.$router.push("/contracts");
        }, 1500);
      } catch (error) {
        console.error("刪除合約失敗:", error);
        this.showToast("刪除合約失敗，請稍後再試", "error");
      }
    },

    async saveContract(contractData) {
      try {
        await contractService.update(this.contract.id, contractData);
        this.showToast("合約已更新", "success");
        await this.loadContract();
        this.showEditModal = false;
      } catch (error) {
        console.error("更新合約失敗:", error);
        this.showToast("更新合約失敗，請稍後再試", "error");
      }
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

      return dateObj.toLocaleString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
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
/* Styles for contract detail page */
</style>
