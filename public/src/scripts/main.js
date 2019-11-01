if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./firebase-messaging-sw.js")
      .then(response => console.log("Service worker registered"))
      .catch(err => console.log("error =>", err));
  }
  
  

var status = localStorage.getItem("login");

console.log(status);

if (status == 1) {
    location.assign("src/pages/home.html");
}

var loader = document.getElementById("loader");


var loginWithFb=async()=>{
    var provider = new firebase.auth.FacebookAuthProvider();
    try{
        var res=await firebase.auth().signInWithPopup(provider);
        loader.innerHTML = `<img src="src/images/Spinner.gif" id="loader" width="50" />`;
        console.log(res);
        // The signed-in user info.
        var user = res.user;
       
       

        
        console.log(user);
        console.log(user.displayName);
        console.log(user.photoURL);

        localStorage.setItem("loginUser",user.photoURL);
        localStorage.setItem("loginUserName",user.displayName);
        localStorage.setItem("info",JSON.stringify(user));
         localStorage.setItem("uid",user.uid);
        localStorage.setItem("login",JSON.stringify(1));



        async function getUserTokens() {
          try {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
              const token = await firebase.messaging().getToken();
              localStorage.setItem("token",token);
        
              console.log("token =>", token);
              await firebase.firestore().collection('users').doc(user.uid).set({
                firstname:user.displayName,
                email:user.email,
                imageURL:user.photoURL,
                token:localStorage.getItem('token')
    
            });
            setTimeout(()=>{
              window.location.assign("src/pages/home.html")
          },2000);
            } else {
              swal("Permission Required", "Please allow notifications to continue", "error");
            }
          } catch (e) {
            console.log("e =>", e);
          }
        }
        
        getUserTokens();  
    }catch(e){
      swal("Error", e.message, "error");
        console.log(e.message);
    }
    
}
loader.innerHTML = "";