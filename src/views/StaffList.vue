<template>
  <div class="container-fluid">
    <!-- 頁面標題和新增按鈕 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0 fw-bold">承辦人清單</h1>
      <button
        @click="showAddModal = true"
        class="btn btn-outline-primary"
      >
        <i class="bi bi-plus-lg me-2"></i>新增承辦人
      </button>
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
      <p class="mt-2 text-muted" style="font-size: 14px;">載入中...</p>
    </div>

    <!-- 承辦人表格 -->
    <div v-else class="bg-white rounded-4 shadow-sm border-0 overflow-hidden">
      <div class="p-0">
        <div class="table-responsive" style="overflow-x: auto;">
          <table class="table mb-0" style="border-collapse: separate; border-spacing: 0; min-width: 600px;">
            <thead>
              <tr class="border-0" style="background-color: #f8f9fa;">
                <th class="border-0 fw-normal text-muted py-4 px-4 align-middle" style="font-size: 14px; min-width: 180px; white-space: nowrap; vertical-align: middle;">姓名</th>
                <th class="border-0 fw-normal text-muted py-4 px-4 align-middle" style="font-size: 14px; min-width: 120px; white-space: nowrap; vertical-align: middle;">職位</th>
                <th class="border-0 fw-normal text-muted py-4 px-4 align-middle" style="font-size: 14px; min-width: 160px; white-space: nowrap; vertical-align: middle;">加入日期</th>
                <th class="border-0 fw-normal text-muted py-4 px-4 align-middle text-center" style="font-size: 14px; min-width: 100px; white-space: nowrap; vertical-align: middle;">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="staff in filteredStaff"
                :key="staff.id"
                class="border-0 table-row-hover"
                style="border-bottom: 1px solid #f0f0f0 !important;"
              >
                <td class="py-4 px-4 border-0 align-middle" style="border-bottom: 1px solid #f0f0f0; white-space: nowrap; vertical-align: middle;">
                  <div class="fw-semibold text-dark" style="font-size: 14px;">{{ staff.姓名 }}</div>
                </td>
                <td class="py-4 px-4 border-0 align-middle" style="border-bottom: 1px solid #f0f0f0; white-space: nowrap; vertical-align: middle;">
                  <span v-if="staff.職位" class="text-dark" style="font-size: 14px;">{{ staff.職位 }}</span>
                </td>
                <td class="py-4 px-4 border-0 align-middle" style="border-bottom: 1px solid #f0f0f0; white-space: nowrap; vertical-align: middle;">
                  <span v-if="staff.加入日期" class="text-dark" style="font-size: 14px;">{{ formatDate(staff.加入日期) }}</span>
                </td>
                <td class="py-4 px-4 border-0 align-middle text-center" style="border-bottom: 1px solid #f0f0f0; white-space: nowrap; vertical-align: middle;">
                  <button
                    @click="deleteStaff(staff)"
                    class="btn btn-outline-danger btn-sm"
                    title="刪除承辦人"
                    :disabled="deleting"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 空狀態 -->
      <div v-if="!loading && filteredStaff.length === 0" class="text-center py-5">

        <p class="mt-3 text-muted" style="font-size: 14px;">
          {{ staff.length === 0 ? '尚未新增承辦人' : '沒有符合條件的承辦人' }}
        </p>

      </div>
    </div>

    <!-- 新增模態框 -->
    <StaffModal
      v-if="showAddModal"
      :show="showAddModal"
      :staff="null"
      :loading="saving"
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
      saving: false,
      deleting: false,
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
  watch: {
    // 監聽路由變化，確保切換回此頁面時重新載入資料
    '$route'(to, from) {
      if (to.name === 'StaffList' && from.name !== 'StaffList') {
        this.loadStaff();
      }
    }
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
    async saveStaff(staffData) {
      try {
        this.saving = true;
        // 只處理新增模式
        await staffService.create(staffData);
        this.showToast("承辦人已新增", "success");
        await this.loadStaff();
        this.closeModal();
      } catch (error) {
        console.error("儲存承辦人失敗:", error);
        this.showToast("儲存承辦人失敗，請稍後再試", "error");
      } finally {
        this.saving = false;
      }
    },
    closeModal() {
      this.showAddModal = false;
    },
    async deleteStaff(staff) {
      if (!confirm(`確定要刪除承辦人「${staff.姓名}」嗎？`)) {
        return;
      }

      try {
        this.deleting = true;
        await staffService.delete(staff.id);
        this.showToast("承辦人已刪除", "success");
        await this.loadStaff();
      } catch (error) {
        console.error("刪除承辦人失敗:", error);
        this.showToast("刪除承辦人失敗，請稍後再試", "error");
      } finally {
        this.deleting = false;
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
