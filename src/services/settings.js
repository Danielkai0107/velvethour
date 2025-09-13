// 系統設定管理服務
class SettingsService {
  constructor() {
    this.storageKey = 'velvethour_settings';
    this.defaultSettings = {
      // 檔期相關設定
      rentalPeriodDays: 7 // 預設檔期天數
    };
    this.listeners = new Set();
  }

  // 獲取所有設定
  getSettings() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const settings = JSON.parse(stored);
        // 合併預設設定，確保新增的設定項目有預設值
        return { ...this.defaultSettings, ...settings };
      }
      return this.defaultSettings;
    } catch (error) {
      console.error('讀取設定失敗:', error);
      return this.defaultSettings;
    }
  }

  // 獲取檔期天數
  getRentalPeriodDays() {
    const settings = this.getSettings();
    return settings.rentalPeriodDays || 7;
  }

  // 更新設定
  updateSettings(newSettings) {
    try {
      const currentSettings = this.getSettings();
      const updatedSettings = { ...currentSettings, ...newSettings };
      
      localStorage.setItem(this.storageKey, JSON.stringify(updatedSettings));
      
      // 通知所有監聽器
      this.notifyListeners(updatedSettings);
      
      console.log('設定已更新:', updatedSettings);
      return true;
    } catch (error) {
      console.error('更新設定失敗:', error);
      return false;
    }
  }

  // 重置為預設設定
  resetToDefault() {
    try {
      localStorage.removeItem(this.storageKey);
      this.notifyListeners(this.defaultSettings);
      console.log('設定已重置為預設值');
      return true;
    } catch (error) {
      console.error('重置設定失敗:', error);
      return false;
    }
  }

  // 訂閱設定變更
  subscribe(callback) {
    this.listeners.add(callback);
    
    // 返回取消訂閱函數
    return () => {
      this.listeners.delete(callback);
    };
  }

  // 通知所有監聽器
  notifyListeners(settings) {
    this.listeners.forEach(callback => {
      try {
        callback(settings);
      } catch (error) {
        console.error('設定監聽器執行失敗:', error);
      }
    });
  }
}

// 創建單例實例
export const settingsService = new SettingsService();
export default settingsService;
