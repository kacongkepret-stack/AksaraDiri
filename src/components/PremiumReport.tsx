import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Desain Layout Premium
const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#020617', color: '#f8fafc' },
  header: { marginBottom: 30, borderBottom: 1, borderBottomColor: '#1e293b', paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#22d3ee' },
  section: { marginBottom: 20 },
  heading: { fontSize: 14, fontWeight: 'bold', color: '#818cf8', marginBottom: 8, uppercase: true },
  content: { fontSize: 11, lineHeight: 1.6, color: '#94a3b8' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 9, color: '#475569' }
});

export const PremiumReport = ({ data, toolName, userName }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Halaman 1: Cover */}
      <View style={styles.header}>
        <Text style={styles.title}>AksaraDiri Blueprint</Text>
        <Text style={{ fontSize: 12, color: '#94a3b8' }}>Laporan Eksklusif: {toolName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Analisis Profil: {userName}</Text>
        <Text style={styles.content}>
          {/* Data ini diambil dari API AI yang Anda rotasi tadi */}
          {data.analysis_kepribadian}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Siklus Rejeki & Karir</Text>
        <Text style={styles.content}>{data.karir_finansial}</Text>
      </View>

      <Text style={styles.footer}>© 2026 AksaraDiri Portal - Rahasia Takdir & Potensi Diri</Text>
    </Page>
  </Document>
);