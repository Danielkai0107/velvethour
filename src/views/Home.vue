<template>
  <div class="container-fluid">
    <!-- 訂單狀態篩選標籤 -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex align-items-center mb-3">
          <button 
            v-for="tab in orderTabs" 
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="['btn', 'me-2', activeTab === tab.key ? 'btn-primary' : 'btn-outline-secondary']"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 訂單卡片網格 -->
    <div class="row g-4">
      <div 
        v-for="order in filteredOrders" 
        :key="order.id"
        class="col-lg-4 col-md-6"
      >
        <div class="card h-100 shadow-sm border-0">
          <!-- 卡片標題 -->
          <div class="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <div 
                :class="['rounded-circle d-flex align-items-center justify-content-center me-3', getStatusColor(order.status)]"
                style="width: 40px; height: 40px;"
              >
                <span class="text-white fw-bold">{{ order.customerInitial }}</span>
              </div>
              <div>
                <h6 class="mb-0 fw-bold">{{ order.customerName }}</h6>
                <small class="text-muted">{{ order.orderNumber }} / {{ order.type }}</small>
              </div>
            </div>
            <div class="text-end">
              <span :class="['badge', getStatusBadgeClass(order.status)]">
                <i :class="getStatusIcon(order.status)" class="me-1"></i>
                {{ getStatusText(order.status) }}
              </span>
              <div class="small text-muted mt-1">{{ order.location }}</div>
            </div>
          </div>

          <!-- 卡片內容 -->
          <div class="card-body">
            <div class="small text-muted mb-2">{{ formatDate(order.date) }}</div>
            
            <!-- 訂單項目 -->
            <div class="mb-3">
              <div class="small text-muted mb-2">項目</div>
              <div 
                v-for="item in order.items.slice(0, 3)" 
                :key="item.name"
                class="d-flex justify-content-between align-items-center mb-1"
              >
                <span class="small">{{ item.name }}</span>
                <div class="text-end">
                  <span class="small text-muted">{{ item.quantity }}</span>
                  <span class="small fw-semibold ms-2">${{ item.price }}</span>
                </div>
              </div>
              
              <div v-if="order.items.length > 3" class="small text-muted">
                +{{ order.items.length - 3 }} more
              </div>
            </div>

            <!-- 總金額 -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="fw-semibold">總計</span>
              <span class="fw-bold h6 mb-0">${{ order.total }}</span>
            </div>
          </div>

          <!-- 卡片底部操作 -->
          <div class="card-footer bg-white border-top-0">
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary btn-sm flex-fill">
                查看詳情
              </button>
              <button 
                v-if="order.status === 'ready'"
                class="btn btn-warning btn-sm flex-fill"
              >
                付款
              </button>
              <button 
                v-else-if="order.status === 'completed'"
                class="btn btn-success btn-sm flex-fill"
              >
                已付款
              </button>
              <button 
                v-else
                class="btn btn-primary btn-sm flex-fill"
              >
                處理訂單
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 如果沒有訂單 -->
    <div v-if="filteredOrders.length === 0" class="text-center py-5">
      <i class="bi bi-inbox display-1 text-muted"></i>
      <h5 class="mt-3 text-muted">目前沒有{{ getTabLabel(activeTab) }}訂單</h5>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      activeTab: 'all',
      orderTabs: [
        { key: 'all', label: '全部' },
        { key: 'inprocess', label: '進行中' },
        { key: 'completed', label: '已完成' },
      ],
      orders: [
        {
          id: 'A4',
          customerName: 'Ariel Hikmat',
          customerInitial: 'A4',
          orderNumber: 'Order #917',
          type: 'Dine In',
          status: 'ready',
          location: 'In the Kitchen',
          date: new Date('2023-07-12T06:12:00'),
          items: [
            { name: '優雅白色婚紗', quantity: 1, price: '16.99' },
            { name: '經典黑色晚禮服', quantity: 1, price: '18.49' },
            { name: '粉色伴娘服', quantity: 2, price: '38.98' },
            { name: '古典蕾絲禮服', quantity: 1, price: '12.49' }
          ],
          total: '87.34'
        },
        {
          id: 'B2',
          customerName: 'Denis Freeman',
          customerInitial: 'B2',
          orderNumber: 'Order #921',
          type: 'Dine In',
          status: 'inprocess',
          location: 'Dressing Hire',
          date: new Date('2023-07-12T06:18:00'),
          items: [
            { name: '復古風格禮服', quantity: 1, price: '10.99' },
            { name: '現代簡約婚紗', quantity: 2, price: '34.00' },
            { name: '希臘風格禮服', quantity: 1, price: '13.99' }
          ],
          total: '57.87'
        },
        {
          id: 'TA',
          customerName: 'Morgan Cox',
          customerInitial: 'TA',
          orderNumber: 'Order #918',
          type: 'Takeaway',
          status: 'inprocess',
          location: 'In the Kitchen',
          date: new Date('2023-07-12T06:19:00'),
          items: [
            { name: '素雅旗袍', quantity: 1, price: '16.99' },
            { name: '蝦仁炒飯', quantity: 2, price: '19.49' },
            { name: '比利時鬆餅', quantity: 1, price: '38.98' }
          ],
          total: '86.96'
        },
        {
          id: 'TA2',
          customerName: 'Paul Rey',
          customerInitial: 'TA',
          orderNumber: 'Order #919',
          type: 'Takeaway',
          status: 'inprocess',
          location: 'In the Kitchen',
          date: new Date('2023-07-12T06:18:00'),
          items: [
            { name: '瑪格麗特禮服', quantity: 1, price: '16.99' },
            { name: '比利時鬆餅', quantity: 1, price: '19.49' },
            { name: '維珍莫吉托', quantity: 2, price: '38.98' },
            { name: '經典檸檬汽水', quantity: 2, price: '25.98' }
          ],
          total: '97.96'
        },
        {
          id: 'A9',
          customerName: 'Maja Becker',
          customerInitial: 'A9',
          orderNumber: 'Order #912',
          type: 'Dine In',
          status: 'completed',
          location: 'Waiting For Payment',
          date: new Date('2023-07-12T05:32:00'),
          items: [
            { name: '費塔起司蘑菇', quantity: 1, price: '18.99' },
            { name: '龍蝦餃子', quantity: 1, price: '17.99' },
            { name: '泰式椰奶咖哩', quantity: 2, price: '14.49' }
          ],
          total: '98.34'
        },
        {
          id: 'C2',
          customerName: 'Erwan Richard',
          customerInitial: 'C2',
          orderNumber: 'Order #908',
          type: 'Dine In',
          status: 'completed',
          location: 'Waiting For Payment',
          date: new Date('2023-07-12T05:20:00'),
          items: [
            { name: '奶油大蒜雞肉', quantity: 1, price: '15.99' },
            { name: '希臘風味拼盤', quantity: 1, price: '13.99' },
            { name: '比利時鬆餅', quantity: 1, price: '12.99' }
          ],
          total: '56.96'
        }
      ]
    };
  },
  computed: {
    filteredOrders() {
      if (this.activeTab === 'all') {
        return this.orders;
      }
      return this.orders.filter(order => order.status === this.activeTab);
    }
  },
  methods: {
    formatDate(date) {
      return date.toLocaleTimeString('zh-TW', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    },
    getStatusColor(status) {
      const colors = {
        'ready': 'bg-success',
        'inprocess': 'bg-warning',
        'completed': 'bg-info'
      };
      return colors[status] || 'bg-secondary';
    },
    getStatusBadgeClass(status) {
      const classes = {
        'ready': 'bg-success',
        'inprocess': 'bg-warning text-dark',
        'completed': 'bg-info'
      };
      return classes[status] || 'bg-secondary';
    },
    getStatusIcon(status) {
      const icons = {
        'ready': 'bi bi-check-circle',
        'inprocess': 'bi bi-clock',
        'completed': 'bi bi-check2-all'
      };
      return icons[status] || 'bi bi-circle';
    },
    getStatusText(status) {
      const texts = {
        'ready': '準備就緒',
        'inprocess': '進行中',
        'completed': '已完成'
      };
      return texts[status] || status;
    },
    getTabLabel(tab) {
      const tab_obj = this.orderTabs.find(t => t.key === tab);
      return tab_obj ? tab_obj.label : '';
    }
  }
};
</script>
