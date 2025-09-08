<template>
  <!-- Bootstrap Modal -->
  <div
    v-if="show"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
    @click.self="$emit('close')"
  >
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title">
            {{ contract ? "編輯合約" : "新增合約" }}
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <!-- 禮服清單 -->
            <div class="mb-4">
              <div
                class="d-flex justify-content-between align-items-center mb-3"
              >
                <h5 class="fw-semibold mb-0">禮服清單
                </h5>
                <div class="d-flex gap-2">
                  <button
                    v-if="!contract && cartService.getItemCount() > 0"
                    @click="loadCartItems"
                    type="button"
                    class="btn btn-outline-primary btn-sm"
                  >
                    載入購物車 ({{ cartService.getItemCount() }})
                  </button>
                  <button
                    v-if="hasCartItems"
                    @click="clearCartItems"
                    type="button"
                    class="btn btn-outline-danger btn-sm"
                  >
             
                    清空購物車
                  </button>
                  <button
                    type="button"
                    @click="showDressSelectionModal = true"
                    class="btn btn-primary btn-sm"
                  >
                    <i class="bi bi-plus-lg me-1"></i>新增禮服
                  </button>
                </div>
              </div>

              <!-- 禮服圖卡展示 -->
              <div
                class="row g-3 mb-3"
                style="max-height: 500px; overflow-y: auto; padding: 8px"
              >
                <div
                  v-for="(item, index) in formData.禮服清單"
                  :key="`dress-item-${index}-${item.禮服ID || 'empty'}`"
                  class="col-lg-4 col-md-6"
                >
                  <!-- 已選擇的禮服卡片 -->
                  <div
                    v-if="item.禮服ID"
                    class="card h-100 shadow-sm border-0 position-relative"
                  >
                    <!-- 圖片 -->
                    <div
                      class="card-img-top position-relative bg-light d-flex align-items-center justify-content-center"
                      style="height: 200px; overflow: hidden"
                    >
                      <img
                        v-if="
                          getDressById(item.禮服ID)?.圖片 &&
                          getDressById(item.禮服ID).圖片.length > 0
                        "
                        :src="getDressById(item.禮服ID).圖片[0]"
                        :alt="getDressById(item.禮服ID).編號"
                        class="img-fluid"
                        style="
                          max-width: 100%;
                          max-height: 100%;
                          width: auto;
                          height: auto;
                          object-fit: contain;
                          cursor: pointer;
                        "
                        @click="viewDressDetail(item.禮服ID)"
                      />
                      <div
                        v-else
                        class="w-100 h-100 bg-light d-flex align-items-center justify-content-center"
                        style="cursor: pointer"
                        @click="viewDressDetail(item.禮服ID)"
                      >
                        <i
                          class="bi bi-image text-muted"
                          style="font-size: 2rem"
                        ></i>
                      </div>

                      <!-- 刪除按鈕 -->
                      <button
                        type="button"
                        @click="removeDressItem(index)"
                        class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                        style="z-index: 10"
                        :title="
                          '移除 ' +
                          (getDressById(item.禮服ID)?.編號 || '此禮服')
                        "
                      >
                        <i class="bi bi-x-lg"></i>
                      </button>
                    </div>

                    <!-- 卡片內容 -->
                    <div class="card-body p-3">
                      <h6 class="card-title fw-bold mb-2">
                        {{ getDressById(item.禮服ID)?.編號 }}
                      </h6>
                      <p class="card-text text-muted small mb-2">
                        {{ getDressById(item.禮服ID)?.顏色 }} |
                        {{ getDressById(item.禮服ID)?.裙型 }} |
                        {{ getDressById(item.禮服ID)?.袖型 }} |
                        {{ getDressById(item.禮服ID)?.領型 }}
                      </p>

                      <!-- 數量和價格控制 -->
                      <div class="row g-2 mb-2">
                        <div class="col-6">
                          <label class="form-label small mb-1">數量</label>
                          <input
                            v-model.number="item.數量"
                            type="number"
                            class="form-control form-control-sm"
                            min="1"
                            @input="updateQuantityAndCalculate(index)"
                          />
                        </div>
                        <div class="col-6">
                          <label class="form-label small mb-1">單價</label>
                          <input
                            v-model.number="item.單價"
                            type="number"
                            class="form-control form-control-sm"
                            min="0"
                            @input="calculateSubtotal(index)"
                          />
                        </div>
                      </div>

                      <!-- 小計 -->
                      <div
                        class="d-flex justify-content-between align-items-center"
                      >
                        <small class="text-muted">小計</small>
                        <span class="fw-bold text-primary"
                          >NT$ {{ (item.小計 || 0).toLocaleString() }}</span
                        >
                      </div>

                      <!-- 查看詳情按鈕 -->
                      <div class="d-grid gap-1 mt-2">
                        <button
                          type="button"
                          @click="viewDressDetail(item.禮服ID)"
                          class="btn btn-outline-primary btn-sm"
                        >
                          <i class="bi bi-eye me-1"></i>查看詳情
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- 空的禮服選擇卡片 - 隱藏 -->
                  <!-- 已移除空的禮服選擇卡片，改為使用popup選擇 -->
                </div>
              </div>

              <!-- 總金額顯示 -->
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">計算總金額
                  </label>
                  <input
                    :value="calculateTotal()"
                    type="number"
                    class="form-control"
                    readonly
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">合約總金額 (NT$) *
                  </label>
                  <input
                    v-model.number="formData.合約總金額"
                    type="number"
                    class="form-control"
                    required
                    min="0"
                    placeholder="例: 50000"
                  />
                  <div class="form-text">可手動調整最終金額</div>
                </div>
              </div>
            </div>

            <!-- 基本資訊 -->
            <div class="mb-4">
              <h5 class="fw-semibold mb-3">客戶資訊
              </h5>
              <div class="row g-3">
                <!-- 客戶姓名 -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">客戶姓名 *
                  </label>
                  <input
                    v-model="formData.客戶姓名"
                    type="text"
                    class="form-control"
                    required
                    placeholder="例: 張小姐"
                  />
                </div>

                <!-- 電話 -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">電話 *
                  </label>
                  <input
                    v-model="formData.電話"
                    type="tel"
                    class="form-control"
                    required
                    placeholder="例: 0912-345-678"
                  />
                </div>

                <!-- Email -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Email
                  </label>
                  <input
                    v-model="formData.email"
                    type="email"
                    class="form-control"
                    placeholder="例: customer@example.com"
                  />
                </div>

                <!-- 三圍 -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">三圍
                  </label>
                  <input
                    v-model="formData.三圍"
                    type="text"
                    class="form-control"
                    placeholder="例: 32B-24-35"
                  />
                </div>

                <!-- 承辦人 -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">承辦人 *
                  </label>
                  <select
                    v-model="formData.承辦人"
                    class="form-select"
                    required
                  >
                    <option value="">請選擇承辦人</option>
                    <option
                      v-for="staff in availableStaff.filter(
                        (s) => s.狀態 === '在職'
                      )"
                      :key="staff.id"
                      :value="staff.姓名"
                    >
                      {{ staff.姓名 }} ({{ staff.職位 }})
                    </option>
                  </select>
                  <div class="form-text">只顯示在職的承辦人</div>
                </div>

                <!-- 處理狀態 -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">處理狀態 *
                  </label>
                  <select
                    v-model="formData.處理狀態"
                    class="form-select"
                    required
                  >
                    <option value="">請選擇狀態</option>
                    <option value="待確認">待確認</option>
                    <option value="已確認">已確認</option>
                    <option value="進行中">進行中</option>
                    <option value="已完成">已完成</option>
                    <option value="已取消">已取消</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 租用時間 -->
            <div class="mb-4">
              <h5 class="fw-semibold mb-3">租用時間
              </h5>
              <div class="row g-3">
                <!-- 租用開始時間 -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">租用開始時間 *
                  </label>
                  <input
                    v-model="formData.租用開始時間"
                    type="datetime-local"
                    class="form-control"
                    required
                    @change="onStartTimeChange"
                  />
                </div>

                <!-- 租用結束時間 -->
                <div class="col-md-6">
                  <label class="form-label fw-semibold">租用結束時間 *
                  </label>
                  <input
                    v-model="formData.租用結束時間"
                    type="datetime-local"
                    class="form-control"
                    required
                    @change="onTimeOrDressChange"
                  />
                </div>
              </div>

              <!-- 時間範圍驗證錯誤 -->
              <div
                v-if="
                  !isValidTimeRange &&
                  formData.租用開始時間 &&
                  formData.租用結束時間
                "
                class="alert alert-warning mb-3 mt-3"
              >
                <div class="d-flex align-items-center">
                  <span>租用結束時間必須晚於開始時間</span>
                </div>
              </div>

              <!-- 檔期衝突狀態 -->
              <div v-if="checkingConflicts" class="alert alert-info mb-3 mt-3">
                <div class="d-flex align-items-center">
                  <div
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                  >
                    <span class="visually-hidden">檢查中...</span>
                  </div>
                  <span>正在檢查禮服檔期衝突...</span>
                </div>
              </div>

              <!-- 檔期衝突警告 -->
              <div
                v-else-if="conflictWarnings.length > 0"
                class="alert alert-danger mb-3 mt-3"
              >
                <h6 class="alert-heading">
                  <i class="bi bi-exclamation-triangle me-2"></i>檔期衝突警告
                </h6>
                <div
                  v-for="warning in conflictWarnings"
                  :key="warning.禮服ID"
                  class="mb-2"
                >
                  <strong>{{ warning.禮服編號 }}</strong
                  >:
                  {{ warning.message }}
                  <br />
                  <small class="text-muted">
                    衝突合約: {{ warning.conflictContract.合約單號 }} ({{
                      warning.conflictContract.客戶姓名
                    }},
                    {{
                      formatDateTimeShort(warning.conflictContract.租用開始時間)
                    }}
                    -
                    {{
                      formatDateTimeShort(
                        warning.conflictContract.租用結束時間
                      )
                    }})
                  </small>
                </div>
              </div>

              <!-- 檔期檢查成功 -->
              <div
                v-else-if="hasValidTimeAndDresses && !checkingConflicts"
                class="alert alert-success mb-3 mt-3"
              >
                <div class="d-flex align-items-center">
                  <i class="bi bi-check-circle me-2"></i>
                  <span>所選禮服在指定時間段內可用</span>
                </div>
              </div>

              <!-- 輸入提示 -->
              <div
                v-else-if="!hasValidTimeAndDresses && !checkingConflicts"
                class="alert alert-light mb-3 mt-3"
              >
                <div class="d-flex align-items-center">
                  <i class="bi bi-info-circle me-2 text-muted"></i>
                  <span class="text-muted">
                    <template
                      v-if="!formData.租用開始時間 || !formData.租用結束時間"
                    >
                      請先設定租用時間，
                    </template>
                    <template
                      v-if="!formData.禮服清單.some((item) => item.禮服ID)"
                    >
                      然後選擇禮服，系統將自動檢查檔期衝突
                    </template>
                  </span>
                </div>
              </div>
            </div>

            <!-- 備註 -->
            <div class="mb-3">
              <label class="form-label fw-semibold">備註
              </label>
              <textarea
                v-model="formData.備注"
                class="form-control"
                rows="3"
                placeholder="合約相關備註或特殊說明..."
              ></textarea>
            </div>

            <!-- 新增時間戳 (顯示用，不可編輯) -->
            <div class="mb-3" v-if="formData.創建時間">
              <label class="form-label fw-semibold">建立時間
              </label>
              <input
                :value="formatTimestamp(formData.創建時間)"
                type="text"
                class="form-control"
                readonly
                disabled
              />
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="$emit('close')"
          >
            <i class="bi bi-x-lg me-2"></i>取消
          </button>
          <button
            type="button"
            @click="handleSubmit"
            :disabled="loading"
            class="btn btn-primary"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            <i v-else class="bi bi-check-lg me-2"></i>
            {{ loading ? "儲存中..." : "儲存" }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 禮服詳情彈出視窗 -->
  <div
    v-if="showDressDetailModal && selectedDress"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5); z-index: 2000"
    @click.self="closeDressDetailModal"
  >
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title">
            禮服詳情 - {{ selectedDress.編號 }}
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="closeDressDetailModal"
          ></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <div class="row">
            <!-- 左側圖片區域 -->
            <div class="col-md-6">
              <div class="mb-4">
                <h6 class="fw-semibold mb-3">禮服圖片
                </h6>

                <!-- 主圖片 -->
                <div class="mb-3">
                  <div
                    class="bg-light rounded d-flex align-items-center justify-content-center"
                    style="min-height: 400px"
                  >
                    <img
                      v-if="currentDressImage"
                      :src="currentDressImage"
                      :alt="selectedDress.編號"
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

                <!-- 縮圖列表 -->
                <div
                  v-if="selectedDress.圖片 && selectedDress.圖片.length > 1"
                  class="d-flex gap-2 flex-wrap"
                >
                  <img
                    v-for="(image, index) in selectedDress.圖片"
                    :key="index"
                    :src="image"
                    :alt="`${selectedDress.編號} - 圖片 ${index + 1}`"
                    class="img-thumbnail"
                    style="
                      width: 80px;
                      height: 80px;
                      object-fit: cover;
                      cursor: pointer;
                    "
                    :class="{ 'border-primary': currentDressImage === image }"
                    @click="currentDressImage = image"
                  />
                </div>
              </div>
            </div>

            <!-- 右側詳細資訊 -->
            <div class="col-md-6">
              <div class="mb-4">
                <h6 class="fw-semibold mb-3">基本資訊
                </h6>

                <div class="row g-3">
                  <div class="col-6">
                    <label class="form-label text-muted small">禮服編號</label>
                    <div class="fw-semibold">
                      {{ selectedDress.編號 || "未設定" }}
                    </div>
                  </div>
                  <div class="col-6">
                    <label class="form-label text-muted small">顏色</label>
                    <div class="fw-semibold">
                      {{ selectedDress.顏色 || "未設定" }}
                    </div>
                  </div>
                  <div class="col-6">
                    <label class="form-label text-muted small">裙型</label>
                    <div class="fw-semibold">
                      {{ selectedDress.裙型 || "未設定" }}
                    </div>
                  </div>
                  <div class="col-6">
                    <label class="form-label text-muted small">袖型</label>
                    <div class="fw-semibold">
                      {{ selectedDress.袖型 || "未設定" }}
                    </div>
                  </div>
                  <div class="col-6">
                    <label class="form-label text-muted small">領型</label>
                    <div class="fw-semibold">
                      {{ selectedDress.領型 || "未設定" }}
                    </div>
                  </div>
                  <div class="col-6">
                    <label class="form-label text-muted small">庫存數量</label>
                    <div class="fw-semibold">
                      {{ selectedDress.庫存數量 || 0 }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <h6 class="fw-semibold mb-3">價格資訊
                </h6>

                <div class="row g-3">
                  <div class="col-6">
                    <label class="form-label text-muted small">租借金額</label>
                    <div class="fw-semibold text-primary">
                      NT$
                      {{
                        (
                          selectedDress.租借金額 ||
                          selectedDress.價格 ||
                          0
                        ).toLocaleString()
                      }}
                    </div>
                  </div>
                  <div class="col-6">
                    <label class="form-label text-muted small">加價金額</label>
                    <div class="fw-semibold text-warning">
                      <span
                        v-if="
                          selectedDress.加價金額 && selectedDress.加價金額 > 0
                        "
                      >
                        NT$ {{ selectedDress.加價金額.toLocaleString() }}
                      </span>
                      <span v-else class="text-muted">無</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 檔期時間 -->
              <div class="mb-4">
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <h6 class="fw-semibold mb-0">租用檔期
                  </h6>
                  <div class="d-flex align-items-center">
                    <label class="form-label text-muted small mb-0 me-2"
                      >檢查日期衝突：</label
                    >
                    <input
                      v-model="dressConflictCheckDate"
                      type="date"
                      class="form-control form-control-sm"
                      style="width: 140px"
                      @change="checkDressDateConflict"
                    />
                  </div>
                </div>

                <!-- 衝突檢查結果 -->
                <div v-if="dressConflictCheckResult" class="mb-3">
                  <div
                    :class="[
                      'alert alert-sm',
                      dressConflictCheckResult.hasConflict
                        ? 'alert-danger'
                        : 'alert-success',
                    ]"
                    style="padding: 8px 12px"
                  >
                    <div class="d-flex align-items-center">
                      <i
                        :class="[
                          'me-2',
                          dressConflictCheckResult.hasConflict
                            ? 'bi bi-exclamation-triangle'
                            : 'bi bi-check-circle',
                        ]"
                      ></i>
                      <div class="flex-grow-1">
                        <strong>{{
                          dressConflictCheckResult.hasConflict
                            ? "檔期衝突"
                            : "無衝突"
                        }}</strong>
                        <div class="small mt-1">
                          檢查日期：{{
                            formatDateOnly(dressConflictCheckDate)
                          }}
                          (前後4天：{{
                            formatDateOnly(dressConflictCheckResult.startRange)
                          }}
                          ~
                          {{
                            formatDateOnly(dressConflictCheckResult.endRange)
                          }})
                        </div>
                        <div
                          v-if="
                            dressConflictCheckResult.hasConflict &&
                            dressConflictCheckResult.conflicts.length > 0
                          "
                          class="small mt-2"
                        >
                          <div class="fw-semibold text-danger mb-1">
                            衝突的租用檔期：
                          </div>
                          <div
                            v-for="conflict in dressConflictCheckResult.conflicts"
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
                  <small class="text-muted ms-2">載入檔期資訊...</small>
                </div>

                <!-- 檔期列表 -->
                <div
                  v-else-if="dressSchedule && dressSchedule.length > 0"
                  class="bg-light p-3 rounded"
                  style="max-height: 300px; overflow-y: auto"
                >
                  <div
                    v-for="(schedule, index) in dressSchedule"
                    :key="index"
                    class="d-flex align-items-center py-2 px-3 rounded mb-2 bg-white shadow-sm"
                  >
                    <!-- 日期 -->
                    <div class="me-3">
                      <span class="small fw-medium">{{
                        formatDateRange(
                          schedule.租用開始時間,
                          schedule.租用結束時間
                        )
                      }}</span>
                    </div>

                    <!-- 合約編號 -->
                    <div class="me-3">
                      <span class="text-muted small">{{
                        schedule.合約單號
                      }}</span>
                    </div>

                    <!-- 客戶姓名 -->
                    <div class="flex-grow-1">
                      <span class="fw-semibold small">{{
                        schedule.客戶姓名
                      }}</span>
                    </div>
                  </div>
                </div>

                <!-- 無檔期 -->
                <div v-else class="bg-light p-3 rounded text-center text-muted">
                  <i class="bi bi-calendar-x me-2"></i>
                  目前沒有租用檔期
                </div>
              </div>

              <div v-if="selectedDress.備註" class="mb-4">
                <h6 class="fw-semibold mb-3">備註
                </h6>
                <div class="bg-light p-3 rounded">
                  {{ selectedDress.備註 }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="closeDressDetailModal"
          >
            <i class="bi bi-x-lg me-2"></i>關閉
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 禮服選擇彈出視窗 -->
  <DressSelectionModal
    v-if="showDressSelectionModal"
    :show="showDressSelectionModal"
    :selected-dress-ids="getSelectedDressIds()"
    @close="showDressSelectionModal = false"
    @select="onDressSelected"
    @remove="onDressRemoved"
    @clear-all="onClearAllDresses"
  />
</template>

<script>
import { dressService, staffService } from "../services/firestore.js";
import { cartService } from "../services/cart.js";
import DressSelectionModal from "./DressSelectionModal.vue";

export default {
  name: "ContractModal",
  components: {
    DressSelectionModal,
  },
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
  computed: {
    hasValidTimeAndDresses() {
      const hasTime = this.formData.租用開始時間 && this.formData.租用結束時間;
      const hasDresses = this.formData.禮服清單.some((item) => item.禮服ID);
      return hasTime && hasDresses && this.isValidTimeRange;
    },
    isValidTimeRange() {
      if (!this.formData.租用開始時間 || !this.formData.租用結束時間) {
        return true; // 如果任一時間未設定，不顯示錯誤
      }
      return (
        new Date(this.formData.租用開始時間) <
        new Date(this.formData.租用結束時間)
      );
    },
    hasCartItems() {
      return !this.contract && cartService.getItemCount() > 0;
    },
  },
  data() {
    return {
      loading: false,
      availableDresses: [],
      availableStaff: [],
      conflictWarnings: [],
      checkingConflicts: false,
      conflictCheckTimeout: null,
      formData: {
        客戶姓名: "",
        電話: "",
        email: "",
        三圍: "",
        承辦人: "",
        租用開始時間: "",
        租用結束時間: "",
        處理狀態: "",
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
        創建時間: null,
      },
      cartService, // 讓模板可以存取購物車服務
      showDressDetailModal: false, // 控制禮服詳情彈出視窗
      selectedDress: null, // 選中的禮服資料
      currentDressImage: null, // 當前顯示的禮服圖片
      loadingSchedule: false, // 載入檔期狀態
      dressSchedule: [], // 禮服檔期資料
      showDressSelectionModal: false, // 控制禮服選擇彈出視窗
      dressConflictCheckDate: "", // 禮服詳情popup中的衝突檢查日期
      dressConflictCheckResult: null, // 禮服詳情popup中的衝突檢查結果
    };
  },
  async mounted() {
    await this.loadDresses();
    await this.loadStaff();

    // 如果是新增模式且購物車有項目，自動載入
    if (!this.contract && cartService.getItemCount() > 0) {
      this.loadCartItems();
    }
  },
  beforeUnmount() {
    if (this.conflictCheckTimeout) {
      clearTimeout(this.conflictCheckTimeout);
    }
  },
  watch: {
    contract: {
      immediate: true,
      handler(newContract) {
        if (newContract) {
          this.formData = {
            客戶姓名: newContract.客戶姓名 || "",
            電話: newContract.電話 || "",
            email: newContract.email || "",
            三圍: newContract.三圍 || "",
            承辦人: newContract.承辦人 || "",
            租用開始時間: this.formatDateTimeForInput(newContract.租用開始時間),
            租用結束時間: this.formatDateTimeForInput(newContract.租用結束時間),
            處理狀態: newContract.處理狀態 || "",
            禮服清單: newContract.禮服清單
              ? [...newContract.禮服清單]
              : [{ 禮服ID: "", 數量: 1, 單價: 0, 小計: 0 }],
            合約總金額: newContract.合約總金額 || 0,
            備注: newContract.備注 || "",
            創建時間: newContract.創建時間 || null,
          };
        } else {
          this.resetForm();
        }
      },
    },
  },
  methods: {
    async loadDresses() {
      try {
        this.availableDresses = await dressService.getAll();
      } catch (error) {
        console.error("載入禮服清單失敗:", error);
      }
    },

    async loadStaff() {
      try {
        this.availableStaff = await staffService.getAll();
      } catch (error) {
        console.error("載入承辦人清單失敗:", error);
        this.showToast("載入承辦人清單失敗", "warning");
      }
    },

    resetForm() {
      this.formData = {
        客戶姓名: "",
        電話: "",
        email: "",
        三圍: "",
        承辦人: "",
        租用開始時間: "",
        租用結束時間: "",
        處理狀態: "",
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
        創建時間: null,
      };
    },

    addDressItem() {
      this.formData.禮服清單.push({
        禮服ID: "",
        數量: 1,
        單價: 0,
        小計: 0,
      });

      // 強制重新渲染以確保新項目正確顯示
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },

    removeDressItem(index) {
      console.log(
        "嘗試移除禮服項目，索引:",
        index,
        "總數:",
        this.formData.禮服清單.length
      );

      if (index < 0 || index >= this.formData.禮服清單.length) {
        console.error("無效的索引:", index);
        return;
      }

      const removedItem = this.formData.禮服清單[index];
      console.log("移除的項目:", removedItem);

      // 如果是新增模式且項目有禮服ID，也從購物車中移除
      if (!this.contract && removedItem.禮服ID) {
        try {
          cartService.removeDress(removedItem.禮服ID);
          console.log("已從購物車移除:", removedItem.禮服ID);
        } catch (error) {
          console.error("從購物車移除禮服失敗:", error);
        }
      }

      // 移除項目
      this.formData.禮服清單.splice(index, 1);
      console.log("移除後禮服清單長度:", this.formData.禮服清單.length);

      // 如果刪除後沒有任何項目，添加一個空的項目
      if (this.formData.禮服清單.length === 0) {
        this.formData.禮服清單.push({
          禮服ID: "",
          數量: 1,
          單價: 0,
          小計: 0,
        });
        console.log("已添加空項目");
      }

      this.updateTotalAmount();
      // 移除禮服後重新檢查衝突
      this.onTimeOrDressChange();

      // 顯示成功訊息
      if (removedItem.禮服ID) {
        const dress = this.availableDresses.find(
          (d) => d.id === removedItem.禮服ID
        );
        const dressName = dress ? dress.編號 : removedItem.禮服ID;
        this.showToast(`已移除禮服 "${dressName}"`, "success");
      } else {
        this.showToast("已移除空項目", "info");
      }

      // 強制重新渲染
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },

    updateDressPrice(index) {
      const item = this.formData.禮服清單[index];
      const dress = this.availableDresses.find((d) => d.id === item.禮服ID);
      if (dress) {
        item.單價 = dress.租借金額 || dress.價格 || 0;
        this.calculateSubtotal(index);
      }
    },

    calculateSubtotal(index) {
      const item = this.formData.禮服清單[index];
      item.小計 = (item.數量 || 0) * (item.單價 || 0);
      this.updateTotalAmount();
    },

    updateQuantityAndCalculate(index) {
      const item = this.formData.禮服清單[index];

      // 如果是新增模式且項目有禮服ID，同步更新購物車數量
      if (!this.contract && item.禮服ID && item.數量 > 0) {
        try {
          cartService.updateQuantity(item.禮服ID, item.數量);
        } catch (error) {
          console.error("更新購物車數量失敗:", error);
        }
      }

      this.calculateSubtotal(index);
    },

    // 根據ID獲取禮服資料
    getDressById(dressId) {
      return this.availableDresses.find((dress) => dress.id === dressId);
    },

    // 查看禮服詳情
    async viewDressDetail(dressId) {
      if (dressId) {
        const dress = this.getDressById(dressId);
        if (dress) {
          this.selectedDress = dress;
          this.currentDressImage =
            dress.圖片 && dress.圖片.length > 0 ? dress.圖片[0] : null;
          this.showDressDetailModal = true;

          // 載入檔期資訊
          await this.loadDressSchedule(dressId);
        }
      }
    },

    // 關閉禮服詳情彈出視窗
    closeDressDetailModal() {
      this.showDressDetailModal = false;
      this.selectedDress = null;
      this.currentDressImage = null;
      this.dressSchedule = [];
      this.loadingSchedule = false;
      this.dressConflictCheckDate = "";
      this.dressConflictCheckResult = null;
    },

    // 獲取已選擇的禮服ID清單
    getSelectedDressIds() {
      return this.formData.禮服清單
        .filter((item) => item.禮服ID)
        .map((item) => item.禮服ID);
    },

    // 處理禮服選擇
    onDressSelected(selectedDresses) {
      try {
        selectedDresses.forEach((dress) => {
          // 檢查是否已經存在於禮服清單中
          const existingIndex = this.formData.禮服清單.findIndex(
            (item) => item.禮服ID === dress.id
          );

          if (existingIndex === -1) {
            // 如果不存在，則添加新項目
            // 先移除空的項目（禮服ID為空的項目）
            this.formData.禮服清單 = this.formData.禮服清單.filter(
              (item) => item.禮服ID !== ""
            );

            // 添加新的禮服項目
            this.formData.禮服清單.push({
              禮服ID: dress.id,
              數量: 1,
              單價: dress.租借金額 || dress.價格 || 0,
              小計: dress.租借金額 || dress.價格 || 0,
            });
          } else {
            // 如果已存在，可以選擇增加數量或顯示提示
            this.showToast(`"${dress.編號}" 已在合約清單中`, "info");
            return;
          }
        });

        // 更新總金額
        this.updateTotalAmount();

        // 觸發檔期檢查
        this.onTimeOrDressChange();

        // 顯示成功訊息
        if (selectedDresses.length > 0) {
          const addedDresses = selectedDresses.filter((dress) => {
            const existingIndex = this.formData.禮服清單.findIndex(
              (item) => item.禮服ID === dress.id
            );
            return existingIndex !== -1;
          });

          if (addedDresses.length > 0) {
            this.showToast(`已加入 ${addedDresses.length} 件禮服`, "success");
          }
        }
      } catch (error) {
        console.error("處理禮服選擇失敗:", error);
        this.showToast("選擇禮服失敗，請稍後再試", "error");
      }
    },

    // 處理禮服移除
    onDressRemoved(dress) {
      try {
        // 從禮服清單中移除指定的禮服
        const index = this.formData.禮服清單.findIndex(
          (item) => item.禮服ID === dress.id
        );

        if (index !== -1) {
          this.formData.禮服清單.splice(index, 1);

          // 如果清單為空，添加一個空項目
          if (this.formData.禮服清單.length === 0) {
            this.formData.禮服清單.push({
              禮服ID: "",
              數量: 1,
              單價: 0,
              小計: 0,
            });
          }

          // 更新總金額
          this.updateTotalAmount();

          // 觸發檔期檢查
          this.onTimeOrDressChange();

          this.showToast(`已移除 "${dress.編號}"`, "info");
        }
      } catch (error) {
        console.error("移除禮服失敗:", error);
        this.showToast("移除禮服失敗，請稍後再試", "error");
      }
    },

    // 處理清除所有禮服
    onClearAllDresses() {
      try {
        // 清空禮服清單並添加一個空項目
        this.formData.禮服清單 = [
          {
            禮服ID: "",
            數量: 1,
            單價: 0,
            小計: 0,
          },
        ];

        // 更新總金額
        this.updateTotalAmount();

        // 觸發檔期檢查
        this.onTimeOrDressChange();

        this.showToast("已清除所有禮服", "info");
      } catch (error) {
        console.error("清除禮服失敗:", error);
        this.showToast("清除禮服失敗，請稍後再試", "error");
      }
    },

    // 檢查禮服詳情popup中的日期衝突
    checkDressDateConflict() {
      if (!this.dressConflictCheckDate || !this.dressSchedule) {
        this.dressConflictCheckResult = null;
        return;
      }

      try {
        const checkDate = new Date(this.dressConflictCheckDate);

        // 計算前後4天的範圍
        const startRange = new Date(checkDate);
        startRange.setDate(checkDate.getDate() - 4);

        const endRange = new Date(checkDate);
        endRange.setDate(checkDate.getDate() + 4);

        // 將檢查範圍轉換為純日期（不含時間）
        const checkStartDate = new Date(
          startRange.getFullYear(),
          startRange.getMonth(),
          startRange.getDate()
        );
        const checkEndDate = new Date(
          endRange.getFullYear(),
          endRange.getMonth(),
          endRange.getDate()
        );

        // 檢查與現有檔期的衝突
        const conflicts = this.dressSchedule.filter((schedule) => {
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

          // 檢查日期範圍是否重疊 (只看日期)
          return !(
            checkEndDate < scheduleStartDate || checkStartDate > scheduleEndDate
          );
        });

        this.dressConflictCheckResult = {
          hasConflict: conflicts.length > 0,
          conflicts: conflicts,
          startRange: startRange,
          endRange: endRange,
        };
      } catch (error) {
        console.error("檢查禮服檔期衝突失敗:", error);
        this.showToast("檢查檔期衝突失敗: " + error.message, "error");
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
        hour12: false,
      });
    },

    // 載入禮服檔期資訊
    async loadDressSchedule(dressId) {
      try {
        this.loadingSchedule = true;
        this.dressSchedule = await dressService.getRentalSchedule(dressId);
      } catch (error) {
        console.error("載入禮服檔期失敗:", error);
        this.dressSchedule = [];
      } finally {
        this.loadingSchedule = false;
      }
    },

    // 格式化日期範圍
    formatDateRange(startTime, endTime) {
      if (!startTime || !endTime) return "時間未設定";

      let startDate, endDate;

      // 處理不同格式的時間
      if (startTime.toDate && typeof startTime.toDate === "function") {
        startDate = startTime.toDate();
      } else if (startTime instanceof Date) {
        startDate = startTime;
      } else {
        startDate = new Date(startTime);
      }

      if (endTime.toDate && typeof endTime.toDate === "function") {
        endDate = endTime.toDate();
      } else if (endTime instanceof Date) {
        endDate = endTime;
      } else {
        endDate = new Date(endTime);
      }

      const formatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };

      const startStr = startDate.toLocaleDateString("zh-TW", formatOptions);
      const endStr = endDate.toLocaleDateString("zh-TW", formatOptions);

      // 如果是同一天，只顯示一個日期
      if (startStr === endStr) {
        return startStr;
      }

      return `${startStr} - ${endStr}`;
    },

    // 獲取檔期狀態的樣式類別
    getScheduleStatusClass(status) {
      const statusClasses = {
        待確認: "bg-warning text-dark",
        已確認: "bg-info text-white",
        進行中: "bg-success text-white",
        已完成: "bg-secondary text-white",
        已取消: "bg-danger text-white",
      };
      return statusClasses[status] || "bg-secondary text-white";
    },

    calculateTotal() {
      return this.formData.禮服清單.reduce((total, item) => {
        return total + (item.小計 || 0);
      }, 0);
    },

    updateTotalAmount() {
      this.formData.合約總金額 = this.calculateTotal();
    },

    // 檢查所有禮服的檔期衝突
    async checkAllDressConflicts() {
      // 清空之前的警告
      this.conflictWarnings = [];

      // 檢查是否有足夠的資訊進行衝突檢查
      if (!this.formData.租用開始時間 || !this.formData.租用結束時間) {
        console.log("缺少租用時間資訊，跳過衝突檢查");
        return;
      }

      // 檢查時間範圍是否有效
      if (!this.isValidTimeRange) {
        console.log("時間範圍無效，跳過衝突檢查");
        return;
      }

      const validDressItems = this.formData.禮服清單.filter(
        (item) => item.禮服ID
      );
      if (validDressItems.length === 0) {
        console.log("沒有有效的禮服項目，跳過衝突檢查");
        return;
      }

      try {
        this.checkingConflicts = true;
        const excludeContractId = this.contract?.id || null;

        console.log("開始檢查檔期衝突:", {
          租用開始時間: this.formData.租用開始時間,
          租用結束時間: this.formData.租用結束時間,
          禮服清單: validDressItems,
          排除合約ID: excludeContractId,
        });

        for (const item of validDressItems) {
          console.log(`檢查禮服 ${item.禮服ID} 的可用性...`);

          const availability = await dressService.checkDressAvailability(
            item.禮服ID,
            this.formData.租用開始時間,
            this.formData.租用結束時間,
            excludeContractId
          );

          console.log(`禮服 ${item.禮服ID} 檢查結果:`, availability);

          if (!availability.available) {
            const dress = this.availableDresses.find(
              (d) => d.id === item.禮服ID
            );
            this.conflictWarnings.push({
              禮服ID: item.禮服ID,
              禮服編號: dress?.編號 || item.禮服ID,
              message: "此時間段已被其他合約預約",
              conflictContract: availability.conflictContract,
            });
          }
        }

        console.log("檔期衝突檢查完成，衝突警告:", this.conflictWarnings);
      } catch (error) {
        console.error("檢查檔期衝突失敗:", error);
      } finally {
        this.checkingConflicts = false;
      }
    },

    // 當開始時間改變時自動設定結束時間
    onStartTimeChange() {
      if (this.formData.租用開始時間) {
        const startDate = new Date(this.formData.租用開始時間);

        // 自動設定結束時間為開始時間+4天
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 4);

        // 格式化為 datetime-local 輸入框需要的格式
        this.formData.租用結束時間 = endDate.toISOString().slice(0, 16);

        console.log("自動設定結束時間:", {
          開始時間: this.formData.租用開始時間,
          結束時間: this.formData.租用結束時間,
        });
      }

      // 觸發檔期檢查
      this.onTimeOrDressChange();
    },

    // 當時間或禮服選擇改變時觸發檔期檢查
    async onTimeOrDressChange() {
      // 延遲檢查，避免頻繁調用
      clearTimeout(this.conflictCheckTimeout);
      this.conflictCheckTimeout = setTimeout(() => {
        this.checkAllDressConflicts();
      }, 500);
    },

    // 載入購物車項目到禮服清單
    loadCartItems() {
      try {
        const cartItems = cartService.toContractDressList();
        if (cartItems.length > 0) {
          this.formData.禮服清單 = cartItems;
          this.updateTotalAmount();
          this.showToast(`已載入 ${cartItems.length} 件禮服`, "success");

          // 觸發檔期檢查
          this.onTimeOrDressChange();
        }
      } catch (error) {
        console.error("載入購物車失敗:", error);
        this.showToast("載入購物車失敗", "error");
      }
    },

    // 清空購物車項目
    clearCartItems() {
      try {
        cartService.clearCart();
        // 同時清空表單中的禮服清單
        this.formData.禮服清單 = [
          {
            禮服ID: "",
            數量: 1,
            單價: 0,
            小計: 0,
          },
        ];
        this.updateTotalAmount();
        this.showToast("購物車已清空", "success");
      } catch (error) {
        console.error("清空購物車失敗:", error);
        this.showToast("清空購物車失敗", "error");
      }
    },

    async handleSubmit() {
      try {
        this.loading = true;

        // 驗證必填欄位
        if (
          !this.formData.客戶姓名 ||
          !this.formData.電話 ||
          !this.formData.承辦人 ||
          !this.formData.租用開始時間 ||
          !this.formData.租用結束時間 ||
          !this.formData.處理狀態
        ) {
          this.showToast("請填寫所有必填欄位", "warning");
          return;
        }

        // 驗證時間
        if (
          new Date(this.formData.租用開始時間) >=
          new Date(this.formData.租用結束時間)
        ) {
          this.showToast("租用結束時間必須晚於開始時間", "warning");
          return;
        }

        // 驗證禮服清單
        const validDressItems = this.formData.禮服清單.filter(
          (item) => item.禮服ID && item.數量 > 0
        );
        if (validDressItems.length === 0) {
          this.showToast("請至少選擇一件禮服", "warning");
          return;
        }

        // 檢查檔期衝突
        await this.checkAllDressConflicts();
        if (this.conflictWarnings.length > 0) {
          this.showToast("存在檔期衝突，請調整時間或更換禮服", "error");
          return;
        }

        // 準備提交的資料
        const submitData = { ...this.formData };

        // 轉換時間格式為 Firebase Timestamp
        submitData.租用開始時間 = new Date(this.formData.租用開始時間);
        submitData.租用結束時間 = new Date(this.formData.租用結束時間);

        // 過濾有效的禮服項目
        submitData.禮服清單 = validDressItems;

        // 如果是新增模式，生成合約單號和時間戳
        if (!this.contract || !this.contract.id) {
          const now = new Date();

          // 生成合約單號：V + 年份後兩位 + 月日 + 今天第幾單
          const year = now.getFullYear().toString().slice(-2); // 年份後兩位
          const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 月份
          const day = now.getDate().toString().padStart(2, "0"); // 日期
          const dateStr = `${month}${day}`; // 月日格式：0908

          // 查詢今天已有的合約數量來生成序號
          const todayContractNumber = await this.getTodayContractCount(now);
          const serialNumber = (todayContractNumber + 1)
            .toString()
            .padStart(3, "0");

          const generatedContractNumber = `V${year}${dateStr}${serialNumber}`;
          console.log("生成的合約單號:", {
            year,
            month,
            day,
            dateStr,
            todayContractNumber,
            serialNumber,
            generatedContractNumber,
          });

          submitData.合約單號 = generatedContractNumber;
          submitData.合約建立日期時間 = now;
          submitData.創建時間 = now;
          submitData.更新時間 = now;
        } else {
          submitData.更新時間 = new Date();
        }

        this.$emit("save", submitData);

        // 如果是新增模式，成功後清空購物車
        if (!this.contract || !this.contract.id) {
          cartService.clearCart();
        }
      } catch (error) {
        console.error("提交失敗:", error);
        this.showToast("提交失敗，請稍後再試", "error");
      } finally {
        this.loading = false;
      }
    },

    formatDateTimeForInput(date) {
      if (!date) return "";

      let dateObj;
      if (date.toDate && typeof date.toDate === "function") {
        dateObj = date.toDate();
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        dateObj = new Date(date);
      }

      // 格式化為 YYYY-MM-DDTHH:MM
      return dateObj.toISOString().slice(0, 16);
    },

    formatTimestamp(timestamp) {
      if (!timestamp) return "";

      let date;
      if (timestamp.toDate && typeof timestamp.toDate === "function") {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else {
        date = new Date(timestamp);
      }

      return date.toLocaleString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    },

    formatDateTimeShort(timestamp) {
      if (!timestamp) return "";

      let date;
      if (timestamp.toDate && typeof timestamp.toDate === "function") {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else {
        date = new Date(timestamp);
      }

      return date.toLocaleString("zh-TW", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },

    // 獲取今天已有的合約數量
    async getTodayContractCount(date) {
      try {
        // 計算今天的開始和結束時間
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // 導入contractService來查詢合約
        const { contractService } = await import("../services/firestore.js");
        const allContracts = await contractService.getAll();

        // 篩選今天建立的合約
        const todayContracts = allContracts.filter((contract) => {
          if (!contract.創建時間) return false;

          let contractDate;
          if (
            contract.創建時間.toDate &&
            typeof contract.創建時間.toDate === "function"
          ) {
            contractDate = contract.創建時間.toDate();
          } else if (contract.創建時間 instanceof Date) {
            contractDate = contract.創建時間;
          } else {
            contractDate = new Date(contract.創建時間);
          }

          return contractDate >= startOfDay && contractDate <= endOfDay;
        });

        console.log(`今天已有 ${todayContracts.length} 個合約`);
        return todayContracts.length;
      } catch (error) {
        console.error("查詢今天合約數量失敗:", error);
        // 如果查詢失敗，返回0，這樣會生成001
        return 0;
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
.modal {
  backdrop-filter: blur(4px);
}

.modal-dialog-scrollable .modal-body {
  max-height: calc(100vh - 200px);
}

/* 禮服卡片hover效果 */
.card:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease-in-out;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
}

/* 圖片hover效果 */
.card-img-top img:hover {
  opacity: 0.9;
  transition: opacity 0.3s ease-in-out;
}

/* 空卡片hover效果 */
.border-dashed:hover {
  border-color: #0d6efd !important;
  background-color: rgba(13, 110, 253, 0.05);
}

/* 刪除按鈕hover效果 */
.btn-danger:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}
</style>
