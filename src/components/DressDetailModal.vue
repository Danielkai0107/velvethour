<template>
  <!-- Bootstrap Modal -->
  <div
    v-if="show"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0,0,0,0.5);"
    @click.self="$emit('close')"
  >
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title">
            禮服詳情 - {{ dress?.編號 }}
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body" v-if="dress">
          <!-- 1. 圖片 -->
          <div class="mb-4">
            <h6 class="fw-semibold mb-3">禮服圖片
            </h6>
            
            <!-- 主圖片 -->
            <div class="mb-3">
              <div class="bg-light rounded overflow-hidden d-flex align-items-center justify-content-center" style="max-width: 400px; min-height: 300px;">
                <img
                  v-if="currentImage"
                  :src="currentImage"
                  :alt="dress.編號"
                  class="img-fluid rounded"
                  style="max-width: 100%; max-height: 400px; width: auto; height: auto; object-fit: contain;"
                />
                <div
                  v-else
                  class="d-flex align-items-center justify-content-center bg-light w-100 h-100"
                  style="min-height: 300px;"
                >
                  <i class="bi bi-image text-muted" style="font-size: 3rem;"></i>
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
                style="width: 60px; height: 60px;"
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
            <h6 class="fw-semibold mb-2">禮服編號
            </h6>
            <h4 class="text-primary fw-bold">{{ dress.編號 }}</h4>
          </div>

          <!-- 3. 規格 -->
          <div class="mb-4">
            <h6 class="fw-semibold mb-3">規格資訊
            </h6>
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
            <h6 class="fw-semibold mb-3">金額資訊
            </h6>
            <div class="row g-3">
              <div class="col-md-6">
                <div class="border rounded p-3">
                  <small class="text-muted d-block">租借金額</small>
                  <h5 class="text-primary fw-bold mb-0">NT$ {{ (dress.租借金額 || dress.價格 || 0).toLocaleString() }}</h5>
                </div>
              </div>
              <div class="col-md-6" v-if="dress.加價金額 && dress.加價金額 > 0">
                <div class="border rounded p-3">
                  <small class="text-muted d-block">加價金額</small>
                  <h6 class="text-warning fw-bold mb-0">+ NT$ {{ dress.加價金額.toLocaleString() }}</h6>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. 庫存 -->
          <div class="mb-4">
            <h6 class="fw-semibold mb-3">庫存狀態
            </h6>
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
            <h6 class="fw-semibold mb-3">備註
            </h6>
            <div class="border rounded p-3">
              <p class="mb-0 text-dark" style="white-space: pre-wrap;">{{ dress.備註 || dress.備注 }}</p>
            </div>
          </div>

          <!-- 7. 新增＆編輯時間 -->
          <div class="mb-4">
            <h6 class="fw-semibold mb-3">時間記錄
            </h6>
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
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="$emit('close')"
          >
            <i class="bi bi-x-lg me-2"></i>關閉
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DressDetailModal",
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
  emits: ["close"],
  data() {
    return {
      currentImage: null,
    };
  },
  watch: {
    dress: {
      immediate: true,
      handler(newDress) {
        if (newDress && newDress.圖片 && newDress.圖片.length > 0) {
          this.currentImage = newDress.圖片[0];
        } else {
          this.currentImage = null;
        }
      },
    },
  },
  methods: {
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

.object-fit-contain {
  object-fit: contain;
}
</style>
