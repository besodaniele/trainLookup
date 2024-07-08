const URIGET = "https://cors-anywhere.herokuapp.com/https://www.lefrecce.it/Channels.Website.BFF.WEB/website/locations";
const URIPOST = "https://cors-anywhere.herokuapp.com/https://www.lefrecce.it/Channels.Website.BFF.WEB/website/ticket/solutions";
window.onload = init();


async function init() {
    let stazionePartenza = document.getElementById("stazionePartenza");
    stazionePartenza.addEventListener("keyup", (event) => {
        suggerimenti(stazionePartenza);
    });

    let stazioneArrivo = document.getElementById("stazioneArrivo");
    stazioneArrivo.addEventListener("keyup", (event) => {
        suggerimenti(stazioneArrivo);
    });

    let form = document.getElementById("formRichiesta");
    form.addEventListener("submit", async (event) => {


        event.preventDefault();
        let solutions = await cercaViaggi(stazionePartenza.value, stazioneArrivo.value);
        let table = document.getElementById("tableBody");
        table.innerHTML = "";

        sleep(500);


        // Variable to keep track of the currently expanded details row
        let expandedRow = null;

        for (let sol of solutions) {
            // Create the main row for each solution
            let row = table.insertRow();
            let cell = row.insertCell();
            cell.innerHTML = sol["origin"];
            cell = row.insertCell();
            cell.innerHTML = sol["destination"];
            cell = row.insertCell();
            let timeDeparture = sol["departureTime"].match(/\d\d:\d\d/);
            cell.innerHTML = timeDeparture[0];
            cell = row.insertCell();
            let timeArrival = sol["arrivalTime"].match(/\d\d:\d\d/);
            cell.innerHTML = timeArrival[0];
            cell = row.insertCell();
            cell.innerHTML = sol["duration"];
            let numTreni = sol["trains"].length - 1;
            cell = row.insertCell();
            cell.innerHTML = numTreni > 0 ? numTreni : "Diretto";
// Create the details row for each solution
            let detailsRow = table.insertRow();
            detailsRow.classList.add('details-row');
            let detailsCell = detailsRow.insertCell();
            detailsCell.colSpan = 6;

            // Build details content
            let detailsContent = `
                <div class="details-container">
                    <strong>Details about the travel:</strong>
                    <ul class="details-list">
            `;

            // Iterate over nodes and add details to detailsContent
            for (let node of sol["nodes"]) {
                detailsContent += `
                    <li>
                        <span>${node["origin"]} (${node["departureTime"].match(/\d\d:\d\d/)[0]})</span> 
                        <span>&rarr;</span> 
                        <span>${node["destination"]} (${node["arrivalTime"].match(/\d\d:\d\d/)[0]})</span>
                    </li>
                `;
            }

            detailsContent += `</ul></div>`;

            detailsCell.innerHTML = detailsContent;

            // Hide details row by default
            detailsRow.style.display = 'none';

            // Add click event to toggle details row
            row.addEventListener('click', function () {
                if (expandedRow && expandedRow !== detailsRow) {
                    expandedRow.style.display = 'none'; // Collapse the previously expanded row
                }
                detailsRow.style.display = detailsRow.style.display === 'table-row' ? 'none' : 'table-row';
                expandedRow = detailsRow.style.display === 'table-row' ? detailsRow : null;
            });
        }
    });
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}