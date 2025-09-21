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
            <!-- 1. 合約單號 -->
            <div class="mb-4">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="card-title mb-0">合約單號</h5>
                <!-- 操作按鈕群組 -->
                <div class="d-flex gap-2">
                  <button @click="showTemplatePreview" class="btn btn-sm btn-info" style="font-size: 12px;">
                    <i class="bi bi-eye me-1"></i>預覽模板
                  </button>
                  <button @click="exportToPDFDirect" class="btn btn-sm btn-success" :disabled="exportingPDF" style="font-size: 12px;">
                    <span v-if="exportingPDF" class="spinner-border spinner-border-sm me-1" role="status"></span>
                    <i v-else class="bi bi-file-earmark-pdf me-1"></i>
                    <span>{{ exportingPDF ? '匯出中...' : '匯出PDF' }}</span>
                  </button>
                  <button @click="editContract" class="btn btn-sm btn-primary" style="font-size: 12px;">
                    <i class="bi bi-pencil-square me-1"></i>編輯合約
                  </button>
                  <button @click="deleteContract" class="btn btn-sm btn-outline-danger" :disabled="deleting" style="font-size: 12px;">
                    <span v-if="deleting" class="spinner-border spinner-border-sm me-1" role="status"></span>
                    <i v-else class="bi bi-trash me-1"></i>
                    <span>{{ deleting ? '刪除中...' : '刪除合約' }}</span>
                  </button>
                </div>
              </div>
              <h4 class="text-primary fw-bold my-4">{{ contract.合約單號 }}</h4>
            </div>

            <!-- 2. 合約禮服 -->
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

            <!-- 3. 租用時間 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">租用時間</h5>
              <div class="row p-3">
                <p class="small text-muted">開始時間 : 
                  <span class="text-decoration-underline">
                  {{
                      formatDateTime(contract.租用開始時間)
                    }}

</span>
</p>
                    <p class="small text-muted">結束時間 : 
                      <span class="text-decoration-underline">

                        {{
                          formatDateTime(contract.租用結束時間)
                        }}
                        </span>
                    
                  </p>
              
              </div>
            </div>

            <!-- 4. 客戶資訊 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">客戶資訊</h5>
              <div class="row p-3">
                <p class="small text-muted">客戶姓名 : {{ contract.客戶姓名 || '' }}</p>
                <p class="small text-muted">電話 : {{ contract.電話 || '' }}</p>
                <p class="small text-muted">Email : {{ contract.email || '' }}</p>
                <p class="small text-muted">身分證號 : {{ contract.身分證號 || '' }}</p>
                <p class="small text-muted">地址 : {{ contract.地址 || '' }}</p>
                <p class="small text-muted">三圍 : {{ contract.三圍 || '' }}</p>
                <div v-if="contract.客戶簽名">
                  <p class="small text-muted">客戶簽名 :</p>
                  <img :src="contract.客戶簽名" alt="客戶簽名" class="signature-image ms-3" />
                </div>
              </div>
            </div>

            <!-- 5. 承辦人＆押金 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">承辦人＆押金</h5>
              <div class="row p-3">
                <p class="small text-muted">承辦人 : {{ contract.承辦人 || '' }}</p>
                <p class="small text-muted">押金金額 : 
                      <span v-if="contract.押金">NT$ {{ contract.押金.toLocaleString() }}</span>
                  <span v-else>NT$ 0</span>
                </p>
                  </div>
                </div>

            <!-- 6. 租借方案 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">租借方案</h5>
              <div class="row p-3">
                <p class="small text-muted">選擇方案 : {{ contract.選擇方案 || '' }}</p>
                <p class="small text-muted">選擇配件 : {{ getContractAccessoryFullLabel() || '' }}</p>
                <p class="small text-muted">折扣比例 : {{ contract.折扣比例 ? Math.round((1 - contract.折扣比例) * 100) + '% 折扣' : '無折扣' }}</p>
              </div>
            </div>

            <!-- 7. 金額詳情 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">金額詳情</h5>

              <div class="p-3">
                <div class="small text-muted" style="line-height: 1.8;">
                  <!-- 方案價格 (如果有選擇方案) -->
                  <div v-if="contract.選擇方案" class="d-flex justify-content-between mb-2">
                    <span>方案價格</span>
                    <span>NT$ {{ getContractPlanPrice().toLocaleString() }}</span>
                  </div>
                  
                  <!-- 禮服小計 -->
                  <div v-if="!contract.選擇方案" class="d-flex justify-content-between mb-2">
                    <span>禮服小計</span>
                    <span>NT$ {{ calculateContractDressTotal().toLocaleString() }}</span>
                  </div>
                  
                  <!-- 方案折扣 (只折扣方案價格) -->
                  <div v-if="contract.選擇方案 && contract.折扣比例 && contract.折扣比例 < 1" class="d-flex justify-content-between mb-2">
                    <span>方案折扣 ({{ Math.round((1 - (contract.折扣比例 || 1)) * 100) }}%)</span>
                    <span>- NT$ {{ getContractDiscountAmount().toLocaleString() }}</span>
                        </div>
                        
                  <!-- 禮服折扣 (沒有方案時) -->
                  <div v-if="!contract.選擇方案 && contract.折扣比例 && contract.折扣比例 < 1" class="d-flex justify-content-between mb-2">
                    <span>禮服折扣 ({{ Math.round((1 - (contract.折扣比例 || 1)) * 100) }}%)</span>
                    <span>- NT$ {{ getContractDiscountAmount().toLocaleString() }}</span>
                  </div>
                  
                  <!-- 加價金額 (不折扣) -->
                  <div v-if="contract.選擇方案 && getContractExtraAmount() > 0" class="d-flex justify-content-between mb-2">
                    <span>加價金額 (不折扣)</span>
                    <span>+ NT$ {{ getContractExtraAmount().toLocaleString() }}</span>
                  </div>
                  
                  <!-- 配件金額 (不折扣) -->
                  <div v-if="getContractAccessoryAmount() > 0" class="d-flex justify-content-between mb-2">
                    <span>配件金額 (不折扣)</span>
                    <span>+ NT$ {{ getContractAccessoryAmount().toLocaleString() }}</span>
                  </div>
                  
                  <!-- 合約總金額 -->
                  <div class="d-flex justify-content-between border-top pt-2 mt-2">
                    <span>合約總金額</span>
                    <span>NT$ {{ (contract.合約總金額 || 0).toLocaleString() }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 7. 付款記錄 -->
            <div class="mb-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="card-title mb-0">付款記錄</h5>
                <div class="d-flex gap-2">
                  <button
                    v-if="editMode"
                    @click="addPaymentRow"
                    class="btn btn-sm btn-outline-primary"
                  >
                    <i class="bi bi-plus-lg me-1"></i>新增付款記錄
                  </button>
                  <button @click="toggleEditMode" class="btn btn-sm btn-outline-primary">
                    <i :class="editMode ? 'bi bi-check-circle' : 'bi bi-pencil-square'" class="me-1"></i>
                    {{ editMode ? '儲存' : '編輯' }}
                  </button>
                </div>
              </div>
              
              <div class="table-responsive">
                <table class="table table-bordered">
                  <thead class="table-light">
                    <tr>
                      <th class="small text-muted">付款別</th>
                      <th class="small text-muted">金額</th>
                      <th class="small text-muted">接待人員</th>
                      <th class="small text-muted">客戶簽名</th>
                      <th class="small text-muted">付款日期</th>
                      <th v-if="editMode" class="small text-muted" style="width: 80px;">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(payment, index) in (editMode ? editableContract.付款記錄 : contract.付款記錄 || [])" :key="index">
                      <td>
                        <select
                          v-if="editMode"
                          v-model="payment.付款別"
                          class="form-select form-select-sm"
                        >
                          <option value="">請選擇</option>
                          <option value="拍攝定金">拍攝定金</option>
                          <option value="拍攝尾款">拍攝尾款</option>
                          <option value="宴客定金">宴客定金</option>
                          <option value="宴客尾款">宴客尾款</option>
                          <option value="其他">其他</option>
                        </select>
                        <span v-else class="small text-muted">{{ payment.付款別 || '-' }}</span>
                      </td>
                      <td>
                        <div v-if="editMode" class="payment-amount-column">
                          <select
                            v-model="payment.金額百分比"
                            @change="calculatePaymentAmount(index)"
                            class="form-select form-select-sm mb-2"
                          >
                            <option value="">選擇%</option>
                            <option v-for="percent in [10,20,30,40,50,60,70,80,90,100]" :key="percent" :value="percent">
                              {{ percent }}%
                            </option>
                          </select>
                          <div class="input-group">
                            <span class="input-group-text">$</span>
                            <input
                              v-model.number="payment.金額"
                              type="number"
                              class="form-control form-control-sm"
                              placeholder="0"
                              min="0"
                              readonly
                            />
                          </div>
                        </div>
                        <div v-else class="payment-amount-display">
                          <div v-if="payment.金額百分比" >
                            <span v-if="payment.金額" class="small text-muted ms-3">NT$ {{ payment.金額.toLocaleString() }}</span>
                            <span class="small text-muted"> ({{ payment.金額百分比 }}%)</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="staff-display text-center">
                          <span class="small text-muted">{{ payment.接待人員 || contract.承辦人 || '-' }}</span>
                        </div>
                      </td>
                      <td class="text-center">
                        <div v-if="contract.客戶簽名 || editableContract.客戶簽名" class="signature-display">
                          <img :src="contract.客戶簽名 || editableContract.客戶簽名" alt="客戶簽名" class="detail-signature-image" />
                        </div>
                        <span v-else class="small text-muted">-</span>
                      </td>
                      <td>
                        <input
                          v-if="editMode"
                          v-model="payment.付款日期"
                          type="date"
                          class="form-control form-control-sm"
                        />
                        <span v-else class="small text-muted">{{ formatPaymentDate(payment.付款日期) || '-' }}</span>
                      </td>
                      <td v-if="editMode">
                        <button
                          type="button"
                          @click="removePaymentRow(index)"
                          class="btn btn-sm btn-outline-danger"
                          :title="'移除第' + (index + 1) + '個付款記錄'"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr v-if="(!contract.付款記錄 || contract.付款記錄.length === 0) && !editMode">
                      <td colspan="5" class="text-center py-3">
                        <span class="small text-muted"><i class="bi bi-credit-card me-2"></i>尚未新增付款記錄</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 8. 備註詳情 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">備註詳情</h5>
              <div class="row p-3">
                <p v-if="contract.備注" class="small text-muted" style="white-space: pre-wrap"> {{ contract.備注 }}</p>
                <p v-else class="small text-muted">備註 : </p>
              </div>
            </div>

            <!-- 9. 時間記錄 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">時間記錄</h5>
              <div class="row p-3">
                <p class="small text-muted">建立時間 : {{ formatDateTime(contract.合約建立日期時間 || contract.創建時間) }}</p>
                <p v-if="contract.更新時間" class="small text-muted">更新時間 : {{ formatDateTime(contract.更新時間) }}</p>
              </div>
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
              :templateSettings="getTemplateSettings()"
              :isEditable="true"
              @update-contract="handleContractUpdate"
            />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeTemplatePreview">關閉</button>
          </div>
        </div>
      </div>
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

</template>

<script>
import { contractService, dressService } from "../services/firestore.js";
import { optionsService } from "../services/options.js";
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
      showDressDetailModal: false,
      showTemplateModal: false,
      selectedDress: null,
      availableDresses: [], // 用於顯示禮服資訊
      editMode: false, // 保留全域編輯模式（用於付款記錄）
      editableContract: {},
      planPrices: {}, // 方案價格對照表
      packagesByCategory: {}, // 分類方案資料
      accessoriesByCategory: {}, // 分類配件資料
      showEditModal: false, // 控制編輯模態框
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
    this.loadPackageOptions(); // 載入方案和配件選項
    await this.loadContract();
  },
  methods: {
    loadPackageOptions() {
      try {
        this.packagesByCategory = optionsService.getPackagesByCategory();
        this.planPrices = optionsService.getPackagePrices();
        this.loadAccessoryOptions();
        console.log('載入方案選項:', {
          packagesByCategory: this.packagesByCategory,
          planPrices: this.planPrices,
          accessoriesByCategory: this.accessoriesByCategory
        });
      } catch (error) {
        console.error('載入方案選項失敗:', error);
      }
    },

    loadAccessoryOptions() {
      try {
        const accessories = optionsService.getAccessoryOptions();
        const categorized = {};
        accessories.forEach(accessory => {
          if (!categorized[accessory.category]) {
            categorized[accessory.category] = [];
          }
          categorized[accessory.category].push(accessory);
        });
        this.accessoriesByCategory = categorized;
      } catch (error) {
        console.error('載入配件選項失敗:', error);
      }
    },

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
        console.log('合約數據載入完成:', {
          合約ID: this.id,
          合約數據: this.contract,
          選擇方案: this.contract?.選擇方案,
          折扣比例: this.contract?.折扣比例,
          選擇配件: this.contract?.選擇配件,
          禮服清單: this.contract?.禮服清單,
          合約總金額: this.contract?.合約總金額
        });
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


    formatDateTime(date) {
      if (!date) return "";

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
      if (!this.contract?.選擇方案) return 0;
      // 如果合約中有儲存方案價格，使用合約中的價格
      if (this.contract.方案價格) {
        return this.contract.方案價格;
      }
      // 否則使用當前價格設定（向後兼容）
      const price = this.planPrices[this.contract.選擇方案] || 0;
      return price;
    },

    // 計算合約禮服小計
    calculateContractDressTotal() {
      if (!this.contract?.禮服清單) return 0;
      const total = this.contract.禮服清單.reduce((total, item) => {
        return total + (item.小計 || 0);
      }, 0);
      console.log('合約禮服小計計算:', {
        禮服清單: this.contract.禮服清單,
        總計: total
      });
      return total;
    },

    // 計算合約加價金額
    getContractExtraAmount() {
      if (!this.contract?.選擇方案 || !this.contract?.禮服清單) return 0;
      const total = this.contract.禮服清單.reduce((total, item) => {
        // 只使用合約中儲存的加價金額，不使用當前禮服資料庫的價格
        const extraAmount = item.加價金額 || 0;
        return total + extraAmount;
      }, 0);
      return total;
    },

    // 計算合約總計（未折扣，不含配件）
    calculateContractTotal() {
      let total = 0;
      
      if (this.contract.選擇方案) {
        // 方案價格（會被折扣）
        const planPrice = this.getContractPlanPrice();
        total = planPrice;
      } else {
        // 禮服金額（會被折扣）
        total = this.calculateContractDressTotal();
      }
      
      return total;
    },

    // 計算合約最終總額（含折扣和配件）
    getContractFinalAmount() {
      let total = 0;
      
      if (this.contract.選擇方案) {
        // 方案價格進行折扣
        const planPrice = this.getContractPlanPrice();
      const discountRate = this.contract.折扣比例 || 1;
        const discountedPlanPrice = Math.round(planPrice * discountRate);
        
        // 加價金額不折扣
        const extraAmount = this.getContractExtraAmount();
        
        total = discountedPlanPrice + extraAmount;
      } else {
        // 沒有選擇方案，禮服金額進行折扣
        const dressTotal = this.calculateContractDressTotal();
        const discountRate = this.contract.折扣比例 || 1;
        total = Math.round(dressTotal * discountRate);
      }
      
      // 配件金額不折扣，直接加上
      const accessoryAmount = this.getContractAccessoryAmount();
      
      return total + accessoryAmount;
    },

    // 獲取合約配件名稱
    getContractAccessoryName() {
      if (!this.contract.選擇配件) return '';
      
      try {
        const saved = localStorage.getItem('velvethour_options');
        if (saved) {
          const options = JSON.parse(saved);
          const accessories = options.accessories || [];
          const selectedAccessory = accessories.find(acc => acc.value === this.contract.選擇配件);
          return selectedAccessory?.accessoryName || '';
        }
      } catch (error) {
        console.error('載入配件選項失敗:', error);
      }
      return '';
    },

    // 獲取合約配件完整標籤
    getContractAccessoryFullLabel() {
      if (!this.contract.選擇配件) return '';
      
      try {
        const saved = localStorage.getItem('velvethour_options');
        if (saved) {
          const options = JSON.parse(saved);
          const accessories = options.accessories || [];
          const selectedAccessory = accessories.find(acc => acc.value === this.contract.選擇配件);
          
          if (selectedAccessory) {
            // 直接使用已經格式化好的 label，因為它已經包含了完整的資訊
            return selectedAccessory.label || selectedAccessory.accessoryName || '';
          }
        }
      } catch (error) {
        console.error('載入配件選項失敗:', error);
      }
      return '';
    },

    // 計算合約配件金額
    getContractAccessoryAmount() {
      if (!this.contract?.選擇配件) return 0;
      
      // 如果合約中有儲存配件價格，使用合約中的價格
      if (this.contract.配件價格 !== undefined) {
        return this.contract.配件價格;
      }
      
      // 否則從預載入的配件資料中查找（向後兼容）
      const allAccessories = Object.values(this.accessoriesByCategory).flat();
      const selectedAccessory = allAccessories.find(acc => acc.value === this.contract.選擇配件);
      const price = selectedAccessory?.accessoryPrice || 0;
      
      return price;
    },

    // 計算合約折扣金額
    getContractDiscountAmount() {
      if (!this.contract) return 0;
      
      let discountAmount = 0;
      const discountRate = 1 - (this.contract.折扣比例 || 1);
      
      if (this.contract.選擇方案) {
        // 方案折扣
        const planPrice = this.getContractPlanPrice();
        discountAmount = Math.round(planPrice * discountRate);
      } else {
        // 禮服折扣
        const dressTotal = this.calculateContractDressTotal();
        discountAmount = Math.round(dressTotal * discountRate);
      }
      
      return discountAmount;
    },


    async exportToPDF() {
      try {
        this.exportingPDF = true;
        
        console.log('開始PDF匯出...', {
          合約資料: this.contract,
          禮服資料: this.availableDresses?.length
        });
        
        // 創建一個隱藏的容器來渲染合約模板
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        tempContainer.style.width = '210mm'; // A4寬度
        tempContainer.style.fontFamily = 'Microsoft JhengHei, PingFang TC, sans-serif';
        tempContainer.style.backgroundColor = 'white';
        tempContainer.style.padding = '20px';
        document.body.appendChild(tempContainer);

        // 載入模板設定
        const templateSettings = this.getTemplateSettings();
        console.log('模板設定:', templateSettings);
        
        // 直接複製現有的模板預覽內容
        const existingTemplate = document.querySelector('.template-preview-container .contract-container');
        if (existingTemplate) {
          // 複製現有模板的HTML
          tempContainer.innerHTML = existingTemplate.outerHTML;
          console.log('使用現有模板內容');
        } else {
          // 如果沒有現有模板，使用Vue渲染
        const { createApp } = await import('vue');
        const templateApp = createApp(ContractTemplate, {
          contractData: this.contract,
          dressData: this.availableDresses,
            templateSettings: templateSettings,
          isEditable: false
        });
        
        templateApp.mount(tempContainer);
        
        // 等待組件渲染完成
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // 清理Vue實例
          templateApp.unmount();
        }
        
        console.log('渲染完成，檢查容器內容:', {
          innerHTML長度: tempContainer.innerHTML.length,
          有內容: tempContainer.innerHTML.length > 100,
          子元素數量: tempContainer.children.length
        });
        
        // 如果容器為空，顯示錯誤
        if (tempContainer.innerHTML.length < 100) {
          throw new Error('模板渲染失敗，容器內容為空');
        }
        
        // PDF生成選項
        const opt = {
          margin: [10, 10, 10, 10],
          filename: `合約_${this.contract.合約單號}_${this.contract.客戶姓名}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 1.5,
            useCORS: true,
            allowTaint: true,
            letterRendering: true,
            backgroundColor: '#ffffff'
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
          }
        };

        console.log('開始生成PDF...');

        // 生成PDF
        await html2pdf().set(opt).from(tempContainer).save();
        
        console.log('PDF生成完成');
        
        // 清理臨時容器
        document.body.removeChild(tempContainer);
        
        this.showToast("PDF已下載", "success");
        
      } catch (error) {
        console.error("PDF匯出失敗:", error);
        this.showToast(`PDF匯出失敗：${error.message}`, "error");
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

    // 使用瀏覽器列印功能匯出PDF
    async exportToPDFDirect() {
      try {
        this.exportingPDF = true;
        
        // 創建新視窗用於列印
        const printWindow = window.open('', '_blank');
        
        // 載入模板設定
        const templateSettings = this.getTemplateSettings();
        
        // 構建完整的HTML內容
        const htmlContent = this.generatePrintHTML(templateSettings);
        
        // 寫入HTML內容
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // 等待圖片載入完成
        await new Promise(resolve => {
          printWindow.onload = () => {
            setTimeout(resolve, 1000);
          };
          // 備用計時器
          setTimeout(resolve, 3000);
        });
        
        // 觸發列印
        printWindow.print();
        
        // 列印完成後關閉視窗
        printWindow.addEventListener('afterprint', () => {
          printWindow.close();
        });
        
        this.showToast("列印視窗已開啟", "success");
        
      } catch (error) {
        console.error("PDF匯出失敗:", error);
        this.showToast(`PDF匯出失敗：${error.message}`, "error");
      } finally {
        this.exportingPDF = false;
      }
    },

    // 從預覽模式匯出PDF
    async exportToPDFFromPreview() {
      try {
        // 找到模態框中的合約模板
        const modalTemplate = document.querySelector('.modal .contract-container');
        if (!modalTemplate) {
          throw new Error('找不到模板內容');
        }
        
        console.log('從預覽模態框匯出PDF...');
        
        // PDF生成選項
        const opt = {
          margin: [10, 10, 10, 10],
          filename: `合約_${this.contract.合約單號}_${this.contract.客戶姓名}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 1.5,
            useCORS: true,
            allowTaint: true,
            letterRendering: true,
            backgroundColor: '#ffffff'
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
          }
        };

        // 生成PDF
        await html2pdf().set(opt).from(modalTemplate).save();
        
        this.showToast("PDF已下載", "success");
        
      } catch (error) {
        console.error("從預覽匯出PDF失敗:", error);
        this.showToast(`PDF匯出失敗：${error.message}`, "error");
      }
    },


    // 切換編輯模式（保留給付款記錄使用）
    async toggleEditMode() {
      if (this.editMode) {
        // 儲存模式
        await this.saveEditableContract();
      } else {
        // 進入編輯模式
        this.editableContract = { 
          ...this.contract,
          付款記錄: this.contract.付款記錄 ? [...this.contract.付款記錄] : []
        };
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



    // 處理簽名編輯
    handleSignatureEdit(event) {
      const file = event.target.files[0];
      if (file) {
        // 檢查文件大小 (限制為 5MB)
        if (file.size > 5 * 1024 * 1024) {
          this.showToast("圖片檔案不能超過 5MB", "warning");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          this.editableContract.客戶簽名 = e.target.result;
          this.showToast("客戶簽名已更新", "success");
        };
        reader.readAsDataURL(file);
      }
    },

    // 新增付款記錄列
    addPaymentRow() {
      if (!this.editableContract.付款記錄) {
        this.editableContract.付款記錄 = [];
      }
      
      // 獲取今天的日期（YYYY-MM-DD格式）
      const today = new Date().toISOString().split('T')[0];
      
      this.editableContract.付款記錄.push({
        付款別: "",
        金額: 0,
        金額百分比: "",
        接待人員: this.contract.承辦人 || "",
        付款日期: today
      });
    },

    // 計算付款金額（根據百分比）
    calculatePaymentAmount(index) {
      const payment = this.editableContract.付款記錄[index];
      if (payment.金額百分比 && this.contract.合約總金額) {
        payment.金額 = Math.round((this.contract.合約總金額 * payment.金額百分比) / 100);
      } else if (!payment.金額百分比) {
        payment.金額 = 0;
      }
    },

    // 移除付款記錄列
    removePaymentRow(index) {
      if (this.editableContract.付款記錄 && index >= 0 && index < this.editableContract.付款記錄.length) {
        this.editableContract.付款記錄.splice(index, 1);
        this.showToast("已移除付款記錄", "info");
      }
    },

    // 獲取模板設定
    getTemplateSettings() {
      try {
        const saved = localStorage.getItem('contractTemplateSettings');
        return saved ? JSON.parse(saved) : {};
      } catch (error) {
        console.error('載入模板設定失敗:', error);
        return {};
      }
    },

    // 生成列印用的HTML內容
    generatePrintHTML(templateSettings) {
      const contract = this.contract;
      const dresses = this.availableDresses;
      
      // 格式化日期的輔助函數
      const formatDate = (date) => {
        if (!date) return '';
        let dateObj;
        if (date.toDate && typeof date.toDate === "function") {
          dateObj = date.toDate();
        } else if (date instanceof Date) {
          dateObj = date;
        } else {
          dateObj = new Date(date);
        }
        const year = dateObj.getFullYear() - 1911; // 民國年
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        return `${year} 年 ${month.toString().padStart(2, '0')} 月 ${day.toString().padStart(2, '0')} 日`;
      };

      const formatShootingDate = () => {
        if (contract.租用開始時間) {
          const date = contract.租用開始時間.toDate ? contract.租用開始時間.toDate() : new Date(contract.租用開始時間);
          return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
        }
        return '';
      };

      // 獲取禮服圖片
      const getDressImages = () => {
        if (contract.禮服清單 && dresses.length > 0) {
          const images = [];
          contract.禮服清單.forEach(item => {
            const dress = dresses.find(d => d.id === item.禮服ID);
            if (dress && dress.圖片 && dress.圖片.length > 0) {
              images.push(...dress.圖片.slice(0, 2));
            }
          });
          return images.slice(0, 6);
        }
        return [];
      };

      // 獲取禮服款式
      const getDressStyles = () => {
        if (contract.禮服清單 && dresses.length > 0) {
          const styles = contract.禮服清單.map(item => {
            const dress = dresses.find(d => d.id === item.禮服ID);
            return dress ? `${dress.編號} (${dress.顏色} ${dress.裙型})` : item.禮服ID;
          }).join('、');
          return styles;
        }
        return '';
      };

      // 獲取配件資訊
      const getAccessoriesInfo = () => {
        if (contract.選擇配件) {
          return this.getContractAccessoryFullLabel();
        }
        return '可任選頭紗款式';
      };

      // 獲取付款記錄
      const getPaymentRecords = () => {
        if (contract.付款記錄 && contract.付款記錄.length > 0) {
          return contract.付款記錄.map(payment => ({
            type: payment.付款別,
            amount: payment.金額 ? payment.金額.toLocaleString() : '',
            staff: payment.接待人員,
            signature: contract.客戶姓名 || '',
            date: payment.付款日期 ? new Date(payment.付款日期).toLocaleDateString('zh-TW').replace(/\//g, '.') : ''
          }));
        }
        
        // 預設付款記錄
        const totalAmount = contract.合約總金額 || 0;
        const deposit = Math.round(totalAmount * 0.2);
        return [
          { type: '拍攝定金', amount: deposit.toLocaleString(), staff: contract.承辦人 || 'Abby', signature: contract.客戶姓名 || '', date: formatShootingDate() },
          { type: '拍攝尾款', amount: '', staff: '', signature: '', date: '' },
          { type: '宴客定金', amount: '', staff: '', signature: '', date: '' },
          { type: '宴客尾款', amount: '', staff: '', signature: '', date: '' }
        ];
      };

      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>合約_${contract.合約單號}_${contract.客戶姓名}</title>
  <style>
    @page {
      margin: 15mm;
      size: A4;
      @top-left { content: none; }
      @top-center { content: none; }
      @top-right { content: none; }
      @bottom-left { content: none; }
      @bottom-center { content: none; }
      @bottom-right { content: none; }
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Microsoft JhengHei', 'PingFang TC', sans-serif;
      font-size: 14px;
      line-height: 1.4;
      color: #000;
      background: white;
      font-weight: bold;
    }
    
    .contract-container {
      width: 100%;
      max-width: none;
      padding: 0;
    }
    
    .contract-title {
      text-align: center;
      font-size: 18px;
      margin-bottom: 20px;
    }
    
    .contract-header p {
      margin: 8px 0;
      font-size: 14px;
    }
    
    .disclaimer {
      font-size: 14px;
      color: #000;
      margin: 15px 0;
    }
    
    hr {
      border: none;
      border-top: 1px solid #000;
      margin: 25px 0;
    }
    
    .article {
      margin-bottom: 20px;
    }
    
    .article h2 {
      font-size: 14px;
      margin-bottom: 10px;
    }
    
    .article h3 {
      font-size: 14px;
      margin: 10px 0 8px 0;
    }
    
    .rental-info {
      margin-left: 15px;
    }
    
    .note {
      font-size: 14px;
      color: #000;
      margin: 8px 0;
    }
    
    .variable {
      color: #d32f2f;
      text-decoration: underline;
    }
    
    .payment-table {
      margin: 15px 0;
      page-break-inside: avoid;
    }
    
    .payment-table table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #ddd;
      page-break-inside: avoid;
    }
    
    .payment-table th,
    .payment-table td {
      border: 1px solid #ddd;
      padding: 6px;
      text-align: left;
      font-size: 14px;
    }
    
    .payment-table th {
      background-color: #f5f5f5;
    }
    
    .signature-section {
      margin-top: 30px;
      page-break-inside: avoid;
    }
    
    .signature-container {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
    }
    
    .lessor-info,
    .lessee-info {
      width: 45%;
    }
    
    .signature-area {
      margin-top: 15px;
    }
    
    .signature-image {
      max-width: 200px;
      max-height: 80px;
      object-fit: contain;
      margin-bottom: 8px;
    }
    
    .signature-placeholder {
      width: 200px;
      height: 80px;
      border: 2px dashed #ccc;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .contract-date {
      text-align: center;
      margin-top: 25px;
      font-size: 14px;
    }
    
    .date-spacing {
      display: flex;
      justify-content: space-between;
      max-width: 300px;
      margin: 0 auto;
    }
    
    .image-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin: 10px 0;
    }
    
    .image-container {
      width: 100%;
      aspect-ratio: 1;
      overflow: hidden;
      border-radius: 4px;
      border: 1px solid #ddd;
    }
    
    .dress-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .address-field {
      height: auto;
      line-height: 1.4;
      margin: 12px 0;
      display: flex;
      align-items: flex-start;
      font-size: 14px;
    }
    
    .address-field strong {
      white-space: nowrap;
      margin-right: 5px;
    }
    
    .address-field .variable {
      flex: 1;
      word-wrap: break-word;
      line-height: 1.4;
    }
    
    ul {
      padding-left: 15px;
    }
    
    li {
      margin-bottom: 6px;
      font-size: 14px;
    }
    
    .lessor-info p,
    .lessee-info p {
      margin: 12px 0;
      font-size: 14px;
    }
    
    .signature-title {
      font-size: 14px;
      margin-bottom: 12px;
    }
    
    @media print {
      .no-print {
        display: none !important;
      }
      
      body {
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
      
      .payment-table {
        page-break-inside: avoid;
      }
      
      .signature-section {
        page-break-inside: avoid;
      }
      
      .article {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="contract-container">
    <div class="contract-content">
      <h1 class="contract-title">婚紗及配件租借合約書</h1>
      
      <div class="contract-header">
        <p>單 號：<span class="variable">${contract.合約單號 || 'V250902'}</span></p>
        <p>出租人：<span class="variable">${templateSettings.出租人 || '裳云智略股份有限公司'}</span> 以下簡稱甲方</p>
        <p>承租人：<span class="variable">${contract.客戶姓名 || '客戶姓名'}</span> 以下簡稱乙方</p>
        <p class="disclaimer">
          本契約條款甲方出租人應於簽約前，將契約內容充分向承租人說明，雙方謹簽訂書面契約或以雙方同意之其他適當方式表示同意，以憑信守。本契約內容之新台幣金額皆為含稅金額。
        </p>
        <hr>
      </div>

      <div class="article">
        <h2>第一條 租借物件與租賃期間</h2>
        <div class="rental-info">
          <h3>租借物件</h3>
          <p>☑婚紗</p>
          
          <h3>租借方案:</h3>
          <p style="white-space: pre-line;"><span class="variable">${contract.備注 || (contract.選擇方案 + ' $' + (contract.合約總金額 || 0).toLocaleString() + '\\n' + formatShootingDate() + '拍攝使用')}</span></p>
          
          <h3>款式 :</h3>
          <p><span class="variable">${getDressStyles()}</span></p>
          
          <h3>配件:</h3>
          <p><span class="variable">${getAccessoriesInfo()}</span></p>
          
          <h3>圖片：</h3>
          <div class="dress-images">
            ${getDressImages().length > 0 ? 
              '<div class="image-grid">' + 
              getDressImages().map(img => `<div class="image-container"><img src="${img}" alt="禮服圖片" class="dress-image" /></div>`).join('') + 
              '</div>' : 
              '<p><span class="variable">無圖片</span></p>'
            }
          </div>
          
          <h3>總金額新台幣$<span class="variable">${(contract.合約總金額 || 0).toLocaleString()}</span>元整</h3>
          
          <h3>租賃期間:</h3>
          <p>取件時間：中華民國 <span class="variable">${formatDate(contract.租用開始時間)}</span></p>
          <p>歸還時間：中華民國 <span class="variable">${formatDate(contract.租用結束時間)}</span></p>
          <p>總計共 <span class="variable">1</span> 檔期</p>
          
          <p class="note">*租借四天為一檔期，每增加一日，每件婚紗加收新台幣1,000元，配件每件加收新台幣300元。</p>
          <p class="note">*取貨與歸還應於週一至週五18:30前，遇休假日可提前或順延一日不予加價（特別預約假日者除外）。</p>
        </div>
      </div>

      <div class="article">
        <h2>第二條 租金／定金／押金</h2>
        
        <h3>● 租金</h3>
        <p>總計共新台幣$<span class="variable">${(contract.合約總金額 || 0).toLocaleString()}</span>元整（含稅），甲方需開立統一發票。乙方應於取件時扣除已付之定金金額後支付。</p>
        
        <h3>● 定金</h3>
        <p>總計共新台幣$<span class="variable">${Math.round((contract.合約總金額 || 0) * 0.2).toLocaleString()}</span>元整，以匯款支付。</p>
        <ul>
          <li>乙方確認契約內容無誤並承諾租賃後，須支付定金以預留檔期。甲方收到定金始保留乙方預定檔期，並開始進行客製尺寸修改（如需）。</li>
          <li>定金金額為訂單總金額20%，支付後逾30日，如乙方需取消，則訂金不予退還。</li>
          <li>下訂後乙方有更換承租之款式、品項、檔期之權利，第三次以上試穿則每次酌收新台幣3000元之試穿服務費。</li>
          <li>如因天災等不可抗力之因素致乙方須取消或變更檔期，經甲方確認後得取消或變更，定金可延後使用，不予退還，無須額外處理服務費用。</li>
        </ul>
        
        <h3>● 押金</h3>
        <p>總計共新台幣$<span class="variable">${(contract.押金 || 0).toLocaleString()}</span>元整，以現金支付。</p>
        <ul>
          <li>乙方於取件時需檢查租借物件之狀況，確認並支付押金後即視同同意物件無誤。</li>
          <li>乙方需於歸還期限返還承租物件。如物件由乙方寄還，須以紙箱包裝完整避免物件遭刮傷或破損。</li>
          <li>甲方收到歸還物件時應現場或透過視訊與乙方清點並確認物件狀況。經確認物件數量無誤且狀態良好後，甲方須退還乙方全額押金。</li>
          <li>如經甲方檢查後發現出租物件有非正常使用產生之嚴重髒污、破壞、缺件或遺失，甲方將予以扣留押金，並依第五條損害賠償處理。</li>
          <li>物件承租所使用之特殊優惠，須於歸還物件前完成並提供截圖證明。若未完成或拒絕完成，已折扣金額將抵扣押金，如折扣金額超過押金，甲方得要求乙方支付完整折扣金額。</li>
        </ul>

        <div class="payment-table">
          <table>
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
              ${getPaymentRecords().map(payment => `
                <tr>
                  <td>${payment.type}</td>
                  <td class="variable">$${payment.amount}</td>
                  <td class="variable">${payment.staff}</td>
                  <td class="variable">${contract.客戶簽名 ? '<img src="' + contract.客戶簽名 + '" alt="客戶簽名" style="max-width: 80px; max-height: 25px; object-fit: contain;" />' : payment.signature}</td>
                  <td class="variable">${payment.date}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="article">
        <h2>第三條 使用規則與限制</h2>
        <ul>
          <li>請愛惜使用並妥善保管。保管義務租借方應盡善良管理人之義務保管及維護租借物件，不得轉借給第三人使用，亦禁止轉租、出賣、設質、抵押、讓與、擔保、典當出租物件、汙損物品及衣物等行為。</li>
          <li>租借期間租借物件之所有權仍歸屬 <span class="variable">${templateSettings.出租人 || '裳云智略股份有限公司'}</span>，乙方僅在約定期間使用租借物件，並不取得其他任何權利。</li>
          <li>如有須寄送之來回運費，若非甲方之疏失，運費及其他衍生費用均需由乙方負擔。</li>
          <li>經客製化修改尺寸之物件，需由乙方到場試穿取件。如需寄送服務，運費由乙方負擔。</li>
        </ul>
      </div>

      <div class="article">
        <h2>第四條 租賃期間延展或逾期返還</h2>
        <p>乙方於取件後如須延展租賃檔期或逾期返還承租物件，乙方皆須負擔延展費用。每延展或逾期歸還一日，每件婚紗加收新台幣2,000元，配件加收新台幣500元。</p>
      </div>

      <div class="article">
        <h2>第五條 損害賠償</h2>
        <ul>
          <li>歸還租借物件檢查時發現破損、髒污、缺件等情況，甲方將予以扣留押金，並由甲方配合之第三方廠商報價清潔、維修等後續處理之費用。甲方須提供後續處理之單據影本，並由押金扣除後返完乙方剩餘押金。如處理費用超過押金，甲方得要求乙方支付後續處理之費用。</li>
          <li>如乙方遺失本約承租之物件或維修金額超過完全毀損賠償金額，將以完全毀損賠償處理。乙方支付完全毀損賠償後，承租之物件所有權轉移為乙方所有（遺失除外）。租用物件之完全毀損賠償金額會於乙方取件時告知，並公告於附表。</li>
        </ul>
      </div>

      <div class="article">
        <h2>第六條 提前終止租約</h2>
        <ul>
          <li>本契約於期限屆滿前，租賃雙方均無權片面無條件取消或變更合約。</li>
          <li>如乙方提前返還承租物件，亦須支付本租約之完整租賃期間租金。</li>
        </ul>
      </div>

      <div class="article">
        <h2>第七條 爭議處理</h2>
        <ul>
          <li>若因本合約未能履行或履行不力所生之爭議糾紛雙方應同意先以誠信原則磋商之，磋商不協時，雙方同意以仲裁法提付仲裁，仲裁地為台北市。</li>
          <li>本合約以中華民國法律為準據法，如涉及訴訟，雙方同意以台灣台北地方法院為第一審管轄法院。</li>
        </ul>
      </div>

      <div class="article">
        <h2>第八條 其他</h2>
        <ul>
          <li>本合約書計正本兩份，由締約當事人雙方各執乙份。</li>
          <li>乙方未得甲方事前書面同意，不得將本契約內容資訊（包含但不限於金額或特殊優惠等）洩漏、口頭告知、交付或移轉予任何第三人。</li>
          <li>本契約若有未盡事宜或修改者，應經雙方協議另以書面修訂，並依有關法令、習慣、平等互惠及誠實信用原則公平解決之。</li>
          <li>甲方與乙方應就本契約所附表格之約定事項詳為記載；該表格所載雙方約定事項為本契約之一部。</li>
        </ul>
      </div>

      <div class="signature-section">
        <p class="signature-section-title">立契約書人</p>
        <div class="signature-container">
          <div class="lessor-info">
            <p class="signature-title">出租人：${templateSettings.出租人 || '裳云智略股份有限公司'}</p>
            <p>統一編號：${templateSettings.統一編號 || '52888231'}</p>
            <div class="address-field">
              地址：${templateSettings.出租人地址 || '台北市中山區中山北路二段16巷14號2樓'}
            </div>
            <p>聯絡電話：${templateSettings.出租人電話 || '02-27196817'}</p>
            <div class="signature-area">
              <p>簽章：</p>
              <div class="signature-upload">
                ${templateSettings.出租人簽名 ? 
                  '<img src="' + templateSettings.出租人簽名 + '" alt="出租人簽章" class="signature-image">' : 
                  '<div class="signature-placeholder"><span style="color: #999;">出租人簽章</span></div>'
                }
              </div>
            </div>
          </div>

          <div class="lessee-info">
            <p class="signature-title">承租人：${contract.客戶姓名 || '客戶姓名'}</p>
            <p>身分證字號：${contract.身分證號 || 'F228277963'}</p>
            <div class="address-field">
              地址：${contract.地址 || '新北市五股區成泰路三段561號2樓'}
            </div>
            <p>聯絡電話：${contract.電話 || '0933527669'}</p>
            <div class="signature-area">
              <p>簽章：</p>
              <div class="signature-upload">
                ${contract.客戶簽名 ? 
                  '<img src="' + contract.客戶簽名 + '" alt="承租人簽章" class="signature-image">' : 
                  '<div class="signature-placeholder"><span style="color: #999;">客戶簽名</span></div>'
                }
              </div>
            </div>
          </div>
        </div>

        <div class="contract-date">
          <div class="date-spacing">
            <span>中</span>
            <span>華</span>
            <span>民</span>
            <span>國</span>
            <span class="variable">${contract.合約建立日期時間 ? (contract.合約建立日期時間.toDate ? contract.合約建立日期時間.toDate() : new Date(contract.合約建立日期時間)).getFullYear() - 1911 : '114'}</span>
            <span>年</span>
            <span class="variable">${contract.合約建立日期時間 ? ((contract.合約建立日期時間.toDate ? contract.合約建立日期時間.toDate() : new Date(contract.合約建立日期時間)).getMonth() + 1).toString().padStart(2, '0') : '09'}</span>
            <span>月</span>
            <span class="variable">${contract.合約建立日期時間 ? (contract.合約建立日期時間.toDate ? contract.合約建立日期時間.toDate() : new Date(contract.合約建立日期時間)).getDate().toString().padStart(2, '0') : '03'}</span>
            <span>日</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
    },

    // 格式化付款日期
    formatPaymentDate(dateStr) {
      if (!dateStr) return '';
      
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString("zh-TW", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        });
      } catch (error) {
        return dateStr;
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

/* 簽名圖片樣式 */
.signature-preview {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 10px;
}

.signature-image {
  width: 300px;
  height: 100px;
  object-fit: contain;
}

/* 付款記錄表格樣式 */
.table th {
  background-color: #f8f9fa;
  font-weight: 600;
  border-color: #dee2e6;
}

.table td {
  vertical-align: middle;
  border-color: #dee2e6;
}

.detail-signature-image {
  width: 120px;
  height: 60px;
  object-fit: contain;
}

.payment-amount-column {
  min-width: 120px;
}

.payment-amount-display {
  text-align: center;
}

.staff-display {
  padding: 5px;
}
</style>
