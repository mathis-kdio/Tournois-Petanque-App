import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useDataMigration } from '@/hooks/useDataMigration';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useDatabaseMigrations } from './useDatabaseMigrations';

interface DatabaseInitializerProps {
  children: React.ReactNode;
}

export const DatabaseInitializer: React.FC<DatabaseInitializerProps> = ({
  children,
}) => {
  const { sqliteDatabase, databaseMigrationDone } = useDatabaseMigrations();

  useDrizzleStudio(sqliteDatabase);

  const dataMigrationDone = useDataMigration(databaseMigrationDone);

  if (!dataMigrationDone) {
    return (
      <HStack>
        <ActivityIndicator size="large" />
        <Text>Initialisation de la base...</Text>
      </HStack>
    );
  }

  return <>{children}</>;
};
