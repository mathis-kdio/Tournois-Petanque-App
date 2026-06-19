import { ChevronDownIcon } from '@/components/ui/icon';
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
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import React from 'react';
import { useTranslation } from 'react-i18next';
import EquipePickerItem from './EquipePickerItem';

export interface Props {
  joueur: JoueurModel;
  typeEquipes: TypeEquipes;
  listesJoueurs: JoueurModel[];
  onAddEquipeJoueur: (
    joueurModel: JoueurModel,
    equipeId: number,
  ) => Promise<void>;
}

const EquipePicker: React.FC<Props> = ({
  joueur,
  typeEquipes,
  listesJoueurs,
  onAddEquipeJoueur,
}) => {
  const { t } = useTranslation();

  const { equipe } = joueur;

  const ajoutEquipe = async (equipeId: number) => {
    await onAddEquipeJoueur(joueur, equipeId);
  };

  const selectedValue = equipe ? equipe.toString() : '0';
  const nbJoueur = listesJoueurs.length;
  let nbEquipes = nbJoueur;
  if (typeEquipes === TypeEquipes.DOUBLETTE) {
    nbEquipes = Math.ceil(nbJoueur / 2);
  } else if (typeEquipes === TypeEquipes.TRIPLETTE) {
    nbEquipes = Math.ceil(nbJoueur / 3);
  }

  const pickerItem = Array.from({ length: nbEquipes }, (_, i) => i + 1).flatMap(
    (equipId) => {
      const count = listesJoueurs.reduce(
        (counter, joueur) => (joueur.equipe === equipId ? counter++ : counter),
        0,
      );
      if (
        (typeEquipes === TypeEquipes.TETEATETE && count < 1) ||
        (typeEquipes === TypeEquipes.DOUBLETTE && count < 2) ||
        (typeEquipes === TypeEquipes.TRIPLETTE && count < 3) ||
        equipe === equipId
      ) {
        return [<EquipePickerItem equipe={equipId} key={equipId} />];
      }
      return [];
    },
  );

  return (
    <Select
      selectedValue={selectedValue}
      aria-label={t('choix_equipe')}
      onValueChange={(itemValue) => ajoutEquipe(parseInt(itemValue))}
    >
      <SelectTrigger className="flex flex-row border-custom-bg-inverse">
        <SelectInput
          className="basis-5/6 text-typography-white placeholder:text-typography-white"
          placeholder={t('choix_equipe')}
        />
        <SelectIcon
          className="basis-1/6 mr-3 text-typography-white"
          as={ChevronDownIcon}
        />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          <SelectItem label={t('choisir')} value="0" key="0" />
          {pickerItem}
        </SelectContent>
      </SelectPortal>
    </Select>
  );
};

export default EquipePicker;
