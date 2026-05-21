const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Database File Path
const DB_DIR = process.env.VERCEL ? '/tmp' : path.join(__dirname, 'database');
const DB_FILE = path.join(DB_DIR, 'submissions.json');

// Ensure database folder and file exist
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
}

// Helper to read database
function readDatabase() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return [];
  }
}

// Helper to write database
function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}

// Get all submissions
app.get('/api/submissions', (req, res) => {
  const db = readDatabase();
  // Return summarized info (no need to send full 90 fields for list view)
  const summaries = db.map(s => ({
    id: s.id,
    name: s.clientInfo?.fullName || 'عميل غير معروف',
    phone: s.clientInfo?.phone || '-',
    unitType: s.projectInfo?.unitType || '-',
    area: s.projectInfo?.approxArea || '-',
    budget: s.projectInfo?.budget || '-',
    submittedAt: s.submittedAt,
    hasAnalysis: !!s.analysis
  }));
  res.json(summaries);
});

// Get a single submission details
app.get('/api/submissions/:id', (req, res) => {
  const db = readDatabase();
  const submission = db.find(s => s.id === req.params.id);
  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
  }
  res.json(submission);
});

// Submit a new request
app.post('/api/submit', (req, res) => {
  const db = readDatabase();
  
  const rawData = req.body;
  
  // Format submission data structure
  const submission = {
    id: 'req_' + Math.random().toString(36).substr(2, 9),
    submittedAt: new Date().toISOString(),
    // Organize client fields by category for easier retrieval
    clientInfo: {
      fullName: rawData['الاسم الكامل'] || rawData['ez5yln5AujjT'] || '-',
      phone: rawData['رقم الجوال'] || rawData['phone_number'] || '-',
      email: rawData['البريد الإلكتروني'] || rawData['email'] || '-',
      jobTitle: rawData['المسمى الوظيفي'] || '-',
      age: rawData['العمر'] || '-',
      nationality: rawData['الجنسية'] || '-',
      religion: rawData['الديانة'] || '-',
      maritalStatus: rawData['الحالة الاجتماعية'] || '-'
    },
    wifeInfo: rawData.wife || null,
    childrenInfo: rawData.children || [],
    projectInfo: {
      address: rawData['عنوان المشروع:'] || '-',
      unitType: rawData['نوع الوحدة:'] || '-',
      approxArea: rawData['مساحة الوحدة التقريبية:'] || '-',
      familyMembers: rawData['عدد أفراد الأسرة:'] || '-',
      hasElderly: rawData['هل يوجد كبار سن؟'] || '-',
      hasPets: rawData['هل يوجد حيوانات أليفة؟'] || '-',
      budget: rawData['الميزانية التقديرية'] || '-',
      budgetPriority: rawData['أولوية الميزانية'] || '-',
      timeline: rawData['مدة التنفيذ'] || '-',
      deadline: rawData['Deadline (إن وجد)'] || '-'
    },
    preferences: {
      homeRole: rawData['هل المنزل بالنسبة لك:'] || '-',
      hoursAtHome: rawData['كم ساعة تقضي داخل المنزل يوميًا؟'] || '-',
      wfh: rawData['هل تعمل من المنزل؟'] || '-',
      guests: rawData['هل تستقبل ضيوف باستمرار؟'] || '-',
      atmosphere: rawData['هل تفضل الأجواء:'] || '-',
      spaceStyle: rawData['هل تفضل المساحات:'] || '-',
      storage: rawData['هل تحتاج مساحات تخزين كبيرة؟'] || '-',
      hobbies: rawData['هل لديك هوايات؟'] || [],
      annoyances: rawData['ما أكثر شيء يزعجك في أي منزل؟'] || '-',
      favoriteSpot: rawData['ما أكثر مكان تحب الجلوس فيه؟ ولماذا؟'] || '-',
      preferredStyle: rawData['الطراز المفضل'] || '-',
      spatialFeel: rawData['هل تفضل الفраغات:'] || '-',
      materials: rawData['الخامات المفضلة'] || [],
      lighting: rawData['الإضاءة المفضلة'] || '-',
      furnitureType: rawData['نوع الأثاث المفضل'] || '-',
      favoriteColors: rawData['الألوان المفضلة'] || '-',
      dislikedColors: rawData['الألوان غير المفضلة'] || '-'
    },
    rooms: rawData.rooms || {},
    finalThoughts: {
      guestFeel: rawData['كيف تريد أن يشعر الضيف عند دخول منزلك؟'] || '-',
      dislikedDesignElements: rawData['ما أكثر شيء لا تريد رؤيته في التصميم؟'] || '-',
      idealHomeThreeWords: rawData['صف منزلك المثالي في ثلاث كلمات'] || '-',
      homeFeel: rawData['كيف تريد أن تشعر داخل منزلك؟'] || '-',
      priority: rawData['ما أهم شيء بالنسبة لك؟'] || '-',
      hasReferenceImages: rawData['هل لديك صور مرجعية أو Pinterest أو Instagram Inspiration؟'] || '-'
    },
    raw: rawData, // Keep raw submissions
    analysis: null
  };
  
  db.push(submission);
  writeDatabase(db);
  
  res.status(201).json({ success: true, id: submission.id });
});

// Run Gemini Analysis
app.post('/api/submissions/:id/analyze', async (req, res) => {
  const db = readDatabase();
  const subIdx = db.findIndex(s => s.id === req.params.id);
  
  if (subIdx === -1) {
    return res.status(404).json({ error: 'Submission not found' });
  }
  
  const submission = db[subIdx];
  
  // Resolve Gemini API key: prioritize request body, then header, then server environment env
  const apiKey = req.body.apiKey || req.headers['x-gemini-key'] || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(400).json({ error: 'Gemini API Key is required. Please set it in Settings or environment variables.' });
  }

  try {
    // Construct prompt based on user details
    const prompt = `
You are an expert, high-end interior designer and architect. I will give you the details of a client who has filled out our residential interior design questionnaire. 
Please analyze their answers and generate a comprehensive, premium design brief and design recommendation report in Arabic (RTL compatible).

Here is the client's information:
- Client Name: ${submission.clientInfo.fullName}
- Job Title: ${submission.clientInfo.jobTitle}
- Age: ${submission.clientInfo.age} | Marital Status: ${submission.clientInfo.maritalStatus}
- Project Details: ${submission.projectInfo.unitType} (Approx: ${submission.projectInfo.approxArea}), Address: ${submission.projectInfo.address}
- Household: ${submission.projectInfo.familyMembers} members. Elderly: ${submission.projectInfo.hasElderly}. Pets: ${submission.projectInfo.hasPets}
- Budget: ${submission.projectInfo.budget} (${submission.projectInfo.budgetPriority}) | Timeline: ${submission.projectInfo.timeline}
- Preferred Style: ${submission.preferences.preferredStyle}
- Preferred Materials: ${Array.isArray(submission.preferences.materials) ? submission.preferences.materials.join(', ') : submission.preferences.materials}
- Preferred Lighting: ${submission.preferences.lighting} | Furniture type: ${submission.preferences.furnitureType}
- Favorite Colors: ${submission.preferences.favoriteColors} | Disliked Colors: ${submission.preferences.dislikedColors}
- Lifestyle & Activities: Works from Home: ${submission.preferences.wfh}. Spends ${submission.preferences.hoursAtHome} hours at home. Guests frequency: ${submission.preferences.guests}. Atmosphere: ${submission.preferences.atmosphere}.
- Hobbies: ${Array.isArray(submission.preferences.hobbies) ? submission.preferences.hobbies.join(', ') : submission.preferences.hobbies}
- Key Pain Points in Home: ${submission.preferences.annoyances}
- Favorite Spot: ${submission.preferences.favoriteSpot}
- Three words for ideal home: "${submission.finalThoughts.idealHomeThreeWords}"
- Desired vibe at home: "${submission.finalThoughts.homeFeel}"
- Desired guest impression: "${submission.finalThoughts.guestFeel}"
- What they hate in design: "${submission.finalThoughts.dislikedDesignElements}"

Wife Details:
${submission.wifeInfo ? JSON.stringify(submission.wifeInfo) : 'No specific wife details submitted'}

Children Details:
${submission.childrenInfo && submission.childrenInfo.length > 0 ? JSON.stringify(submission.childrenInfo) : 'No children / kids details submitted'}

Detailed Room Preferences:
${JSON.stringify(submission.rooms)}

Please analyze these design inputs and write an elegant interior design report in Arabic with the following sections:
1. **الملخص التنفيذي لشخصية العميل ونمط حياته (Client Persona & Lifestyle Summary)**
   - Analyze how their daily routine, hobbies, and family composition will affect their home design. Highlight WFH needs, wife and kids requirements, and details about elderly/pets if applicable.
2. **التوجه التصميمي الموصى به (Recommended Design Concept)**
   - Recommend a specific design concept inspired by their preferred style (${submission.preferences.preferredStyle}) and ideal home description. Explain how it reflects their lifestyle.
3. **لوحة الألوان والخامات المقترحة (Suggested Color Palette & Materials Moodboard)**
   - Detail the primary, secondary, and accent colors to use (avoiding their disliked colors: ${submission.preferences.dislikedColors}). Recommend exact finishes and materials (woods, marbles, metals, fabrics, etc.) based on their preferences.
4. **تخطيط الفراغات وتوزيع الإضاءة (Space Planning & Lighting Layout)**
   - Provide concrete spatial advice for the major rooms (Living, Kitchen, Master Bedroom, Kids, Reception, etc.). Specify the lighting arrangement (e.g., layered cove lighting, pendant fixtures, warm or task lighting) based on their lighting preference: ${submission.preferences.lighting}.
5. **التحديات وحلولها المقترحة (Challenges & Special Solutions)**
   - Address key design challenges (e.g. storage needs, noise control, kids room safety, pet accommodations, budget constraints).
6. **دراسة جدوى الميزانية والجدول الزمني (Budget & Timeline Feasibility)**
   - Analyze if their budget (${submission.projectInfo.budget}) is realistic for their unit size (${submission.projectInfo.approxArea}) and timeline (${submission.projectInfo.timeline}). Offer guidance on phasing or budget optimization.

Format your response in beautiful, clean Markdown. Use clear Arabic headings, bullet points, and bold styling. Keep the tone professional, inspiring, and design-focused.
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    console.log(`Sending API request to Gemini for submission: ${submission.id}`);
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4000,
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API returned error status:', response.status, errText);
      return res.status(response.status).json({ error: `Gemini API Error: ${errText || 'Unknown error'}` });
    }

    const resultJson = await response.json();
    const candidateText = resultJson?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!candidateText) {
      return res.status(500).json({ error: 'Gemini did not return any contents. Check API response format.' });
    }

    // Save analysis to database
    submission.analysis = {
      generatedAt: new Date().toISOString(),
      reportText: candidateText
    };
    
    db[subIdx] = submission;
    writeDatabase(db);

    res.json({ success: true, analysis: submission.analysis });
  } catch (error) {
    console.error('Error contacting Gemini API:', error);
    res.status(500).json({ error: 'Server error while invoking Gemini API: ' + error.message });
  }
});

// Delete a submission
app.delete('/api/submissions/:id', (req, res) => {
  let db = readDatabase();
  const index = db.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Submission not found' });
  }
  db.splice(index, 1);
  writeDatabase(db);
  res.json({ success: true });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
