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
      title: { ar: "الذوق والأسلوب التصميمي المفضّل", en: "Preferred Taste & Design Style" },
      desc: { ar: "يرجى اختيار التفضيلات العامة للألوان والمواد.", en: "Please choose general preferences for colors and materials." }
    },
    8: {
      title: { ar: "تفضيلات غرفة المعيشة (Living Room)", en: "Living Room Preferences" },
      desc: { ar: "يرجى تحديد متطلبات وتصميم غرفة المعيشة اليومية.", en: "Please specify the requirements and design of the daily living room." }
    },
    9: {
      title: { ar: "منطقة الاستقبال وتناول الطعام (Reception & Dining)", en: "Reception & Dining Area" },
      desc: { ar: "يرجى تحديد متطلبات الاستقبال والريسبشن وطاولة الطعام.", en: "Please specify the requirements for reception, salon, and dining." }
    },
    10: {
      title: { ar: "تفضيلات المطبخ (Kitchen)", en: "Kitchen Preferences" },
      desc: { ar: "يرجى تحديد تصميم وتفاصيل المطبخ.", en: "Please specify the design and details of the kitchen." }
    },
    11: {
      title: { ar: "غرفة النوم الرئيسية (Master Bedroom)", en: "Master Bedroom Preferences" },
      desc: { ar: "يرجى تحديد متطلبات غرفة النوم الرئيسية.", en: "Please specify the requirements for the master bedroom." }
    },
    12: {
      title: { ar: "مساحات وغرف إضافية بالمنزل", en: "Additional Spaces & Rooms in the House" },
      desc: { ar: "يرجى تحديد متطلباتك للمساحات الخدمية والترفيهية الإضافية.", en: "Please specify your requirements for additional service and entertainment spaces." }
    },
    13: {
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
    religion: {
      label: { ar: "الديانة", en: "Religion" },
      options: {
        "": { ar: "اختر...", en: "Select..." },
        "الإسلام": { ar: "الإسلام", en: "Islam" },
        "المسيحية": { ar: "المسيحية", en: "Christianity" },
        "اليهودية": { ar: "اليهودية", en: "Judaism" }
      }
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
        "دافئة ومريحة": { ar: "دافئة ومريحة (Cozy)", en: "Warm and cozy" }
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
        "عصري وبسيط جداً": { ar: "عصري وبسيط جداً (Minimal)", en: "Modern & very simple (Minimal)" }
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
      brandText.innerHTML = 'Mostafa Hussien <span>Designs</span>';
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
          <h1 style="font-size: 2.2rem; font-weight: 700; color: #fff; margin: 5px 0 10px 0; letter-spacing: 1px;">تصاميم مصطفى حسين</h1>
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
        childCard.style.padding = '15px';
        childCard.style.background = 'rgba(255,255,255,0.02)';
        childCard.style.border = '1px solid var(--border-color)';
        childCard.style.borderRadius = '8px';
        childCard.style.marginBottom = '15px';
        
        childCard.innerHTML = `
          <h4 style="color: var(--accent-color); font-size: 1rem; margin-bottom: 12px; display: flex; justify-content: space-between;">
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
              <input type="number" class="compact-input child-age" placeholder="${lang === 'ar' ? 'العمر' : 'Age'}">
            </div>
            <div class="compact-item">
              <label class="compact-label">${lang === 'ar' ? 'الهوايات / الاهتمامات' : 'Hobbies / Interests'}</label>
              <input type="text" class="compact-input child-hobbies" placeholder="${lang === 'ar' ? 'الرسم، الألعاب، إلخ...' : 'Drawing, gaming, etc...'}">
            </div>
            <div class="compact-item" style="grid-column: span 2;">
              <label class="compact-label">${lang === 'ar' ? 'متطلبات خاصة بالدراسة أو الترفيه في الغرفة' : 'Special study or entertainment requirements in the room'}</label>
              <input type="text" class="compact-input child-needs" placeholder="${lang === 'ar' ? 'مكتب دراسي، مساحة تخزين ألعاب إضافية، سرير مدمج' : 'Study desk, extra toy storage, built-in bed'}">
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
    payload['الديانة'] = document.getElementById('religion').value;
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
          payload.children.push({
            name: block.querySelector('.child-name').value,
            gender: block.querySelector('.child-gender').value,
            age: block.querySelector('.child-age').value,
            hobbies: block.querySelector('.child-hobbies').value,
            needs: block.querySelector('.child-needs').value
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
        storage: document.getElementById('masterStorage').value,
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
