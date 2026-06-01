document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.getElementById('viewport');
  const cards = Array.from(viewport.querySelectorAll('.step-card'));
  const progressBar = document.getElementById('progressBar');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const navControls = document.getElementById('navControls');

  let currentStep = 0;
  const totalSteps = cards.length - 1; // Last step is success/loading screen

  // --- Translation Dictionary ---
  const stepHeaders = {
    1: {
      title: { ar: "معلومات الهوية والاتصال", en: "Identity & Contact Information" },
      desc: { ar: "يرجى كتابة معلومات الاتصال الأساسية لنتمكن من حفظ ملفك.", en: "Please write your basic contact information so we can save your profile." }
    },
    2: {
      title: { ar: "بيانات شريكة الحياة (الزوجة)", en: "Life Partner Details (Wife)" },
      desc: { ar: "هل ترغب في إضافة تفاصيل خاصة بأسلوب حياة الزوجة وتفضيلاتها التصميمية لملاءمتها في المنزل؟", en: "Would you like to add details about your wife's lifestyle and design preferences for the house?" }
    },
    3: {
      title: { ar: "بيانات الأطفال", en: "Children Details" },
      desc: { ar: "كم عدد الأطفال لديك لتهيئة غرفهم ومساحاتهم؟", en: "How many children do you have to configure their rooms and spaces?" }
    },
    4: {
      title: { ar: "بيانات العقار أو المشروع", en: "Property or Project Details" },
      desc: { ar: "تفاصيل العقار المطلوب تصميم ديكوراته وتأثيثه.", en: "Details of the property to be designed and furnished." }
    },
    5: {
      title: { ar: "الميزانية والجدول الزمني", en: "Budget & Timeline" },
      desc: { ar: "يساعدنا فهم الميزانية على توجيه خيارات التأثيث والمواد المناسبة.", en: "Understanding the budget helps us guide the selection of appropriate furnishing and materials." }
    },
    6: {
      title: { ar: "نمط الحياة والشخصية داخل المنزل", en: "Lifestyle & Personality at Home" },
      desc: { ar: "يرجى تحديد تفضيلات نمط الحياة والخصوصية.", en: "Please specify lifestyle and privacy preferences." }
    },
    7: {
      title: { ar: "البصرة الحسية للمكان", en: "Sensory Perception of Space" },
      desc: { ar: "يكشف هذا القسم عن حواسك وقراراتك اللاإرادية تجاه المواد والإضاءة والفراغات.", en: "This section reveals your senses and instinctive decisions about materials, lighting and spaces." }
    },
    8: {
      title: { ar: "علم نفس المساحة", en: "Psychology of Space" },
      desc: { ar: "يكشف هذا القسم عن كيف تعيش داخل الفراغ قبل أي قرار تشطيب.", en: "This section reveals how you live within a space before any finishing decisions." }
    },
    9: {
      title: { ar: "الهوية الثقافية للمنزل", en: "Cultural Identity of the Home" },
      desc: { ar: "هذا القسم يعكس الاحتياجات الثقافية والاجتماعية الخاصة بك.", en: "This section reflects your cultural and social needs for the home." }
    },
    10: {
      title: { ar: "الذوق والأسلوب التصميمي المفضّل", en: "Preferred Taste & Design Style" },
      desc: { ar: "يرجى اختيار التفضيلات العامة للألوان والمواد.", en: "Please choose general preferences for colors and materials." }
    },
    11: {
      title: { ar: "تفضيلات غرفة المعيشة (Living Room)", en: "Living Room Preferences" },
      desc: { ar: "يرجى تحديد متطلبات وتصميم غرفة المعيشة اليومية.", en: "Please specify the requirements and design of the daily living room." }
    },
    12: {
      title: { ar: "منطقة الاستقبال وتناول الطعام (Reception & Dining)", en: "Reception & Dining Area" },
      desc: { ar: "يرجى تحديد متطلبات الاستقبال والريسبشن وطاولة الطعام.", en: "Please specify the requirements for reception, salon, and dining." }
    },
    13: {
      title: { ar: "تفضيلات المطبخ (Kitchen)", en: "Kitchen Preferences" },
      desc: { ar: "يرجى تحديد تصميم وتفاصيل المطبخ.", en: "Please specify the design and details of the kitchen." }
    },
    14: {
      title: { ar: "غرفة النوم الرئيسية (Master Bedroom)", en: "Master Bedroom Preferences" },
      desc: { ar: "يرجى تحديد متطلبات غرفة النوم الرئيسية.", en: "Please specify the requirements for the master bedroom." }
    },
    15: {
      title: { ar: "الحمامات", en: "Bathrooms" },
      desc: { ar: "تفضيلات الحمام الرئيسي (En-suite) والحمامات الأخرى.", en: "Master bathroom (en-suite) and other bathroom preferences." }
    },
    16: {
      title: { ar: "مساحات وغرف إضافية بالمنزل", en: "Additional Spaces & Rooms in the House" },
      desc: { ar: "يرجى تحديد متطلباتك للمساحات الخدمية والترفيهية الإضافية.", en: "Please specify your requirements for additional service and entertainment spaces." }
    },
    17: {
      title: { ar: "الأسئلة النهائية والتطلعات الفنية", en: "Final Questions & Artistic Aspirations" },
      desc: { ar: "يرجى إخبارنا بنظرتك العامة لمنزلك المثالي.", en: "Please tell us your overall vision of your ideal home." }
    }
  };

  const fieldTranslations = {
    fullName: {
      label: { ar: "الاسم الكامل *", en: "Full Name *" },
      placeholder: { ar: "مثال: أحمد محمد", en: "e.g., John Doe" }
    },
    phone: {
      label: { ar: "رقم الجوال *", en: "Mobile Number *" },
      placeholder: { ar: "مثال: +20 100 000 0000", en: "e.g., +20 100 000 0000" }
    },
    email: {
      label: { ar: "البريد الإلكتروني", en: "Email Address" },
      placeholder: { ar: "example@email.com", en: "example@email.com" }
    },
    jobTitle: {
      label: { ar: "المسمى الوظيفي", en: "Job Title" },
      placeholder: { ar: "مثال: مهندس برمجيات", en: "e.g., Software Engineer" }
    },
    age: {
      label: { ar: "العمر", en: "Age" },
      placeholder: { ar: "مثال: 32", en: "e.g., 32" }
    },
    nationality: {
      label: { ar: "الجنسية", en: "Nationality" },
      placeholder: { ar: "مثال: مصري", en: "e.g., Egyptian" }
    },
    gender: {
      label: { ar: "الجنس *", en: "Gender *" },
      options: {
        "": { ar: "اختر...", en: "Select..." },
        "ذكر": { ar: "ذكر", en: "Male" },
        "أنثى": { ar: "أنثى", en: "Female" }
      }
    },
    maritalStatus: {
      label: { ar: "الحالة الاجتماعية *", en: "Marital Status *" },
      options: {
        "": { ar: "اختر...", en: "Select..." },
        "أعزب / عزباء": { ar: "أعزب / عزباء", en: "Single" },
        "متزوج / متزوجة": { ar: "متزوج / متزوجة", en: "Married" },
        "أرمل / أرملة": { ar: "أرمل / أرملة", en: "Widowed" }
      }
    },
    wifeName: {
      label: { ar: "اسم الزوجة", en: "Wife's Name" },
      placeholder: { ar: "الاسم", en: "Name" }
    },
    wifeAge: {
      label: { ar: "عمر الزوجة", en: "Wife's Age" },
      placeholder: { ar: "العمر", en: "Age" }
    },
    wifeWorks: {
      label: { ar: "هل تعمل الزوجة؟", en: "Does she work?" },
      options: {
        "لا": { ar: "لا تعمل", en: "Doesn't work" },
        "نعم": { ar: "تعمل", en: "Works" }
      }
    },
    wifeJob: {
      label: { ar: "طبيعة العمل أو المهنة", en: "Nature of work or occupation" },
      placeholder: { ar: "طبيعة العمل", en: "Nature of work" }
    },
    wifeNeedsOffice: {
      label: { ar: "هل تحتاج مكتب خاص في المنزل؟", en: "Does she need a private home office?" },
      options: {
        "لا": { ar: "لا تحتاج", en: "Doesn't need" },
        "نعم - مستقل": { ar: "نعم - مكتب مستقل", en: "Yes - independent office" },
        "نعم - مدمج": { ar: "نعم - ركن مدمج في غرفة النوم", en: "Yes - integrated corner in bedroom" }
      }
    },
    wifeColors: {
      label: { ar: "الألوان المفضلة للزوجة", en: "Wife's preferred colors" },
      placeholder: { ar: "الألوان المفضلة", en: "Preferred colors" }
    },
    wifeLifestyle: {
      label: { ar: "أسلوب حياتها وتفضيلاتها في المنزل", en: "Her lifestyle and home preferences" },
      placeholder: { ar: "مثال: تقضي وقتاً في القراءة، تفضل مطبخ مفتوح...", en: "e.g., spends time reading, prefers an open kitchen..." }
    },
    childrenCount: {
      placeholder: { ar: "عدد الأطفال", en: "Number of children" }
    },
    unitType: {
      label: { ar: "نوع الوحدة العقارية *", en: "Property Type *" },
      options: {
        "": { ar: "اختر...", en: "Select..." },
        "شقة": { ar: "شقة", en: "Apartment" },
        "استوديو": { ar: "استوديو", en: "Studio" },
        "فيلا": { ar: "فيلا", en: "Villa" },
        "تاون هاوس": { ar: "تاون هاوس", en: "Townhouse" },
        "بنتهاوس": { ar: "بنتهاوس", en: "Penthouse" },
        "دوبلكس": { ar: "دوبلكس", en: "Duplex" },
        "أخرى": { ar: "أخرى", en: "Other" }
      }
    },
    approxArea: {
      label: { ar: "مساحة العقار التقريبية (م2) *", en: "Approximate Property Area (m2) *" },
      placeholder: { ar: "مثال: 250 م2", en: "e.g., 250 sqm" }
    },
    projectAddress: {
      label: { ar: "عنوان المشروع / المدينة", en: "Project Address / City" },
      placeholder: { ar: "مثال: القاهرة، التجمع الخامس", en: "e.g., Cairo, Fifth Settlement" }
    },
    familyMembers: {
      label: { ar: "عدد أفراد الأسرة الذين سيعيشون بالمنزل", en: "Number of family members living in the house" },
      placeholder: { ar: "العدد", en: "Number" }
    },
    hasElderly: {
      label: { ar: "هل يوجد كبار سن مقيمون؟", en: "Are there elderly residents?" },
      options: {
        "لا": { ar: "لا", en: "No" },
        "نعم": { ar: "نعم", en: "Yes" }
      }
    },
    hasPets: {
      label: { ar: "هل يوجد حيوانات أليفة مقيمة بالمنزل؟", en: "Are there pets residing in the house?" },
      options: {
        "لا": { ar: "لا", en: "No" },
        "نعم": { ar: "نعم (قطط / كلاب / طيور)", en: "Yes (cats / dogs / birds)" }
      }
    },
    budget: {
      label: { ar: "الميزانية التقديرية (جنيه مصري) *", en: "Estimated Budget (EGP) *" },
      options: {
        "200,000 - 500,000 جنيه": { ar: "200,000 - 500,000 جنيه", en: "200,000 - 500,000 EGP" },
        "500,000 - 1,000,000 جنيه": { ar: "500,000 - 1,000,000 جنيه", en: "500,000 - 1,000,000 EGP" },
        "1,000,000 - 2,500,000 جنيه": { ar: "1,000,000 - 2,500,000 جنيه", en: "1,000,000 - 2,500,000 EGP" },
        "أكثر من 2.5 مليون جنيه": { ar: "أكثر من 2.5 مليون جنيه", en: "More than 2.5 million EGP" }
      }
    },
    budgetPriority: {
      label: { ar: "أولوية الميزانية", en: "Budget Priority" },
      options: {
        "الاقتصاد والتكلفة": { ar: "الاقتصاد وخفض التكاليف", en: "Economy & cost reduction" },
        "توازن القيمة والجودة": { ar: "توازن القيمة والجودة", en: "Balance of value and quality" },
        "الفخامة والجودة العالية بغض النظر عن التكلفة": { ar: "الجودة والفخامة المطلقة", en: "Absolute quality & luxury" }
      }
    },
    timeline: {
      label: { ar: "الجدول الزمني المفضل للتنفيذ", en: "Preferred Execution Timeline" },
      options: {
        "عاجل (1-2 أشهر)": { ar: "عاجل (1-2 أشهر)", en: "Urgent (1-2 months)" },
        "متوسط (3-6 أشهر)": { ar: "متوسط (3-6 أشهر)", en: "Medium (3-6 months)" },
        "مرن (أكثر من 6 أشهر)": { ar: "مرن (أكثر من 6 أشهر)", en: "Flexible (more than 6 months)" }
      }
    },
    deadline: {
      label: { ar: "تاريخ نهائي محدد (إن وجد)", en: "Specific Deadline (if any)" }
    },
    homeRole: {
      label: { ar: "ما هو الدور الرئيسي للمنزل بالنسبة لك؟", en: "What is the main role of the house for you?" },
      options: {
        "مكان للراحة والهدوء": { ar: "مكان للراحة والهدوء والخصوصية", en: "A place for rest, quiet, and privacy" },
        "تجمعات عائلية وحيوية": { ar: "تجمعات عائلية وأنشطة للأولاد", en: "Family gatherings and kids' activities" },
        "استقبال ضيوف ومناسبات باستمرار": { ar: "استقبال ضيوف ومناسبات اجتماعية", en: "Hosting guests and social events" },
        "مزيج متكامل من العمل والراحة والترفيه": { ar: "مزيج متكامل (عمل من المنزل، راحة، وترفيه)", en: "Integrated mix (work, rest, entertainment)" }
      }
    },
    wfh: {
      label: { ar: "هل تعمل من المنزل؟", en: "Do you work from home?" },
      options: {
        "لا": { ar: "لا", en: "No" },
        "نعم - عمل كامل": { ar: "نعم - عمل كامل", en: "Yes - full time" },
        "نعم - عمل جزئي": { ar: "نعم - عمل جزئي", en: "Yes - part time" }
      }
    },
    guests: {
      label: { ar: "معدل استقبال الضيوف", en: "Guest hosting frequency" },
      options: {
        "نادرًا": { ar: "نادرًا (مرة في الشهر أو أقل)", en: "Rarely (once a month or less)" },
        "أحيانًا": { ar: "أحيانًا (مرة في الأسبوع)", en: "Sometimes (once a week)" },
        "دائمًا": { ar: "دائمًا (أكثر من مرة في الأسبوع)", en: "Always (more than once a week)" }
      }
    },
    atmosphere: {
      label: { ar: "الأجواء العامة المفضلة", en: "Preferred general atmosphere" },
      options: {
        "هادئة وساكنة": { ar: "هادئة للغاية وساكنة", en: "Very quiet and peaceful" },
        "حيوية ومرحة": { ar: "حيوية ومرحة", en: "Lively and cheerful" },
        "دافئة ومريحة": { ar: "دافئة ومريحة (Cozy)", en: "Warm and cozy" },
        "متنوعة - كل غرفة لها جوها المختلف": { ar: "متنوعة - كل غرفة لها جوها المختلف", en: "Varied - each room has its own vibe" }
      }
    },
    spaceStyle: {
      label: { ar: "تفضيل توزيع المساحات", en: "Preferred space layout" },
      options: {
        "مفتوحة بالكامل Open Concept": { ar: "المساحات المفتوحة والشرحة", en: "Fully open concept spaces" },
        "مغلقة لخصوصية أكثر Separated": { ar: "مساحات مغلقة لمزيد من الخصوصية", en: "Closed spaces for more privacy" },
        "مختلطة (شبه مفتوحة) Semi-open": { ar: "مساحات مختلطة (فواصل بصرية مرنة)", en: "Semi-open concept (flexible layout)" }
      }
    },
    preferredStyle: {
      label: { ar: "الطراز المعماري المفضل *", en: "Preferred Architectural Style *" },
      options: {
        "": { ar: "اختر...", en: "Select..." },
        "Modern (حديث)": { ar: "Modern (حديث)", en: "Modern" },
        "Classic (كلاسيك)": { ar: "Classic (كلاسيك)", en: "Classic" },
        "Neo Classic (نيو كلاسيك)": { ar: "Neo Classic (نيو كلاسيك)", en: "Neo Classic" },
        "Contemporary (معاصر)": { ar: "Contemporary (معاصر)", en: "Contemporary" },
        "Minimalist (بسيط وعملي)": { ar: "Minimalist (بسيط وعملي)", en: "Minimalist" },
        "Japandi (ياباني إسكندنافي)": { ar: "Japandi (ياباني إسكندنافي)", en: "Japandi" },
        "Industrial (صناعي)": { ar: "Industrial (صناعي)", en: "Industrial" },
        "Boho (بوهيمي طبيعي)": { ar: "Boho (بوهيمي طبيعي)", en: "Boho" },
        "أخرى": { ar: "أخرى", en: "Other" }
      }
    },
    spatialFeel: {
      label: { ar: "نوعية الفراغات المفضلة", en: "Preferred Vibe of Spaces" },
      options: {
        "البسيطة والمريحة": { ar: "البسيطة والعملية", en: "Simple & practical" },
        "الغنية بالتفاصيل والنقوش": { ar: "الغنية بالتفاصيل والنقوش والمرايا", en: "Rich in details, patterns, & mirrors" },
        "الفندقية والفاخرة": { ar: "الفندقية والفاخرة (Luxury)", en: "Hotel-like & luxurious" }
      }
    },
    lighting: {
      label: { ar: "نوع الإضاءة المفضلة", en: "Preferred Lighting Type" },
      options: {
        "دافئة Warm White (3000K)": { ar: "دافئه", en: "Warm White (3000K)" },
        "طبيعية Natural White (4000K)": { ar: "طبيعية نهارية (مختلطة)", en: "Natural White (4000K)" },
        "بيضاء Cool White (6000K)": { ar: "بيضاء ناصعة", en: "Cool White (6000K)" }
      }
    },
    furnitureType: {
      label: { ar: "نوع الأثاث المفضل", en: "Preferred Furniture Type" },
      options: {
        "عملي ومريح": { ar: "عملي ومريح (Comfortable)", en: "Practical & comfortable" },
        "فاخر وثقيل": { ar: "فاخر كلاسيكي (Heavy Luxury)", en: "Luxurious & classic" },
        "مودرن وبسيط": { ar: "مودرن وبسيط وعصري", en: "Modern & simple" },
        "متعدد الاستخدام والتخزين": { ar: "ذكي ومتعدد الاستخدامات", en: "Smart & multi-functional" }
      }
    },
    favoriteColors: {
      label: { ar: "الألوان المفضلة (افصل بفاصلة)", en: "Preferred Colors (comma-separated)" },
      placeholder: { ar: "مثال: بيج، أخضر زيتي، كشمير", en: "e.g., beige, olive green, cashmere" }
    },
    dislikedColors: {
      label: { ar: "الألوان المرفوضة تماماً", en: "Disliked Colors" },
      placeholder: { ar: "مثال: أحمر فاقع، أصفر", en: "e.g., bright red, yellow" }
    },
    livingUse: {
      label: { ar: "الاستخدام الرئيسي للغرفة", en: "Main usage of the room" },
      options: {
        "تجمع عائلي يومي": { ar: "تجمع عائلي يومي", en: "Daily family gathering" },
        "مشاهدة التلفاز والألعاب": { ar: "مشاهدة التلفاز والسينما المنزلية", en: "Watching TV & home cinema" },
        "استقبال ضيوف مقربين": { ar: "استقبال ضيوف مقربين", en: "Hosting close guests" }
      }
    },
    livingCapacity: {
      label: { ar: "عدد الأشخاص المعتاد جلوسهم", en: "Usual seating capacity" },
      options: {
        "2-4": { ar: "2 إلى 4 أشخاص", en: "2 to 4 people" },
        "4-6": { ar: "4 إلى 6 أشخاص", en: "4 to 6 people" },
        "6-8": { ar: "6 إلى 8 أشخاص", en: "6 to 8 people" },
        "أكثر من 8": { ar: "أكثر من 8 أشخاص", en: "More than 8 people" }
      }
    },
    livingSeatingType: {
      label: { ar: "نوع الجلسة المفضلة", en: "Preferred seating type" },
      options: {
        "كنبة زاوية حرف L": { ar: "كنبة زاوية مريحة (L-shape)", en: "Comfortable L-shaped sectional sofa" },
        "كنبات منفصلة مودرن": { ar: "كنبات منفصلة عصرية", en: "Modern separate sofas" },
        "جلسة أرضية مطورة": { ar: "جلسة أرضية مطورة مودرن", en: "Modernized floor seating" },
        "كنبه سرير": { ar: "كنبه سرير (Sofa Bed)", en: "Sofa Bed" }
      }
    },
    livingTv: {
      label: { ar: "هل التلفزيون عنصر أساسي؟", en: "Is the TV an essential element?" },
      options: {
        "نعم": { ar: "نعم، تلفاز رئيسي مع ساوند بار", en: "Yes, main TV with soundbar" },
        "لا": { ar: "لا، الغرفة للحديث والاسترخاء فقط", en: "No, the room is for conversation & relaxation only" }
      }
    },
    livingExtra: {
      label: { ar: "متطلبات إضافية في غرفة المعيشة", en: "Additional requirements in the living room" },
      placeholder: { ar: "مثال: ركن للقهوة، مدفأة ديكورية، أرفف للكتب والنباتات", en: "e.g., coffee corner, decorative fireplace, shelves for books & plants" }
    },
    receptionStyle: {
      label: { ar: "طابع مجلس الاستقبال (الريسبشن)", en: "Vibe of the reception area" },
      options: {
        "رسمي وفاخر كلاسيك": { ar: "رسمي وفاخر كلاسيكي", en: "Formal & luxury classic" },
        "نيو كلاسيك أنيق": { ar: "نيو كلاسيك أنيق وعصري", en: "Elegant & modern Neo-Classic" },
        "عصري وبسيط جداً": { ar: "عصري وبسيط جداً (Minimal)", en: "Modern & very simple (Minimal)" },
        "متعدد الاستخدامات - يتحول بين الرسمي والعادي": { ar: "متعدد الاستخدامات - يتحول بين الرسمي والعادي", en: "Multi-use - switches between formal and casual" }
      }
    },
    diningUse: {
      label: { ar: "الاستخدام الغالب لمنطقة السفرة", en: "Predominant use of the dining area" },
      options: {
        "يومي للأسرة": { ar: "تناول الوجبات اليومية للأسرة", en: "Daily family meals" },
        "للعزومات والمناسبات فقط": { ar: "مخصص للعزومات والضيوف فقط", en: "Reserved for dinner parties & guests only" },
        "مشترك يومي ومناسبات": { ar: "مشترك (يومي وللضيوف)", en: "Combined (daily & guests)" }
      }
    },
    diningChairs: {
      label: { ar: "عدد كراسي طاولة الطعام", en: "Number of dining table chairs" },
      options: {
        "4": { ar: "4 كراسي", en: "4 chairs" },
        "6": { ar: "6 كراسي", en: "6 chairs" },
        "8": { ar: "8 كراسي", en: "8 chairs" },
        "10+": { ar: "10 كراسي أو أكثر", en: "10 chairs or more" }
      }
    },
    diningNeeds: {
      label: { ar: "متطلبات منطقة السفرة", en: "Dining area requirements" },
      options: {
        "طاولة طعام وكراسي فقط": { ar: "طاولة طعام وكراسي فقط", en: "Dining table & chairs only" },
        "بوفيه معلق للتقديم": { ar: "طاولة مع بوفيه (كونسول) للتقديم", en: "Table with buffet (console) for serving" },
        "إضاءة ثريا مميزة وتخزين": { ar: "بوفيه مع وحدة تخزين زجاجية مدمجة", en: "Buffet with built-in glass storage unit" }
      }
    },
    kitchenType: {
      label: { ar: "نوع المطبخ المفضل", en: "Preferred kitchen type" },
      options: {
        "مفتوح بالكامل (أمريكي)": { ar: "مفتوح بالكامل على المعيشة (أمريكي)", en: "Fully open to the living room (American style)" },
        "مغلق بالكامل": { ar: "مغلق بالكامل لعزل الروائح والخصوصية", en: "Fully closed to isolate odors and maintain privacy" },
        "شبه مفتوح (بزجاج أو فواصل)": { ar: "شبه مفتوح (فواصل زجاجية منزلقة)", en: "Semi-open (sliding glass partitions)" }
      }
    },
    kitchenUsage: {
      label: { ar: "معدل الطبخ والتحضير", en: "Cooking & preparation frequency" },
      options: {
        "نشاط يومي ثقيل": { ar: "طبخ يومي ثقيل ومستمر", en: "Heavy & continuous daily cooking" },
        "نشاط متوسط": { ar: "طبخ متوسط وأكلات خفيفة", en: "Medium cooking & light snacks" },
        "خفيف جداً": { ar: "خفيف جداً", en: "Very light (major reliance on fast food & reheating)" }
      }
    },
    kitchenNeeds: {
      label: { ar: "أهم العناصر المطلوبة في المطبخ (يمكن اختيار أكثر من خيار)", en: "Key elements required in the kitchen (multiple choice allowed)" },
      placeholder: { ar: "مثال: جزيرة في الوسط (Kitchen Island)، مخزن أغذية (Pantry)، أجهزة مدمجة (Built-in)، ركن للقهوة", en: "e.g., kitchen island, pantry, built-in appliances, coffee corner" }
    },
    masterVibe: {
      label: { ar: "الطابع الجمالي والجو العام", en: "Aesthetic vibe & atmosphere" },
      options: {
        "فندقي فاخر ومريح": { ar: "فندقي فاخر وهادئ", en: "Luxurious hotel-style & calm" },
        "بسيط وعملي جداً": { ar: "بسيط وعملي جداً (Minimal)", en: "Simple & very practical (Minimal)" },
        "دافئ ورومانسي بألوان داكنة": { ar: "دافئ وحميمي بألوان دافئة", en: "Warm & intimate with warm colors" }
      }
    },
    masterStorage: {
      label: { ar: "انواع التخزين", en: "Storage Type" },
      options: {
        "": { ar: "اختر...", en: "Select..." },
        "دولاب": { ar: "دولاب", en: "Wardrobe" },
        "دريسنج روم": { ar: "دريسنج روم", en: "Dressing Room" }
      }
    },
    masterLighting: {
      label: { ar: "تفضيل الإضاءة في غرفة النوم", en: "Preferred bedroom lighting" },
      options: {
        "خافتة وغير مباشرة للراحة": { ar: "إضاءة خافتة غير مباشرة (مخفية)", en: "Dim indirect lighting (hidden)" },
        "متوسطة ومتنوعة": { ar: "إضاءة متوسطة متنوعة (أباجورات وجبس)", en: "Medium varied lighting (lamps & gypsum)" },
        "قوية وواضحة": { ar: "إضاءة قوية وساطعة", en: "Strong & bright lighting" }
      }
    },
    masterNeeds: {
      label: { ar: "متطلبات إضافية لغرفة الماستر", en: "Additional requirements for the master room" },
      placeholder: { ar: "مثال: غرفة ملابس مستقلة (Walk-in Closet)، ركن للقراءة، تسريحة مكياج مميزة، شاشة تلفاز معلقة", en: "e.g., walk-in closet, reading corner, vanity makeup table, wall-mounted TV screen" }
    },
    roomEntrance: {
      label: { ar: "منطقة المدخل (Entrance)", en: "Entrance Area" },
      options: {
        "مفتوح على الصالة": { ar: "مفتوح على الصالة", en: "Open to the reception hall" },
        "فاصل بصري مع كونسول ومرايا": { ar: "بفاصل بصري مع كونسول وأحذية", en: "Visual partition with console & shoe storage" },
        "مستقل ومفصول بالكامل": { ar: "مستقل ومفصول بالكامل", en: "Completely independent and separated" }
      }
    },
    roomLaundry: {
      label: { ar: "غرفة الغسيل (Laundry Room)", en: "Laundry Room" },
      options: {
        "لا أحتاج مستقلة": { ar: "لا أحتاج مستقلة (توضع بالحمامات)", en: "Do not need a separate room (placed in bathrooms)" },
        "أحتاج غرفة غسيل مستقلة": { ar: "نعم، أحتاج غرفة غسيل وتخزين مستقلة", en: "Yes, I need a separate laundry & storage room" }
      }
    },
    roomOffice: {
      label: { ar: "المكتب المنزلي (Home Office)", en: "Home Office" },
      options: {
        "لا أحتاج": { ar: "لا أحتاج", en: "Do not need" },
        "أحتاج مكتب منزلي مستقل": { ar: "نعم، أحتاج مكتب منزلي مستقل وعازل للصوت", en: "Yes, I need a separate soundproofed home office" },
        "ركن مكتب في غرفة أخرى": { ar: "ركن مكتب صغير في غرفة المعيشة/النوم", en: "Small office desk in the living/bedroom" }
      }
    },
    roomEntertainment: {
      label: { ar: "الجيم والترفيه (Home Gym/Cinema)", en: "Home Gym & Entertainment" },
      options: {
        "لا أحتاج": { ar: "لا أحتاج", en: "Do not need" },
        "أحتاج ركن رياضي صغير": { ar: "ركن رياضي صغير (Gym) في المنزل", en: "Small athletic gym corner at home" },
        "أحتاج صالة سينما منزلية مجهزة": { ar: "صالة سينما منزلية مستقلة (Cinema)", en: "Independent home cinema room" },
        "أحتاج صالة ألعاب ترفيهية (Playstation/Billiard)": { ar: "صالة ألعاب ترفيهية متكاملة", en: "Fully integrated gaming room (Playstation/Billiard)" }
      }
    },
    roomTerrace: {
      label: { ar: "التراس / البلكونة / الرووف الخارجي", en: "Terrace / Balcony / Outdoor Roof" },
      placeholder: { ar: "مثال: جلسة خارجية مع مظلة ونباتات، منطقة باربيكيو (BBQ)", en: "e.g., outdoor seating with canopy & plants, BBQ area" }
    },
    guestFeel: {
      label: { ar: "كيف تريد أن يشعر الضيف عند دخول منزلك؟", en: "How do you want a guest to feel when entering your home?" },
      placeholder: { ar: "مثال: الفخامة، الاتساع، الدفء والترحيب", en: "e.g., luxury, spaciousness, warmth & welcoming" }
    },
    homeFeel: {
      label: { ar: "كيف تريد أن تشعر أنت وعائلتك داخل منزلك؟", en: "How do you and your family want to feel inside your home?" },
      placeholder: { ar: "مثال: الراحة التامة، السكينة والاسترخاء", en: "e.g., ultimate comfort, serenity & relaxation" }
    },
    idealHomeThreeWords: {
      label: { ar: "صف منزلك المثالي في ثلاث كلمات", en: "Describe your ideal home in three words" },
      placeholder: { ar: "مثال: هادئ، عملي، شرح", en: "e.g., quiet, practical, spacious" }
    },
    dislikedDesignElements: {
      label: { ar: "ما هو أكثر شيء لا تريد رؤيته في التصميم؟", en: "What is the thing you least want to see in the design?" },
      placeholder: { ar: "مثال: كثرة الألوان، الجبسيات الكثيرة، الإضاءة البيضاء", en: "e.g., too many colors, excessive gypsum, cool white lighting" }
    },
    priority: {
      label: { ar: "ما هي الأولوية الكبرى بالنسبة لك؟", en: "What is your main priority?" },
      options: {
        "الجمال والفخامة": { ar: "الجمال والفخامة البصرية", en: "Visual beauty & luxury" },
        "العملية وتوزيع المساحة": { ar: "العملية والراحة وتوزيع المساحة", en: "Functionality, comfort, & spatial layout" },
        "سهولة الصيانة والتنظيف": { ar: "سهولة الصيانة والتنظيف على المدى البعيد", en: "Ease of maintenance & cleaning in the long run" },
        "الاستدامة والأنظمة الذكية": { ar: "الاستدامة والأنظمة المنزلية الذكية", en: "Sustainability & smart home systems" }
      }
    },
    hasReferenceImages: {
      label: { ar: "هل لديك صور مرجعية أو Pinterest ملهمة؟", en: "Do you have reference images or Pinterest inspiration?" },
      options: {
        "لا": { ar: "لا، اعتمد بالكامل على مصمميكم", en: "No, rely fully on your designers" },
        "نعم": { ar: "نعم، لدي صور وسأشاركها معكم لاحقاً", en: "Yes, I have photos and will share them later" }
      }
    },

    // --- Step 5 new fields ---
    investmentHorizon: {
      label: { ar: "كيف تنظر لتجهيز منزلك؟", en: "How do you view furnishing your home?" },
      options: {
        "استثمار طويل الأمد": { ar: "استثمار طويل الأمد - أريد خامات تدوم عشرين سنة أو أكثر", en: "Long-term investment - materials lasting 20+ years" },
        "قرار جمالي حالي": { ar: "قرار جمالي حالي - قد أجدد بعد خمس إلى عشر سنوات", en: "Current aesthetic decision - may renovate in 5-10 years" },
        "أريد مرونة التغيير بتكلفة معقولة": { ar: "أريد مرونة التغيير بتكلفة معقولة - أفضل الحلول القابلة للتحديث", en: "Flexibility to change at reasonable cost - updatable solutions" },
        "لا أفكر في ذلك": { ar: "لا أفكر في ذلك - أريد ما يناسبني الآن فقط", en: "Not thinking about it - just what suits me now" }
      }
    },
    budgetPhasing: {
      label: { ar: "إذا وجدت أن الميزانية لا تكفي للتنفيذ الكامل دفعة واحدة، ماذا تفضل؟", en: "If the budget isn't enough for full execution at once, what do you prefer?" },
      options: {
        "أنفذ الأهم أولاً في مراحل": { ar: "أنفذ الأهم أولاً وأترك الباقي في مراحل لاحقة", en: "Execute the most important first, then the rest in phases" },
        "أخفض مستوى الخامات للتنفيذ الكامل": { ar: "أخفض مستوى الخامات في كل الغرف لتنفيذ الكامل دفعة واحدة", en: "Lower material level across all rooms for full execution at once" },
        "أرفع الميزانية إذا لزم": { ar: "أرفع الميزانية إذا لزم - لا أقبل حلولاً وسطى", en: "Increase budget if needed - no compromises" },
        "أقلص عدد الغرف المنفذة": { ar: "أقلص عدد الغرف المنفذة وأنجز المبنى بمستوى عالٍ", en: "Reduce rooms executed but finish them at a high level" }
      }
    },
    localVsImported: {
      label: { ar: "هل تثق في المواد المصرية عالية الجودة مقارنةً بالمستوردة؟", en: "Do you trust high-quality Egyptian materials vs. imported?" },
      options: {
        "أفضل المستورد حتى لو ارتفعت الميزانية": { ar: "أفضل المستورد حتى لو ارتفعت الميزانية - الجودة والاسم أول", en: "Prefer imported even if budget rises - quality & brand first" },
        "أقبل المحلي بشرط المستوى البصري": { ar: "أقبل المحلي بشرط أن يكون بمستوى بصري ومساوٍ للمستورد", en: "Accept local if it matches imported visual quality" },
        "أفضل المحلي وأدعمه": { ar: "أفضل المحلي - أثق في الصناعة المصرية وأدعم المنتج المحلي", en: "Prefer local - trust Egyptian industry and support it" },
        "لا يهمني المصدر": { ar: "لا يهمني المصدر - يهمني الجودة الفعلية والنتيجة النهائية فقط", en: "Source doesn't matter - only actual quality and final result" }
      }
    },

    // --- Step 6 new fields ---
    orgAndOrder: {
      label: { ar: "كيف تتعامل مع النظام والترتيب في حياتك اليومية؟", en: "How do you deal with order and tidiness in daily life?" },
      options: {
        "أحتاج من كل شيء في مكانه": { ar: "أحتاج من كل شيء في مكانه - الفوضى تربكني نفسياً ولا تريحني", en: "Everything in its place - clutter unsettles me" },
        "أحب التنظيم ولكن لا أتوتر من بعض الفوضى": { ar: "أحب التنظيم ولكن لا أتوتر من بعض الفوضى العرضية", en: "Like organization but don't stress about occasional mess" },
        "الفوضى الإبداعية مريحة": { ar: "الفوضى الإبداعية مريحة - البيوت المرتبة جداً تبدو باردة لي", en: "Creative mess is comfortable - overly tidy homes feel cold" }
      }
    },
    homeEnergySource: {
      label: { ar: "ما الذي يمنحك الطاقة عند عودتك للمنزل؟", en: "What gives you energy when you return home?" },
      options: {
        "الهدوء التام والإضاءة الخافتة": { ar: "الهدوء التام والإضاءة الخافتة", en: "Complete quiet and dim lighting" },
        "نشاط الأسرة وأصوات المنزل الحلوة": { ar: "نشاط الأسرة وأصوات المنزل الحلوة", en: "Family activity and the sounds of home" },
        "تغيير الجو - موسيقى وروائح وإضاءة متنوعة": { ar: "تغيير الجو - موسيقى، روائح، إضاءة متنوعة", en: "Changing the atmosphere - music, scents, varied lighting" },
        "الطعام - العودة للمطبخ أو طاولة الأكل": { ar: "الطعام - العودة للمطبخ أو طاولة الأكل", en: "Food - heading to the kitchen or dining table" }
      }
    },
    valueConflict: {
      label: { ar: "إذا اضطررت للاختيار، ماذا تختار؟", en: "If forced to choose, what would you pick?" },
      options: {
        "جمال صعب الحفاظ عليه يمنحني إحساساً بالرقي": { ar: "جمال صعب الحفاظ عليه لكن يمنحني إحساساً بالرقي من يوم لآخر", en: "Hard-to-maintain beauty that gives a sense of elegance daily" },
        "بساطة وتقنية سهلة الصيانة تدوم سنوات": { ar: "بساطة وتقنية سهلة الصيانة تدوم سنوات دون تعب أو تكلفة إضافية", en: "Simple, low-maintenance tech that lasts years without extra cost" }
      }
    },

    // --- Step 7 new fields (Sensory Perception) ---
    naturalLightImpact: {
      label: { ar: "كيف يؤثر الضوء الطبيعي على شعورك داخل المنزل؟", en: "How does natural light affect how you feel at home?" },
      options: {
        "الضوء الطبيعي ضروري طول اليوم": { ar: "الضوء الطبيعي ضروري في طول اليوم - الغرف المعتمة تضيق صدري", en: "Natural light essential all day - dark rooms suffocate me" },
        "أفضل ضوءاً طبيعياً معتدلاً مع إمكانية التحكم": { ar: "أفضل ضوءاً طبيعياً معتدلاً مع إمكانية التحكم فيه بالستائر", en: "Prefer moderate natural light with curtain control" },
        "أفضل التحكم الكامل بالإضاءة": { ar: "أفضل التحكم الكامل بالإضاءة وأشعر بالراحة في الجو الخامت", en: "Prefer full lighting control and feel comfortable in dim ambience" }
      }
    },
    firstNoticedInSpace: {
      label: { ar: "ما الذي يلفت نظرك أول ما تدخل أي مكان؟", en: "What do you notice first when entering any space?" },
      options: {
        "الألوان وتناسقها مع بعضها": { ar: "الألوان وتناسقها مع بعضها", en: "Colors and their harmony" },
        "المواد والخامات - الخشب والحجر والأقمشة": { ar: "المواد والخامات - الخشب والحجر والأقمشة", en: "Materials & textures - wood, stone, fabrics" },
        "التناسب والارتفاعات والتوازن البصري": { ar: "التناسب والارتفاعات والتوازن البصري للفراغ", en: "Proportions, heights and visual balance of the space" },
        "الضوء وكيف يسقط ويتحرك على الأسطح": { ar: "الضوء وكيف يسقط ويتحرك على الأسطح", en: "Light and how it falls and moves across surfaces" }
      }
    },
    annoyingAtEntrance: {
      label: { ar: "ما الذي يزعجك فوراً عند أول دخولك أي مكان؟", en: "What immediately bothers you when entering any space?" },
      options: {
        "الفوضى البصرية لكثرة التفاصيل المتنافسة": { ar: "الفوضى البصرية لكثرة التفاصيل المتنافسة", en: "Visual clutter from too many competing details" },
        "البرود وغياب الدفء والمشاعر الإنسانية": { ar: "البرود وغياب الدفء والمشاعر الإنسانية", en: "Coldness and absence of warmth and human feeling" },
        "الإضاءة الصاخبة أو الساطعة جداً": { ar: "الإضاءة الصاخبة أو الساطعة جداً", en: "Harsh or overly bright lighting" },
        "الروائح الكيميائية وضعف التهوية": { ar: "الروائح الكيميائية وضعف التهوية", en: "Chemical smells and poor ventilation" },
        "الأثاث الجامد والمقررات الضيقة التي تعيق الحرية": { ar: "الأثاث الجامد والمقررات الضيقة التي تعيق الحرية", en: "Rigid furniture and narrow layouts that restrict movement" }
      }
    },
    materialSatisfaction: {
      label: { ar: "عند لمس الأثاث والموروشات، ما الذي يشعرك بالرضا والجودة؟", en: "When touching furniture, what makes you feel satisfaction and quality?" },
      options: {
        "ناعم وطري جداً - المخمل والكتان والأقمشة الثقيلة": { ar: "ناعم وطري جداً - المخمل والكتان والأقمشة الثقيلة", en: "Very soft - velvet, linen, heavy fabrics" },
        "بارد وصلب بشكل راقٍ - الرخام والمعادن والزجاج": { ar: "بارد وصلب بشكل راقٍ - الرخام والمعادن والزجاج", en: "Cool and solid in a refined way - marble, metals, glass" },
        "دافئ وله روح - الخشب الطبيعي والحجر الخام والطين": { ar: "دافئ وله روح - الخشب الطبيعي والحجر الخام والطين", en: "Warm and soulful - natural wood, raw stone, clay" },
        "لا يهمني المواد بقدر ما يهمني الشكل والألوان": { ar: "لا يهمني المواد بقدر ما يهمني الشكل والألوان", en: "Materials don't matter as much as shape and colors" }
      }
    },

    // --- Step 8 new fields (Psychology of Space) ---
    freeSpaceNeed: {
      label: { ar: "كيف تصف حاجتك للمساحة الحرة في حياتك؟", en: "How would you describe your need for open space?" },
      options: {
        "أحتاج فراغاً كبيراً حولي - الأماكن المنظمة تربكني": { ar: "أحتاج فراغاً كبيراً حولي - الأماكن المنظمة تربكني ولا تريحني", en: "Need lots of open space - cramped places unsettle me" },
        "لا أهتم بالاتساع بقدر ما أهتم بالدفء والإحساس الحنوني": { ar: "لا أهتم بالاتساع بقدر ما أهتم بالدفء والإحساس الحنوني", en: "Don't care about spaciousness, care more about warmth" },
        "أحب الاتساع في الفراغات العامة والخصوصية في فراغات النوم": { ar: "أحب الاتساع في الفراغات العامة والخصوصية في فراغات النوم", en: "Like openness in public spaces and privacy in bedrooms" },
        "لا أفكر في ذلك - المهم أن كل شيء في متناول اليد": { ar: "لا أفكر في ذلك - المهم أن كل شيء متناسل في متناول اليد", en: "Don't think about it - just need everything within reach" }
      }
    },
    ceilingHeightFeel: {
      label: { ar: "ما هو إحساسك الجمالي بارتفاع السقف؟", en: "What is your aesthetic feeling about ceiling height?" },
      options: {
        "سقف عالٍ يمنحني شعوراً بالحرية والرقي": { ar: "سقف عالٍ يمنحني شعوراً بالحرية والرقي", en: "High ceiling gives a sense of freedom and elegance" },
        "ارتفاع معتدل أكثر دفئاً وأريح للأسرة": { ar: "ارتفاع معتدل - أكثر دفئاً وأريح للأسرة", en: "Moderate height - warmer and more comfortable for the family" },
        "لا يهمني الارتفاع - أهتم بجودة تصميم السقف": { ar: "لا يهمني الارتفاع - أهتم بجودة تصميم السقف فعلاً", en: "Height doesn't matter - care about ceiling design quality" },
        "أفضل أسقفاً منخفضة في النوم وعالية في الصالة": { ar: "أفضل أسقفاً منخفضة حنينية في غرف النوم وعالية في الصالة", en: "Prefer lower ceilings in bedrooms, higher in living areas" }
      }
    },
    homeExteriorRelation: {
      label: { ar: "كيف تنظر للعلاقة بين منزلك والعالم الخارجي؟", en: "How do you view the relationship between your home and the outside world?" },
      options: {
        "أريد تواصلاً بصرياً مستمراً مع الخارج": { ar: "أريد تواصلاً بصرياً مستمراً مع الخارج - نوافذ كبيرة وشرفات مفتوحة", en: "Want continuous visual connection outside - large windows, open balconies" },
        "الخصوصية أول - أفضل العزل الكامل": { ar: "الخصوصية أول - أفضل العزل الكامل عن الجيران والشارع", en: "Privacy first - prefer full isolation from neighbors and street" },
        "تواصل نظري وحنين - نوافذ عالية وزجاج يحفظ الخصوصية": { ar: "تواصل نظري وحنين - نوافذ عالية أو زجاج يعالج ويحفظ الخصوصية", en: "Visual connection with privacy - high windows or privacy glass" },
        "يختلف من غرفة لأخرى": { ar: "يختلف من غرفة لأخرى - الصالة أكثر انفتاحاً وغرف النوم غنية تماماً", en: "Varies by room - living area more open, bedrooms more private" }
      }
    },
    aestheticCorner: {
      label: { ar: "ما هي زاويتك الجمالية في المنزل؟", en: "What is your favourite aesthetic corner in the home?" },
      options: {
        "كرسي فردي بجانب نافذة أو مصدر ضوء طبيعي": { ar: "كرسي فردي بجانب نافذة أو مصدر ضوء طبيعي", en: "Single armchair next to a window or natural light source" },
        "ركن أريكة علوي دائم في الصالة": { ar: "ركن أريكة علوي دائم في الصالة", en: "A permanent corner sofa spot in the living room" },
        "طاولة الطعام - أشعر بالانتهاء حين أجلس قريباً من الطعام": { ar: "طاولة الطعام - أشعر بالانتهاء حين أجلس قريباً من الطعام", en: "Dining table - feel complete when seated near food" },
        "المطبخ - أشعر بالانتهاء حول أكل قريب من الطعام": { ar: "المطبخ - أشعر بالانتهاء حين أكون قريباً من الطعام", en: "Kitchen - feel complete when close to the food" },
        "لا أجذب لزاوية بعينها - أتحرك بحرية في كل الفراغات": { ar: "لا أجذب لزاوية بعينها - أتحرك بحرية في كل الفراغات", en: "Not drawn to any particular corner - move freely through all spaces" }
      }
    },

    // --- Step 9 new fields (Cultural Identity) ---
    guestRoomFunction: {
      label: { ar: "كيف تعرّف وظيفة مجلس الاستقبال في منزلك؟", en: "How do you define the function of the reception room?" },
      options: {
        "هناك رسمي مخصص للضيوف فقط - لا تدخله الأسرة يومياً": { ar: "هناك رسمي مخصص للضيوف فقط - لا تدخله الأسرة يومياً", en: "Formal space for guests only - family doesn't use it daily" },
        "هناك تعدد الاستخدام - يستخدمونه يومياً ويستقبل الضيوف": { ar: "هناك تعدد الاستخدام - يستخدمونه يومياً ويستقبل الضيوف أيضاً", en: "Multi-use - used daily and also receives guests" },
        "لا أهتم بتخصيص مجلس رسمي - الضيوف يجلسون مع الأسرة": { ar: "لا أهتم بتخصيص مجلس رسمي - الضيوف يجلسون مع الأسرة", en: "Don't care for a formal reception - guests sit with family" },
        "أحتاج مجلسين للتفصيل - مجلس رجال ومجلس نساء أو الأسرة": { ar: "أحتاج مجلسين للتفصيل: مجلس رجال ومجلس نساء أو الأسرة", en: "Need two separate reception areas: men's and women's/family" }
      }
    },
    prayerSpaceNeed: {
      label: { ar: "هل تحتاج إلى مكان مخصص للصلاة داخل المنزل؟", en: "Do you need a dedicated prayer space inside the home?" },
      options: {
        "لا، أصلي في أي مكان": { ar: "لا، أصلي في أي مكان", en: "No, I pray anywhere" },
        "نعم، أحتاج ركناً صغيراً للصلاة في غرفة النوم الرئيسية": { ar: "نعم، أحتاج ركناً صغيراً للصلاة في غرفة النوم الرئيسية", en: "Yes, a small prayer corner in the master bedroom" },
        "نعم، أحتاج غرفة صلاة مستقلة أو مصلى داخل المنزل": { ar: "نعم، أحتاج غرفة صلاة مستقلة أو مصلى داخل المنزل", en: "Yes, an independent prayer room or musalla inside the home" },
        "أريد توجيه القبلة يؤخذ في الاعتبار عند تصميم الغرف": { ar: "أريد توجيه القبلة يؤخذ في الاعتبار عند تصميم الغرف", en: "Want qibla direction considered when designing rooms" }
      }
    },
    familyCommonAreaUse: {
      label: { ar: "كيف يستخدم أفراد الأسرة الفراغات العامة في المنزل؟", en: "How does your family use the common areas?" },
      options: {
        "الكل يجتمع في مكان واحد - يريد فراغاً وحيداً وللعائلة": { ar: "الكل يجتمع في مكان واحد - يريد فراغاً وحيداً وللعائلة", en: "Everyone gathers in one place - one shared family space" },
        "كل فرد يحتاج خصوصيته - يريد فراغات معيشة منفردة": { ar: "كل فرد يحتاج خصوصيته - يريد فراغات معيشة منفردة عزولها", en: "Each person needs privacy - separate individual living spaces" },
        "الأطفال يضاعون والكبار يضاعون منفصل": { ar: "الأطفال لهم فضاؤهم والكبار لهم فضاؤهم المنفصل", en: "Children have their space and adults have their separate space" },
        "يختلف حسب الوقت - النهار متاح والليل خاص": { ar: "يختلف حسب الوقت - النهار الأسرة متاحة والليل خاص بكل فرد", en: "Varies by time - daytime shared, nighttime private per person" }
      }
    },
    hostingNature: {
      label: { ar: "ما طبيعة استضافتك للضيوف في الغالب؟", en: "What is the nature of your guest hosting?" },
      options: {
        "عزومات رسمية كبيرة في المناسبات والأعياد": { ar: "عزومات رسمية كبيرة في المناسبات والأعياد", en: "Large formal gatherings for occasions and holidays" },
        "زيارات أسرية متكررة وغير رسمية": { ar: "زيارات أسرية متكررة وغير رسمية", en: "Frequent informal family visits" },
        "ضيوف أعمال وزملاء يستوجب الاستقبال الكامل": { ar: "ضيوف أعمال وزملاء يستوجب الاستقبال الكامل", en: "Business guests and colleagues requiring full hospitality" },
        "نادراً ما أستضيف - المنزل مساحة خاصة للأسرة فقط": { ar: "نادراً ما أستضيف - المنزل مساحة خاصة للأسرة فقط", en: "Rarely host - home is a private family space only" }
      }
    },

    // --- Step 10 new fields (Design Style) ---
    decorPreference: {
      label: { ar: "كيف تفضل وجود الديكورات والتحف داخل المنزل؟", en: "How do you prefer decor and collectibles in the home?" },
      options: {
        "أحب التحف والأعمال الفنية - جزء من هويتي وقصتي": { ar: "أحب التحف والأعمال الفنية - جزء من هويتي وقصتي", en: "Love art and collectibles - part of my identity and story" },
        "أفضل الحد الأدنى من الديكورات - الأقل دائماً أجمل": { ar: "أفضل الحد الأدنى من الديكورات - الأقل دائماً أجمل وأرقى", en: "Prefer minimal decor - less is always more elegant" },
        "أفضل صور العائلة والمحطات الشخصية": { ar: "أفضل صور العائلة والمحطات الشخصية على أي ديكور آخر", en: "Prefer family photos and personal milestones over any other decor" },
        "أحب التفاصيل الدقيقة المدروسة بمستوى واضح بصرياً": { ar: "أحب التفاصيل الدقيقة المدروسة ولكن في مستوى واضح بصرياً", en: "Love carefully selected details but at a clear visual level" }
      }
    },
    idealFurnitureDesc: {
      label: { ar: "أي من هذه الأوصاف أقرب لأثاثك المثالي؟", en: "Which description is closest to your ideal furniture?" },
      options: {
        "قطعة توليفية فنية موحدة تعبر عن صاحبها": { ar: "قطعة توليفية فنية موحدة تشكيلياً تعبر عن صاحبها", en: "A unified artistic statement piece that expresses its owner" },
        "أثاث يندمج في الفراغ بذكاء دون أن يطغى": { ar: "أثاث يندمج في الفراغ بذكاء دون أن يطغى أو يسيطر", en: "Furniture that blends into the space intelligently without dominating" },
        "أثاث يخدم وظيفته بامتياز والجمال في المرتبة الثانية": { ar: "أثاث يخدم وظيفته بامتياز ثم يأتي جمالياً في المرتبة الثانية", en: "Furniture that excels functionally, then comes beauty second" },
        "أثاث متعدد الاستخدامات يتحول مع احتياجات الأسرة": { ar: "أثاث متعدد الاستخدامات ويتحول مع احتياجات الأسرة", en: "Multi-use furniture that adapts to family needs" }
      }
    },
    patternTolerance: {
      label: { ar: "كيف تتعامل مع الأنماط والتكرار البصري (Patterns) في التصميم؟", en: "How do you deal with patterns and visual repetition in design?" },
      options: {
        "أحب الأنماط المنتظمة الهندسية - تريحني بصرياً": { ar: "أحب الأنماط المنتظمة الهندسية - تريحني بصرياً", en: "Love regular geometric patterns - they comfort me visually" },
        "أفضل قطعة واحدة مميزة بنقط وباقي المساحة ظل": { ar: "أفضل قطعة واحدة مميزة بنقط وباقي المساحة ظل", en: "Prefer one statement patterned piece, rest in neutral shadow" },
        "لا أحب الأنماط - أفضل المساحات الظلية الخالية": { ar: "لا أحب الأنماط - أفضل المساحات الظلية الخالية من التكرار", en: "Don't like patterns - prefer plain neutral surfaces" },
        "أقبل الأنماط النباتية والعضوية الطبيعية فقط": { ar: "أقبل الأنماط النباتية والعضوية الطبيعية فقط", en: "Accept only botanical and natural organic patterns" }
      }
    },

    // --- Step 11 new fields (Living Room) ---
    livingRoomFeel: {
      label: { ar: "ما الشعور الذي تريده حين تجلس في غرفة معيشتك؟", en: "What feeling do you want when sitting in your living room?" },
      options: {
        "الراحة والاسترخاء التام - كأنك في فندق فاخر": { ar: "الراحة والاسترخاء التام وكأنك في فندق فاخر", en: "Complete rest and relaxation as if in a luxury hotel" },
        "الدفء والحنينة - كأنك في حضن العائلة": { ar: "الدفء والحنينة وكأنك في حضن العائلة", en: "Warmth and nostalgia as if in the family's embrace" },
        "الحيوية والنشاط - يشحن طاقتك": { ar: "الحيوية والنشاط - يشحن طاقتك", en: "Liveliness and energy - charges you up" },
        "الهدوء والنظافة البصرية - هناك يفصل ذهنك": { ar: "الهدوء والنظافة البصرية - هناك يفصل ذهنك", en: "Calm and visual cleanliness - where your mind switches off" }
      }
    },
    livingRoomBestTime: {
      label: { ar: "ما هو الوقت الأول الذي تفضله في غرفة المعيشة؟", en: "What is your favourite time in the living room?" },
      options: {
        "الصباح الباكر بهدوء قبل طقوس الأسرة": { ar: "الصباح الباكر بهدوء قبل طقوس الأسرة", en: "Early quiet morning before family routines" },
        "المساء مع الأسرة في جو دائم ومجتمع": { ar: "المساء مع الأسرة في جو دائم ومجتمع", en: "Evening with family in a lively communal atmosphere" },
        "الليل الهادئ بعد نوم الأطفال - وقت الزوجين": { ar: "الليل الهادئ بعد نوم الأطفال - وقت الزوجين", en: "Quiet night after kids sleep - couple's time" },
        "الاستقبال والضيافة - هذا هو وقتنا الرئيسي": { ar: "الاستقبال والضيافة - هذا هو وقتنا الرئيسي", en: "Hosting and hospitality - this is our main time" }
      }
    },
    livingRoomPainPoint: {
      label: { ar: "ما أكثر شيء يزعجك في غرفة المعيشة الآن؟", en: "What bothers you most about your current living room?" },
      options: {
        "ضيق المساحة والإحساس بالاكتظاظ": { ar: "ضيق المساحة والإحساس بالاكتظاظ", en: "Small space and feeling of overcrowding" },
        "سوء الإضاءة وغياب الأجواء المناسبة": { ar: "سوء الإضاءة وغياب الأجواء المناسبة", en: "Poor lighting and lack of proper ambiance" },
        "الفوضى وصعوبة الترتيب والتنظيم": { ar: "الفوضى وصعوبة الترتيب والتنظيم", en: "Clutter and difficulty organizing and tidying" },
        "الغرفة لا تعكس شخصيتي وذوقي": { ar: "الغرفة لا تعكس شخصيتي وذوقي", en: "The room doesn't reflect my personality and taste" },
        "مشكلة في التوزيع - الأثاث لا يستغل المساحة بشكل جيد": { ar: "مشكلة في التوزيع - الأثاث لا يستغل المساحة بشكل جيد", en: "Layout issue - furniture doesn't utilize the space well" }
      }
    },

    // --- Step 13 new fields (Kitchen) ---
    kitchenFamilyRelation: {
      label: { ar: "كيف تصل عائلتك بالمطبخ؟", en: "How does your family relate to the kitchen?" },
      options: {
        "المطبخ متعة وإبداع - أريد مطبخاً يشجعني ويشجعهم": { ar: "المطبخ متعة وإبداع - أريد مطبخاً يشجعني ويشجعهم", en: "Kitchen is fun and creative - want one that inspires us" },
        "المطبخ واجب وظيفي - أريد مطبخاً فعالاً سريع التنظيف": { ar: "المطبخ واجب وظيفي - أريد مطبخاً فعالاً سريع التنظيف", en: "Kitchen is a functional duty - want an efficient, easy-to-clean one" },
        "المطبخ نادر - أريد مطبخاً جميلاً بصرياً أكثر من كونه وظيفياً": { ar: "المطبخ نادر - أريد مطبخاً جميلاً بصرياً أكثر من كونه وظيفياً", en: "Kitchen rarely used - want it visually beautiful over functional" },
        "المطبخ مكان اجتماعي أيضاً - الأسرة تجتمع حوله": { ar: "المطبخ مكان اجتماعي أيضاً - الأسرة تجتمع حوله", en: "Kitchen is also a social space - family gathers around it" }
      }
    },
    familyMealGathering: {
      label: { ar: "ما الوجبة الأولى التي تجمع أسرتك في المنزل؟", en: "Which meal most brings your family together at home?" },
      options: {
        "الإفطار الباكر - الأسرة تجتمع في صباح": { ar: "الإفطار الباكر - الأسرة تجتمع في صباح", en: "Early breakfast - family gathers in the morning" },
        "الغداء - وجبة الأسرة الرئيسية": { ar: "الغداء - وجبة الأسرة الرئيسية", en: "Lunch - the family's main meal" },
        "العشاء - هو الوقت الحقيقي للاجتماع والحديث": { ar: "العشاء - هو الوقت الحقيقي للاجتماع والحديث", en: "Dinner - the real time for gathering and conversation" },
        "لا تجتمع الأسرة على وجبة منتظمة - كل فرد في وقته": { ar: "لا تجتمع الأسرة على وجبة منتظمة - كل فرد في وقته", en: "Family doesn't gather for regular meals - each person on own schedule" }
      }
    },

    // --- Step 14 new fields (Master Bedroom) ---
    morningWakeupFeel: {
      label: { ar: "ما الشعور الذي تريد أن تستيقظ عليه في الصباح؟", en: "What feeling do you want to wake up to in the morning?" },
      options: {
        "التجدد والنشاط - ألوان محايدة وضوء طبيعي يبدأ معك اليوم": { ar: "التجدد والنشاط - ألوان محايدة وضوء طبيعي يبدأ معك اليوم", en: "Renewal and energy - neutral colors and natural light starting your day" },
        "هادئ للتأمل - أجواء داكنة دائمة وإضاءة خافتة جانبية": { ar: "هادئ للتأمل - أجواء داكنة دائمة وإضاءة خافتة جانبية", en: "Calm for reflection - always dark atmosphere with soft side lighting" },
        "بسيط جداً وخالي من المشتتات - الغرفة للنوم فقط": { ar: "بسيط جداً وخالي من المشتتات - الغرفة للنوم فقط", en: "Very simple and distraction-free - room is for sleeping only" },
        "أشعر بالانتهاء مبكراً بعناصر بصرية مختارة": { ar: "أشعر بالانتهاء مبكراً بعناصر بصرية مختارة تعكس يومي", en: "Feel inspired early through selected visual elements reflecting my day" }
      }
    },
    masterBedroomBestTime: {
      label: { ar: "ما الوقت الأول الذي تفضله في غرفة النوم بخلاف الليل؟", en: "What is your favourite time in the bedroom besides nighttime?" },
      options: {
        "القراءة والاسترخاء قبل النوم": { ar: "القراءة والاسترخاء قبل النوم", en: "Reading and relaxing before sleep" },
        "العمل في المنزل من هذه الغرفة أحياناً": { ar: "العمل في المنزل من هذه الغرفة أحياناً", en: "Working from home in this room occasionally" },
        "الجلوس والحديث مع الشريك - ركن جلوس صغير": { ar: "الجلوس والحديث مع الشريك (ركن جلوس صغير)", en: "Sitting and chatting with partner (small seating corner)" },
        "الغرفة للنوم فقط - لا أمضي وقتاً طويلاً مستيقظاً فيها": { ar: "الغرفة للنوم فقط - لا أمضي وقتاً طويلاً مستيقظاً فيها", en: "Room is for sleeping only - don't spend long awake in it" }
      }
    },

    // --- Step 15 new fields (Bathrooms) ---
    masterBathVibe: {
      label: { ar: "ما الطابع العام الذي تريده لحمامك الرئيسي؟", en: "What overall vibe do you want for your master bathroom?" },
      options: {
        "سبا فاخر وهادئ - تجربة استرخاء كاملة": { ar: "سبا فاخر وهادئ - تجربة استرخاء كاملة", en: "Luxurious quiet spa - complete relaxation experience" },
        "فندقي أنيق - يظل كل شيء في مكانه دون مبالغة": { ar: "فندقي أنيق - يظل كل شيء في مكانه دون مبالغة", en: "Elegant hotel-style - everything in place without excess" },
        "عملي للإعلان - من شيء في متناول اليد بسهولة": { ar: "عملي للإعلان - كل شيء في متناول اليد بسهولة", en: "Practical - everything within easy reach" },
        "دافئ وطبيعي - خامات خشبية وحجرية وألوان ترابية": { ar: "دافئ وطبيعي - خامات خشبية وحجرية وألوان ترابية", en: "Warm and natural - wood/stone materials and earthy tones" }
      }
    },
    wantsBathtub: {
      label: { ar: "هل تريد حوض استحمام (Bathtub) في الحمام الرئيسي؟", en: "Do you want a bathtub in the master bathroom?" },
      options: {
        "لا، أفضل الدش فقط لتوسيع المساحة": { ar: "لا، أفضل الدش فقط لتوسيع المساحة", en: "No, prefer shower only to maximize space" },
        "نعم، حوض مستقل قائم بذاته (Freestanding)": { ar: "نعم، حوض مستقل قائم بذاته (Freestanding)", en: "Yes, freestanding bathtub" },
        "نعم، حوض مدمج في الموصة (Built-in)": { ar: "نعم، حوض مدمج في الموصة (Built-in)", en: "Yes, built-in bathtub" },
        "نعم، حوض استحمام بفوارات مائية (Jacuzzi)": { ar: "نعم، حوض استحمام بفوارات مائية (Jacuzzi)", en: "Yes, jacuzzi / whirlpool bathtub" }
      }
    },
    showerType: {
      label: { ar: "نوع الدش المفضل", en: "Preferred shower type" },
      options: {
        "دش عادي بضغط مريح": { ar: "دش عادي بضغط مريح", en: "Standard shower with comfortable pressure" },
        "دش مطر علوي (Rain Shower) فقط": { ar: "دش مطر علوي (Rain Shower) فقط", en: "Overhead rain shower only" },
        "دش مطر علوي مع دش يدوي": { ar: "دش مطر علوي مع دش يدوي", en: "Overhead rain shower with handheld shower" },
        "كبينة دش مغلقة بالكامل (Shower Cabin)": { ar: "كبينة دش مغلقة بالكامل (Shower Cabin)", en: "Fully enclosed shower cabin" },
        "دش مفتوح بلا حاجز (Walk-in Shower)": { ar: "دش مفتوح بلا حاجز (Walk-in Shower)", en: "Open walk-in shower (no barrier)" }
      }
    },
    vanityType: {
      label: { ar: "نوع الواجهة والمغسلة (Vanity)", en: "Vanity and basin type" },
      options: {
        "وحدة مغسلة واحدة مع تخزين أسفلها": { ar: "وحدة مغسلة واحدة مع تخزين أسفلها", en: "Single basin vanity unit with storage below" },
        "وحدة مغسلتين للزوجين مع تخزين مشترك": { ar: "وحدة مغسلتين (للزوجين) مع تخزين مشترك", en: "Double basin vanity (for couple) with shared storage" },
        "مغسلة معلقة بلا وحدة تخزين (Floating Basin) - مظهر عصري": { ar: "مغسلة معلقة بلا وحدة تخزين (Floating Basin) - مظهر عصري", en: "Floating basin without storage unit - modern look" },
        "مغسلة كلاسيكية على رجل (Pedestal) أو كاونتر رخام": { ar: "مغسلة كلاسيكية على رجل (Pedestal) أو كاونتر رخام", en: "Classic pedestal basin or marble countertop" }
      }
    },
    bathroomStorage: {
      label: { ar: "التخزين في الحمام الرئيسي", en: "Storage in the master bathroom" },
      options: {
        "خزانة دواء خفية خلف المرآة": { ar: "خزانة دواء خفية خلف المرآة", en: "Hidden medicine cabinet behind the mirror" },
        "وحدة تخزين علوية مسلوبة حول الواجهة": { ar: "وحدة تخزين علوية مسلوبة حول الواجهة", en: "Overhead storage unit around the vanity" },
        "تخزين في الحوائط (Niches) داخل الدش وبجوار الحوض": { ar: "تخزين في الحوائط (Niches) داخل الدش وبجوار الحوض", en: "Wall niches inside the shower and beside the bathtub" },
        "أريد تخزين وافر - أنا أضع أغراضاً كثيرة في الحمام": { ar: "أريد تخزين وافر - أنا أضع أغراضاً كثيرة في الحمام", en: "Need ample storage - I keep many items in the bathroom" }
      }
    },
    bathroomFlooring: {
      label: { ar: "مواد التشطيب المفضلة للحمام الرئيسي", en: "Preferred finishing materials for the master bathroom" },
      options: {
        "رخام طبيعي": { ar: "رخام طبيعي", en: "Natural marble" },
        "بورسلين حجري أو خشبي (Wood-look / Stone-look)": { ar: "بورسلين حجري أو خشبي (Wood-look / Stone-look)", en: "Stone-look or wood-look porcelain" },
        "تراكوتا أو بلاط مغربي وأنماط تقليدية": { ar: "تراكوتا أو بلاط مغربي وأنماط تقليدية", en: "Terracotta or Moroccan tiles and traditional patterns" },
        "خامات سادة هادئة بدون نقط": { ar: "خامات سادة هادئة بدون نقط", en: "Calm plain materials without patterns" }
      }
    },
    bathroomLighting: {
      label: { ar: "الإضاءة في الحمام الرئيسي", en: "Lighting in the master bathroom" },
      options: {
        "إضاءة دافئة خافتة لجو السبا والاسترخاء": { ar: "إضاءة دافئة خافتة لجو السبا والاسترخاء", en: "Warm dim lighting for spa and relaxation ambiance" },
        "إضاءة بيضاء ساطعة واضحة للتجهيز والوظيفية": { ar: "إضاءة بيضاء ساطعة واضحة للتجهيز والإضاءة الوظيفية", en: "Bright white lighting for grooming and functional use" },
        "إضاءة مزدوجة - دافئة للجو وبيضاء حول المرآة": { ar: "إضاءة مزدوجة - دافئة للجو وبيضاء حول المرآة للتجهيز", en: "Dual lighting - warm for ambiance, white around mirror for grooming" }
      }
    },
    guestBathroom: {
      label: { ar: "هل تحتاج حمام ضيوف مستقل؟", en: "Do you need an independent guest bathroom?" },
      options: {
        "لا، أحد حمامات الغرف يخدم الضيوف": { ar: "لا، أحد حمامات الغرف يخدم الضيوف", en: "No, one of the room bathrooms serves guests" },
        "نعم، أريد حماماً خاصاً للضيوف بجوار الصالة أو الاستقبال": { ar: "نعم، أريد حماماً خاصاً للضيوف بجوار الصالة أو الاستقبال", en: "Yes, a dedicated guest bathroom near the living area or reception" }
      }
    },
    guestBathroomVibe: {
      label: { ar: "طابع حمام الضيوف المطلوب", en: "Desired guest bathroom vibe" },
      options: {
        "واجهة وطباع أول مبنى - يعكس مستوى المنزل": { ar: "واجهة وطباع أول مبنى - أريده يعكس مستوى المنزل", en: "Statement piece - should reflect the home's overall level" },
        "أنيق ومعقول - يظهر جميل دون مبالغة": { ar: "أنيق ومعقول - يظهر جميل دون مبالغة", en: "Elegant and reasonable - looks beautiful without excess" },
        "صغير ومختصر - المساحة محدودة وأريد الاستفادة منها": { ar: "صغير ومختصر - المساحة محدودة وأريد الاستفادة منها فقط", en: "Small and compact - limited space, just want to maximize it" }
      }
    },
    sharedBathrooms: {
      label: { ar: "هل تحتاج حمامات مشتركة بين غرف الأطفال أو الغرف الإضافية؟", en: "Do you need shared bathrooms between children's or additional rooms?" },
      options: {
        "لا، كل غرفة لها حمامها الخاص": { ar: "لا، كل غرفة لها حمامها الخاص", en: "No, each room has its own bathroom" },
        "نعم، حمام مشترك بين غرفتين": { ar: "نعم، حمام مشترك بين غرفتين", en: "Yes, one shared bathroom between two rooms" },
        "نعم، حمام واحد مشترك لجميع الغرف الإضافية": { ar: "نعم، حمام واحد مشترك لجميع الغرف الإضافية", en: "Yes, one shared bathroom for all additional rooms" }
      }
    },

    // --- Step 17 new fields (Final Questions) ---
    homePersonaType: {
      label: { ar: "إذا كان منزلك شخصاً، من يكون؟", en: "If your home were a person, who would they be?" },
      options: {
        "شخص هادئ ورزين يشعرك بالأمان حين تدخل": { ar: "شخص هادئ ورزين ويشعرك بالأمان حين تدخل", en: "A calm, composed person who makes you feel safe when you enter" },
        "شخص أنيق ومتحضر يستحق الإعجاب والتقدير": { ar: "شخص أنيق ومتحضر يستحق الإعجاب والتقدير", en: "An elegant, refined person who deserves admiration" },
        "شخص دافئ ومضيء يجعلك تريد البقاء أطول وقت": { ar: "شخص دافئ ومضيء يجعلك تريد البقاء أطول وقت معه", en: "A warm, radiant person who makes you want to stay longer" },
        "شخص مبدع وغير تقليدي يفاجئك دائماً بتفصيلة متنوعة": { ar: "شخص مبدع وغير تقليدي ويفاجئك دائماً بتفصيلة من تتنوعها", en: "A creative, unconventional person who always surprises you with details" }
      }
    },
    familyDesignConflict: {
      label: { ar: "هل يختلف أحد أفراد الأسرة معك في القرارات التصميمية؟", en: "Does any family member disagree with you on design decisions?" },
      options: {
        "لا، الأسرة كتلة واحدة تماماً": { ar: "لا، الأسرة كتلة واحدة تماماً", en: "No, the family is completely unified" },
        "اختلافات بسيطة نتفق عليها بسهولة": { ar: "اختلافات بسيطة نتفق عليها بسهولة", en: "Minor differences we easily agree on" },
        "الزوجة أو الزوج لها تفضيلات مختلفة تحتاج أخذها في الاعتبار": { ar: "الزوجة/الزوج لها/له تفضيلات مختلفة تحتاج أخذها في الاعتبار", en: "Partner has different preferences that need to be considered" },
        "الأطفال الكبار لهم آراء قد تؤثر على بعض القرارات": { ar: "الأطفال الكبار لهم آراء قد تؤثر على بعض القرارات", en: "Older children have opinions that may affect some decisions" },
        "الخيال كبير - يحتاج حلولاً توفيقية في عدة فراغات": { ar: "الخيال كبير - يحتاج حلولاً توفيقية في عدة فراغات", en: "Big differences - needs compromises across several spaces" }
      }
    }
  };

  const materialMap = {
    "أخشاب طبيعية": { ar: "أخشاب طبيعية", en: "Natural Wood" },
    "رخام وبورسلان": { ar: "رخام طبيعي", en: "Natural Marble" },
    "بورسلين": { ar: "بورسلين", en: "Porcelain" },
    "معادن (استيل / ذهبي / أسود)": { ar: "معادن (استيل/ذهبي)", en: "Metals (steel/gold)" },
    "زجاج ومرايا": { ar: "زجاج ومرايا", en: "Glass & Mirrors" },
    "خرسانة مكشوفة وطوب": { ar: "خرسانة وطين", en: "Exposed Concrete & Brick" },
    "أقمشة ناعمة (مخمل / كتان)": { ar: "أقمشة (كتان ومخمل)", en: "Fabrics (velvet & linen)" },
    "خامات بديله": { ar: "خامات بديله", en: "Alternative Materials" }
  };

  function applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Dynamic Wife/Husband text update based on selected gender
    const genderSelectEl = document.getElementById('gender');
    const isFemale = genderSelectEl && genderSelectEl.value === 'أنثى';

    if (isFemale) {
      stepHeaders[2] = {
        title: { ar: "بيانات شريك الحياة (الزوج)", en: "Life Partner Details (Husband)" },
        desc: { ar: "هل ترغب في إضافة تفاصيل خاصة بأسلوب حياة الزوج وتفضيلاته التصميمية لملاءمته في المنزل؟", en: "Would you like to add details about your husband's lifestyle and design preferences for the house?" }
      };
      fieldTranslations.wifeName = {
        label: { ar: "اسم الزوج", en: "Husband's Name" },
        placeholder: { ar: "الاسم", en: "Name" }
      };
      fieldTranslations.wifeAge = {
        label: { ar: "عمر الزوج", en: "Husband's Age" },
        placeholder: { ar: "العمر", en: "Age" }
      };
      fieldTranslations.wifeWorks = {
        label: { ar: "هل يعمل الزوج؟", en: "Does he work?" },
        options: {
          "لا": { ar: "لا يعمل", en: "Doesn't work" },
          "نعم": { ar: "يعمل", en: "Works" }
        }
      };
      fieldTranslations.wifeJob = {
        label: { ar: "طبيعة العمل أو المهنة", en: "Nature of work or occupation" },
        placeholder: { ar: "طبيعة العمل", en: "Nature of work" }
      };
      fieldTranslations.wifeNeedsOffice = {
        label: { ar: "هل يحتاج مكتب خاص في المنزل؟", en: "Does he need a private home office?" },
        options: {
          "لا": { ar: "لا يحتاج", en: "Doesn't need" },
          "نعم - مستقل": { ar: "نعم - مكتب مستقل", en: "Yes - independent office" },
          "نعم - مدمج": { ar: "نعم - ركن مدمج في غرفة النوم", en: "Yes - integrated corner in bedroom" }
        }
      };
      fieldTranslations.wifeColors = {
        label: { ar: "الألوان المفضلة للزوج", en: "Husband's preferred colors" },
        placeholder: { ar: "الألوان المفضلة", en: "Preferred colors" }
      };
      fieldTranslations.wifeLifestyle = {
        label: { ar: "أسلوب حياته وتفضيلاته في المنزل", en: "His lifestyle and home preferences" },
        placeholder: { ar: "مثال: يقضي وقتاً في القراءة، يفضل مطبخ مفتوح...", en: "e.g., spends time reading, prefers an open kitchen..." }
      };
    } else {
      stepHeaders[2] = {
        title: { ar: "بيانات شريكة الحياة (الزوجة)", en: "Life Partner Details (Wife)" },
        desc: { ar: "هل ترغب في إضافة تفاصيل خاصة بأسلوب حياة الزوجة وتفضيلاتها التصميمية لملاءمتها في المنزل؟", en: "Would you like to add details about your wife's lifestyle and design preferences for the house?" }
      };
      fieldTranslations.wifeName = {
        label: { ar: "اسم الزوجة", en: "Wife's Name" },
        placeholder: { ar: "الاسم", en: "Name" }
      };
      fieldTranslations.wifeAge = {
        label: { ar: "عمر الزوجة", en: "Wife's Age" },
        placeholder: { ar: "العمر", en: "Age" }
      };
      fieldTranslations.wifeWorks = {
        label: { ar: "هل تعمل الزوجة؟", en: "Does she work?" },
        options: {
          "لا": { ar: "لا تعمل", en: "Doesn't work" },
          "نعم": { ar: "تعمل", en: "Works" }
        }
      };
      fieldTranslations.wifeJob = {
        label: { ar: "طبيعة العمل أو المهنة", en: "Nature of work or occupation" },
        placeholder: { ar: "طبيعة العمل", en: "Nature of work" }
      };
      fieldTranslations.wifeNeedsOffice = {
        label: { ar: "هل تحتاج مكتب خاص في المنزل؟", en: "Does she need a private home office?" },
        options: {
          "لا": { ar: "لا تحتاج", en: "Doesn't need" },
          "نعم - مستقل": { ar: "نعم - مكتب مستقل", en: "Yes - independent office" },
          "نعم - مدمج": { ar: "نعم - ركن مدمج في غرفة النوم", en: "Yes - integrated corner in bedroom" }
        }
      };
      fieldTranslations.wifeColors = {
        label: { ar: "الألوان المفضلة للزوجة", en: "Wife's preferred colors" },
        placeholder: { ar: "الألوان المفضلة", en: "Preferred colors" }
      };
      fieldTranslations.wifeLifestyle = {
        label: { ar: "أسلوب حياتها وتفضيلاتها في المنزل", en: "Her lifestyle and home preferences" },
        placeholder: { ar: "مثال: تقضي وقتاً في القراءة، تفضل مطبخ مفتوح...", en: "e.g., spends time reading, prefers an open kitchen..." }
      };
    }

    // 1. Language Toggle Button Text
    const langToggleBtn = document.getElementById('langToggleBtn');
    if (langToggleBtn) {
      langToggleBtn.querySelector('span').innerText = lang === 'ar' ? 'English' : 'العربية';
    }

    // 2. Head Title
    document.title = lang === 'ar' ? "استبيان التصميم الداخلي السكني" : "Residential Interior Design Brief";

    // 3. Brand Text
    const brandText = document.getElementById('brandText');
    if (brandText) {
      brandText.innerHTML = lang === 'ar'
        ? 'مصطفى حسين <span>ديزاينز</span>'
        : 'Mostafa Hussien <span>Designs</span>';
    }

    // 4. Dashboard link
    const dashboardLink = document.getElementById('dashboardLink');
    if (dashboardLink) {
      dashboardLink.innerHTML = lang === 'ar' 
        ? '<i class="fa-solid fa-chart-line"></i> لوحة التحكم' 
        : '<i class="fa-solid fa-chart-line"></i> Dashboard';
    }

    // 5. Welcome Screen (Step 0)
    const welcomeBrand = document.querySelector('.welcome-brand-en');
    const welcomeIntro = document.querySelector('.welcome-intro-ar');
    const welcomeBtn = document.querySelector('.welcome-screen .next-btn');

    if (lang === 'ar') {
      if (welcomeBrand) {
        welcomeBrand.innerHTML = `
          <div style="font-size: 1.1rem; text-transform: uppercase; letter-spacing: 2px; color: var(--accent-color); font-weight: 500;">مرحباً بكم</div>
          <h1 style="font-size: 2.2rem; font-weight: 700; color: #fff; margin: 5px 0 10px 0; letter-spacing: 1px;">مصطفى حسين ديزاينز</h1>
          <div style="font-size: 1.25rem; font-weight: 300; color: var(--text-secondary); letter-spacing: 0.5px;">ملخص التصميم السكني الفاخر</div>
        `;
        welcomeBrand.style.fontFamily = 'var(--font-arabic)';
      }
      if (welcomeIntro) {
        welcomeIntro.innerHTML = `
          <p>نود أن نشكركم على وقتكم.</p>
          <p>تم إعداد هذا النموذج بعناية لمساعدتنا على فهم أسلوب حياتكم، تفضيلاتكم، واحتياجاتكم التصميمية، بهدف تصميم مساحة سكنية فاخرة تعكس شخصيتكم وتوفر أعلى مستويات الراحة والجمال والوظيفية.</p>
          <p>كل إجابة تقدمونها تساعدنا على بناء تجربة تصميم مخصصة بالكامل لكم.</p>
        `;
        welcomeIntro.style.fontFamily = 'var(--font-arabic)';
      }
      if (welcomeBtn) {
        welcomeBtn.innerHTML = `ابدأ رحلتك التصميمية <i class="fa-solid fa-arrow-left"></i>`;
      }
    } else {
      if (welcomeBrand) {
        welcomeBrand.innerHTML = `
          <div style="font-size: 1.1rem; text-transform: uppercase; letter-spacing: 2px; color: var(--accent-color); font-weight: 500;">Welcome</div>
          <h1 style="font-size: 2.2rem; font-weight: 700; color: #fff; margin: 5px 0 10px 0; letter-spacing: 1px;">MOSTAFA HUSSIEN DESIGNS</h1>
          <div style="font-size: 1.25rem; font-weight: 300; color: var(--text-secondary); letter-spacing: 0.5px;">Luxury Residential Design Brief</div>
        `;
        welcomeBrand.style.fontFamily = 'var(--font-english)';
      }
      if (welcomeIntro) {
        welcomeIntro.innerHTML = `
          <p>We would like to thank you for your time.</p>
          <p>This form has been carefully prepared to help us understand your lifestyle, preferences, and design needs, with the aim of designing a luxury residential space that reflects your personality and provides the highest levels of comfort, beauty, and functionality.</p>
          <p>Every answer you provide helps us build a fully customized design experience for you.</p>
        `;
        welcomeIntro.style.fontFamily = 'var(--font-english)';
      }
      if (welcomeBtn) {
        welcomeBtn.innerHTML = `Start your design journey <i class="fa-solid fa-arrow-right"></i>`;
      }
    }

    // 6. Keyboard Hint
    const keyboardHint = document.querySelector('.keyboard-hint');
    if (keyboardHint) {
      keyboardHint.innerText = lang === 'ar' ? 'اضغط Enter للمتابعة' : 'Press Enter to continue';
    }

    // 7. Step Headers (Question title & descriptions)
    Object.keys(stepHeaders).forEach(step => {
      const card = viewport.querySelector(`.step-card[data-step="${step}"]`);
      if (card) {
        const titleEl = card.querySelector('.question-text');
        const descEl = card.querySelector('.question-description');
        if (titleEl && stepHeaders[step].title) titleEl.innerText = stepHeaders[step].title[lang];
        if (descEl && stepHeaders[step].desc) descEl.innerText = stepHeaders[step].desc[lang];
      }
    });

    // 8. Field Inputs & Labels
    Object.keys(fieldTranslations).forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        // Label
        const parent = input.parentElement;
        const label = parent ? parent.querySelector('label') : null;
        if (label && fieldTranslations[id].label) {
          label.innerText = fieldTranslations[id].label[lang];
        }

        // Placeholder
        if (fieldTranslations[id].placeholder) {
          input.placeholder = fieldTranslations[id].placeholder[lang];
        }

        // Options (select)
        if (fieldTranslations[id].options && input.tagName === 'SELECT') {
          Array.from(input.options).forEach(opt => {
            const val = opt.value;
            if (fieldTranslations[id].options[val]) {
              opt.textContent = fieldTranslations[id].options[val][lang];
            }
          });
        }
      }
    });

    // 10. Children Yes/No buttons
    const childrenYesNoBtns = document.querySelectorAll('#hasChildrenWrapper .yes-no-btn');
    childrenYesNoBtns.forEach(btn => {
      const val = btn.getAttribute('data-value');
      if (val === 'نعم') {
        btn.innerHTML = lang === 'ar' ? `<i class="fa-solid fa-check"></i> نعم` : `<i class="fa-solid fa-check"></i> Yes`;
      } else {
        btn.innerHTML = lang === 'ar' ? `<i class="fa-solid fa-xmark"></i> لا` : `<i class="fa-solid fa-xmark"></i> No`;
      }
    });

    // 11. Materials label
    const materialsLabel = document.getElementById('materialsLabel');
    if (materialsLabel) {
      materialsLabel.innerText = lang === 'ar' ? 'الخامات المفضلة (اختر ما يعجبك)' : 'Preferred Materials (select all that apply)';
    }

    // 11. Materials choices
    const materials = document.querySelectorAll('#materialsContainer .choice-key');
    materials.forEach(el => {
      const val = el.getAttribute('data-val');
      if (materialMap[val]) {
        el.innerText = materialMap[val][lang];
      }
    });

    // 12. Appliances label & choices
    const appliancesLabel = document.getElementById('appliancesLabel');
    if (appliancesLabel) {
      appliancesLabel.innerText = lang === 'ar' ? 'اختيارات الأجهزة (اختر ما يلزمك)' : 'Appliances (select all that apply)';
    }
    const applianceMap = {
      "ثلاجة":          { ar: "ثلاجة",          en: "Refrigerator" },
      "فريزر":          { ar: "فريزر",          en: "Freezer" },
      "بوتجاز عادى":    { ar: "بوتجاز عادى",    en: "Standard Cooker" },
      "بوتجاز بيلت اين":{ ar: "بوتجاز بيلت اين",en: "Built-in Hob" },
      "فرن بيلت اين":   { ar: "فرن بيلت اين",   en: "Built-in Oven" },
      "ميكرويف":        { ar: "ميكرويف",        en: "Microwave" },
      "فرن كهرباء":     { ar: "فرن كهرباء",     en: "Electric Oven" },
      "سخان":           { ar: "سخان",           en: "Water Heater" },
      "غسالة ملابس":    { ar: "غسالة ملابس",    en: "Washing Machine" },
      "غسالة اطباق":    { ar: "غسالة اطباق",    en: "Dishwasher" },
      "كوفي كورنور":    { ar: "كوفي كورنور",    en: "Coffee Corner" }
    };
    document.querySelectorAll('#appliancesContainer .choice-key').forEach(el => {
      const val = el.getAttribute('data-val');
      if (applianceMap[val]) el.innerText = applianceMap[val][lang];
    });

    // 12. Loader & Success Texts
    const loaderTitle = document.querySelector('#submitLoading h2');
    const loaderDesc = document.querySelector('#submitLoading p');
    if (loaderTitle) {
      loaderTitle.innerText = lang === 'ar' 
        ? 'جاري إرسال تفضيلاتك وحفظ طلبك...' 
        : 'Sending your preferences and saving your request...';
    }
    if (loaderDesc) {
      loaderDesc.innerText = lang === 'ar'
        ? 'يرجى الانتظار لحين الانتهاء.'
        : 'Please wait until finished.';
    }

    const successTitle = document.querySelector('#submitSuccess h1');
    const successDesc = document.querySelector('#submitSuccess p');
    const successBtn = document.querySelector('#submitSuccess a');
    if (successTitle) {
      successTitle.innerText = lang === 'ar'
        ? 'تم إرسال تفضيلاتك بنجاح!'
        : 'Your preferences have been sent successfully!';
    }
    if (successDesc) {
      successDesc.innerText = lang === 'ar'
        ? 'نشكرك على مشاركة تفاصيل منزلك. لقد قمنا بتوثيق الاستبيان وإرساله إلى فريق التصميم، وجاري إرسال البيانات إلى محرك الذكاء الاصطناعي لتحليل تفضيلاتك وتكوين لوحة الإلهام الأولية.'
        : 'Thank you for sharing your home details. We have documented the brief and sent it to the design team. The data is being sent to the AI engine to analyze your preferences and generate the initial mood board.';
    }
    if (successBtn) {
      successBtn.innerHTML = lang === 'ar'
        ? `انتقل إلى لوحة التحكم <i class="fa-solid fa-arrow-left"></i>`
        : `Go to Dashboard <i class="fa-solid fa-arrow-right"></i>`;
    }

    // 12. Dynamic Children cards update (if children count is set)
    updateChildrenForms();

    // 13. Nav controls
    updateControls();
  }




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

  // Appliances selection logic
  const appliancesContainer = document.getElementById('appliancesContainer');
  if (appliancesContainer) {
    appliancesContainer.querySelectorAll('.choice-key').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('selected');
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

  // Yes/No Toggle for Children
  const hasChildrenWrapper = document.getElementById('hasChildrenWrapper');
  const childrenDetailsForm = document.getElementById('childrenDetailsForm');
  if (hasChildrenWrapper) {
    hasChildrenWrapper.querySelectorAll('.yes-no-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        hasChildrenWrapper.querySelectorAll('.yes-no-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const val = btn.getAttribute('data-value');
        childrenDetailsForm.style.display = val === 'نعم' ? 'block' : 'none';
      });
    });
  }

  // Children Dynamic Form Generator
  const childrenCountInput = document.getElementById('childrenCount');
  const childrenContainer = document.getElementById('childrenContainer');

  function getAgeSpecificFields(ageNum, lang) {
    const a = lang === 'ar';
    if (ageNum > 0 && ageNum < 5) {
      return `
        <div class="compact-item">
          <label class="compact-label">${a ? 'مكان النوم' : 'Sleeping arrangement'}</label>
          <select class="compact-input" data-child-field="sleepingArrangement">
            <option value="">${a ? 'اختر...' : 'Select...'}</option>
            <option value="سرير مستقل في غرفة الوالدين">${a ? 'سرير مستقل في غرفة الوالدين' : 'Separate crib in parents room'}</option>
            <option value="غرفة مستقلة بمواصفات أطفال صغار">${a ? 'غرفة مستقلة بمواصفات أطفال صغار' : 'Independent room with toddler specs'}</option>
            <option value="غرفة مشتركة مع طفل آخر">${a ? 'غرفة مشتركة مع طفل آخر' : 'Shared room with another child'}</option>
          </select>
        </div>
        <div class="compact-item">
          <label class="compact-label">${a ? 'جو الغرفة' : 'Room vibe'}</label>
          <select class="compact-input" data-child-field="roomVibe">
            <option value="">${a ? 'اختر...' : 'Select...'}</option>
            <option value="هادئ ومحايد">${a ? 'هادئ ومحايد' : 'Calm & neutral'}</option>
            <option value="حيوي وملون">${a ? 'حيوي وملون' : 'Lively & colorful'}</option>
            <option value="طبيعي بألوان ترابية">${a ? 'طبيعي بألوان ترابية' : 'Natural earth tones'}</option>
          </select>
        </div>
        <div class="compact-item">
          <label class="compact-label">${a ? 'الألوان المفضلة للغرفة' : 'Preferred room colors'}</label>
          <input type="text" class="compact-input" data-child-field="favoriteColors" placeholder="${a ? 'مثال: أبيض، أخضر فاتح' : 'e.g., white, soft green'}">
        </div>`;
    } else if (ageNum >= 5 && ageNum <= 10) {
      return `
        <div class="compact-item">
          <label class="compact-label">${a ? 'نوع السرير' : 'Bed type'}</label>
          <select class="compact-input" data-child-field="bedType">
            <option value="">${a ? 'اختر...' : 'Select...'}</option>
            <option value="سرير عادي فردي">${a ? 'سرير عادي فردي' : 'Standard single bed'}</option>
            <option value="سرير علوي مزدوج (Bunk Bed)">${a ? 'سرير علوي مزدوج (Bunk Bed)' : 'Bunk bed'}</option>
            <option value="سرير بدرج تخزين سفلي">${a ? 'سرير بدرج تخزين سفلي' : 'Bed with under-storage drawers'}</option>
          </select>
        </div>
        <div class="compact-item">
          <label class="compact-label">${a ? 'مكتب دراسي في الغرفة' : 'Study desk in room'}</label>
          <select class="compact-input" data-child-field="studyDesk">
            <option value="">${a ? 'اختر...' : 'Select...'}</option>
            <option value="نعم، مكتب دراسي مدمج في الغرفة">${a ? 'نعم، مكتب دراسي مدمج' : 'Yes, built-in study desk'}</option>
            <option value="لا، يدرس في مكان آخر">${a ? 'لا، يدرس في مكان آخر' : 'No, studies elsewhere'}</option>
          </select>
        </div>
        <div class="compact-item">
          <label class="compact-label">${a ? 'تخزين الألعاب' : 'Toy storage'}</label>
          <select class="compact-input" data-child-field="toyStorage">
            <option value="">${a ? 'اختر...' : 'Select...'}</option>
            <option value="أرفف وصناديق تخزين مدمجة">${a ? 'أرفف وصناديق تخزين مدمجة' : 'Built-in shelves and storage boxes'}</option>
            <option value="خزانة عادية تكفي">${a ? 'خزانة عادية تكفي' : 'Regular wardrobe is enough'}</option>
          </select>
        </div>
        <div class="compact-item">
          <label class="compact-label">${a ? 'جو الغرفة' : 'Room vibe'}</label>
          <select class="compact-input" data-child-field="roomVibe">
            <option value="">${a ? 'اختر...' : 'Select...'}</option>
            <option value="مرح وملون">${a ? 'مرح وملون' : 'Fun & colorful'}</option>
            <option value="بسيط ومنظم">${a ? 'بسيط ومنظم' : 'Simple & organized'}</option>
            <option value="ثيم محدد (كرتون / رياضة)">${a ? 'ثيم محدد (كرتون أو رياضة)' : 'Specific theme (cartoon/sports)'}</option>
          </select>
        </div>`;
    } else if (ageNum > 10) {
      return `
        <div class="compact-item">
          <label class="compact-label">${a ? 'نوع السرير' : 'Bed type'}</label>
          <select class="compact-input" data-child-field="bedType">
            <option value="">${a ? 'اختر...' : 'Select...'}</option>
            <option value="سرير فردي عادي">${a ? 'سرير فردي عادي' : 'Standard single bed'}</option>
            <option value="سرير نصف مزدوج (3/4)">${a ? 'سرير نصف مزدوج (3/4)' : 'Three-quarter bed'}</option>
            <option value="سرير مزدوج">${a ? 'سرير مزدوج' : 'Double bed'}</option>
          </select>
        </div>
        <div class="compact-item">
          <label class="compact-label">${a ? 'شاشة أو تلفاز في الغرفة' : 'Screen/TV in room'}</label>
          <select class="compact-input" data-child-field="screenInRoom">
            <option value="">${a ? 'اختر...' : 'Select...'}</option>
            <option value="نعم، يريد شاشة في غرفته">${a ? 'نعم، يريد شاشة في غرفته' : 'Yes, wants a screen in room'}</option>
            <option value="لا، الشاشة في أماكن مشتركة فقط">${a ? 'لا، الشاشة في الأماكن المشتركة فقط' : 'No, screen only in common areas'}</option>
          </select>
        </div>
        <div class="compact-item">
          <label class="compact-label">${a ? 'مستوى الخصوصية' : 'Privacy level'}</label>
          <select class="compact-input" data-child-field="privacyNeed">
            <option value="">${a ? 'اختر...' : 'Select...'}</option>
            <option value="يحتاج خصوصية كاملة">${a ? 'يحتاج خصوصية كاملة' : 'Needs full privacy'}</option>
            <option value="خصوصية عادية">${a ? 'خصوصية عادية' : 'Standard privacy'}</option>
          </select>
        </div>
        <div class="compact-item">
          <label class="compact-label">${a ? 'جو الغرفة' : 'Room vibe'}</label>
          <select class="compact-input" data-child-field="roomVibe">
            <option value="">${a ? 'اختر...' : 'Select...'}</option>
            <option value="هادئ وحديث">${a ? 'هادئ وحديث' : 'Calm & modern'}</option>
            <option value="شبابي وديناميكي">${a ? 'شبابي وديناميكي' : 'Youthful & dynamic'}</option>
            <option value="فندقي بسيط">${a ? 'فندقي بسيط' : 'Simple hotel-style'}</option>
            <option value="ثيم حسب اهتمامه">${a ? 'ثيم حسب اهتمامه' : 'Custom theme based on interests'}</option>
          </select>
        </div>`;
    }
    return '';
  }

  if (childrenCountInput && childrenContainer) {
    childrenCountInput.addEventListener('input', updateChildrenForms);

    function updateChildrenForms() {
      const count = parseInt(childrenCountInput.value) || 0;
      childrenContainer.innerHTML = '';

      if (count <= 0) return;

      const lang = document.documentElement.lang || 'ar';
      for (let i = 1; i <= Math.min(count, 6); i++) {
        const childCard = document.createElement('div');
        childCard.className = 'child-form-block';
        childCard.style.cssText = 'padding:15px;background:rgba(255,255,255,0.02);border:1px solid var(--border-color);border-radius:8px;margin-bottom:15px;';

        childCard.innerHTML = `
          <h4 style="color:var(--accent-color);font-size:1rem;margin-bottom:12px;">
            <span>${lang === 'ar' ? `الطفل ${i}` : `Child ${i}`}</span>
          </h4>
          <div class="compact-grid">
            <div class="compact-item">
              <label class="compact-label">${lang === 'ar' ? 'الاسم' : 'Name'}</label>
              <input type="text" class="compact-input child-name" placeholder="${lang === 'ar' ? 'اسم الطفل' : "Child's name"}">
            </div>
            <div class="compact-item">
              <label class="compact-label">${lang === 'ar' ? 'الجنس' : 'Gender'}</label>
              <select class="compact-input child-gender">
                <option value="ذكر">${lang === 'ar' ? 'ذكر' : 'Male'}</option>
                <option value="أنثى">${lang === 'ar' ? 'أنثى' : 'Female'}</option>
              </select>
            </div>
            <div class="compact-item">
              <label class="compact-label">${lang === 'ar' ? 'العمر' : 'Age'}</label>
              <input type="number" class="compact-input child-age" min="0" max="25" placeholder="${lang === 'ar' ? 'العمر' : 'Age'}">
            </div>
            <div class="compact-item">
              <label class="compact-label">${lang === 'ar' ? 'الهوايات / الاهتمامات' : 'Hobbies / Interests'}</label>
              <input type="text" class="compact-input child-hobbies" placeholder="${lang === 'ar' ? 'الرسم، الألعاب، إلخ...' : 'Drawing, gaming, etc...'}">
            </div>
            <div class="child-age-fields compact-item" style="grid-column:span 2;display:none;"></div>
          </div>
        `;
        childrenContainer.appendChild(childCard);

        const ageInput = childCard.querySelector('.child-age');
        const ageFieldsContainer = childCard.querySelector('.child-age-fields');
        ageInput.addEventListener('input', () => {
          const ageVal = parseInt(ageInput.value);
          if (ageVal > 0) {
            ageFieldsContainer.style.display = 'block';
            ageFieldsContainer.innerHTML = `
              <div class="compact-grid" style="margin:0;">
                ${getAgeSpecificFields(ageVal, lang)}
              </div>`;
          } else {
            ageFieldsContainer.style.display = 'none';
            ageFieldsContainer.innerHTML = '';
          }
        });
      }
    }
  }

  // Handle Step transitions
  function showStep(stepIndex) {
    if (stepIndex < 0 || stepIndex > totalSteps) return;

    // Skip step 2 if not married
    if (stepIndex === 2) {
      const maritalStatusVal = document.getElementById('maritalStatus').value;
      if (maritalStatusVal !== 'متزوج / متزوجة') {
        if (currentStep < 2) {
          showStep(3);
        } else {
          showStep(1);
        }
        return;
      }
    }

    // Skip step 3 if not married
    if (stepIndex === 3) {
      const maritalStatusVal = document.getElementById('maritalStatus').value;
      if (maritalStatusVal !== 'متزوج / متزوجة') {
        if (currentStep < 3) {
          showStep(4);
        } else {
          showStep(2);
        }
        return;
      }
    }

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

    const lang = document.documentElement.lang || 'ar';

    // Adjust button labels and next controls
    if (currentStep === 0) {
      nextBtn.innerHTML = lang === 'ar'
        ? `ابدأ رحلتك التصميمية <i class="fa-solid fa-arrow-left"></i>`
        : `Start your design journey <i class="fa-solid fa-arrow-right"></i>`;
      nextBtn.style.background = 'var(--accent-color)';
    } else if (currentStep === totalSteps - 1) {
      nextBtn.innerHTML = lang === 'ar'
        ? `إرسال الاستبيان <i class="fa-solid fa-paper-plane"></i>`
        : `Submit Brief <i class="fa-solid fa-paper-plane"></i>`;
      nextBtn.style.background = 'var(--success-color)';
    } else {
      nextBtn.innerHTML = lang === 'ar'
        ? `التالي <i class="fa-solid fa-chevron-left"></i>`
        : `Next <i class="fa-solid fa-chevron-right"></i>`;
      nextBtn.style.background = 'var(--accent-color)';
    }

    prevBtn.innerHTML = lang === 'ar'
      ? `<i class="fa-solid fa-chevron-right"></i> السابق`
      : `<i class="fa-solid fa-chevron-left"></i> Previous`;

    // Hide controls if we are on the welcome screen (step 0) or the submission/spinner screen (last screen, index totalSteps)
    if (currentStep === 0 || currentStep === totalSteps) {
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

  // Welcome screen main button click handler
  const welcomeStartBtn = document.querySelector('.welcome-screen .next-btn');
  if (welcomeStartBtn) {
    welcomeStartBtn.addEventListener('click', () => {
      showStep(1);
    });
  }

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
    payload['الجنس'] = document.getElementById('gender').value;
    payload['الحالة الاجتماعية'] = document.getElementById('maritalStatus').value;

    // 2. Wife Info
    const maritalStatusVal = document.getElementById('maritalStatus').value;
    if (maritalStatusVal === 'متزوج / متزوجة') {
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
    payload.children = [];
    if (maritalStatusVal === 'متزوج / متزوجة') {
      const childrenCount = parseInt(childrenCountInput.value) || 0;
      if (childrenCount > 0) {
        const childBlocks = childrenContainer.querySelectorAll('.child-form-block');
        childBlocks.forEach(block => {
          const ageGroupData = {};
          block.querySelectorAll('[data-child-field]').forEach(el => {
            ageGroupData[el.getAttribute('data-child-field')] = el.value;
          });
          payload.children.push({
            name: block.querySelector('.child-name').value,
            gender: block.querySelector('.child-gender').value,
            age: block.querySelector('.child-age').value,
            hobbies: block.querySelector('.child-hobbies').value,
            ...ageGroupData
          });
        });
      }
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

    // 4b. Budget extras (step 5 new fields)
    payload['نظرة تجهيز المنزل'] = document.getElementById('investmentHorizon').value;
    payload['خطة الميزانية عند القصور'] = document.getElementById('budgetPhasing').value;
    payload['محلي أم مستورد'] = document.getElementById('localVsImported').value;

    // 5. Lifestyle & preferences
    payload['هل المنزل بالنسبة لك:'] = document.getElementById('homeRole').value;
    payload['هل تعمل من المنزل؟'] = document.getElementById('wfh').value;
    payload['هل تستقبل ضيوف باستمرار؟'] = document.getElementById('guests').value;
    payload['هل تفضل الأجواء:'] = document.getElementById('atmosphere').value;
    payload['هل تفضل المساحات:'] = document.getElementById('spaceStyle').value;
    payload['النظام والترتيب'] = document.getElementById('orgAndOrder').value;
    payload['مصدر الطاقة عند العودة للمنزل'] = document.getElementById('homeEnergySource').value;
    payload['تعارض القيم - جمال أم سهولة صيانة'] = document.getElementById('valueConflict').value;

    // 5b. Sensory perception (step 7)
    payload['تأثير الضوء الطبيعي'] = document.getElementById('naturalLightImpact').value;
    payload['أول ما يلفت النظر عند الدخول'] = document.getElementById('firstNoticedInSpace').value;
    payload['ما يزعج عند الدخول'] = document.getElementById('annoyingAtEntrance').value;
    payload['ما يمنح الرضا عند اللمس'] = document.getElementById('materialSatisfaction').value;

    // 5c. Psychology of space (step 8)
    payload['الحاجة للمساحة الحرة'] = document.getElementById('freeSpaceNeed').value;
    payload['إحساس ارتفاع السقف'] = document.getElementById('ceilingHeightFeel').value;
    payload['علاقة المنزل بالخارج'] = document.getElementById('homeExteriorRelation').value;
    payload['الزاوية الجمالية المفضلة'] = document.getElementById('aestheticCorner').value;

    // 5d. Cultural identity (step 9)
    payload['وظيفة مجلس الاستقبال'] = document.getElementById('guestRoomFunction').value;
    payload['الحاجة لمكان للصلاة'] = document.getElementById('prayerSpaceNeed').value;
    payload['استخدام الفراغات المشتركة'] = document.getElementById('familyCommonAreaUse').value;
    payload['طبيعة الاستضافة'] = document.getElementById('hostingNature').value;

    // 6. Style & preferences (step 10)
    payload['الطراز المفضل'] = document.getElementById('preferredStyle').value;
    payload['هل تفضل الفراغات:'] = document.getElementById('spatialFeel').value;
    payload['الإضاءة المفضلة'] = document.getElementById('lighting').value;
    payload['نوع الأثاث المفضل'] = document.getElementById('furnitureType').value;
    payload['الألوان المفضلة'] = document.getElementById('favoriteColors').value;
    payload['الألوان غير المفضلة'] = document.getElementById('dislikedColors').value;
    payload['تفضيل الديكورات والتحف'] = document.getElementById('decorPreference').value;
    payload['وصف الأثاث المثالي'] = document.getElementById('idealFurnitureDesc').value;
    payload['تحمل الأنماط البصرية'] = document.getElementById('patternTolerance').value;

    // Selected materials
    const selectedMaterials = [];
    materialsContainer.querySelectorAll('.choice-key.selected').forEach(el => {
      selectedMaterials.push(el.getAttribute('data-val'));
    });
    payload['الخامات المفضلة'] = selectedMaterials;

    // Selected appliances
    const selectedAppliances = [];
    appliancesContainer.querySelectorAll('.choice-key.selected').forEach(el => {
      selectedAppliances.push(el.getAttribute('data-val'));
    });
    payload['اختيارات الأجهزة'] = selectedAppliances;

    // 7. Rooms detail
    payload.rooms = {
      livingRoom: {
        usage: document.getElementById('livingUse').value,
        capacity: document.getElementById('livingCapacity').value,
        seatingType: document.getElementById('livingSeatingType').value,
        tvEssential: document.getElementById('livingTv').value,
        extraRequirements: document.getElementById('livingExtra').value,
        desiredFeel: document.getElementById('livingRoomFeel').value,
        bestTime: document.getElementById('livingRoomBestTime').value,
        painPoint: document.getElementById('livingRoomPainPoint').value
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
        needs: document.getElementById('kitchenNeeds').value,
        familyRelation: document.getElementById('kitchenFamilyRelation').value,
        mealGathering: document.getElementById('familyMealGathering').value
      },
      masterBedroom: {
        vibe: document.getElementById('masterVibe').value,
        lighting: document.getElementById('masterLighting').value,
        storage: document.getElementById('masterStorage').value,
        needs: document.getElementById('masterNeeds').value,
        morningWakeupFeel: document.getElementById('morningWakeupFeel').value,
        bestTime: document.getElementById('masterBedroomBestTime').value
      },
      bathrooms: {
        masterBathVibe: document.getElementById('masterBathVibe').value,
        wantsBathtub: document.getElementById('wantsBathtub').value,
        showerType: document.getElementById('showerType').value,
        vanityType: document.getElementById('vanityType').value,
        storage: document.getElementById('bathroomStorage').value,
        flooring: document.getElementById('bathroomFlooring').value,
        lighting: document.getElementById('bathroomLighting').value,
        guestBathroom: document.getElementById('guestBathroom').value,
        guestBathroomVibe: document.getElementById('guestBathroomVibe').value,
        sharedBathrooms: document.getElementById('sharedBathrooms').value
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
    payload['شخصية المنزل'] = document.getElementById('homePersonaType').value;
    payload['هل يوجد خلاف تصميمي في الأسرة؟'] = document.getElementById('familyDesignConflict').value;

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
        }).catch(() => console.log('Server-side auto-analysis skipped (API Key probably not set). Client can run manually in dashboard.'));
        
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

  let currentLang = localStorage.getItem('preferred_lang') || 'ar';
  applyLanguage(currentLang);

  const langToggleBtn = document.getElementById('langToggleBtn');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'ar' ? 'en' : 'ar';
      localStorage.setItem('preferred_lang', currentLang);
      applyLanguage(currentLang);
    });
  }

  const genderSelect = document.getElementById('gender');
  if (genderSelect) {
    genderSelect.addEventListener('change', () => {
      applyLanguage(currentLang);
    });
  }
});
