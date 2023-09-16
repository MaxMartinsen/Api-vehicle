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
    const outputElement = document.getElementById('output');
    outputElement.textContent = JSON.stringify(data, null, 2);
}
