<template>
  <div class="max-w-7xl mx-auto">
    <!-- 頁面標題和新增按鈕 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">禮服清單</h1>
      <button
        @click="showAddModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150"
      >
        新增禮服
      </button>
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
      <p class="mt-2 text-gray-600">載入中...</p>
    </div>

    <!-- 禮服網格 -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="dress in dresses"
        :key="dress.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-150"
      >
        <!-- 圖片 -->
        <div class="aspect-w-3 aspect-h-4 bg-gray-100">
          <img
            v-if="dress.圖片 && dress.圖片.length > 0"
            :src="dress.圖片[0]"
            :alt="dress.編號"
            class="w-full h-48 object-cover"
          />
          <div
            v-else
            class="w-full h-48 bg-gray-200 flex items-center justify-center"
          >
            <SparklesIcon class="h-12 w-12 text-gray-400" />
          </div>
        </div>

        <!-- 內容 -->
        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-medium text-gray-900">{{ dress.編號 }}</h3>
            <span class="text-lg font-bold text-blue-600"
              >NT$ {{ dress.價格.toLocaleString() }}</span
            >
          </div>

          <div class="space-y-1 text-sm text-gray-600 mb-3">
            <p><span class="font-medium">顏色:</span> {{ dress.顏色 }}</p>
            <p><span class="font-medium">裙型:</span> {{ dress.裙型 }}</p>
            <p><span class="font-medium">庫存:</span> {{ dress.庫存數量 }}</p>
          </div>

          <!-- 操作按鈕 -->
          <div class="flex space-x-2">
            <router-link
              :to="`/dresses/${dress.id}`"
              class="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded text-center text-sm font-medium hover:bg-blue-100 transition-colors duration-150"
            >
              查看詳情
            </router-link>
            <button
              @click="editDress(dress)"
              class="bg-gray-50 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors duration-150"
            >
              編輯
            </button>
            <button
              @click="deleteDress(dress)"
              class="bg-red-50 text-red-700 px-3 py-2 rounded text-sm font-medium hover:bg-red-100 transition-colors duration-150"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空狀態 -->
    <div v-if="!loading && dresses.length === 0" class="text-center py-12">
      <SparklesIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">沒有禮服</h3>
      <p class="mt-1 text-sm text-gray-500">開始新增您的第一件禮服</p>
      <div class="mt-6">
        <button
          @click="showAddModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150"
        >
          新增禮服
        </button>
      </div>
    </div>

    <!-- 新增/編輯模態框 -->
    <DressModal
      v-if="showAddModal || showEditModal"
      :show="showAddModal || showEditModal"
      :dress="editingDress"
      @close="closeModal"
      @save="saveDress"
    />
  </div>
</template>

<script>
import { SparklesIcon } from "@heroicons/vue/24/outline";
import { dressService } from "../services/firestore.js";
import DressModal from "../components/DressModal.vue";

export default {
  name: "DressList",
  components: {
    SparklesIcon,
    DressModal,
  },
  data() {
    return {
      dresses: [],
      loading: true,
      showAddModal: false,
      showEditModal: false,
      editingDress: null,
    };
  },
  async mounted() {
    await this.loadDresses();
  },
  methods: {
    async loadDresses() {
      try {
        this.loading = true;
        this.dresses = await dressService.getAll();
      } catch (error) {
        console.error("載入禮服清單失敗:", error);
        alert("載入禮服清單失敗，請稍後再試");
      } finally {
        this.loading = false;
      }
    },
    editDress(dress) {
      this.editingDress = { ...dress };
      this.showEditModal = true;
    },
    async deleteDress(dress) {
      if (!confirm(`確定要刪除禮服 "${dress.編號}" 嗎？`)) {
        return;
      }

      try {
        await dressService.delete(dress.id);
        await this.loadDresses();
        alert("禮服已刪除");
      } catch (error) {
        console.error("刪除禮服失敗:", error);
        alert("刪除禮服失敗，請稍後再試");
      }
    },
    async saveDress(dressData) {
      try {
        if (this.editingDress && this.editingDress.id) {
          // 編輯模式
          await dressService.update(this.editingDress.id, dressData);
          alert("禮服已更新");
        } else {
          // 新增模式
          await dressService.create(dressData);
          alert("禮服已新增");
        }

        await this.loadDresses();
        this.closeModal();
      } catch (error) {
        console.error("儲存禮服失敗:", error);
        alert("儲存禮服失敗，請稍後再試");
      }
    },
    closeModal() {
      this.showAddModal = false;
      this.showEditModal = false;
      this.editingDress = null;
    },
  },
};
</script>
