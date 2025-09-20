<template>
  <div class="container-fluid">
    <!-- 頁面標題 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0 fw-bold">選項管理</h1>
    </div>

    <!-- 分隔線 -->
    <hr class="my-4" style="border-color: #E0E0E0; border-width: 1px;">

    <!-- 禮服分類管理區域 -->
    <div class="mb-4">
      <h2 class="mb-0 fw-bold" style="font-size: 16px;">
        禮服分類管理
      </h2>
    </div>

    <!-- 選項分類卡片 -->
    <div class="row g-4">
      <!-- 禮服顏色選項 -->
      <div class="col-lg-6 col-xl-4">
        <div class="card h-100 shadow-sm border-0 rounded-4">
          <div class="card-header bg-white border-0 pb-0">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0 fw-semibold">
                禮服顏色
              </h5>
              <button
                @click="showAddModal('color')"
                class="btn btn-outline-secondary btn-sm"
                style="padding: 0.25rem 0.5rem;"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="(color, index) in options.colors"
                :key="index"
                class="badge bg-light text-dark border d-flex align-items-center"
                style="font-size: 13px; padding: 8px 12px;"
              >
                <span
                  class="rounded-circle me-2"
                  style="width: 12px; height: 12px; display: inline-block"
                  :style="{
                    backgroundColor: color.color,
                    border: color.border ? `1px solid ${color.border}` : '1px solid #E5E7EB',
                  }"
                ></span>
                {{ color.label }}
                <button
                  @click="removeOption('colors', index)"
                  class="btn-close btn-close-sm ms-2"
                  style="font-size: 8px;"
                ></button>
              </span>
            </div>
            <p class="text-muted small mt-3 mb-0">
              目前共 {{ options.colors.length }} 個顏色選項
            </p>
          </div>
        </div>
      </div>

      <!-- 裙型選項 -->
      <div class="col-lg-6 col-xl-4">
        <div class="card h-100 shadow-sm border-0 rounded-4">
          <div class="card-header bg-white border-0 pb-0">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0 fw-semibold">
                裙型
              </h5>
              <button
                @click="showAddModal('skirt')"
                class="btn btn-outline-secondary btn-sm"
                style="padding: 0.25rem 0.5rem;"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="(skirt, index) in options.skirts"
                :key="index"
                class="badge bg-light text-dark border d-flex align-items-center"
                style="font-size: 13px; padding: 8px 12px;"
              >
                {{ skirt.label }}
                <button
                  @click="removeOption('skirts', index)"
                  class="btn-close btn-close-sm ms-2"
                  style="font-size: 8px;"
                ></button>
              </span>
            </div>
            <p class="text-muted small mt-3 mb-0">
              目前共 {{ options.skirts.length }} 個裙型選項
            </p>
          </div>
        </div>
      </div>

      <!-- 袖型選項 -->
      <div class="col-lg-6 col-xl-4">
        <div class="card h-100 shadow-sm border-0 rounded-4">
          <div class="card-header bg-white border-0 pb-0">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0 fw-semibold">
                袖型
              </h5>
              <button
                @click="showAddModal('sleeve')"
                class="btn btn-outline-secondary btn-sm"
                style="padding: 0.25rem 0.5rem;"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="(sleeve, index) in options.sleeves"
                :key="index"
                class="badge bg-light text-dark border d-flex align-items-center"
                style="font-size: 13px; padding: 8px 12px;"
              >
                {{ sleeve.label }}
                <button
                  @click="removeOption('sleeves', index)"
                  class="btn-close btn-close-sm ms-2"
                  style="font-size: 8px;"
                ></button>
              </span>
            </div>
            <p class="text-muted small mt-3 mb-0">
              目前共 {{ options.sleeves.length }} 個袖型選項
            </p>
          </div>
        </div>
      </div>

      <!-- 領型選項 -->
      <div class="col-lg-6 col-xl-4">
        <div class="card h-100 shadow-sm border-0 rounded-4">
          <div class="card-header bg-white border-0 pb-0">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0 fw-semibold">
                領型
              </h5>
              <button
                @click="showAddModal('neck')"
                class="btn btn-outline-secondary btn-sm"
                style="padding: 0.25rem 0.5rem;"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="(neck, index) in options.necks"
                :key="index"
                class="badge bg-light text-dark border d-flex align-items-center"
                style="font-size: 13px; padding: 8px 12px;"
              >
                {{ neck.label }}
                <button
                  @click="removeOption('necks', index)"
                  class="btn-close btn-close-sm ms-2"
                  style="font-size: 8px;"
                ></button>
              </span>
            </div>
            <p class="text-muted small mt-3 mb-0">
              目前共 {{ options.necks.length }} 個領型選項
            </p>
          </div>
        </div>
      </div>

    </div>

    <!-- 分隔線 -->
    <hr class="my-5" style="border-color: #E0E0E0; border-width: 2px;">

    <!-- 方案管理區域 -->
    <div class="mb-4">
      <h2 class="mb-0 fw-bold" style="font-size: 16px;">
        方案管理
      </h2>
    </div>

    <div class="row g-4">
      <!-- 配件選項 -->
      <div class="col-lg-6">
        <div class="card h-100 shadow-sm border-0 rounded-4">
          <div class="card-header bg-white border-0 pb-0">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0 fw-semibold">
                配件選項
              </h5>
              <button
                @click="showAddModal('accessory')"
                class="btn btn-outline-secondary btn-sm"
                style="padding: 0.25rem 0.5rem;"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div v-if="options.accessories.length === 0" class="text-center text-muted py-3">
              <i class="bi bi-gem display-6"></i>
              <p class="mt-2 mb-0">尚未新增任何配件選項</p>
            </div>
            <div v-else class="d-flex flex-column gap-4">
              <!-- 按分類分組顯示 -->
              <div 
                v-for="(categoryAccessories, category) in groupedAccessories" 
                :key="category"
              >
                <h6 class="fw-semibold text-muted mb-3" style="font-size: 14px;">
                  {{ category }}
                </h6>
                <div class="d-flex flex-column gap-2">
                  <div
                    v-for="accessory in categoryAccessories"
                    :key="accessory.originalIndex"
                    class="d-flex justify-content-between align-items-center p-3 bg-light rounded border"
                  >
                    <div class="flex-grow-1">
                      <div class="fw-semibold">{{ accessory.label }}</div>
                      <div v-if="accessory.accessoryPrice && accessory.accessoryPrice > 0" class="text-success small mt-1">
                        NT$ {{ accessory.accessoryPrice.toLocaleString() }}
                      </div>
                      <div v-else class="text-muted small mt-1">
                        贈送
                      </div>
                    </div>
                    <div class="d-flex gap-2">
                      <button
                        @click="editAccessory(accessory.originalIndex)"
                        class="btn btn-outline-primary btn-sm"
                        title="編輯配件"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button
                        @click="removeOption('accessories', accessory.originalIndex)"
                        class="btn btn-outline-danger btn-sm"
                        title="刪除配件"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="border-top pt-3 mt-3">
              <p class="text-muted small mb-0">
                <i class="bi bi-info-circle me-1"></i>
                目前共 {{ options.accessories.length }} 個配件選項
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 方案選項 -->
      <div class="col-lg-6">
        <div class="card h-100 shadow-sm border-0 rounded-4">
          <div class="card-header bg-white border-0 pb-0">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0 fw-semibold">
                方案選項
              </h5>
              <button
                @click="showAddModal('package')"
                class="btn btn-outline-secondary btn-sm"
                style="padding: 0.25rem 0.5rem;"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div v-if="options.packages.length === 0" class="text-center text-muted py-3">
              <i class="bi bi-box-seam display-6"></i>
              <p class="mt-2 mb-0">尚未新增任何方案選項</p>
            </div>
            <div v-else class="d-flex flex-column gap-4">
              <!-- 按分類分組顯示 -->
              <div 
                v-for="(categoryPackages, category) in groupedPackages" 
                :key="category"
              >
                <h6 class="fw-semibold text-muted mb-3" style="font-size: 14px;">
                  {{ category }}
                </h6>
                <div class="d-flex flex-column gap-2">
                  <div
                    v-for="pkg in categoryPackages"
                    :key="pkg.originalIndex"
                    class="d-flex justify-content-between align-items-center p-3 bg-light rounded border"
                  >
                    <div class="flex-grow-1">
                      <div class="fw-semibold">{{ pkg.label }}</div>
                      <div v-if="pkg.content" class="text-muted small mt-1" style="max-width: 400px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        {{ pkg.content }}
                      </div>
                    </div>
                    <div class="d-flex gap-2">
                      <button
                        @click="editPackage(pkg.originalIndex)"
                        class="btn btn-outline-primary btn-sm"
                        title="編輯方案"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button
                        @click="removeOption('packages', pkg.originalIndex)"
                        class="btn btn-outline-danger btn-sm"
                        title="刪除方案"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="border-top pt-3 mt-3">
              <p class="text-muted small mb-0">
                <i class="bi bi-info-circle me-1"></i>
                目前共 {{ options.packages.length }} 個方案選項
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 新增選項模態框 -->
    <div
      v-if="showModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
      @click.self="closeModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingIndex !== null ? '編輯' : '新增' }}{{ getModalTitle() }}</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addOption">
              <!-- 禮服分類選項的名稱欄位 -->
              <div v-if="modalType !== 'package'" class="mb-3">
                <label class="form-label">選項名稱 *</label>
                <input
                  v-model="newOption.label"
                  type="text"
                  class="form-control"
                  required
                  placeholder="請輸入選項名稱"
                  @input="onLabelChange"
                />
              </div>
              
              <!-- 配件選項的特殊欄位 -->
              <div v-if="modalType === 'accessory'">
                <!-- 1. 分類 -->
                <div class="mb-3">
                  <label class="form-label">配件分類 *</label>
                  <select v-model="newOption.category" class="form-select" required @change="generateAccessoryLabel">
                    <option value="">請選擇分類</option>
                    <option value="頭紗">頭紗</option>
                    <option value="首飾">首飾</option>
                    <option value="鞋子">鞋子</option>
                    <option value="包包">包包</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                
                <!-- 2. 配件名稱 -->
                <div class="mb-3">
                  <label class="form-label">配件名稱 *</label>
                  <input
                    v-model="newOption.accessoryName"
                    type="text"
                    class="form-control"
                    required
                    placeholder="例: 任選任何款式"
                    @input="generateAccessoryLabel"
                  />
                </div>

                <!-- 3. 配件金額 -->
                <div class="mb-3">
                  <label class="form-label">配件金額 (NT$)</label>
                  <input
                    v-model.number="newOption.accessoryPrice"
                    type="number"
                    class="form-control"
                    min="0"
                    placeholder="例: 1000"
                    @input="generateAccessoryLabel"
                  />
                  <small class="text-muted">配件額外費用，可留空表示贈送</small>
                </div>
              </div>

              <!-- 方案選項的特殊欄位 -->
              <div v-if="modalType === 'package'">
                <!-- 1. 分類 -->
                <div class="mb-3">
                  <label class="form-label">方案分類 *</label>
                  <select v-model="newOption.category" class="form-select" required @change="generatePackageLabel">
                    <option value="">請選擇分類</option>
                    <option value="宴客">宴客</option>
                    <option value="內部攝影">內部攝影</option>
                    <option value="外部攝影">外部攝影</option>
                  </select>
                </div>
                
                <!-- 2. 方案名稱 -->
                <div class="mb-3">
                  <label class="form-label">方案名稱 *</label>
                  <input
                    v-model="newOption.packageName"
                    type="text"
                    class="form-control"
                    required
                    placeholder="例: 一日一晚"
                    @input="generatePackageLabel"
                  />
                </div>
                
                <!-- 3. 方案價格 -->
                <div class="mb-3">
                  <label class="form-label">方案價格 (NT$) *</label>
                  <input
                    v-model.number="newOption.price"
                    type="number"
                    class="form-control"
                    required
                    min="0"
                    placeholder="例: 15000"
                    @input="generatePackageLabel"
                  />
                </div>

                <!-- 4. 方案內容 -->
                <div class="mb-3">
                  <label class="form-label">方案內容 *</label>
                  <textarea
                    v-model="newOption.content"
                    class="form-control"
                    rows="3"
                    required
                    placeholder="例: 白紗可挑至$16800以內，晚禮服可挑至$12000以內，總金額可挑至$40800，超過則補差額"
                  ></textarea>
                  <small class="text-muted">此內容會顯示在合約中的方案說明</small>
                </div>
              </div>
              
              <!-- 顏色選項的特殊欄位 -->
              <div v-if="modalType === 'color'" class="mb-3">
                <label class="form-label">顏色代碼</label>
                <div class="d-flex gap-2">
                  <input
                    v-model="newOption.color"
                    type="color"
                    class="form-control form-control-color"
                    style="width: 60px;"
                  />
                  <input
                    v-model="newOption.color"
                    type="text"
                    class="form-control"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
              <div class="d-flex gap-2 justify-content-end">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="closeModal"
                >
                  取消
                </button>
                <button type="submit" class="btn btn-primary" :disabled="saving" style="font-size: 14px;">
                  <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ saving ? (editingIndex !== null ? '更新中...' : '新增中...') : (editingIndex !== null ? '更新' : '新增') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { optionsService } from '../services/options.js';

export default {
  name: "OptionsManagement",
  data() {
    return {
      options: {
        colors: [],
        skirts: [],
        sleeves: [],
        necks: [],
        accessories: [],
        packages: [],
      },
      showModal: false,
      modalType: "",
      saving: false,
      deleting: false,
      editingIndex: null,
      newOption: {
        label: "",
        value: "",
        color: "#FFFFFF",
        price: 0,
        category: "",
        packageName: "",
        accessoryName: "",
        accessoryPrice: 0,
        content: "",
      },
    };
  },
  computed: {
    groupedPackages() {
      const grouped = {};
      this.options.packages.forEach((pkg, index) => {
        const category = pkg.category || '其他';
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push({
          ...pkg,
          originalIndex: index
        });
      });
      
      // 按分類名稱排序
      const sortedGrouped = {};
      const categoryOrder = ['宴客', '內部攝影', '外部攝影', '其他'];
      
      categoryOrder.forEach(category => {
        if (grouped[category]) {
          sortedGrouped[category] = grouped[category];
        }
      });
      
      // 添加其他未定義的分類
      Object.keys(grouped).forEach(category => {
        if (!categoryOrder.includes(category)) {
          sortedGrouped[category] = grouped[category];
        }
      });
      
      return sortedGrouped;
    },

    groupedAccessories() {
      const grouped = {};
      this.options.accessories.forEach((accessory, index) => {
        const category = accessory.category || '其他';
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push({
          ...accessory,
          originalIndex: index
        });
      });
      
      // 按分類名稱排序
      const sortedGrouped = {};
      const categoryOrder = ['頭紗', '首飾', '鞋子', '包包', '其他'];
      
      categoryOrder.forEach(category => {
        if (grouped[category]) {
          sortedGrouped[category] = grouped[category];
        }
      });
      
      // 添加其他未定義的分類
      Object.keys(grouped).forEach(category => {
        if (!categoryOrder.includes(category)) {
          sortedGrouped[category] = grouped[category];
        }
      });
      
      return sortedGrouped;
    },
  },
  methods: {
    showAddModal(type) {
      this.modalType = type;
      this.editingIndex = null;
      this.showModal = true;
      this.newOption = {
        label: "",
        value: "",
        color: "#FFFFFF",
        price: 0,
        category: "",
        packageName: "",
        accessoryName: "",
        accessoryPrice: 0,
        content: "",
      };
    },

    // 編輯配件
    editAccessory(index) {
      const accessory = this.options.accessories[index];
      this.modalType = 'accessory';
      this.editingIndex = index;
      this.showModal = true;
      
      // 填入現有資料
      this.newOption = {
        label: accessory.label,
        value: accessory.value,
        color: "#FFFFFF",
        price: 0,
        category: accessory.category || "",
        packageName: "",
        accessoryName: accessory.accessoryName || "",
        accessoryPrice: accessory.accessoryPrice || 0,
        content: "",
      };
    },

    // 編輯方案
    editPackage(index) {
      const pkg = this.options.packages[index];
      this.modalType = 'package';
      this.editingIndex = index;
      this.showModal = true;
      
      // 填入現有資料
      this.newOption = {
        label: pkg.label,
        value: pkg.value,
        color: "#FFFFFF",
        price: pkg.price || 0,
        category: pkg.category || "",
        packageName: pkg.packageName || "",
        accessoryName: "",
        content: pkg.content || "",
      };
    },
    closeModal() {
      this.showModal = false;
      this.modalType = "";
      this.editingIndex = null;
      this.newOption = {
        label: "",
        value: "",
        color: "#FFFFFF",
        price: 0,
        category: "",
        packageName: "",
        accessoryName: "",
        accessoryPrice: 0,
        content: "",
      };
    },
    onLabelChange() {
      // 對於禮服分類選項，選項值自動等於選項名稱
      if (this.modalType !== 'package') {
        this.newOption.value = this.newOption.label;
      }
    },
    generateAccessoryLabel() {
      // 自動生成配件選項名稱：分類｜配件名稱｜金額（如果有）
      if (this.modalType === 'accessory' && this.newOption.category && this.newOption.accessoryName) {
        // 自動生成顯示標籤
        if (this.newOption.accessoryPrice && this.newOption.accessoryPrice > 0) {
          this.newOption.label = `${this.newOption.category}｜${this.newOption.accessoryName}｜NT$ ${this.newOption.accessoryPrice.toLocaleString()}`;
        } else {
          this.newOption.label = `${this.newOption.category}｜${this.newOption.accessoryName}｜贈送`;
        }
        
        // 自動生成選項值（內部識別用）
        this.newOption.value = `${this.newOption.category}_${this.newOption.accessoryName}`;
      }
    },

    generatePackageLabel() {
      // 自動生成方案選項名稱：分類｜方案名稱｜方案價格
      if (this.modalType === 'package' && this.newOption.category && this.newOption.packageName && this.newOption.price) {
        // 自動生成顯示標籤
        this.newOption.label = `${this.newOption.category}｜${this.newOption.packageName}｜NT$ ${this.newOption.price.toLocaleString()}`;
        
        // 自動生成選項值（內部識別用）
        this.newOption.value = `${this.newOption.category}_${this.newOption.packageName}`;
      }
    },
    getModalTitle() {
      const titles = {
        color: "顏色選項",
        skirt: "裙型選項",
        sleeve: "袖型選項",
        neck: "領型選項",
        accessory: "配件選項",
        package: "方案選項",
      };
      return titles[this.modalType] || "選項";
    },
    async addOption() {
      try {
        this.saving = true;
        
        // 配件選項需要先驗證必填欄位並生成標籤
        if (this.modalType === 'accessory') {
          if (!this.newOption.category || !this.newOption.accessoryName) {
            this.showToast("請填寫所有必填欄位", "warning");
            return;
          }
          // 確保生成最新的標籤和值
          this.generateAccessoryLabel();
        }
        
        // 方案選項需要先驗證必填欄位並生成標籤
        if (this.modalType === 'package') {
          if (!this.newOption.category || !this.newOption.packageName || !this.newOption.price || !this.newOption.content) {
            this.showToast("請填寫所有必填欄位", "warning");
            return;
          }
          // 確保生成最新的標籤和值
          this.generatePackageLabel();
        }

        const optionData = {
          value: this.modalType === 'package' ? this.newOption.value : this.newOption.label,
          label: this.newOption.label,
        };

        if (this.modalType === "color") {
          optionData.color = this.newOption.color;
          if (this.newOption.color === "#FFFFFF") {
            optionData.border = "#E5E7EB";
          }
        } else if (this.modalType === "accessory") {
          optionData.category = this.newOption.category;
          optionData.accessoryName = this.newOption.accessoryName;
          optionData.accessoryPrice = this.newOption.accessoryPrice || 0;
        } else if (this.modalType === "package") {
          optionData.price = this.newOption.price;
          optionData.category = this.newOption.category;
          optionData.content = this.newOption.content;
          optionData.packageName = this.newOption.packageName;
        }

        const targetArray = this.getTargetArray();
        if (targetArray) {
          let success = false;
          
          if (this.editingIndex !== null) {
            // 編輯模式：更新現有選項
            success = optionsService.updateOption(this.getTypeKey(), this.editingIndex, optionData);
            if (success) {
              this.showToast("選項已更新", "success");
            } else {
              this.showToast("更新失敗", "error");
            }
          } else {
            // 新增模式：檢查重複並新增
            const exists = targetArray.some(
              (item) => item.value === optionData.value || item.label === optionData.label
            );
            if (exists) {
              this.showToast("該選項已存在", "warning");
              return;
            }

            success = optionsService.addOption(this.getTypeKey(), optionData);
            if (success) {
              this.showToast("選項已新增", "success");
            } else {
              this.showToast("新增失敗", "error");
            }
          }

          if (success) {
            this.loadOptions();
            this.closeModal();
          }
        }
      } catch (error) {
        console.error("處理選項失敗:", error);
        this.showToast("處理選項失敗，請稍後再試", "error");
      } finally {
        this.saving = false;
      }
    },
    removeOption(type, index) {
      if (confirm("確定要刪除此選項嗎？")) {
        const success = optionsService.removeOption(type, index);
        if (success) {
          this.showToast("選項已刪除", "info");
          this.loadOptions();
        } else {
          this.showToast("刪除失敗", "error");
        }
      }
    },
    getTargetArray() {
      const typeKey = this.getTypeKey();
      return this.options[typeKey];
    },
    getTypeKey() {
      const typeMap = {
        color: "colors",
        skirt: "skirts",
        sleeve: "sleeves",
        neck: "necks",
        accessory: "accessories",
        package: "packages",
      };
      return typeMap[this.modalType];
    },
    loadOptions() {
      this.options = optionsService.getAllOptions();
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
  mounted() {
    this.loadOptions();
  },
};
</script>

<style scoped>
.card {
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
}

.badge {
  transition: all 0.2s ease-in-out;
}

.badge:hover {
  transform: scale(1.05);
}

.btn-close-sm {
  font-size: 8px !important;
  width: 16px;
  height: 16px;
}

.form-control-color {
  padding: 0.25rem;
  border-radius: 0.375rem;
}

.modal {
  backdrop-filter: blur(4px);
}
</style>
