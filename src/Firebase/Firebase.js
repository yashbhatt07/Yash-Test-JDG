
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBeqNaBSWNawVhCfgjsacXpUy6QNjH2N9I",
  authDomain: "shopping-17cca.firebaseapp.com",
  projectId: "shopping-17cca",
  storageBucket: "shopping-17cca.appspot.com",
  messagingSenderId: "196786989364",
  appId: "1:196786989364:web:a476c6d11928b148819d61",
  measurementId: "G-6DWR7TZWKK"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const TokenHandler = async () => {
  Notification.requestPermission().then(Permission => {
    if (Permission === "granted") {
      console.log("Permision granted");
      return getToken(messaging, {
        vapidKey:
          "BG2jknNxILMQQiV9OfHxm2_kbjpaI66xsoHIIqYjwsy6ypjV1IdbFFg-hZewbpAM_eqbk4gvhcaBj8AdKI4Zzz4",
      })
        .then((currentToken) => {
          if (currentToken) {
            console.log("current token for client: ", currentToken);
          } else {
            console.log(
              "No registration token available. Request permission to generate one."
            );
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
        });
    } else {
      console.log("Permision not granted");
      alert("Please allow permision from browser to get notification and re-load the page")

    }
  })
};

TokenHandler()
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("🚀 ~ file: Firebase.jsx:49 ~ onMessage ~ payload:", payload);
      resolve(payload);
    });
  });
