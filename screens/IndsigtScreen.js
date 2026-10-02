// De AI-genererede råd.
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useUdgifter } from '../context/UdgiftContext';
import { genererRaad } from '../lib/analyse';
import styles from '../styles/styles';

export default function IndsigtScreen({ navigation }) {
  const { udgifter } = useUdgifter();
  const raad = genererRaad(udgifter);

  return (
    <ScrollView style={styles.skaerm}>
      <Text style={styles.overskrift}>Tre ting jeg lagde mærke til</Text>
      <Text style={styles.underskrift}>
        Baseret på dine {udgifter.length} seneste udgifter
      </Text>

      {raad.map((r) => (
        <View
          key={r.id}
          style={[styles.raadKort, r.type === 'advarsel' && styles.raadKortAdvarsel]}
        >
          <Text style={styles.raadTitel}>{r.titel}</Text>
          <Text style={styles.raadTekst}>{r.tekst}</Text>
        </View>
      ))}


      <Pressable
        style={[styles.knap, styles.knapSekundaer]}
        onPress={() => navigation.navigate('Tilfoej')}
      >
        <Text style={[styles.knapTekst, styles.knapTekstSekundaer]}>
          Tilføj en udgift mere
        </Text>
      </Pressable>
    </ScrollView>
  );
}
