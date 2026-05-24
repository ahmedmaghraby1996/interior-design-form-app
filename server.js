const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
let db = null;

async function getDb() {
  if (db) return db;
  if (!MONGODB_URI) throw new Error('MONGODB_URI environment variable is not set.');
  const client = new MongoClient(MONGODB_URI, {
    tls: true,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });
  await client.connect();
  db = client.db('interior_design');
  return db;
}

async function submissions() {
  const d = await getDb();
  return d.collection('submissions');
}

// Get all submissions
app.get('/api/submissions', async (_req, res) => {
  try {
    const col = await submissions();
    const all = await col.find({}, {
      projection: {
        id: 1, submittedAt: 1, analysis: 1,
        'clientInfo.fullName': 1, 'clientInfo.phone': 1,
        'projectInfo.unitType': 1, 'projectInfo.approxArea': 1, 'projectInfo.budget': 1
      }
    }).sort({ submittedAt: -1 }).toArray();

    const summaries = all.map(s => ({
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get a single submission
app.get('/api/submissions/:id', async (req, res) => {
  try {
    const col = await submissions();
    const submission = await col.findOne({ id: req.params.id });
    if (!submission) return res.status(404).json({ error: 'Submission not found' });
    res.json(submission);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Submit a new request
app.post('/api/submit', async (req, res) => {
  try {
    const col = await submissions();
    const rawData = req.body;

    const submission = {
      id: 'req_' + Math.random().toString(36).substring(2, 11),
      submittedAt: new Date().toISOString(),
      clientInfo: {
        fullName: rawData['الاسم الكامل'] || '-',
        phone: rawData['رقم الجوال'] || '-',
        email: rawData['البريد الإلكتروني'] || '-',
        jobTitle: rawData['المسمى الوظيفي'] || '-',
        age: rawData['العمر'] || '-',
        nationality: rawData['الجنسية'] || '-',
        religion: rawData['الديانة'] || '-',
        gender: rawData['الجنس'] || '-',
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
        wfh: rawData['هل تعمل من المنزل؟'] || '-',
        guests: rawData['هل تستقبل ضيوف باستمرار؟'] || '-',
        atmosphere: rawData['هل تفضل الأجواء:'] || '-',
        spaceStyle: rawData['هل تفضل المساحات:'] || '-',
        preferredStyle: rawData['الطراز المفضل'] || '-',
        spatialFeel: rawData['هل تفضل الفراغات:'] || '-',
        materials: rawData['الخامات المفضلة'] || [],
        appliances: rawData['اختيارات الأجهزة'] || [],
        lighting: rawData['الإضاءة المفضلة'] || '-',
        furnitureType: rawData['نوع الأثاث المفضل'] || '-',
        favoriteColors: rawData['الألوان المفضلة'] || '-',
        dislikedColors: rawData['الألوان غير المفضلة'] || '-'
      },
      rooms: rawData.rooms || {},
      finalThoughts: {
        guestFeel: rawData['كيف تريد أن يشعر الضيف عند دخول منزلك؟'] || '-',
        homeFeel: rawData['كيف تريد أن تشعر أنت وعائلتك داخل منزلك؟'] || '-',
        idealHomeThreeWords: rawData['صف منزلك المثالي في ثلاث كلمات'] || '-',
        dislikedDesignElements: rawData['ما هو أكثر شيء لا تريد رؤيته في التصميم؟'] || '-',
        priority: rawData['ما هي الأولوية الكبرى بالنسبة لك؟'] || '-',
        hasReferenceImages: rawData['هل لديك صور مرجعية أو Pinterest ملهمة؟'] || '-'
      },
      raw: rawData,
      analysis: null
    };

    await col.insertOne(submission);
    res.status(201).json({ success: true, id: submission.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Run Gemini Analysis
app.post('/api/submissions/:id/analyze', async (req, res) => {
  try {
    const col = await submissions();
    const submission = await col.findOne({ id: req.params.id });
    if (!submission) return res.status(404).json({ error: 'Submission not found' });

    const apiKey = req.body.apiKey || req.headers['x-gemini-key'] || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: 'Gemini API Key is required.' });
    }

    const prompt = `
You are an expert, high-end interior designer and architect. I will give you the details of a client who has filled out our residential interior design questionnaire.
Please analyze their answers and generate a comprehensive, premium design brief and design recommendation report in Arabic (RTL compatible).

Here is the client's information:
- Client Name: ${submission.clientInfo.fullName}
- Job Title: ${submission.clientInfo.jobTitle}
- Age: ${submission.clientInfo.age} | Gender: ${submission.clientInfo.gender} | Marital Status: ${submission.clientInfo.maritalStatus}
- Project Details: ${submission.projectInfo.unitType} (Approx: ${submission.projectInfo.approxArea}), Address: ${submission.projectInfo.address}
- Household: ${submission.projectInfo.familyMembers} members. Elderly: ${submission.projectInfo.hasElderly}. Pets: ${submission.projectInfo.hasPets}
- Budget: ${submission.projectInfo.budget} (${submission.projectInfo.budgetPriority}) | Timeline: ${submission.projectInfo.timeline}
- Preferred Style: ${submission.preferences.preferredStyle}
- Preferred Materials: ${Array.isArray(submission.preferences.materials) ? submission.preferences.materials.join(', ') : submission.preferences.materials}
- Appliances: ${Array.isArray(submission.preferences.appliances) ? submission.preferences.appliances.join(', ') : submission.preferences.appliances}
- Preferred Lighting: ${submission.preferences.lighting} | Furniture type: ${submission.preferences.furnitureType}
- Favorite Colors: ${submission.preferences.favoriteColors} | Disliked Colors: ${submission.preferences.dislikedColors}
- Lifestyle: Works from Home: ${submission.preferences.wfh}. Guests frequency: ${submission.preferences.guests}. Atmosphere: ${submission.preferences.atmosphere}.
- Three words for ideal home: "${submission.finalThoughts.idealHomeThreeWords}"
- Desired vibe at home: "${submission.finalThoughts.homeFeel}"
- Desired guest impression: "${submission.finalThoughts.guestFeel}"
- What they hate in design: "${submission.finalThoughts.dislikedDesignElements}"

Life Partner Details:
${submission.wifeInfo ? JSON.stringify(submission.wifeInfo) : 'No specific life partner details submitted'}

Children Details:
${submission.childrenInfo && submission.childrenInfo.length > 0 ? JSON.stringify(submission.childrenInfo) : 'No children details submitted'}

Detailed Room Preferences:
${JSON.stringify(submission.rooms)}

Please analyze these design inputs and write an elegant interior design report in Arabic with the following sections:
1. **الملخص التنفيذي لشخصية العميل ونمط حياته (Client Persona & Lifestyle Summary)**
2. **التوجه التصميمي الموصى به (Recommended Design Concept)**
3. **لوحة الألوان والخامات المقترحة (Suggested Color Palette & Materials Moodboard)**
4. **تخطيط الفراغات وتوزيع الإضاءة (Space Planning & Lighting Layout)**
5. **التحديات وحلولها المقترحة (Challenges & Special Solutions)**
6. **دراسة جدوى الميزانية والجدول الزمني (Budget & Timeline Feasibility)**

Format your response in beautiful, clean Markdown. Use clear Arabic headings, bullet points, and bold styling. Keep the tone professional, inspiring, and design-focused.
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 4000 }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `Gemini API Error: ${errText}` });
    }

    const resultJson = await response.json();
    const candidateText = resultJson?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      return res.status(500).json({ error: 'Gemini did not return any content.' });
    }

    const analysis = { generatedAt: new Date().toISOString(), reportText: candidateText };
    await col.updateOne({ id: req.params.id }, { $set: { analysis } });

    res.json({ success: true, analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a submission
app.delete('/api/submissions/:id', async (req, res) => {
  try {
    const col = await submissions();
    const result = await col.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Submission not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
