document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.getElementById('viewport');
  const cards = Array.from(viewport.querySelectorAll('.step-card'));
  const progressBar = document.getElementById('progressBar');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const navControls = document.getElementById('navControls');

  let currentStep = 0;
  const totalSteps = cards.length - 1; // Last step is success/loading screen

  // Materials selection logic
  const materialsContainer = document.getElementById('materialsContainer');
  if (materialsContainer) {
    materialsContainer.querySelectorAll('.choice-key').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('selected');
        // Optional coloring
        if (btn.classList.contains('selected')) {
          btn.style.borderColor = 'var(--accent-color)';
          btn.style.backgroundColor = 'rgba(197, 168, 128, 0.15)';
        } else {
          btn.style.borderColor = 'var(--border-color)';
          btn.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        }
      });
    });
  }

  // Yes/No Selection Toggle for Wife
  const hasWifeWrapper = document.getElementById('hasWifeWrapper');
  const wifeDetailsForm = document.getElementById('wifeDetailsForm');
  if (hasWifeWrapper) {
    hasWifeWrapper.querySelectorAll('.yes-no-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        hasWifeWrapper.querySelectorAll('.yes-no-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        const val = btn.getAttribute('data-value');
        if (val === 'نعم') {
          wifeDetailsForm.style.display = 'grid';
        } else {
          wifeDetailsForm.style.display = 'none';
        }
      });
    });
  }

  // Children Dynamic Form Generator
  const childrenCountInput = document.getElementById('childrenCount');
  const childrenContainer = document.getElementById('childrenContainer');
  if (childrenCountInput && childrenContainer) {
    childrenCountInput.addEventListener('input', updateChildrenForms);
    
    function updateChildrenForms() {
      const count = parseInt(childrenCountInput.value) || 0;
      childrenContainer.innerHTML = '';
      
      if (count <= 0) return;
      
      for (let i = 1; i <= Math.min(count, 6); i++) {
        const childCard = document.createElement('div');
        childCard.className = 'child-form-block';
        childCard.style.padding = '15px';
        childCard.style.background = 'rgba(255,255,255,0.02)';
        childCard.style.border = '1px solid var(--border-color)';
        childCard.style.borderRadius = '8px';
        childCard.style.marginBottom = '15px';
        
        childCard.innerHTML = `
          <h4 style="color: var(--accent-color); font-size: 1rem; margin-bottom: 12px; display: flex; justify-content: space-between;">
            <span>الطفل ${i}</span>
          </h4>
          <div class="compact-grid">
            <div class="compact-item">
              <label class="compact-label">الاسم</label>
              <input type="text" class="compact-input child-name" placeholder="اسم الطفل">
            </div>
            <div class="compact-item">
              <label class="compact-label">الجنس</label>
              <select class="compact-input child-gender">
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>
            <div class="compact-item">
              <label class="compact-label">العمر</label>
              <input type="number" class="compact-input child-age" placeholder="العمر">
            </div>
            <div class="compact-item">
              <label class="compact-label">الهوايات / الاهتمامات</label>
              <input type="text" class="compact-input child-hobbies" placeholder="الرسم، الألعاب، إلخ...">
            </div>
            <div class="compact-item" style="grid-column: span 2;">
              <label class="compact-label">متطلبات خاصة بالدراسة أو الترفيه في الغرفة</label>
              <input type="text" class="compact-input child-needs" placeholder="مكتب دراسي، مساحة تخزين ألعاب إضافية، سرير مدمج">
            </div>
          </div>
        `;
        childrenContainer.appendChild(childCard);
      }
    }
  }

  // Handle Step transitions
  function showStep(stepIndex) {
    if (stepIndex < 0 || stepIndex > totalSteps) return;

    // Remove active state from current card
    const currentCard = cards[currentStep];
    currentCard.classList.remove('active');
    currentCard.classList.add('exit');
    
    setTimeout(() => {
      currentCard.classList.remove('exit');
      currentCard.style.display = 'none';
      
      // Update step tracker
      currentStep = stepIndex;
      
      const newCard = cards[currentStep];
      newCard.style.display = 'flex';
      
      // Force repaint
      newCard.offsetHeight;
      
      newCard.classList.add('active');
      
      // Update UI elements
      updateControls();
    }, 450);
  }

  function updateControls() {
    // Show/hide prev button
    if (currentStep === 0) {
      prevBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'block';
    }

    // Adjust button labels and next controls
    if (currentStep === 0) {
      nextBtn.innerHTML = `ابدأ الآن <i class="fa-solid fa-arrow-left"></i>`;
      nextBtn.style.background = 'var(--accent-color)';
    } else if (currentStep === totalSteps - 1) {
      nextBtn.innerHTML = `إرسال الاستبيان <i class="fa-solid fa-paper-plane"></i>`;
      nextBtn.style.background = 'var(--success-color)';
    } else {
      nextBtn.innerHTML = `التالي <i class="fa-solid fa-chevron-left"></i>`;
      nextBtn.style.background = 'var(--accent-color)';
    }

    // Hide controls if we are on the submission/spinner screen (last screen, index totalSteps)
    if (currentStep === totalSteps) {
      navControls.style.display = 'none';
    } else {
      navControls.style.display = 'flex';
    }

    // Update Progress bar percentage
    const progress = (currentStep / (totalSteps - 1)) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }

  // Validations check before going forward
  function validateCurrentStep() {
    const activeCard = cards[currentStep];
    const requiredInputs = activeCard.querySelectorAll('[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = 'var(--error-color)';
        // Reset border color on input
        input.addEventListener('input', () => {
          input.style.borderColor = 'var(--border-color)';
        }, { once: true });
      }
    });

    return isValid;
  }

  // Navigation Click listeners
  nextBtn.addEventListener('click', () => {
    if (currentStep === totalSteps - 1) {
      // Final submit step
      if (validateCurrentStep()) {
        submitForm();
      }
    } else {
      if (validateCurrentStep()) {
        showStep(currentStep + 1);
      }
    }
  });

  prevBtn.addEventListener('click', () => {
    showStep(currentStep - 1);
  });

  // Keyboard navigation support: Enter key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      // Avoid firing next step if user is typing inside a textarea
      if (document.activeElement && document.activeElement.tagName === 'TEXTAREA') {
        return;
      }
      
      // If loading or success, do nothing
      if (currentStep === totalSteps) return;

      e.preventDefault();
      nextBtn.click();
    }
  });

  // Submit form data to the server
  async function submitForm() {
    // Show spinner screen (index 14)
    showStep(totalSteps);
    
    // Gather all fields
    const payload = {};

    // 1. Identity info
    payload['الاسم الكامل'] = document.getElementById('fullName').value;
    payload['رقم الجوال'] = document.getElementById('phone').value;
    payload['البريد الإلكتروني'] = document.getElementById('email').value;
    payload['المسمى الوظيفي'] = document.getElementById('jobTitle').value;
    payload['العمر'] = document.getElementById('age').value;
    payload['الجنسية'] = document.getElementById('nationality').value;
    payload['الديانة'] = document.getElementById('religion').value;
    payload['الحالة الاجتماعية'] = document.getElementById('maritalStatus').value;

    // 2. Wife Info
    const selectedWifeBtn = hasWifeWrapper.querySelector('.yes-no-btn.selected');
    const hasWife = selectedWifeBtn ? selectedWifeBtn.getAttribute('data-value') : 'لا';
    if (hasWife === 'نعم') {
      payload.wife = {
        name: document.getElementById('wifeName').value,
        age: document.getElementById('wifeAge').value,
        works: document.getElementById('wifeWorks').value,
        jobTitle: document.getElementById('wifeJob').value,
        needsOffice: document.getElementById('wifeNeedsOffice').value,
        preferredColors: document.getElementById('wifeColors').value,
        lifestyle: document.getElementById('wifeLifestyle').value
      };
    } else {
      payload.wife = null;
    }

    // 3. Children Info
    const childrenCount = parseInt(childrenCountInput.value) || 0;
    payload.children = [];
    if (childrenCount > 0) {
      const childBlocks = childrenContainer.querySelectorAll('.child-form-block');
      childBlocks.forEach(block => {
        payload.children.push({
          name: block.querySelector('.child-name').value,
          gender: block.querySelector('.child-gender').value,
          age: block.querySelector('.child-age').value,
          hobbies: block.querySelector('.child-hobbies').value,
          needs: block.querySelector('.child-needs').value
        });
      });
    }

    // 4. Project info
    payload['نوع الوحدة:'] = document.getElementById('unitType').value;
    payload['مساحة الوحدة التقريبية:'] = document.getElementById('approxArea').value;
    payload['عنوان المشروع:'] = document.getElementById('projectAddress').value;
    payload['عدد أفراد الأسرة:'] = document.getElementById('familyMembers').value;
    payload['هل يوجد كبار سن؟'] = document.getElementById('hasElderly').value;
    payload['هل يوجد حيوانات أليفة؟'] = document.getElementById('hasPets').value;
    payload['الميزانية التقديرية'] = document.getElementById('budget').value;
    payload['أولوية الميزانية'] = document.getElementById('budgetPriority').value;
    payload['مدة التنفيذ'] = document.getElementById('timeline').value;
    payload['Deadline (إن وجد)'] = document.getElementById('deadline').value;

    // 5. Lifestyle & preferences
    payload['هل المنزل بالنسبة لك:'] = document.getElementById('homeRole').value;
    payload['هل تعمل من المنزل؟'] = document.getElementById('wfh').value;
    payload['هل تستقبل ضيوف باستمرار؟'] = document.getElementById('guests').value;
    payload['هل تفضل الأجواء:'] = document.getElementById('atmosphere').value;
    payload['هل تفضل المساحات:'] = document.getElementById('spaceStyle').value;

    // 6. Style & preferences
    payload['الطراز المفضل'] = document.getElementById('preferredStyle').value;
    payload['هل تفضل الفراغات:'] = document.getElementById('spatialFeel').value;
    payload['الإضاءة المفضلة'] = document.getElementById('lighting').value;
    payload['نوع الأثاث المفضل'] = document.getElementById('furnitureType').value;
    payload['الألوان المفضلة'] = document.getElementById('favoriteColors').value;
    payload['الألوان غير المفضلة'] = document.getElementById('dislikedColors').value;

    // Selected materials
    const selectedMaterials = [];
    materialsContainer.querySelectorAll('.choice-key.selected').forEach(el => {
      selectedMaterials.push(el.getAttribute('data-val'));
    });
    payload['الخامات المفضلة'] = selectedMaterials;

    // 7. Rooms detail
    payload.rooms = {
      livingRoom: {
        usage: document.getElementById('livingUse').value,
        capacity: document.getElementById('livingCapacity').value,
        seatingType: document.getElementById('livingSeatingType').value,
        tvEssential: document.getElementById('livingTv').value,
        extraRequirements: document.getElementById('livingExtra').value
      },
      reception: {
        style: document.getElementById('receptionStyle').value,
        diningUse: document.getElementById('diningUse').value,
        diningChairs: document.getElementById('diningChairs').value,
        diningNeeds: document.getElementById('diningNeeds').value
      },
      kitchen: {
        type: document.getElementById('kitchenType').value,
        usage: document.getElementById('kitchenUsage').value,
        needs: document.getElementById('kitchenNeeds').value
      },
      masterBedroom: {
        vibe: document.getElementById('masterVibe').value,
        lighting: document.getElementById('masterLighting').value,
        needs: document.getElementById('masterNeeds').value
      },
      extraRooms: {
        entrance: document.getElementById('roomEntrance').value,
        laundry: document.getElementById('roomLaundry').value,
        office: document.getElementById('roomOffice').value,
        entertainment: document.getElementById('roomEntertainment').value,
        terrace: document.getElementById('roomTerrace').value
      }
    };

    // 8. Final thoughts
    payload['كيف تريد أن يشعر الضيف عند دخول منزلك؟'] = document.getElementById('guestFeel').value;
    payload['كيف تريد أن تشعر داخل منزلك؟'] = document.getElementById('homeFeel').value;
    payload['صف منزلك المثالي في ثلاث كلمات'] = document.getElementById('idealHomeThreeWords').value;
    payload['ما أكثر شيء لا تريد رؤيته في التصميم؟'] = document.getElementById('dislikedDesignElements').value;
    payload['ما أهم شيء بالنسبة لك؟'] = document.getElementById('priority').value;
    payload['هل لديك صور مرجعية أو Pinterest أو Instagram Inspiration؟'] = document.getElementById('hasReferenceImages').value;

    try {
      console.log('Submitting payload to /api/submit:', payload);
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const resJson = await res.json();
      
      if (res.ok && resJson.success) {
        console.log('Submission successful! ID:', resJson.id);
        
        // Try to trigger background analysis if a key is already configured on the server
        fetch(`/api/submissions/${resJson.id}/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}) // Let server look in environment variables
        }).catch(err => console.log('Server-side auto-analysis skipped (API Key probably not set). Client can run manually in dashboard.'));
        
        // Render success page
        document.getElementById('submitLoading').style.display = 'none';
        document.getElementById('submitSuccess').style.display = 'block';
      } else {
        alert('حدث خطأ أثناء حفظ تفضيلاتك: ' + (resJson.error || 'عذرًا، يرجى المحاولة لاحقًا'));
        showStep(totalSteps - 1); // Return to final page
      }
    } catch (e) {
      console.error('Error submitting form:', e);
      alert('تعذر الاتصال بالخادم. يرجى التأكد من تشغيل خادم التطبيق.');
      showStep(totalSteps - 1);
    }
  }

  // Set up initial view controls
  updateControls();
});
