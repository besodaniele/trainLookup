const URIGET = "https://www.lefrecce.it/Channels.Website.BFF.WEB/website/locations";
const URIPOST = "https://www.lefrecce.it/Channels.Website.BFF.WEB/website/ticket/solutions";
window.onload = init();


async function init() {
    let stazionePartenza = document.getElementById("stazionePartenza");
    stazionePartenza.addEventListener("keyup", (event) => {
        suggerimenti(stazionePartenza);
    })
    let stazioneArrivo = document.getElementById("stazioneArrivo");
    stazioneArrivo.addEventListener("keyup", (event) => {
        suggerimenti(stazioneArrivo);
    })

    let form = document.getElementById("formRichiesta");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        let solutions = cercaViaggi(stazionePartenza.value, stazioneArrivo.value);

    })


}

async function suggerimenti(nomeStazione) {
    //query esempio
    let response = await fetch((URIGET + "/search?name=" + nomeStazione.value + "&limit=10"), {
        method: "Get",
        headers: {
            "Accept": "application/json",
        }
    });
    let json = await response.json();

    let stazioni = [];
    for (var i = 0; i < json.length; i++) {
        stazioni.push(json[i].name);
    }

    $("#" + nomeStazione.id).autocomplete({
        source: stazioni
    });

}

async function cercaViaggi(stazionePartenza, stazioneArrivo) {

    let jsonPartenza = await (await fetch((URIGET + "/search?name=" + stazionePartenza + "&limit=1"), {
        method: "Get",
        headers: {
            "Accept": "application/json",
        }
    })).json();
    let jsonArrivo = await (await fetch((URIGET + "/search?name=" + stazioneArrivo + "&limit=1"), {
        method: "Get",
        headers: {
            "Accept": "application/json",
        }
    })).json();
    let idPartenza = jsonPartenza[0].id;
    let idArrivo = jsonArrivo[0].id;

    let request = {
        departureLocationId: idPartenza,
        arrivalLocationId: idArrivo,
        departureTime: new Date().toISOString(),
        adults: 1
    };
    console.log(request);
    response = await fetch((URIPOST), {
        method: "Post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    })
    let soluzioni = await response.json();
    console.log(soluzioni)
    let viaggi = [];
    for (let sol of soluzioni["solutions"]) {
        viaggi.push(sol["solution"]);
    }
    console.log(viaggi);

    return viaggi;


}