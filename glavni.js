import { ucitajZadatke, spremiZadatke } from './pohrana.js';

// process.argv[0] je putanja do Node-a, process.argv[1] je putanja do skripte
// Argumenti počinju od indeksa 2
const [, , akcija, ...parametri] = process.argv;

async function pokreniAplikaciju() {
  const listaZadataka = await ucitajZadatke();

  switch (akcija) {
    case 'dodaj': {
      const tekstZadatka = parametri.join(' ').trim();
      
      if (!tekstZadatka) {
        console.error('Greška: Niste upisali naziv zadatka, molimo unesite tekst!');
        process.exit(1);
      }

      // Generiranje sljedećeg ID-a (1 ako je lista prazna, inače najveći ID + 1)
      const sljedeciId = listaZadataka.length > 0 ? Math.max(...listaZadataka.map(z => z.id)) + 1 : 1;

      const noviZapis = {
        id: sljedeciId,
        naslov: tekstZadatka,
        gotovo: false
      };

      listaZadataka.push(noviZapis);
      await spremiZadatke(listaZadataka);
      console.log(`Uspješno dodan zadatak #${sljedeciId}: "${tekstZadatka}"`);
      break;
    }

    case 'popis': {
      if (listaZadataka.length === 0) {
        console.log('Trenutno nemate nijedan spremljeni zadatak.');
        return;
      }

      listaZadataka.forEach(z => {
        const status = z.gotovo ? 'x' : ' ';
        console.log(`${z.id}. [${status}] ${z.naslov}`);
      });
      break;
    }

    case 'gotovo': {
      const uneseniId = parametri[0];
      const trazeniId = Number(uneseniId);

      // Provjera je li ID unesen i je li ispravan cijeli broj
      if (!uneseniId || !Number.isInteger(trazeniId) || trazeniId <= 0) {
        console.error('Greška: Morate unijeti ispravan pozitivan cijeli broj kao ID zadatka.');
        process.exit(1);
      }

      const pronadeniZadatak = listaZadataka.find(z => z.id === trazeniId);

      if (!pronadeniZadatak) {
        console.error(`Greška: Zadatak pod brojem ${trazeniId} nije pronađen.`);
        process.exit(1);
      }

      pronadeniZadatak.gotovo = true;
      await spremiZadatke(listaZadataka);
      console.log(`Zadatak pod brojem ${trazeniId} je označen kao završen!`);
      break;
    }

    default: {
      console.error(`Nepoznata naredba: "${akcija || ''}". Dostupne opcije su: dodaj, popis, gotovo.`);
      process.exit(1);
    }
  }
}

pokreniAplikaciju();