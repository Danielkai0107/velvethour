<template>
  <!-- Bootstrap Modal -->
  <div
    v-if="show"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
    @click.self="$emit('close')"
  >
    <div class="modal-dialog modal-dialog-centered">
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
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <!-- 承辦人資訊卡片 -->
            <div class="card shadow-sm border-0 rounded-4">
              <div class="card-header bg-white border-0 pb-0">
                <h6 class="card-title mb-0 fw-semibold">承辦人資訊</h6>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <!-- 姓名 -->
                  <div class="col-12">
                    <label class="form-label" style="color: #6A6A6A; font-size: 14px;">姓名 *</label>
                    <input
                      v-model="formData.姓名"
                      type="text"
                      class="form-control"
                      required
                      placeholder="例: 林小姐"
                    />
                  </div>

                  <!-- 職位 -->
                  <div class="col-12">
                    <label class="form-label" style="color: #6A6A6A; font-size: 14px;">職位</label>
                    <input
                      v-model="formData.職位"
                      type="text"
                      class="form-control"
                      placeholder="例: 禮服顧問"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="$emit('close')"
          >
            取消
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
            {{ loading ? "儲存中..." : "儲存" }}
          </button>
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
        職位: "",
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
            職位: newStaff.職位 || "",
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
        職位: "",
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

        // 如果是新增模式，添加時間戳
        if (!this.staff || !this.staff.id) {
          const now = new Date();
          submitData.創建時間 = now;
          submitData.更新時間 = now;
          submitData.加入日期 = now; // 自動設定加入日期為今天
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

.card {
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
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