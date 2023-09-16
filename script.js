async function fetchVehicleData() {
    const kjennemerke = document.getElementById('kjennemerke').value;
    if (!kjennemerke) {
        alert('Please enter a kjennemerke.');
        return;
    }

    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const apiUrl = `https://www.vegvesen.no/ws/no/vegvesen/kjoretoy/felles/datautlevering/enkeltoppslag/kjoretoydata?kjennemerke=${kjennemerke}`;
    const url = proxyUrl + apiUrl;

    const headers = {
        'SVV-Authorization': 'bf088d19-9ea8-42ca-bc99-5629f0c9d6d8'
    };

    try {
        const response = await fetch(url, { method: "GET", headers: headers });
        const data = await response.json();
        displayData(data);
    } catch (error) {
        console.error("There was an error fetching the data:", error);
    }
}

function displayData(data) {
    const genereltData = data.kjoretoydataListe[0].godkjenning.tekniskGodkjenning.tekniskeData.generelt;

    const fabrikantNavn = genereltData.fabrikant && genereltData.fabrikant[0] ? genereltData.fabrikant[0].fabrikantNavn : "N/A";
    const handelsbetegnelse = genereltData.handelsbetegnelse && genereltData.handelsbetegnelse[0] ? genereltData.handelsbetegnelse[0] : "N/A";

    const outputElement = document.getElementById('output');
    outputElement.textContent = `Model: ${fabrikantNavn}\nMerke: ${handelsbetegnelse}`;
}
