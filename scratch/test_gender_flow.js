const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, '..', 'database');
const DB_FILE = path.join(DB_DIR, 'submissions.json');

function readDatabase() {
  if (!fs.existsSync(DB_FILE)) return [];
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

// Let's run a test by sending a post request to the server using fetch if the server is running, or verify direct db entry
async function testSubmission() {
  const payload = {
    "الاسم الكامل": "منى أحمد",
    "رقم الجوال": "0501234567",
    "البريد الإلكتروني": "mona@example.com",
    "المسمى الوظيفي": "مهندسة برمجيات",
    "العمر": "30",
    "الجنسية": "سعودية",
    "الديانة": "الإسلام",
    "الجنس": "أنثى",
    "الحالة الاجتماعية": "متزوج / متزوجة",
    "wife": {
      "name": "أحمد محمد",
      "age": "32",
      "works": "نعم",
      "jobTitle": "مدير تسويق",
      "needsOffice": "نعم",
      "preferredColors": "أزرق، رمادي",
      "lifestyle": "هادئ، يحب القراءة"
    },
    "children": [],
    "unitType:": "شقة سكينة",
    "approxArea:": "150",
    "عنوان المشروع:": "الرياض، الياسمين"
  };

  try {
    const response = await fetch('http://localhost:3001/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Submission Success! Received:', data);
      
      // Let's load database and inspect the last entry
      const db = readDatabase();
      const lastEntry = db[db.length - 1];
      console.log('Last Entry in Database:', JSON.stringify(lastEntry, null, 2));
      
      if (lastEntry.clientInfo.gender === 'أنثى') {
        console.log('✓ SUCCESS: Gender correctly saved as "أنثى"!');
      } else {
        console.error('✗ ERROR: Gender mismatch. Expected "أنثى", got:', lastEntry.clientInfo.gender);
      }

      if (lastEntry.wifeInfo && lastEntry.wifeInfo.name === 'أحمد محمد') {
        console.log('✓ SUCCESS: Partner Info correctly saved in wifeInfo structure!');
      } else {
        console.error('✗ ERROR: Partner Info mismatch. Expected "أحمد محمد", got:', lastEntry.wifeInfo);
      }
    } else {
      console.error('✗ ERROR: Server response not OK:', response.statusText);
    }
  } catch (err) {
    console.error('✗ ERROR: Failed to fetch:', err.message);
  }
}

testSubmission();
