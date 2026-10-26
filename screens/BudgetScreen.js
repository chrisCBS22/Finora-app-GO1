// BudgetScreen.js — NY SCREEN I V2.
// Brugeren sætter et månedsbudget, som gemmes på telefonen. Skærmen viser,
// hvor meget der er brugt, hvad der er tilbage, og hvad man kan bruge pr. dag.
import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert, Keyboard } from 'react-native';
import { useUdgifter } from '../context/UdgiftContext';
import { budgetStatus } from '../lib/budget';
import { kr } from '../lib/analyse';
import styles from '../styles/styles';
import v2 from '../styles/v2Styles';

export default function BudgetScreen() {
  const { udgifter, budget, gemBudget, nulstilData } = useUdgifter();
  const [input, setInput] = useState(budget ? String(budget) : '');
  const [fejl, setFejl] = useState('');

  const s = budgetStatus(udgifter, budget);

  // KNAP: gem budget
  const gem = () => {
    const tal = parseFloat(input.replace(/\./g, '').replace(',', '.'));
    if (isNaN(tal) || tal <= 0) return setFejl('Skriv et beløb over 0.');
    setFejl('');
    gemBudget(tal);
    Keyboard.dismiss();
  };

  // KNAP: nulstil — spørger først, fordi det ikke kan fortrydes.
  const nulstil = () => {
    Alert.alert(
      'Nulstil alle data?',
      'Alle dine udgifter og dit budget slettes, og appen starter forfra med eksempeldata.',
      [
        { text: 'Annullér', style: 'cancel' },
        {
          text: 'Nulstil',
          style: 'destructive',
          onPress: async () => {
            await nulstilData();
            setInput('');
          },
        },
      ]
    );
  };

  const procent = s.harBudget ? Math.min(Math.round(s.andelBrugt * 100), 100) : 0;
  const overBudget = s.harBudget && s.rest < 0;

  return (
    <ScrollView style={styles.skaerm} keyboardShouldPersistTaps="handled">
      {/* Status — vises kun, når der er sat et budget */}
      {s.harBudget ? (
        <View style={styles.kort}>
          <Text style={styles.labelTekst}>Denne måned</Text>
          <Text style={styles.beloebStort}>
            {kr(s.brugt)} <Text style={styles.underskrift}>af {kr(s.budget)} kr</Text>
          </Text>

          <View style={styles.baggrundsbjaelke}>
            <View
              style={[styles.bjaelke, overBudget && v2.bjaelkeAdvarsel, { width: `${procent}%` }]}
            />
          </View>

          <View style={v2.statRaekke}>
            <View style={v2.statBoks}>
              <Text style={[v2.statTal, overBudget && v2.statTalAdvarsel]}>
                {kr(s.rest)} kr
              </Text>
              <Text style={v2.statLabel}>{overBudget ? 'over budget' : 'tilbage'}</Text>
            </View>
            <View style={v2.statBoks}>
              <Text style={v2.statTal}>{kr(s.prDag)} kr</Text>
              <Text style={v2.statLabel}>pr. dag i {s.dageTilbage} dage</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.kort}>
          <Text style={styles.overskrift}>Sæt et månedsbudget</Text>
          <Text style={styles.underskrift}>
            Med et budget kan Finora fortælle dig, om du er på sporet, og hvor
            meget du kan bruge om dagen resten af måneden.
          </Text>
        </View>
      )}

      <Text style={styles.label}>Månedsbudget for variable udgifter (kr)</Text>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        keyboardType="decimal-pad"
        placeholder="fx 4000"
        returnKeyType="done"
        onSubmitEditing={gem}
      />
      {fejl ? <Text style={styles.fejl}>{fejl}</Text> : null}

      <Pressable style={[styles.knap, v2.knapMedAfstand]} onPress={gem}>
        <Text style={styles.knapTekst}>{s.harBudget ? 'Opdatér budget' : 'Gem budget'}</Text>
      </Pressable>

      <Pressable style={[styles.knap, v2.knapFare]} onPress={nulstil}>
        <Text style={[styles.knapTekst, v2.knapTekstFare]}>Nulstil alle data</Text>
      </Pressable>
    </ScrollView>
  );
}
