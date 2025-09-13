<template>
  <div class="container-fluid">
    <!-- 頁面標題 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0 fw-bold">合約檔期日曆</h1>
    </div>

    <!-- 承辦人篩選 -->
    <div class="bg-white rounded-4 shadow-sm border-0 mb-4 p-3">
      <div class="row align-items-center">
        <div class="col-4">
          <select
            v-model="selectedStaff"
            class="form-select"
            style="font-size: 14px"
            @change="updateCalendarEvents"
          >
            <option value="">全部承辦人</option>
            <option v-for="staff in staffOptions" :key="staff" :value="staff">
              {{ staff }}
            </option>
          </select>
        </div>
        <div class="col-8">
          <button
            v-if="selectedStaff"
            @click="clearStaffFilter"
            class="btn btn-outline-secondary btn-sm"
            style="font-size: 13px"
          >
            <i class="bi bi-x-circle me-1"></i>清除篩選
          </button>
        </div>
      </div>
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
      <p class="mt-2 text-muted">載入合約資料中...</p>
    </div>

    <!-- FullCalendar 日曆 -->
    <div v-else class="bg-white rounded-4 shadow-sm border-0 overflow-hidden" style="border: 1px solid #f0f0f0;">
      <div class="p-4">
        <FullCalendar
          :options="calendarOptions"
          ref="fullCalendar"
        />
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
      selectedStaff: "",
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        locale: 'en',
        headerToolbar: {
          left: 'prev,next',
          center: 'title',
          right: 'today'
        },
        height: 'auto',
        aspectRatio: 1.35,
        dayMaxEvents: false,
        moreLinkClick: 'popover',
        eventDisplay: 'block',
        displayEventTime: false,
        events: [],
        eventClick: this.handleEventClick,
        eventDidMount: this.handleEventMount,
        dayCellDidMount: this.handleDayCellMount,
        buttonText: {
          today: '今天',
          month: '月',
          week: '週',
          day: '日'
        },
        dayHeaderFormat: { weekday: 'short' },
        titleFormat: { year: 'numeric', month: 'long' },
        eventClassNames: this.getEventClassNames,
        eventContent: this.renderEventContent,
      }
    };
  },
  computed: {
    staffOptions() {
      // 從合約中提取所有承辦人選項
      const staffSet = new Set();
      this.contracts.forEach(contract => {
        if (contract.承辦人) {
          staffSet.add(contract.承辦人);
        }
      });
      return Array.from(staffSet).sort();
    },
    filteredContracts() {
      // 根據選擇的承辦人篩選合約
      if (!this.selectedStaff) {
        return this.contracts;
      }
      return this.contracts.filter(contract => 
        contract.承辦人 === this.selectedStaff
      );
    },
  },
  async mounted() {
    await this.loadContracts();
  },
  watch: {
    '$route'(to, from) {
      if (to.name === 'CalendarView' && from.name !== 'CalendarView') {
        this.loadContracts();
      }
    }
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
        // 跳過已取消的合約
        if (contract.處理狀態 === "已取消") {
          return;
        }
        
        const startTime = this.parseDate(contract.租用開始時間);
        const nextAvailableTime = contract.下次可用時間 
          ? this.parseDate(contract.下次可用時間)
          : this.parseDate(contract.租用結束時間);
          
        if (!startTime || !nextAvailableTime) return;
        
        // 格式化為 FullCalendar 需要的日期格式
        const startDate = this.formatDateForCalendar(startTime);
        const endDate = this.formatDateForCalendar(nextAvailableTime, true); // 結束日期需要+1天
        
        // 格式化開始時間
        const startTimeFormatted = this.formatStartTime(contract.租用開始時間);
        console.log('Start time for contract:', contract.合約單號, 'Original:', contract.租用開始時間, 'Formatted:', startTimeFormatted);
        const eventTitle = startTimeFormatted ? `${startTimeFormatted} ${contract.客戶姓名}` : contract.客戶姓名;

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
            isRentalPeriod: this.isInRentalPeriod(contract),
          },
          backgroundColor: this.getEventBackgroundColor(contract, events),
          borderColor: this.getEventBorderColor(contract, events),
          textColor: this.getEventTextColor(contract, events),
        });
      });
      
      // 更新日曆事件
      this.calendarOptions.events = events;
    },
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
    isInRentalPeriod(contract) {
      const now = new Date();
      const rentStart = this.parseDate(contract.租用開始時間);
      const rentEnd = this.parseDate(contract.租用結束時間);
      
      return now >= rentStart && now <= rentEnd;
    },
    getEventBackgroundColor(contract, existingEvents) {
      // 已取消的合約使用灰色
      if (contract.處理狀態 === "已取消") {
        return "#f8f9fa";
      }
      
      // 重複事件的顏色序列
      const overlapColors = [
        "#e2b9db", // 第一層
        "#ffb5cc", // 第二層
        "#fadce4", // 第三層
        "#9dd2d8", // 第四層
        "#9dc3e2", // 第五層
      ];
      
      const overlapLevel = this.getOverlapLevel(contract, existingEvents);
      
      // 根據重複層次返回對應顏色
      if (overlapLevel < overlapColors.length) {
        return overlapColors[overlapLevel];
      } else {
        // 如果超過預設顏色數量，循環使用
        return overlapColors[overlapLevel % overlapColors.length];
      }
    },
    getEventBorderColor(contract, existingEvents) {
      if (contract.處理狀態 === "已取消") {
        return "#dee2e6";
      }
      
      // 邊框顏色比背景顏色稍深
      const overlapBorderColors = [
        "#d4a5c7", // 第一層邊框
        "#ff9bb8", // 第二層邊框
        "#f5c8d0", // 第三層邊框
        "#7bc5cb", // 第四層邊框
        "#7fb6d8", // 第五層邊框
      ];
      
      const overlapLevel = this.getOverlapLevel(contract, existingEvents);
      
      if (overlapLevel < overlapBorderColors.length) {
        return overlapBorderColors[overlapLevel];
      } else {
        return overlapBorderColors[overlapLevel % overlapBorderColors.length];
      }
    },
    getEventTextColor(contract, existingEvents) {
      if (contract.處理狀態 === "已取消") {
        return "#6c757d";
      }
      
      // 統一使用黑色文字以確保最佳可讀性
      return "#333333";
    },
    getOverlapLevel(contract, existingEvents) {
      const contractStartDate = this.formatDateForCalendar(this.parseDate(contract.租用開始時間));
      const contractEndDate = this.formatDateForCalendar(
        contract.下次可用時間 
          ? this.parseDate(contract.下次可用時間)
          : this.parseDate(contract.租用結束時間), 
        true
      );
      
      // 計算與現有事件的重複數量
      let overlapCount = 0;
      existingEvents.forEach(existingEvent => {
        // 跳過自己和已取消的事件
        if (existingEvent.id === contract.id || 
            existingEvent.extendedProps?.contract?.處理狀態 === "已取消") {
          return;
        }
        
        // 檢查日期範圍是否重疊
        const existingStart = existingEvent.start;
        const existingEnd = existingEvent.end;
        
        // 簡單的日期重疊檢查
        if (!(contractEndDate <= existingStart || contractStartDate >= existingEnd)) {
          overlapCount++;
        }
      });
      
      return overlapCount;
    },
    handleEventClick(info) {
      const contractId = info.event.id;
      this.goToContractDetail(contractId);
    },
    handleEventMount(info) {
      const contract = info.event.extendedProps.contract;
      
      // 設置工具提示
      info.el.title = this.getContractTooltip(contract);
      
      // 添加自定義樣式
      info.el.style.cursor = 'pointer';
      info.el.style.borderRadius = '4px';
      info.el.style.fontSize = '12px';
      info.el.style.fontWeight = '500';
    },
    handleDayCellMount(info) {
      // 可以在這裡自定義日期格子的樣式
      if (info.isToday) {
        info.el.style.backgroundColor = '#e3f2fd';
      }
    },
    getEventClassNames(info) {
      const contract = info.event.extendedProps.contract;
      const classes = ['contract-event'];
      
      if (contract.處理狀態 === "進行中") {
        classes.push('contract-active');
      }
      
      return classes;
    },
    renderEventContent(info) {
      const contract = info.event.extendedProps.contract;
      const startTimeFormatted = this.formatStartTime(contract.租用開始時間);
      const displayName = startTimeFormatted ? `${startTimeFormatted} ${contract.客戶姓名}` : contract.客戶姓名;
      
      return {
        html: `
          <div class="contract-event-content">
            <div class="contract-title">${displayName}</div>
            <div class="contract-number">${contract.合約單號}</div>
          </div>
        `
      };
    },
    getContractTooltip(contract) {
      const startTime = this.formatDateTime(contract.租用開始時間);
      const endTime = this.formatDateTime(contract.租用結束時間);
      const nextAvailable = contract.下次可用時間 
        ? this.formatDateTime(contract.下次可用時間)
        : null;
      
      let tooltip = `合約: ${contract.合約單號}\n`;
      tooltip += `客戶: ${contract.客戶姓名}\n`;
      tooltip += `狀態: ${contract.處理狀態}\n`;
      tooltip += `租用時間: ${startTime} ~ ${endTime}\n`;
      if (nextAvailable) {
        tooltip += `下次可用: ${nextAvailable}\n`;
      }
      tooltip += `承辦人: ${contract.承辦人 || "未指定"}\n`;
      tooltip += `金額: NT$ ${contract.合約總金額?.toLocaleString() || 0}`;
      
      return tooltip;
    },
    goToContractDetail(contractId) {
      this.$router.push(`/contracts/${contractId}`);
    },
    clearStaffFilter() {
      this.selectedStaff = "";
      this.updateCalendarEvents();
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
      if (!date) {
        console.log('formatStartTime: No date provided');
        return "";
      }
      
      const dateObj = this.parseDate(date);
      if (!dateObj) {
        console.log('formatStartTime: Failed to parse date:', date);
        return "";
      }
      
      const timeString = dateObj.toLocaleTimeString("zh-TW", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      
      console.log('formatStartTime: Input:', date, 'Parsed:', dateObj, 'Output:', timeString);
      return timeString;
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
/* FullCalendar 自定義樣式 - 簡約白色風格 */
:deep(.fc) {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: transparent;
}

:deep(.fc-toolbar-title) {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

/* 簡約按鈕樣式 */
:deep(.fc-button) {
  background-color: #fff;
  border: 1px solid #dee2e6;
  color: #495057;
  border-radius: 8px;
  font-size: 0.875rem;
  padding: 0.5rem 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: none;
}

:deep(.fc-button:hover) {
  background-color: #f8f9fa;
  border-color: #dee2e6;
  color: #495057;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}

:deep(.fc-button:focus) {
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
}

:deep(.fc-button-primary:not(:disabled):active),
:deep(.fc-button-primary:not(:disabled).fc-button-active) {
  background-color: #007bff;
  border-color: #007bff;
  color: #fff;
}

:deep(.fc-today-button) {
  background-color: #fff;
  border-color: #8E3E36;
  color: #8E3E36;
}

:deep(.fc-today-button:hover) {
  background-color: #8E3E36;
  border-color: #8E3E36;
  color: #fff;
}

/* 日期格子樣式 - 簡約風格 */
:deep(.fc-daygrid-day) {
  min-height: 100px;
  background-color: #fff;
}

:deep(.fc-daygrid-day-number) {
  font-weight: 600;
  color: #333;
  padding: 8px;
  font-size: 14px;
  text-decoration: none !important;
}

/* 移除日期數字的底線 */
:deep(.fc-daygrid-day-number a) {
  text-decoration: none !important;
  color: inherit;
}

:deep(.fc-daygrid-day-top a) {
  text-decoration: none !important;
  color: inherit;
}

:deep(.fc-day-today) {
  background-color: #fff !important;
  position: relative;
}

:deep(.fc-day-today .fc-daygrid-day-number) {
  color: #8E3E36;
  font-weight: 700;
}

:deep(.fc-day-other) {
  background-color: #fafbfc;
}

:deep(.fc-day-other .fc-daygrid-day-number) {
  color: #adb5bd;
  font-weight: 500;
}

/* 事件樣式 - 簡約風格 */
:deep(.fc-event) {
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.2);
  margin: 2px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

:deep(.fc-event:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 10;
}

:deep(.fc-event-title) {
  font-weight: 600;
  line-height: 1.3;
}

/* 自定義事件內容樣式 */
:deep(.contract-event-content) {
  padding: 4px 6px;
  line-height: 1.3;
}

:deep(.contract-title) {
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 1px;
}

:deep(.contract-number) {
  font-size: 10px;
  opacity: 0.85;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 多事件顯示 */
:deep(.fc-daygrid-event-harness) {
  margin-top: 1px;
  margin-bottom: 1px;
}

:deep(.fc-event-main) {
  padding: 2px 4px;
}

/* 星期標題 - 簡約風格 */
:deep(.fc-col-header-cell) {
  background-color: #fff;
  font-weight: 400;
  color: #6c757d;
  border-color: #f0f0f0;
  border-bottom: none; /* 移除底線 */
}

:deep(.fc-col-header-cell-cushion) {
  padding: 16px 8px;
  font-size: 14px;
  color: #6c757d;
  text-decoration: none; /* 移除文字底線 */
}

/* 移除星期標題文字的底線 */
:deep(.fc-col-header-cell a) {
  text-decoration: none !important;
  color: #6c757d;
}

:deep(.fc-col-header-cell-cushion a) {
  text-decoration: none !important;
  color: #6c757d;
}

/* 網格線 - 更輕的邊框 */
:deep(.fc-daygrid-day-frame) {
  border-color: #f0f0f0;
}

:deep(.fc-scrollgrid) {
  border-color: #f0f0f0;
  border-radius: 0;
}

:deep(.fc-scrollgrid-section-body table) {
  border-color: #f0f0f0;
}

/* 移除多餘的邊框 */
:deep(.fc-daygrid-body) {
  border-color: #f0f0f0;
}

:deep(.fc-daygrid-day-top) {
  border-color: #f0f0f0;
}

/* 工具欄樣式 */
:deep(.fc-toolbar) {
  padding: 0 0 20px 0;
  margin-bottom: 0;
}

:deep(.fc-toolbar-chunk) {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 移除預設的 margin */
:deep(.fc-button-group .fc-button) {
  margin: 0 2px;
}

/* 整體容器樣式 */
:deep(.fc-theme-standard .fc-scrollgrid) {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

/* 響應式設計 */
@media (max-width: 768px) {
  :deep(.fc-toolbar) {
    flex-direction: column;
    gap: 10px;
  }
  
  :deep(.fc-toolbar-chunk) {
    display: flex;
    justify-content: center;
  }
  
  :deep(.fc-daygrid-day) {
    min-height: 80px;
  }
  
  :deep(.contract-title) {
    font-size: 10px;
  }
  
  :deep(.contract-number) {
    font-size: 8px;
  }
  
  :deep(.fc-event) {
    font-size: 10px;
    margin: 0.5px 1px;
  }
}

@media (max-width: 576px) {
  :deep(.fc-toolbar-title) {
    font-size: 1.2rem;
  }
  
  :deep(.fc-button) {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
  
  :deep(.fc-daygrid-day) {
    min-height: 60px;
  }
}
</style>
