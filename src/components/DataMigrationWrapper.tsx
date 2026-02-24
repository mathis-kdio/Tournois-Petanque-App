import { useDataMigration } from '@/hooks/useDataMigration';
import React, { ReactNode } from 'react';

export const DataMigrationWrapper = ({ children }: { children: ReactNode }) => {
  // This hook will automatically run the data migration when the component mounts
  useDataMigration();

  return <>{children}</>;
};
