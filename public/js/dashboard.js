document.addEventListener('DOMContentLoaded', () => {
  // Application State
  let submissions = [];
  let selectedSubmissionId = null;
  let activeTab = 'clientProfileTab';
  let currentDetailedSubmission = null;

  // DOM Elements
  const submissionsList = document.getElementById('submissionsList');
  const searchBar = document.getElementById('searchBar');
  const detailsPanel = document.getElementById('detailsPanel');
  const emptyState = document.getElementById('emptyState');
  
  // Stats
  const statTotal = document.getElementById('statTotal');
  const statAnalyzed = document.getElementById('statAnalyzed');
  const statPending = document.getElementById('statPending');

  // Client Details fields
  const clientName = document.getElementById('clientName');
  const clientPhoneBadge = document.getElementById('clientPhoneBadge');
  const submissionDateBadge = document.getElementById('submissionDateBadge');
  const unitTypeBadge = document.getElementById('unitTypeBadge');

  // Tab 1 details
  const valFullName = document.getElementById('valFullName');
  const valPhone = document.getElementById('valPhone');
  const valEmail = document.getElementById('valEmail');
  const valJobTitle = document.getElementById('valJobTitle');
  const valAge = document.getElementById('valAge');
  const valNationality = document.getElementById('valNationality');
  const valMaritalStatus = document.getElementById('valMaritalStatus');
  const valGender = document.getElementById('valGender');
  const wifeSubHeader = document.getElementById('wifeSubHeader');
  const lblWifeNameAge = document.getElementById('lblWifeNameAge');
  const lblWifeJob = document.getElementById('lblWifeJob');
  const lblWifeOffice = document.getElementById('lblWifeOffice');
  const lblWifePrefs = document.getElementById('lblWifePrefs');
  const valWifeNameAge = document.getElementById('valWifeNameAge');
  const valWifeJob = document.getElementById('valWifeJob');
  const valWifeOffice = document.getElementById('valWifeOffice');
  const valWifePrefs = document.getElementById('valWifePrefs');
  const valChildrenCount = document.getElementById('valChildrenCount');
  const childrenDetailsList = document.getElementById('childrenDetailsList');
  const childrenSummaryBlock = document.getElementById('childrenSummaryBlock');
  const wifeSummaryBlock = document.getElementById('wifeSummaryBlock');
  
  const valUnitType = document.getElementById('valUnitType');
  const valApproxArea = document.getElementById('valApproxArea');
  const valProjectAddress = document.getElementById('valProjectAddress');
  const valFamilyMembers = document.getElementById('valFamilyMembers');
  const valHasElderly = document.getElementById('valHasElderly');
  const valHasPets = document.getElementById('valHasPets');
  const valTimeline = document.getElementById('valTimeline');
  const valDeadline = document.getElementById('valDeadline');
  
  const valBudget = document.getElementById('valBudget');
  const valBudgetPriority = document.getElementById('valBudgetPriority');
  const valAtmosphere = document.getElementById('valAtmosphere');
  const valHomeRole = document.getElementById('valHomeRole');
  const valWfh = document.getElementById('valWfh');
  const valGuests = document.getElementById('valGuests');
  
  const valPreferredStyle = document.getElementById('valPreferredStyle');
  const valSpatialFeel = document.getElementById('valSpatialFeel');
  const valSpaceStyle = document.getElementById('valSpaceStyle');
  const valFurnitureType = document.getElementById('valFurnitureType');
  const valLighting = document.getElementById('valLighting');
  const valFavoriteColors = document.getElementById('valFavoriteColors');
  const valDislikedColors = document.getElementById('valDislikedColors');
  const valMaterialsTags = document.getElementById('valMaterialsTags');
  
  const valGuestFeel = document.getElementById('valGuestFeel');
  const valHomeFeel = document.getElementById('valHomeFeel');
  const valIdealHomeThreeWords = document.getElementById('valIdealHomeThreeWords');
  const valDislikedDesignElements = document.getElementById('valDislikedDesignElements');
  const valPriority = document.getElementById('valPriority');
  const valHasReferenceImages = document.getElementById('valHasReferenceImages');

  // Tab 2 details (Rooms)
  const roomLivingUse = document.getElementById('roomLivingUse');
  const roomLivingCapacity = document.getElementById('roomLivingCapacity');
  const roomLivingSeatingType = document.getElementById('roomLivingSeatingType');
  const roomLivingTv = document.getElementById('roomLivingTv');
  const roomLivingExtra = document.getElementById('roomLivingExtra');

  const roomReceptionStyle = document.getElementById('roomReceptionStyle');
  const roomDiningUse = document.getElementById('roomDiningUse');
  const roomDiningChairs = document.getElementById('roomDiningChairs');
  const roomDiningNeeds = document.getElementById('roomDiningNeeds');

  const roomKitchenType = document.getElementById('roomKitchenType');
  const roomKitchenUsage = document.getElementById('roomKitchenUsage');
  const roomKitchenNeeds = document.getElementById('roomKitchenNeeds');

  const roomMasterVibe = document.getElementById('roomMasterVibe');
  const roomMasterLighting = document.getElementById('roomMasterLighting');
  const roomMasterNeeds = document.getElementById('roomMasterNeeds');

  const roomEntranceVal = document.getElementById('roomEntranceVal');
  const roomLaundryVal = document.getElementById('roomLaundryVal');
  const roomOfficeVal = document.getElementById('roomOfficeVal');
  const roomEntertainmentVal = document.getElementById('roomEntertainmentVal');
  const roomTerraceVal = document.getElementById('roomTerraceVal');

  // Tab 3 Details (AI Report)
  const aiPlaceholder = document.getElementById('aiPlaceholder');
  const aiLoader = document.getElementById('aiLoader');
  const aiReportWrapper = document.getElementById('aiReportWrapper');
  const reportTextContainer = document.getElementById('reportTextContainer');
  const reportGeneratedAt = document.getElementById('reportGeneratedAt');
  const aiLoadingTitle = document.getElementById('aiLoadingTitle');

  // API Settings Modal Elements
  const settingsModal = document.getElementById('settingsModal');
  const settingsBtn = document.getElementById('settingsBtn');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const geminiApiKeyInput = document.getElementById('geminiApiKeyInput');
  const toggleKeyVisibility = document.getElementById('toggleKeyVisibility');
  const testApiKeyBtn = document.getElementById('testApiKeyBtn');
  const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
  const testKeyFeedback = document.getElementById('testKeyFeedback');

  // Main Action Buttons
  const deleteBtn = document.getElementById('deleteBtn');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const aiPlaceholderAnalyzeBtn = document.getElementById('aiPlaceholderAnalyzeBtn');
  const copyReportBtn = document.getElementById('copyReportBtn');
  const regenerateBtn = document.getElementById('regenerateBtn');
  const downloadExcelBtn = document.getElementById('downloadExcelBtn');

  // Initialize
  loadAPIKey();
  fetchSubmissions();

  // Settings Modal events
  settingsBtn.addEventListener('click', () => {
    loadAPIKey();
    testKeyFeedback.style.display = 'none';
    settingsModal.classList.add('active');
  });

  closeSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('active');
  });

  toggleKeyVisibility.addEventListener('click', () => {
    const type = geminiApiKeyInput.getAttribute('type') === 'password' ? 'text' : 'password';
    geminiApiKeyInput.setAttribute('type', type);
    toggleKeyVisibility.innerHTML = type === 'password' ? `<i class="fa-solid fa-eye"></i>` : `<i class="fa-solid fa-eye-slash"></i>`;
  });

  saveApiKeyBtn.addEventListener('click', () => {
    const key = geminiApiKeyInput.value.trim();
    localStorage.setItem('gemini_api_key', key);
    showTestFeedback('تم حفظ مفتاح API بنجاح.', 'success');
    setTimeout(() => {
      settingsModal.classList.remove('active');
    }, 800);
  });

  testApiKeyBtn.addEventListener('click', testAPIKey);

  // Tab switching events
  document.querySelectorAll('.tab-link').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-link').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      activeTab = btn.getAttribute('data-tab');
      document.getElementById(activeTab).classList.add('active');
    });
  });

  // Search input event
  searchBar.addEventListener('input', () => {
    renderSubmissionsList();
  });

  // Action button events
  deleteBtn.addEventListener('click', deleteSubmission);
  analyzeBtn.addEventListener('click', startAnalysis);
  aiPlaceholderAnalyzeBtn.addEventListener('click', startAnalysis);
  regenerateBtn.addEventListener('click', startAnalysis);
  downloadExcelBtn.addEventListener('click', () => {
    if (currentDetailedSubmission) {
      downloadSubmissionAsExcel(currentDetailedSubmission);
    } else {
      alert('يرجى اختيار طلب أولاً.');
    }
  });

  copyReportBtn.addEventListener('click', () => {
    const el = document.createElement('textarea');
    // Get text content of container or fetch original report
    const sub = submissions.find(s => s.id === selectedSubmissionId);
    if (!sub || !sub.analysis) return;
    
    el.value = sub.analysis.reportText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    
    const originalText = copyReportBtn.innerHTML;
    copyReportBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> تم النسخ!`;
    copyReportBtn.style.color = 'var(--success-color)';
    
    setTimeout(() => {
      copyReportBtn.innerHTML = originalText;
      copyReportBtn.style.color = '';
    }, 2000);
  });

  // Core API Functions
  async function fetchSubmissions() {
    try {
      const res = await fetch('/api/submissions');
      if (!res.ok) throw new Error('Failed to fetch submissions catalog.');
      submissions = await res.json();
      
      updateStats();
      renderSubmissionsList();
      
      // Auto-select first submission if available
      if (submissions.length > 0 && !selectedSubmissionId) {
        selectSubmission(submissions[0].id);
      }
    } catch (err) {
      console.error(err);
      submissionsList.innerHTML = `<div class="sidebar-loader" style="color: var(--error-color)">
        <i class="fa-solid fa-circle-exclamation" style="font-size:1.5rem;"></i>
        <span>خطأ في الاتصال بالخادم.</span>
      </div>`;
    }
  }

  function updateStats() {
    statTotal.textContent = submissions.length;
    const analyzedCount = submissions.filter(s => s.hasAnalysis).length;
    statAnalyzed.textContent = analyzedCount;
    statPending.textContent = submissions.length - analyzedCount;
  }

  function renderSubmissionsList() {
    const query = searchBar.value.trim().toLowerCase();
    
    const filtered = submissions.filter(s => {
      return s.name.toLowerCase().includes(query) || 
             s.unitType.toLowerCase().includes(query) ||
             s.id.toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
      submissionsList.innerHTML = `<div class="sidebar-loader">
        <i class="fa-solid fa-folder-open" style="font-size:1.3rem; opacity: 0.5;"></i>
        <span>لا توجد طلبات مطابقة</span>
      </div>`;
      return;
    }

    submissionsList.innerHTML = '';
    filtered.forEach(sub => {
      const card = document.createElement('div');
      card.className = `sub-item-card ${sub.id === selectedSubmissionId ? 'selected' : ''}`;
      card.dataset.id = sub.id;
      
      const formattedDate = formatDate(sub.submittedAt);
      
      card.innerHTML = `
        <div class="sub-card-header">
          <span class="sub-client-name">${sub.name}</span>
          <span class="sub-date">${formattedDate}</span>
        </div>
        <div class="sub-details-line">
          <span>${sub.unitType} - ${sub.area}</span>
          <span>${sub.budget}</span>
        </div>
        <div class="sub-badges">
          ${sub.hasAnalysis 
            ? `<span class="sub-badge analyzed"><i class="fa-solid fa-wand-magic-sparkles"></i> تم التحليل</span>`
            : `<span class="sub-badge pending"><i class="fa-solid fa-clock"></i> معلق</span>`
          }
        </div>
      `;

      card.addEventListener('click', () => selectSubmission(sub.id));
      submissionsList.appendChild(card);
    });
  }

  async function selectSubmission(id) {
    selectedSubmissionId = id;
    currentDetailedSubmission = null;
    
    // Highlight item in sidebar
    document.querySelectorAll('.sub-item-card').forEach(card => {
      if (card.dataset.id === id) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });

    // Show details loader or state
    emptyState.style.display = 'none';
    detailsPanel.style.display = 'flex';

    try {
      const res = await fetch(`/api/submissions/${id}`);
      if (!res.ok) throw new Error('Could not load submission details');
      const data = await res.json();
      currentDetailedSubmission = data;
      
      // Update local submission representation if catalog has changed
      const index = submissions.findIndex(s => s.id === id);
      if (index !== -1) {
        submissions[index].hasAnalysis = !!data.analysis;
        updateStats();
        // Update badge inline
        const cardBadge = document.querySelector(`.sub-item-card[data-id="${id}"] .sub-badges`);
        if (cardBadge) {
          cardBadge.innerHTML = data.analysis
            ? `<span class="sub-badge analyzed"><i class="fa-solid fa-wand-magic-sparkles"></i> تم التحليل</span>`
            : `<span class="sub-badge pending"><i class="fa-solid fa-clock"></i> معلق</span>`;
        }
      }

      renderSubmissionDetails(data);
    } catch (err) {
      console.error(err);
      alert('خطأ في تحميل تفاصيل الطلب.');
    }
  }

  function renderSubmissionDetails(sub) {
    // Header
    clientName.textContent = sub.clientInfo.fullName || 'عميل غير معروف';
    clientPhoneBadge.innerHTML = `<i class="fa-solid fa-phone"></i> ${sub.clientInfo.phone || '-'}`;
    submissionDateBadge.innerHTML = `<i class="fa-solid fa-calendar-day"></i> ${formatFullDate(sub.submittedAt)}`;
    unitTypeBadge.innerHTML = `<i class="fa-solid fa-house"></i> ${sub.projectInfo.unitType || '-'}`;

    // Tab 1: Client profile
    valFullName.textContent = sub.clientInfo.fullName || '-';
    valPhone.textContent = sub.clientInfo.phone || '-';
    valEmail.textContent = sub.clientInfo.email || '-';
    valJobTitle.textContent = sub.clientInfo.jobTitle || '-';
    valAge.textContent = sub.clientInfo.age || '-';
    valNationality.textContent = sub.clientInfo.nationality || '-';
    valMaritalStatus.textContent = sub.clientInfo.maritalStatus || '-';
    valGender.textContent = sub.clientInfo.gender || '-';

    // Wife/Husband Info block
    if (sub.wifeInfo) {
      wifeSummaryBlock.style.display = 'block';
      const isFemale = sub.clientInfo.gender === 'أنثى';
      
      // Update Labels and values dynamically based on gender
      if (isFemale) {
        wifeSubHeader.textContent = 'تفاصيل شريك الحياة (الزوج)';
        lblWifeNameAge.textContent = 'الاسم والعمر (الزوج):';
        lblWifeJob.textContent = 'هل يعمل؟ ووظيفته:';
        lblWifeOffice.textContent = 'احتياج مكتب منزلي:';
        lblWifePrefs.textContent = 'الألوان والتفضيلات:';
        
        const worksStr = sub.wifeInfo.works === 'نعم' ? `يعمل (${sub.wifeInfo.jobTitle || 'غير محدد'})` : 'لا يعمل';
        valWifeNameAge.textContent = `${sub.wifeInfo.name || 'غير محدد'} (${sub.wifeInfo.age || '-'} سنة)`;
        valWifeJob.textContent = worksStr;
        valWifeOffice.textContent = sub.wifeInfo.needsOffice || 'لا يحتاج';
        valWifePrefs.textContent = `الألوان: ${sub.wifeInfo.preferredColors || '-'} | نمط الحياة: ${sub.wifeInfo.lifestyle || '-'}`;
      } else {
        wifeSubHeader.textContent = 'تفاصيل شريكة الحياة (الزوجة)';
        lblWifeNameAge.textContent = 'الاسم والعمر:';
        lblWifeJob.textContent = 'هل تعمل؟ ووظيفتها:';
        lblWifeOffice.textContent = 'احتياج مكتب منزلي:';
        lblWifePrefs.textContent = 'الألوان والتفضيلات:';
        
        const worksStr = sub.wifeInfo.works === 'نعم' ? `تعمل (${sub.wifeInfo.jobTitle || 'غير محدد'})` : 'لا تعمل';
        valWifeNameAge.textContent = `${sub.wifeInfo.name || 'غير محدد'} (${sub.wifeInfo.age || '-'} سنة)`;
        valWifeJob.textContent = worksStr;
        valWifeOffice.textContent = sub.wifeInfo.needsOffice || 'لا تحتاج';
        valWifePrefs.textContent = `الألوان: ${sub.wifeInfo.preferredColors || '-'} | نمط الحياة: ${sub.wifeInfo.lifestyle || '-'}`;
      }
    } else {
      wifeSummaryBlock.style.display = 'none';
    }

    // Children block
    if (sub.childrenInfo && sub.childrenInfo.length > 0) {
      childrenSummaryBlock.style.display = 'block';
      valChildrenCount.textContent = sub.childrenInfo.length;
      childrenDetailsList.innerHTML = '';
      sub.childrenInfo.forEach((child, i) => {
        const item = document.createElement('div');
        item.className = 'child-detail-item';
        item.innerHTML = `
          <strong>الطفل ${i + 1}:</strong> ${child.name || 'دون اسم'} (${child.gender || '-'}، ${child.age || '-'} سنة) <br>
          <span>هوايات: ${child.hobbies || '-'} | متطلبات خاصة: ${child.needs || '-'}</span>
        `;
        childrenDetailsList.appendChild(item);
      });
    } else {
      childrenSummaryBlock.style.display = 'none';
      valChildrenCount.textContent = 'لا يوجد';
    }

    // Project Details
    valUnitType.textContent = sub.projectInfo.unitType || '-';
    valApproxArea.textContent = sub.projectInfo.approxArea || '-';
    valProjectAddress.textContent = sub.projectInfo.address || '-';
    valFamilyMembers.textContent = sub.projectInfo.familyMembers || '-';
    valHasElderly.textContent = sub.projectInfo.hasElderly || '-';
    valHasPets.textContent = sub.projectInfo.hasPets || '-';
    valTimeline.textContent = sub.projectInfo.timeline || '-';
    valDeadline.textContent = sub.projectInfo.deadline || 'لا يوجد تاريخ محدد';

    // Lifestyle & Budget
    valBudget.textContent = sub.projectInfo.budget || '-';
    valBudgetPriority.textContent = sub.projectInfo.budgetPriority || '-';
    valAtmosphere.textContent = sub.preferences.atmosphere || '-';
    valHomeRole.textContent = sub.preferences.homeRole || '-';
    valWfh.textContent = sub.preferences.wfh || '-';
    valGuests.textContent = sub.preferences.guests || '-';

    // Style & Aesthetic Details
    valPreferredStyle.textContent = sub.preferences.preferredStyle || '-';
    valSpatialFeel.textContent = sub.preferences.spatialFeel || '-';
    valSpaceStyle.textContent = sub.preferences.spaceStyle || '-';
    valFurnitureType.textContent = sub.preferences.furnitureType || '-';
    valLighting.textContent = sub.preferences.lighting || '-';
    valFavoriteColors.textContent = sub.preferences.favoriteColors || '-';
    valDislikedColors.textContent = sub.preferences.dislikedColors || '-';

    // Materials Tags
    valMaterialsTags.innerHTML = '';
    if (sub.preferences.materials && sub.preferences.materials.length > 0) {
      sub.preferences.materials.forEach(mat => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = mat;
        valMaterialsTags.appendChild(tag);
      });
    } else {
      valMaterialsTags.innerHTML = '<span style="color: var(--text-muted); font-size:0.85rem;">لم يتم تحديد خامات مفضلة</span>';
    }

    // Art Vibes
    valGuestFeel.textContent = sub.finalThoughts.guestFeel || '-';
    valHomeFeel.textContent = sub.finalThoughts.homeFeel || '-';
    valIdealHomeThreeWords.textContent = sub.finalThoughts.idealHomeThreeWords || '-';
    valDislikedDesignElements.textContent = sub.finalThoughts.dislikedDesignElements || '-';
    valPriority.textContent = sub.finalThoughts.priority || '-';
    valHasReferenceImages.textContent = sub.finalThoughts.hasReferenceImages || '-';

    // Tab 2: Rooms detail
    const rooms = sub.rooms || {};
    
    // Living Room
    const living = rooms.livingRoom || {};
    roomLivingUse.textContent = living.usage || '-';
    roomLivingCapacity.textContent = living.capacity || '-';
    roomLivingSeatingType.textContent = living.seatingType || '-';
    roomLivingTv.textContent = living.tvEssential || '-';
    roomLivingExtra.textContent = living.extraRequirements || 'لا توجد متطلبات خاصة إضافية';

    // Reception & Dining
    const recep = rooms.reception || {};
    roomReceptionStyle.textContent = recep.style || '-';
    roomDiningUse.textContent = recep.diningUse || '-';
    roomDiningChairs.textContent = recep.diningChairs || '-';
    roomDiningNeeds.textContent = recep.diningNeeds || '-';

    // Kitchen
    const kit = rooms.kitchen || {};
    roomKitchenType.textContent = kit.type || '-';
    roomKitchenUsage.textContent = kit.usage || '-';
    roomKitchenNeeds.textContent = kit.needs || 'لا توجد عناصر مخصصة محددة';

    // Master Bedroom
    const master = rooms.masterBedroom || {};
    roomMasterVibe.textContent = master.vibe || '-';
    roomMasterLighting.textContent = master.lighting || '-';
    roomMasterNeeds.textContent = master.needs || 'لا توجد متطلبات خاصة إضافية';

    // Extras
    const extra = rooms.extraRooms || {};
    roomEntranceVal.textContent = extra.entrance || '-';
    roomLaundryVal.textContent = extra.laundry || '-';
    roomOfficeVal.textContent = extra.office || '-';
    roomEntertainmentVal.textContent = extra.entertainment || '-';
    roomTerraceVal.textContent = extra.terrace || 'لا توجد متطلبات خاصة للتراس/الرووف الخارجي';

    // Tab 3: AI Report view
    if (sub.analysis) {
      renderAIReport(sub.analysis);
    } else {
      showAIReportPlaceholder();
    }
  }

  function showAIReportPlaceholder() {
    aiPlaceholder.style.display = 'flex';
    aiLoader.style.display = 'none';
    aiReportWrapper.style.display = 'none';
  }

  function renderAIReport(analysis) {
    aiPlaceholder.style.display = 'none';
    aiLoader.style.display = 'none';
    aiReportWrapper.style.display = 'flex';
    
    reportGeneratedAt.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i> تاريخ التوليد: ${formatFullDate(analysis.generatedAt)}`;
    
    // Parse Markdown to HTML
    if (window.marked) {
      reportTextContainer.innerHTML = window.marked.parse(analysis.reportText);
    } else {
      // Fallback
      reportTextContainer.textContent = analysis.reportText;
    }
  }

  // API Key handling
  function loadAPIKey() {
    const key = localStorage.getItem('gemini_api_key') || '';
    geminiApiKeyInput.value = key;
  }

  function showTestFeedback(message, type) {
    testKeyFeedback.className = `test-feedback ${type}`;
    testKeyFeedback.textContent = message;
    testKeyFeedback.style.display = 'block';
  }

  async function testAPIKey() {
    const key = geminiApiKeyInput.value.trim();
    if (!key) {
      showTestFeedback('يرجى كتابة مفتاح API Key أولاً.', 'error');
      return;
    }

    testApiKeyBtn.disabled = true;
    testApiKeyBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري التحقق...`;
    showTestFeedback('جاري إرسال طلب تحقق خفيف إلى خوادم Google Gemini...', 'success');

    try {
      const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
      const response = await fetch(testUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Test connection. Reply with "OK" only.' }] }]
        })
      });

      if (response.ok) {
        showTestFeedback('مفتاح API Key صحيح ويعمل بنجاح!', 'success');
      } else {
        const errJson = await response.json().catch(() => ({}));
        const errMsg = errJson?.error?.message || response.statusText || 'كود استجابة غير صالح';
        showTestFeedback(`مفتاح غير صالح أو تم رفض الطلب: ${errMsg}`, 'error');
      }
    } catch (err) {
      showTestFeedback(`فشل الاتصال بالإنترنت أو بخادم API: ${err.message}`, 'error');
    } finally {
      testApiKeyBtn.disabled = false;
      testApiKeyBtn.innerHTML = `<i class="fa-solid fa-vial"></i> اختبار المفتاح`;
    }
  }

  // Trigger Gemini Analysis
  async function startAnalysis() {
    const apiKey = localStorage.getItem('gemini_api_key') || '';
    if (!apiKey) {
      alert('يجب إدخال مفتاح Gemini API Key لتوليد التقرير الذكي. يرجى فتح الإعدادات وتعيين المفتاح.');
      settingsBtn.click();
      return;
    }

    // Switch to AI Tab
    document.getElementById('aiReportTabBtn').click();

    // Toggle loader UI
    aiPlaceholder.style.display = 'none';
    aiReportWrapper.style.display = 'none';
    aiLoader.style.display = 'flex';

    // Reset steps indicators
    resetLoadingSteps();
    
    // Start step simulation timer
    const stepTimers = simulateLoadingSteps();
    
    try {
      console.log(`Triggering Gemini analysis request for id ${selectedSubmissionId}...`);
      const res = await fetch(`/api/submissions/${selectedSubmissionId}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ apiKey })
      });

      // Clear timer simulation
      stepTimers.forEach(t => clearTimeout(t));

      const resJson = await res.json();

      if (!res.ok || resJson.error) {
        throw new Error(resJson.error || 'Unknown error generating report');
      }

      // Mark all loading steps complete
      markAllStepsComplete();
      
      // Update local storage representation
      const subIndex = submissions.findIndex(s => s.id === selectedSubmissionId);
      if (subIndex !== -1) {
        submissions[subIndex].hasAnalysis = true;
        updateStats();
        renderSubmissionsList();
      }

      // Fetch the updated full submission to get the reportText
      selectSubmission(selectedSubmissionId);
    } catch (err) {
      // Clear timers
      stepTimers.forEach(t => clearTimeout(t));
      
      console.error('Error invoking analysis endpoint:', err);
      aiLoader.style.display = 'none';
      aiPlaceholder.style.display = 'flex';
      
      alert('حدث خطأ أثناء إجراء التحليل بالذكاء الاصطناعي:\n' + err.message);
    }
  }

  // Animating loading steps
  function resetLoadingSteps() {
    aiLoadingTitle.textContent = 'جاري تحليل تفضيلات العميل...';
    
    const steps = [
      { id: 'stepData', text: 'تجميع بيانات الاستبيان' },
      { id: 'stepPalette', text: 'استنباط الألوان والخامات الملائمة' },
      { id: 'stepSpace', text: 'التوجيه الهندسي وتوزيع الفراغات' },
      { id: 'stepReport', text: 'كتابة التقرير النهائي باللغة العربية' }
    ];

    steps.forEach((step, idx) => {
      const el = document.getElementById(step.id);
      el.className = 'loading-step';
      if (idx === 0) {
        el.classList.add('active');
        el.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${step.text}`;
      } else {
        el.innerHTML = `<i class="fa-solid fa-circle-notch"></i> ${step.text}`;
      }
    });
  }

  function simulateLoadingSteps() {
    const timers = [];
    
    // Step 2 starts
    timers.push(setTimeout(() => {
      markStepComplete('stepData', 'تم تجميع وحصر بيانات الاستبيان');
      activateStep('stepPalette', 'جاري تحليل تفضيلات الألوان والمواد الديكورية...');
    }, 3000));

    // Step 3 starts
    timers.push(setTimeout(() => {
      markStepComplete('stepPalette', 'تم تحديد لوحة الألوان والخامات المقترحة');
      activateStep('stepSpace', 'جاري توزيع المساحات وتوليد مخطط الإضاءة...');
    }, 7500));

    // Step 4 starts
    timers.push(setTimeout(() => {
      markStepComplete('stepSpace', 'تم استنباط تخطيط الفراغات وتكامل الإضاءة');
      activateStep('stepReport', 'جاري كتابة وتنسيق التقرير النهائي باللغة العربية الفصحى...');
      aiLoadingTitle.textContent = 'جاري صياغة مخرجات Gemini الإبداعية...';
    }, 13000));

    return timers;
  }

  function markStepComplete(id, text) {
    const el = document.getElementById(id);
    el.className = 'loading-step completed';
    el.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${text}`;
  }

  function activateStep(id, text) {
    const el = document.getElementById(id);
    el.className = 'loading-step active';
    el.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${text}`;
  }

  function markAllStepsComplete() {
    markStepComplete('stepData', 'تم تجميع وحصر بيانات الاستبيان');
    markStepComplete('stepPalette', 'تم تحديد لوحة الألوان والخامات المقترحة');
    markStepComplete('stepSpace', 'تم استنباط تخطيط الفراغات وتكامل الإضاءة');
    markStepComplete('stepReport', 'تم تنسيق وحفظ التقرير النهائي');
  }

  // Delete submission
  async function deleteSubmission() {
    if (!selectedSubmissionId) return;
    
    const confirmDelete = confirm('هل أنت متأكد تماماً من رغبتك في حذف هذا الطلب نهائياً من قاعدة البيانات؟ لا يمكن التراجع عن هذا الإجراء.');
    if (!confirmDelete) return;

    try {
      console.log(`Sending delete request for submission: ${selectedSubmissionId}`);
      const res = await fetch(`/api/submissions/${selectedSubmissionId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Server returned error status on delete');
      
      alert('تم حذف الطلب بنجاح.');
      
      // Update catalog state
      submissions = submissions.filter(s => s.id !== selectedSubmissionId);
      selectedSubmissionId = null;
      
      updateStats();
      renderSubmissionsList();
      
      if (submissions.length > 0) {
        selectSubmission(submissions[0].id);
      } else {
        detailsPanel.style.display = 'none';
        emptyState.style.display = 'flex';
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء محاولة حذف الطلب: ' + err.message);
    }
  }

  // Helper date formatters
  function formatDate(isoString) {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    } catch (e) {
      return '-';
    }
  }

  function formatFullDate(isoString) {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('ar-SA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  }

  function downloadSubmissionAsExcel(sub) {
    if (!sub) return;

    const dataRows = [];
    
    // Headers
    dataRows.push(["القسم", "الحقل", "القيمة"]);

    // 1. Client Personal Info
    const ci = sub.clientInfo || {};
    dataRows.push(["البيانات الشخصية", "الاسم الكامل", ci.fullName || "-"]);
    dataRows.push(["البيانات الشخصية", "رقم الجوال", ci.phone || "-"]);
    dataRows.push(["البيانات الشخصية", "البريد الإلكتروني", ci.email || "-"]);
    dataRows.push(["البيانات الشخصية", "المسمى الوظيفي", ci.jobTitle || "-"]);
    dataRows.push(["البيانات الشخصية", "العمر", ci.age || "-"]);
    dataRows.push(["البيانات الشخصية", "الجنسية", ci.nationality || "-"]);
    dataRows.push(["البيانات الشخصية", "الحالة الاجتماعية", ci.maritalStatus || "-"]);
    dataRows.push(["البيانات الشخصية", "الجنس", ci.gender || "-"]);

    // 2. Partner Info
    if (sub.wifeInfo) {
      const wi = sub.wifeInfo;
      const isFemale = ci.gender === 'أنثى';
      const sectionName = isFemale ? "بيانات الزوج" : "بيانات الزوجة";
      const worksStr = isFemale
        ? (wi.works === 'نعم' ? `يعمل (${wi.jobTitle || 'غير محدد'})` : 'لا يعمل')
        : (wi.works === 'نعم' ? `تعمل (${wi.jobTitle || 'غير محدد'})` : 'لا تعمل');
      
      dataRows.push([sectionName, "الاسم والعمر", `${wi.name || 'غير محدد'} (${wi.age || '-'} سنة)`]);
      dataRows.push([sectionName, "الحالة الوظيفية", worksStr]);
      dataRows.push([sectionName, "احتياج مكتب منزلي", wi.needsOffice || "-"]);
      dataRows.push([sectionName, "الألوان وتفضيلات المعيشة", `الألوان: ${wi.preferredColors || '-'} | نمط الحياة: ${wi.lifestyle || '-'}`]);
    }

    // 3. Children Info
    if (sub.childrenInfo && sub.childrenInfo.length > 0) {
      dataRows.push(["بيانات الأطفال", "عدد الأطفال", sub.childrenInfo.length]);
      sub.childrenInfo.forEach((child, idx) => {
        dataRows.push([
          `بيانات الأطفال - الطفل ${idx + 1}`,
          child.name || "غير معروف",
          `${child.gender || "-"}، العمر: ${child.age || "-"} سنة، هوايات: ${child.hobbies || "-"}، متطلبات خاصة: ${child.needs || "-"}`
        ]);
      });
    } else {
      dataRows.push(["بيانات الأطفال", "عدد الأطفال", "لا يوجد"]);
    }

    // 4. Project & Timeline
    const pi = sub.projectInfo || {};
    dataRows.push(["تفاصيل العقار", "نوع الوحدة", pi.unitType || "-"]);
    dataRows.push(["تفاصيل العقار", "مساحة الوحدة", pi.approxArea || "-"]);
    dataRows.push(["تفاصيل العقار", "عنوان المشروع", pi.address || "-"]);
    dataRows.push(["تفاصيل العقار", "عدد أفراد الأسرة بالمنزل", pi.familyMembers || "-"]);
    dataRows.push(["تفاصيل العقار", "هل يوجد كبار سن؟", pi.hasElderly || "-"]);
    dataRows.push(["تفاصيل العقار", "هل يوجد حيوانات أليفة؟", pi.hasPets || "-"]);
    dataRows.push(["تفاصيل العقار", "الجدول الزمني المطلوب", pi.timeline || "-"]);
    dataRows.push(["تفاصيل العقار", "تاريخ نهائي محدد (Deadline)", pi.deadline || "-"]);

    // 5. Budget & Lifestyle
    dataRows.push(["الميزانية وأسلوب الحياة", "الميزانية المرصودة", pi.budget || "-"]);
    dataRows.push(["الميزانية وأسلوب الحياة", "أولوية الميزانية", pi.budgetPriority || "-"]);
    
    const pref = sub.preferences || {};
    dataRows.push(["الميزانية وأسلوب الحياة", "أجواء المنزل العامة", pref.atmosphere || "-"]);
    dataRows.push(["الميزانية وأسلوب الحياة", "دور المنزل الرئيسي", pref.homeRole || "-"]);
    dataRows.push(["الميزانية وأسلوب الحياة", "العمل من المنزل", pref.wfh || "-"]);
    dataRows.push(["الميزانية وأسلوب الحياة", "معدل استقبال الضيوف", pref.guests || "-"]);

    // 6. Style & Design Preferences
    dataRows.push(["التصميم والنمط", "الطراز المفضل", pref.preferredStyle || "-"]);
    dataRows.push(["التصميم والنمط", "نوعية الفراغات المفضلة", pref.spatialFeel || "-"]);
    dataRows.push(["التصميم والنمط", "توزيع المساحات", pref.spaceStyle || "-"]);
    dataRows.push(["التصميم والنمط", "نوع الأثاث المفضل", pref.furnitureType || "-"]);
    dataRows.push(["التصميم والنمط", "نوع الإضاءة المفضلة", pref.lighting || "-"]);
    dataRows.push(["التصميم والنمط", "الألوان المفضلة", pref.favoriteColors || "-"]);
    dataRows.push(["التصميم والنمط", "الألوان المرفوضة", pref.dislikedColors || "-"]);
    dataRows.push(["التصميم والنمط", "الخامات المفضلة", Array.isArray(pref.materials) ? pref.materials.join(', ') : "-"]);

    // 7. Final Thoughts
    const ft = sub.finalThoughts || {};
    dataRows.push(["التطلعات والمشاعر", "شعور الضيف عند الدخول", ft.guestFeel || "-"]);
    dataRows.push(["التطلعات والمشاعر", "شعور العائلة داخل المنزل", ft.homeFeel || "-"]);
    dataRows.push(["التطلعات والمشاعر", "المنزل المثالي في ثلاث كلمات", ft.idealHomeThreeWords || "-"]);
    dataRows.push(["التطلعات والمشاعر", "أشياء لا يرغب برؤيتها", ft.dislikedDesignElements || "-"]);
    dataRows.push(["التطلعات والمشاعر", "الأولوية الكبرى للتصميم", ft.priority || "-"]);
    dataRows.push(["التطلعات والمشاعر", "صور مرجعية ملهمة", ft.hasReferenceImages || "-"]);

    // 8. Rooms Detailed Preferences
    const rooms = sub.rooms || {};
    
    // Living
    const liv = rooms.livingRoom || {};
    dataRows.push(["تفضيلات الغرف - المعيشة", "الاستخدام الأساسي", liv.usage || "-"]);
    dataRows.push(["تفضيلات الغرف - المعيشة", "السعة الاستيعابية", liv.capacity || "-"]);
    dataRows.push(["تفضيلات الغرف - المعيشة", "نوع الجلسة المفضل", liv.seatingType || "-"]);
    dataRows.push(["تفضيلات الغرف - المعيشة", "التلفزيون عنصر رئيسي؟", liv.tvEssential || "-"]);
    dataRows.push(["تفضيلات الغرف - المعيشة", "متطلبات خاصة بالصالة", liv.extraRequirements || "-"]);

    // Reception
    const rec = rooms.reception || {};
    dataRows.push(["تفضيلات الغرف - الاستقبال", "طابع صالون الاستقبال", rec.style || "-"]);
    dataRows.push(["تفضيلات الغرف - الاستقبال", "استخدام السفرة الرئيسي", rec.diningUse || "-"]);
    dataRows.push(["تفضيلات الغرف - الاستقبال", "عدد كراسي طاولة الطعام", rec.diningChairs || "-"]);
    dataRows.push(["تفضيلات الغرف - الاستقبال", "مكونات منطقة السفرة", rec.diningNeeds || "-"]);

    // Kitchen
    const kit = rooms.kitchen || {};
    dataRows.push(["تفضيلات الغرف - المطبخ", "نوع المطبخ المختار", kit.type || "-"]);
    dataRows.push(["تفضيلات الغرف - المطبخ", "معدل الطبخ والاستخدام", kit.usage || "-"]);
    dataRows.push(["تفضيلات الغرف - المطبخ", "التجهيزات المطلوبة", kit.needs || "-"]);

    // Master Bedroom
    const mas = rooms.masterBedroom || {};
    dataRows.push(["تفضيلات الغرف - النوم الرئيسية", "الطابع الجمالي والأجواء", mas.vibe || "-"]);
    dataRows.push(["تفضيلات الغرف - النوم الرئيسية", "توزيع الإضاءة المفضل", mas.lighting || "-"]);
    dataRows.push(["تفضيلات الغرف - النوم الرئيسية", "متطلبات إضافية", mas.needs || "-"]);

    // Service & Extras
    const ext = rooms.extraRooms || {};
    dataRows.push(["تفضيلات الغرف - ملحقات", "منطقة المدخل", ext.entrance || "-"]);
    dataRows.push(["تفضيلات الغرف - ملحقات", "غرفة الغسيل", ext.laundry || "-"]);
    dataRows.push(["تفضيلات الغرف - ملحقات", "المكتب المنزلي", ext.office || "-"]);
    dataRows.push(["تفضيلات الغرف - ملحقات", "الجيم والترفيه", ext.entertainment || "-"]);
    dataRows.push(["تفضيلات الغرف - ملحقات", "التراس والرووف", ext.terrace || "-"]);

    // Create sheet
    const ws = XLSX.utils.aoa_to_sheet(dataRows);
    
    // Set sheet direction to RTL
    if (!ws['!views']) ws['!views'] = [];
    ws['!views'].push({ RTL: true });

    // Column Widths Auto-fit
    const colWidths = [
      { wch: 25 }, // Section
      { wch: 35 }, // Field
      { wch: 60 }  // Value
    ];
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "تفاصيل الطلب");

    // Output filename: customer's full name (fallback to 'طلب_تصميم')
    const clientFullName = ci.fullName ? ci.fullName.trim().replace(/[/\\?%*:|"<>]/g, '_') : 'طلب_تصميم';
    XLSX.writeFile(wb, `${clientFullName}.xlsx`);
  }
});
