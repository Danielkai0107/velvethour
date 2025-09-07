<template>
  <div class="container-fluid">
    <!-- 返回按鈕 -->
    <div class="mb-4">
      <button
        @click="$router.back()"
        class="btn btn-outline-secondary"
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

    <!-- 承辦人詳情 -->
    <div v-else-if="staffMember" class="row">
      <div class="col-12">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4">
            
            <!-- 1. 承辦人基本資訊 -->
            <div class="mb-4">
              <h5 class="card-title mb-2">
                <i class="bi bi-person me-2"></i>承辦人姓名
              </h5>
              <h2 class="text-primary fw-bold">{{ staffMember.姓名 }}</h2>
            </div>

            <!-- 2. 基本資料 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">
                <i class="bi bi-card-list me-2"></i>基本資料
              </h5>
              <div class="row g-3">
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">員工編號</small>
                    <strong class="text-dark">{{ staffMember.員工編號 }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">職位</small>
                    <strong class="text-dark">{{ staffMember.職位 }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">部門</small>
                    <strong class="text-dark">{{ staffMember.部門 || '未設定' }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">狀態</small>
                    <span :class="['badge', getStatusBadgeClass(staffMember.狀態)]">
                      {{ staffMember.狀態 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. 聯絡資訊 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">
                <i class="bi bi-telephone me-2"></i>聯絡資訊
              </h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="border rounded p-3">
                    <small class="text-muted d-block">電話</small>
                    <strong class="text-dark">{{ staffMember.電話 }}</strong>
                  </div>
                </div>
                <div class="col-md-6" v-if="staffMember.email">
                  <div class="border rounded p-3">
                    <small class="text-muted d-block">Email</small>
                    <strong class="text-dark">{{ staffMember.email }}</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4. 備註 -->
            <div class="mb-4" v-if="staffMember.備註">
              <h5 class="card-title mb-3">
                <i class="bi bi-card-text me-2"></i>備註
              </h5>
              <div class="border rounded p-3">
                <p class="mb-0 text-dark" style="white-space: pre-wrap;">{{ staffMember.備註 }}</p>
              </div>
            </div>

            <!-- 5. 加入＆編輯時間 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">
                <i class="bi bi-clock-history me-2"></i>時間記錄
              </h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="border rounded p-3">
                    <small class="text-muted d-block">加入日期</small>
                    <strong class="text-dark">{{ formatDate(staffMember.加入日期 || staffMember.創建時間) }}</strong>
                  </div>
                </div>
                <div class="col-md-6" v-if="staffMember.更新時間">
                  <div class="border rounded p-3">
                    <small class="text-muted d-block">最後編輯時間</small>
                    <strong class="text-dark">{{ formatDate(staffMember.更新時間) }}</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- 操作按鈕 -->
            <div class="d-flex gap-3 justify-content-end mt-4 pt-3 border-top">
              <button
                @click="editStaff"
                class="btn btn-primary"
              >
                <i class="bi bi-pencil-square me-2"></i>編輯承辦人
              </button>
              <button
                @click="deleteStaff"
                class="btn btn-outline-danger"
              >
                <i class="bi bi-trash me-2"></i>刪除承辦人
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else class="text-center py-5">
      <i class="bi bi-people display-1 text-muted"></i>
      <h3 class="mt-3 text-muted">找不到承辦人</h3>
      <p class="mt-1 text-muted">該承辦人可能已被刪除或不存在</p>
      <div class="mt-4">
        <router-link
          to="/staff"
          class="btn btn-primary"
        >
          <i class="bi bi-arrow-left me-2"></i>返回承辦人清單
        </router-link>
      </div>
    </div>

    <!-- 編輯模態框 -->
    <StaffModal
      v-if="showEditModal"
      :show="showEditModal"
      :staff="staffMember"
      @close="showEditModal = false"
      @save="saveStaff"
    />
  </div>
</template>

<script>
import { staffService } from "../services/firestore.js";
import StaffModal from "../components/StaffModal.vue";

export default {
  name: "StaffDetail",
  components: {
    StaffModal,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      staffMember: null,
      loading: true,
      showEditModal: false,
    };
  },
  async mounted() {
    await this.loadStaff();
  },
  methods: {
    async loadStaff() {
      try {
        this.loading = true;
        this.staffMember = await staffService.getById(this.id);
      } catch (error) {
        console.error("載入承辦人詳情失敗:", error);
        this.showToast("載入承辦人詳情失敗，請稍後再試", "error");
        this.staffMember = null;
      } finally {
        this.loading = false;
      }
    },
    editStaff() {
      this.showEditModal = true;
    },
    async deleteStaff() {
      if (!confirm(`確定要刪除承辦人 "${this.staffMember.姓名}" 嗎？\n\n此操作無法復原！`)) {
        return;
      }

      try {
        await staffService.delete(this.staffMember.id);
        this.showToast("承辦人已刪除", "success");
        
        setTimeout(() => {
          this.$router.push("/staff");
        }, 1500);
      } catch (error) {
        console.error("刪除承辦人失敗:", error);
        this.showToast("刪除承辦人失敗，請稍後再試", "error");
      }
    },
    async saveStaff(staffData) {
      try {
        await staffService.update(this.staffMember.id, staffData);
        this.showToast("承辦人已更新", "success");
        await this.loadStaff();
        this.showEditModal = false;
      } catch (error) {
        console.error("更新承辦人失敗:", error);
        this.showToast("更新承辦人失敗，請稍後再試", "error");
      }
    },
    formatDate(date) {
      if (!date) return "未設定";
      
      let dateObj;
      if (date.toDate && typeof date.toDate === 'function') {
        dateObj = date.toDate();
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        dateObj = new Date(date);
      }
      
      return dateObj.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    },
    getStatusBadgeClass(status) {
      const statusClasses = {
        在職: "bg-success text-white",
        休假: "bg-warning text-dark",
        離職: "bg-secondary text-white",
      };
      return statusClasses[status] || "bg-secondary text-white";
    },
    showToast(message, type = "info") {
      const toastContainer = document.createElement('div');
      toastContainer.className = `alert alert-${type === 'error' ? 'danger' : type} position-fixed top-0 start-50 translate-middle-x mt-3`;
      toastContainer.style.zIndex = '9999';
      toastContainer.innerHTML = `
        <div class="d-flex align-items-center">
          <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
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
