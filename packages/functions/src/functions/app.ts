// tslint:disable-next-line: no-implicit-dependencies
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const fireApp = admin.initializeApp();

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});
