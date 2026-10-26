import { useState } from 'react';
import { View, Text, FlatList, Pressable, TextInput, Alert } from 'react-native';
import { useUdgifter } from '../context/UdgiftContext';
import { kategorier as alleKategorier } from '../data/seed';
import { kr, samletForbrug } from '../lib/analyse';
import styles from '../styles/styles';
import v2 from '../styles/v2Styles'; // NYT I V2

export default function UdgifterScreen() {
  const { udgifter, sletUdgift } = useUdgifter();
  const [filter, setFilter] = useState('Alle');
  const [soegning, setSoegning] = useState(''); // NYT I V2

  // søgning og filter virker sammen.
  const soeg = soegning.trim().toLowerCase();
  const synlige = udgifter
    .filter((u) => filter === 'Alle' || u.kategori === filter)
    .filter(
      (u) =>
        soeg === '' ||
        u.tekst.toLowerCase().includes(soeg) ||
        u.kategori.toLowerCase().includes(soeg)
    );

  const filtre = ['Alle', ...alleKategorier];

  // bekræft før sletning
  const bekraeftSlet = (item) => {
    Alert.alert('Slet udgift?', `${item.tekst} · ${kr(item.beloeb)} kr`, [
      { text: 'Annullér', style: 'cancel' },
      { text: 'Slet', style: 'destructive', onPress: () => sletUdgift(item.id) },
    ]);
  };

  return (
    <View style={styles.skaerm}>
      {}
      <TextInput
        style={v2.soegefelt}
        value={soegning}
        onChangeText={setSoegning}
        placeholder="Søg, fx Wolt eller café"
        clearButtonMode="while-editing"
        autoCorrect={false}
      />

      {/* Filterknapper — hver er en knap med en funktion */}
      <View style={styles.filterRaekke}>
        {filtre.map((f) => {
          const aktiv = f === filter;
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filterChip, aktiv && styles.filterChipAktiv]}
            >
              <Text style={[styles.filterTekst, aktiv && styles.filterTekstAktiv]}>
                {f}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={v2.resultatLinje}>
        {synlige.length} udgifter · {kr(samletForbrug(synlige))} kr
      </Text>

      <FlatList
        data={synlige}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.tomListe}>
            {soeg ? `Ingen udgifter matcher "${soegning}".` : 'Ingen udgifter i denne kategori.'}
          </Text>
        }
        ListFooterComponent={
          synlige.length > 0 ? (
            <Text style={v2.hjaelpetekst}>Hold fingeren på en udgift for at slette den</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable style={styles.listeRaekke} onLongPress={() => bekraeftSlet(item)}>
            <View>
              <Text style={styles.listeTitel}>{item.tekst}</Text>
              <Text style={styles.listeUndertekst}>
                {item.kategori} · {item.dato}
              </Text>
            </View>
            <Text style={styles.listeBeloeb}>{kr(item.beloeb)} kr</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
