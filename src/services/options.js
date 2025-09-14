// 選項管理服務 - 統一管理所有選項
class OptionsService {
  constructor() {
    this.storageKey = 'velvethour_options';
    this.settingsKey = 'velvethour_settings';
    this.subscribers = [];
    
    // 預設選項
    this.defaultOptions = {
      colors: [
        { value: "白色", label: "白色", color: "#FFFFFF", border: "#E5E7EB" },
        { value: "黑色", label: "黑色", color: "#000000" },
        { value: "綠色", label: "綠色", color: "#10B981" },
        { value: "粉色", label: "粉色", color: "#F472B6" },
        { value: "紅色", label: "紅色", color: "#EF4444" },
        { value: "深藍色", label: "深藍色", color: "#1E40AF" },
        { value: "藍灰色", label: "藍灰色", color: "#64748B" },
        { value: "紫色", label: "紫色", color: "#8B5CF6" },
        { value: "金色/香檳色", label: "金色/香檳色", color: "#F59E0B" },
        { value: "銀色", label: "銀色", color: "#94A3B8" },
      ],
      skirts: [
        { value: "魚尾", label: "魚尾" },
        { value: "Aline", label: "Aline" },
        { value: "蓬裙", label: "蓬裙" },
        { value: "罩衫", label: "罩衫" },
        { value: "兩件式-上", label: "兩件式-上" },
        { value: "兩件式-下", label: "兩件式-下" },
        { value: "配件", label: "配件" },
        { value: "九分裙/短裙", label: "九分裙/短裙" },
        { value: "頭紗", label: "頭紗" },
      ],
      sleeves: [
        { value: "短袖", label: "短袖" },
        { value: "長袖", label: "長袖" },
        { value: "無袖", label: "無袖" },
      ],
      necks: [
        { value: "v領", label: "v領" },
        { value: "平口/微笑領", label: "平口/微笑領" },
        { value: "一字領", label: "一字領" },
        { value: "高領", label: "高領" },
        { value: "圓領", label: "圓領" },
        { value: "削肩/船型領", label: "削肩/船型領" },
        { value: "桃心領", label: "桃心領" },
        { value: "單肩", label: "單肩" },
        { value: "卡肩", label: "卡肩" },
        { value: "透膚", label: "透膚" },
        { value: "方形領", label: "方形領" },
        { value: "羅馬領", label: "羅馬領" },
      ],
      packages: [
        { 
          value: "攝影_一日一晚", 
          label: "攝影 - 一日一晚", 
          price: 15000, 
          category: "攝影" 
        },
        { 
          value: "攝影_一日二晚", 
          label: "攝影 - 一日二晚", 
          price: 21000, 
          category: "攝影" 
        },
        { 
          value: "攝影_二日一晚", 
          label: "攝影 - 二日一晚", 
          price: 24000, 
          category: "攝影" 
        },
        { 
          value: "攝影_二日四晚", 
          label: "攝影 - 二日四晚", 
          price: 42000, 
          category: "攝影" 
        },
        { 
          value: "攝影_二日", 
          label: "攝影 - 二日", 
          price: 18000, 
          category: "攝影" 
        },
        { 
          value: "宴客_一日一晚", 
          label: "宴客 - 一日一晚", 
          price: 25000, 
          category: "宴客" 
        },
        { 
          value: "宴客_一日二晚", 
          label: "宴客 - 一日二晚", 
          price: 35000, 
          category: "宴客" 
        },
      ],
    };

    this.defaultSettings = {
      defaultRentalDays: 3,
      defaultDepositRate: 30,
    };
  }

  // 獲取所有選項
  getAllOptions() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      
      if (saved) {
        const options = JSON.parse(saved);
        // 合併預設選項和儲存的選項，確保不會遺失新增的預設選項
        return {
          colors: options.colors || this.defaultOptions.colors,
          skirts: options.skirts || this.defaultOptions.skirts,
          sleeves: options.sleeves || this.defaultOptions.sleeves,
          necks: options.necks || this.defaultOptions.necks,
          packages: options.packages || this.defaultOptions.packages,
        };
      }
      
      return this.defaultOptions;
    } catch (error) {
      console.error('載入選項失敗:', error);
      return this.defaultOptions;
    }
  }

  // 獲取特定類型的選項
  getOptions(type) {
    const allOptions = this.getAllOptions();
    return allOptions[type] || [];
  }

  // 獲取顏色選項
  getColorOptions() {
    return this.getOptions('colors');
  }

  // 獲取裙型選項
  getSkirtOptions() {
    return this.getOptions('skirts');
  }

  // 獲取袖型選項
  getSleeveOptions() {
    return this.getOptions('sleeves');
  }

  // 獲取領型選項
  getNeckOptions() {
    return this.getOptions('necks');
  }

  // 獲取方案選項
  getPackageOptions() {
    return this.getOptions('packages');
  }

  // 獲取方案價格對照表
  getPackagePrices() {
    const packages = this.getPackageOptions();
    const priceMap = {};
    packages.forEach(pkg => {
      if (pkg.price) {
        priceMap[pkg.value] = pkg.price;
      }
    });
    return priceMap;
  }

  // 根據分類獲取方案選項
  getPackagesByCategory() {
    const packages = this.getPackageOptions();
    const categorized = {};
    packages.forEach(pkg => {
      if (!categorized[pkg.category]) {
        categorized[pkg.category] = [];
      }
      categorized[pkg.category].push(pkg);
    });
    return categorized;
  }

  // 儲存選項
  saveOptions(options) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(options));
      this.notifySubscribers();
      return true;
    } catch (error) {
      console.error('儲存選項失敗:', error);
      return false;
    }
  }

  // 新增選項
  addOption(type, option) {
    const options = this.getAllOptions();
    if (!options[type]) {
      options[type] = [];
    }

    // 檢查是否已存在
    const exists = options[type].some(
      item => item.value === option.value || item.label === option.label
    );
    
    if (exists) {
      return false;
    }

    options[type].push(option);
    return this.saveOptions(options);
  }

  // 移除選項
  removeOption(type, index) {
    const options = this.getAllOptions();
    if (options[type] && options[type][index]) {
      options[type].splice(index, 1);
      return this.saveOptions(options);
    }
    return false;
  }

  // 獲取設定
  getSettings() {
    try {
      const saved = localStorage.getItem(this.settingsKey);
      if (saved) {
        const settings = JSON.parse(saved);
        return { ...this.defaultSettings, ...settings };
      }
      return this.defaultSettings;
    } catch (error) {
      console.error('載入設定失敗:', error);
      return this.defaultSettings;
    }
  }

  // 儲存設定
  saveSettings(settings) {
    try {
      localStorage.setItem(this.settingsKey, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('儲存設定失敗:', error);
      return false;
    }
  }

  // 訂閱選項變更
  subscribe(callback) {
    this.subscribers.push(callback);
    
    // 返回取消訂閱的函數
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // 通知所有訂閱者
  notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('通知訂閱者失敗:', error);
      }
    });
  }

  // 重置為預設選項
  resetToDefaults() {
    return this.saveOptions(this.defaultOptions);
  }
}

// 創建全域實例
export const optionsService = new OptionsService();
