import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

class PDFExport extends React.Component {

  constructor(props) {
    super(props)
  }

  generatePDF = () => {
    const html = `<h1> Teste </h1>`;
    const { uri } = await Print.printToFileAsync({ html });
    Sharing.shareAsync(uri);
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Print and Share"
          onPress={() => generatePDF()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(PDFExport)