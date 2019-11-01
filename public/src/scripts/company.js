var formEl = document.querySelector("form");

var name = document.getElementById("name");
var since = document.getElementById("since");
var time = document.getElementById("time");
var file = document.querySelector('input[type=file]');
var active1 = document.querySelector("#active1");
var username = localStorage.getItem("loginUserName");
var userimg = localStorage.getItem("loginUser");
var uid=localStorage.getItem("uid");

active1.innerHTML = `
<img src=${userimg} class="responsive-img" width="100">
<span class="valign-wrapper title">${username}</span>
<a class="secondary-content"><i class="material-icons" id="logOut">lock_outline</i></a>
`;
var list = document.getElementsByClassName("companiesList")[0];
var loader = document.getElementById("loader");



formEl.addEventListener("submit", addCompany);

var companyOwnerID = localStorage.getItem('uid');

var log = document.getElementById('logOut');

log.addEventListener('click', logOut);
async function logOut() {
    console.log("logout");
    try {
        // loader.innerHTML = `<img src="../images/load.gif" id="loader" width="50" />`;
        var response = await firebase.auth().signOut();
        swal("Successfully LogOut", "You are now redirected to login Page", "success");
        // loader.innerHTML ="";
        localStorage.setItem("login", JSON.stringify(2));
        localStorage.setItem("loginUser", "");
        localStorage.setItem("loginUserName", "");
        localStorage.setItem("info", "");
        localStorage.setItem("uid","");
        localStorage.setItem("token","");


        setTimeout(() => {
            window.location.assign("../../index.html")
        }, 2000);
    } catch (e) {
        swal("Error", e.message, "error");
        // loader.innerHTML ="";
    }
}
async function uploadImg(blob) {
    try {
        const name = Math.random().toString();
        await firebase.storage().ref().child(`${name}.png`).put(blob);
        const url = firebase.storage().ref().child(`${name}.png`).getDownloadURL();
        return url;
    } catch (error) {
        throw error;
    }
}

function previewFile(arr) {

    // const name = 
    const promisesArr = [];

    // const promisesArr = arr.map(item => );

    for (var item of arr) {
        promisesArr.push(uploadImg(item));
    }
    return Promise.all(promisesArr);




    // const promisesArr = arr.map(blob => {
    // const name = "asd";
    // return firebase.storage().ref().child(`${name}.png`).put(blob);
    // });

    // const url = await firebase.storage().ref().child(`${name}.png`).getDownloadURL();
    // return url;




}


async function addCompany(e) {
    e.preventDefault();

    name = document.getElementById("name").value;
    since = document.getElementById("since").value;
    time = document.getElementById("time").value;
    var location = localStorage.getItem('place');
    var venue = localStorage.getItem('venue');
    //  post_img = localStorage.getItem("postImg");

    loader.innerHTML = `<img src="../images/Spinner.gif" id="loader" width="50" />`;
    // if (title == "" || description == "") {
    //     swal("Cannot Posted", "Please Provide title or description", "error");
    //     loader.innerHTML = "";
    // }
    // else {

    try {

        var certImgs = await previewFile(file.files);
        var getData=await firebase.firestore().collection("users").doc(uid).get();
        console.log(getData);
        var getTok=getData.data().token;
        console.log(getTok);
        await firebase.firestore().collection("companies").add({
            company_name: name,
            since,
            timing: time,
            certificates: certImgs,
            companyOwnerID,
            location,
            venue,
            companyOwnerToken:getTok

        });

        swal("Company Added Successfully", "You can now add tokens", "success");
        loader.innerHTML = "";




    } catch (e) {
        swal("Error", e.message, "error");
        loader.innerHTML = "";
        console.log(e.message)
    }



}





// }

async function addCom() {
    await firebase.firestore().collection('companies').onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            if (change.type == "added") {
                list.innerHTML += `
               <div class="row">
                    <div class="col s12 m12 l12">
                        <div class="card blue-grey darken-1">
                            <div class="card-content white-text">
                                <span class="card-title">${change.doc.data().company_name}</span>
                                <p>Since : ${change.doc.data().since}</p>
                                <p>Timings : ${change.doc.data().timing}</p>
                                <p>Location : ${change.doc.data().location}</p>
                                <p>Venue : ${change.doc.data().venue}</p>


                                

    
                            </div>
                            <div class="card-action">
                               
                                <button data-target="modal1" class="btn modal-trigger"  id="${change.doc.id}">Add Token</button>
                                <a data-target="modal2" class="btn modal-trigger users"  id="${change.doc.id}">See All Users</a>
                              
                            </div>
                        </div>
                    </div>
                </div>`
            }

        })
    })
}
addCom();


var divEl = document.querySelector('.companiesList');

divEl.addEventListener('click', async event => {

    if (event.target.tagName === 'BUTTON') {
        const id = event.target.getAttribute('id');
        localStorage.setItem("cid", id);

        const checkID=await firebase.firestore().collection('companies').doc(id).get();
        if(checkID.data().companyOwnerID != uid){
            event.target.setAttribute('data-target','');
            swal("This can't be done", "You are not a owner of this company", "error");
        }
        



    }
    else if (event.target.tagName === 'A') {
        const id = event.target.getAttribute('id');
        // var res = await firebase.firestore().collection('companies').where("Avatar", "==", "[]").get();
        var res = await firebase.firestore().collection('companies').doc(id).get();

        collection.innerHTML = "";
        if (!res.data().TokenTakenBy) {
            collection.innerHTML = `<h3>No user has taken your token</h3>`;

        }
        else {
            collection.innerHTML = "";

            res.data().TokenTakenBy.forEach(user => {

                async function getToken() {
                    var res = await firebase.firestore().collection('users').doc(user).get();
                    console.log(res.data());
                    collection.innerHTML += `
                                    <li class="collection-item avatar">
                                        <img src="${res.data().imageURL}" alt="" class="circle">
                                         <span class="title">${res.data().firstname}</span>
                                         <br/>
                                         <span class="title">${res.data().email}</span>
                              </li>
                                `
                }

                getToken();



                // getRes.docs.forEach(item=>{

                //     collection.innerHTML += `
                //                 <li class="collection-item avatar">
                //                     <img src="${item.data().imageURL}" alt="" class="circle">
                //                      <span class="title">${item.data().firstname}</span>
                //           </li>
                //             `
                // })




            })
        }
    }
})



var myForm = document.getElementById("myForm");

myForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    var num = document.getElementById('tnum');
    var dur = document.getElementById('duration')
    console.log(num.value);
    console.log(dur.value);
    num = Number(num.value);
    dur = Number(dur.value);
    var cId = localStorage.getItem('cid');
    console.log(cId);

    await firebase.firestore().collection('companies').doc(cId).set({
        tokenQuantity: num,
        tokenDuration: dur
    }, {
        merge: true
    })




    document.getElementById("myForm").reset();
})
// addTokenInfo = async () => {


// }

var compID = localStorage.getItem('companyID');
var collection = document.querySelector('.modal-content ul');


async function getTokenUsers() {
    // var res=await firebase.firestore().collection('companies').where("Avatar","==","[]").get();
    // console.log(res.docs.length);

    // if(res.data().Avatar){
    //     collection.innerHTML="";
    // }
    // else{

    //     res.data().Avatar.forEach(user=>{
    //         res.data().TokenTakenBy.forEach(name=>{

    //             collection.innerHTML+=`
    //                 <li class="collection-item avatar">
    //                     <img src="${user}" alt="" class="circle">
    //                      <span class="title">${name}</span>
    //             <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>
    //           </li>
    //             `
    //         })
    //     })
    // }

}


// collection.innerHTML+=`


// `
getTokenUsers();
function backToHome() {
    window.location.assign("home.html");
}