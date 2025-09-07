<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
    >
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          {{ dress ? "編輯禮服" : "新增禮服" }}
        </h3>
      </div>

      <form @submit.prevent="handleSubmit" class="px-6 py-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 編號 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >編號</label
            >
            <input
              v-model="form.編號"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- 價格 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >價格</label
            >
            <input
              v-model.number="form.價格"
              type="number"
              required
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- 顏色 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >顏色</label
            >
            <input
              v-model="form.顏色"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- 裙型 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >裙型</label
            >
            <select
              v-model="form.裙型"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">請選擇裙型</option>
              <option value="A字裙">A字裙</option>
              <option value="魚尾裙">魚尾裙</option>
              <option value="公主裙">公主裙</option>
              <option value="直筒裙">直筒裙</option>
              <option value="蓬蓬裙">蓬蓬裙</option>
            </select>
          </div>

          <!-- 袖型 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >袖型</label
            >
            <select
              v-model="form.袖型"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">請選擇袖型</option>
              <option value="無袖">無袖</option>
              <option value="短袖">短袖</option>
              <option value="長袖">長袖</option>
              <option value="七分袖">七分袖</option>
              <option value="一字肩">一字肩</option>
            </select>
          </div>

          <!-- 領型 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >領型</label
            >
            <select
              v-model="form.領型"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">請選擇領型</option>
              <option value="圓領">圓領</option>
              <option value="V領">V領</option>
              <option value="一字領">一字領</option>
              <option value="高領">高領</option>
              <option value="心形領">心形領</option>
            </select>
          </div>

          <!-- 加價金額 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >加價金額</label
            >
            <input
              v-model.number="form.加價金額"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- 庫存數量 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >庫存數量</label
            >
            <input
              v-model.number="form.庫存數量"
              type="number"
              required
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- 圖片URL -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >圖片URL</label
          >
          <div class="space-y-2">
            <div
              v-for="(url, index) in form.圖片"
              :key="index"
              class="flex space-x-2"
            >
              <input
                v-model="form.圖片[index]"
                type="url"
                placeholder="請輸入圖片URL"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                @click="removeImage(index)"
                class="px-3 py-2 text-red-600 hover:text-red-800"
              >
                移除
              </button>
            </div>
            <button
              type="button"
              @click="addImage"
              class="text-blue-600 hover:text-blue-800 text-sm"
            >
              + 新增圖片
            </button>
          </div>
        </div>

        <!-- 備註 -->
        <div class="mt-4">
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
        <div
          class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200"
        >
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
            {{ dress ? "更新" : "新增" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "DressModal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    dress: {
      type: Object,
      default: null,
    },
  },
  emits: ["close", "save"],
  data() {
    return {
      form: {
        編號: "",
        圖片: [""],
        價格: 0,
        顏色: "",
        裙型: "",
        袖型: "",
        領型: "",
        加價金額: 0,
        備注: "",
        庫存數量: 1,
      },
    };
  },
  watch: {
    dress: {
      immediate: true,
      handler(newDress) {
        if (newDress) {
          this.form = {
            編號: newDress.編號 || "",
            圖片:
              newDress.圖片 && newDress.圖片.length > 0
                ? [...newDress.圖片]
                : [""],
            價格: newDress.價格 || 0,
            顏色: newDress.顏色 || "",
            裙型: newDress.裙型 || "",
            袖型: newDress.袖型 || "",
            領型: newDress.領型 || "",
            加價金額: newDress.加價金額 || 0,
            備注: newDress.備注 || "",
            庫存數量: newDress.庫存數量 || 1,
          };
        } else {
          this.resetForm();
        }
      },
    },
  },
  methods: {
    resetForm() {
      this.form = {
        編號: "",
        圖片: [""],
        價格: 0,
        顏色: "",
        裙型: "",
        袖型: "",
        領型: "",
        加價金額: 0,
        備注: "",
        庫存數量: 1,
      };
    },
    addImage() {
      this.form.圖片.push("");
    },
    removeImage(index) {
      if (this.form.圖片.length > 1) {
        this.form.圖片.splice(index, 1);
      }
    },
    handleSubmit() {
      // 過濾空的圖片URL
      const formData = {
        ...this.form,
        圖片: this.form.圖片.filter((url) => url.trim() !== ""),
      };

      this.$emit("save", formData);
    },
  },
};
</script>
