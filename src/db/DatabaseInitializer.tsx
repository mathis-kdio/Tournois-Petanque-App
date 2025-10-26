import React from 'react';
import { useDatabaseMigrations } from './useDatabaseMigrations';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { ActivityIndicator } from 'react-native';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

interface DatabaseInitializerProps {
  children: React.ReactNode;
}

export const DatabaseInitializer: React.FC<DatabaseInitializerProps> = ({
  children,
}) => {
  const { sqliteDatabase, expoSQLiteDatabase } = useDatabaseMigrations();

  useDrizzleStudio(sqliteDatabase);

  if (!expoSQLiteDatabase) {
    return (
      <HStack>
        <ActivityIndicator size="large" />
        <Text>Initialisation de la base...</Text>
      </HStack>
    );
  }

  return <>{children}</>;
};
