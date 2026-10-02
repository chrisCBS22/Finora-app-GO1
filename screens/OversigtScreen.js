// Viser månedens forbrug og top-kategorier, indeholder appens hovedknapper.
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useUdgifter } from '../context/UdgiftContext';
import { samletForbrug, forbrugPrKategori, kr } from '../lib/analyse';
import styles from '../styles/styles';

export default function OversigtScreen({ navigation }) {
  const { udgifter } = useUdgifter();

  const total = samletForbrug(udgifter);
  const kategorier = forbrugPrKategori(udgifter).slice(0, 4);

  return (
    <ScrollView style={styles.skaerm}>
      {/* Kort med månedens samlede forbrug */}
      <View style={styles.kort}>
        <Text style={styles.labelTekst}>Forbrug denne måned</Text>
        <Text style={styles.beloebStort}>{kr(total)} kr</Text>
        <Text style={styles.underskrift}>
          fordelt på {udgifter.length} registrerede udgifter
        </Text>
      </View>

      {/* Top-kategorier med simple bjælker */}
      <View style={styles.kort}>
        <Text style={styles.overskrift}>Hvor pengene går hen</Text>
        {kategorier.map((k) => (
          <View key={k.kategori}>
            <View style={styles.kategoriRaekke}>
              <Text>{k.kategori}</Text>
              <Text style={styles.listeBeloeb}>{kr(k.beloeb)} kr</Text>
            </View>
            <View style={styles.baggrundsbjaelke}>
              <View
                style={[
                  styles.bjaelke,
                  { width: `${Math.round((k.beloeb / total) * 100)}%` },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      {/* KNAP 1: navigerer til AI-indsigt */}
      <Pressable style={styles.knap} onPress={() => navigation.navigate('Indsigt')}>
        <Text style={styles.knapTekst}>Få AI-råd</Text>
      </Pressable>

      {/* KNAP 2: navigerer til formularen */}
      <Pressable
        style={[styles.knap, styles.knapSekundaer]}
        onPress={() => navigation.navigate('Tilfoej')}
      >
        <Text style={[styles.knapTekst, styles.knapTekstSekundaer]}>
          Tilføj udgift
        </Text>
      </Pressable>

      {/* KNAP 3: navigerer til listen */}
      <Pressable
        style={[styles.knap, styles.knapSekundaer]}
        onPress={() => navigation.navigate('Udgifter')}
      >
        <Text style={[styles.knapTekst, styles.knapTekstSekundaer]}>
          Se alle udgifter
        </Text>
      </Pressable>
    </ScrollView>
  );
}
