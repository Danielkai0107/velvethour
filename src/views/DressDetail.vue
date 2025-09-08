<template>
  <div class="container-fluid">
    <!-- 返回按鈕 -->
    <div class="mb-4">
      <button
        @click="$router.back()"
        class="btn btn-outline-secondary"
        style="font-size: 14px"
      >
        <i class="bi bi-arrow-left me-2"></i>返回列表
      </button>
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
      <p class="mt-2 text-muted">載入中...</p>
    </div>

    <!-- 禮服詳情 -->
    <div v-else-if="dress" class="row">
      <div class="col-12">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4">
            <!-- 1. 圖片 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">禮服圖片</h5>

              <!-- 主圖片 -->
              <div class="mb-3">
                <div
                  class="bg-light rounded overflow-hidden d-flex align-items-center justify-content-center"
                  style="max-width: 500px; min-height: 400px"
                >
                  <img
                    v-if="currentImage"
                    :src="currentImage"
                    :alt="dress.編號"
                    class="img-fluid rounded"
                    style="
                      max-width: 100%;
                      max-height: 500px;
                      width: auto;
                      height: auto;
                      object-fit: contain;
                    "
                  />
                  <div
                    v-else
                    class="d-flex align-items-center justify-content-center bg-light w-100 h-100"
                    style="min-height: 400px"
                  >
                    <i
                      class="bi bi-image text-muted"
                      style="font-size: 4rem"
                    ></i>
                  </div>
                </div>
              </div>

              <!-- 圖片縮圖 -->
              <div
                v-if="dress.圖片 && dress.圖片.length > 1"
                class="d-flex gap-2 flex-wrap"
              >
                <button
                  v-for="(image, index) in dress.圖片"
                  :key="index"
                  @click="currentImage = image"
                  class="btn p-1 border rounded overflow-hidden"
                  :class="
                    currentImage === image
                      ? 'border-primary border-2'
                      : 'border-secondary'
                  "
                  style="width: 70px; height: 70px"
                >
                  <img
                    :src="image"
                    :alt="`圖片 ${index + 1}`"
                    class="w-100 h-100 rounded"
                    style="object-fit: contain"
                  />
                </button>
              </div>
            </div>

            <!-- 2. 禮服編號 -->
            <div class="mb-4">
              <h5 class="card-title mb-2">禮服編號</h5>
              <h2 class="text-primary fw-bold">{{ dress.編號 }}</h2>
            </div>

            <!-- 3. 規格 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">規格資訊</h5>
              <div class="row g-3">
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">顏色</small>
                    <strong class="text-dark">{{ dress.顏色 }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">裙型</small>
                    <strong class="text-dark">{{ dress.裙型 }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">袖型</small>
                    <strong class="text-dark">{{ dress.袖型 }}</strong>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="border rounded p-3 h-100">
                    <small class="text-muted d-block">領型</small>
                    <strong class="text-dark">{{ dress.領型 }}</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4. 金額 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">金額資訊</h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="border rounded p-3">
                    <small class="text-muted d-block">租借金額</small>
                    <h4 class="text-primary fw-bold mb-0">
                      NT$
                      {{ (dress.租借金額 || dress.價格 || 0).toLocaleString() }}
                    </h4>
                  </div>
                </div>
                <div
                  class="col-md-6"
                  v-if="dress.加價金額 && dress.加價金額 > 0"
                >
                  <div class="border rounded p-3">
                    <small class="text-muted d-block">加價金額</small>
                    <h5 class="text-warning fw-bold mb-0">
                      + NT$ {{ dress.加價金額.toLocaleString() }}
                    </h5>
                  </div>
                </div>
              </div>
            </div>

            <!-- 5. 庫存 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">庫存狀態</h5>
              <div class="border rounded p-3">
                <div class="d-flex align-items-center">
                  <div
                    class="rounded-circle me-3"
                    style="width: 12px; height: 12px"
                    :class="dress.庫存數量 > 0 ? 'bg-success' : 'bg-danger'"
                  ></div>
                  <div>
                    <strong class="text-dark">
                      {{ dress.庫存數量 > 0 ? `有庫存` : "缺貨" }}
                    </strong>
                    <span class="text-muted ms-2"
                      >({{ dress.庫存數量 || 0 }} 件)</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- 6. 備註 -->
            <div class="mb-4" v-if="dress.備註 || dress.備注">
              <h5 class="card-title mb-3">備註</h5>
              <div class="border rounded p-3">
                <p class="mb-0 text-dark" style="white-space: pre-wrap">
                  {{ dress.備註 || dress.備注 }}
                </p>
              </div>
            </div>

            <!-- 7. 租用檔期 -->
            <div class="mb-4">
              <div
                class="d-flex justify-content-between align-items-center mb-3"
              >
                <h5 class="card-title mb-0">租用檔期</h5>
                <div class="d-flex align-items-center gap-3">
                  <div class="d-flex align-items-center">
                    <label class="form-label text-muted small mb-0 me-2"
                      >檢查日期衝突：</label
                    >
                    <input
                      v-model="conflictCheckDate"
                      type="date"
                      class="form-control form-control-sm"
                      style="width: 150px"
                      @change="checkDateConflict"
                    />
                  </div>
                </div>
              </div>

              <!-- 衝突檢查結果 -->
              <div v-if="conflictCheckResult" class="mb-3">
                <div
                  :class="[
                    'alert alert-sm',
                    conflictCheckResult.hasConflict
                      ? 'alert-danger'
                      : 'alert-success',
                  ]"
                  style="padding: 8px 12px"
                >
                  <div class="d-flex align-items-center">
                    <i
                      :class="[
                        'me-2',
                        conflictCheckResult.hasConflict
                          ? 'bi bi-exclamation-triangle'
                          : 'bi bi-check-circle',
                      ]"
                    ></i>
                    <div class="flex-grow-1">
                      <strong>{{
                        conflictCheckResult.hasConflict ? "檔期衝突" : "無衝突"
                      }}</strong>
                      <div class="small mt-1">
                        檢查日期：{{
                          formatDateOnly(conflictCheckDate)
                        }}
                        (前後4天：{{
                          formatDateOnly(conflictCheckResult.startRange)
                        }}
                        ~ {{ formatDateOnly(conflictCheckResult.endRange) }})
                      </div>
                      <div
                        v-if="
                          conflictCheckResult.hasConflict &&
                          conflictCheckResult.conflicts.length > 0
                        "
                        class="small mt-2"
                      >
                        <div class="fw-semibold text-danger mb-1">
                          衝突的租用檔期：
                        </div>
                        <div
                          v-for="conflict in conflictCheckResult.conflicts"
                          :key="conflict.合約ID"
                          class="mb-1"
                        >
                          • {{ conflict.合約單號 }} ({{ conflict.客戶姓名 }}):
                          {{ formatDateOnly(conflict.租用開始時間) }} ~
                          {{ formatDateOnly(conflict.租用結束時間) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 載入狀態 -->
              <div v-if="loadingSchedule" class="text-center py-3">
                <div
                  class="spinner-border spinner-border-sm text-primary"
                  role="status"
                >
                  <span class="visually-hidden">載入中...</span>
                </div>
                <span class="ms-2 text-muted">載入租用檔期中...</span>
              </div>

              <!-- 租用檔期表格 -->
              <div
                v-else-if="rentalSchedule.length > 0"
                class="border rounded p-3"
              >
                <div class="table-responsive">
                  <table
                    class="table table-sm mb-0"
                    style="border-collapse: separate; border-spacing: 0"
                  >
                    <thead>
                      <tr>
                        <th
                          class="border-0 fw-normal text-muted small text-start py-3"
                        >
                          合約單號
                        </th>
                        <th
                          class="border-0 fw-normal text-muted small text-start py-3"
                        >
                          客戶姓名
                        </th>
                        <th
                          class="border-0 fw-normal text-muted small text-start py-3"
                        >
                          租用開始時間
                        </th>
                        <th
                          class="border-0 fw-normal text-muted small text-start py-3"
                        >
                          租用結束時間
                        </th>
                        <th
                          class="border-0 fw-normal text-muted small text-start py-3"
                        >
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="schedule in rentalSchedule"
                        :key="schedule.合約ID"
                      >
                        <td class="border-0 small text-start py-4">
                          <strong class="text-primary">{{
                            schedule.合約單號
                          }}</strong>
                        </td>
                        <td class="border-0 small text-start py-4">
                          {{ schedule.客戶姓名 }}
                        </td>
                        <td class="border-0 small text-start py-4">
                          <span class="text-muted d-block">{{
                            formatDateTime(schedule.租用開始時間)
                          }}</span>
                        </td>
                        <td class="border-0 small text-start py-4">
                          <span class="text-muted d-block">{{
                            formatDateTime(schedule.租用結束時間)
                          }}</span>
                        </td>
                        <td class="border-0 small text-start py-4">
                          <router-link
                            :to="`/contracts/${schedule.合約ID}`"
                            class="text-primary text-decoration-underline"
                            style="font-size: 12px"
                          >
                            查看
                          </router-link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- 無租用檔期 -->
              <div v-else class="text-center py-4">
                <i class="bi bi-calendar-x display-4 text-muted"></i>
                <h6 class="mt-2 text-muted">目前沒有租用檔期</h6>
                <p class="text-muted small">此禮服尚未被任何合約租用</p>
              </div>
            </div>

            <!-- 8. 新增＆編輯時間 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">時間記錄</h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="border rounded p-3">
                    <small class="text-muted d-block">新增時間</small>
                    <strong class="text-dark">{{
                      formatDate(dress.新增時間戳 || dress.創建時間)
                    }}</strong>
                  </div>
                </div>
                <div class="col-md-6" v-if="dress.更新時間">
                  <div class="border rounded p-3">
                    <small class="text-muted d-block">最後編輯時間</small>
                    <strong class="text-dark">{{
                      formatDate(dress.更新時間)
                    }}</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- 操作按鈕 -->
            <div class="d-flex gap-3 justify-content-end mt-4 pt-3 border-top">
              <button @click="editDress" class="btn btn-primary">
                <i class="bi bi-pencil-square me-2"></i>編輯禮服
              </button>
              <button @click="deleteDress" class="btn btn-outline-danger">
                <i class="bi bi-trash me-2"></i>刪除禮服
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else class="text-center py-5">
      <i class="bi bi-gem display-1 text-muted"></i>
      <h3 class="mt-3 text-muted">找不到禮服</h3>
      <p class="mt-1 text-muted">該禮服可能已被刪除或不存在</p>
      <div class="mt-4">
        <router-link to="/dresses" class="btn btn-primary">
          <i class="bi bi-arrow-left me-2"></i>返回禮服清單
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
import { dressService } from "../services/firestore.js";
import DressModal from "../components/DressModal.vue";

export default {
  name: "DressDetail",
  components: {
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
      rentalSchedule: [],
      loadingSchedule: false,
      conflictCheckDate: "",
      conflictCheckResult: null,
    };
  },
  async mounted() {
    await this.loadDress();
    await this.loadRentalSchedule();
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
        this.showToast("載入禮服詳情失敗，請稍後再試", "error");
        this.dress = null;
      } finally {
        this.loading = false;
      }
    },
    editDress() {
      this.showEditModal = true;
    },
    async deleteDress() {
      // 租用 Bootstrap Modal 確認對話框
      if (
        !confirm(`確定要刪除禮服 "${this.dress.編號}" 嗎？\n\n此操作無法復原！`)
      ) {
        return;
      }

      try {
        await dressService.delete(this.dress.id);
        this.showToast("禮服已刪除", "success");

        // 延遲跳轉，讓用戶看到成功訊息
        setTimeout(() => {
          this.$router.push("/dresses");
        }, 1500);
      } catch (error) {
        console.error("刪除禮服失敗:", error);
        this.showToast("刪除禮服失敗，請稍後再試", "error");
      }
    },
    async saveDress(dressData) {
      try {
        await dressService.update(this.dress.id, dressData);
        this.showToast("禮服已更新", "success");
        await this.loadDress();
        this.showEditModal = false;
      } catch (error) {
        console.error("更新禮服失敗:", error);
        this.showToast("更新禮服失敗，請稍後再試", "error");
      }
    },
    async loadRentalSchedule() {
      try {
        this.loadingSchedule = true;
        this.rentalSchedule = await dressService.getRentalSchedule(this.id);
      } catch (error) {
        console.error("載入租用檔期失敗:", error);
        this.showToast("載入租用檔期失敗，請稍後再試", "error");
        this.rentalSchedule = [];
      } finally {
        this.loadingSchedule = false;
      }
    },
    formatDate(date) {
      if (!date) return "未設定";

      let dateObj;
      if (date.toDate && typeof date.toDate === "function") {
        // Firebase Timestamp
        dateObj = date.toDate();
      } else if (date instanceof Date) {
        // JavaScript Date
        dateObj = date;
      } else {
        // String or other format
        dateObj = new Date(date);
      }

      return dateObj.toLocaleString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    },
    formatDateTime(date) {
      if (!date) return "未設定";

      let dateObj;
      if (date.toDate && typeof date.toDate === "function") {
        // Firebase Timestamp
        dateObj = date.toDate();
      } else if (date instanceof Date) {
        // JavaScript Date
        dateObj = date;
      } else {
        // String or other format
        dateObj = new Date(date);
      }

      return dateObj.toLocaleString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        weekday: "short",
        hour12: false,
      });
    },

    // 檢查日期衝突
    checkDateConflict() {
      if (!this.conflictCheckDate) {
        this.conflictCheckResult = null;
        return;
      }

      try {
        console.log("開始檢查日期衝突:", this.conflictCheckDate);
        console.log("租用檔期資料:", this.rentalSchedule);

        const checkDate = new Date(this.conflictCheckDate);

        // 計算前後4天的範圍
        const startRange = new Date(checkDate);
        startRange.setDate(checkDate.getDate() - 4);

        const endRange = new Date(checkDate);
        endRange.setDate(checkDate.getDate() + 4);

        console.log("檢查範圍:", {
          startRange: startRange,
          endRange: endRange,
          checkDate: checkDate,
        });

        // 檢查與現有檔期的衝突
        const conflicts = this.rentalSchedule.filter((schedule) => {
          // 跳過已取消的合約
          if (schedule.處理狀態 === "已取消") {
            return false;
          }

          let scheduleStart, scheduleEnd;

          // 處理不同格式的時間
          if (
            schedule.租用開始時間 &&
            schedule.租用開始時間.toDate &&
            typeof schedule.租用開始時間.toDate === "function"
          ) {
            scheduleStart = schedule.租用開始時間.toDate();
          } else if (schedule.租用開始時間 instanceof Date) {
            scheduleStart = schedule.租用開始時間;
          } else if (schedule.租用開始時間) {
            scheduleStart = new Date(schedule.租用開始時間);
          } else {
            console.warn("租用開始時間為空:", schedule);
            return false;
          }

          if (
            schedule.租用結束時間 &&
            schedule.租用結束時間.toDate &&
            typeof schedule.租用結束時間.toDate === "function"
          ) {
            scheduleEnd = schedule.租用結束時間.toDate();
          } else if (schedule.租用結束時間 instanceof Date) {
            scheduleEnd = schedule.租用結束時間;
          } else if (schedule.租用結束時間) {
            scheduleEnd = new Date(schedule.租用結束時間);
          } else {
            console.warn("租用結束時間為空:", schedule);
            return false;
          }

          // 將現有檔期也轉換為純日期
          const scheduleStartDate = new Date(
            scheduleStart.getFullYear(),
            scheduleStart.getMonth(),
            scheduleStart.getDate()
          );
          const scheduleEndDate = new Date(
            scheduleEnd.getFullYear(),
            scheduleEnd.getMonth(),
            scheduleEnd.getDate()
          );

          console.log("檢查檔期:", {
            合約單號: schedule.合約單號,
            scheduleStartDate: scheduleStartDate,
            scheduleEndDate: scheduleEndDate,
            checkStartDate: checkStartDate,
            checkEndDate: checkEndDate,
            isOverlap: !(
              checkEndDate < scheduleStartDate ||
              checkStartDate > scheduleEndDate
            ),
            說明: "只檢查日期重疊，不考慮具體時間",
          });

          // 檢查日期範圍是否重疊 (只看日期)
          return !(
            checkEndDate < scheduleStartDate || checkStartDate > scheduleEndDate
          );
        });

        console.log("衝突結果:", conflicts);

        this.conflictCheckResult = {
          hasConflict: conflicts.length > 0,
          conflicts: conflicts,
          startRange: startRange,
          endRange: endRange,
        };
      } catch (error) {
        console.error("檢查日期衝突失敗:", error);
        this.showToast("檢查日期衝突失敗: " + error.message, "error");
      }
    },

    // 格式化日期（只顯示日期部分）
    formatDateOnly(date) {
      if (!date) return "未設定";

      let dateObj;
      if (typeof date === "string") {
        dateObj = new Date(date);
      } else if (date.toDate && typeof date.toDate === "function") {
        // Firebase Timestamp
        dateObj = date.toDate();
      } else if (date instanceof Date) {
        // JavaScript Date
        dateObj = date;
      } else {
        // String or other format
        dateObj = new Date(date);
      }

      return dateObj.toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
      });
    },

    showToast(message, type = "info") {
      // 簡單的 toast 通知實現
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
