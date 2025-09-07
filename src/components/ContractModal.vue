<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
    >
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          {{ contract ? "編輯合約" : "新增合約" }}
        </h3>
      </div>

      <form @submit.prevent="handleSubmit" class="px-6 py-4">
        <!-- 基本資訊 -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-gray-900 mb-4">基本資訊</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 客戶姓名 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >客戶姓名</label
              >
              <input
                v-model="form.客戶姓名"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- 電話 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >電話</label
              >
              <input
                v-model="form.電話"
                type="tel"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Email</label
              >
              <input
                v-model="form.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- 三圍 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >三圍</label
              >
              <input
                v-model="form.三圍"
                type="text"
                placeholder="例如: 34-26-36"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- 承辦人 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >承辦人</label
              >
              <input
                v-model="form.承辦人"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- 處理狀態 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >處理狀態</label
              >
              <select
                v-model="form.處理狀態"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="待確認">待確認</option>
                <option value="已確認">已確認</option>
                <option value="進行中">進行中</option>
                <option value="已完成">已完成</option>
                <option value="已取消">已取消</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 使用期間 -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-gray-900 mb-4">使用期間</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >使用開始時間</label
              >
              <input
                v-model="form.使用開始時間"
                type="datetime-local"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >使用結束時間</label
              >
              <input
                v-model="form.使用結束時間"
                type="datetime-local"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- 禮服清單 -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-md font-medium text-gray-900">禮服清單</h4>
            <button
              type="button"
              @click="addDressItem"
              class="text-blue-600 hover:text-blue-800 text-sm"
            >
              + 新增禮服
            </button>
          </div>

          <div class="space-y-3">
            <div
              v-for="(item, index) in form.禮服清單"
              :key="index"
              class="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border border-gray-200 rounded-lg"
            >
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >禮服</label
                >
                <select
                  v-model="item.禮服ID"
                  @change="updateDressInfo(index)"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選擇禮服</option>
                  <option
                    v-for="dress in availableDresses"
                    :key="dress.id"
                    :value="dress.id"
                  >
                    {{ dress.編號 }} - NT$ {{ dress.價格 }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >數量</label
                >
                <input
                  v-model.number="item.數量"
                  type="number"
                  min="1"
                  required
                  @input="updateSubtotal(index)"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >單價</label
                >
                <input
                  v-model.number="item.單價"
                  type="number"
                  min="0"
                  required
                  @input="updateSubtotal(index)"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >小計</label
                >
                <input
                  :value="item.小計"
                  type="number"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div class="flex items-end">
                <button
                  type="button"
                  @click="removeDressItem(index)"
                  class="w-full px-3 py-2 text-red-600 hover:text-red-800 text-sm"
                >
                  移除
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 總金額 -->
        <div class="mb-6">
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex justify-between items-center">
              <span class="text-lg font-medium text-gray-900">合約總金額:</span>
              <span class="text-xl font-bold text-blue-600">
                NT$ {{ form.合約總金額.toLocaleString() }}
              </span>
            </div>
          </div>
        </div>

        <!-- 備註 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >備註</label
          >
          <textarea
            v-model="form.備注"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- 按鈕 -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-150"
          >
            取消
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-150"
          >
            {{ contract ? "更新" : "新增" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { dressService } from "../services/firestore.js";

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
      availableDresses: [],
      form: {
        客戶姓名: "",
        電話: "",
        email: "",
        三圍: "",
        承辦人: "",
        處理狀態: "待確認",
        使用開始時間: "",
        使用結束時間: "",
        禮服清單: [
          {
            禮服ID: "",
            數量: 1,
            單價: 0,
            小計: 0,
          },
        ],
        合約總金額: 0,
        備注: "",
      },
    };
  },
  watch: {
    contract: {
      immediate: true,
      handler(newContract) {
        if (newContract) {
          this.form = {
            客戶姓名: newContract.客戶姓名 || "",
            電話: newContract.電話 || "",
            email: newContract.email || "",
            三圍: newContract.三圍 || "",
            承辦人: newContract.承辦人 || "",
            處理狀態: newContract.處理狀態 || "待確認",
            使用開始時間: this.formatDateTimeLocal(newContract.使用開始時間),
            使用結束時間: this.formatDateTimeLocal(newContract.使用結束時間),
            禮服清單: newContract.禮服清單 || [
              {
                禮服ID: "",
                數量: 1,
                單價: 0,
                小計: 0,
              },
            ],
            合約總金額: newContract.合約總金額 || 0,
            備注: newContract.備注 || "",
          };
        } else {
          this.resetForm();
        }
      },
    },
  },
  async mounted() {
    await this.loadDresses();
  },
  methods: {
    async loadDresses() {
      try {
        this.availableDresses = await dressService.getAll();
      } catch (error) {
        console.error("載入禮服清單失敗:", error);
      }
    },
    resetForm() {
      this.form = {
        客戶姓名: "",
        電話: "",
        email: "",
        三圍: "",
        承辦人: "",
        處理狀態: "待確認",
        使用開始時間: "",
        使用結束時間: "",
        禮服清單: [
          {
            禮服ID: "",
            數量: 1,
            單價: 0,
            小計: 0,
          },
        ],
        合約總金額: 0,
        備注: "",
      };
    },
    addDressItem() {
      this.form.禮服清單.push({
        禮服ID: "",
        數量: 1,
        單價: 0,
        小計: 0,
      });
    },
    removeDressItem(index) {
      if (this.form.禮服清單.length > 1) {
        this.form.禮服清單.splice(index, 1);
        this.updateTotalAmount();
      }
    },
    updateDressInfo(index) {
      const item = this.form.禮服清單[index];
      const dress = this.availableDresses.find((d) => d.id === item.禮服ID);
      if (dress) {
        item.單價 = dress.價格 + (dress.加價金額 || 0);
        this.updateSubtotal(index);
      }
    },
    updateSubtotal(index) {
      const item = this.form.禮服清單[index];
      item.小計 = item.數量 * item.單價;
      this.updateTotalAmount();
    },
    updateTotalAmount() {
      this.form.合約總金額 = this.form.禮服清單.reduce(
        (sum, item) => sum + item.小計,
        0
      );
    },
    formatDateTimeLocal(date) {
      if (!date) return "";

      let dateObj;
      if (date.toDate) {
        dateObj = date.toDate();
      } else {
        dateObj = new Date(date);
      }

      // 格式化為 datetime-local 所需的格式
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const hours = String(dateObj.getHours()).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    handleSubmit() {
      // 轉換日期格式
      const formData = {
        ...this.form,
        使用開始時間: new Date(this.form.使用開始時間),
        使用結束時間: new Date(this.form.使用結束時間),
      };

      this.$emit("save", formData);
    },
  },
};
</script>
