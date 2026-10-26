// OversigtScreen.js — SCREEN 1.
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useUdgifter } from '../context/UdgiftContext';
import { samletForbrug, forbrugPrKategori, kr } from '../lib/analyse';
import { denneMaaned, budgetStatus } from '../lib/budget'; // NYT I V2
import styles from '../styles/styles';
import v2 from '../styles/v2Styles'; // NYT I V2

export default function OversigtScreen({ navigation }) {
  const { udgifter, budget } = useUdgifter();

  const maanedens = denneMaaned(udgifter);
  const total = samletForbrug(maanedens);
  const kategorier = forbrugPrKategori(maanedens).slice(0, 4);
  const b = budgetStatus(udgifter, budget);

  return (
    <ScrollView style={styles.skaerm}>
      {/* Kort med månedens samlede forbrug */}
      <View style={styles.kort}>
        <Text style={styles.labelTekst}>Forbrug denne måned</Text>
        <Text style={styles.beloebStort}>{kr(total)} kr</Text>
        <Text style={styles.underskrift}>
          fordelt på {maanedens.length} registrerede udgifter
        </Text>

 
        {b.harBudget ? (
          <Text style={v2.budgetLinje}>
            {b.rest >= 0
              ? `${kr(b.rest)} kr tilbage af ${kr(b.budget)} kr · ca. ${kr(b.prDag)} kr/dag`
              : `${kr(-b.rest)} kr over budgettet på ${kr(b.budget)} kr`}
          </Text>
        ) : (
          <Text style={v2.budgetLink} onPress={() => navigation.navigate('Budget')}>
            Sæt et månedsbudget →
          </Text>
        )}
      </View>

      {/* Top-kategorier med simple bjælker */}
      <View style={styles.kort}>
        <Text style={styles.overskrift}>Hvor pengene går hen</Text>
        {kategorier.length === 0 ? (
          <Text style={styles.underskrift}>Ingen udgifter endnu denne måned.</Text>
        ) : null}
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

      {/* KNAP 4 — navigerer til Budget */}
      <Pressable
        style={[styles.knap, styles.knapSekundaer]}
        onPress={() => navigation.navigate('Budget')}
      >
        <Text style={[styles.knapTekst, styles.knapTekstSekundaer]}>
          Mit budget
        </Text>
      </Pressable>
    </ScrollView>
  );
}
