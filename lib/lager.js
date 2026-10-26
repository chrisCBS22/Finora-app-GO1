import AsyncStorage from '@react-native-async-storage/async-storage';

// Nøglerne samles ét sted, så de ikke staves forskelligt rundt i koden.
export const NOEGLER = {
  udgifter: 'finora:udgifter',
  budget: 'finora:budget',
};

// Henter og parser en værdi. Returnerer null, hvis der intet er gemt endnu
// eller hvis det gemte er ødelagt — så falder appen tilbage til startdata.
export async function hent(noegle) {
  try {
    const tekst = await AsyncStorage.getItem(noegle);
    return tekst === null ? null : JSON.parse(tekst);
  } catch (e) {
    console.warn('Kunne ikke læse', noegle, e);
    return null;
  }
}

export async function gem(noegle, vaerdi) {
  try {
    await AsyncStorage.setItem(noegle, JSON.stringify(vaerdi));
  } catch (e) {
    console.warn('Kunne ikke gemme', noegle, e);
  }
}

export async function sletAlt() {
  try {
    await AsyncStorage.multiRemove(Object.values(NOEGLER));
  } catch (e) {
    console.warn('Kunne ikke nulstille', e);
  }
}
