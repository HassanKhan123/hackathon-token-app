const searchBox = document.getElementById('autocomplete');
const searchBtn = document.getElementById('search');
var loader1 = document.getElementById("loader");
const modal1 = document.getElementById('modal1');
var username = localStorage.getItem("loginUserName");
var userimg = localStorage.getItem("loginUser");
var active = document.querySelector("#active");
// var cancelBtn=document.getElementById("cancel");

active.innerHTML = `
<img src=${userimg} class="responsive-img" width="100">
<span class="valign-wrapper title">${username}</span>
<a class="secondary-content"><i class="material-icons" id="logOut">lock_outline</i></a>

`;

var log=document.getElementById('logOut');

log.addEventListener('click',logOut);
async function logOut(){
    console.log("logout");
    try{
        // loader.innerHTML = `<img src="../images/load.gif" id="loader" width="50" />`;
        var response= await firebase.auth().signOut();
        swal("Successfully LogOut", "You are now redirected to login Page", "success");
        // loader.innerHTML ="";
        localStorage.setItem("login",JSON.stringify(2));
        localStorage.setItem("loginUser","");
        localStorage.setItem("loginUserName","");
        localStorage.setItem("info","");
        localStorage.setItem("uid","");
        localStorage.setItem("token","");
        
        
        setTimeout(()=>{
            window.location.assign("../../index.html")
        },2000);
    }catch(e){
        swal("Error", e.message , "error");
        // loader.innerHTML ="";
    }
}
const res = document.getElementById("searchRes");

searchBtn.addEventListener('click', async () => {
  res.innerHTML = "";
  console.log(searchBox.value);
  var data = await firebase.firestore().collection('companies').where('company_name', '==', searchBox.value).get();
  // var res=data.docs;
  // console.log(res)
  loader1.innerHTML = `<img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" id="loader" width="50" />`;
  console.log(loader1.innerHTML);

  if (data.docs.length === 0) {
    res.innerHTML = `
       
        <div class="col s12 m6">
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title">No Such Companies Exists</span>
              
          </div>
        </div>
     
        `;

    loader1.innerHTML = "";
  }
  else {

    data.docs.forEach(item => {
      console.log(item.id);
      localStorage.setItem("companyID", item.id);
      res.innerHTML += `
          
            <div class="col s12 m12 l12">
              <div class="card blue-grey darken-1">
                <div class="card-content white-text">
                  <span class="card-title">${item.data().company_name}</span>
                  <p>Since : ${item.data().since}</p>
                  <p>Timings: ${item.data().timing}</p>
                  <p>Total Number of Tokens: ${item.data().tokenQuantity}</p>

                </div>
                <div class="card-action">
                <button onClick=getToken() class="btn">Get Token</button>
                
                </div>
              </div>
            </div>
         
            `;

      loader1.innerHTML = "";
    })
  }

})

getToken = async () => {
  var uid = localStorage.getItem("companyID");

  var userID = localStorage.getItem("uid");

  var check = await firebase.firestore().collection('companies').doc(uid).get();

  var time=check.data().tokenDuration;
  console.log(time);


 

  async function update() {
    var inc=await firebase.firestore().collection('companies').doc(uid).get();
    var quan=inc.data().tokenQuantity;

    if(quan == 0){
      swal("No More Token Left for today", "Please take token tomorrow", "success");
    }
    else{
      var data = await firebase.firestore().collection('companies').doc(uid).set({
        TokenTakenBy: firebase.firestore.FieldValue.arrayUnion(userID),
        tokenQuantity: firebase.firestore.FieldValue.increment(-1)
      }, {
        merge: true
      });
      swal("You got your token", "Now wait for your turn", "success");
      // Push.create(username+" get your token");
      async function sendNotification() {
        const body = {
          notification: {
            title: "Token taken",
            body: `${username} takes your token`,
            click_action: "http://localhost:8807/",
            icon:
              "http://www.desientrepreneurs.com/wp-content/uploads/2018/04/push-notifications-icon.png"
          },
          to: check.data().companyOwnerToken
           
        };
      
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "key=AAAAjKRkeMA:APA91bGldGsk9zgTxUpVQ9xvTLTbJYliwzg3zpwKi1fC5W0G3ImAipQbGyBYOAExUSlxSxUMIf_6daJE9PJonVsbson-wRns6cwlYCruNAk7rToBe0Gct5gwPzGSqbyfLk1toQkZPdci"
          },
          body: JSON.stringify(body)
        };
      
        try {
          fetch("https://fcm.googleapis.com/fcm/send", options);
        } catch (e) {
          console.log("e =>", e);
        }
      }
    
    

    sendNotification();

    // Push.create(`${username} get your token`);
    // var Cbtn=document.createElement('button');
    // Cbtn.innerHTML="Cancel Token";
   
    // Cbtn.setAttribute('class','btn');
    // Cbtn.setAttribute('onClick',"cancelToken()");
    
    //  function cancelToken(){
    //     console.log("cancel token");
    //   };
 
    // cancelBtn.append(Cbtn);
    
   
    function countdown(minutes) {
      var seconds = 60;
      var mins = minutes
      function tick() {
          //This script expects an element with an ID = "counter". You can change that to what ever you want. 
          var counter = document.getElementById("counter");
          var current_minutes = mins-1
          seconds--;
          counter.innerHTML = current_minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
          

          if(current_minutes.toString() == 9 && String(seconds) == 59){
            Push.create("You have appointment in 10 minutes");
          }

          if( seconds > 0) {
              t=setTimeout(tick, 1000);
              
          }
         
           else {
              if(mins > 1){
                  countdown(mins-1);           
              }
              // else if(mins ==  "8:59"){
              //   Push.create("You have appointment in 9 minutes");
              // }
              
              else if(mins === 0){
                clearTimeout(t);
              }
              
          }
      }
      tick();
    }
  }
  countdown(time);
  }
  var flag = false;
  if(!check.data().TokenTakenBy){
    
    update();
  }
  for(var i=0; i < check.data().TokenTakenBy.length;i++){
    if(check.data().TokenTakenBy[i] == userID){
      console.log(check.data().TokenTakenBy);
      console.log(userID);
      flag = true;
      break;
    }
  }
  // check.data().TokenTakenBy.forEach(key => {
  //   if (key == userID) {

  //     console.log(check.data().TokenTakenBy);
  //     console.log(userID);
  //     flag = true;
  //     break;


  //   }
  // })

  if (flag) {
    swal("You alreday take your token", "Please wait for your turn", "success");
  }
  else {

   

    update();
  }


}


// getTokenUsers();
function backToHome(){
    window.location.assign("home.html");
}


