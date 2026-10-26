import { StyleSheet } from 'react-native';
import { colors, spacing, radius, font } from './theme';

export default StyleSheet.create({
  // Vises mens data hentes fra telefonens lager ved opstart.
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.baggrund,
  },

  // --- søgefelt på Udgifter ---
  soegefelt: {
    backgroundColor: colors.kort,
    borderWidth: 1,
    borderColor: colors.kant,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: font.brodtekst,
    color: colors.tekst,
    marginBottom: spacing.sm,
  },
  resultatLinje: {
    fontSize: font.lille,
    color: colors.tekstSvag,
    marginBottom: spacing.sm,
  },
  hjaelpetekst: {
    fontSize: font.lille,
    color: colors.tekstSvag,
    textAlign: 'center',
    marginVertical: spacing.sm,
  },

  // --- budget ---
  budgetLinje: {
    fontSize: font.lille,
    color: colors.tekstSvag,
    marginTop: spacing.sm,
  },
  budgetLink: {
    fontSize: font.lille,
    color: colors.primaer,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  statRaekke: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  statBoks: {
    flex: 1,
  },
  statTal: {
    fontSize: font.overskrift,
    fontWeight: '700',
    color: colors.tekst,
  },
  statTalAdvarsel: {
    color: colors.advarsel,
  },
  statLabel: {
    fontSize: font.lille,
    color: colors.tekstSvag,
  },
  bjaelkeAdvarsel: {
    backgroundColor: colors.advarsel,
  },
  knapMedAfstand: {
    marginTop: spacing.md,
  },
  knapFare: {
    backgroundColor: colors.advarselLys,
    marginTop: spacing.xl,
  },
  knapTekstFare: {
    color: colors.advarsel,
  },

  // --- AI-indsigt ---
  kildeLabel: {
    alignSelf: 'flex-start',
    fontSize: font.lille,
    fontWeight: '600',
    color: colors.tekstSvag,
    backgroundColor: colors.kant,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  kildeLabelAi: {
    color: colors.primaer,
    backgroundColor: colors.primaerLys,
  },
  knapDeaktiveret: {
    opacity: 0.6,
  },
  knapIndhold: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  knapSpinner: {
    marginRight: spacing.sm,
  },
  fejlBoks: {
    backgroundColor: colors.advarselLys,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  fejlBoksTekst: {
    fontSize: font.lille,
    color: colors.advarsel,
  },
});
