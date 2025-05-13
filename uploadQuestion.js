import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
// Load your service account key file from Firebase Console

import serviceAccount from './serviceAccountKey.js';
const filePath = path.resolve('./questions.json');
const fileContents = await readFile(filePath, 'utf-8');
const rawQuestions = JSON.parse(fileContents);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const collectionRef = db.collection('questions');


function generateId(topic) {
  const randomPart = Math.random().toString(36).substring(2,6);
  return `${topic}-${randomPart}`;
}

async function uploadQuestions() {
  const usedIds = new Set();
  const updatedQuestions = [];

  for (let question of rawQuestions) {
    let id = question.id;

    // If no ID or ID already exists, generate a new one
    if (!id || usedIds.has(id)) {
      let newId;
      let attempt = 0
      do {
        newId = generateId(question.topic || "misc");
        attempt++;
      } while (usedIds.has(newId) && attempt < 10);

      if (usedIds.has(newId)) {
        console.error(`❌ Could not generate unique ID for: ${question.question}`);
        continue;
      }

      id = newId;
      question.id = id;
    }

    usedIds.add(id);
    updatedQuestions.push(question);

    // Upload using the ID as the document key
    await collectionRef.doc(id).set(question, { merge: true });
    console.log(`✅ Uploaded: ${question.question} (ID: ${id})`);
  }
  // Save the updated questions list (with ids) back to the file
  await writeFile('./questions.json', JSON.stringify(updatedQuestions, null, 2));
  console.log('📝 questions.json updated with new IDs.');
  console.log("🎉 Upload complete.");
}

uploadQuestions().catch(console.error);
