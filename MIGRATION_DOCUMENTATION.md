# Redux to Drizzle ORM SQLite Data Migration

## Overview

This document explains the automatic data migration strategy from the existing Redux store to the new Drizzle ORM SQLite database when users update the application.

## Migration Architecture

### Key Components

1. **DataMigrationService** (`src/services/dataMigrationService.ts`)
   - Core service handling the data conversion and insertion
   - Contains methods for each data type migration
   - Handles error recovery and logging

2. **useDataMigration Hook** (`src/hooks/useDataMigration.ts`)
   - React hook that integrates with Redux store
   - Automatically triggers migration on app startup
   - Monitors Redux state changes

3. **DataMigrationWrapper** (`src/components/DataMigrationWrapper.tsx`)
   - React component wrapper that runs migration
   - Integrated into main app layout

4. **Database Initialization** (`src/db/DatabaseInitializer.tsx`)
   - Ensures SQLite database is ready before migration

### Migration Flow

```
App Startup
  ↓
DatabaseInitializer (ensures DB ready)
  ↓
DataMigrationWrapper (runs useDataMigration hook)
  ↓
useDataMigration (reads Redux state)
  ↓
DataMigrationService.migrateDataFromRedux()
  ↓
Individual migration methods (players, tournaments, etc.)
  ↓
Data inserted into Drizzle ORM SQLite tables
  ↓
Migration marked as complete
```

## Data Mapping Strategy

### 1. Players Migration

**Source (Redux):**

- `listesJoueurs.avecNoms[]`
- `listesJoueurs.sansNoms[]`
- `listesJoueurs.avecEquipes[]`
- `listesJoueurs.sauvegarde[]`

**Target (SQLite):**

- `joueurs` table
- `joueursListes` junction table

**Mapping:**

```typescript
{
  uniqueBDDId: number,
  name: string,
  type: JoueurType | undefined,
  equipe: number | undefined,
  isChecked: boolean
}
→
{
  id: number,           // Auto-increment
  joueurId: number,     // From uniqueBDDId
  name: string,          // Player name
  type: JoueurType,      // Player type (tireur, pointeur, etc.)
  equipe: number,        // Team ID
  isChecked: boolean    // Selection state
}
```

### 2. Player Lists Migration

**Source (Redux):**

- `listesSauvegarde.avecNoms[][]`
- `listesSauvegarde.sansNoms[][]`
- `listesSauvegarde.avecEquipes[][]`

**Target (SQLite):**

- `listesJoueurs` table
- `joueursListes` junction table

**Strategy:**

- Each saved list becomes a record in `listesJoueurs`
- Players are linked via `joueursListes` junction table
- Current working lists are also migrated as separate lists

### 3. Tournaments Migration

**Source (Redux):**

- `listeTournois[]` - Array of tournament objects
- Each tournament contains match data and options

**Target (SQLite):**

- `tournoi` table
- `match` table (with team relationships)
- `equipe` table
- `equipesJoueurs` junction table

**Mapping:**

```typescript
{
  tournoiId: number,
  name: string,
  creationDate: Date,
  updateDate: Date,
  tournoi: any[]     // Contains matches and options
}
→
{
  id: number,               // Tournament ID
  name: string,              // Tournament name
  nbTours: number,           // Number of rounds
  nbMatchs: number,          // Total matches
  nbPtVictoire: number,      // Points for victory
  speciauxIncompatibles: boolean,
  memesEquipes: boolean,
  memesAdversaires: number, // 0, 50, or 100
  typeEquipes: TypeEquipes,  // doublette, teteatete, triplette
  typeTournoi: TypeTournoi,  // mele-demele, coupe, etc.
  avecTerrains: boolean,
  mode: ModeTournoi,        // avecNoms, sansNoms, avecEquipes
  estTournoiActuel: boolean, // Default false for migrated
  createAt: number,          // Timestamp
  updatedAt: number          // Timestamp
}
```

### 4. Tournament Options Migration

**Source (Redux):**

- `optionsTournoi` - Current tournament preparation options

**Target (SQLite):**

- `preparationTournoi` table

**Mapping:**
Direct mapping of all tournament configuration options to the preparation table.

### 5. Terrains (Fields) Migration

**Source (Redux):**

- `listeTerrains[]` - Array of field objects

**Target (SQLite):**

- `terrains` table

**Mapping:**

```typescript
{
  id: number,
  name: string
}
→
{
  id: number,
  name: string,
  updatedAt: number,
  synced: number
}
```

### 6. Player Suggestions Migration

**Source (Redux):**

- `listesJoueurs.historique[]` - Player history with tournament counts

**Target (SQLite):**

- `joueursSuggestion` table

**Mapping:**

```typescript
{
  id: number,
  name: string,
  nbTournois: number
}
→
{
  name: string,
  occurence: number,     // From nbTournois
  cacher: boolean        // Default false
}
```

## Migration Safety Features

### 1. Idempotent Migration

- Migration only runs once per app installation
- Checks if SQLite database already contains data
- Skips migration if already completed

### 2. Error Handling

- Comprehensive try-catch blocks around each migration step
- Detailed error logging for debugging
- Continues with next data type if one fails

### 3. Data Validation

- Checks for empty arrays before processing
- Provides default values for missing fields
- Logs sample data for debugging structure issues

### 4. Performance Considerations

- Batch inserts for players and other large datasets
- Minimal database transactions
- Async/await for non-blocking operations

## Implementation Details

### Migration Trigger

The migration is automatically triggered when:

1. App starts up
2. Database is initialized
3. Redux store contains data
4. SQLite database is empty (first run after update)

### Migration Completion Detection

Migration is considered complete when:

- All data types have been processed
- At least one record exists in the `joueursSuggestion` table (used as indicator)
- No critical errors occurred

### Debugging and Logging

Extensive console logging is included for:

- Migration start/end
- Each data type processing
- Sample data structures
- Error details
- Success counts

## Testing Strategy

### Manual Testing

1. Install previous version with Redux data
2. Update to new version with migration
3. Verify data appears in SQLite database
4. Check app functionality with migrated data

### Automated Testing (Recommended)

```typescript
// Example test case
const testData = {
  listesJoueurs: {
    /* test data */
  },
  listesSauvegarde: {
    /* test data */
  },
  listeTournois: {
    /* test data */
  },
  listeMatchs: {
    /* test data */
  },
  optionsTournoi: {
    /* test data */
  },
  listeTerrains: {
    /* test data */
  },
};

const result = await DataMigrationService.migrateDataFromRedux(
  testData.listesJoueurs,
  testData.listesSauvegarde,
  testData.listeTournois,
  testData.listeMatchs,
  testData.optionsTournoi,
  testData.listeTerrains,
);

// Verify results in database
expected(result).toBe(true);
```

## Future Enhancements

### 1. Match Data Migration

Currently skipped due to complexity of tournament association. Could be enhanced to:

- Associate matches with tournaments based on timestamps
- Reconstruct team relationships
- Preserve match scores and history

### 2. Incremental Migration

For very large datasets:

- Process data in batches
- Show progress indicators
- Allow pause/resume

### 3. Data Verification

Post-migration verification:

- Count records in source vs target
- Validate key relationships
- Check data integrity

### 4. User Notification

- Show migration progress to users
- Provide success/failure feedback
- Offer manual retry option

## Files Modified/Created

### New Files

- `src/services/dataMigrationService.ts` - Core migration service
- `src/hooks/useDataMigration.ts` - React hook for Redux integration
- `src/components/DataMigrationWrapper.tsx` - Component wrapper

### Modified Files

- `src/store/configureStore.ts` - Added RootState type export
- `src/app/_layout.tsx` - Integrated migration wrapper

## Backward Compatibility

The migration is designed to be:

- **Non-destructive**: Original Redux data remains intact
- **Safe**: No data loss if migration fails
- **Transparent**: Users don't need to take any action
- **Automatic**: Runs silently on first launch after update

## Performance Considerations

For apps with large datasets:

- Migration runs asynchronously
- UI remains responsive
- Database operations are batched
- Memory usage is optimized

## Conclusion

This migration strategy provides a robust, automatic way to transition user data from Redux to the new Drizzle ORM SQLite database while maintaining data integrity and providing a seamless user experience during the app update process.
