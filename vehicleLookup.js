const fs = require('fs');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function oppslag(kjennemerke) {
	let kjoretoy = null;
	let url = 'https://www.vegvesen.no/ws/no/vegvesen/kjoretoy/felles/datautlevering/enkeltoppslag/kjoretoydata?kjennemerke=' + kjennemerke;
	// Bytt {key} med din API-nÃ¸kkel
	let headers = {
        'SVV-Authorization': 'bf088d19-9ea8-42ca-bc99-5629f0c9d6d8'
		};
	;

    console.log('Kaller REST-tjeneste: ' + url);
	let response = await fetch(url, { method: "GET", headers: headers });

	console.log('HTTP Status: ' + response.status + ' (' + response.statusText + ')');

	if (response.status === 200) {
		kjoretoy = await response.json();
	}

	return kjoretoy;
}

async function Main() {
    var args = process.argv.slice(2);

    let kjennemerke = args[0];
	if(kjennemerke == null) {
		console.log('Bruk: node enkeltoppslag <kjennemerke>');
		return;
	}

    console.log('Enkeltoppslag pÃ¥ kjennemerke: ' + kjennemerke);
    let kjoretoy = await oppslag(kjennemerke);
	let kjoretoyData = kjoretoy.kjoretoydataListe[0];

	// Registreringsdata
	console.log('KjÃ¸retÃ¸yets status: ' + kjoretoyData.registrering.registreringsstatus.kodeBeskrivelse);
    console.log('Registreringsnummer: ' + kjoretoyData.kjoretoyId.kjennemerke);
	console.log('Understells-/chassisnr. (VIN): ' + kjoretoyData.kjoretoyId.understellsnummer);
	
	// Tekniske data
	let tekniskeData = kjoretoyData.godkjenning.tekniskGodkjenning.tekniskeData;
	console.log('Merke og modell: ' + tekniskeData.generelt.merke[0].merke + ' ' + tekniskeData.generelt.handelsbetegnelse[0]);
	console.log('KjÃ¸retÃ¸ygruppe: ' + kjoretoyData.godkjenning.tekniskGodkjenning.kjoretoyklassifisering.beskrivelse);
	console.log('Antall seter: ' + tekniskeData.persontall.sitteplasserTotalt);
	console.log('Farge: ' + tekniskeData.karosseriOgLasteplan.rFarge[0].kodeNavn);
	console.log('Drivstoff: ' + tekniskeData.miljodata.euroKlasse.kodeNavn);
	console.log('Drivstoff: ' + tekniskeData.miljodata.miljoOgdrivstoffGruppe[0].drivstoffKodeMiljodata.kodeNavn);
	
	// Periodisk kjÃ¸retÃ¸ykontroll
	console.log('Neste frist for godkjent EU-kontroll: ' + kjoretoyData.periodiskKjoretoyKontroll.kontrollfrist);

	// Skriver ut kjÃ¸retÃ¸y ut til fil (json-format)
    fs.writeFileSync(kjennemerke + '.json', JSON.stringify(kjoretoy, null, 4));
}

Main();