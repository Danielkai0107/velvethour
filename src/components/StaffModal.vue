<template>
  <!-- Bootstrap Modal -->
  <div
    v-if="show"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
    @click.self="$emit('close')"
  >
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title">
            {{ staff ? "編輯承辦人" : "新增承辦人" }}
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body p-0 d-flex flex-column" style="height: calc(100vh - 120px);">
          <div class="flex-grow-1 p-4 custom-scrollbar" style="overflow-y: auto;">
            <form @submit.prevent="handleSubmit">
              <div class="row g-3">
                <!-- 姓名 -->
                <div class="col-md-4">
                  <label class="form-label" style="color: #6A6A6A; font-size: 14px;">姓名 *</label>
                  <input
                    v-model="formData.姓名"
                    type="text"
                    class="form-control"
                    required
                    placeholder="例: 林小姐"
                  />
                </div>

                <!-- 員工編號 -->
                <div class="col-md-4">
                  <label class="form-label" style="color: #6A6A6A; font-size: 14px;">員工編號</label>
                  <input
                    v-model="formData.員工編號"
                    type="text"
                    class="form-control"
                    placeholder="例: EMP001"
                  />
                </div>

                <!-- 職位 -->
                <div class="col-md-4">
                  <label class="form-label" style="color: #6A6A6A; font-size: 14px;">職位</label>
                  <select v-model="formData.職位" class="form-select">
                    <option value="">請選擇職位</option>
                    <option value="店長">店長</option>
                    <option value="副店長">副店長</option>
                    <option value="資深顧問">資深顧問</option>
                    <option value="禮服顧問">禮服顧問</option>
                    <option value="造型師">造型師</option>
                    <option value="客服專員">客服專員</option>
                    <option value="行政助理">行政助理</option>
                  </select>
                </div>

                <!-- 部門 -->
                <div class="col-md-4">
                  <label class="form-label" style="color: #6A6A6A; font-size: 14px;">部門</label>
                  <select v-model="formData.部門" class="form-select">
                    <option value="">請選擇部門</option>
                    <option value="銷售部">銷售部</option>
                    <option value="造型部">造型部</option>
                    <option value="客服部">客服部</option>
                    <option value="行政部">行政部</option>
                    <option value="管理部">管理部</option>
                  </select>
                </div>

                <!-- 狀態 -->
                <div class="col-md-4">
                  <label class="form-label" style="color: #6A6A6A; font-size: 14px;">狀態</label>
                  <select v-model="formData.狀態" class="form-select">
                    <option value="">請選擇狀態</option>
                    <option value="在職">在職</option>
                    <option value="休假">休假</option>
                    <option value="離職">離職</option>
                  </select>
                </div>

                <!-- 加入日期 -->
                <div class="col-md-4">
                  <label class="form-label" style="color: #6A6A6A; font-size: 14px;">加入日期</label>
                  <input
                    v-model="formData.加入日期"
                    type="date"
                    class="form-control"
                  />
                </div>

                <!-- 電話 -->
                <div class="col-md-4">
                  <label class="form-label" style="color: #6A6A6A; font-size: 14px;">電話</label>
                  <input
                    v-model="formData.電話"
                    type="tel"
                    class="form-control"
                    placeholder="例: 0912-345-678"
                  />
                </div>

                <!-- Email -->
                <div class="col-md-4">
                  <label class="form-label" style="color: #6A6A6A; font-size: 14px;">Email</label>
                  <input
                    v-model="formData.email"
                    type="email"
                    class="form-control"
                    placeholder="例: staff@company.com"
                  />
                </div>

                <!-- 備註 -->
                <div class="col-12">
                  <label class="form-label" style="color: #6A6A6A; font-size: 14px;">備註</label>
                  <textarea
                    v-model="formData.備註"
                    class="form-control"
                    rows="4"
                    placeholder="承辦人相關備註或特殊說明..."
                  ></textarea>
                </div>

                <!-- 創建時間 (顯示用，不可編輯) -->
                <div class="col-12" v-if="formData.創建時間">
                  <label class="form-label" style="color: #6A6A6A; font-size: 14px;">建立時間</label>
                  <input
                    :value="formatTimestamp(formData.創建時間)"
                    type="text"
                    class="form-control"
                    readonly
                    disabled
                  />
                </div>
              </div>
            </form>
          </div>
          
          <!-- 儲存取消按鈕 - 靠右下 -->
          <div class="border-top bg-white p-3 flex-shrink-0">
            <div class="d-flex justify-content-end gap-2">
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="$emit('close')"
              >
                <i class="bi bi-x-lg me-2"></i>取消
              </button>
              <button
                type="button"
                @click="handleSubmit"
                :disabled="loading"
                class="btn btn-primary"
              >
                <span
                  v-if="loading"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                <i v-else class="bi bi-check-lg me-2"></i>
                {{ loading ? "儲存中..." : "儲存" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StaffModal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    staff: {
      type: Object,
      default: null,
    },
  },
  emits: ["close", "save"],
  data() {
    return {
      loading: false,
      formData: {
        姓名: "",
        員工編號: "",
        職位: "",
        部門: "",
        狀態: "",
        電話: "",
        email: "",
        加入日期: "",
        備註: "",
        創建時間: null,
      },
    };
  },
  watch: {
    staff: {
      immediate: true,
      handler(newStaff) {
        if (newStaff) {
          this.formData = {
            姓名: newStaff.姓名 || "",
            員工編號: newStaff.員工編號 || "",
            職位: newStaff.職位 || "",
            部門: newStaff.部門 || "",
            狀態: newStaff.狀態 || "",
            電話: newStaff.電話 || "",
            email: newStaff.email || "",
            加入日期: this.formatDateForInput(newStaff.加入日期),
            備註: newStaff.備註 || "",
            創建時間: newStaff.創建時間 || null,
          };
        } else {
          this.resetForm();
        }
      },
    },
  },
  methods: {
    resetForm() {
      this.formData = {
        姓名: "",
        員工編號: "",
        職位: "",
        部門: "",
        狀態: "",
        電話: "",
        email: "",
        加入日期: "",
        備註: "",
        創建時間: null,
      };
    },

    async handleSubmit() {
      try {
        this.loading = true;

        // 驗證必填欄位
        if (!this.formData.姓名) {
          this.showToast("請填寫姓名", "warning");
          return;
        }

        // 準備提交的資料
        const submitData = { ...this.formData };

        // 轉換日期格式 - 只有當日期不為空時才轉換
        if (this.formData.加入日期) {
          submitData.加入日期 = new Date(this.formData.加入日期);
        } else {
          submitData.加入日期 = null;
        }

        // 如果是新增模式，添加時間戳
        if (!this.staff || !this.staff.id) {
          const now = new Date();
          submitData.創建時間 = now;
          submitData.更新時間 = now;
        } else {
          submitData.更新時間 = new Date();
        }

        this.$emit("save", submitData);
      } catch (error) {
        console.error("提交失敗:", error);
        this.showToast("提交失敗，請稍後再試", "error");
      } finally {
        this.loading = false;
      }
    },

    formatDateForInput(date) {
      if (!date) return "";

      let dateObj;
      if (date.toDate && typeof date.toDate === "function") {
        dateObj = date.toDate();
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        dateObj = new Date(date);
      }

      return dateObj.toISOString().split("T")[0];
    },

    formatTimestamp(timestamp) {
      if (!timestamp) return "";

      let date;
      if (timestamp.toDate && typeof timestamp.toDate === "function") {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else {
        date = new Date(timestamp);
      }

      return date.toLocaleString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
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
.modal {
  backdrop-filter: blur(4px);
}

.modal-dialog-scrollable .modal-body {
  max-height: calc(100vh - 200px);
}

/* 隱藏滾動條但保持滾動功能 */
.custom-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.custom-scrollbar::-webkit-scrollbar {
  width: 0px; /* WebKit */
  background: transparent; /* Chrome/Safari/Webkit */
}

/* Placeholder 淺色樣式 */
.form-control::placeholder,
.form-select::placeholder,
textarea::placeholder {
  color: #C0C0C0 !important;
  font-size: 14px !important;
  opacity: 1;
}

.form-control::-webkit-input-placeholder,
.form-select::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #C0C0C0 !important;
  font-size: 14px !important;
}

.form-control::-moz-placeholder,
.form-select::-moz-placeholder,
textarea::-moz-placeholder {
  color: #C0C0C0 !important;
  font-size: 14px !important;
  opacity: 1;
}

.form-control:-ms-input-placeholder,
.form-select:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  color: #C0C0C0 !important;
  font-size: 14px !important;
}

/* 下拉選單和輸入框文字大小 */
.form-control,
.form-select {
  font-size: 14px !important;
}

/* 下拉選單選項文字大小 */
.form-select option {
  font-size: 14px !important;
}
</style>
