// 購物車服務 - 管理待處理的禮服清單
class CartService {
  constructor() {
    this.storageKey = 'velvethour_cart';
    this.listeners = new Set();
  }

  // 獲取購物車內容
  getCart() {
    try {
      const cartData = localStorage.getItem(this.storageKey);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('讀取購物車失敗:', error);
      return [];
    }
  }

  // 保存購物車內容
  saveCart(cart) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(cart));
      this.notifyListeners();
    } catch (error) {
      console.error('保存購物車失敗:', error);
    }
  }

  // 添加禮服到購物車
  addDress(dress) {
    const cart = this.getCart();
    
    // 檢查是否已存在
    const existingIndex = cart.findIndex(item => item.id === dress.id);
    
    if (existingIndex >= 0) {
      // 如果已存在，不重複添加，返回false表示未添加
      return false;
    } else {
      // 如果不存在，添加新項目
      cart.push({
        id: dress.id,
        編號: dress.編號,
        顏色: dress.顏色,
        裙型: dress.裙型,
        袖型: dress.袖型,
        領型: dress.領型,
        租借金額: dress.租借金額 || dress.價格 || 0,
        加價金額: dress.加價金額 || 0,
        圖片: dress.圖片 || [],
        數量: 1,
        添加時間: new Date().toISOString()
      });
    }
    
    this.saveCart(cart);
    return true;
  }

  // 從購物車移除禮服
  removeDress(dressId) {
    const cart = this.getCart();
    const filteredCart = cart.filter(item => item.id !== dressId);
    this.saveCart(filteredCart);
  }

  // 更新禮服數量
  updateQuantity(dressId, quantity) {
    const cart = this.getCart();
    const itemIndex = cart.findIndex(item => item.id === dressId);
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        // 如果數量為0或負數，移除項目
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].數量 = quantity;
      }
      this.saveCart(cart);
    }
  }

  // 清空購物車
  clearCart() {
    this.saveCart([]);
  }

  // 獲取購物車項目數量
  getItemCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.數量 || 1), 0);
  }

  // 獲取購物車總金額
  getTotalAmount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => {
      const itemPrice = (item.租借金額 || 0) + (item.加價金額 || 0);
      return total + (itemPrice * (item.數量 || 1));
    }, 0);
  }

  // 檢查禮服是否在購物車中
  isInCart(dressId) {
    const cart = this.getCart();
    return cart.some(item => item.id === dressId);
  }

  // 獲取購物車中特定禮服的數量
  getDressQuantity(dressId) {
    const cart = this.getCart();
    const item = cart.find(item => item.id === dressId);
    return item ? item.數量 || 1 : 0;
  }

  // 轉換為合約禮服清單格式
  toContractDressList() {
    const cart = this.getCart();
    return cart.map(item => ({
      禮服ID: item.id,
      數量: item.數量 || 1,
      單價: item.租借金額 || 0,
      小計: (item.租借金額 || 0) * (item.數量 || 1)
    }));
  }

  // 監聽購物車變化
  subscribe(callback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  // 通知所有監聽者
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.getCart());
      } catch (error) {
        console.error('通知購物車監聽者失敗:', error);
      }
    });
  }
}

// 創建全域購物車實例
export const cartService = new CartService();
