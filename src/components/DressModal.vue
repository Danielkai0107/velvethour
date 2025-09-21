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
            {{ dress ? "編輯禮服" : "新增禮服" }}
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body p-0 d-flex flex-column" style="height: calc(100vh - 120px);">
          <form @submit.prevent="handleSubmit" class="flex-grow-1 d-flex">
            <div class="row g-0 flex-grow-1">
              <!-- 左側 - 圖片區域 (可滾動) -->
              <div class="col-md-5 border-end d-flex flex-column">
                <div class="p-4 flex-grow-1 d-flex flex-column">
                  <label class="form-label mb-3 flex-shrink-0" style="color: #6A6A6A; font-size: 14px;"> 禮服圖片 </label>

                  <div class="flex-grow-1 custom-scrollbar" style="overflow-y: auto;">
                    <!-- 圖片上傳區 -->
                    <div
                      class="border border-dashed rounded p-4 text-center mb-3 custom-dashed-border"
                      :class="[
                        isDragOver ? 'border-primary bg-light' : '',
                        { 'border-danger bg-danger-subtle': validationErrors.圖片 }
                      ]"
                      @drop="handleDrop"
                      @dragover.prevent="isDragOver = true"
                      @dragleave.prevent="isDragOver = false"
                      @click="clearValidationError('圖片')"
                    >
                      <input
                        ref="fileInput"
                        type="file"
                        multiple
                        accept="image/*"
                        @change="handleFileUpload"
                        class="d-none"
                      />

                      <div v-if="uploadingImages.length === 0">
                        <div class="mt-2">
                          <button
                            type="button"
                            @click="$refs.fileInput.click()"
                            class="btn btn-outline-primary me-2"
                          >
                            選擇檔案
                          </button>
                          <span class="text-muted">或拖拽圖片到這裡</span>
                        </div>
                        <small class="text-muted d-block mt-2">
                          支援 JPG, PNG, WebP 格式，最多 5 張圖片，每張最大 5MB
                        </small>
                      </div>

                      <div v-else>
                        <div class="d-flex justify-content-center">
                          <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">上傳中...</span>
                          </div>
                        </div>
                        <div class="mt-2 text-muted">正在上傳圖片...</div>
                      </div>
                    </div>

                    <!-- 已上傳圖片預覽 -->
                    <div
                      v-if="formData.圖片 && formData.圖片.length > 0"
                      class="row g-3"
                    >
                      <div
                        v-for="(image, index) in formData.圖片"
                        :key="index"
                        class="col-6"
                      >
                        <div
                          class="position-relative d-flex align-items-center justify-content-center bg-light rounded"
                          style="height: 200px;"
                        >
                          <img
                            :src="image"
                            :alt="`圖片 ${index + 1}`"
                            class="rounded shadow-sm"
                            style="max-width: 100%; max-height: 100%; object-fit: contain;"
                          />
                          <button
                            type="button"
                            @click="removeImage(index)"
                            class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-1"
                            style="width: 24px; height: 24px; line-height: 1"
                          >
                            <i class="bi bi-x-lg"></i>
                          </button>
                          <div
                            v-if="index === 0"
                            class="position-absolute bottom-0 start-0 m-1"
                          >
                            <span class="badge bg-primary">主圖</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 右側 - 資料輸入區域 (固定) -->
              <div class="col-md-7 d-flex flex-column">
                <div class="flex-grow-1 p-4">
                  <div class="row g-3">
                    <!-- 禮服編號 -->
                    <div class="col-md-6">
                      <label class="form-label" style="color: #6A6A6A; font-size: 14px;"> 禮服編號 * </label>
                      <input
                        v-model="formData.編號"
                        type="text"
                        :class="['form-control', { 'is-invalid': validationErrors.編號 }]"
                        required
                        placeholder="例: WD001"
                        @focus="clearValidationError('編號')"
                      />
                    </div>

                    <!-- 租借金額 -->
                    <div class="col-md-6">
                      <label class="form-label" style="color: #6A6A6A; font-size: 14px;">
                        租借金額 (NT$) *
                      </label>
                      <input
                        v-model.number="formData.租借金額"
                        type="number"
                        :class="['form-control', { 'is-invalid': validationErrors.租借金額 }]"
                        required
                        min="0"
                        placeholder="例: 8000"
                        @focus="clearValidationError('租借金額')"
                      />
                    </div>

                    <!-- 加價金額 -->
                    <div class="col-md-6">
                      <label class="form-label" style="color: #6A6A6A; font-size: 14px;"> 加價金額 (NT$) </label>
                      <input
                        v-model.number="formData.加價金額"
                        type="number"
                        class="form-control"
                        min="0"
                        placeholder="例: 1000"
                      />
                    </div>

                    <!-- 押金 -->
                    <div class="col-md-6">
                      <label class="form-label" style="color: #6A6A6A; font-size: 14px;"> 押金 (NT$) </label>
                      <input
                        v-model.number="formData.押金"
                        type="number"
                        class="form-control"
                        min="0"
                        placeholder="例: 5000"
                      />
                    </div>

                    <!-- 庫存數量 -->
                    <div class="col-md-6">
                      <label class="form-label" style="color: #6A6A6A; font-size: 14px;"> 庫存數量 * </label>
                      <input
                        v-model.number="formData.庫存數量"
                        type="number"
                        class="form-control"
                        required
                        min="0"
                        placeholder="例: 1"
                      />
                    </div>

                    <!-- 顏色 -->
                    <div class="col-md-6">
                      <label class="form-label" style="color: #6A6A6A; font-size: 14px;"> 顏色 * </label>
                    <select v-model="formData.顏色" :class="['form-select', { 'is-invalid': validationErrors.顏色 }]" required @focus="clearValidationError('顏色')">
                      <option value="">請選擇顏色</option>
                      <option 
                        v-for="color in colorOptions" 
                        :key="color.value" 
                        :value="color.value"
                      >
                        {{ color.label }}
                      </option>
                    </select>
                    </div>

                    <!-- 裙型 -->
                    <div class="col-md-6">
                      <label class="form-label" style="color: #6A6A6A; font-size: 14px;"> 裙型 * </label>
                    <select v-model="formData.裙型" :class="['form-select', { 'is-invalid': validationErrors.裙型 }]" required @focus="clearValidationError('裙型')">
                      <option value="">請選擇裙型</option>
                      <option 
                        v-for="skirt in skirtOptions" 
                        :key="skirt.value" 
                        :value="skirt.value"
                      >
                        {{ skirt.label }}
                      </option>
                    </select>
                    </div>

                    <!-- 袖型 -->
                    <div class="col-md-6">
                      <label class="form-label" style="color: #6A6A6A; font-size: 14px;"> 袖型 * </label>
                    <select v-model="formData.袖型" :class="['form-select', { 'is-invalid': validationErrors.袖型 }]" required @focus="clearValidationError('袖型')">
                      <option value="">請選擇袖型</option>
                      <option 
                        v-for="sleeve in sleeveOptions" 
                        :key="sleeve.value" 
                        :value="sleeve.value"
                      >
                        {{ sleeve.label }}
                      </option>
                    </select>
                    </div>

                    <!-- 領型 -->
                    <div class="col-md-6">
                      <label class="form-label" style="color: #6A6A6A; font-size: 14px;"> 領型 * </label>
                    <select v-model="formData.領型" :class="['form-select', { 'is-invalid': validationErrors.領型 }]" required @focus="clearValidationError('領型')">
                      <option value="">請選擇領型</option>
                      <option 
                        v-for="neck in neckOptions" 
                        :key="neck.value" 
                        :value="neck.value"
                      >
                        {{ neck.label }}
                      </option>
                    </select>
                    </div>

                    <!-- 修改原因（當價格有變更時） -->
                    <div class="col-12" v-if="dress && (
                      formData.租借金額 !== dress.租借金額 || 
                      formData.加價金額 !== dress.加價金額 ||
                      formData.押金 !== dress.押金
                    )">
                      <label class="form-label" style="color: #6A6A6A; font-size: 14px;"> 
                        價格修改原因 
                        <small class="text-muted">(價格有變更時請填寫)</small>
                      </label>
                      <input
                        v-model="formData.修改原因"
                        type="text"
                        class="form-control"
                        placeholder="例: 成本調整、市場價格變動、特殊優惠等"
                      />
                    </div>

                    <!-- 備註 -->
                    <div class="col-12">
                      <label class="form-label" style="color: #6A6A6A; font-size: 14px;"> 備註 </label>
                      <textarea
                        v-model="formData.備註"
                        class="form-control"
                        rows="4"
                        placeholder="禮服的詳細描述、注意事項等..."
                      ></textarea>
                    </div>

                    <!-- 新增時間戳 (顯示用，不可編輯) -->
                    <div class="col-12" v-if="formData.新增時間戳">
                      <label class="form-label" style="color: #6A6A6A; font-size: 14px;"> 新增時間 </label>
                      <input
                        :value="formatTimestamp(formData.新增時間戳)"
                        type="text"
                        class="form-control"
                        readonly
                        disabled
                      />
                    </div>
                  </div>
                </div>
                
                <!-- 儲存取消按鈕 - 固定在右側區域底部 -->
                <div class="border-top bg-white p-3 flex-shrink-0">
                  <div class="d-flex gap-2 justify-content-end">
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
                      :disabled="loading || uploadingImages.length > 0"
                      class="btn btn-primary"
                    >
                      <span
                        v-if="loading"
                        class="spinner-border spinner-border-sm me-2"
                      ></span>
                      <i v-else class="bi bi-check-lg me-2"></i>
                      <span style="font-size: 14px;">{{ loading ? "儲存中..." : "儲存" }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase.js";
import { optionsService } from "../services/options.js";

export default {
  name: "DressModal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    dress: {
      type: Object,
      default: null,
    },
  },
  emits: ["close", "save"],
  data() {
    return {
      loading: false,
      isDragOver: false,
      uploadingImages: [],
      formData: {
        編號: "",
        圖片: [],
        顏色: "",
        裙型: "",
        袖型: "",
        領型: "",
        租借金額: 0,
        加價金額: 0,
        押金: 0,
        庫存數量: 1,
        備註: "",
        修改原因: "",
        新增時間戳: null,
      },
      colorOptions: [],
      skirtOptions: [],
      sleeveOptions: [],
      neckOptions: [],
      optionsUnsubscribe: null,
      validationErrors: {}, // 驗證錯誤狀態
    };
  },
  watch: {
    dress: {
      immediate: true,
      handler(newDress) {
        if (newDress) {
          this.formData = {
            編號: newDress.編號 || "",
            圖片: newDress.圖片 ? [...newDress.圖片] : [],
            顏色: newDress.顏色 || "",
            裙型: newDress.裙型 || "",
            袖型: newDress.袖型 || "",
            領型: newDress.領型 || "",
            租借金額: newDress.租借金額 || newDress.價格 || 0,
            加價金額: newDress.加價金額 || 0,
            庫存數量: newDress.庫存數量 || 1,
            備註: newDress.備註 || newDress.描述 || "",
            修改原因: "",
            新增時間戳: newDress.新增時間戳 || newDress.創建時間 || null,
          };
        } else {
          this.resetForm();
        }
      },
    },
  },
  mounted() {
    this.loadOptions();
    
    // 監聽選項變化
    this.optionsUnsubscribe = optionsService.subscribe(() => {
      this.loadOptions();
    });
  },
  beforeUnmount() {
    if (this.optionsUnsubscribe) {
      this.optionsUnsubscribe();
    }
  },
  methods: {
    resetForm() {
      this.formData = {
        編號: "",
        圖片: [],
        顏色: "",
        裙型: "",
        袖型: "",
        領型: "",
        租借金額: 0,
        加價金額: 0,
        庫存數量: 1,
        備註: "",
        修改原因: "",
        新增時間戳: null,
      };
    },

    handleDrop(e) {
      e.preventDefault();
      this.isDragOver = false;
      const files = Array.from(e.dataTransfer.files);
      this.uploadFiles(files);
    },

    handleFileUpload(e) {
      const files = Array.from(e.target.files);
      this.uploadFiles(files);
    },

    async uploadFiles(files) {
      // 限制文件數量
      if (this.formData.圖片.length + files.length > 5) {
        this.showToast("最多只能上傳 5 張圖片", "warning");
        return;
      }

      // 過濾圖片文件
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      if (imageFiles.length !== files.length) {
        this.showToast("只支援圖片文件", "warning");
      }

      // 檢查文件大小
      const validFiles = imageFiles.filter((file) => {
        if (file.size > 5 * 1024 * 1024) {
          // 5MB
          this.showToast(
            `${file.name} 文件過大，請選擇小於 5MB 的圖片`,
            "warning"
          );
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      // 上傳文件
      for (const file of validFiles) {
        await this.uploadSingleFile(file);
      }
    },

    async uploadSingleFile(file) {
      try {
        this.uploadingImages.push(file.name);

        // 檢查是否有可用的 Firebase Storage
        if (!storage) {
          // 如果沒有 Firebase Storage，租用本地 URL 作為示例
          const localURL = URL.createObjectURL(file);
          this.formData.圖片.push(localURL);
          this.showToast(`${file.name} 已加載（示例模式）`, "info");
          return;
        }

        // 生成唯一文件名
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2);
        const fileName = `dresses/${timestamp}_${randomStr}_${file.name}`;

        // 創建 Firebase Storage 引用
        const storageRef = ref(storage, fileName);

        // 上傳文件
        const snapshot = await uploadBytes(storageRef, file);

        // 獲取下載 URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        // 添加到圖片列表
        this.formData.圖片.push(downloadURL);

        this.showToast(`${file.name} 上傳成功`, "success");
      } catch (error) {
        console.error("圖片上傳失敗:", error);

        // 如果上傳失敗，租用本地 URL 作為備選方案
        try {
          const localURL = URL.createObjectURL(file);
          this.formData.圖片.push(localURL);
          this.showToast(`${file.name} 租用本地預覽（上傳失敗）`, "warning");
        } catch (localError) {
          this.showToast(`${file.name} 處理失敗`, "error");
        }
      } finally {
        // 從上傳列表中移除
        const index = this.uploadingImages.indexOf(file.name);
        if (index > -1) {
          this.uploadingImages.splice(index, 1);
        }
      }
    },

    removeImage(index) {
      this.formData.圖片.splice(index, 1);
    },

    // 清除特定欄位的驗證錯誤
    clearValidationError(field) {
      if (this.validationErrors[field]) {
        delete this.validationErrors[field];
      }
    },

    // 清除所有驗證錯誤
    clearAllValidationErrors() {
      this.validationErrors = {};
    },

    async handleSubmit() {
      try {
        this.loading = true;

        // 清除之前的驗證錯誤
        this.validationErrors = {};

        // 驗證必填欄位
        const requiredFields = {
          編號: this.formData.編號,
          顏色: this.formData.顏色,
          裙型: this.formData.裙型,
          袖型: this.formData.袖型,
          領型: this.formData.領型,
          租借金額: this.formData.租借金額
        };

        // 檢查必填欄位
        let hasValidationError = false;
        Object.keys(requiredFields).forEach(field => {
          if (!requiredFields[field] || (field === '租借金額' && requiredFields[field] <= 0)) {
            this.validationErrors[field] = true;
            hasValidationError = true;
          }
        });

        // 等待所有圖片上傳完成
        if (this.uploadingImages.length > 0) {
          this.validationErrors.圖片 = true;
          hasValidationError = true;
        }

        if (hasValidationError) {
          return;
        }

        // 準備提交的資料
        const submitData = { ...this.formData };

        // 如果是新增模式，添加新增時間戳
        if (!this.dress || !this.dress.id) {
          submitData.新增時間戳 = new Date();
        }

        this.$emit("save", submitData);
      } catch (error) {
        console.error("提交失敗:", error);
        this.showToast("提交失敗，請稍後再試", "error");
      } finally {
        this.loading = false;
      }
    },

    formatTimestamp(timestamp) {
      if (!timestamp) return "";

      let date;
      if (timestamp.toDate && typeof timestamp.toDate === "function") {
        // Firebase Timestamp
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        // JavaScript Date
        date = timestamp;
      } else {
        // String or other format
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

    loadOptions() {
      this.colorOptions = optionsService.getColorOptions();
      this.skirtOptions = optionsService.getSkirtOptions();
      this.sleeveOptions = optionsService.getSleeveOptions();
      this.neckOptions = optionsService.getNeckOptions();
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

.border-dashed {
  border-style: dashed !important;
}

/* 自定義虛線樣式 */
.custom-dashed-border {
  border: 1px dashed #D0D0D0 !important;
  border-spacing: 8px;
}

.object-fit-cover {
  object-fit: cover;
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
