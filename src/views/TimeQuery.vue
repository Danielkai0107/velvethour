<template>
  <div class="container-fluid">
    <!-- 頁面標題 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0 fw-bold">時間查詢</h1>
    </div>

    <!-- 日期查詢區域 -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex align-items-center gap-3">
          <div class="flex-grow-1" style="max-width: 200px;">
            <input
              id="queryDate"
              v-model="queryDate"
              type="date"
              class="form-control"
              @change="onDateChange"
            />
          </div>
          <button
            @click="setToday"
            class="btn btn-sm custom-btn"
            :class="isToday ? 'active' : ''"
          >
            今天
          </button>
          <button
            @click="setTomorrow"
            class="btn btn-sm custom-btn"
            :class="isTomorrow ? 'active' : ''"
          >
            明天
          </button>
          <span v-if="loading" class="text-muted">
            <span class="spinner-border spinner-border-sm me-1" role="status"></span>
            查詢中...
          </span>
        </div>
      </div>
    </div>

    <!-- 簡化的結果統計 -->
    <div v-if="rentedDresses.length > 0" class="mb-3">
      <small class="text-muted">
        找到 <strong>{{ rentedDresses.length }}</strong> 件禮服
      </small>
    </div>

    <!-- 禮服圖卡展示區域 -->
    <div v-if="rentedDresses.length > 0" class="row">
      <div class="col-12">
        <div class="">
          <div class="card-body">
            <!-- 卡片視圖 -->
            <div  class="row">
              <div
                v-for="item in rentedDresses"
                :key="`${item.dress.id}-${item.contract.id}`"
                class="col-lg-3 col-md-4 col-sm-6 mb-4"
              >
                <div class="card h-100 shadow-sm border-0 dress-card">
                  <!-- 禮服圖片 -->
                  <div class="position-relative" style="height: 250px; overflow: hidden; background-color: #f8f9fa;">
                    <img
                      :src="item.dress.圖片?.[0] || 'https://via.placeholder.com/300x400?text=無圖片'"
                      :alt="item.dress.編號"
                      class="card-img-top dress-image"
                      style="width: 100%; height: 100%; object-fit: contain;"
                    />
                  </div>

                  <!-- 禮服資訊 -->
                  <div class="card-body">
                    <h6 class="card-title fw-bold mb-1">{{ item.dress.編號 }}</h6>
                    <div class="mb-2">
                      <small class="text-muted">
                        {{ item.dress.顏色 }} · {{ item.dress.裙型 }}
                      </small>
                    </div>
                    
                    <!-- 租用時間資訊 -->
                    <div class="rental-time">
                      <div class="small">
                        {{ formatDate(item.contract.租用開始時間) }}-{{ formatDate(item.contract.下次可用時間) }}
                      </div>
                    </div>
                  </div>

                  <!-- 操作按鈕 -->
                  <div class="card-footer bg-transparent border-0 pt-0">
                    <button
                      @click="viewDressDetail(item.dress.id)"
                      class="btn btn-sm w-100 custom-btn"
                    >
                      查看詳情
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 無結果提示 -->
    <div v-else-if="hasSearched && !loading" class="text-center py-4">
      <div class="text-muted">沒有禮服租用記錄
      </div>
    </div>

    <!-- 載入中提示 -->
    <div v-if="loading" class="row">
      <div class="col-12">
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">載入中...</span>
          </div>
          <p class="text-muted mt-3">正在查詢禮服資料...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { contractService, dressService } from '../services/firestore.js';

export default {
  name: 'TimeQuery',
  data() {
    return {
      queryDate: '',
      loading: false,
      hasSearched: false,
      rentedDresses: [],
      viewMode: 'card'
    };
  },
  computed: {
    uniqueContracts() {
      const contractIds = new Set();
      this.rentedDresses.forEach(item => {
        contractIds.add(item.contract.id);
      });
      return Array.from(contractIds);
    },
    isToday() {
      if (!this.queryDate) return false;
      const today = new Date();
      const todayString = this.formatDateForInput(today);
      return this.queryDate === todayString;
    },
    isTomorrow() {
      if (!this.queryDate) return false;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = this.formatDateForInput(tomorrow);
      return this.queryDate === tomorrowString;
    }
  },
  mounted() {
    // 設置預設日期為今天
    const now = new Date();
    this.queryDate = this.formatDateForInput(now);
    // 載入頁面時自動查詢今天的資料
    this.$nextTick(() => {
      this.queryDresses();
    });
  },
  methods: {
    async queryDresses() {
      if (!this.queryDate) {
        this.hasSearched = false;
        this.rentedDresses = [];
        return;
      }

      this.loading = true;
      this.hasSearched = true;
      this.rentedDresses = [];

      try {
        // 獲取所有合約（真實資料）
        const contracts = await contractService.getAll();
        
        // 獲取所有禮服資料
        const dresses = await dressService.getAll();
        const dressMap = new Map();
        dresses.forEach(dress => {
          dressMap.set(dress.id, dress);
        });

        // 設定查詢日期範圍（當天 00:00:00 到 23:59:59）
        const queryDateTime = new Date(this.queryDate);
        const startDateTime = new Date(queryDateTime.getFullYear(), queryDateTime.getMonth(), queryDateTime.getDate(), 0, 0, 0, 0);
        const endDateTime = new Date(queryDateTime.getFullYear(), queryDateTime.getMonth(), queryDateTime.getDate(), 23, 59, 59, 999);

        console.log('查詢日期:', {
          查詢日期: this.queryDate,
          開始時間: startDateTime,
          結束時間: endDateTime
        });

        console.log('所有合約:', contracts.map(c => ({
          合約單號: c.合約單號,
          租用開始時間: c.租用開始時間,
          租用結束時間: c.租用結束時間,
          下次可用時間: c.下次可用時間,
          禮服清單: c.禮服清單
        })));

        const filteredContracts = contracts.filter(contract => {
          // 處理可能的 Firebase Timestamp 格式
          const contractStart = this.parseDate(contract.租用開始時間);
          const contractEnd = this.parseDate(contract.租用結束時間);
          const nextAvailable = this.parseDate(contract.下次可用時間);

          console.log('解析合約日期:', contract.合約單號, {
            原始租用開始時間: contract.租用開始時間,
            原始租用結束時間: contract.租用結束時間,
            原始下次可用時間: contract.下次可用時間,
            解析後開始: contractStart,
            解析後結束: contractEnd,
            解析後下次可用: nextAvailable
          });

          if (!contractStart || !contractEnd) {
            console.log('合約日期格式異常:', contract.合約單號);
            return false;
          }

          // 檢查合約時間範圍是否與查詢日期有重疊
          const hasOverlap = (contractStart <= endDateTime && contractEnd >= startDateTime);
          
          if (hasOverlap) {
            console.log('找到重疊合約:', contract.合約單號, {
              合約開始: contractStart,
              合約結束: contractEnd,
              下次可用: nextAvailable,
              查詢日期: startDateTime.toDateString()
            });
          }

          return hasOverlap;
        });

        console.log('篩選到的合約數量:', filteredContracts.length);

        // 整理租用的禮服資料
        const rentedDressesData = [];
        
        filteredContracts.forEach(contract => {
          if (contract.禮服清單 && Array.isArray(contract.禮服清單)) {
            contract.禮服清單.forEach(contractItem => {
              const dress = dressMap.get(contractItem.禮服ID);
              if (dress) {
                rentedDressesData.push({
                  dress: dress,
                  contract: contract,
                  contractItem: contractItem
                });
              } else {
                console.log('找不到禮服資料:', contractItem.禮服ID);
              }
            });
          }
        });

        this.rentedDresses = rentedDressesData;
        console.log('最終查詢結果:', this.rentedDresses);

      } catch (error) {
        console.error('查詢禮服失敗:', error);
        // 移除 alert，改為在界面上顯示錯誤訊息
        console.error('查詢失敗，請稍後再試');
      } finally {
        this.loading = false;
      }
    },

    clearResults() {
      this.rentedDresses = [];
      this.hasSearched = false;
    },

    onDateChange() {
      // 當日期改變時，自動搜尋
      if (this.queryDate) {
        this.queryDresses();
      } else {
        this.clearResults();
      }
    },

    setToday() {
      const today = new Date();
      this.queryDate = this.formatDateForInput(today);
      this.queryDresses();
    },

    setTomorrow() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.queryDate = this.formatDateForInput(tomorrow);
      this.queryDresses();
    },

    formatDate(dateString) {
      if (!dateString) return '';
      
      // 使用 parseDate 方法處理各種日期格式
      const date = this.parseDate(dateString);
      if (!date || isNaN(date.getTime())) {
        console.warn('無法解析日期:', dateString);
        return '日期格式錯誤';
      }
      
      // 格式化為 YYYY/MM/DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}/${month}/${day}`;
    },

    formatDateTime(dateTime) {
      if (!dateTime) return '';
      const date = new Date(dateTime);
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    formatDateForInput(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    viewDressDetail(dressId) {
      this.$router.push(`/dresses/${dressId}`);
    },

    // 解析日期格式（處理 Firebase Timestamp 和 JavaScript Date）
    parseDate(date) {
      if (!date) return null;

      // Firebase Timestamp 格式
      if (date.toDate && typeof date.toDate === 'function') {
        return date.toDate();
      }
      
      // JavaScript Date 物件
      if (date instanceof Date) {
        return date;
      }
      
      // 字串或數字格式
      if (typeof date === 'string' || typeof date === 'number') {
        const parsed = new Date(date);
        return isNaN(parsed.getTime()) ? null : parsed;
      }

      // 物件格式（可能是 Firebase 的其他格式）
      if (typeof date === 'object' && date.seconds !== undefined) {
        return new Date(date.seconds * 1000);
      }

      return null;
    }
  }
};
</script>

<style scoped>
.dress-card {
  transition: transform 0.2s ease-in-out;
}

.dress-card:hover {
  transform: translateY(-2px);
}

.dress-image {
  transition: transform 0.3s ease;
}

.dress-card:hover .dress-image {
  transform: scale(1.02);
}

.rental-info {
  font-size: 0.9rem;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #495057;
}

.alert {
  border: none;
  border-radius: 8px;
}

.card {
  border-radius: 10px;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  border-radius: 10px 10px 0 0 !important;
}

.form-control:focus {
  border-color: #8E3E36;
  box-shadow: 0 0 0 0.25rem rgba(142, 62, 54, 0.25);
}

/* 自定義按鈕樣式 - 使用網站主色 */
.custom-btn {
  background-color: transparent;
  border: 1px solid #8E3E36;
  color: #8E3E36;
  transition: all 0.2s ease-in-out;
}

.custom-btn:hover {
  background-color: #8E3E36;
  border-color: #8E3E36;
  color: white;
}

.custom-btn.active {
  background-color: #8E3E36;
  border-color: #8E3E36;
  color: white;
}

.custom-btn:focus {
  box-shadow: 0 0 0 0.25rem rgba(142, 62, 54, 0.25);
  border-color: #8E3E36;
}

</style>
