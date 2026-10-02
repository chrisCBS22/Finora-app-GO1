// styling for appens screens.
import { StyleSheet } from 'react-native';
import { colors, spacing, radius, font } from './theme';

export default StyleSheet.create({
  // --- fælles ---
  skaerm: {
    flex: 1,
    backgroundColor: colors.baggrund,
    padding: spacing.md,
  },
  overskrift: {
    fontSize: font.overskrift,
    fontWeight: '700',
    color: colors.tekst,
    marginBottom: spacing.sm,
  },
  underskrift: {
    fontSize: font.lille,
    color: colors.tekstSvag,
    marginBottom: spacing.md,
  },
  kort: {
    backgroundColor: colors.kort,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.kant,
  },

  // --- oversigt ---
  beloebStort: {
    fontSize: font.stor,
    fontWeight: '700',
    color: colors.tekst,
  },
  labelTekst: {
    fontSize: font.lille,
    color: colors.tekstSvag,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  kategoriRaekke: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  baggrundsbjaelke: {
    height: 6,
    backgroundColor: colors.kant,
    borderRadius: radius.sm,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  bjaelke: {
    height: 6,
    backgroundColor: colors.primaer,
  },

  // --- knapper ---
  knap: {
    backgroundColor: colors.primaer,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  knapSekundaer: {
    backgroundColor: colors.primaerLys,
  },
  knapTekst: {
    color: '#FFFFFF',
    fontSize: font.brodtekst,
    fontWeight: '600',
  },
  knapTekstSekundaer: {
    color: colors.primaer,
  },

  // --- liste ---
  listeRaekke: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.kort,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.kant,
  },
  listeTitel: {
    fontSize: font.brodtekst,
    fontWeight: '600',
    color: colors.tekst,
  },
  listeUndertekst: {
    fontSize: font.lille,
    color: colors.tekstSvag,
    marginTop: 2,
  },
  listeBeloeb: {
    fontSize: font.brodtekst,
    fontWeight: '600',
    color: colors.tekst,
  },
  tomListe: {
    textAlign: 'center',
    color: colors.tekstSvag,
    marginTop: spacing.xl,
  },

  // --- filterknapper ---
  filterRaekke: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.kant,
    backgroundColor: colors.kort,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  filterChipAktiv: {
    backgroundColor: colors.primaerLys,
    borderColor: colors.primaer,
  },
  filterTekst: {
    fontSize: font.lille,
    color: colors.tekstSvag,
  },
  filterTekstAktiv: {
    color: colors.primaer,
    fontWeight: '600',
  },

  // --- formular ---
  label: {
    fontSize: font.lille,
    color: colors.tekstSvag,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.kort,
    borderWidth: 1,
    borderColor: colors.kant,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: font.brodtekst,
    color: colors.tekst,
  },
  fejl: {
    color: colors.advarsel,
    fontSize: font.lille,
    marginTop: spacing.sm,
  },

  // --- AI-indsigt ---
  raadKort: {
    backgroundColor: colors.kort,
    borderLeftWidth: 4,
    borderLeftColor: colors.primaer,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  raadKortAdvarsel: {
    borderLeftColor: colors.advarsel,
  },
  raadTitel: {
    fontSize: font.brodtekst,
    fontWeight: '700',
    color: colors.tekst,
    marginBottom: spacing.xs,
  },
  raadTekst: {
    fontSize: font.brodtekst,
    color: colors.tekstSvag,
    lineHeight: 22,
  },
  disclaimer: {
    fontSize: font.lille,
    color: colors.tekstSvag,
    fontStyle: 'italic',
    marginTop: spacing.md,
  },
});
