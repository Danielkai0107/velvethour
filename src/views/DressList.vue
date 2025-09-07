<template>
  <div class="container-fluid">
    <!-- 頁面標題和新增按鈕 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0 fw-bold">禮服清單</h1>
      <button
        @click="showAddModal = true"
        class="btn btn-primary"
      >
        <i class="bi bi-plus-lg me-2"></i>新增禮服
      </button>
    </div>

    <!-- 分類搜尋篩選器 -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <!-- 關鍵字搜尋 -->
          <div class="col-md-3 col-sm-6">
            <label class="form-label fw-semibold">
              <i class="bi bi-search me-2"></i>關鍵字搜尋
            </label>
            <input
              v-model="filters.關鍵字"
              type="text"
              class="form-control"
              placeholder="搜尋禮服編號、顏色、裙型..."
              @input="applyFilters"
            />
          </div>

          <!-- 顏色篩選 -->
          <div class="col-md-2 col-sm-6">
            <label class="form-label fw-semibold">
              <i class="bi bi-palette me-2"></i>顏色
            </label>
            <select v-model="filters.顏色" class="form-select" @change="applyFilters">
              <option value="">全部</option>
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

          <!-- 裙型篩選 -->
          <div class="col-md-2 col-sm-6">
            <label class="form-label fw-semibold">
              <i class="bi bi-scissors me-2"></i>裙型
            </label>
            <select v-model="filters.裙型" class="form-select" @change="applyFilters">
              <option value="">全部</option>
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

          <!-- 袖型篩選 -->
          <div class="col-md-2 col-sm-6">
            <label class="form-label fw-semibold">
              <i class="bi bi-person-arms-up me-2"></i>袖型
            </label>
            <select v-model="filters.袖型" class="form-select" @change="applyFilters">
              <option value="">全部</option>
              <option value="短袖">短袖</option>
              <option value="長袖">長袖</option>
              <option value="無袖">無袖</option>
            </select>
          </div>

          <!-- 領型篩選 -->
          <div class="col-md-3 col-sm-6">
            <label class="form-label fw-semibold">
              <i class="bi bi-circle me-2"></i>領型
            </label>
            <select v-model="filters.領型" class="form-select" @change="applyFilters">
              <option value="">全部</option>
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
        
        <!-- 篩選結果統計和清除按鈕 -->
        <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
          <span class="text-muted">
            <i class="bi bi-funnel me-2"></i>
            找到 {{ filteredDresses.length }} 件禮服
            <span v-if="hasActiveFilters">（已篩選）</span>
          </span>
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="btn btn-outline-secondary btn-sm"
          >
            <i class="bi bi-x-circle me-2"></i>清除篩選
          </button>
        </div>
      </div>
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
      <p class="mt-2 text-muted">載入中...</p>
    </div>

    <!-- 禮服卡片網格 -->
    <div v-else class="row g-4">
      <div
        v-for="dress in filteredDresses"
        :key="dress.id"
        class="col-lg-3 col-md-4 col-sm-6"
      >
        <div 
          class="card h-100 shadow-sm border-0 position-relative"
          style="cursor: pointer; transition: transform 0.2s ease-in-out;"
          @click="goToDressDetail(dress.id)"
          @mouseenter="$event.currentTarget.style.transform = 'translateY(-4px)'"
          @mouseleave="$event.currentTarget.style.transform = 'translateY(0)'"
        >
          

          <!-- 圖片 -->
          <div class="card-img-top position-relative" style="height: 280px; overflow: hidden;">
            <img
              v-if="dress.圖片 && dress.圖片.length > 0"
              :src="dress.圖片[0]"
              :alt="dress.編號"
              class="w-100 h-100 object-fit-cover"
            />
            <div
              v-else
              class="w-100 h-100 bg-light d-flex align-items-center justify-content-center"
            >
              <i class="bi bi-image text-muted" style="font-size: 3rem;"></i>
            </div>
          </div>

          <!-- 卡片內容 -->
          <div class="card-body d-flex flex-column">
            <h6 class="card-title fw-bold mb-1">{{ dress.編號 }}</h6>
            <p class="card-text text-muted small mb-2">
              {{ dress.顏色 }} | {{ dress.裙型 }} | {{ dress.袖型 }} | {{ dress.領型 }}
            </p>
            
            <!-- 價格 -->
            <div class="mt-auto">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <span class="h6 mb-0 text-primary fw-bold">NT$ {{ (dress.租借金額 || dress.價格 || 0).toLocaleString() }}</span>
              </div>
              <div class="d-flex align-items-center justify-content-between mb-2">
              <small v-if="dress.加價金額 && dress.加價金額 > 0" class="text-secondary">
                  加價 NT$ {{ dress.加價金額.toLocaleString() }}
                </small>
              </div>
              
              <!-- 庫存狀態 -->
              <div class="mb-3">
                <small class="text-muted">
                  <i class="bi bi-box-seam me-1"></i>
                  庫存: {{ dress.庫存數量 || 0 }}
                </small>
              </div>

              <!-- 操作按鈕 -->
              <div class="d-grid gap-2">
                <button 
                  @click.stop="addToCart(dress)"
                  class="btn btn-primary btn-sm"
                  :disabled="!dress.庫存數量 || dress.庫存數量 <= 0"
                >
                  <i class="bi bi-cart-plus me-1"></i>
                  {{ !dress.庫存數量 || dress.庫存數量 <= 0 ? '缺貨' : '加入合約' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空狀態 -->
    <div v-if="!loading && filteredDresses.length === 0" class="text-center py-5">
      <i class="bi bi-gem display-1 text-muted"></i>
      <h3 class="mt-3 text-muted">
        {{ dresses.length === 0 ? '沒有禮服' : '沒有符合條件的禮服' }}
      </h3>
      <p class="mt-1 text-muted">
        {{ dresses.length === 0 ? '開始新增您的第一件禮服' : '請調整篩選條件或清除篩選' }}
      </p>
      <div class="mt-4">
        <button
          v-if="dresses.length === 0"
          @click="showAddModal = true"
          class="btn btn-primary"
        >
          <i class="bi bi-plus-lg me-2"></i>新增禮服
        </button>
        <button
          v-else
          @click="clearFilters"
          class="btn btn-outline-primary"
        >
          <i class="bi bi-x-circle me-2"></i>清除篩選
        </button>
      </div>
    </div>

    <!-- 新增模態框 -->
    <DressModal
      v-if="showAddModal"
      :show="showAddModal"
      :dress="null"
      @close="closeModal"
      @save="saveDress"
    />
  </div>
</template>

<script>
import { dressService } from "../services/firestore.js";
import DressModal from "../components/DressModal.vue";

export default {
  name: "DressList",
  components: {
    DressModal,
  },
  data() {
    return {
      dresses: [],
      loading: true,
      showAddModal: false,
      filters: {
        關鍵字: "",
        顏色: "",
        裙型: "",
        袖型: "",
        領型: "",
      },
    };
  },
  computed: {
    filteredDresses() {
      return this.dresses.filter(dress => {
        // 關鍵字搜尋
        const matchesKeyword = !this.filters.關鍵字 || 
          dress.編號?.toLowerCase().includes(this.filters.關鍵字.toLowerCase()) ||
          dress.顏色?.toLowerCase().includes(this.filters.關鍵字.toLowerCase()) ||
          dress.裙型?.toLowerCase().includes(this.filters.關鍵字.toLowerCase()) ||
          dress.袖型?.toLowerCase().includes(this.filters.關鍵字.toLowerCase()) ||
          dress.領型?.toLowerCase().includes(this.filters.關鍵字.toLowerCase()) ||
          dress.備註?.toLowerCase().includes(this.filters.關鍵字.toLowerCase());
        
        // 檢查每個篩選條件
        const matchesColor = !this.filters.顏色 || dress.顏色 === this.filters.顏色;
        const matchesSkirtType = !this.filters.裙型 || dress.裙型 === this.filters.裙型;
        const matchesSleeveType = !this.filters.袖型 || dress.袖型 === this.filters.袖型;
        const matchesNeckType = !this.filters.領型 || dress.領型 === this.filters.領型;
        
        return matchesKeyword && matchesColor && matchesSkirtType && matchesSleeveType && matchesNeckType;
      });
    },
    hasActiveFilters() {
      return this.filters.關鍵字 || this.filters.顏色 || this.filters.裙型 || this.filters.袖型 || this.filters.領型;
    },
  },
  async mounted() {
    await this.loadDresses();
  },
  methods: {
    async loadDresses() {
      try {
        this.loading = true;
        this.dresses = await dressService.getAll();
      } catch (error) {
        console.error("載入禮服清單失敗:", error);
        this.showToast("載入禮服清單失敗，請稍後再試", "error");
      } finally {
        this.loading = false;
      }
    },
    async saveDress(dressData) {
      try {
        // 只處理新增模式
        await dressService.create(dressData);
        this.showToast("禮服已新增", "success");
        await this.loadDresses();
        this.closeModal();
      } catch (error) {
        console.error("儲存禮服失敗:", error);
        this.showToast("儲存禮服失敗，請稍後再試", "error");
      }
    },
    goToDressDetail(dressId) {
      this.$router.push(`/dresses/${dressId}`);
    },
    addToCart(dress) {
      // TODO: 實現購物車功能
      this.showToast(`已將 "${dress.編號}" 加入合約`, "success");
    },
    toggleFavorite(dress) {
      // TODO: 實現收藏功能
      this.showToast(`已收藏 "${dress.編號}"`, "info");
    },
    applyFilters() {
      // 篩選會通過 computed property 自動更新
      console.log('篩選條件已更新:', this.filters);
    },
    clearFilters() {
      this.filters = {
        關鍵字: "",
        顏色: "",
        裙型: "",
        袖型: "",
        領型: "",
      };
      this.showToast("篩選條件已清除", "info");
    },
    closeModal() {
      this.showAddModal = false;
    },
    showToast(message, type = "info") {
      // 簡單的 toast 通知實現
      const toastContainer = document.createElement('div');
      toastContainer.className = `alert alert-${type === 'error' ? 'danger' : type} position-fixed top-0 end-0 m-3`;
      toastContainer.style.zIndex = '9999';
      toastContainer.innerHTML = message;
      
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
