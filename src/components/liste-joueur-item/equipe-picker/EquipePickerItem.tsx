import { SelectItem } from '@/components/ui/select';
import React from 'react';

export interface Props {
  equipe: number;
}

const EquipePickerItem: React.FC<Props> = ({ equipe }) => {
  return (
    <SelectItem
      label={equipe.toString()}
      value={equipe.toString()}
      key={equipe}
    />
  );
};

export default EquipePickerItem;
