<template>
  <div class="max-w-4xl mx-auto">
    <!-- 載入狀態 -->
    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
      <p class="mt-2 text-gray-600">載入中...</p>
    </div>

    <!-- 禮服詳情 -->
    <div
      v-else-if="dress"
      class="bg-white rounded-lg shadow-sm overflow-hidden"
    >
      <!-- 返回按鈕 -->
      <div class="px-6 py-4 border-b border-gray-200">
        <button
          @click="$router.back()"
          class="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-150"
        >
          <ArrowLeftIcon class="h-5 w-5 mr-2" />
          返回列表
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
        <!-- 圖片區域 -->
        <div>
          <div
            class="aspect-w-3 aspect-h-4 bg-gray-100 rounded-lg overflow-hidden mb-4"
          >
            <img
              v-if="currentImage"
              :src="currentImage"
              :alt="dress.編號"
              class="w-full h-96 object-cover"
            />
            <div
              v-else
              class="w-full h-96 bg-gray-200 flex items-center justify-center"
            >
              <SparklesIcon class="h-16 w-16 text-gray-400" />
            </div>
          </div>

          <!-- 圖片縮圖 -->
          <div
            v-if="dress.圖片 && dress.圖片.length > 1"
            class="flex space-x-2"
          >
            <button
              v-for="(image, index) in dress.圖片"
              :key="index"
              @click="currentImage = image"
              class="w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors duration-150"
              :class="[
                currentImage === image
                  ? 'border-blue-500'
                  : 'border-gray-200 hover:border-gray-300',
              ]"
            >
              <img
                :src="image"
                :alt="`圖片 ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <!-- 詳情區域 -->
        <div>
          <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              {{ dress.編號 }}
            </h1>
            <p class="text-2xl font-bold text-blue-600">
              NT$ {{ dress.價格.toLocaleString() }}
            </p>
            <p v-if="dress.加價金額 > 0" class="text-sm text-gray-600">
              加價金額: NT$ {{ dress.加價金額.toLocaleString() }}
            </p>
          </div>

          <!-- 規格資訊 -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 class="text-sm font-medium text-gray-500">顏色</h3>
              <p class="text-lg text-gray-900">{{ dress.顏色 }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">裙型</h3>
              <p class="text-lg text-gray-900">{{ dress.裙型 }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">袖型</h3>
              <p class="text-lg text-gray-900">{{ dress.袖型 }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">領型</h3>
              <p class="text-lg text-gray-900">{{ dress.領型 }}</p>
            </div>
          </div>

          <!-- 庫存狀態 -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-500 mb-2">庫存狀態</h3>
            <div class="flex items-center">
              <div
                class="w-3 h-3 rounded-full mr-2"
                :class="[dress.庫存數量 > 0 ? 'bg-green-400' : 'bg-red-400']"
              ></div>
              <span class="text-lg text-gray-900">
                {{
                  dress.庫存數量 > 0 ? `有庫存 (${dress.庫存數量} 件)` : "缺貨"
                }}
              </span>
            </div>
          </div>

          <!-- 備註 -->
          <div v-if="dress.備注" class="mb-6">
            <h3 class="text-sm font-medium text-gray-500 mb-2">備註</h3>
            <p class="text-gray-900 whitespace-pre-wrap">{{ dress.備注 }}</p>
          </div>

          <!-- 操作按鈕 -->
          <div class="flex space-x-3">
            <button
              @click="editDress"
              class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150"
            >
              編輯禮服
            </button>
            <button
              @click="deleteDress"
              class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-150"
            >
              刪除
            </button>
          </div>

          <!-- 建立時間 -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <p class="text-sm text-gray-500">
              建立時間: {{ formatDate(dress.創建時間) }}
            </p>
            <p v-if="dress.更新時間" class="text-sm text-gray-500">
              更新時間: {{ formatDate(dress.更新時間) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else class="text-center py-12">
      <SparklesIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">找不到禮服</h3>
      <p class="mt-1 text-sm text-gray-500">該禮服可能已被刪除或不存在</p>
      <div class="mt-6">
        <router-link
          to="/dresses"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150"
        >
          返回禮服清單
        </router-link>
      </div>
    </div>

    <!-- 編輯模態框 -->
    <DressModal
      v-if="showEditModal"
      :show="showEditModal"
      :dress="dress"
      @close="showEditModal = false"
      @save="saveDress"
    />
  </div>
</template>

<script>
import { ArrowLeftIcon, SparklesIcon } from "@heroicons/vue/24/outline";
import { dressService } from "../services/firestore.js";
import DressModal from "../components/DressModal.vue";

export default {
  name: "DressDetail",
  components: {
    ArrowLeftIcon,
    SparklesIcon,
    DressModal,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dress: null,
      loading: true,
      currentImage: null,
      showEditModal: false,
    };
  },
  async mounted() {
    await this.loadDress();
  },
  methods: {
    async loadDress() {
      try {
        this.loading = true;
        this.dress = await dressService.getById(this.id);

        // 設定預設顯示圖片
        if (this.dress.圖片 && this.dress.圖片.length > 0) {
          this.currentImage = this.dress.圖片[0];
        }
      } catch (error) {
        console.error("載入禮服詳情失敗:", error);
        this.dress = null;
      } finally {
        this.loading = false;
      }
    },
    editDress() {
      this.showEditModal = true;
    },
    async deleteDress() {
      if (!confirm(`確定要刪除禮服 "${this.dress.編號}" 嗎？`)) {
        return;
      }

      try {
        await dressService.delete(this.dress.id);
        alert("禮服已刪除");
        this.$router.push("/dresses");
      } catch (error) {
        console.error("刪除禮服失敗:", error);
        alert("刪除禮服失敗，請稍後再試");
      }
    },
    async saveDress(dressData) {
      try {
        await dressService.update(this.dress.id, dressData);
        alert("禮服已更新");
        await this.loadDress();
        this.showEditModal = false;
      } catch (error) {
        console.error("更新禮服失敗:", error);
        alert("更新禮服失敗，請稍後再試");
      }
    },
    formatDate(date) {
      if (!date) return "";
      if (date.toDate) {
        return date.toDate().toLocaleString("zh-TW");
      }
      return new Date(date).toLocaleString("zh-TW");
    },
  },
};
</script>
