<template>
  <div class="container-fluid">
    <!-- 頁面標題和新增按鈕 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0 fw-bold">承辦人清單</h1>
      <button
        @click="showAddModal = true"
        class="btn btn-primary"
      >
        <i class="bi bi-plus-lg me-2"></i>新增承辦人
      </button>
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
      <p class="mt-2 text-muted">載入中...</p>
    </div>

    <!-- 承辦人表格 -->
    <div v-else class="bg-white rounded-4 shadow-sm border-0 overflow-hidden">
      <div class="p-0">
        <div class="table-responsive" style="overflow-x: auto;">
          <table class="table mb-0" style="border-collapse: separate; border-spacing: 0; min-width: 900px;">
            <thead>
              <tr class="border-0" style="background-color: #f8f9fa;">
                <th class="border-0 fw-normal text-muted py-4 px-4" style="font-size: 14px; min-width: 180px; white-space: nowrap;">姓名</th>
                <th class="border-0 fw-normal text-muted py-4 px-4" style="font-size: 14px; min-width: 120px; white-space: nowrap;">職位</th>
                <th class="border-0 fw-normal text-muted py-4 px-4" style="font-size: 14px; min-width: 140px; white-space: nowrap;">電話</th>
                <th class="border-0 fw-normal text-muted py-4 px-4" style="font-size: 14px; min-width: 200px; white-space: nowrap;">Email</th>
                <th class="border-0 fw-normal text-muted py-4 px-4" style="font-size: 14px; min-width: 100px; white-space: nowrap;">狀態</th>
                <th class="border-0 fw-normal text-muted py-4 px-4" style="font-size: 14px; min-width: 160px; white-space: nowrap;">加入日期</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="staff in filteredStaff"
                :key="staff.id"
                class="border-0 table-row-hover"
                style="cursor: pointer; border-bottom: 1px solid #f0f0f0 !important;"
                @click="goToStaffDetail(staff.id)"
              >
                <td class="py-4 px-4 border-0" style="border-bottom: 1px solid #f0f0f0; white-space: nowrap;">
                  <div class="fw-semibold text-dark" style="font-size: 15px;">{{ staff.姓名 }}</div>
                  <small class="text-muted" style="font-size: 12px;">員工編號: {{ staff.員工編號 }}</small>
                </td>
                <td class="py-4 px-4 border-0" style="border-bottom: 1px solid #f0f0f0; white-space: nowrap;">
                  <span class="text-dark" style="font-size: 15px;">{{ staff.職位 }}</span>
                </td>
                <td class="py-4 px-4 border-0" style="border-bottom: 1px solid #f0f0f0; white-space: nowrap;">
                  <span class="text-dark" style="font-size: 15px;">{{ staff.電話 }}</span>
                </td>
                <td class="py-4 px-4 border-0" style="border-bottom: 1px solid #f0f0f0; white-space: nowrap;">
                  <span class="text-dark" style="font-size: 15px;">{{ staff.email || '未設定' }}</span>
                </td>
                <td class="py-4 px-4 border-0" style="border-bottom: 1px solid #f0f0f0; white-space: nowrap;">
                  <span :class="['badge', getStatusBadgeClass(staff.狀態)]" style="font-size: 12px; padding: 6px 12px;">
                    {{ staff.狀態 }}
                  </span>
                </td>
                <td class="py-4 px-4 border-0" style="border-bottom: 1px solid #f0f0f0; white-space: nowrap;">
                  <span class="text-dark" style="font-size: 15px;">{{ formatDate(staff.加入日期) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 空狀態 -->
      <div v-if="!loading && filteredStaff.length === 0" class="text-center py-5">
        <i class="bi bi-people display-1 text-muted"></i>
        <h3 class="mt-3 text-muted">
          {{ staff.length === 0 ? '沒有承辦人' : '沒有符合條件的承辦人' }}
        </h3>
        <p class="mt-1 text-muted">
          {{ staff.length === 0 ? '開始新增您的第一位承辦人' : '請調整篩選條件' }}
        </p>
        <div class="mt-4">
          <button
            v-if="staff.length === 0"
            @click="showAddModal = true"
            class="btn btn-primary"
          >
            <i class="bi bi-plus-lg me-2"></i>新增承辦人
          </button>
        </div>
      </div>
    </div>

    <!-- 新增模態框 -->
    <StaffModal
      v-if="showAddModal"
      :show="showAddModal"
      :staff="null"
      @close="closeModal"
      @save="saveStaff"
    />
  </div>
</template>

<script>
import { staffService } from "../services/firestore.js";
import StaffModal from "../components/StaffModal.vue";

export default {
  name: "StaffList",
  components: {
    StaffModal,
  },
  data() {
    return {
      staff: [],
      loading: true,
      showAddModal: false,
    };
  },
  computed: {
    filteredStaff() {
      // 目前顯示所有承辦人，可以後續添加篩選邏輯
      return this.staff;
    },
  },
  async mounted() {
    await this.loadStaff();
  },
  methods: {
    async loadStaff() {
      try {
        this.loading = true;
        this.staff = await staffService.getAll();
      } catch (error) {
        console.error("載入承辦人清單失敗:", error);
        this.showToast("載入承辦人清單失敗，請稍後再試", "error");
      } finally {
        this.loading = false;
      }
    },
    goToStaffDetail(staffId) {
      this.$router.push(`/staff/${staffId}`);
    },
    async saveStaff(staffData) {
      try {
        // 只處理新增模式
        await staffService.create(staffData);
        this.showToast("承辦人已新增", "success");
        await this.loadStaff();
        this.closeModal();
      } catch (error) {
        console.error("儲存承辦人失敗:", error);
        this.showToast("儲存承辦人失敗，請稍後再試", "error");
      }
    },
    closeModal() {
      this.showAddModal = false;
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
      
      return dateObj.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
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
      toastContainer.className = `alert alert-${type === 'error' ? 'danger' : type} position-fixed top-0 end-0 m-3`;
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
