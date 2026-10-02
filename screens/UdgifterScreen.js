// Listen over udgifter.
import { useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useUdgifter } from '../context/UdgiftContext';
import { kategorier as alleKategorier } from '../data/seed';
import { kr } from '../lib/analyse';
import styles from '../styles/styles';

export default function UdgifterScreen() {
  const { udgifter, sletUdgift } = useUdgifter();
  const [filter, setFilter] = useState('Alle');

  const synlige =
    filter === 'Alle' ? udgifter : udgifter.filter((u) => u.kategori === filter);

  const filtre = ['Alle', ...alleKategorier];

  return (
    <View style={styles.skaerm}>
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

      <FlatList
        data={synlige}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.tomListe}>Ingen udgifter i denne kategori.</Text>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.listeRaekke} onLongPress={() => sletUdgift(item.id)}>
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
