import { Center } from '@/components/ui/center';
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
      <Center className="flex-1">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white">Initialisation de la base...</Text>
      </Center>
    );
  }

  return <>{children}</>;
};
