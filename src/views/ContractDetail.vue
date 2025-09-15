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
              <h5 class="card-title mb-3">客戶資訊</h5>
              <div class="row g-3">
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">客戶姓名</small>
                    <strong class="text-dark">{{ contract.客戶姓名 }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">電話</small>
                    <strong class="text-dark">{{ contract.電話 }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6" v-if="contract.email">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">Email</small>
                    <strong class="text-dark">{{ contract.email }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6" v-if="contract.三圍">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">三圍</small>
                    <strong class="text-dark">{{ contract.三圍 }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">承辦人</small>
                    <strong class="text-dark">{{ contract.承辦人 }}</strong>
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
  </div>
</template>

<script>
import { contractService, dressService } from "../services/firestore.js";
import ContractModal from "../components/ContractModal.vue";
import DressDetailModal from "../components/DressDetailModal.vue";

export default {
  name: "ContractDetail",
  components: {
    ContractModal,
    DressDetailModal,
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
      selectedDress: null,
      availableDresses: [], // 用於顯示禮服資訊
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
        
        // 創建一個新的窗口來顯示可列印的合約
        const printWindow = window.open('', '_blank');
        
        // 生成HTML內容
        const htmlContent = this.generateContractHTML();
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // 等待內容載入完成
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 觸發列印對話框
        printWindow.print();
        
        // 列印完成後關閉窗口
        printWindow.onafterprint = () => {
          printWindow.close();
        };
        
        this.showToast("PDF列印視窗已開啟", "success");
        
      } catch (error) {
        console.error("PDF匯出失敗:", error);
        this.showToast("PDF匯出失敗，請稍後再試", "error");
      } finally {
        this.exportingPDF = false;
      }
    },

    generateContractHTML() {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>婚紗及配件租借合約書</title>
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              font-family: 'Microsoft JhengHei', 'PingFang TC', 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #000;
              margin: 0;
              padding: 0;
            }
            .contract-header {
              text-align: center;
              margin-bottom: 30px;
            }
            .contract-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .contract-info {
              margin-bottom: 20px;
            }
            .contract-info div {
              margin-bottom: 8px;
            }
            .clause-section {
              margin-bottom: 25px;
              page-break-inside: avoid;
            }
            .clause-title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 15px;
            }
            .red-text {
              color: #d32f2f;
              font-weight: bold;
            }
            .payment-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .payment-table th,
            .payment-table td {
              border: 1px solid #000;
              padding: 8px;
              text-align: center;
            }
            .payment-table th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .signature-section {
              display: flex;
              justify-content: space-between;
              margin-top: 40px;
              page-break-inside: avoid;
            }
            .signature-column {
              width: 45%;
            }
            .signature-column div {
              margin-bottom: 8px;
            }
            .date-section {
              text-align: center;
              margin-top: 30px;
              font-weight: bold;
            }
            hr {
              border: 1px solid #000;
              margin: 20px 0;
            }
            @media print {
              body { 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="contract-header">
            <h1 class="contract-title">婚紗及配件租借合約書</h1>
          </div>

          <div class="contract-info">
            <div><strong>單號：${this.contract.合約單號 || 'V250902'}</strong></div>
            <div><strong>出租人：</strong>雲云智略股份有限公司　　<strong>以下簡稱甲方</strong></div>
            <div><strong>承租人：</strong>${this.contract.客戶姓名 || '_______________'}　　<strong>以下簡稱乙方</strong></div>
          </div>

          <div style="margin-bottom: 25px; font-size: 14px;">
            <p>本契約條款甲方出租人應於簽約前，將契約內容充分向承租人說明，雙方確認訂書面契約後，始得同意之其他適當方式表示同意，以憑信守。本契約內容之新台幣金額皆為含稅金額。</p>
          </div>

          <hr />

          <div class="clause-section">
            <h3 class="clause-title">第一條 租借物件與租賃期間</h3>
            
            <div style="margin-bottom: 15px;">
              <strong>租借物件：</strong>
            </div>
            
            <div style="margin-left: 20px; margin-bottom: 15px;">
              <span>☑婚紗</span>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong>租借方案：</strong>
            </div>
            
            <div style="margin-left: 20px; margin-bottom: 15px;" class="red-text">
              ${this.getDressPackageInfo()}
            </div>
            
            <div style="margin-bottom: 10px;">
              <strong>款式：</strong>
            </div>
            
            <div style="margin-bottom: 10px;">
              <strong>配件：</strong><span class="red-text">可任選頭紗款式</span>
            </div>
            
            <div style="margin-bottom: 20px;">
              <strong>圖片：</strong>
            </div>

            <div style="margin-top: 30px;">
              <div class="red-text" style="margin-bottom: 10px;">
                <strong>總金額新台幣$${(this.contract.合約總金額 || 21000).toLocaleString()}元整租借期間：</strong>
              </div>
              
              <div style="margin-bottom: 8px;">
                <strong>取件時間：中華民國 ${this.formatDateForPDF(this.contract.租用開始時間, 'date')} 日</strong>
              </div>
              
              <div style="margin-bottom: 8px;">
                <strong>歸還時間：中華民國 ${this.formatDateForPDF(this.contract.租用結束時間, 'date')} 日</strong>
              </div>
              
              <div style="margin-bottom: 20px;">
                <strong>總計共 ${this.calculateRentalDays()} 檔期</strong>
              </div>

              <div style="font-size: 12px;">
                <p>*租借四天為一檔期，每增加一日，每件婚紗加收台幣1,000元，配件每件加收台幣300元。</p>
                <p>*取件與歸還應於週一至週五18:30前，遇休假日可提前或順延一日不予加價（特別預約日者除外）。</p>
              </div>
            </div>
          </div>

          <!-- 付款記錄表 -->
          <table class="payment-table">
            <thead>
              <tr>
                <th>付款別</th>
                <th>金額</th>
                <th>接待人員</th>
                <th>客戶簽名</th>
                <th>付款日期</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>拍攝定金</td>
                <td class="red-text">$4200</td>
                <td>${this.contract.承辦人 || 'Abby'}</td>
                <td>${this.contract.客戶姓名 || ''}</td>
                <td class="red-text">${this.formatDateForPDF(this.contract.創建時間, 'date')}</td>
              </tr>
              <tr>
                <td>拍攝尾款</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>宴客定金</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>宴客尾款</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <!-- 其他條款 -->
          <div class="clause-section">
            <h3 class="clause-title">第二條 租金/定金/押金</h3>
            <div style="margin-left: 20px; font-size: 14px;">
              <p><strong>• 租金</strong><br/>
              總計共新台幣<span class="red-text">$${(this.contract.合約總金額 || 21000).toLocaleString()}</span>元整（含稅），甲方需開立統一發票，乙方應於取件時將已付之定金金額扣支付。</p>
              
              <p><strong>• 定金</strong><br/>
              總計共新台幣<span class="red-text">$4200</span>元整，以現款支付。</p>
              
              <p><strong>• 押金</strong><br/>
              總計共新台幣<span class="red-text">$0</span>元整，以現金支付。</p>
            </div>
          </div>

          <!-- 立契約書人 -->
          <div style="page-break-before: auto; margin-top: 40px;">
            <h3 style="font-size: 16px; font-weight: bold; text-align: center; margin-bottom: 30px;">立契約書人</h3>
            
            <div class="signature-section">
              <div class="signature-column">
                <div><strong>出租人：雲云智略股份有限公司</strong></div>
                <div><strong>統一編號：52888231</strong></div>
                <div><strong>地址：台北市中山區中山北路二段16巷14號2樓</strong></div>
                <div><strong>聯絡電話：02-27196817</strong></div>
                <div style="margin-top: 30px;"><strong>簽章：</strong></div>
              </div>
              
              <div class="signature-column">
                <div><strong>承租人：${this.contract.客戶姓名 || ''}</strong></div>
                <div><strong>身分證字號：${this.contract.身分證號 || ''}</strong></div>
                <div><strong>地址：${this.contract.地址 || ''}</strong></div>
                <div><strong>聯絡電話：${this.contract.電話 || ''}</strong></div>
                <div style="margin-top: 30px;"><strong>簽章：${this.contract.客戶姓名 || ''}</strong></div>
              </div>
            </div>
            
            <div class="date-section">
              <p><strong>中華民國 ${this.formatDateForPDF(this.contract.創建時間, 'full')}</strong></p>
            </div>
          </div>
        </body>
        </html>
      `;
    },

    getDressPackageInfo() {
      if (!this.contract.禮服清單 || this.contract.禮服清單.length === 0) {
        return '蘇菲攝影套約1白2晚 $21000 - 2025.12.04拍攝使用';
      }
      
      const totalAmount = this.contract.合約總金額 || 21000;
      const packageInfo = this.contract.選擇方案 || '蘇菲攝影套約1白2晚';
      const shootDate = this.formatDateForPDF(this.contract.租用開始時間, 'dateOnly');
      
      return `${packageInfo} $${totalAmount.toLocaleString()} - ${shootDate}拍攝使用`;
    },

    calculateRentalDays() {
      if (!this.contract.租用開始時間 || !this.contract.租用結束時間) {
        return '1';
      }
      
      const startDate = new Date(this.contract.租用開始時間);
      const endDate = new Date(this.contract.租用結束時間);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return Math.max(1, diffDays).toString();
    },

    formatDateForPDF(date, format = 'date') {
      if (!date) return '';
      
      let dateObj;
      if (date.toDate && typeof date.toDate === 'function') {
        dateObj = date.toDate();
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        dateObj = new Date(date);
      }
      
      const year = dateObj.getFullYear() - 1911; // 民國年
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      
      switch (format) {
        case 'full':
          return `${year} 年 ${month.toString().padStart(2, '0')} 月 ${day.toString().padStart(2, '0')} 日`;
        case 'date':
          return `${year} 年 ${month} 月 ${day.toString().padStart(2, '0')}`;
        case 'dateOnly':
          return `${dateObj.getFullYear()}.${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}`;
        default:
          return `${year} 年 ${month} 月 ${day} 日`;
      }
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
