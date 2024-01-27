importScripts(
  "https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging-compat.js"
);



  const firebaseConfig = {
    apiKey: "AIzaSyBeqNaBSWNawVhCfgjsacXpUy6QNjH2N9I",
    authDomain: "shopping-17cca.firebaseapp.com",
    projectId: "shopping-17cca",
    storageBucket: "shopping-17cca.appspot.com",
    messagingSenderId: "196786989364",
    appId: "1:196786989364:web:a476c6d11928b148819d61",
    measurementId: "G-6DWR7TZWKK"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  const messaging = firebase.messaging();
  
  self.addEventListener("push", (event) => {
    const payload = event.data.json();
    console.log(
      "🚀 ~ file: firebase-messaging-sw.js:24 ~ self.addEventListener ~ payload:",
      payload
    );
  
    const notificationTitle = payload.notification.title;
    console.log(
      "🚀 ~ file: firebase-messaging-sw.js:31 ~ self.addEventListener ~ notificationTitle:",
      notificationTitle
    );
    const notificationOptions = {
      body: payload.notification.body,
    };
    console.log(
      "🚀 ~ file: firebase-messaging-sw.js:35 ~ self.addEventListener ~ notificationOptions:",
      notificationOptions
    );
  
    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  });