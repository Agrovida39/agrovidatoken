import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCHLOl6hWdHsBJ4kMGpAuU8PnKJ6TzAocc",
  authDomain: "agrovida-1c78b.firebaseapp.com",
  projectId: "agrovida-1c78b",
  storageBucket: "agrovida-1c78b.appspot.com",
  messagingId: "1012345678901",
  appId: "1:1012345678901:web:abc123"
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
export const db = getFirestore(app)
