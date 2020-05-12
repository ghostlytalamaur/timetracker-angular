import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// const app = admin.initializeApp();

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

export const testCallable = functions.https.onCall((data, context) => {
  return {
    data,
    uid: context?.auth?.uid,
  }
});