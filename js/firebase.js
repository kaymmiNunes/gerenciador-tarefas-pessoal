import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDWqjBmff7hUIBBjJyqDLUUqe5a1tBOGMI",
  authDomain: "gerenciador-tarefass.firebaseapp.com",
  databaseURL: "https://gerenciador-tarefass-default-rtdb.firebaseio.com",
  projectId: "gerenciador-tarefass",
  storageBucket: "gerenciador-tarefass.firebasestorage.app",
  messagingSenderId: "651785410100",
  appId: "1:651785410100:web:a2b4604e4e27fe23a19c61"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };