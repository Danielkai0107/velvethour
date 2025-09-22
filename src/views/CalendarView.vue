<template>
  <div class="container-fluid px-4 py-3">
    <!-- 頂部工具欄 -->
    <div class="top-toolbar d-flex justify-content-between align-items-center mb-4">
      <!-- 左側：搜索和篩選 -->
      <div class="d-flex align-items-center gap-3">
        <!-- 搜索框 -->
        <div class="search-container position-relative">
          <i class="bi bi-search search-icon"></i>
          <input
            type="text"
            class="form-control search-input"
            placeholder="在行事曆中搜尋"
            v-model="searchQuery"
            @input="handleSearch"
          />
        </div>
        
        <!-- 篩選器 -->
        <div class="filter-dropdowns d-flex gap-2">
          <!-- 承辦人篩選 -->
          <div class="dropdown">
            <button
              class="btn btn-outline-secondary dropdown-toggle filter-btn"
              type="button"
              data-bs-toggle="dropdown"
            >
              承辦人
              <span v-if="selectedStaff" class="badge bg-primary ms-1">1</span>
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#" @click="clearStaffFilter">全部承辦人</a></li>
              <li><hr class="dropdown-divider"></li>
              <li v-for="staff in staffOptions" :key="staff">
                <a 
                  class="dropdown-item" 
                  href="#" 
                  @click="setStaffFilter(staff)"
                  :class="{ active: selectedStaff === staff }"
                >
                  {{ staff }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- 右側：日期導航和視圖控制 -->
      <div class="d-flex align-items-center gap-3">
        <!-- 今天按鈕 -->
        <button 
          class="btn btn-outline-secondary today-btn"
          @click="goToToday"
        >
          今天
        </button>
        
        <!-- 日期導航 -->
        <div class="date-navigation d-flex align-items-center">
          <button 
            class="btn btn-ghost nav-btn"
            @click="previousPeriod"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
          
          <div class="current-period">
            <h4 class="mb-0 fw-semibold current-date">{{ currentPeriodTitle }}</h4>
          </div>
          
          <button 
            class="btn btn-ghost nav-btn"
            @click="nextPeriod"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
        
      </div>
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
      <p class="mt-2 text-muted" style="font-size: 14px;">載入合約資料中...</p>
    </div>

    <!-- 日曆主體 -->
    <div v-else class="calendar-main">
      <div class="calendar-container bg-white rounded-3 shadow-sm">
        <FullCalendar
          :options="calendarOptions"
          ref="fullCalendar"
        />
      </div>
    </div>

    <!-- 合約詳情側邊欄 -->
    <div 
      class="contract-sidebar offcanvas offcanvas-end"
      :class="{ 'show': selectedContract }"
      tabindex="-1"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title">合約資訊</h5>
        <button 
          type="button" 
          class="btn-close" 
          @click="closeContractSidebar"
        ></button>
      </div>
      
      <div class="offcanvas-body" v-if="selectedContract">
        <!-- 合約詳情內容 -->
        <div class="contract-details">
          <!-- 標題 -->
          <div class="mb-3">
            <label class="form-label fw-semibold small">標題</label>
            <input
              v-if="editingTitle"
              v-model="editableTitle"
              @blur="saveTitle"
              @keyup.enter="saveTitle"
              class="form-control"
              ref="titleInput"
            />
            <div
              v-else
              @click="startEditTitle"
              class="form-control-plaintext border rounded p-2 cursor-pointer"
            >
              {{ editableTitle }}
              <i class="bi bi-pencil float-end text-muted small"></i>
            </div>
          </div>

          <!-- 客戶姓名 -->
          <div class="mb-3">
            <label class="form-label fw-semibold small">客戶姓名</label>
            <div class="form-control-plaintext bg-light rounded p-2">
              {{ selectedContract.客戶姓名 }}
            </div>
          </div>

          <!-- 租期 -->
          <div class="mb-3">
            <label class="form-label fw-semibold small">租期</label>
            <div class="form-control-plaintext bg-light rounded p-2">
              {{ formatDateRange(selectedContract.租用開始時間, selectedContract.租用結束時間) }}
            </div>
          </div>


          <!-- 備註 -->
          <div class="mb-4">
            <label class="form-label fw-semibold small">備註</label>
            <textarea
              v-if="editingNote"
              v-model="editableNote"
              @blur="saveNote"
              class="form-control"
              rows="3"
              ref="noteTextarea"
            ></textarea>
            <div
              v-else
              @click="startEditNote"
              class="form-control-plaintext border rounded p-2 cursor-pointer"
              style="min-height: 80px;"
            >
              {{ editableNote || "點擊新增備註..." }}
              <i class="bi bi-pencil float-end text-muted small"></i>
            </div>
          </div>

          <!-- 查看詳情按鈕 -->
          <button
            @click="goToContractDetail(selectedContract.id)"
            class="btn btn-primary w-100"
          >
            <i class="bi bi-eye me-2"></i>查看詳細合約
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { contractService } from "../services/firestore.js";
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export default {
  name: "CalendarView",
  components: {
    FullCalendar,
  },
  data() {
    return {
      loading: true,
      contracts: [],
      searchQuery: "",
      selectedStaff: "",
      selectedContract: null,
      editingTitle: false,
      editingNote: false,
      editableTitle: "",
      editableNote: "",
      currentDate: new Date(),
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        locale: 'zh-tw',
        headerToolbar: false, // 隱藏預設工具欄
        height: 'auto',
        aspectRatio: 1.8,
        dayMaxEvents: false,
        moreLinkClick: 'popover',
        eventDisplay: 'block',
        displayEventTime: false,
        events: [],
        eventClick: this.handleEventClick,
        eventDidMount: this.handleEventMount,
        dayCellDidMount: this.handleDayCellMount,
        firstDay: 1, // 週一為第一天
        dayHeaderFormat: { weekday: 'short' },
        eventClassNames: this.getEventClassNames,
        eventContent: this.renderEventContent,
      }
    };
  },
  computed: {
    staffOptions() {
      const staffSet = new Set();
      this.contracts.forEach(contract => {
        if (contract.承辦人) {
          staffSet.add(contract.承辦人);
        }
      });
      return Array.from(staffSet).sort();
    },
    filteredContracts() {
      let filtered = this.contracts;
      
      // 承辦人篩選
      if (this.selectedStaff) {
        filtered = filtered.filter(contract => 
          contract.承辦人 === this.selectedStaff
        );
      }
      
      // 搜索篩選
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(contract => 
          contract.客戶姓名?.toLowerCase().includes(query) ||
          contract.合約單號?.toLowerCase().includes(query) ||
          contract.承辦人?.toLowerCase().includes(query)
        );
      }
      
      return filtered;
    },
    currentPeriodTitle() {
      return this.currentDate.toLocaleDateString('zh-TW', { 
        year: 'numeric', 
        month: 'long' 
      });
    }
  },
  async mounted() {
    await this.loadContracts();
  },
  methods: {
    async loadContracts() {
      try {
        this.loading = true;
        this.contracts = await contractService.getAll();
        this.updateCalendarEvents();
      } catch (error) {
        console.error("載入合約資料失敗:", error);
        this.showToast("載入合約資料失敗，請稍後再試", "error");
      } finally {
        this.loading = false;
      }
    },
    
    updateCalendarEvents() {
      const events = [];
      
      this.filteredContracts.forEach(contract => {
        if (contract.處理狀態 === "已取消") return;
        
        const startTime = this.parseDate(contract.租用開始時間);
        const nextAvailableTime = contract.下次可用時間 
          ? this.parseDate(contract.下次可用時間)
          : this.parseDate(contract.租用結束時間);
          
        if (!startTime || !nextAvailableTime) return;
        
        const startDate = this.formatDateForCalendar(startTime);
        const endDate = this.formatDateForCalendar(nextAvailableTime, true);
        const eventTitle = contract.自定義標題 || this.getDefaultTitle(contract);

        events.push({
          id: contract.id,
          title: eventTitle,
          start: startDate,
          end: endDate,
          extendedProps: {
            contract: contract,
            contractNumber: contract.合約單號,
            status: contract.處理狀態,
            staff: contract.承辦人,
            amount: contract.合約總金額,
          },
          backgroundColor: this.getEventBackgroundColor(contract),
          borderColor: this.getEventBorderColor(contract),
          textColor: this.getEventTextColor(contract),
        });
      });
      
      this.calendarOptions.events = events;
    },

    // 搜索處理
    handleSearch() {
      this.updateCalendarEvents();
    },

    // 篩選器方法
    setStaffFilter(staff) {
      this.selectedStaff = staff;
      this.updateCalendarEvents();
    },
    
    clearStaffFilter() {
      this.selectedStaff = "";
      this.updateCalendarEvents();
    },

    // 日期導航
    goToToday() {
      if (this.$refs.fullCalendar) {
        this.$refs.fullCalendar.getApi().today();
        this.currentDate = new Date();
      }
    },
    
    previousPeriod() {
      if (this.$refs.fullCalendar) {
        this.$refs.fullCalendar.getApi().prev();
        this.updateCurrentDate();
      }
    },
    
    nextPeriod() {
      if (this.$refs.fullCalendar) {
        this.$refs.fullCalendar.getApi().next();
        this.updateCurrentDate();
      }
    },

    updateCurrentDate() {
      if (this.$refs.fullCalendar) {
        this.currentDate = this.$refs.fullCalendar.getApi().getDate();
      }
    },


    // 事件處理
    handleEventClick(info) {
      const contractId = info.event.id;
      const contract = this.contracts.find(c => c.id === contractId);
      if (contract) {
        this.showContractSidebar(contract);
      }
    },

    handleEventMount(info) {
      const contract = info.event.extendedProps.contract;
      info.el.title = this.getContractTooltip(contract);
      info.el.style.cursor = 'pointer';
    },

    handleDayCellMount(info) {
      if (info.isToday) {
        info.el.classList.add('fc-day-today');
      }
    },

    // 側邊欄處理
    showContractSidebar(contract) {
      this.selectedContract = contract;
      this.editableTitle = contract.自定義標題 || this.getDefaultTitle(contract);
      this.editableNote = contract.自定義備註 || "";
      this.editingTitle = false;
      this.editingNote = false;
    },

    closeContractSidebar() {
      this.selectedContract = null;
      this.editingTitle = false;
      this.editingNote = false;
    },

    // 編輯功能
    startEditTitle() {
      this.editingTitle = true;
      this.$nextTick(() => {
        if (this.$refs.titleInput) {
          this.$refs.titleInput.focus();
        }
      });
    },

    async saveTitle() {
      this.editingTitle = false;
      try {
        await contractService.update(this.selectedContract.id, {
          自定義標題: this.editableTitle
        });
        this.showToast("標題已更新", "success");
        
        const contractIndex = this.contracts.findIndex(c => c.id === this.selectedContract.id);
        if (contractIndex !== -1) {
          this.contracts[contractIndex].自定義標題 = this.editableTitle;
          this.selectedContract.自定義標題 = this.editableTitle;
        }
        this.updateCalendarEvents();
      } catch (error) {
        console.error("更新標題失敗:", error);
        this.showToast("更新標題失敗", "error");
      }
    },

    startEditNote() {
      this.editingNote = true;
      this.$nextTick(() => {
        if (this.$refs.noteTextarea) {
          this.$refs.noteTextarea.focus();
        }
      });
    },

    async saveNote() {
      this.editingNote = false;
      try {
        await contractService.update(this.selectedContract.id, {
          自定義備註: this.editableNote
        });
        this.showToast("備註已更新", "success");
        
        const contractIndex = this.contracts.findIndex(c => c.id === this.selectedContract.id);
        if (contractIndex !== -1) {
          this.contracts[contractIndex].自定義備註 = this.editableNote;
        }
      } catch (error) {
        console.error("更新備註失敗:", error);
        this.showToast("更新備註失敗", "error");
      }
    },

    // 工具方法
    parseDate(dateValue) {
      if (!dateValue) return null;
      
      if (dateValue.toDate && typeof dateValue.toDate === "function") {
        return dateValue.toDate();
      } else if (dateValue instanceof Date) {
        return dateValue;
      } else {
        return new Date(dateValue);
      }
    },

    formatDateForCalendar(date, isEndDate = false) {
      const dateObj = this.parseDate(date);
      if (!dateObj) return null;
      
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate() + (isEndDate ? 1 : 0)).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    },

    getDefaultTitle(contract) {
      return `${contract.客戶姓名} - ${contract.合約單號}`;
    },

    getEventBackgroundColor(contract) {
      const statusColors = {
        '待確認': '#fff3cd',
        '已確認': '#d1ecf1', 
        '進行中': '#d4edda',
        '已完成': '#e2e3e5',
        '已取消': '#f8d7da'
      };
      return statusColors[contract.處理狀態] || '#e2e3e5';
    },

    getEventBorderColor(contract) {
      const borderColors = {
        '待確認': '#ffeaa7',
        '已確認': '#74b9ff',
        '進行中': '#00b894',
        '已完成': '#636e72',
        '已取消': '#e17055'
      };
      return borderColors[contract.處理狀態] || '#636e72';
    },

    getEventTextColor(contract) {
      return '#2d3436';
    },

    getEventClassNames(info) {
      const contract = info.event.extendedProps.contract;
      return [`contract-${contract.處理狀態}`];
    },

    renderEventContent(info) {
      const contract = info.event.extendedProps.contract;
      const displayTitle = contract.自定義標題 || this.getDefaultTitle(contract);
      
      return {
        html: `
          <div class="contract-event-content">
            <div class="contract-title">${displayTitle}</div>
            <div class="contract-time">${this.formatStartTime(contract.租用開始時間)}</div>
          </div>
        `
      };
    },

    getContractTooltip(contract) {
      const startTime = this.formatDateTime(contract.租用開始時間);
      const endTime = this.formatDateTime(contract.租用結束時間);
      
      let tooltip = `合約: ${contract.合約單號}\n`;
      tooltip += `客戶: ${contract.客戶姓名}\n`;
      tooltip += `狀態: ${contract.處理狀態}\n`;
      tooltip += `租用時間: ${startTime} ~ ${endTime}\n`;
      tooltip += `承辦人: ${contract.承辦人 || "未指定"}\n`;
      tooltip += `金額: NT$ ${contract.合約總金額?.toLocaleString() || 0}`;
      
      return tooltip;
    },


    formatDateRange(startDate, endDate) {
      if (!startDate || !endDate) return "未設定";

      const formatSingleDate = (date) => {
        const dateObj = this.parseDate(date);
        if (!dateObj) return "未設定";
        return dateObj.toLocaleDateString("zh-TW", {
          year: "numeric",
          month: "2-digit", 
          day: "2-digit",
        });
      };

      const start = formatSingleDate(startDate);
      const end = formatSingleDate(endDate);
      
      return `${start} - ${end}`;
    },

    formatDateTime(date) {
      if (!date) return "未設定";
      
      const dateObj = this.parseDate(date);
      if (!dateObj) return "未設定";
      
      return dateObj.toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }) + " " + dateObj.toLocaleTimeString("zh-TW", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },

    formatStartTime(date) {
      if (!date) return "";
      
      const dateObj = this.parseDate(date);
      if (!dateObj) return "";
      
      return dateObj.toLocaleTimeString("zh-TW", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },

    goToContractDetail(contractId) {
      this.$router.push(`/contracts/${contractId}`);
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
/* 整體容器 */
.container-fluid {
  max-width: 1400px;
  margin: 0 auto;
}

/* 頂部工具欄 */
.top-toolbar {
  padding: 1rem 0;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 2rem;
}

/* 搜索框 */
.search-container {
  width: 300px;
}

.search-input {
  padding-left: 2.5rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  z-index: 5;
}

/* 篩選按鈕 */
.filter-btn {
  font-size: 14px;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  white-space: nowrap;
}

/* 今天按鈕 */
.today-btn {
  font-size: 14px;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

/* 日期導航 */
.date-navigation {
  gap: 1rem;
}

.nav-btn {
  border: none;
  background: none;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-btn:hover {
  background-color: #f8f9fa;
}

.current-date {
  font-size: 1.5rem;
  color: #2d3436;
  min-width: 200px;
  text-align: center;
}



/* 日曆容器 */
.calendar-main {
  margin-top: 1rem;
}

.calendar-container {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  padding: 1.5rem;
}

/* FullCalendar 自定義樣式 */
:deep(.fc) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 隱藏預設工具欄 */
:deep(.fc-header-toolbar) {
  display: none;
}

/* 日期格子 */
:deep(.fc-daygrid-day) {
  min-height: 120px;
  border: 1px solid #f1f3f4;
}

:deep(.fc-daygrid-day-number) {
  font-size: 14px;
  font-weight: 500;
  color: #5f6368;
  padding: 8px 12px;
  text-decoration: none;
}

:deep(.fc-day-today) {
  background-color: #fff !important;
}

:deep(.fc-day-today .fc-daygrid-day-number) {
  position: relative !important;
  color: #333 !important;
  font-weight: 600 !important;
  text-decoration: none !important;
  padding-left: 16px !important;
}

:deep(.fc-day-today .fc-daygrid-day-number::before) {
  content: '' !important;
  position: absolute !important;
  left: 4px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: 6px !important;
  height: 6px !important;
  background-color: #1a73e8 !important;
  border-radius: 50% !important;
}

/* 星期標題 */
:deep(.fc-col-header-cell) {
  background-color: #fff;
  border-bottom: 1px solid #f1f3f4;
  font-weight: 500;
  color: #5f6368;
  text-transform: uppercase;
  font-size: 11px;
  padding: 12px 8px;
}

:deep(.fc-col-header-cell-cushion) {
  text-decoration: none;
  color: #5f6368;
}

/* 事件樣式 */
:deep(.fc-event) {
  border: none;
  border-radius: 8px;
  margin: 1px 2px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

:deep(.fc-event:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

:deep(.fc-event-title) {
  font-weight: 500;
  padding: 0;
}

/* 事件內容 */
.contract-event-content {
  padding: 4px;
  line-height: 1.2;
}

.contract-title {
  font-weight: 500;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contract-time {
  font-size: 10px;
  opacity: 0.8;
  margin-top: 1px;
}

/* 側邊欄 */
.contract-sidebar {
  width: 400px;
  border: none;
  box-shadow: -2px 0 10px rgba(0,0,0,0.1);
}

.contract-sidebar .offcanvas-header {
  border-bottom: 1px solid #e9ecef;
  padding: 1.5rem;
}

.contract-sidebar .offcanvas-body {
  padding: 1.5rem;
}

/* 表單元素 */
.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-control-plaintext {
  font-size: 14px;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  background-color: #f8f9fa;
}

/* 下拉菜單 */
.dropdown-item.active {
  background-color: #e3f2fd;
  color: #1976d2;
}

/* 響應式設計 */
@media (max-width: 1200px) {
  .search-container {
    width: 250px;
  }
  
  .current-date {
    font-size: 1.25rem;
    min-width: 150px;
  }
}

@media (max-width: 768px) {
  .top-toolbar {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch !important;
  }
  
  .search-container {
    width: 100%;
  }
  
  .filter-dropdowns {
    flex-wrap: wrap;
  }
  
  .date-navigation {
    justify-content: center;
  }
  
  .current-date {
    font-size: 1.1rem;
    min-width: auto;
  }
  
  :deep(.fc-daygrid-day) {
    min-height: 80px;
  }
}
</style>
