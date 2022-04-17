import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function App() {

  async function execute() {
    const html = `<h1> Teste </h1>`;
    const { uri } = await Print.printToFileAsync({ html });
    Sharing.shareAsync(uri);
  }
  return (
    <View style={styles.container}>
      <Button
        title="Print and Share"
        onPress={() => execute()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
