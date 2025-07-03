import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '@/components/ui/select';

import { ChevronDownIcon } from '@/components/ui/icon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { JoueurType as JoueurTypeEnum } from '../types/enums/joueurType';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { useSelector } from 'react-redux';

export interface Props {
  joueurType: JoueurTypeEnum | string;
  _setJoueurType: (type: JoueurTypeEnum) => void;
}

const JoueurType: React.FC<Props> = ({ joueurType, _setJoueurType }) => {
  const { t } = useTranslation();

  const optionsTournoi = useSelector(
    (state: any) => state.optionsTournoi.options,
  );

  const _selectItemList = () => {
    const { mode, typeTournoi, typeEquipes } = optionsTournoi;
    if (
      mode === ModeTournoi.SAUVEGARDE ||
      (typeTournoi === TypeTournoi.MELEDEMELE &&
        typeEquipes === TypeEquipes.TRIPLETTE)
    ) {
      return [
        <SelectItem
          label={t('tireur')}
          value={JoueurTypeEnum.TIREUR}
          key={1}
        />,
        <SelectItem
          label={t('pointeur')}
          value={JoueurTypeEnum.POINTEUR}
          key={2}
        />,
        <SelectItem
          label={t('milieu')}
          value={JoueurTypeEnum.MILIEU}
          key={3}
        />,
      ];
    } else if (
      typeTournoi === TypeTournoi.MELEDEMELE &&
      typeEquipes === TypeEquipes.DOUBLETTE
    ) {
      return [
        <SelectItem
          label={t('tireur')}
          value={JoueurTypeEnum.TIREUR}
          key={1}
        />,
        <SelectItem
          label={t('pointeur')}
          value={JoueurTypeEnum.POINTEUR}
          key={2}
        />,
      ];
    } else {
      return [];
    }
  }

  return (
    <Select
      selectedValue={joueurType}
      aria-label={t('choisir_poste')}
      onValueChange={(itemValue: JoueurTypeEnum) => _setJoueurType(itemValue)}
    >
      <SelectTrigger variant="rounded" className="border-custom-bg-inverse">
        <SelectInput
          className="text-typography-white"
          placeholder={t('choisir_poste')}
          value={joueurType}
        />
        <SelectIcon
          className="mr-3 text-typography-white"
          as={ChevronDownIcon}
        />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          <SelectItem label={t('aucun_poste')} value="" key="none" />
          <SelectItem
            label={t('enfant')}
            value={JoueurTypeEnum.ENFANT}
            key={0}
          />
          {_selectItemList()}
        </SelectContent>
      </SelectPortal>
    </Select>
  );
};

export default JoueurType;
