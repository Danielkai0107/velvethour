<template>
  <!-- Bootstrap Modal -->
  <div
    v-if="show"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
    @click.self="$emit('close')"
  >
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-gem me-2"></i>
            {{ dress ? "編輯禮服" : "新增禮服" }}
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
            <!-- 圖片上傳區域 -->
            <div class="mb-4">
              <label class="form-label fw-semibold">
                <i class="bi bi-images me-2"></i>禮服圖片
              </label>

              <!-- 圖片上傳區 -->
              <div
                class="border border-2 border-dashed rounded p-4 text-center mb-3"
                :class="
                  isDragOver ? 'border-primary bg-light' : 'border-secondary'
                "
                @drop="handleDrop"
                @dragover.prevent="isDragOver = true"
                @dragleave.prevent="isDragOver = false"
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
                  <i class="bi bi-cloud-upload display-4 text-muted"></i>
                  <div class="mt-2">
                    <button
                      type="button"
                      @click="$refs.fileInput.click()"
                      class="btn btn-outline-primary me-2"
                    >
                      <i class="bi bi-folder2-open me-2"></i>選擇檔案
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
                  class="col-md-4 col-sm-6"
                >
                  <div class="position-relative">
                    <img
                      :src="image"
                      :alt="`圖片 ${index + 1}`"
                      class="w-100 rounded shadow-sm"
                      style="height: 120px; object-fit: cover"
                    />
                    <button
                      type="button"
                      @click="removeImage(index)"
                      class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-1"
                      style="width: 24px; height: 24px; line-height: 1"
                    >
                      <i class="bi bi-x"></i>
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

            <div class="row g-3">
              <!-- 左側欄位 -->
              <div class="col-md-6">
                <!-- 禮服編號 -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-hash me-2"></i>禮服編號 *
                  </label>
                  <input
                    v-model="formData.編號"
                    type="text"
                    class="form-control"
                    required
                    placeholder="例: WD001"
                  />
                </div>

                <!-- 顏色 -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-palette me-2"></i>顏色 *
                  </label>
                  <select v-model="formData.顏色" class="form-select" required>
                    <option value="">請選擇顏色</option>
                    <option value="白色">白色</option>
                    <option value="黑色">黑色</option>
                    <option value="綠色">綠色</option>
                    <option value="粉色">粉色</option>
                    <option value="紅色">紅色</option>
                    <option value="深藍色">深藍色</option>
                    <option value="藍灰色">藍灰色</option>
                    <option value="紫色">紫色</option>
                    <option value="金色/香檳色">金色/香檳色</option>
                    <option value="銀色">銀色</option>
                  </select>
                </div>

                <!-- 裙型 -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-scissors me-2"></i>裙型 *
                  </label>
                  <select v-model="formData.裙型" class="form-select" required>
                    <option value="">請選擇裙型</option>
                    <option value="魚尾">魚尾</option>
                    <option value="Aline">Aline</option>
                    <option value="蓬裙">蓬裙</option>
                    <option value="罩衫">罩衫</option>
                    <option value="兩件式-上">兩件式-上</option>
                    <option value="兩件式-下">兩件式-下</option>
                    <option value="配件">配件</option>
                    <option value="九分裙/短裙">九分裙/短裙</option>
                    <option value="頭紗">頭紗</option>
                  </select>
                </div>

                <!-- 袖型 -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-person-arms-up me-2"></i>袖型 *
                  </label>
                  <select v-model="formData.袖型" class="form-select" required>
                    <option value="">請選擇袖型</option>
                    <option value="短袖">短袖</option>
                    <option value="長袖">長袖</option>
                    <option value="無袖">無袖</option>
                  </select>
                </div>

                <!-- 領型 -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-circle me-2"></i>領型 *
                  </label>
                  <select v-model="formData.領型" class="form-select" required>
                    <option value="">請選擇領型</option>
                    <option value="v領">v領</option>
                    <option value="平口/微笑領">平口/微笑領</option>
                    <option value="一字領">一字領</option>
                    <option value="高領">高領</option>
                    <option value="圓領">圓領</option>
                    <option value="削肩/船型領">削肩/船型領</option>
                    <option value="桃心領">桃心領</option>
                    <option value="單肩">單肩</option>
                    <option value="卡肩">卡肩</option>
                    <option value="透膚">透膚</option>
                    <option value="方形領">方形領</option>
                    <option value="羅馬領">羅馬領</option>
                  </select>
                </div>
              </div>

              <!-- 右側欄位 -->
              <div class="col-md-6">
                <!-- 租借金額 -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-currency-dollar me-2"></i>租借金額 (NT$) *
                  </label>
                  <input
                    v-model.number="formData.租借金額"
                    type="number"
                    class="form-control"
                    required
                    min="0"
                    placeholder="例: 8000"
                  />
                </div>

                <!-- 加價金額 -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-plus-circle me-2"></i>加價金額 (NT$)
                  </label>
                  <input
                    v-model.number="formData.加價金額"
                    type="number"
                    class="form-control"
                    min="0"
                    placeholder="例: 1000"
                  />
                  <div class="form-text">
                    額外加價費用（如特殊尺寸、修改等）
                  </div>
                </div>

                <!-- 庫存數量 -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-box-seam me-2"></i>庫存數量 *
                  </label>
                  <input
                    v-model.number="formData.庫存數量"
                    type="number"
                    class="form-control"
                    required
                    min="0"
                    placeholder="例: 1"
                  />
                </div>

                <!-- 備註 -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-card-text me-2"></i>備註
                  </label>
                  <textarea
                    v-model="formData.備註"
                    class="form-control"
                    rows="4"
                    placeholder="禮服的詳細描述、注意事項等..."
                  ></textarea>
                </div>

                <!-- 新增時間戳 (顯示用，不可編輯) -->
                <div class="mb-3" v-if="formData.新增時間戳">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-clock me-2"></i>新增時間
                  </label>
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
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
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
            {{ loading ? "儲存中..." : "儲存" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase.js";

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
        庫存數量: 1,
        備註: "",
        新增時間戳: null,
      },
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
            新增時間戳: newDress.新增時間戳 || newDress.創建時間 || null,
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

    async handleSubmit() {
      try {
        this.loading = true;

        // 驗證必填欄位
        if (
          !this.formData.編號 ||
          !this.formData.顏色 ||
          !this.formData.裙型 ||
          !this.formData.袖型 ||
          !this.formData.領型 ||
          !this.formData.租借金額
        ) {
          this.showToast("請填寫所有必填欄位", "warning");
          return;
        }

        // 等待所有圖片上傳完成
        if (this.uploadingImages.length > 0) {
          this.showToast("請等待圖片上傳完成", "warning");
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

.object-fit-cover {
  object-fit: cover;
}
</style>
