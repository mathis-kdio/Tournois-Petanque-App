// Test file to verify migration with sample data from console output
// This is not part of the actual app, just for testing the migration logic

// Sample data from tmp-output-console.txt
const sampleListesJoueurs = {
  avecEquipes: [],
  avecNoms: [],
  historique: [
    { id: 0, name: 'A', nbTournois: 1 },
    { id: 1, name: 'B', nbTournois: 0 },
  ],
  sansNoms: [
    { id: 0, name: '' },
    { id: 1, name: '' },
    { id: 2, name: '' },
    { id: 3, name: '' },
    { id: 4, name: '' },
    { id: 5, name: '' },
    { id: 6, name: '' },
    { id: 7, name: '' },
    { id: 8, name: '' },
    { id: 9, name: '' },
    { id: 10, name: '' },
    { id: 11, name: '' },
    { id: 12, name: '' },
    { id: 13, name: '' },
    { id: 14, name: '' },
    { id: 15, name: '' },
    { id: 16, name: '' },
    { id: 17, name: '' },
    { id: 18, name: '' },
    { id: 19, name: '' },
    { id: 20, name: '' },
    { id: 21, name: '' },
    { id: 22, name: '' },
    { id: 23, name: '' },
  ],
  sauvegarde: [
    { equipe: 1, id: 0, name: 'A', type: '' },
    { equipe: 2, id: 1, name: 'B', type: '' },
  ],
};

const sampleListesSauvegarde = {
  avecEquipes: [],
  avecNoms: [],
  sansNoms: [],
};

const sampleListeTournois = [
  {
    creationDate: '2025-10-24T23:01:35.021Z',
    tournoi: [
      // Tournament data would be here - 26 elements based on console output
      // Last element contains options
      {
        avecTerrains: false,
        listeJoueurs: [], // Would contain 20 player objects
        memesAdversaires: 50,
        memesEquipes: true,
        mode: 'sansNoms',
        nbMatchs: 30,
        nbPtVictoire: 13,
        nbTours: 5,
        speciauxIncompatibles: true,
        tournoiID: 1,
        typeEquipes: 'doublette',
        typeTournoi: 'mele-demele',
      },
    ],
    tournoiId: 1,
    updateDate: '2025-10-24T23:01:35.021Z',
  },
];

const sampleListeMatchs = [
  { equipe: [[], []], id: 0, manche: 1 },
  { equipe: [[], []], id: 1, manche: 1 },
  // ... more matches
];

const sampleOptionsTournoi = {
  avecTerrains: false,
  memesAdversaires: 50,
  memesEquipes: true,
  mode: 'sansNoms',
  modeCreationEquipes: null,
  nbPtVictoire: 13,
  nbTours: 5,
  speciauxIncompatibles: true,
  type: null,
  typeEquipes: 'doublette',
  typeTournoi: 'mele-demele',
};

const sampleListeTerrains = [];

// This would be the test call
// DataMigrationService.migrateDataFromRedux(
//   sampleListesJoueurs,
//   sampleListesSauvegarde,
//   sampleListeTournois,
//   sampleListeMatchs,
//   sampleOptionsTournoi,
//   sampleListeTerrains
// );

console.log('Test data prepared for migration verification');
