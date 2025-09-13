<template>
  <div class="container-fluid">
    <!-- 頁面標題 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0 fw-bold">系統設定</h1>
    </div>

    <div class="row">
      <!-- 檔期設定 -->
      <div class="col-lg-6 mb-4">
        <div class="bg-white rounded-4 shadow-sm border-0 p-4">
          <h5 class="fw-semibold mb-3 d-flex align-items-center">
            <i class="bi bi-calendar-range me-2 text-primary"></i>
            檔期設定
          </h5>

          <div class="mb-3">
            <label class="form-label fw-semibold">
              檔期天數 *
              <small class="text-muted">(從合約開始時間計算)</small>
            </label>
            <div class="input-group">
              <input
                v-model.number="localSettings.rentalPeriodDays"
                type="number"
                class="form-control"
                min="1"
                max="30"
                required
                @input="validateAndUpdate"
              />
              <span class="input-group-text">天</span>
            </div>
            <div class="form-text">
              設定每個合約的實際檔期長度。例如：設定為 7 天，則合約開始時間為 12/15，實際檔期為 12/15 ~ 12/22（共7天）
            </div>
          </div>

          <!-- 檔期預覽 -->
          <div class="alert alert-info">
            <h6 class="alert-heading">
              <i class="bi bi-info-circle me-2"></i>檔期計算預覽
            </h6>
            <div class="mb-2">
              <strong>假設合約開始時間：</strong>{{ exampleDate }}
            </div>
            <div>
              <strong>實際檔期範圍：</strong>{{ exampleDate }} ~ {{ calculateExampleEndDate() }}
              <span class="text-muted">(共{{ localSettings.rentalPeriodDays }}天)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 系統資訊 -->
      <div class="col-lg-6 mb-4">
        <div class="bg-white rounded-4 shadow-sm border-0 p-4">
          <h5 class="fw-semibold mb-3 d-flex align-items-center">
            <i class="bi bi-info-circle me-2 text-primary"></i>
            系統資訊
          </h5>

          <div class="mb-3">
            <label class="form-label text-muted small">版本資訊</label>
            <div class="fw-semibold">VelvetHour v1.0.0</div>
          </div>

          <div class="mb-3">
            <label class="form-label text-muted small">檔期天數設定</label>
            <div class="fw-semibold text-primary">{{ localSettings.rentalPeriodDays }} 天</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 儲存狀態提示 -->
    <div v-if="saveStatus" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050">
      <div
        :class="[
          'alert alert-dismissible fade show',
          saveStatus.type === 'success' ? 'alert-success' : 'alert-danger'
        ]"
        style="min-width: 300px"
      >
        <div class="d-flex align-items-center">
          <i
            :class="[
              'me-2',
              saveStatus.type === 'success' ? 'bi bi-check-circle' : 'bi bi-exclamation-triangle'
            ]"
          ></i>
          {{ saveStatus.message }}
        </div>
        <button
          type="button"
          class="btn-close"
          @click="saveStatus = null"
        ></button>
      </div>
    </div>
  </div>
</template>

<script>
import { settingsService } from '../services/settings.js';

export default {
  name: 'Settings',
  data() {
    return {
      localSettings: {
        rentalPeriodDays: 7
      },
      loading: false,
      saveStatus: null,
      exampleDate: new Date().toLocaleDateString('zh-TW'),
      saveTimeout: null,
      settingsUnsubscribe: null
    };
  },
  async mounted() {
    await this.loadSettings();
    
    // 監聽設定變更
    this.settingsUnsubscribe = settingsService.subscribe(() => {
      // 設定變更時的處理
    });
  },
  watch: {
    // 監聽路由變化，確保切換回此頁面時重新載入資料
    '$route'(to, from) {
      if (to.name === 'Settings' && from.name !== 'Settings') {
        this.loadSettings();
      }
    }
  },
  beforeUnmount() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    if (this.settingsUnsubscribe) {
      this.settingsUnsubscribe();
    }
  },
  methods: {
    async loadSettings() {
      try {
        this.loading = true;
        const settings = settingsService.getSettings();
        console.log('載入的設定:', settings);
        this.localSettings = { ...settings };
        console.log('本地設定:', this.localSettings);
      } catch (error) {
        console.error('載入設定失敗:', error);
        this.showSaveStatus('載入設定失敗', 'error');
      } finally {
        this.loading = false;
      }
    },

    validateAndUpdate() {
      // 驗證檔期天數
      if (this.localSettings.rentalPeriodDays < 1) {
        this.localSettings.rentalPeriodDays = 1;
      } else if (this.localSettings.rentalPeriodDays > 30) {
        this.localSettings.rentalPeriodDays = 30;
      }

      // 延遲儲存，避免頻繁更新
      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout);
      }
      
      this.saveTimeout = setTimeout(() => {
        this.saveSettings();
      }, 500);
    },

    async saveSettings() {
      try {
        const success = settingsService.updateSettings(this.localSettings);
        if (success) {
          this.showSaveStatus('設定已儲存', 'success');
        } else {
          this.showSaveStatus('儲存設定失敗', 'error');
        }
      } catch (error) {
        console.error('儲存設定失敗:', error);
        this.showSaveStatus('儲存設定失敗', 'error');
      }
    },


    calculateExampleEndDate() {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + (this.localSettings.rentalPeriodDays || 7) - 1);
      return endDate.toLocaleDateString('zh-TW');
    },

    showSaveStatus(message, type) {
      this.saveStatus = { message, type };
      
      // 3秒後自動隱藏
      setTimeout(() => {
        this.saveStatus = null;
      }, 3000);
    }
  }
};
</script>

<style scoped>
.alert {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-control:focus,
.form-check-input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}
</style>
