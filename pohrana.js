import { readFile, writeFile } from 'node:fs/promises';

const PUTANJA_DATOTEKE = 'zadaci.json';

/**
- Dohvaća spremljene zadatke iz JSON datoteke.
- U slučaju da datoteka još nije kreirana, vraća prazno polje.
- Ako JSON zapis nije ispravan, javlja upozorenje i vraća prazno polje bez prekida rada programa.
 */
export async function ucitajZadatke() {
  try {
    const podaci = await readFile(PUTANJA_DATOTEKE, 'utf-8');
    return JSON.parse(podaci);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // Datoteka još nije stvorena.
      return [];
    }
    // Ako JSON nije ispravno formatiran
    console.error('Upozorenje: Datoteka zadaci.json nije ispravnog formata. Vraća se prazna lista.');
    return [];
  }
}

/**
- Asinkrono zapisuje listu zadataka u JSON datoteku.
 */
export async function spremiZadatke(listaZadataka) {
  try {
    await writeFile(PUTANJA_DATOTEKE, JSON.stringify(listaZadataka, null, 2), 'utf-8');
  } catch (err) {
    console.error('Greška pri zapisivanju zadataka u datoteku:', err.message);
    process.exit(1);
  }
}