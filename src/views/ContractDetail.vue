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
      <p class="mt-2 text-muted" style="font-size: 14px;">載入中...</p>
    </div>

    <!-- 合約詳情 -->
    <div v-else-if="contract" class="row">
      <div class="col-12">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4">
            <!-- 1. 禮服圖卡 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">合約禮服</h5>

              <!-- 禮服圖卡網格 -->
              <div class="row g-3" v-if="contractDresses.length > 0">
                <div
                  v-for="(item, index) in contract.禮服清單"
                  :key="index"
                  class="col-lg-3 col-md-4 col-sm-6"
                >
                  <div
                    class="card h-100 shadow-sm border-0"
                    style="
                      cursor: pointer;
                      transition: transform 0.2s ease-in-out;
                    "
                    @click="showDressDetail(item.禮服ID)"
                    @mouseenter="showHoverEffect"
                    @mouseleave="hideHoverEffect"
                  >
                    <!-- 圖片 -->
                    <div
                      class="card-img-top position-relative"
                      style="height: 200px; overflow: hidden"
                    >
                      <img
                        v-if="getDressById(item.禮服ID)?.圖片?.[0]"
                        :src="getDressById(item.禮服ID).圖片[0]"
                        :alt="getDressById(item.禮服ID).編號"
                        class="w-100 h-100"
                        style="object-fit: contain; background-color: #f8f9fa"
                      />
                      <div
                        v-else
                        class="w-100 h-100 bg-light d-flex align-items-center justify-content-center"
                      >
                        <i
                          class="bi bi-image text-muted"
                          style="font-size: 2rem"
                        ></i>
                      </div>

                      <!-- 數量標籤 -->
                      <div class="position-absolute top-0 end-0 m-2">
                        <span class="badge bg-primary">{{ item.數量 }} 件</span>
                      </div>

                      <!-- 點擊提示 -->
                      <div
                        class="hover-tip position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-75 text-white text-center py-1"
                        style="opacity: 0; transition: opacity 0.2s"
                      >
                        <small
                          ><i class="bi bi-eye me-1"></i>點擊查看詳情</small
                        >
                      </div>
                    </div>

                    <!-- 卡片內容 -->
                    <div class="card-body">
                      <h6 class="card-title fw-bold mb-1">
                        {{ getDressById(item.禮服ID)?.編號 || item.禮服ID }}
                      </h6>
                      <p class="card-text text-muted small mb-0">
                        {{ getDressInfo(item.禮服ID) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 如果沒有禮服 -->
              <div v-else class="text-center py-4 bg-light rounded">
                <i class="bi bi-gem display-4 text-muted"></i>
                <p class="mt-2 text-muted">此合約尚未選擇禮服</p>
              </div>
            </div>

            <!-- 2. 合約單號 -->
            <div class="mb-4">
              <h5 class="card-title mb-2">合約單號</h5>
              <h2 class="text-primary fw-bold">{{ contract.合約單號 }}</h2>
            </div>

            <!-- 3. 客戶資訊 -->
            <div class="mb-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="card-title mb-0">客戶資訊</h5>
                <button @click="toggleEditMode" class="btn btn-sm btn-outline-primary">
                  <i :class="editMode ? 'bi bi-check-circle' : 'bi bi-pencil-square'" class="me-1"></i>
                  {{ editMode ? '儲存' : '編輯' }}
                </button>
              </div>
              <div class="row g-3">
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">客戶姓名</small>
                    <input 
                      v-if="editMode" 
                      v-model="editableContract.客戶姓名" 
                      type="text" 
                      class="form-control form-control-sm mt-1"
                      placeholder="請輸入客戶姓名"
                    />
                    <strong v-else class="text-dark">{{ contract.客戶姓名 || '未設定' }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">電話</small>
                    <input 
                      v-if="editMode" 
                      v-model="editableContract.電話" 
                      type="tel" 
                      class="form-control form-control-sm mt-1"
                      placeholder="請輸入電話號碼"
                    />
                    <strong v-else class="text-dark">{{ contract.電話 || '未設定' }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">Email</small>
                    <input 
                      v-if="editMode" 
                      v-model="editableContract.email" 
                      type="email" 
                      class="form-control form-control-sm mt-1"
                      placeholder="請輸入Email"
                    />
                    <strong v-else class="text-dark">{{ contract.email || '未設定' }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">身分證號</small>
                    <input 
                      v-if="editMode" 
                      v-model="editableContract.身分證號" 
                      type="text" 
                      class="form-control form-control-sm mt-1"
                      placeholder="請輸入身分證號"
                    />
                    <strong v-else class="text-dark">{{ contract.身分證號 || '未設定' }}</strong>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">地址</small>
                    <textarea 
                      v-if="editMode" 
                      v-model="editableContract.地址" 
                      class="form-control form-control-sm mt-1"
                      rows="2"
                      placeholder="請輸入地址"
                    ></textarea>
                    <strong v-else class="text-dark">{{ contract.地址 || '未設定' }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">三圍</small>
                    <input 
                      v-if="editMode" 
                      v-model="editableContract.三圍" 
                      type="text" 
                      class="form-control form-control-sm mt-1"
                      placeholder="例：32B/25/35"
                    />
                    <strong v-else class="text-dark">{{ contract.三圍 || '未設定' }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">承辦人</small>
                    <select 
                      v-if="editMode" 
                      v-model="editableContract.承辦人" 
                      class="form-select form-select-sm mt-1"
                    >
                      <option value="">請選擇承辦人</option>
                      <option value="Abby">Abby</option>
                      <option value="Jenny">Jenny</option>
                      <option value="Alice">Alice</option>
                      <option value="Cindy">Cindy</option>
                      <option value="Emma">Emma</option>
                    </select>
                    <strong v-else class="text-dark">{{ contract.承辦人 || '未設定' }}</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4. 租用時間 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">租用時間</h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="border rounded p-3">
                    <small class="text-muted d-block">租用開始時間</small>
                    <strong class="text-dark">{{
                      formatDateTime(contract.租用開始時間)
                    }}</strong>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="border rounded p-3">
                    <small class="text-muted d-block">租用結束時間</small>
                    <strong class="text-dark">{{
                      formatDateTime(contract.租用結束時間)
                    }}</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- 5. 金額詳情 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">金額詳情</h5>

              <div class="bg-white rounded p-3 shadow-sm">
                <div class="small text-muted">
                  <!-- 方案價格 (如果有選擇方案) -->
                  <div v-if="contract.選擇方案" class="d-flex justify-content-between">
                    <span>方案價格</span>
                    <span>NT$ {{ getContractPlanPrice().toLocaleString() }}</span>
                  </div>
                  
                  <!-- 禮服小計 -->
                  <div v-if="!contract.選擇方案" class="d-flex justify-content-between">
                    <span>禮服小計</span>
                    <span>NT$ {{ calculateContractDressTotal().toLocaleString() }}</span>
                  </div>
                  
                  <!-- 加價金額 (只在選擇方案時顯示) -->
                  <div v-if="contract.選擇方案 && getContractExtraAmount() > 0" class="d-flex justify-content-between text-warning">
                    <span>加價金額</span>
                    <span>+ NT$ {{ getContractExtraAmount().toLocaleString() }}</span>
                  </div>
                  
                  <!-- 小計 -->
                  <div class="d-flex justify-content-between">
                    <span>小計</span>
                    <span>NT$ {{ calculateContractTotal().toLocaleString() }}</span>
                  </div>
                  
                  <!-- 優惠折扣 -->
                  <div v-if="contract.折扣比例 && contract.折扣比例 < 1" class="d-flex justify-content-between text-success">
                    <span>折扣 ({{ Math.round((1 - (contract.折扣比例 || 1)) * 100) }}%)</span>
                    <span>- NT$ {{ getContractDiscountAmount().toLocaleString() }}</span>
                  </div>
                  
                  <!-- 合約總金額 -->
                  <div class="d-flex justify-content-between fw-bold text-primary border-top pt-2 mt-2">
                    <span>合約總金額</span>
                    <span>NT$ {{ contract.合約總金額?.toLocaleString() || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 6. 備註 -->
            <div class="mb-4" v-if="contract.備注">
              <h5 class="card-title mb-3">備註</h5>
              <div class="border rounded p-3">
                <p class="mb-0 text-dark" style="white-space: pre-wrap">
                  {{ contract.備注 }}
                </p>
              </div>
            </div>

            <!-- 7. 建立＆編輯時間 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">時間記錄</h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="border rounded p-3">
                    <small class="text-muted d-block">合約建立時間</small>
                    <strong class="text-dark">{{
                      formatDateTime(
                        contract.合約建立日期時間 || contract.創建時間
                      )
                    }}</strong>
                  </div>
                </div>
                <div class="col-md-6" v-if="contract.更新時間">
                  <div class="border rounded p-3">
                    <small class="text-muted d-block">最後編輯時間</small>
                    <strong class="text-dark">{{
                      formatDateTime(contract.更新時間)
                    }}</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- 操作按鈕 -->
            <div class="d-flex gap-3 justify-content-end mt-4 pt-3 border-top">
              <button @click="showTemplatePreview" class="btn btn-info">
                <i class="bi bi-eye me-2"></i>預覽模板
              </button>
              <button @click="exportToPDF" class="btn btn-success" :disabled="exportingPDF">
                <span v-if="exportingPDF" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i v-else class="bi bi-file-earmark-pdf me-2"></i>
                <span style="font-size: 14px;">{{ exportingPDF ? '匯出中...' : '匯出PDF' }}</span>
              </button>
              <button @click="editContract" class="btn btn-primary">
                <i class="bi bi-pencil-square me-2"></i>編輯合約
              </button>
              <button @click="deleteContract" class="btn btn-outline-danger" :disabled="deleting">
                <span v-if="deleting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i v-else class="bi bi-trash me-2"></i>
                <span style="font-size: 14px;">{{ deleting ? '刪除中...' : '刪除合約' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else class="text-center py-5">
      <i class="bi bi-file-text display-1 text-muted"></i>
      <h3 class="mt-3 text-muted">找不到合約</h3>
      <p class="mt-1 text-muted">該合約可能已被刪除或不存在</p>
      <div class="mt-4">
        <router-link to="/contracts" class="btn btn-primary">
          <i class="bi bi-arrow-left me-2"></i>返回合約清單
        </router-link>
      </div>
    </div>

    <!-- 編輯模態框 -->
    <ContractModal
      v-if="showEditModal"
      :show="showEditModal"
      :contract="contract"
      @close="showEditModal = false"
      @save="saveContract"
    />

    <!-- 禮服詳情 Popup -->
    <DressDetailModal
      v-if="showDressDetailModal"
      :show="showDressDetailModal"
      :dress="selectedDress"
      @close="closeDressDetail"
    />

    <!-- 合約模板預覽模態框 -->
    <div v-if="showTemplateModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">合約模板預覽</h5>
            <button type="button" class="btn-close" @click="closeTemplatePreview"></button>
          </div>
          <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
            <ContractTemplate
              v-if="contract"
              :contractData="contract"
              :dressData="availableDresses"
              :isEditable="true"
              @update-contract="handleContractUpdate"
            />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeTemplatePreview">關閉</button>
            <button type="button" class="btn btn-success" @click="exportToPDFFromPreview" :disabled="exportingPDF">
              <span v-if="exportingPDF" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <i v-else class="bi bi-file-earmark-pdf me-2"></i>
              {{ exportingPDF ? '匯出中...' : '匯出PDF' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { contractService, dressService } from "../services/firestore.js";
import ContractModal from "../components/ContractModal.vue";
import DressDetailModal from "../components/DressDetailModal.vue";
import ContractTemplate from "../components/Template.vue";
import html2pdf from "html2pdf.js";

export default {
  name: "ContractDetail",
  components: {
    ContractModal,
    DressDetailModal,
    ContractTemplate,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      contract: null,
      loading: true,
      deleting: false,
      saving: false,
      exportingPDF: false,
      showEditModal: false,
      showDressDetailModal: false,
      showTemplateModal: false,
      selectedDress: null,
      availableDresses: [], // 用於顯示禮服資訊
      editMode: false,
      editableContract: {},
    };
  },
  computed: {
    contractDresses() {
      if (!this.contract?.禮服清單) return [];
      return this.contract.禮服清單.map((item) => {
        const dress = this.getDressById(item.禮服ID);
        return {
          ...item,
          dress: dress,
        };
      });
    },
  },
  async mounted() {
    await this.loadDresses();
    await this.loadContract();
  },
  methods: {
    async loadDresses() {
      try {
        this.availableDresses = await dressService.getAll();
      } catch (error) {
        console.error("載入禮服清單失敗:", error);
      }
    },

    async loadContract() {
      try {
        this.loading = true;
        this.contract = await contractService.getById(this.id);
      } catch (error) {
        console.error("載入合約詳情失敗:", error);
        this.showToast("載入合約詳情失敗，請稍後再試", "error");
        this.contract = null;
      } finally {
        this.loading = false;
      }
    },

    getDressById(dressId) {
      return this.availableDresses.find((dress) => dress.id === dressId) || {};
    },

    getDressInfo(dressId) {
      const dress = this.getDressById(dressId);
      if (!dress.顏色) return "禮服資訊載入中...";
      return `${dress.顏色} | ${dress.裙型} | ${dress.袖型} | ${dress.領型}`;
    },

    showDressDetail(dressId) {
      const dress = this.getDressById(dressId);
      if (dress && dress.id) {
        this.selectedDress = dress;
        this.showDressDetailModal = true;
      } else {
        this.showToast("找不到禮服資訊", "warning");
      }
    },

    closeDressDetail() {
      this.showDressDetailModal = false;
      this.selectedDress = null;
    },

    showHoverEffect(event) {
      event.currentTarget.style.transform = "translateY(-2px)";
      const hoverTip = event.currentTarget.querySelector(".hover-tip");
      if (hoverTip) {
        hoverTip.style.opacity = "1";
      }
    },

    hideHoverEffect(event) {
      event.currentTarget.style.transform = "translateY(0)";
      const hoverTip = event.currentTarget.querySelector(".hover-tip");
      if (hoverTip) {
        hoverTip.style.opacity = "0";
      }
    },

    editContract() {
      this.showEditModal = true;
    },

    async deleteContract() {
      if (
        !confirm(
          `確定要刪除合約 "${this.contract.合約單號}" 嗎？\n\n此操作無法復原！`
        )
      ) {
        return;
      }

      try {
        this.deleting = true;
        await contractService.delete(this.contract.id);
        this.showToast("合約已刪除", "success");

        // 延遲跳轉，讓用戶看到成功訊息
        setTimeout(() => {
          this.$router.push("/contracts");
        }, 1500);
      } catch (error) {
        console.error("刪除合約失敗:", error);
        this.showToast("刪除合約失敗，請稍後再試", "error");
      } finally {
        this.deleting = false;
      }
    },

    async saveContract(contractData) {
      try {
        await contractService.update(this.contract.id, contractData);
        this.showToast("合約已更新", "success");
        await this.loadContract();
        this.showEditModal = false;
      } catch (error) {
        console.error("更新合約失敗:", error);
        this.showToast("更新合約失敗，請稍後再試", "error");
      }
    },

    formatDateTime(date) {
      if (!date) return "未設定";

      let dateObj;
      if (date.toDate && typeof date.toDate === "function") {
        dateObj = date.toDate();
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        dateObj = new Date(date);
      }

      return dateObj.toLocaleString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },

    // 計算合約方案價格
    getContractPlanPrice() {
      if (!this.contract.選擇方案) return 0;
      // 簡單的價格對照表，可以根據需要擴展
      const planPrices = {
        "攝影_一日一晚": 15000,
        "攝影_一日二晚": 21000,
        "攝影_二日一晚": 24000,
        "攝影_二日四晚": 42000,
        "攝影_二日": 18000,
        "宴客_一日一晚": 25000,
        "宴客_一日二晚": 35000,
      };
      return planPrices[this.contract.選擇方案] || 0;
    },

    // 計算合約禮服小計
    calculateContractDressTotal() {
      if (!this.contract.禮服清單) return 0;
      return this.contract.禮服清單.reduce((total, item) => {
        return total + (item.小計 || 0);
      }, 0);
    },

    // 計算合約加價金額
    getContractExtraAmount() {
      if (!this.contract.選擇方案 || !this.contract.禮服清單) return 0;
      return this.contract.禮服清單.reduce((total, item) => {
        const dress = this.getDressById(item.禮服ID);
        const extraAmount = dress?.加價金額 || 0;
        return total + extraAmount;
      }, 0);
    },

    // 計算合約總計（未折扣）
    calculateContractTotal() {
      if (this.contract.選擇方案) {
        const planPrice = this.getContractPlanPrice();
        const extraAmount = this.getContractExtraAmount();
        return planPrice + extraAmount;
      } else {
        return this.calculateContractDressTotal();
      }
    },

    // 計算合約折扣金額
    getContractDiscountAmount() {
      const originalTotal = this.calculateContractTotal();
      const discountRate = 1 - (this.contract.折扣比例 || 1);
      return Math.round(originalTotal * discountRate);
    },

    async exportToPDF() {
      try {
        this.exportingPDF = true;
        
        // 創建一個隱藏的容器來渲染合約模板
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        tempContainer.style.width = '210mm'; // A4寬度
        tempContainer.style.fontFamily = 'Microsoft JhengHei, PingFang TC, sans-serif';
        document.body.appendChild(tempContainer);

        // 使用Vue的createApp來渲染模板組件
        const { createApp } = await import('vue');
        const templateApp = createApp(ContractTemplate, {
          contractData: this.contract,
          dressData: this.availableDresses,
          isEditable: false
        });
        
        templateApp.mount(tempContainer);
        
        // 等待組件渲染完成
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // PDF生成選項
        const opt = {
          margin: [10, 10, 10, 10],
          filename: `合約_${this.contract.合約單號}_${this.contract.客戶姓名}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            allowTaint: true,
            letterRendering: true
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
          }
        };

        // 生成PDF
        await html2pdf().set(opt).from(tempContainer).save();
        
        // 清理臨時容器
        templateApp.unmount();
        document.body.removeChild(tempContainer);
        
        this.showToast("PDF已下載", "success");
        
      } catch (error) {
        console.error("PDF匯出失敗:", error);
        this.showToast("PDF匯出失敗，請稍後再試", "error");
      } finally {
        this.exportingPDF = false;
      }
    },

    // 顯示模板預覽
    showTemplatePreview() {
      this.showTemplateModal = true;
    },

    // 關閉模板預覽
    closeTemplatePreview() {
      this.showTemplateModal = false;
    },

    // 處理合約更新（從模板組件來的更新）
    async handleContractUpdate(updateData) {
      try {
        await contractService.update(this.contract.id, updateData);
        this.contract = { ...this.contract, ...updateData };
        this.showToast("合約已更新", "success");
      } catch (error) {
        console.error("更新合約失敗:", error);
        this.showToast("更新合約失敗，請稍後再試", "error");
      }
    },

    // 從預覽模式匯出PDF
    async exportToPDFFromPreview() {
      await this.exportToPDF();
    },

    // 切換編輯模式
    async toggleEditMode() {
      if (this.editMode) {
        // 儲存模式
        await this.saveEditableContract();
      } else {
        // 進入編輯模式
        this.editableContract = { ...this.contract };
        this.editMode = true;
      }
    },

    // 儲存可編輯的合約資料
    async saveEditableContract() {
      try {
        this.saving = true;
        
        // 過濾掉空值
        const updateData = {};
        Object.keys(this.editableContract).forEach(key => {
          if (this.editableContract[key] !== null && this.editableContract[key] !== '') {
            updateData[key] = this.editableContract[key];
          }
        });
        
        await contractService.update(this.contract.id, updateData);
        this.contract = { ...this.contract, ...updateData };
        this.editMode = false;
        this.showToast("客戶資訊已更新", "success");
        
      } catch (error) {
        console.error("更新客戶資訊失敗:", error);
        this.showToast("更新客戶資訊失敗，請稍後再試", "error");
      } finally {
        this.saving = false;
      }
    },

    // 取消編輯模式
    cancelEdit() {
      this.editMode = false;
      this.editableContract = {};
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
/* Styles for contract detail page */
</style>
