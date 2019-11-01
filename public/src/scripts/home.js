var active = document.querySelector("#active");
var username=localStorage.getItem("loginUserName");
var userimg=localStorage.getItem("loginUser");

active.innerHTML = `
<img src=${userimg} class="responsive-img" width="100">
<span class="valign-wrapper title">${username}</span>
<a class="secondary-content"><i class="material-icons" id="logOut">lock_outline</i></a>

`

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

company =()=>{
    window.location.assign("companies.html");
}

user=()=>{
    window.location.assign("user.html");
}