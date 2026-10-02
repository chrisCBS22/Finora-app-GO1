// Tilføj en udgift.
import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useUdgifter } from '../context/UdgiftContext';
import { kategorier } from '../data/seed';
import styles from '../styles/styles';

export default function TilfoejScreen({ navigation }) {
  const { tilfoejUdgift } = useUdgifter();

  const [tekst, setTekst] = useState('');
  const [beloeb, setBeloeb] = useState('');
  const [kategori, setKategori] = useState(kategorier[0]);
  const [fejl, setFejl] = useState('');

  const gem = () => {
    const tal = parseFloat(beloeb.replace(',', '.'));
    if (!tekst.trim()) return setFejl('Skriv hvad du har købt.');
    if (isNaN(tal) || tal <= 0) return setFejl('Beløbet skal være et tal over 0.');

    tilfoejUdgift({
      tekst: tekst.trim(),
      beloeb: tal,
      kategori,
      dato: new Date().toISOString().slice(0, 10),
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.skaerm}>
      <Text style={styles.label}>Hvad købte du?</Text>
      <TextInput
        style={styles.input}
        value={tekst}
        onChangeText={setTekst}
        placeholder="fx Netto"
      />

      <Text style={styles.label}>Beløb (kr)</Text>
      <TextInput
        style={styles.input}
        value={beloeb}
        onChangeText={setBeloeb}
        keyboardType="decimal-pad"
        placeholder="fx 249"
      />

      <Text style={styles.label}>Kategori</Text>
      <View style={styles.filterRaekke}>
        {kategorier.map((k) => {
          const aktiv = k === kategori;
          return (
            <Pressable
              key={k}
              onPress={() => setKategori(k)}
              style={[styles.filterChip, aktiv && styles.filterChipAktiv]}
            >
              <Text style={[styles.filterTekst, aktiv && styles.filterTekstAktiv]}>
                {k}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {fejl ? <Text style={styles.fejl}>{fejl}</Text> : null}

      <Pressable style={styles.knap} onPress={gem}>
        <Text style={styles.knapTekst}>Gem udgift</Text>
      </Pressable>
    </ScrollView>
  );
}
