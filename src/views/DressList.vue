<template>
  <div class="container-fluid">
    <!-- 頁面標題和新增按鈕 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0 fw-bold">禮服清單</h1>
      <button
        @click="showAddModal = true"
        class="btn btn-outline-primary"
      >
        <i class="bi bi-plus-lg me-2"></i>新增禮服
      </button>
    </div>

    <!-- 分類搜尋篩選器 -->
    <div class="bg-white rounded-4 shadow-sm border-0 mb-4 p-4">
      <!-- 關鍵字搜尋 -->
      <div class="mb-4">
        <input
          v-model="filters.關鍵字"
          type="text"
          class="form-control"
          placeholder="搜尋禮服編號、顏色、裙型..."
          style="font-size: 14px;"
          @input="applyFilters"
        />
      </div>

      <!-- 顏色分類 -->
      <div class="mb-4">
        <h6 class="fw-semibold mb-3" style="font-size: 14px;">顏色</h6>
        <div class="d-flex flex-wrap gap-2">
          <button
            v-for="color in colorOptions"
            :key="color.value"
            @click="toggleFilter('顏色', color.value)"
            :class="[
              'btn btn-sm rounded-pill d-flex align-items-center',
              filters.顏色 === color.value ? 'btn-primary' : 'btn-outline-secondary'
            ]"
            style="font-size: 13px; padding: 8px 16px;"
          >
            <span 
              class="rounded-circle me-2"
              style="width: 16px; height: 16px; display: inline-block;"
              :style="{
                backgroundColor: color.color,
                border: color.border ? `1px solid ${color.border}` : '1px solid #E5E7EB'
              }"
            ></span>
            {{ color.label }}
          </button>
        </div>
      </div>

      <!-- 裙型分類 -->
      <div class="mb-4">
        <h6 class="fw-semibold mb-3" style="font-size: 14px;">裙型</h6>
        <div class="d-flex flex-wrap gap-2">
          <button
            v-for="type in skirtOptions"
            :key="type.value"
            @click="toggleFilter('裙型', type.value)"
            :class="[
              'btn btn-sm rounded-pill',
              filters.裙型 === type.value ? 'btn-primary' : 'btn-outline-secondary'
            ]"
            style="font-size: 13px; padding: 8px 16px;"
          >
            {{ type.label }}
          </button>
        </div>
      </div>

      <!-- 袖型分類 -->
      <div class="mb-4">
        <h6 class="fw-semibold mb-3" style="font-size: 14px;">袖型</h6>
        <div class="d-flex flex-wrap gap-2">
          <button
            v-for="sleeve in sleeveOptions"
            :key="sleeve.value"
            @click="toggleFilter('袖型', sleeve.value)"
            :class="[
              'btn btn-sm rounded-pill',
              filters.袖型 === sleeve.value ? 'btn-primary' : 'btn-outline-secondary'
            ]"
            style="font-size: 13px; padding: 8px 16px;"
          >
            {{ sleeve.label }}
          </button>
        </div>
      </div>

      <!-- 領型分類 -->
      <div class="mb-4">
        <h6 class="fw-semibold mb-3" style="font-size: 14px;">領型</h6>
        <div class="d-flex flex-wrap gap-2">
          <button
            v-for="neck in neckOptions"
            :key="neck.value"
            @click="toggleFilter('領型', neck.value)"
            :class="[
              'btn btn-sm rounded-pill',
              filters.領型 === neck.value ? 'btn-primary' : 'btn-outline-secondary'
            ]"
            style="font-size: 13px; padding: 8px 16px;"
          >
            {{ neck.label }}
          </button>
        </div>
      </div>

      <!-- 篩選結果統計和清除按鈕 -->
      <div class="d-flex justify-content-between align-items-center pt-3 border-top">
        <span class="text-muted" style="font-size: 13px;">
          <i class="bi bi-funnel me-2"></i>
          找到 {{ filteredDresses.length }} 件禮服
          <span v-if="hasActiveFilters">（已篩選）</span>
        </span>
        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="btn btn-outline-secondary btn-sm"
          style="font-size: 13px;"
        >
          <i class="bi bi-x-circle me-2"></i>清除篩選
        </button>
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
          class="card h-100 shadow-sm border-0 position-relative rounded-4"
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
                  @click.stop="toggleCartItem(dress)"
                  :class="[
                    'btn btn-sm',
                    cartService.isInCart(dress.id) ? 'btn-success' : 'btn-primary'
                  ]"
                  :disabled="!dress.庫存數量 || dress.庫存數量 <= 0"
                >
                  <i :class="[
                    'me-1',
                    cartService.isInCart(dress.id) ? 'bi bi-cart-check' : 'bi bi-cart-plus'
                  ]"></i>
                  <template v-if="!dress.庫存數量 || dress.庫存數量 <= 0">
                    缺貨
                  </template>
                  <template v-else-if="cartService.isInCart(dress.id)">
                    已加入
                  </template>
                  <template v-else>
                    加入合約
                  </template>
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
          class="btn btn-outline-primary"
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
import { cartService } from "../services/cart.js";
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
      cartService, // 讓模板可以存取購物車服務
      cartUnsubscribe: null, // 購物車監聽器取消函數
      filters: {
        關鍵字: "",
        顏色: "",
        裙型: "",
        袖型: "",
        領型: "",
      },
      colorOptions: [
        { value: "白色", label: "白色", color: "#FFFFFF", border: "#E5E7EB" },
        { value: "黑色", label: "黑色", color: "#000000" },
        { value: "綠色", label: "綠色", color: "#10B981" },
        { value: "粉色", label: "粉色", color: "#F472B6" },
        { value: "紅色", label: "紅色", color: "#EF4444" },
        { value: "深藍色", label: "深藍色", color: "#1E40AF" },
        { value: "藍灰色", label: "藍灰色", color: "#64748B" },
        { value: "紫色", label: "紫色", color: "#8B5CF6" },
        { value: "金色/香檳色", label: "金色/香檳色", color: "#F59E0B" },
        { value: "銀色", label: "銀色", color: "#94A3B8" },
      ],
      skirtOptions: [
        { value: "魚尾", label: "魚尾" },
        { value: "Aline", label: "Aline" },
        { value: "蓬裙", label: "蓬裙" },
        { value: "罩衫", label: "罩衫" },
        { value: "兩件式-上", label: "兩件式-上" },
        { value: "兩件式-下", label: "兩件式-下" },
        { value: "配件", label: "配件" },
        { value: "九分裙/短裙", label: "九分裙/短裙" },
        { value: "頭紗", label: "頭紗" },
      ],
      sleeveOptions: [
        { value: "短袖", label: "短袖" },
        { value: "長袖", label: "長袖" },
        { value: "無袖", label: "無袖" },
      ],
      neckOptions: [
        { value: "v領", label: "v領" },
        { value: "平口/微笑領", label: "平口/微笑領" },
        { value: "一字領", label: "一字領" },
        { value: "高領", label: "高領" },
        { value: "圓領", label: "圓領" },
        { value: "削肩/船型領", label: "削肩/船型領" },
        { value: "桃心領", label: "桃心領" },
        { value: "單肩", label: "單肩" },
        { value: "卡肩", label: "卡肩" },
        { value: "透膚", label: "透膚" },
        { value: "方形領", label: "方形領" },
        { value: "羅馬領", label: "羅馬領" },
      ],
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
    
    // 監聽購物車變化，更新按鈕狀態
    this.cartUnsubscribe = cartService.subscribe(() => {
      this.$forceUpdate();
    });
  },
  beforeUnmount() {
    // 取消監聽
    if (this.cartUnsubscribe) {
      this.cartUnsubscribe();
    }
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
      try {
        const success = cartService.addDress(dress);
        if (success) {
          this.showToast(
            `已將 "${dress.編號}" 加入合約`, 
            "success"
          );
          // 強制重新渲染以更新按鈕狀態
          this.$forceUpdate();
        } else {
          // 禮服已存在於購物車中
          this.showToast(
            `"${dress.編號}" 已在合約清單中`, 
            "info"
          );
        }
      } catch (error) {
        console.error('加入購物車失敗:', error);
        this.showToast('加入合約失敗，請稍後再試', 'error');
      }
    },
    toggleCartItem(dress) {
      try {
        if (cartService.isInCart(dress.id)) {
          // 如果已在購物車中，移除它
          cartService.removeDress(dress.id);
          this.showToast(
            `已將 "${dress.編號}" 從合約清單移除`, 
            "info"
          );
        } else {
          // 如果不在購物車中，添加它
          const success = cartService.addDress(dress);
          if (success) {
            this.showToast(
              `已將 "${dress.編號}" 加入合約`, 
              "success"
            );
          }
        }
        // 強制重新渲染以更新按鈕狀態
        this.$forceUpdate();
      } catch (error) {
        console.error('切換購物車項目失敗:', error);
        this.showToast('操作失敗，請稍後再試', 'error');
      }
    },
    toggleFavorite(dress) {
      // TODO: 實現收藏功能
      this.showToast(`已收藏 "${dress.編號}"`, "info");
    },
    toggleFilter(filterType, value) {
      if (this.filters[filterType] === value) {
        // 如果已經選中，則取消選擇
        this.filters[filterType] = "";
      } else {
        // 選擇新的值
        this.filters[filterType] = value;
      }
      this.applyFilters();
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
      toastContainer.className = `alert alert-${type === 'error' ? 'danger' : type} position-fixed top-0 start-50 translate-middle-x mt-3`;
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
