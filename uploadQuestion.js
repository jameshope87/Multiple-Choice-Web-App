import fs from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Load your service account key file from Firebase Console
const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const questions = JSON.parse(fs.readFileSync('./questions.json', 'utf8'));

async function uploadQuestions() {
  const batch = db.batch();
  const collectionRef = db.collection('questions');

  questions.forEach((question) => {
    const docRef = collectionRef.doc(); // auto-generate ID
    batch.set(docRef, question);
  });

  await batch.commit();
  console.log('Questions uploaded!');
}

uploadQuestions();
