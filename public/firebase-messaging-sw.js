self.addEventListener("push", function(event) {
  console.log("Received a push message", event);
  var notification = event.data.json().notification;

  var title = notification.title;
  var body = notification.body;
  var url = notification.click_action;
  var icon = notification.icon;

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon
    })
  );
});



// Sending notification through google api

// async function sendNotification() {
//   const body = {
//     notification: {
//       title: "Woohoo worked!",
//       body: "Firebase is awesome",
//       click_action: "http://localhost:5500/",
//       icon:
//         "http://www.desientrepreneurs.com/wp-content/uploads/2018/04/push-notifications-icon.png"
//     },
//     to:"f3FFk3og6Jc:APA91bGk_zGVOYDjaWu4q10B0j4pzG8FB-nNgGChK5winhcpABOXKbMY4ZnRnZ8p1HEFXwhrgv33Zv6DwoWlq9tAA3CuvACu9RuGL5Z92TyYZoWqpbutDJMj-AZfWjjD4ySKN1JIXKMU"
     
//   };

//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization:
//         "key=AAAAjKRkeMA:APA91bGldGsk9zgTxUpVQ9xvTLTbJYliwzg3zpwKi1fC5W0G3ImAipQbGyBYOAExUSlxSxUMIf_6daJE9PJonVsbson-wRns6cwlYCruNAk7rToBe0Gct5gwPzGSqbyfLk1toQkZPdci"
//     },
//     body: JSON.stringify(body)
//   };

//   try {
//     fetch("https://fcm.googleapis.com/fcm/send", options);
//   } catch (e) {
//     console.log("e =>", e);
//   }
// }
// sendNotification();