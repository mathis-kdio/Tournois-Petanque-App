import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import { useDataMigration } from '@/hooks/useDataMigration';
import { getThemeColor } from '@/utils/theme/theme';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';
import { useDatabaseMigrations } from './useDatabaseMigrations';

interface DatabaseInitializerProps {
  children: React.ReactNode;
}

export const DatabaseInitializer: React.FC<DatabaseInitializerProps> = ({
  children,
}) => {
  const { sqliteDatabase, databaseMigrationDone } = useDatabaseMigrations();
  const { theme } = useTheme();
  const color = getThemeColor(theme);
  const { t } = useTranslation();

  useDrizzleStudio(sqliteDatabase);

  const dataMigrationDone = useDataMigration(databaseMigrationDone);

  if (!dataMigrationDone) {
    return (
      <Center style={{ flex: 1, backgroundColor: color }}>
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white">{t('initialisation_base')}</Text>
      </Center>
    );
  }

  return <>{children}</>;
};
