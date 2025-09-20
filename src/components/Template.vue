<template>
    <div class="contract-container">
      <div class="contract-content">
        <h1 class="contract-title">婚紗及配件租借合約書</h1>
        
        <div class="contract-header">
          <p><strong>單 號：</strong><span class="variable">{{ contractData.合約單號 || 'V250902' }}</span></p>
          <p><strong>出租人：</strong><span class="variable">{{ getTemplateSettings().出租人 || contractData.出租人 || '裳云智略股份有限公司' }}</span> 以下簡稱甲方</p>
          <p><strong>承租人：</strong><span class="variable">{{ contractData.客戶姓名 || lesseeName }}</span> 以下簡稱乙方</p>
          <p class="disclaimer">
            本契約條款甲方出租人應於簽約前，將契約內容充分向承租人說明，雙方謹簽訂書面契約或以雙方同意之其他適當方式表示同意，以憑信守。本契約內容之新台幣金額皆為含稅金額。
          </p>
          <hr>
        </div>
  
        <div class="article">
          <h2>第一條 租借物件與租賃期間</h2>
          <div class="rental-info">
            <h3>租借物件</h3>
            <p>☑婚紗</p>
            
            <h3>租借方案:</h3>
            <p style="white-space: pre-line;"><span class="variable">{{ contractData.備注 || getDefaultPlanContent() }}</span></p>
            
            <h3>款式 :</h3>
            <p><span class="variable">{{ getDressStyles() }}</span></p>
            
            <h3>配件:</h3>
            <p><span class="variable">{{ getAccessoriesFullInfo() }}</span></p>
            
            <h3>圖片：</h3>
            <div class="dress-images">
              <div v-if="getDressImages().length > 0" class="image-grid">
                <div v-for="(image, index) in getDressImages()" :key="index" class="image-container">
                  <img :src="image" :alt="`禮服圖片${index + 1}`" class="dress-image" />
                </div>
              </div>
              <p v-else><span class="variable">{{ images }}</span></p>
            </div>
            
            <h3>總金額新台幣$<span class="variable">{{ (contractData.合約總金額 || totalAmount).toLocaleString() }}</span>元整</h3>
            
            <h3>租賃期間:</h3>
            <p><strong>取件時間：</strong>中華民國 <span class="variable">{{ formatPickupDate() }}</span></p>
            <p><strong>歸還時間：</strong>中華民國 <span class="variable">{{ formatReturnDate() }}</span></p>
            <p><strong>總計共</strong> <span class="variable">{{ calculateTotalPeriods() }}</span> <strong>檔期</strong></p>
            
            <p class="note">*租借四天為一檔期，每增加一日，每件婚紗加收新台幣1,000元，配件每件加收新台幣300元。</p>
            <p class="note">*取貨與歸還應於週一至週五18:30前，遇休假日可提前或順延一日不予加價（特別預約假日者除外）。</p>
          </div>
        </div>
  
        <div class="article">
          <h2>第二條 租金／定金／押金</h2>
          
          <h3>● 租金</h3>
          <p>總計共新台幣$<span class="variable">{{ (contractData.合約總金額 || totalRent).toLocaleString() }}</span>元整（含稅），甲方需開立統一發票。乙方應於取件時扣除已付之定金金額後支付。</p>
          
          <h3>● 定金</h3>
          <p>總計共新台幣$<span class="variable">{{ calculateDeposit().toLocaleString() }}</span>元整，以匯款支付。</p>
          <ul>
            <li>乙方確認契約內容無誤並承諾租賃後，須支付定金以預留檔期。甲方收到定金始保留乙方預定檔期，並開始進行客製尺寸修改（如需）。</li>
            <li>定金金額為訂單總金額20%，支付後逾30日，如乙方需取消，則訂金不予退還。</li>
            <li>下訂後乙方有更換承租之款式、品項、檔期之權利，第三次以上試穿則每次酌收新台幣3000元之試穿服務費。</li>
            <li>如因天災等不可抗力之因素致乙方須取消或變更檔期，經甲方確認後得取消或變更，定金可延後使用，不予退還，無須額外處理服務費用。</li>
          </ul>
          
          <h3>● 押金</h3>
          <p>總計共新台幣$<span class="variable">{{ (contractData.押金 || securityDeposit).toLocaleString() }}</span>元整，以現金支付。</p>
          <ul>
            <li>乙方於取件時需檢查租借物件之狀況，確認並支付押金後即視同同意物件無誤。</li>
            <li>乙方需於歸還期限返還承租物件。如物件由乙方寄還，須以紙箱包裝完整避免物件遭刮傷或破損。</li>
            <li>甲方收到歸還物件時應現場或透過視訊與乙方清點並確認物件狀況。經確認物件數量無誤且狀態良好後，甲方須退還乙方全額押金。</li>
            <li>如經甲方檢查後發現出租物件有非正常使用產生之嚴重髒污、破壞、缺件或遺失，甲方將予以扣留押金，並依第五條損害賠償處理。</li>
            <li>物件承租所使用之特殊優惠，須於歸還物件前完成並提供截圖證明。若未完成或拒絕完成，已折扣金額將抵扣押金，如折扣金額超過押金，甲方得要求乙方支付完整折扣金額。</li>
          </ul>
  
          <div class="payment-table">
            <table>
              <thead>
                <tr>
                  <th>付款別</th>
                  <th>金額</th>
                  <th>接待人員</th>
                  <th>客戶簽名</th>
                  <th>付款日期</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="payment in getPaymentRecords()" :key="payment.type">
                  <td>{{ payment.type }}</td>
                  <td class="variable">${{ payment.amount }}</td>
                  <td class="variable">{{ payment.staff }}</td>
                  <td class="variable signature-cell">
                    <img 
                      v-if="contractData.客戶簽名 && payment.signature" 
                      :src="contractData.客戶簽名" 
                      alt="客戶簽名" 
                      class="template-signature-image"
                    />
                    <span v-else>{{ payment.signature }}</span>
                  </td>
                  <td class="variable">{{ payment.date }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
        <div class="article">
          <h2>第三條 使用規則與限制</h2>
          <ul>
            <li>請愛惜使用並妥善保管。保管義務租借方應盡善良管理人之義務保管及維護租借物件，不得轉借給第三人使用，亦禁止轉租、出賣、設質、抵押、讓與、擔保、典當出租物件、汙損物品及衣物等行為。</li>
            <li>租借期間租借物件之所有權仍歸屬 <span class="variable">{{ getTemplateSettings().出租人 || contractData.出租人 || companyName }}</span>，乙方僅在約定期間使用租借物件，並不取得其他任何權利。</li>
            <li>如有須寄送之來回運費，若非甲方之疏失，運費及其他衍生費用均需由乙方負擔。</li>
            <li>經客製化修改尺寸之物件，需由乙方到場試穿取件。如需寄送服務，運費由乙方負擔。</li>
          </ul>
        </div>
  
        <div class="article">
          <h2>第四條 租賃期間延展或逾期返還</h2>
          <p>乙方於取件後如須延展租賃檔期或逾期返還承租物件，乙方皆須負擔延展費用。每延展或逾期歸還一日，每件婚紗加收新台幣2,000元，配件加收新台幣500元。</p>
        </div>
  
        <div class="article">
          <h2>第五條 損害賠償</h2>
          <ul>
            <li>歸還租借物件檢查時發現破損、髒污、缺件等情況，甲方將予以扣留押金，並由甲方配合之第三方廠商報價清潔、維修等後續處理之費用。甲方須提供後續處理之單據影本，並由押金扣除後返完乙方剩餘押金。如處理費用超過押金，甲方得要求乙方支付後續處理之費用。</li>
            <li>如乙方遺失本約承租之物件或維修金額超過完全毀損賠償金額，將以完全毀損賠償處理。乙方支付完全毀損賠償後，承租之物件所有權轉移為乙方所有（遺失除外）。租用物件之完全毀損賠償金額會於乙方取件時告知，並公告於附表。</li>
          </ul>
        </div>
  
        <div class="article">
          <h2>第六條 提前終止租約</h2>
          <ul>
            <li>本契約於期限屆滿前，租賃雙方均無權片面無條件取消或變更合約。</li>
            <li>如乙方提前返還承租物件，亦須支付本租約之完整租賃期間租金。</li>
          </ul>
        </div>
  
        <div class="article">
          <h2>第七條 爭議處理</h2>
          <ul>
            <li>若因本合約未能履行或履行不力所生之爭議糾紛雙方應同意先以誠信原則磋商之，磋商不協時，雙方同意以仲裁法提付仲裁，仲裁地為台北市。</li>
            <li>本合約以中華民國法律為準據法，如涉及訴訟，雙方同意以台灣台北地方法院為第一審管轄法院。</li>
          </ul>
        </div>
  
        <div class="article">
          <h2>第八條 其他</h2>
          <ul>
            <li>本合約書計正本兩份，由締約當事人雙方各執乙份。</li>
            <li>乙方未得甲方事前書面同意，不得將本契約內容資訊（包含但不限於金額或特殊優惠等）洩漏、口頭告知、交付或移轉予任何第三人。</li>
            <li>本契約若有未盡事宜或修改者，應經雙方協議另以書面修訂，並依有關法令、習慣、平等互惠及誠實信用原則公平解決之。</li>
            <li>甲方與乙方應就本契約所附表格之約定事項詳為記載；該表格所載雙方約定事項為本契約之一部。</li>
          </ul>
        </div>
  
        <div class="signature-section">
          <p class="signature-section-title">立契約書人</p>
          <div class="signature-container">
            <div class="lessor-info">
              <p class="signature-title">出租人：{{ getTemplateSettings().出租人 || contractData.出租人 || lessorCompany }}</p>
              <p>統一編號：{{ getTemplateSettings().統一編號 || contractData.統一編號 || lessorTaxId }}</p>
              <div class="address-field">
                地址：{{ getTemplateSettings().出租人地址 || contractData.出租人地址 || lessorAddress }}
              </div>
              <p>聯絡電話：{{ getTemplateSettings().出租人電話 || contractData.出租人電話 || lessorPhone }}</p>
              <div class="signature-area">
                <p>簽章：</p>
                <div class="signature-upload">
                  <img v-if="getTemplateSettings().出租人簽名" :src="getTemplateSettings().出租人簽名" alt="出租人簽章" class="signature-image">
                  <div v-else class="signature-placeholder">
                    <span class="text-muted">出租人簽章</span>
                  </div>
                </div>
              </div>
            </div>
  
            <div class="lessee-info">
              <p class="signature-title">承租人：{{ contractData.客戶姓名 || lesseeName }}</p>
              <p>身分證字號：{{ contractData.身分證號 || lesseeIdNumber }}</p>
              <div class="address-field">
                地址：{{ contractData.地址 || lesseeAddress }}
              </div>
              <p>聯絡電話：{{ contractData.電話 || lesseePhone }}</p>
              <div class="signature-area">
                <p>簽章：</p>
                <div class="signature-upload">
                  <img v-if="contractData.客戶簽名" :src="contractData.客戶簽名" alt="承租人簽章" class="signature-image">
                  <div v-else class="signature-placeholder">
                    <span class="text-muted">客戶簽名</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div class="contract-date">
            <div class="date-spacing">
              <span>中</span>
              <span>華</span>
              <span>民</span>
              <span>國</span>
              <span class="variable">{{ getContractYear() }}</span>
              <span>年</span>
              <span class="variable">{{ getContractMonth() }}</span>
              <span>月</span>
              <span class="variable">{{ getContractDay() }}</span>
              <span>日</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
export default {
  name: 'ContractTemplate',
  props: {
    contractData: {
      type: Object,
      default: () => ({})
    },
    dressData: {
      type: Array,
      default: () => []
    },
    templateSettings: {
      type: Object,
      default: () => ({})
    },
    isEditable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 預設資訊（當合約資料不存在時使用）
      lesseeName: '陳奕臻',
      rentalPlan: '蘇鳥攝影簽約1白2晚',
      totalAmount: 21000,
      shootingDate: '2025.12.04',
      planDetails: '白紗可挑至$16800以內，晚禮服可挑至$12000以內，總金額可挑至$40800，超過則補差額',
      styles: '',
      accessories: '可任選頭紗款式',
      images: '',
      pickupDate: '114 年 12 月 03 日',
      returnDate: '114 年 12 月 06 日',
      totalPeriods: '1',
      totalRent: 21000,
      deposit: 4200,
      securityDeposit: 0,
      
      // 預設付款紀錄
      payments: [
        { type: '拍攝定金', amount: '4200', staff: 'Abby', signature: '', date: '2025.09.03' },
        { type: '拍攝尾款', amount: '', staff: '', signature: '', date: '' },
        { type: '宴客定金', amount: '', staff: '', signature: '', date: '' },
        { type: '宴客尾款', amount: '', staff: '', signature: '', date: '' }
      ],
      
      // 預設公司資訊
      companyName: '裳云智略股份有限公司',
      lessorCompany: '裳云智略股份有限公司',
      lessorTaxId: '52888231',
      lessorAddress: '台北市中山區中山北路二段16巷14號2樓',
      lessorPhone: '02-27196817',
      lessorSignature: null,
      
      // 預設承租人資訊
      lesseeIdNumber: 'F228277963',
      lesseeAddress: '新北市五股區成泰路三段561號2樓',
      lesseePhone: '0933527669',
      lesseeSignature: null,
      
      // 預設合約日期
      contractYear: '114',
      contractMonth: '09',
      contractDay: '03'
    }
  },
  methods: {
    
    // 格式化拍攝日期
    formatShootingDate() {
      if (this.contractData.租用開始時間) {
        const date = this.parseDate(this.contractData.租用開始時間);
        if (date) {
          return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
        }
      }
      return this.shootingDate;
    },
    
    // 格式化取件日期
    formatPickupDate() {
      if (this.contractData.租用開始時間) {
        const date = this.parseDate(this.contractData.租用開始時間);
        if (date) {
          const year = date.getFullYear() - 1911; // 民國年
          const month = date.getMonth() + 1;
          const day = date.getDate();
          return `${year} 年 ${month.toString().padStart(2, '0')} 月 ${day.toString().padStart(2, '0')} 日`;
        }
      }
      return this.pickupDate;
    },
    
    // 格式化歸還日期
    formatReturnDate() {
      if (this.contractData.租用結束時間) {
        const date = this.parseDate(this.contractData.租用結束時間);
        if (date) {
          const year = date.getFullYear() - 1911; // 民國年
          const month = date.getMonth() + 1;
          const day = date.getDate();
          return `${year} 年 ${month.toString().padStart(2, '0')} 月 ${day.toString().padStart(2, '0')} 日`;
        }
      }
      return this.returnDate;
    },
    
    // 計算總檔期
    calculateTotalPeriods() {
      if (this.contractData.租用開始時間 && this.contractData.租用結束時間) {
        const startDate = this.parseDate(this.contractData.租用開始時間);
        const endDate = this.parseDate(this.contractData.租用結束時間);
        if (startDate && endDate) {
          const diffTime = Math.abs(endDate - startDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return Math.max(1, Math.ceil(diffDays / 4)); // 4天為一檔期
        }
      }
      return this.totalPeriods;
    },
    
    // 計算定金（總金額的20%）
    calculateDeposit() {
      const totalAmount = this.contractData.合約總金額 || this.totalAmount;
      return Math.round(totalAmount * 0.2);
    },
    
    // 獲取禮服款式
    getDressStyles() {
      if (this.contractData.禮服清單 && this.dressData.length > 0) {
        const styles = this.contractData.禮服清單.map(item => {
          const dress = this.dressData.find(d => d.id === item.禮服ID);
          return dress ? `${dress.編號} (${dress.顏色} ${dress.裙型})` : item.禮服ID;
        }).join('、');
        return styles || this.styles;
      }
      return this.styles;
    },
    
    // 獲取禮服圖片
    getDressImages() {
      if (this.contractData.禮服清單 && this.dressData.length > 0) {
        const images = [];
        this.contractData.禮服清單.forEach(item => {
          const dress = this.dressData.find(d => d.id === item.禮服ID);
          if (dress && dress.圖片 && dress.圖片.length > 0) {
            images.push(...dress.圖片.slice(0, 2)); // 每件禮服最多2張圖
          }
        });
        return images.slice(0, 6); // 最多6張圖片
      }
      return [];
    },

    // 獲取配件資訊
    getAccessoriesInfo() {
      // 優先使用合約資料中選擇的配件
      if (this.contractData.選擇配件) {
        // 從配件選項中找到對應的配件名稱
        try {
          const optionsService = this.getOptionsService();
          const accessories = optionsService.getAccessoryOptions();
          const selectedAccessory = accessories.find(acc => acc.value === this.contractData.選擇配件);
          if (selectedAccessory) {
            return selectedAccessory.accessoryName;
          }
        } catch (error) {
          console.error('載入配件選項失敗:', error);
        }
      }
      
      // 其次使用合約資料中的配件資訊
      if (this.contractData.配件) {
        return this.contractData.配件;
      }
      
      // 使用預設值
      return this.accessories;
    },

    // 獲取配件完整資訊
    getAccessoriesFullInfo() {
      // 優先使用合約資料中選擇的配件
      if (this.contractData.選擇配件) {
        try {
          const optionsService = this.getOptionsService();
          const accessories = optionsService.getAccessoryOptions();
          const selectedAccessory = accessories.find(acc => acc.value === this.contractData.選擇配件);
          
          if (selectedAccessory) {
            // 直接使用已經格式化好的 label，因為它已經包含了完整的資訊
            return selectedAccessory.label || selectedAccessory.accessoryName || '';
          }
        } catch (error) {
          console.error('載入配件選項失敗:', error);
        }
      }
      
      // 其次使用合約資料中的配件資訊
      if (this.contractData.配件) {
        return this.contractData.配件;
      }
      
      // 使用預設值
      return this.accessories;
    },

    // 獲取選項服務
    getOptionsService() {
      // 動態載入選項服務
      return {
        getAccessoryOptions: () => {
          try {
            const saved = localStorage.getItem('velvethour_options');
            if (saved) {
              const options = JSON.parse(saved);
              return options.accessories || [];
            }
          } catch (error) {
            console.error('載入配件選項失敗:', error);
          }
          return [];
        }
      };
    },

    // 獲取配件價格
    getAccessoryPrice() {
      if (this.contractData.選擇配件) {
        try {
          const optionsService = this.getOptionsService();
          const accessories = optionsService.getAccessoryOptions();
          const selectedAccessory = accessories.find(acc => acc.value === this.contractData.選擇配件);
          return selectedAccessory?.accessoryPrice || 0;
        } catch (error) {
          console.error('載入配件價格失敗:', error);
        }
      }
      return 0;
    },

    // 獲取預設方案內容
    getDefaultPlanContent() {
      // 如果沒有備註，生成預設的方案內容
      const planName = this.contractData.選擇方案 || this.rentalPlan;
      const totalAmount = this.contractData.合約總金額 || this.totalAmount;
      const shootingDate = this.formatShootingDate();
      const defaultDetails = this.planDetails;

      return `${planName} $${totalAmount.toLocaleString()}
${shootingDate}拍攝使用
${defaultDetails}`;
    },
    
    // 獲取付款記錄
    getPaymentRecords() {
      // 如果有輸入的付款記錄，優先使用
      if (this.contractData.付款記錄 && this.contractData.付款記錄.length > 0) {
        return this.contractData.付款記錄.map(payment => ({
          type: payment.付款別,
          amount: payment.金額 ? payment.金額.toLocaleString() : '',
          staff: payment.接待人員,
          signature: this.contractData.客戶姓名 || '', // 使用客戶姓名作為標記，實際顯示簽名圖片
          date: this.formatPaymentDate(payment.付款日期)
        }));
      }
      
      // 如果沒有輸入付款記錄，使用預設值
      const totalAmount = this.contractData.合約總金額 || this.totalAmount;
      const deposit = this.calculateDeposit();
      const staffName = this.contractData.承辦人 || 'Abby';
      const customerName = this.contractData.客戶姓名 || '';
      const contractDate = this.formatContractDate();
      
      return [
        { 
          type: '拍攝定金', 
          amount: deposit.toLocaleString(), 
          staff: staffName, 
          signature: customerName, 
          date: contractDate 
        },
        { type: '拍攝尾款', amount: '', staff: '', signature: '', date: '' },
        { type: '宴客定金', amount: '', staff: '', signature: '', date: '' },
        { type: '宴客尾款', amount: '', staff: '', signature: '', date: '' }
      ];
    },

    // 格式化付款日期
    formatPaymentDate(dateStr) {
      if (!dateStr) return '';
      
      try {
        const date = new Date(dateStr);
        return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
      } catch (error) {
        return dateStr;
      }
    },
    
    // 格式化合約日期
    formatContractDate() {
      if (this.contractData.合約建立日期時間 || this.contractData.創建時間) {
        const date = this.parseDate(this.contractData.合約建立日期時間 || this.contractData.創建時間);
        if (date) {
          return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
        }
      }
      return '2025.09.03';
    },
    
    // 獲取合約年份（民國）
    getContractYear() {
      if (this.contractData.合約建立日期時間 || this.contractData.創建時間) {
        const date = this.parseDate(this.contractData.合約建立日期時間 || this.contractData.創建時間);
        if (date) {
          return (date.getFullYear() - 1911).toString();
        }
      }
      return this.contractYear;
    },
    
    // 獲取合約月份
    getContractMonth() {
      if (this.contractData.合約建立日期時間 || this.contractData.創建時間) {
        const date = this.parseDate(this.contractData.合約建立日期時間 || this.contractData.創建時間);
        if (date) {
          return (date.getMonth() + 1).toString().padStart(2, '0');
        }
      }
      return this.contractMonth;
    },
    
    // 獲取合約日期
    getContractDay() {
      if (this.contractData.合約建立日期時間 || this.contractData.創建時間) {
        const date = this.parseDate(this.contractData.合約建立日期時間 || this.contractData.創建時間);
        if (date) {
          return date.getDate().toString().padStart(2, '0');
        }
      }
      return this.contractDay;
    },
    
    // 解析日期
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

    // 獲取模板設定
    getTemplateSettings() {
      // 優先使用傳入的 templateSettings
      if (this.templateSettings && Object.keys(this.templateSettings).length > 0) {
        return this.templateSettings;
      }
      
      // 否則從 localStorage 讀取
      try {
        const saved = localStorage.getItem('contractTemplateSettings');
        return saved ? JSON.parse(saved) : {};
      } catch (error) {
        console.error('載入模板設定失敗:', error);
        return {};
      }
    }
  }
  }
  </script>
  
  <style scoped>
  .contract-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Microsoft JhengHei', sans-serif;
    line-height: 1.4;
    font-weight: bold;
    font-size: 14px;
    color: #000;
  }
  
  .contract-content {
    background: white;
    padding: 40px;
  }
  
  .contract-title {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 30px;
  }
  
  .contract-header {
    margin-bottom: 30px;
  }
  
  .contract-header p {
    margin: 10px 0;
    font-size: 14px;
  }
  
  .disclaimer {
    font-size: 14px;
    color: #000;
    margin: 20px 0;
  }
  
  hr {
    border: none;
    border-top: 1px solid #000;
    margin: 25px 0;
  }
  
  .article {
    margin-bottom: 30px;
  }
  
  .article h2 {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  
  .article h3 {
    font-size: 14px;
    font-weight: bold;
    margin: 15px 0 10px 0;
  }
  
  .rental-info {
    margin-left: 20px;
  }
  
  .note {
    font-size: 14px;
    color: #000;
    margin: 10px 0;
  }
  
  .variable {
    color: #d32f2f;
    font-weight: bold;
    text-decoration: underline;
  }
  
  .payment-table {
    margin: 20px 0;
  }
  
  .payment-table table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ddd;
  }
  
  .payment-table th,
  .payment-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    font-size: 14px;
  }
  
  .payment-table th {
    background-color: #f5f5f5;
    font-weight: bold;
  }

  .signature-cell {
    text-align: center;
    vertical-align: middle;
  }

  .template-signature-image {
    max-width: 100px;
    max-height: 40px;
    object-fit: contain;
  }
  
  .signature-section {
    margin-top: 40px;
  }
  
  .signature-container {
    display: flex;
    justify-content: space-between;
    margin: 30px 0;
  }
  
  .lessor-info,
  .lessee-info {
    width: 45%;
  }
  
  .signature-area {
    margin-top: 20px;
  }
  
  .signature-upload {
    margin-top: 10px;
  }
  
  .signature-image {
    width: 250px;
    height: 120px;
    margin-bottom: 10px;
    object-fit: contain;
  }
  
  .signature-input {
    width: 100%;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .signature-placeholder {
    width: 250px;
    height: 120px;
    border: 2px dashed #ccc;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .address-field {
    height: 2.8em; /* 固定為兩行字高 (1.4 * 2) */
    line-height: 1.4;
    margin: 12px 0;
    display: flex;
    align-items: flex-start;
    font-size: 14px;
    overflow: hidden; /* 防止內容溢出 */
  }

  .address-field strong {
    white-space: nowrap;
    margin-right: 5px;
  }

  .address-field .variable {
    flex: 1;
    word-wrap: break-word;
    line-height: 1.4;
  }

  .lessor-info p,
  .lessee-info p {
    margin: 12px 0;
    font-size: 14px;
  }
  
  .contract-date {
    text-align: center;
    margin-top: 30px;
    font-size: 14px;
    font-weight: bold;
  }
  
  .date-spacing {
    display: flex;
    justify-content: space-between;
    max-width: 400px;
    margin: 0 auto;
    span {
        font-size: 14px;
    }
  }
  
  .signature-title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 12px;
  }
  
  .signature-section-title {
    text-align: left;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  ul {
    padding-left: 20px;
  }
  
  li {
    margin-bottom: 10px;
    font-size: 14px;
  }
  
  .dress-images {
    margin: 10px 0;
  }
  
  .image-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    max-width: 100%;
  }
  
  .image-container {
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 8px;
    border: 1px solid #ddd;
  }
  
  .dress-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  @media print {
    .signature-input {
      display: none;
    }
    
    .dress-image {
      max-width: 100px;
      height: 80px;
    }
    
    .image-grid {
      grid-template-columns: repeat(6, 1fr);
      gap: 5px;
    }
  }
  </style>