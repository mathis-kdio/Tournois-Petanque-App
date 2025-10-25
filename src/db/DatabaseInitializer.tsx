import React from 'react';
import { useDatabaseMigrations } from './useDatabaseMigrations';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { ActivityIndicator } from 'react-native';

interface DatabaseInitializerProps {
  children: React.ReactNode;
}

export const DatabaseInitializer: React.FC<DatabaseInitializerProps> = ({
  children,
}) => {
  const { db } = useDatabaseMigrations();

  if (!db) {
    return (
      <HStack>
        <ActivityIndicator size="large" />
        <Text>Initialisation de la base...</Text>
      </HStack>
    );
  }

  return <>{children}</>;
};
