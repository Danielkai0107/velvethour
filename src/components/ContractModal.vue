<template>
  <!-- Bootstrap Modal -->
  <div
    v-if="show"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0,0,0,0.5);"
    @click.self="$emit('close')"
  >
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-file-text me-2"></i>
            {{ contract ? "編輯合約" : "新增合約" }}
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
            <!-- 基本資訊 -->
            <div class="mb-4">
              <h5 class="fw-semibold mb-3">
                <i class="bi bi-person me-2"></i>客戶資訊
              </h5>
              <div class="row g-3">
                <!-- 客戶姓名 -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-person me-2"></i>客戶姓名 *
                  </label>
                  <input
                    v-model="formData.客戶姓名"
                    type="text"
                    class="form-control"
                    required
                    placeholder="例: 張小姐"
                  />
                </div>

                <!-- 電話 -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-telephone me-2"></i>電話 *
                  </label>
                  <input
                    v-model="formData.電話"
                    type="tel"
                    class="form-control"
                    required
                    placeholder="例: 0912-345-678"
                  />
                </div>

                <!-- Email -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-envelope me-2"></i>Email
                  </label>
                  <input
                    v-model="formData.email"
                    type="email"
                    class="form-control"
                    placeholder="例: customer@example.com"
                  />
                </div>

                <!-- 三圍 -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-rulers me-2"></i>三圍
                  </label>
                  <input
                    v-model="formData.三圍"
                    type="text"
                    class="form-control"
                    placeholder="例: 32B-24-35"
                  />
                </div>

                <!-- 承辦人 -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-person-badge me-2"></i>承辦人 *
                  </label>
                  <input
                    v-model="formData.承辦人"
                    type="text"
                    class="form-control"
                    required
                    placeholder="例: 林小姐"
                  />
                </div>

                <!-- 處理狀態 -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-flag me-2"></i>處理狀態 *
                  </label>
                  <select v-model="formData.處理狀態" class="form-select" required>
                    <option value="">請選擇狀態</option>
                    <option value="待確認">待確認</option>
                    <option value="已確認">已確認</option>
                    <option value="進行中">進行中</option>
                    <option value="已完成">已完成</option>
                    <option value="已取消">已取消</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 使用時間 -->
            <div class="mb-4">
              <h5 class="fw-semibold mb-3">
                <i class="bi bi-calendar-range me-2"></i>使用時間
              </h5>
              <div class="row g-3">
                <!-- 使用開始時間 -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-calendar-event me-2"></i>使用開始時間 *
                  </label>
                  <input
                    v-model="formData.使用開始時間"
                    type="datetime-local"
                    class="form-control"
                    required
                  />
                </div>

                <!-- 使用結束時間 -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-calendar-x me-2"></i>使用結束時間 *
                  </label>
                  <input
                    v-model="formData.使用結束時間"
                    type="datetime-local"
                    class="form-control"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- 禮服清單 -->
            <div class="mb-4">
              <h5 class="fw-semibold mb-3">
                <i class="bi bi-gem me-2"></i>禮服清單
              </h5>
              
              <!-- 禮服項目 -->
              <div class="border rounded p-3 mb-3" style="max-height: 300px; overflow-y: auto;">
                <div 
                  v-for="(item, index) in formData.禮服清單"
                  :key="index"
                  class="row g-2 align-items-center mb-2 pb-2 border-bottom"
                >
                  <div class="col-md-4">
                    <select 
                      v-model="item.禮服ID" 
                      class="form-select form-select-sm"
                      @change="updateDressPrice(index)"
                    >
                      <option value="">選擇禮服</option>
                      <option 
                        v-for="dress in availableDresses" 
                        :key="dress.id" 
                        :value="dress.id"
                      >
                        {{ dress.編號 }} - NT$ {{ (dress.租借金額 || dress.價格 || 0).toLocaleString() }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-2">
                    <input
                      v-model.number="item.數量"
                      type="number"
                      class="form-control form-control-sm"
                      min="1"
                      placeholder="數量"
                      @input="calculateSubtotal(index)"
                    />
                  </div>
                  <div class="col-md-2">
                    <input
                      v-model.number="item.單價"
                      type="number"
                      class="form-control form-control-sm"
                      min="0"
                      placeholder="單價"
                      @input="calculateSubtotal(index)"
                    />
                  </div>
                  <div class="col-md-2">
                    <input
                      :value="item.小計"
                      type="number"
                      class="form-control form-control-sm"
                      readonly
                      placeholder="小計"
                    />
                  </div>
                  <div class="col-md-2">
                    <button
                      type="button"
                      @click="removeDressItem(index)"
                      class="btn btn-outline-danger btn-sm"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
                
                <!-- 新增禮服項目按鈕 -->
                <button
                  type="button"
                  @click="addDressItem"
                  class="btn btn-outline-primary btn-sm"
                >
                  <i class="bi bi-plus me-2"></i>新增禮服
                </button>
              </div>

              <!-- 總金額顯示 -->
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-calculator me-2"></i>計算總金額
                  </label>
                  <input
                    :value="calculateTotal()"
                    type="number"
                    class="form-control"
                    readonly
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-cash me-2"></i>合約總金額 (NT$) *
                  </label>
                  <input
                    v-model.number="formData.合約總金額"
                    type="number"
                    class="form-control"
                    required
                    min="0"
                    placeholder="例: 50000"
                  />
                  <div class="form-text">可手動調整最終金額</div>
                </div>
              </div>
            </div>

            <!-- 備註 -->
            <div class="mb-3">
              <label class="form-label fw-semibold">
                <i class="bi bi-card-text me-2"></i>備註
              </label>
              <textarea
                v-model="formData.備注"
                class="form-control"
                rows="3"
                placeholder="合約相關備註或特殊說明..."
              ></textarea>
            </div>

            <!-- 新增時間戳 (顯示用，不可編輯) -->
            <div class="mb-3" v-if="formData.創建時間">
              <label class="form-label fw-semibold">
                <i class="bi bi-clock me-2"></i>建立時間
              </label>
              <input
                :value="formatTimestamp(formData.創建時間)"
                type="text"
                class="form-control"
                readonly
                disabled
              />
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
            :disabled="loading"
            class="btn btn-primary"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-check-lg me-2"></i>
            {{ loading ? "儲存中..." : "儲存" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dressService } from '../services/firestore.js';

export default {
  name: "ContractModal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    contract: {
      type: Object,
      default: null,
    },
  },
  emits: ["close", "save"],
  data() {
    return {
      loading: false,
      availableDresses: [],
      formData: {
        客戶姓名: "",
        電話: "",
        email: "",
        三圍: "",
        承辦人: "",
        使用開始時間: "",
        使用結束時間: "",
        處理狀態: "",
        禮服清單: [
          {
            禮服ID: "",
            數量: 1,
            單價: 0,
            小計: 0
          }
        ],
        合約總金額: 0,
        備注: "",
        創建時間: null,
      },
    };
  },
  async mounted() {
    await this.loadDresses();
  },
  watch: {
    contract: {
      immediate: true,
      handler(newContract) {
        if (newContract) {
          this.formData = {
            客戶姓名: newContract.客戶姓名 || "",
            電話: newContract.電話 || "",
            email: newContract.email || "",
            三圍: newContract.三圍 || "",
            承辦人: newContract.承辦人 || "",
            使用開始時間: this.formatDateTimeForInput(newContract.使用開始時間),
            使用結束時間: this.formatDateTimeForInput(newContract.使用結束時間),
            處理狀態: newContract.處理狀態 || "",
            禮服清單: newContract.禮服清單 ? [...newContract.禮服清單] : [
              { 禮服ID: "", 數量: 1, 單價: 0, 小計: 0 }
            ],
            合約總金額: newContract.合約總金額 || 0,
            備注: newContract.備注 || "",
            創建時間: newContract.創建時間 || null,
          };
        } else {
          this.resetForm();
        }
      },
    },
  },
  methods: {
    async loadDresses() {
      try {
        this.availableDresses = await dressService.getAll();
      } catch (error) {
        console.error('載入禮服清單失敗:', error);
      }
    },
    
    resetForm() {
      this.formData = {
        客戶姓名: "",
        電話: "",
        email: "",
        三圍: "",
        承辦人: "",
        使用開始時間: "",
        使用結束時間: "",
        處理狀態: "",
        禮服清單: [
          {
            禮服ID: "",
            數量: 1,
            單價: 0,
            小計: 0
          }
        ],
        合約總金額: 0,
        備注: "",
        創建時間: null,
      };
    },
    
    addDressItem() {
      this.formData.禮服清單.push({
        禮服ID: "",
        數量: 1,
        單價: 0,
        小計: 0
      });
    },
    
    removeDressItem(index) {
      if (this.formData.禮服清單.length > 1) {
        this.formData.禮服清單.splice(index, 1);
        this.updateTotalAmount();
      }
    },
    
    updateDressPrice(index) {
      const item = this.formData.禮服清單[index];
      const dress = this.availableDresses.find(d => d.id === item.禮服ID);
      if (dress) {
        item.單價 = dress.租借金額 || dress.價格 || 0;
        this.calculateSubtotal(index);
      }
    },
    
    calculateSubtotal(index) {
      const item = this.formData.禮服清單[index];
      item.小計 = (item.數量 || 0) * (item.單價 || 0);
      this.updateTotalAmount();
    },
    
    calculateTotal() {
      return this.formData.禮服清單.reduce((total, item) => {
        return total + (item.小計 || 0);
      }, 0);
    },
    
    updateTotalAmount() {
      this.formData.合約總金額 = this.calculateTotal();
    },
    
    async handleSubmit() {
      try {
        this.loading = true;
        
        // 驗證必填欄位
        if (!this.formData.客戶姓名 || !this.formData.電話 || 
            !this.formData.承辦人 || !this.formData.使用開始時間 ||
            !this.formData.使用結束時間 || !this.formData.處理狀態) {
          this.showToast('請填寫所有必填欄位', 'warning');
          return;
        }
        
        // 驗證時間
        if (new Date(this.formData.使用開始時間) >= new Date(this.formData.使用結束時間)) {
          this.showToast('使用結束時間必須晚於開始時間', 'warning');
          return;
        }
        
        // 驗證禮服清單
        const validDressItems = this.formData.禮服清單.filter(item => item.禮服ID && item.數量 > 0);
        if (validDressItems.length === 0) {
          this.showToast('請至少選擇一件禮服', 'warning');
          return;
        }
        
        // 準備提交的資料
        const submitData = { ...this.formData };
        
        // 轉換時間格式為 Firebase Timestamp
        submitData.使用開始時間 = new Date(this.formData.使用開始時間);
        submitData.使用結束時間 = new Date(this.formData.使用結束時間);
        
        // 過濾有效的禮服項目
        submitData.禮服清單 = validDressItems;
        
        // 如果是新增模式，生成合約單號和時間戳
        if (!this.contract || !this.contract.id) {
          const now = new Date();
          const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
          
          // 簡單的流水號生成（實際應該查詢當天的合約數量）
          const serialNumber = Math.floor(Math.random() * 999) + 1;
          submitData.合約單號 = `${dateStr}-${serialNumber.toString().padStart(3, '0')}`;
          submitData.合約建立日期時間 = now;
          submitData.創建時間 = now;
          submitData.更新時間 = now;
        } else {
          submitData.更新時間 = new Date();
        }
        
        this.$emit("save", submitData);
      } catch (error) {
        console.error('提交失敗:', error);
        this.showToast('提交失敗，請稍後再試', 'error');
      } finally {
        this.loading = false;
      }
    },
    
    formatDateTimeForInput(date) {
      if (!date) return "";
      
      let dateObj;
      if (date.toDate && typeof date.toDate === 'function') {
        dateObj = date.toDate();
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        dateObj = new Date(date);
      }
      
      // 格式化為 YYYY-MM-DDTHH:MM
      return dateObj.toISOString().slice(0, 16);
    },
    
    formatTimestamp(timestamp) {
      if (!timestamp) return "";
      
      let date;
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else {
        date = new Date(timestamp);
      }
      
      return date.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    },
    
    showToast(message, type = "info") {
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

<style scoped>
.modal {
  backdrop-filter: blur(4px);
}

.modal-dialog-scrollable .modal-body {
  max-height: calc(100vh - 200px);
}
</style>