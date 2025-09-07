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

    <!-- 禮服詳情 -->
    <div v-else-if="dress" class="row">
      <div class="col-12">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4">
            
            <!-- 1. 圖片 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">
                <i class="bi bi-images me-2"></i>禮服圖片
              </h5>
              
              <!-- 主圖片 -->
              <div class="mb-3">
                <div class="bg-light rounded overflow-hidden d-flex align-items-center justify-content-center" style="max-width: 500px; min-height: 400px;">
                  <img
                    v-if="currentImage"
                    :src="currentImage"
                    :alt="dress.編號"
                    class="img-fluid rounded"
                    style="max-width: 100%; max-height: 500px; width: auto; height: auto; object-fit: contain;"
                  />
                  <div
                    v-else
                    class="d-flex align-items-center justify-content-center bg-light w-100 h-100"
                    style="min-height: 400px;"
                  >
                    <i class="bi bi-image text-muted" style="font-size: 4rem;"></i>
                  </div>
                </div>
              </div>

              <!-- 圖片縮圖 -->
              <div v-if="dress.圖片 && dress.圖片.length > 1" class="d-flex gap-2 flex-wrap">
                <button
                  v-for="(image, index) in dress.圖片"
                  :key="index"
                  @click="currentImage = image"
                  class="btn p-1 border rounded overflow-hidden"
                  :class="currentImage === image ? 'border-primary border-2' : 'border-secondary'"
                  style="width: 70px; height: 70px;"
                >
                  <img
                    :src="image"
                    :alt="`圖片 ${index + 1}`"
                    class="w-100 h-100 rounded"
                    style="object-fit: contain;"
                  />
                </button>
              </div>
            </div>

            <!-- 2. 禮服編號 -->
            <div class="mb-4">
              <h5 class="card-title mb-2">
                <i class="bi bi-hash me-2"></i>禮服編號
              </h5>
              <h2 class="text-primary fw-bold">{{ dress.編號 }}</h2>
            </div>

            <!-- 3. 規格 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">
                <i class="bi bi-list-check me-2"></i>規格資訊
              </h5>
              <div class="row g-3">
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">顏色</small>
                    <strong class="text-dark">{{ dress.顏色 }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">裙型</small>
                    <strong class="text-dark">{{ dress.裙型 }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">袖型</small>
                    <strong class="text-dark">{{ dress.袖型 }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">領型</small>
                    <strong class="text-dark">{{ dress.領型 }}</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4. 金額 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">
                <i class="bi bi-currency-dollar me-2"></i>金額資訊
              </h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="border rounded p-3">
                    <small class="text-muted d-block">租借金額</small>
                    <h4 class="text-primary fw-bold mb-0">NT$ {{ (dress.租借金額 || dress.價格 || 0).toLocaleString() }}</h4>
                  </div>
                </div>
                <div class="col-md-6" v-if="dress.加價金額 && dress.加價金額 > 0">
                  <div class="border rounded p-3">
                    <small class="text-muted d-block">加價金額</small>
                    <h5 class="text-warning fw-bold mb-0">+ NT$ {{ dress.加價金額.toLocaleString() }}</h5>
                  </div>
                </div>
              </div>
            </div>

            <!-- 5. 庫存 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">
                <i class="bi bi-box-seam me-2"></i>庫存狀態
              </h5>
              <div class="border rounded p-3">
                <div class="d-flex align-items-center">
                  <div
                    class="rounded-circle me-3"
                    style="width: 12px; height: 12px;"
                    :class="dress.庫存數量 > 0 ? 'bg-success' : 'bg-danger'"
                  ></div>
                  <div>
                    <strong class="text-dark">
                      {{ dress.庫存數量 > 0 ? `有庫存` : "缺貨" }}
                    </strong>
                    <span class="text-muted ms-2">({{ dress.庫存數量 || 0 }} 件)</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 6. 備註 -->
            <div class="mb-4" v-if="dress.備註 || dress.備注">
              <h5 class="card-title mb-3">
                <i class="bi bi-card-text me-2"></i>備註
              </h5>
              <div class="border rounded p-3">
                <p class="mb-0 text-dark" style="white-space: pre-wrap;">{{ dress.備註 || dress.備注 }}</p>
              </div>
            </div>

            <!-- 7. 新增＆編輯時間 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">
                <i class="bi bi-clock-history me-2"></i>時間記錄
              </h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="border rounded p-3">
                    <small class="text-muted d-block">新增時間</small>
                    <strong class="text-dark">{{ formatDate(dress.新增時間戳 || dress.創建時間) }}</strong>
                  </div>
                </div>
                <div class="col-md-6" v-if="dress.更新時間">
                  <div class="border rounded p-3">
                    <small class="text-muted d-block">最後編輯時間</small>
                    <strong class="text-dark">{{ formatDate(dress.更新時間) }}</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- 操作按鈕 -->
            <div class="d-flex gap-3 justify-content-end mt-4 pt-3 border-top">
              <button
                @click="editDress"
                class="btn btn-primary"
              >
                <i class="bi bi-pencil-square me-2"></i>編輯禮服
              </button>
              <button
                @click="deleteDress"
                class="btn btn-outline-danger"
              >
                <i class="bi bi-trash me-2"></i>刪除禮服
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else class="text-center py-5">
      <i class="bi bi-gem display-1 text-muted"></i>
      <h3 class="mt-3 text-muted">找不到禮服</h3>
      <p class="mt-1 text-muted">該禮服可能已被刪除或不存在</p>
      <div class="mt-4">
        <router-link
          to="/dresses"
          class="btn btn-primary"
        >
          <i class="bi bi-arrow-left me-2"></i>返回禮服清單
        </router-link>
      </div>
    </div>

    <!-- 編輯模態框 -->
    <DressModal
      v-if="showEditModal"
      :show="showEditModal"
      :dress="dress"
      @close="showEditModal = false"
      @save="saveDress"
    />
  </div>
</template>

<script>
import { dressService } from "../services/firestore.js";
import DressModal from "../components/DressModal.vue";

export default {
  name: "DressDetail",
  components: {
    DressModal,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dress: null,
      loading: true,
      currentImage: null,
      showEditModal: false,
    };
  },
  async mounted() {
    await this.loadDress();
  },
  methods: {
    async loadDress() {
      try {
        this.loading = true;
        this.dress = await dressService.getById(this.id);

        // 設定預設顯示圖片
        if (this.dress.圖片 && this.dress.圖片.length > 0) {
          this.currentImage = this.dress.圖片[0];
        }
      } catch (error) {
        console.error("載入禮服詳情失敗:", error);
        this.showToast("載入禮服詳情失敗，請稍後再試", "error");
        this.dress = null;
      } finally {
        this.loading = false;
      }
    },
    editDress() {
      this.showEditModal = true;
    },
    async deleteDress() {
      // 使用 Bootstrap Modal 確認對話框
      if (!confirm(`確定要刪除禮服 "${this.dress.編號}" 嗎？\n\n此操作無法復原！`)) {
        return;
      }

      try {
        await dressService.delete(this.dress.id);
        this.showToast("禮服已刪除", "success");
        
        // 延遲跳轉，讓用戶看到成功訊息
        setTimeout(() => {
          this.$router.push("/dresses");
        }, 1500);
      } catch (error) {
        console.error("刪除禮服失敗:", error);
        this.showToast("刪除禮服失敗，請稍後再試", "error");
      }
    },
    async saveDress(dressData) {
      try {
        await dressService.update(this.dress.id, dressData);
        this.showToast("禮服已更新", "success");
        await this.loadDress();
        this.showEditModal = false;
      } catch (error) {
        console.error("更新禮服失敗:", error);
        this.showToast("更新禮服失敗，請稍後再試", "error");
      }
    },
    formatDate(date) {
      if (!date) return "未設定";
      
      let dateObj;
      if (date.toDate && typeof date.toDate === 'function') {
        // Firebase Timestamp
        dateObj = date.toDate();
      } else if (date instanceof Date) {
        // JavaScript Date
        dateObj = date;
      } else {
        // String or other format
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
    showToast(message, type = "info") {
      // 簡單的 toast 通知實現
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
