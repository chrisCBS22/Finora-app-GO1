// IndsigtScreen.js — SCREEN 4: appens kerneværdi, rådene.

import { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useUdgifter } from '../context/UdgiftContext';
import { genererRaad } from '../lib/analyse';
import { denneMaaned, budgetRaad } from '../lib/budget'; // NYT I V2
import { hentAiRaad, aiErSatOp, aiUdbyderNavn } from '../lib/ai'; // NYT I V2
import styles from '../styles/styles';
import v2 from '../styles/v2Styles'; // NYT I V2

export default function IndsigtScreen({ navigation }) {
  const { udgifter, budget } = useUdgifter();
  const maanedens = denneMaaned(udgifter);

  // AI-svaret gemmes i state. null = vis de beregnede råd.
  const [aiResultat, setAiResultat] = useState(null);
  const [henter, setHenter] = useState(false);

  // Beregnede råd (som i v1) + evt. budgetråd øverst.
  const bRaad = budgetRaad(udgifter, budget);
  const lokaleRaad = bRaad
    ? [bRaad, ...genererRaad(maanedens).slice(0, 2)]
    : genererRaad(maanedens);

  const visAi = aiResultat && aiResultat.kilde === 'ai';
  const raad = visAi ? aiResultat.raad : lokaleRaad;

  // KNAP — spørg sprogmodellen
  const spoergAi = async () => {
    setHenter(true);
    const resultat = await hentAiRaad(maanedens, budget);
    setAiResultat(resultat);
    setHenter(false);
  };

  return (
    <ScrollView style={styles.skaerm}>
      <Text style={styles.overskrift}>Tre ting jeg lagde mærke til</Text>
      <Text style={styles.underskrift}>
        Baseret på dine {maanedens.length} udgifter denne måned
      </Text>

      {/*hvor kommer rådene fra? */}
      <Text style={[v2.kildeLabel, visAi && v2.kildeLabelAi]}>
        {visAi ? 'Skrevet af AI' : 'Beregnet på telefonen'}
      </Text>

      {/* vis hvorfor AI ikke blev brugt, hvis brugeren bad om det */}
      {aiResultat && aiResultat.fejl ? (
        <View style={v2.fejlBoks}>
          <Text style={v2.fejlBoksTekst}>{aiResultat.fejl} Viser de beregnede råd i stedet.</Text>
        </View>
      ) : null}

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
        style={[styles.knap, henter && v2.knapDeaktiveret]}
        onPress={spoergAi}
        disabled={henter}
      >
        <View style={v2.knapIndhold}>
          {henter ? <ActivityIndicator color="#FFFFFF" style={v2.knapSpinner} /> : null}
          <Text style={styles.knapTekst}>
            {henter ? 'AI tænker…' : visAi ? 'Spørg AI igen' : 'Spørg AI om råd'}
          </Text>
        </View>
      </Pressable>

      <Pressable
        style={[styles.knap, styles.knapSekundaer]}
        onPress={() => navigation.navigate('Tilfoej')}
      >
        <Text style={[styles.knapTekst, styles.knapTekstSekundaer]}>
          Tilføj en udgift mere
        </Text>
      </Pressable>

      {/* Åbenhed om data — teksten følger, hvad der faktisk skete */}
      <Text style={styles.disclaimer}>
        {visAi
          ? `Rådene er skrevet af en sprogmodel ud fra en opsummering af dine udgifter (summer pr. kategori og de hyppigste steder), som er sendt til ${aiUdbyderNavn()}.`
          : aiErSatOp()
          ? 'Rådene er beregnet på din telefon. Trykker du "Spørg AI", sendes en opsummering af dine udgifter til en sprogmodel.'
          : 'Rådene er beregnet på din telefon. Ingen data forlader telefonen.'}
      </Text>
    </ScrollView>
  );
}
