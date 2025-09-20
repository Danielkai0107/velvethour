<template>
  <div class="container-fluid">
    <!-- 頁面標題 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0 fw-bold">合約模板管理</h1>
      <div class="d-flex gap-2">
        <button @click="resetTemplate" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-clockwise me-2"></i>重置模板
        </button>
        <button @click="saveTemplate" class="btn btn-primary" :disabled="saving">
          <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <i v-else class="bi bi-floppy me-2"></i>
          {{ saving ? '儲存中...' : '儲存模板' }}
        </button>
      </div>
    </div>

    <!-- 模板編輯區域 -->
    <div class="row">
      <!-- 左側：模板預覽 -->
      <div class="col-lg-8">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">
              <i class="bi bi-file-earmark-text me-2"></i>模板預覽
            </h5>
          </div>
          <div class="card-body p-0">
            <div class="template-preview-container" style="max-height: 80vh; overflow-y: auto;">
              <ContractTemplate
                :contractData="sampleContractData"
                :dressData="sampleDressData"
                :isEditable="true"
                @update-contract="handleTemplateUpdate"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 右側：設定面板 -->
      <div class="col-lg-4">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0">
              <i class="bi bi-gear me-2"></i>模板設定
            </h5>
          </div>
          <div class="card-body">
            <!-- 公司資訊設定 -->
            <div class="mb-4">
              <h6 class="fw-bold mb-3">出租人資訊</h6>
              <div class="mb-3">
                <label class="form-label">公司名稱</label>
                <input
                  v-model="templateSettings.出租人"
                  type="text"
                  class="form-control"
                  placeholder="請輸入公司名稱"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">統一編號</label>
                <input
                  v-model="templateSettings.統一編號"
                  type="text"
                  class="form-control"
                  placeholder="請輸入統一編號"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">公司地址</label>
                <textarea
                  v-model="templateSettings.出租人地址"
                  class="form-control"
                  rows="2"
                  placeholder="請輸入公司地址"
                ></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">聯絡電話</label>
                <input
                  v-model="templateSettings.出租人電話"
                  type="text"
                  class="form-control"
                  placeholder="請輸入聯絡電話"
                />
              </div>
            </div>

            <!-- 預設條款設定 -->
            <div class="mb-4">
              <h6 class="fw-bold mb-3">預設條款</h6>
              <div class="mb-3">
                <label class="form-label">預設配件</label>
                <input
                  v-model="templateSettings.配件"
                  type="text"
                  class="form-control"
                  placeholder="例：可任選頭紗款式"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">預設押金</label>
                <input
                  v-model.number="templateSettings.押金"
                  type="number"
                  class="form-control"
                  placeholder="請輸入預設押金金額"
                />
              </div>
            </div>

            <!-- PDF設定 -->
            <div class="mb-4">
              <h6 class="fw-bold mb-3">PDF設定</h6>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    v-model="templateSettings.顯示圖片"
                    class="form-check-input"
                    type="checkbox"
                    id="showImages"
                  />
                  <label class="form-check-label" for="showImages">
                    在PDF中顯示禮服圖片
                  </label>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">圖片數量限制</label>
                <select v-model.number="templateSettings.圖片數量限制" class="form-select">
                  <option value="3">最多3張</option>
                  <option value="6">最多6張</option>
                  <option value="9">最多9張</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- 測試資料設定 -->
        <div class="card shadow-sm border-0">
          <div class="card-header bg-warning text-dark">
            <h5 class="mb-0">
              <i class="bi bi-database me-2"></i>測試資料
            </h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">客戶姓名</label>
              <input
                v-model="sampleContractData.客戶姓名"
                type="text"
                class="form-control"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">合約單號</label>
              <input
                v-model="sampleContractData.合約單號"
                type="text"
                class="form-control"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">合約總金額</label>
              <input
                v-model.number="sampleContractData.合約總金額"
                type="number"
                class="form-control"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">承辦人</label>
              <input
                v-model="sampleContractData.承辦人"
                type="text"
                class="form-control"
              />
            </div>
            <button @click="generateSampleData" class="btn btn-outline-primary btn-sm w-100">
              <i class="bi bi-shuffle me-2"></i>產生範例資料
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 儲存成功提示 -->
    <div v-if="showSaveSuccess" class="alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3" style="z-index: 9999;">
      <div class="d-flex align-items-center">
        <i class="bi bi-check-circle me-2"></i>
        模板設定已儲存
      </div>
    </div>
  </div>
</template>

<script>
import ContractTemplate from "../components/Template.vue";

export default {
  name: "ContractTemplateManagement",
  components: {
    ContractTemplate,
  },
  data() {
    return {
      saving: false,
      showSaveSuccess: false,
      
      // 模板設定
      templateSettings: {
        出租人: "裳云智略股份有限公司",
        統一編號: "52888231",
        出租人地址: "台北市中山區中山北路二段16巷14號2樓",
        出租人電話: "02-27196817",
        配件: "可任選頭紗款式",
        押金: 0,
        顯示圖片: true,
        圖片數量限制: 6,
      },
      
      // 範例合約資料
      sampleContractData: {
        合約單號: "V250902",
        客戶姓名: "陳奕臻",
        電話: "0933527669",
        身分證號: "F228277963",
        地址: "新北市五股區成泰路三段561號2樓",
        承辦人: "Abby",
        選擇方案: "蘇鳥攝影簽約1白2晚",
        合約總金額: 21000,
        租用開始時間: new Date("2025-12-03"),
        租用結束時間: new Date("2025-12-06"),
        創建時間: new Date(),
        備注: "白紗可挑至$16800以內，晚禮服可挑至$12000以內，總金額可挑至$40800，超過則補差額",
        禮服清單: [
          { 禮服ID: "dress1", 數量: 1 },
          { 禮服ID: "dress2", 數量: 1 }
        ]
      },
      
      // 範例禮服資料
      sampleDressData: [
        {
          id: "dress1",
          編號: "W001",
          顏色: "白色",
          裙型: "A字裙",
          袖型: "無袖",
          領型: "V領",
          圖片: [
            "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300&h=400&fit=crop",
            "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=300&h=400&fit=crop"
          ]
        },
        {
          id: "dress2",
          編號: "E001",
          顏色: "香檳色",
          裙型: "魚尾裙",
          袖型: "長袖",
          領型: "一字領",
          圖片: [
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300&h=400&fit=crop",
            "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=300&h=400&fit=crop"
          ]
        }
      ]
    };
  },
  
  mounted() {
    this.loadTemplateSettings();
  },
  
  methods: {
    // 載入模板設定
    loadTemplateSettings() {
      const saved = localStorage.getItem('contractTemplateSettings');
      if (saved) {
        try {
          this.templateSettings = { ...this.templateSettings, ...JSON.parse(saved) };
        } catch (error) {
          console.error('載入模板設定失敗:', error);
        }
      }
    },
    
    // 儲存模板設定
    async saveTemplate() {
      try {
        this.saving = true;
        
        // 將設定儲存到localStorage
        localStorage.setItem('contractTemplateSettings', JSON.stringify(this.templateSettings));
        
        // 模擬API儲存時間
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.showSaveSuccess = true;
        setTimeout(() => {
          this.showSaveSuccess = false;
        }, 3000);
        
      } catch (error) {
        console.error('儲存模板設定失敗:', error);
        this.showToast('儲存模板設定失敗，請稍後再試', 'error');
      } finally {
        this.saving = false;
      }
    },
    
    // 重置模板
    resetTemplate() {
      if (confirm('確定要重置模板設定嗎？這將會清除所有自訂設定。')) {
        this.templateSettings = {
          出租人: "裳云智略股份有限公司",
          統一編號: "52888231",
          出租人地址: "台北市中山區中山北路二段16巷14號2樓",
          出租人電話: "02-27196817",
          配件: "可任選頭紗款式",
          押金: 0,
          顯示圖片: true,
          圖片數量限制: 6,
        };
        
        localStorage.removeItem('contractTemplateSettings');
        this.showToast('模板已重置', 'success');
      }
    },
    
    // 處理模板更新
    handleTemplateUpdate(updateData) {
      this.sampleContractData = { ...this.sampleContractData, ...updateData };
    },
    
    // 產生範例資料
    generateSampleData() {
      const sampleNames = ["王小明", "李小華", "張美麗", "陳志強", "林雅婷"];
      const sampleStaff = ["Abby", "Jenny", "Alice", "Cindy", "Emma"];
      const samplePlans = ["蘇鳥攝影簽約1白2晚", "宴客攝影套裝", "婚紗攝影專案", "完整婚禮套裝"];
      
      const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const randomStaff = sampleStaff[Math.floor(Math.random() * sampleStaff.length)];
      const randomPlan = samplePlans[Math.floor(Math.random() * samplePlans.length)];
      const randomAmount = [18000, 21000, 25000, 30000][Math.floor(Math.random() * 4)];
      const contractNumber = `V${new Date().getFullYear()}${(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      this.sampleContractData = {
        ...this.sampleContractData,
        合約單號: contractNumber,
        客戶姓名: randomName,
        承辦人: randomStaff,
        選擇方案: randomPlan,
        合約總金額: randomAmount,
        創建時間: new Date(),
      };
      
      this.showToast('已產生新的範例資料', 'success');
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
.template-preview-container {
  background-color: #f8f9fa;
  padding: 20px;
}

.form-label {
  font-weight: 600;
  color: #495057;
  font-size: 14px;
}

.card-header h5 {
  font-size: 16px;
}

@media (max-width: 991px) {
  .col-lg-4 {
    margin-top: 2rem;
  }
}
</style>
