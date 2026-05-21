const { initializeApp } = require("firebase/app");
const { getAuth, signInAnonymously } = require("firebase/auth");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyApni-0fBXX-AxiyyESDWSSWAWExMSzafo",
  authDomain: "hot-spicy-fgh.firebaseapp.com",
  projectId: "hot-spicy-fgh",
  storageBucket: "hot-spicy-fgh.firebasestorage.app",
  messagingSenderId: "180458543251",
  appId: "1:180458543251:web:c7c62b84bb67cf4a441566",
};

async function run() {
  try {
    console.log("Initializing Firebase app...");
    const app = initializeApp(firebaseConfig);
    console.log("Initializing Auth...");
    const auth = getAuth(app);
    console.log("Initializing Firestore...");
    const db = getFirestore(app);

    // console.log("Signing in anonymously...");
    // const userCredential = await signInAnonymously(auth);
    // console.log("Anonymous Auth success! User ID:", userCredential.user.uid);

    console.log("Fetching orders collection...");
    const ordersCol = collection(db, "orders");
    const snapshot = await getDocs(ordersCol);
    console.log(`Successfully fetched ${snapshot.docs.length} orders.`);
    snapshot.forEach((doc) => {
      console.log("Order ID:", doc.id);
      console.log("Data:", JSON.stringify(doc.data(), null, 2));
    });
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

run();
