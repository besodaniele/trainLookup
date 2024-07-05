const URIBASE="https://www.lefrecce.it/Channels.Website.BFF.WEB/website/locations";
window.onload=init();


function  init(){
    let nomeStazione = document.getElementById("nomeStazione");
    nomeStazione.addEventListener("keyup",(event)=>{
        suggerimenti(nomeStazione);
    })
}
async function suggerimenti(nomeStazione){
    //query esempio
    let response = await fetch((URIBASE+"/search?name="+nomeStazione.value+"&limit=10"), {
            method: "Get",
            headers:{
                "Accept": "application/json",
            }
    });
    let json = await response.json();

    let stazioni=[];
    for (var i =0; i<json.length; i++){
        stazioni.push(json[i].name);
    }

    $("#nomeStazione").autocomplete({
        source:stazioni
    });

}
