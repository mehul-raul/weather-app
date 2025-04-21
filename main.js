const urweather=document.querySelector("#yourweath")
const searchweather=document.querySelector("#searchweath")
const grantloca=document.querySelector(".grant-loca")
const searchloca=document.querySelector(".search-bar")
const loadin=document.querySelector(".loading")
const userweatherinfo=document.querySelector(".show-weather")
const grantbutton=document.querySelector(".grantaccbuttton")
const searchbox=document.querySelector(".typebox")
const errmsg=document.querySelector(".error")

let oldtab=urweather //urweather is nothing but text in html of that navbar
const API_KEY = "e51c969d9bfcca8a9d19895f692b3869";
oldtab.classList.add("current-tab") //adds css property for urweather

function switchtab (newtab){ // new tab as parameter
    if(oldtab!=newtab){//Checks if the new tab is different from the current tab/old tab 
        oldtab.classList.remove("current-tab");
        oldtab=newtab;
        oldtab.classList.add("current-tab");

        if(!searchloca.classList.contains("active")){
            userweatherinfo.classList.remove("active");
            grantloca.classList.remove("active");
            searchloca.classList.add("active");

        }
        else{
            searchloca.classList.remove("active");
            userweatherinfo.classList.remove("active");
            errmsg.classList.remove("active");
            getcordisesstorage();
        }
    }
}


urweather.addEventListener("click",()=>{
    switchtab(urweather);
})
searchweather.addEventListener("click",()=>{
    switchtab(searchweather);
}) 

 function getcordisesstorage(){
     const coordinates = localStorage.getItem("user-coordi");
    if(!coordinates){
         grantloca.classList.add("active");
     }
     else{
         const gotcoordi = JSON.parse(coordinates);
         fetchuserweather(gotcoordi);
     }
 }


async function fetchuserweather(gotcoordi){
    const{lat,lon}=gotcoordi;
    grantloca.classList.remove("active");
    loadin.classList.add("active");
    errmsg.classList.remove("active");

    try{
       const res = await fetch (`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
       const data = await res.json();

       if (res.status !== 200) {  // Check if the response status is not 200 (OK)
        throw new Error(data.message);  // Throw an error with the message from the response
    }

       loadin.classList.remove("active");
       userweatherinfo.classList.add("active");
       renderweatherinfo(data); // Pass the fetched data to the function
    }
    catch(err){
        console.error(err);
        errmsg.innerText = err.message;  // Set the error message text
        errmsg.classList.add("active");  // Display the error message
        loadin.classList.remove("active");  // Remove loading indicator
    }
}





function renderweatherinfo(weatherInfo){
    const cityname = document.querySelector(".cityname")
    const flag = document.querySelector(".flag")
    const tempdescri = document.querySelector(".temp-descri")
    const descriplogo = document.querySelector(".decri-img")
    const tempdisplay = document.querySelector(".temp-incelci")
    const winddisp= document.querySelector(".windsptxt")
    const humidisp= document.querySelector(".humitxt")
    const clouddisp= document.querySelector(".cloudtxt")

    cityname.innerText= weatherInfo?.name;
    flag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    tempdescri.innerText= weatherInfo?.weather?.[0]?.description;
    descriplogo.src=`https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`;
    tempdisplay.innerText = `${weatherInfo?.main?.temp} °C`;
    winddisp.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidisp.innerText = `${weatherInfo?.main?.humidity} %`;
    clouddisp.innerText = `${weatherInfo?.clouds?.all} %`;
}

grantbutton.addEventListener("click",getlocation);

 function getlocation(){
     if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
     }
 }



 function showposition(position){
    const usercoordinate = {
         lat: position.coords.latitude,
         lon: position.coords.longitude,
    }
     localStorage.setItem("user-coordi",JSON.stringify(usercoordinate));
     fetchuserweather(usercoordinate);
 }
 getcordisesstorage();

searchloca.addEventListener("submit",(def)=>{
    def.preventDefault();
    let cityname=searchbox.value;
    if(cityname==="")
        return;
    else
    fetchsearchweather(cityname);
})

async function fetchsearchweather(city){
    loadin.classList.add("active");
    userweatherinfo.classList.remove("active");
    grantloca.classList.remove("active");
    errmsg.classList.remove("active"); 

    try{
        const res = await fetch (`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
       const data = await res.json();
       if (res.status !== 200) {  // Check if the response status is not 200 (OK)
        throw new Error(data.message);  // Throw an error with the message from the response
    }

       loadin.classList.remove("active");
       userweatherinfo.classList.add("active");
       renderweatherinfo(data);

    }
    catch(err){
        errmsg.innerText = err.message;  // Set the error message text
        errmsg.classList.add("active");  // Display the error message
        loadin.classList.remove("active");  // Remove loading indicator
    }
    
}
