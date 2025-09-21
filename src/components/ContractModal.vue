<template>
  <!-- Bootstrap Modal -->
  <div
    v-if="show"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
    @click.self="$emit('close')"
  >
    <div class="modal-dialog modal-fullscreen">
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
        <div class="modal-body p-0">
          <div class="row g-0 h-100">
            <!-- 左側主要內容區域 -->
            <div class="col-lg-8 col-md-7">
              <div class="p-4 custom-scrollbar" style="height: calc(100vh - 120px); overflow-y: auto;">
          <form @submit.prevent="handleSubmit">
            <!-- 合約單號 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">合約單號</h5>
              <div class="row p-3">
                <div class="mb-2">
                  <span class="small text-muted">合約單號 * : </span>
                  <div class="d-inline-flex ms-2" style="width: 300px;">
                    <input
                      v-model="formData.合約單號"
                      type="text"
                      :class="['form-control form-control-sm', { 'is-invalid': validationErrors.合約單號 }]"
                      required
                      placeholder="自動產生合約單號"
                      @blur="checkContractNumberUnique"
                      @input="onContractNumberInput"
                      @focus="clearValidationError('合約單號')"
                    />
                    <button
                      type="button"
                      @click="generateNewContractNumber"
                      class="btn btn-outline-secondary btn-sm ms-1"
                      title="重新產生合約單號"
                    >
                      <i class="bi bi-arrow-clockwise"></i>
                    </button>
                  </div>
                </div>
                <div v-if="contractNumberStatus" class="ms-2">
                  <small :class="contractNumberStatus.type === 'error' ? 'text-danger' : 'text-success'">
                    <i :class="contractNumberStatus.type === 'error' ? 'bi bi-exclamation-triangle' : 'bi bi-check-circle'" class="me-1"></i>
                    {{ contractNumberStatus.message }}
                    <span v-if="contractNumberStatus.type === 'success'" class="text-muted ms-2">
                      格式：V + 年份後兩位 + 月日 + 序號
                    </span>
                  </small>
                </div>
              </div>
            </div>

            <!-- 分隔線 -->
            <hr class="my-4" style="border-color: #E0E0E0;">

            <!-- 合約禮服 -->
            <div class="mb-4">
              <div
                class="d-flex justify-content-between align-items-center mb-3"
              >
                <h5 class="card-title mb-0" :class="{ 'text-danger': validationErrors.禮服清單 }">合約禮服</h5>
                <div class="d-flex gap-2">
                  <button
                    v-if="hasCartItems"
                    @click="clearCartItems"
                    type="button"
                    class="btn btn-outline-danger btn-sm"
                  >
             
                    清空
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

              <!-- 載入狀態 -->
              <div v-if="loadingDresses" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">載入中...</span>
                </div>
              </div>

              <!-- 禮服圖卡展示 -->
              <div
                v-else
                :class="['row g-3 mb-3', { 'dress-list-error': validationErrors.禮服清單 }]"
                style="max-height: 500px; overflow-y: auto; padding: 8px"
                @click="clearValidationError('禮服清單')"
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

                      <!-- 價格變更提示 -->
                      <div v-if="hasPriceChange(item.禮服ID)" class="alert alert-warning p-2 mb-2" style="font-size: 12px;">
                        <i class="bi bi-exclamation-triangle me-1"></i>
                        <strong>金額有變更</strong>
                        <div class="mt-1">
                          <div>租借: NT$ {{ priceChanges[item.禮服ID]?.原租借金額.toLocaleString() }} → NT$ {{ priceChanges[item.禮服ID]?.新租借金額.toLocaleString() }}</div>
                          <div v-if="priceChanges[item.禮服ID]?.原加價金額 !== priceChanges[item.禮服ID]?.新加價金額">
                            加價: NT$ {{ priceChanges[item.禮服ID]?.原加價金額.toLocaleString() }} → NT$ {{ priceChanges[item.禮服ID]?.新加價金額.toLocaleString() }}
                          </div>
                        </div>
                      </div>

                      <!-- 金額資訊 -->
                      <div class="mb-2">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                          <small class="text-muted">租借金額</small>
                          <span class="fw-bold text-primary">
                            NT$ {{ (item.單價 || 0).toLocaleString() }}
                          </span>
                        </div>
                        <div 
                          v-if="formData.選擇方案 && (item.加價金額 || getDressById(item.禮服ID)?.加價金額) && (item.加價金額 || getDressById(item.禮服ID)?.加價金額) > 0"
                        class="d-flex justify-content-between align-items-center"
                      >
                          <small class="text-muted">加價金額</small>
                          <span class="fw-bold text-warning">
                            + NT$ {{ (item.加價金額 || getDressById(item.禮服ID)?.加價金額 || 0).toLocaleString() }}
                          </span>
                        </div>
                      </div>

                      <!-- 按鈕區域 -->
                      <div class="d-grid gap-1 mt-2">
                        <!-- 價格更新按鈕 -->
                        <button
                          v-if="hasPriceChange(item.禮服ID)"
                          type="button"
                          @click="updateDressPrice(item.禮服ID)"
                          class="btn btn-warning btn-sm"
                        >
                          <i class="bi bi-arrow-clockwise me-1"></i>更新價格
                        </button>
                        
                        <!-- 查看詳情按鈕 -->
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

            </div>

            <!-- 分隔線 -->
            <hr class="my-4" style="border-color: #E0E0E0;">

            <!-- 租用時間 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">租用時間</h5>
              <div class="row p-3">
                <div class="mb-2">
                  <span class="small text-muted">租用開始時間 * : </span>
                  <input
                    v-model="formData.租用開始時間"
                    type="datetime-local"
                    :class="['form-control form-control-sm d-inline-block ms-2', { 'is-invalid': validationErrors.租用開始時間 }]"
                    style="width: 200px;"
                    required
                    @change="onStartTimeChange"
                    @focus="clearValidationError('租用開始時間')"
                  />
                </div>
                <div class="mb-2">
                  <span class="small text-muted">租用結束時間 * : </span>
                  <input
                    v-model="formData.租用結束時間"
                    type="datetime-local"
                    :class="['form-control form-control-sm d-inline-block ms-2', { 'is-invalid': validationErrors.租用結束時間 }]"
                    style="width: 200px;"
                    required
                    @change="onEndTimeChange"
                    @focus="clearValidationError('租用結束時間')"
                  />
                </div>
                <div class="mb-2">
                  <span class="small text-muted">下次可用時間 * : </span>
                  <input
                    v-model="formData.下次可用時間"
                    type="datetime-local"
                    :class="['form-control form-control-sm d-inline-block ms-2', { 'is-invalid': validationErrors.下次可用時間 }]"
                    style="width: 200px;"
                    required
                    @change="onTimeOrDressChange"
                    @focus="clearValidationError('下次可用時間')"
                  />
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

              <!-- 檔期衝突結果 -->
              <div
                v-else-if="hasCheckedConflicts"
                :class="[
                  'alert mb-3 mt-3',
                  conflictWarnings.length > 0 ? 'alert-danger' : 'alert-success'
                ]"
                style="font-size: 13px;"
              >
                <h6 class="alert-heading" style="font-size: 14px;">
                  <i :class="[
                    'me-2',
                    conflictWarnings.length > 0 ? 'bi bi-exclamation-triangle' : 'bi bi-check-circle'
                  ]"></i>
                  {{ conflictWarnings.length > 0 ? '檔期衝突警告' : '檔期檢查完成' }}
                </h6>
                <div v-if="conflictWarnings.length > 0">
                  <div
                    v-for="warning in conflictWarnings"
                    :key="warning.禮服ID"
                    class="mb-2"
                    style="font-size: 13px;"
                  >
                    <strong>{{ warning.禮服編號 }}</strong
                    >:
                    {{ warning.message }}
                    <br />
                    <small class="text-muted" style="font-size: 12px;">
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
                <div v-else style="font-size: 13px;">
                  所有選擇的禮服在指定時間內都可用，沒有檔期衝突。
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
                  <span class="text-muted" style="font-size: 12px;">
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

            <!-- 分隔線 -->
            <hr class="my-4" style="border-color: #E0E0E0;">

            <!-- 客戶資訊 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">客戶資訊</h5>
              <div class="row p-3">
                <div class="mb-2">
                  <span class="small text-muted">客戶姓名 * : </span>
                  <input
                    v-model="formData.客戶姓名"
                    type="text"
                    :class="['form-control form-control-sm d-inline-block ms-2', { 'is-invalid': validationErrors.客戶姓名 }]"
                    style="width: 200px;"
                    required
                    placeholder="例: 張小姐"
                    @focus="clearValidationError('客戶姓名')"
                  />
                </div>
                <div class="mb-2">
                  <span class="small text-muted">電話 * : </span>
                  <input
                    v-model="formData.電話"
                    type="tel"
                    :class="['form-control form-control-sm d-inline-block ms-2', { 'is-invalid': validationErrors.電話 }]"
                    style="width: 200px;"
                    required
                    placeholder="例: 0912-345-678"
                    @focus="clearValidationError('電話')"
                  />
                </div>
                <div class="mb-2">
                  <span class="small text-muted">Email : </span>
                  <input
                    v-model="formData.email"
                    type="email"
                    class="form-control form-control-sm d-inline-block ms-2"
                    style="width: 250px;"
                    placeholder="例: customer@example.com"
                  />
                </div>
                <div class="mb-2">
                  <span class="small text-muted">身分證號 : </span>
                  <input
                    v-model="formData.身分證號"
                    type="text"
                    class="form-control form-control-sm d-inline-block ms-2"
                    style="width: 200px;"
                    placeholder="請輸入身分證號"
                  />
                </div>
                <div class="mb-2">
                  <span class="small text-muted">三圍 : </span>
                  <input
                    v-model="formData.三圍"
                    type="text"
                    class="form-control form-control-sm d-inline-block ms-2"
                    style="width: 150px;"
                    placeholder="例: 32B-24-35"
                  />
                </div>
                <div class="mb-2">
                  <span class="small text-muted">地址 : </span>
                  <input
                    v-model="formData.地址"
                    type="text"
                    class="form-control form-control-sm d-inline-block ms-2"
                    style="width: 300px;"
                    placeholder="請輸入地址"
                  />
                </div>

                <div class="mb-2" v-if="formData.客戶簽名">
                  <span class="small text-muted">客戶簽名 : </span>
                  <div class="d-inline-block ms-2">
                    <div class="signature-preview mb-2">
                      <img :src="formData.客戶簽名" alt="客戶簽名" class="signature-image" />
                      <button 
                        type="button" 
                        @click="removeSignature" 
                        class="btn btn-sm btn-outline-danger ms-2"
                      >
                        移除簽名
                      </button>
                    </div>
                  </div>
                </div>
                <div class="mb-2">
                  <span class="small text-muted">客戶簽名 : </span>
                  <input
                    type="file"
                    @change="handleSignatureUpload"
                    accept="image/*"
                    class="form-control form-control-sm d-inline-block ms-2"
                    style="width: 250px;"
                    :class="{ 'd-none': formData.客戶簽名 }"
                  />
            </div>
              </div>
            </div>

            <!-- 分隔線 -->
            <hr class="my-4" style="border-color: #E0E0E0;">

            <!-- 承辦人 -->
            <div class="mb-4">
              <h5 class="card-title mb-3">承辦人</h5>
              <div class="row p-3">
                <div class="mb-2">
                  <span class="small text-muted">接待人員 * : </span>
                  <select
                    v-model="formData.承辦人"
                    :class="['form-select form-select-sm d-inline-block ms-2', { 'is-invalid': validationErrors.承辦人 }]"
                    style="width: 200px;"
                    required
                    @focus="clearValidationError('承辦人')"
                  >
                    <option value="">請選擇承辦人</option>
                    <option
                      v-for="staff in filteredStaff"
                      :key="staff.id"
                      :value="staff.姓名"
                    >
                      {{ staff.姓名 }}{{ staff.職位 ? ` (${staff.職位})` : '' }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 分隔線 -->
            <hr class="my-4" style="border-color: #E0E0E0;">

            <!-- 付款記錄 -->
            <div class="mb-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="card-title mb-0">付款記錄</h5>
                <button
                  type="button"
                  @click="addPaymentRow"
                  class="btn btn-outline-primary btn-sm"
                >
                  <i class="bi bi-plus-lg me-1"></i>新增付款記錄
                </button>
              </div>
              
              <div class="payment-table">
                <div class="table-responsive">
                  <table class="table table-bordered">
                    <thead class="table-light">
                      <tr>
                        <th style="width: 20%;">付款別</th>
                        <th style="width: 20%;">金額</th>
                        <th style="width: 20%;">接待人員</th>
                        <th style="width: 20%;">客戶簽名</th>
                        <th style="width: 15%;">付款日期</th>
                        <th style="width: 5%;">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(payment, index) in formData.付款記錄" :key="index">
                        <td>
                          <select
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
                        </td>
                        <td>
                          <div class="payment-amount-column">
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
                        </td>
                        <td>
                          <div class="staff-display text-center">
                            <span class="text-dark fw-semibold">{{ payment.接待人員 || formData.承辦人 || '-' }}</span>
                          </div>
                        </td>
                        <td>
                          <div class="signature-display">
                            <div v-if="formData.客戶簽名" class="payment-signature-preview">
                              <img :src="formData.客戶簽名" alt="客戶簽名" class="payment-signature-image" />
                            </div>
                            <div v-else class="text-muted small">
                              <i class="bi bi-pen me-1"></i>客戶簽名
                            </div>
                          </div>
                        </td>
                        <td>
                          <input
                            v-model="payment.付款日期"
                            type="date"
                            class="form-control form-control-sm"
                          />
                        </td>
                        <td>
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
                      <tr v-if="formData.付款記錄.length === 0">
                        <td colspan="6" class="text-center text-muted py-3">
                          <i class="bi bi-credit-card me-2"></i>尚未新增付款記錄
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- 分隔線 -->
            <hr class="my-4" style="border-color: #E0E0E0;">

            <!-- 備註詳情 -->
            <div class="mb-4">
              <h5 class="card-title ">備註詳情</h5>
              <div class="row p-3">
                <div class="">
                  <textarea
                    v-model="formData.備注"
                    class="form-control form-control-sm mt-2"
                    rows="4"
                    placeholder="合約相關備註或特殊說明..."
                    style="width: 100%;"
                  ></textarea>
                </div>
              </div>
            </div>

             <!-- 分隔線 -->
             <hr class="my-4" style="border-color: #E0E0E0;">


            <!-- 建立時間 -->
            <div class="mb-4" v-if="formData.創建時間">
              <h5 class="card-title mb-3">建立時間</h5>
              <div class="row p-3">
                <p class="small text-muted">建立時間 : {{ formatTimestamp(formData.創建時間) }}</p>
              </div>
            </div>
          </form>
              </div>
        </div>

            <!-- 右側計算金額區域 -->
            <div class="col-lg-4 col-md-5 border-start bg-light position-fixed" style="right: 0; top: 0; height: 100vh; width: 33.333333%; z-index: 1;">
              <div class="d-flex flex-column h-100">
                <div class="p-4 flex-grow-1 custom-scrollbar mb-4" style="overflow-y: auto;">
                  <div class="d-flex align-items-center justify-content-end mb-4">
         
                    <button
                      type="button"
                      class="btn-close"
                      @click="$emit('close')"
                      aria-label="關閉"
                    ></button>
                  </div>

          

                  <!-- 方案選擇 -->
                  <div class="mb-4">
                    <h6 class="fw-semibold mb-3">方案選擇</h6>
                    <div class="bg-white rounded p-3 shadow-sm">
                      <div class="mb-0">
                        <select
                          v-model="formData.選擇方案"
                          class="form-select form-select-sm"
                          @change="onPlanChange"
                        >
                          <option value="">不選擇方案（依禮服單價計算）</option>
                          <optgroup 
                            v-for="(packages, category) in packagesByCategory" 
                            :key="category" 
                            :label="category"
                          >
                            <option 
                              v-for="pkg in packages" 
                              :key="pkg.value" 
                              :value="pkg.value"
                            >
                              {{ pkg.label }}
                            </option>
                          </optgroup>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- 配件選擇 -->
                  <div class="mb-4">
                    <h6 class="fw-semibold mb-3">配件選擇</h6>
                    <div class="bg-white rounded p-3 shadow-sm">
                      <div class="mb-0">
                        <select
                          v-model="formData.選擇配件"
                          class="form-select form-select-sm"
                          @change="onAccessoryChange"
                        >
                          <option value="">請選擇配件</option>
                          <optgroup 
                            v-for="(accessories, category) in accessoriesByCategory" 
                            :key="category" 
                            :label="category"
                          >
                            <option 
                              v-for="accessory in accessories" 
                              :key="accessory.value" 
                              :value="accessory.value"
                            >
                              {{ accessory.category }}｜{{ accessory.accessoryName }}{{ accessory.accessoryPrice && accessory.accessoryPrice > 0 ? '｜NT$ ' + accessory.accessoryPrice.toLocaleString() : '｜贈送' }}
                            </option>
                          </optgroup>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- 折扣設定 -->
                  <div class="mb-4">
                    <h6 class="fw-semibold mb-3">折扣設定</h6>
                    <div class="bg-white rounded p-3 shadow-sm">
                      <div class="mb-0">
                        <select
                          v-model="formData.折扣比例"
                          class="form-select form-select-sm"
                          @change="updateTotalWithDiscount"
                        >
                          <option value="1">無折扣 (原價)</option>
                          <option value="0.9">9 折</option>
                          <option value="0.85">85 折</option>
                          <option value="0.8">8 折</option>
                          <option value="0.75">75 折</option>
                          <option value="0.7">7 折</option>
                          <option value="0.65">65 折</option>
                          <option value="0.6">6 折</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- 計算結果 -->
                  <div class="mb-4">
                    <h6 class="fw-semibold mb-3">計算結果</h6>
                    <div class="bg-white rounded p-3 shadow-sm">
                      <div class="small text-muted">
                        <!-- 方案價格 (如果有選擇方案) -->
                        <div v-if="formData.選擇方案" class="d-flex justify-content-between">
                          <span>方案價格</span>
                          <span>NT$ {{ (planPrices[formData.選擇方案] || 0).toLocaleString() }}</span>
                        </div>
                        
                        <!-- 禮服小計 -->
                        <div v-if="!formData.選擇方案" class="d-flex justify-content-between">
                          <span>禮服小計</span>
                          <span>NT$ {{ calculateDressTotal().toLocaleString() }}</span>
                        </div>
                        
                        <!-- 方案折扣 (只折扣方案價格) -->
                        <div v-if="formData.選擇方案 && formData.折扣比例 < 1" class="d-flex justify-content-between text-success">
                          <span>方案折扣 ({{ Math.round((1 - (formData.折扣比例 || 1)) * 100) }}%)</span>
                          <span>- NT$ {{ getPlanDiscountAmount().toLocaleString() }}</span>
                        </div>
                        
                        <!-- 禮服折扣 (沒有方案時) -->
                        <div v-if="!formData.選擇方案 && formData.折扣比例 < 1" class="d-flex justify-content-between text-success">
                          <span>禮服折扣 ({{ Math.round((1 - (formData.折扣比例 || 1)) * 100) }}%)</span>
                          <span>- NT$ {{ getDressDiscountAmount().toLocaleString() }}</span>
                        </div>
                        
                        <!-- 加價金額 (不折扣) -->
                        <div v-if="formData.選擇方案 && getExtraAmount() > 0" class="d-flex justify-content-between text-warning">
                          <span>加價金額</span>
                          <span>+ NT$ {{ getExtraAmount().toLocaleString() }}</span>
                        </div>
                        
                        <!-- 配件金額 (不折扣) -->
                        <div v-if="getAccessoryAmount() > 0" class="d-flex justify-content-between text-info">
                          <span>配件金額</span>
                          <span>+ NT$ {{ getAccessoryAmount().toLocaleString() }}</span>
                        </div>
                        
                        <!-- 合約總金額 -->
                        <div class="d-flex justify-content-between fw-bold text-primary border-top pt-2 mt-2">
                          <span>合約總金額</span>
                          <span>NT$ {{ getFinalAmount().toLocaleString() }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 押金設定 -->
                  <div class="mb-4">
                    <h6 class="fw-semibold mb-3">押金設定</h6>
                    <div class="bg-white rounded p-3 shadow-sm">
                      <div class="mb-0">
                        <div class="input-group input-group-sm">
                          <span class="input-group-text">NT$</span>
                          <input
                            v-model.number="formData.押金"
                            type="number"
                            class="form-control"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
                
                <!-- 儲存取消按鈕 -->
                <div class="border-top bg-white p-3">
                  <div class="d-flex gap-2">
          <button
            type="button"
                      class="btn btn-outline-secondary flex-fill"
            @click="$emit('close')"
          >
            <i class="bi bi-x-lg me-2"></i>取消
          </button>
          <button
            type="button"
            @click="handleSubmit"
            :disabled="loading"
                      class="btn btn-primary flex-fill"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            <i v-else class="bi bi-check-lg me-2"></i>
            <span style="font-size: 14px;">{{ loading ? "儲存中..." : "儲存" }}</span>
          </button>
                  </div>
                </div>
        </div>
            </div>
          </div>
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

                <div class="row g-4">
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

                <div class="row g-4">
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
                          (實際檔期：{{
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
                  <small class="text-muted ms-2" style="font-size: 14px;">載入檔期資訊...</small>
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
import { settingsService } from "../services/settings.js";
import { optionsService } from "../services/options.js";
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
      const hasTime = this.formData.租用開始時間 && this.formData.租用結束時間 && this.formData.下次可用時間;
      const hasDresses = this.formData.禮服清單.some((item) => item.禮服ID);
      return hasTime && hasDresses && this.isValidTimeRange;
    },
    isValidTimeRange() {
      if (!this.formData.租用開始時間 || !this.formData.租用結束時間 || !this.formData.下次可用時間) {
        return true; // 如果任一時間未設定，不顯示錯誤
      }
      
      try {
        const startTime = new Date(this.formData.租用開始時間);
        const endTime = new Date(this.formData.租用結束時間);
        const nextAvailableTime = new Date(this.formData.下次可用時間);
        
        // 檢查日期是否有效
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime()) || isNaN(nextAvailableTime.getTime())) {
          return false;
        }
        
        // 驗證邏輯：開始 < 結束 < 下次可用
        return startTime < endTime && endTime <= nextAvailableTime;
      } catch (error) {
        console.error('時間驗證錯誤:', error);
        return false;
      }
    },
    hasCartItems() {
      return !this.contract && cartService.getItemCount() > 0;
    },
  },
  data() {
    return {
      loading: false,
      loadingDresses: true,
      availableDresses: [],
      availableStaff: [],
      conflictWarnings: [],
      checkingConflicts: false,
      conflictCheckTimeout: null,
      formData: {
        合約單號: "",
        客戶姓名: "",
        電話: "",
        email: "",
        三圍: "",
        身分證號: "",
        地址: "",
        客戶簽名: "",
        承辦人: "",
        押金: 0,
        租用開始時間: "",
        租用結束時間: "",
        下次可用時間: "",
        選擇方案: "",
        選擇配件: "",
        折扣比例: 1,
        禮服清單: [
          {
            禮服ID: "",
            數量: 1,
            單價: 0,
            小計: 0,
          },
        ],
        付款記錄: [],
        合約總金額: 0,
        備注: "",
        創建時間: null,
      },
      planPrices: {},
      packagesByCategory: {},
      accessoriesByCategory: {},
      optionsUnsubscribe: null,
      cartService, // 讓模板可以存取購物車服務
      showDressDetailModal: false, // 控制禮服詳情彈出視窗
      selectedDress: null, // 選中的禮服資料
      currentDressImage: null, // 當前顯示的禮服圖片
      loadingSchedule: false, // 載入檔期狀態
      dressSchedule: [], // 禮服檔期資料
      showDressSelectionModal: false, // 控制禮服選擇彈出視窗
      dressConflictCheckDate: "", // 禮服詳情popup中的衝突檢查日期
      dressConflictCheckResult: null, // 禮服詳情popup中的衝突檢查結果
      hasCheckedConflicts: false, // 是否已執行過衝突檢查
      priceChanges: {}, // 追蹤價格變更 {禮服ID: {原價格, 新價格, 原加價, 新加價}}
      contractNumberStatus: null, // 合約單號檢查狀態
      checkingContractNumber: false, // 是否正在檢查合約單號
      contractNumberCheckTimeout: null, // 合約單號檢查計時器
      validationErrors: {}, // 驗證錯誤狀態
    };
  },
  computed: {
    filteredStaff() {
      return this.availableStaff.filter(staff => {
        // 顯示沒有狀態或狀態為在職的承辦人
        return !staff.狀態 || staff.狀態 === '' || staff.狀態 === '在職';
      });
    },
  },
  async mounted() {
    await this.loadDresses();
    await this.loadStaff();
    this.loadPackageOptions();

    // 如果是新增模式，自動產生合約單號
    if (!this.contract) {
      await this.generateNewContractNumber();
      
      // 如果購物車有項目，自動載入
      if (cartService.getItemCount() > 0) {
        this.loadCartItems();
      }
    }

    // 監聽選項變化
    this.optionsUnsubscribe = optionsService.subscribe(() => {
      this.loadPackageOptions();
    });
  },
  beforeUnmount() {
    if (this.conflictCheckTimeout) {
      clearTimeout(this.conflictCheckTimeout);
    }
    if (this.contractNumberCheckTimeout) {
      clearTimeout(this.contractNumberCheckTimeout);
    }
    if (this.optionsUnsubscribe) {
      this.optionsUnsubscribe();
    }
  },
  watch: {
    contract: {
      immediate: true,
      handler(newContract) {
        if (newContract) {
          this.formData = {
            合約單號: newContract.合約單號 || "",
            客戶姓名: newContract.客戶姓名 || "",
            電話: newContract.電話 || "",
            email: newContract.email || "",
            三圍: newContract.三圍 || "",
            身分證號: newContract.身分證號 || "",
            地址: newContract.地址 || "",
            客戶簽名: newContract.客戶簽名 || "",
            承辦人: newContract.承辦人 || "",
            押金: newContract.押金 || 0,
            租用開始時間: this.formatDateTimeForInput(newContract.租用開始時間),
            租用結束時間: this.formatDateTimeForInput(newContract.租用結束時間),
            下次可用時間: this.formatDateTimeForInput(newContract.下次可用時間),
            選擇方案: newContract.選擇方案 || "",
            選擇配件: newContract.選擇配件 || "",
            折扣比例: newContract.折扣比例 || 1,
            禮服清單: newContract.禮服清單
              ? [...newContract.禮服清單]
              : [{ 禮服ID: "", 數量: 1, 單價: 0, 加價金額: 0, 小計: 0 }],
            付款記錄: newContract.付款記錄 ? [...newContract.付款記錄] : [],
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
    loadPackageOptions() {
      try {
        this.packagesByCategory = optionsService.getPackagesByCategory();
        this.planPrices = optionsService.getPackagePrices();
        this.loadAccessoryOptions();
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
        this.loadingDresses = true;
        this.availableDresses = await dressService.getAll();
        
        // 載入完成後檢查價格變更（編輯模式）
        this.$nextTick(() => {
          this.checkPriceChanges();
        });
      } catch (error) {
        console.error("載入禮服清單失敗:", error);
      } finally {
        this.loadingDresses = false;
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
        合約單號: "",
        客戶姓名: "",
        電話: "",
        email: "",
        三圍: "",
        身分證號: "",
        地址: "",
        客戶簽名: "",
        承辦人: "",
        押金: 0,
        租用開始時間: "",
        租用結束時間: "",
        下次可用時間: "",
        選擇方案: "",
        選擇配件: "",
        折扣比例: 1,
        禮服清單: [
          {
            禮服ID: "",
            數量: 1,
            單價: 0,
            加價金額: 0,
            小計: 0,
          },
        ],
        付款記錄: [],
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
        加價金額: 0, // 新增加價金額欄位
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
          加價金額: 0,
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

    updateDressPriceByIndex(index) {
      const item = this.formData.禮服清單[index];
      const dress = this.availableDresses.find((d) => d.id === item.禮服ID);
      if (dress) {
        // 只使用基本租借金額，加價金額只在有方案時計算
        const baseAmount = dress.租借金額 || dress.價格 || 0;
        item.單價 = baseAmount;
        item.加價金額 = dress.加價金額 || 0; // 同時更新加價金額
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

    // 檢查禮服價格是否有變更
    checkPriceChanges() {
      if (!this.contract || !this.contract.id) return; // 只在編輯模式檢查

      this.priceChanges = {};
      
      this.formData.禮服清單.forEach(item => {
        if (item.禮服ID) {
          const currentDress = this.getDressById(item.禮服ID);
          if (currentDress) {
            const originalPrice = item.單價 || 0;
            const currentPrice = currentDress.租借金額 || currentDress.價格 || 0;
            const originalExtraPrice = item.加價金額 || 0;
            const currentExtraPrice = currentDress.加價金額 || 0;

            if (originalPrice !== currentPrice || originalExtraPrice !== currentExtraPrice) {
              this.priceChanges[item.禮服ID] = {
                原租借金額: originalPrice,
                新租借金額: currentPrice,
                原加價金額: originalExtraPrice,
                新加價金額: currentExtraPrice,
                hasChange: true
              };
            }
          }
        }
      });

      console.log('價格變更檢測:', this.priceChanges);
    },

    // 檢查特定禮服是否有價格變更
    hasPriceChange(dressId) {
      return this.priceChanges[dressId]?.hasChange || false;
    },

    // 更新特定禮服的價格
    updateDressPrice(dressId) {
      const priceChange = this.priceChanges[dressId];
      if (!priceChange) return;

      // 找到禮服項目並更新價格
      const itemIndex = this.formData.禮服清單.findIndex(item => item.禮服ID === dressId);
      if (itemIndex !== -1) {
        this.formData.禮服清單[itemIndex].單價 = priceChange.新租借金額;
        this.formData.禮服清單[itemIndex].加價金額 = priceChange.新加價金額;
        
        // 重新計算小計
        const item = this.formData.禮服清單[itemIndex];
        item.小計 = (item.單價 || 0) * (item.數量 || 1);

        // 移除價格變更記錄
        delete this.priceChanges[dressId];

        // 更新總金額
        this.updateTotalAmount();

        const dress = this.getDressById(dressId);
        this.showToast(`已更新 "${dress?.編號}" 的價格`, "success");
      }
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

            // 只使用基本租借金額，不包含加價金額
            const baseAmount = dress.租借金額 || dress.價格 || 0;

            // 添加新的禮服項目
            this.formData.禮服清單.push({
              禮服ID: dress.id,
              數量: 1,
              單價: baseAmount, // 只使用基本租借金額
              加價金額: dress.加價金額 || 0, // 儲存加價金額
              小計: baseAmount,
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
              加價金額: 0,
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
            加價金額: 0,
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
        const rentalPeriodDays = settingsService.getRentalPeriodDays();
        
        console.log("檢查日期衝突:", {
          檢查日期: this.dressConflictCheckDate,
          檢查日期物件: checkDate,
          現有檔期數量: this.dressSchedule.length,
          檔期天數設定: rentalPeriodDays
        });

        // 計算檢查日期的預設檔期範圍（模擬新合約的檔期）
        const actualStartDate = new Date(
          checkDate.getFullYear(),
          checkDate.getMonth(),
          checkDate.getDate()
        );
        const actualEndDate = new Date(actualStartDate);
        actualEndDate.setDate(actualStartDate.getDate() + rentalPeriodDays);

        console.log("檢查範圍:", {
          假設租用開始時間: actualStartDate,
          假設下次可用時間: actualEndDate,
          檔期天數: rentalPeriodDays
        });

        // 檢查與現有檔期的衝突
        const conflicts = this.dressSchedule.filter((schedule) => {
          // 跳過已取消和已完成的合約
          if (schedule.處理狀態 === "已取消" || schedule.處理狀態 === "已完成") {
            console.log(`跳過合約 ${schedule.合約單號} (狀態: ${schedule.處理狀態})`);
            return false;
          }

          let scheduleStart;

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
            console.log(`合約 ${schedule.合約單號} 缺少開始時間`);
            return false;
          }

          // 計算現有合約的禮服檔期
          let scheduleActualStartDate, scheduleActualEndDate;
          
          if (schedule.下次可用時間) {
            // 新格式：使用租用開始時間～下次可用時間
            const scheduleNextAvailable =
              schedule.下次可用時間 instanceof Date
                ? schedule.下次可用時間
                : schedule.下次可用時間.toDate
                ? schedule.下次可用時間.toDate()
                : new Date(schedule.下次可用時間);

            scheduleActualStartDate = new Date(
              scheduleStart.getFullYear(),
              scheduleStart.getMonth(),
              scheduleStart.getDate()
            );
            scheduleActualEndDate = new Date(
              scheduleNextAvailable.getFullYear(),
              scheduleNextAvailable.getMonth(),
              scheduleNextAvailable.getDate()
            );
          } else {
            // 舊格式：使用租用開始時間+設定天數（向後兼容）
            scheduleActualStartDate = new Date(
              scheduleStart.getFullYear(),
              scheduleStart.getMonth(),
              scheduleStart.getDate()
            );
            scheduleActualEndDate = new Date(scheduleActualStartDate);
            scheduleActualEndDate.setDate(scheduleActualStartDate.getDate() + rentalPeriodDays);
          }

          console.log(`檢查合約 ${schedule.合約單號}:`, {
            合約開始時間: scheduleStart,
            合約禮服檔期: `${scheduleActualStartDate.toDateString()} ~ ${scheduleActualEndDate.toDateString()}`,
            檢查假設檔期: `${actualStartDate.toDateString()} ~ ${actualEndDate.toDateString()}`,
            處理狀態: schedule.處理狀態,
            使用新格式: !!schedule.下次可用時間
          });

          // 檢查實際檔期重疊 - 使用正確的日期區間重疊邏輯
          const isOverlap = !(
            actualEndDate <= scheduleActualStartDate ||
            actualStartDate >= scheduleActualEndDate
          );

          console.log(`合約 ${schedule.合約單號} 重疊檢查:`, {
            是否重疊: isOverlap,
            計算說明: `!(${actualEndDate.toDateString()} <= ${scheduleActualStartDate.toDateString()} || ${actualStartDate.toDateString()} >= ${scheduleActualEndDate.toDateString()})`
          });

          // 只有進行中、已確認、待確認的合約才算衝突
          if (isOverlap) {
            if (
              schedule.處理狀態 === "進行中" ||
              schedule.處理狀態 === "已確認" ||
              schedule.處理狀態 === "待確認"
            ) {
              console.log(`發現衝突！合約 ${schedule.合約單號} 狀態: ${schedule.處理狀態}`);
              return true;
            } else {
              console.log(`檔期重疊但狀態不算衝突: ${schedule.合約單號} (${schedule.處理狀態})`);
              return false;
            }
          }

          return false;
        });

        console.log("衝突檢查結果:", {
          衝突數量: conflicts.length,
          衝突合約: conflicts.map(c => `${c.合約單號} (${c.客戶姓名})`)
        });

        this.dressConflictCheckResult = {
          hasConflict: conflicts.length > 0,
          conflicts: conflicts,
          startRange: actualStartDate,
          endRange: actualEndDate,
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
      // 如果選擇了方案，只計算方案價格
      if (this.formData.選擇方案) {
        const planPrice = this.planPrices[this.formData.選擇方案] || 0;
        return planPrice;
      } else {
        // 沒有選擇方案，依照禮服單價加總
        return this.formData.禮服清單.reduce((total, item) => {
          return total + (item.小計 || 0);
        }, 0);
      }
    },

    updateTotalAmount() {
      this.formData.合約總金額 = this.getFinalAmount();
      // 當總金額改變時，重新計算所有付款記錄的金額
      this.recalculateAllPaymentAmounts();
      // 重新生成備註內容（如果有選擇方案）
      if (this.formData.選擇方案) {
        this.generatePlanNotes();
      }
    },

    // 重新計算所有付款記錄的金額
    recalculateAllPaymentAmounts() {
      this.formData.付款記錄.forEach((payment, index) => {
        if (payment.金額百分比) {
          this.calculatePaymentAmount(index);
        }
      });
      
      // 強制更新視圖
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },

    // 方案改變時的處理
    onPlanChange() {
      this.updateTotalAmount();
      this.generatePlanNotes();
    },

    // 配件改變時的處理
    onAccessoryChange() {
      // 配件選擇會影響金額計算
      this.updateTotalAmount();
      console.log('配件選擇變更:', this.formData.選擇配件);
    },

    // 獲取配件金額
    getAccessoryAmount() {
      if (!this.formData.選擇配件) return 0;
      
      // 從所有配件選項中找到選中的配件
      const allAccessories = Object.values(this.accessoriesByCategory).flat();
      const selectedAccessory = allAccessories.find(acc => acc.value === this.formData.選擇配件);
      
      return selectedAccessory?.accessoryPrice || 0;
    },

    // 生成方案備註內容
    generatePlanNotes() {
      if (!this.formData.選擇方案) {
        this.formData.備注 = '';
        return;
      }

      // 從 packagesByCategory 中找到選中的方案
      let selectedPackage = null;
      Object.values(this.packagesByCategory).forEach(packages => {
        const found = packages.find(pkg => pkg.value === this.formData.選擇方案);
        if (found) {
          selectedPackage = found;
        }
      });

      if (selectedPackage && selectedPackage.content) {
        // 格式化租用開始日期
        let formattedDate = '';
        if (this.formData.租用開始時間) {
          const date = new Date(this.formData.租用開始時間);
          formattedDate = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
        }

        // 計算備註中的方案金額：折扣後的方案價格 + 加價金額
        const planPrice = selectedPackage.price || 0;
        const discountRate = this.formData.折扣比例 || 1;
        const discountedPlanPrice = Math.round(planPrice * discountRate);
        
        // 加價金額（不折扣）
        const totalExtraAmount = this.formData.禮服清單
          .filter(item => item.禮服ID)
          .reduce((total, item) => {
            const dress = this.getDressById(item.禮服ID);
            const extraAmount = dress?.加價金額 || 0;
            return total + extraAmount;
          }, 0);
        
        const planAmountInNote = discountedPlanPrice + totalExtraAmount;
        
        // 組合備註內容
        const noteContent = `${selectedPackage.packageName || selectedPackage.label} $${planAmountInNote.toLocaleString()}
${formattedDate} ${selectedPackage.category}使用
${selectedPackage.content}`;

        this.formData.備注 = noteContent;
      }
    },

    // 取得方案折扣金額
    getPlanDiscountAmount() {
      if (!this.formData.選擇方案) return 0;
      const planPrice = this.planPrices[this.formData.選擇方案] || 0;
      const discountRate = this.formData.折扣比例 || 1;
      return Math.round(planPrice * (1 - discountRate));
    },

    // 取得禮服折扣金額
    getDressDiscountAmount() {
      if (this.formData.選擇方案) return 0;
      const dressTotal = this.calculateDressTotal();
      const discountRate = this.formData.折扣比例 || 1;
      return Math.round(dressTotal * (1 - discountRate));
    },

    // 取得折扣金額（向後兼容）
    getDiscountAmount() {
      return this.getPlanDiscountAmount() + this.getDressDiscountAmount();
    },

    // 取得最終金額（折扣只針對方案價格）
    getFinalAmount() {
      let total = 0;
      
      if (this.formData.選擇方案) {
        // 方案價格進行折扣
        const planPrice = this.planPrices[this.formData.選擇方案] || 0;
        const discountRate = this.formData.折扣比例 || 1;
        const discountedPlanPrice = Math.round(planPrice * discountRate);
        
        // 加價金額不折扣
        const totalExtraAmount = this.formData.禮服清單
          .filter(item => item.禮服ID)
          .reduce((total, item) => {
            const dress = this.getDressById(item.禮服ID);
            const extraAmount = dress?.加價金額 || 0;
            return total + extraAmount;
          }, 0);
        
        total = discountedPlanPrice + totalExtraAmount;
      } else {
        // 沒有選擇方案，禮服金額進行折扣
        const dressTotal = this.formData.禮服清單.reduce((total, item) => {
          return total + (item.小計 || 0);
        }, 0);
        const discountRate = this.formData.折扣比例 || 1;
        total = Math.round(dressTotal * discountRate);
      }
      
      // 配件金額不折扣，直接加上
      const accessoryAmount = this.getAccessoryAmount();
      
      return total + accessoryAmount;
    },

    // 更新總金額（含折扣）
    updateTotalWithDiscount() {
      this.formData.合約總金額 = this.getFinalAmount();
      // 當總金額改變時，重新計算所有付款記錄的金額
      this.recalculateAllPaymentAmounts();
      // 重新生成備註內容（如果有選擇方案）
      if (this.formData.選擇方案) {
        this.generatePlanNotes();
      }
    },

    // 計算純禮服金額（不含方案價格）
    calculateDressTotal() {
      return this.formData.禮服清單.reduce((total, item) => {
        return total + (item.小計 || 0);
      }, 0);
    },

    // 取得加價金額總和（只在有方案時計算）
    getExtraAmount() {
      if (!this.formData.選擇方案) return 0;
      
      return this.formData.禮服清單
        .filter(item => item.禮服ID)
        .reduce((total, item) => {
          const dress = this.getDressById(item.禮服ID);
          const extraAmount = dress?.加價金額 || 0;
          return total + extraAmount;
        }, 0);
    },

    // 檢查所有禮服的檔期衝突
    async checkAllDressConflicts() {
      // 清空之前的警告和檢查狀態
      this.conflictWarnings = [];
      this.hasCheckedConflicts = false;

      // 檢查是否有足夠的資訊進行衝突檢查
      if (!this.formData.租用開始時間 || !this.formData.租用結束時間 || !this.formData.下次可用時間) {
        console.log("缺少租用時間資訊，跳過衝突檢查");
        return;
      }

      // 檢查時間範圍是否有效 - 使用更直接的驗證
      try {
        const startTime = new Date(this.formData.租用開始時間);
        const endTime = new Date(this.formData.租用結束時間);
        const nextAvailableTime = new Date(this.formData.下次可用時間);
        
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime()) || isNaN(nextAvailableTime.getTime())) {
          console.log("發現無效日期，跳過衝突檢查");
          return;
        }
        
        if (!(startTime < endTime && endTime <= nextAvailableTime)) {
          console.log("時間範圍邏輯錯誤，跳過衝突檢查");
          return;
        }
      } catch (error) {
        console.log("時間驗證失敗，跳過衝突檢查:", error);
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
          下次可用時間: this.formData.下次可用時間,
          禮服清單: validDressItems,
          排除合約ID: excludeContractId,
        });

        for (const item of validDressItems) {
          console.log(`檢查禮服 ${item.禮服ID} 的可用性...`);

          const availability = await dressService.checkDressAvailability(
            item.禮服ID,
            this.formData.租用開始時間,
            this.formData.租用結束時間,
            this.formData.下次可用時間,
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
        this.hasCheckedConflicts = true; // 標記已完成檢查
      }
    },

    // 當開始時間改變時自動設定結束時間和下次可用時間
    onStartTimeChange() {
      if (this.formData.租用開始時間) {
        const startDate = new Date(this.formData.租用開始時間);

        // 自動設定結束時間為開始時間+4天
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 4);

        // 自動設定下次可用時間為開始時間+7天
        const nextAvailableDate = new Date(startDate);
        nextAvailableDate.setDate(startDate.getDate() + 7);

        // 格式化為 datetime-local 輸入框需要的格式
        this.formData.租用結束時間 = endDate.toISOString().slice(0, 16);
        this.formData.下次可用時間 = nextAvailableDate.toISOString().slice(0, 16);

        console.log("自動設定時間:", {
          開始時間: this.formData.租用開始時間,
          結束時間: `${this.formData.租用結束時間} (+4天)`,
          下次可用時間: `${this.formData.下次可用時間} (+7天)`,
        });
      }

      // 觸發檔期檢查
      this.onTimeOrDressChange();
      
      // 重新生成備註內容（如果有選擇方案）
      if (this.formData.選擇方案) {
        this.generatePlanNotes();
      }
    },

    // 當結束時間改變時自動調整下次可用時間
    onEndTimeChange() {
      if (this.formData.租用結束時間) {
        const endDate = new Date(this.formData.租用結束時間);

        // 如果下次可用時間早於結束時間，自動調整為結束時間+3天
        if (!this.formData.下次可用時間 || new Date(this.formData.下次可用時間) < endDate) {
          const nextAvailableDate = new Date(endDate);
          nextAvailableDate.setDate(endDate.getDate() + 3); // 結束時間+3天緩衝

          this.formData.下次可用時間 = nextAvailableDate.toISOString().slice(0, 16);

          console.log("自動調整下次可用時間:", {
            結束時間: this.formData.租用結束時間,
            下次可用時間: `${this.formData.下次可用時間} (+3天緩衝)`,
          });
        }
      }

      // 觸發檔期檢查
      this.onTimeOrDressChange();
    },

    // 當時間或禮服選擇改變時觸發檔期檢查
    async onTimeOrDressChange() {
      // 重置檢查狀態
      this.hasCheckedConflicts = false;
      
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

    // 清空項目
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
        console.error("清空失敗:", error);
        this.showToast("清空失敗", "error");
      }
    },

    async handleSubmit() {
      try {
        this.loading = true;

        // 清除之前的驗證錯誤
        this.validationErrors = {};

        // 驗證必填欄位
        const requiredFields = {
          合約單號: this.formData.合約單號,
          客戶姓名: this.formData.客戶姓名,
          電話: this.formData.電話,
          承辦人: this.formData.承辦人,
          租用開始時間: this.formData.租用開始時間,
          租用結束時間: this.formData.租用結束時間,
          下次可用時間: this.formData.下次可用時間
        };

        // 檢查必填欄位
        let hasValidationError = false;
        Object.keys(requiredFields).forEach(field => {
          if (!requiredFields[field]) {
            this.validationErrors[field] = true;
            hasValidationError = true;
          }
        });

        // 檢查合約單號是否重複
        if (this.contractNumberStatus?.type === 'error') {
          this.validationErrors.合約單號 = true;
          hasValidationError = true;
        }

        if (hasValidationError) {
          return;
        }

        // 驗證時間邏輯
        const startTime = new Date(this.formData.租用開始時間);
        const endTime = new Date(this.formData.租用結束時間);
        const nextAvailableTime = new Date(this.formData.下次可用時間);
        
        if (startTime >= endTime) {
          this.validationErrors.租用結束時間 = true;
          return;
        }
        
        if (endTime > nextAvailableTime) {
          this.validationErrors.下次可用時間 = true;
          return;
        }

        // 驗證禮服清單
        const validDressItems = this.formData.禮服清單.filter(
          (item) => item.禮服ID && item.數量 > 0
        );
        if (validDressItems.length === 0) {
          this.validationErrors.禮服清單 = true;
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

        // 儲存方案價格和配件價格（防止未來價格變動影響合約）
        if (submitData.選擇方案) {
          submitData.方案價格 = this.planPrices[submitData.選擇方案] || 0;
        }
        if (submitData.選擇配件) {
          submitData.配件價格 = this.getAccessoryAmount();
        }

        // 設定預設處理狀態
        if (!this.contract || !this.contract.id) {
          submitData.處理狀態 = "待確認"; // 新增合約預設為待確認
        }

        // 轉換時間格式為 Firebase Timestamp
        submitData.租用開始時間 = new Date(this.formData.租用開始時間);
        submitData.租用結束時間 = new Date(this.formData.租用結束時間);
        submitData.下次可用時間 = new Date(this.formData.下次可用時間);

        // 過濾有效的禮服項目
        submitData.禮服清單 = validDressItems;

        // 如果是新增模式，設定時間戳
        if (!this.contract || !this.contract.id) {
          const now = new Date();
          submitData.合約建立日期時間 = now;
          submitData.創建時間 = now;
          submitData.更新時間 = now;
        } else {
          submitData.更新時間 = new Date();
        }

        this.$emit("save", submitData);

        // 如果是新增模式，成功後清空
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

      try {
        let dateObj;
        if (date.toDate && typeof date.toDate === "function") {
          dateObj = date.toDate();
        } else if (date instanceof Date) {
          dateObj = date;
        } else {
          dateObj = new Date(date);
        }

        // 檢查日期是否有效
        if (isNaN(dateObj.getTime())) {
          console.warn('無效的日期:', date);
          return "";
        }

        // 格式化為 YYYY-MM-DDTHH:MM
        return dateObj.toISOString().slice(0, 16);
      } catch (error) {
        console.error('日期格式化失敗:', error, date);
        return "";
      }
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

    // 套用折扣
    applyDiscount(discountRate) {
      const originalTotal = this.calculateTotal();
      this.formData.合約總金額 = Math.round(originalTotal * discountRate);
      const discountPercent = Math.round((1 - discountRate) * 100);
      this.showToast(`已套用 ${discountPercent}% 折扣`, "success");
    },

    // 格式化租用期間
    formatRentalPeriod() {
      if (!this.formData.租用開始時間 || !this.formData.租用結束時間) {
        return "尚未設定";
      }
      
      const startDate = new Date(this.formData.租用開始時間);
      const endDate = new Date(this.formData.租用結束時間);
      
      const formatOptions = {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      
      const startStr = startDate.toLocaleString("zh-TW", formatOptions);
      const endStr = endDate.toLocaleString("zh-TW", formatOptions);
      
      return `${startStr} - ${endStr}`;
    },

    // 處理客戶簽名圖片上傳
    handleSignatureUpload(event) {
      const file = event.target.files[0];
      if (file) {
        // 檢查文件大小 (限制為 5MB)
        if (file.size > 5 * 1024 * 1024) {
          this.showToast("圖片檔案不能超過 5MB", "warning");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          this.formData.客戶簽名 = e.target.result;
          this.showToast("客戶簽名已上傳", "success");
        };
        reader.readAsDataURL(file);
      }
    },

    // 移除客戶簽名
    removeSignature() {
      this.formData.客戶簽名 = "";
      this.showToast("已移除客戶簽名", "info");
    },

    // 新增付款記錄列
    addPaymentRow() {
      // 獲取今天的日期（YYYY-MM-DD格式）
      const today = new Date().toISOString().split('T')[0];
      
      this.formData.付款記錄.push({
        付款別: "",
        金額: 0,
        金額百分比: "",
        接待人員: this.formData.承辦人 || "",
        付款日期: today
      });
    },

    // 計算付款金額（根據百分比）
    calculatePaymentAmount(index) {
      const payment = this.formData.付款記錄[index];
      if (payment.金額百分比 && this.formData.合約總金額) {
        payment.金額 = Math.round((this.formData.合約總金額 * payment.金額百分比) / 100);
      } else if (!payment.金額百分比) {
        payment.金額 = 0;
      }
    },

    // 移除付款記錄列
    removePaymentRow(index) {
      this.formData.付款記錄.splice(index, 1);
      this.showToast("已移除付款記錄", "info");
    },

    // 產生新的合約單號
    async generateNewContractNumber() {
      try {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2); // 年份後兩位
        const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 月份
        const day = now.getDate().toString().padStart(2, "0"); // 日期
        const dateStr = `${month}${day}`; // 月日格式：0908

        // 查詢今天已有的合約數量來生成序號
        const todayContractNumber = await this.getTodayContractCount(now);
        const serialNumber = (todayContractNumber + 1).toString().padStart(3, "0");

        const generatedContractNumber = `V${year}${dateStr}${serialNumber}`;
        
        // 檢查是否重複
        const isUnique = await this.checkContractNumberExists(generatedContractNumber);
        if (!isUnique) {
          // 如果重複，遞增序號直到找到唯一的
          let counter = todayContractNumber + 2;
          let uniqueNumber;
          do {
            const newSerial = counter.toString().padStart(3, "0");
            uniqueNumber = `V${year}${dateStr}${newSerial}`;
            counter++;
          } while (!(await this.checkContractNumberExists(uniqueNumber)) && counter < 999);
          
          this.formData.合約單號 = uniqueNumber;
        } else {
          this.formData.合約單號 = generatedContractNumber;
        }

        console.log("生成的合約單號:", this.formData.合約單號);
        
        // 檢查唯一性
        await this.checkContractNumberUnique();
        
      } catch (error) {
        console.error("產生合約單號失敗:", error);
        this.showToast("產生合約單號失敗", "error");
      }
    },

    // 檢查合約單號是否存在（返回true表示唯一，false表示重複）
    async checkContractNumberExists(contractNumber) {
      try {
        const { contractService } = await import("../services/firestore.js");
        const allContracts = await contractService.getAll();
        
        // 檢查是否有相同的合約單號
        const exists = allContracts.some(contract => contract.合約單號 === contractNumber);
        return !exists; // 返回true表示唯一（不存在），false表示重複（已存在）
      } catch (error) {
        console.error("檢查合約單號失敗:", error);
        return true; // 檢查失敗時假設唯一
      }
    },

    // 檢查合約單號唯一性
    async checkContractNumberUnique() {
      if (!this.formData.合約單號) {
        this.contractNumberStatus = null;
        return;
      }

      try {
        this.checkingContractNumber = true;
        this.contractNumberStatus = null;

        const isUnique = await this.checkContractNumberExists(this.formData.合約單號);
        
        if (isUnique) {
          this.contractNumberStatus = {
            type: 'success',
            message: '合約單號可用'
          };
        } else {
          this.contractNumberStatus = {
            type: 'error',
            message: '合約單號已存在，請修改或重新產生'
          };
        }
      } catch (error) {
        console.error("檢查合約單號唯一性失敗:", error);
        this.contractNumberStatus = {
          type: 'error',
          message: '檢查失敗，請稍後再試'
        };
      } finally {
        this.checkingContractNumber = false;
      }
    },

    // 合約單號輸入時的處理
    onContractNumberInput() {
      // 清除之前的檢查狀態
      this.contractNumberStatus = null;
      this.clearValidationError('合約單號');
      
      // 延遲檢查，避免頻繁調用
      clearTimeout(this.contractNumberCheckTimeout);
      this.contractNumberCheckTimeout = setTimeout(() => {
        this.checkContractNumberUnique();
      }, 800);
    },

    // 清除特定欄位的驗證錯誤
    clearValidationError(field) {
      if (this.validationErrors[field]) {
        delete this.validationErrors[field];
      }
    },

    // 清除所有驗證錯誤
    clearAllValidationErrors() {
      this.validationErrors = {};
    },

    // 格式化付款日期
    formatPaymentDate(dateStr) {
      if (!dateStr) return "";
      
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
.modal {
  backdrop-filter: blur(4px);
}

.modal-dialog-scrollable .modal-body {
  max-height: calc(100vh - 200px);
}

/* 隱藏滾動條但保持滾動功能 */
.custom-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.custom-scrollbar::-webkit-scrollbar {
  width: 0px; /* WebKit */
  background: transparent; /* Chrome/Safari/Webkit */
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

/* Placeholder 淺色樣式 */
.form-control::placeholder,
.form-select::placeholder,
textarea::placeholder {
  color: #C0C0C0 !important;
  font-size: 14px !important;
  opacity: 1;
}

.form-control::-webkit-input-placeholder,
.form-select::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #C0C0C0 !important;
  font-size: 14px !important;
}

.form-control::-moz-placeholder,
.form-select::-moz-placeholder,
textarea::-moz-placeholder {
  color: #C0C0C0 !important;
  font-size: 14px !important;
  opacity: 1;
}

.form-control:-ms-input-placeholder,
.form-select:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  color: #C0C0C0 !important;
  font-size: 14px !important;
}

/* 下拉選單和輸入框文字大小 */
.form-control,
.form-select {
  font-size: 14px !important;
}

/* 下拉選單選項文字大小 */
.form-select option {
  font-size: 14px !important;
}

/* 簽名圖片上傳相關樣式 */
.signature-upload-area {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  transition: border-color 0.3s ease;
}

.signature-upload-area:hover {
  border-color: #0d6efd;
}

.signature-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.signature-image {
  width: 300px;
  height: 100px;
  object-fit: contain;
}

/* 付款記錄表格相關樣式 */
.payment-table {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
}

.payment-table .input-group-text {
  font-size: 14px;
  background-color: #e9ecef;
  border-color: #ced4da;
}

.signature-display {
  text-align: center;
  padding: 5px;
}

.payment-signature-preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

.payment-signature-image {
  max-width: 120px;
  max-height: 60px;
  object-fit: contain;
}

.payment-amount-column {
  min-width: 120px;
}

.staff-display {
  padding: 5px;
}

.table th {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  background-color: #f8f9fa !important;
  border-color: #dee2e6;
}

.table td {
  font-size: 14px;
  vertical-align: middle;
  border-color: #dee2e6;
}

.table-responsive {
  border-radius: 8px;
  overflow: hidden;
}

/* 驗證錯誤樣式 */
.dress-list-error {
  border: 2px solid #dc3545 !important;
  border-radius: 8px;
  background-color: rgba(220, 53, 69, 0.05);
}
</style>
