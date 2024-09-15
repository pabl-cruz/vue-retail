// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
//importar firestore para acceder e interactuar con base de datos
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAEMrRrxgKgTgNggoBFlmEGpCbZpK2u-yQ',
  authDomain: 'vue-retail-ca879.firebaseapp.com',
  projectId: 'vue-retail-ca879',
  storageBucket: 'vue-retail-ca879.appspot.com',
  messagingSenderId: '750455536155',
  appId: '1:750455536155:web:b1d0671e93e1d9146896be'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
//crear constante con base de datos
const db = getFirestore(app)
export { db }
