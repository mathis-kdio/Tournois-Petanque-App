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
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { JoueurModel } from '@/types/interfaces/joueurModel';

export interface Props {
  joueur: JoueurModel;
  typeEquipes: TypeEquipes;
  listesJoueurs: JoueurModel[];
  onAddEquipeJoueur: (id: number, equipeId: number) => void;
}

const EquipePicker: React.FC<Props> = ({
  joueur,
  typeEquipes,
  listesJoueurs,
  onAddEquipeJoueur,
}) => {
  const { t } = useTranslation();

  const { joueurTournoiId, equipe } = joueur;

  const equipePickerItem = (equipe: number) => {
    return (
      <SelectItem
        label={equipe.toString()}
        value={equipe.toString()}
        key={equipe}
      />
    );
  };

  const ajoutEquipe = (equipeId: number) => {
    /*const action = {
      type: 'AJOUT_EQUIPE_JOUEUR',
      value: [ModeTournoi.AVECEQUIPES, joueurId, equipeId],
    };
    dispatch(action);*/
    onAddEquipeJoueur(joueurTournoiId, equipeId);
  };

  const selectedValue = equipe ? equipe.toString() : '0';
  let nbEquipes = listesJoueurs.length;
  if (typeEquipes === TypeEquipes.DOUBLETTE) {
    nbEquipes = Math.ceil(listesJoueurs.length / 2);
  } else if (typeEquipes === TypeEquipes.TRIPLETTE) {
    nbEquipes = Math.ceil(listesJoueurs.length / 3);
  }

  const pickerItem = [];
  for (let i = 1; i <= nbEquipes; i++) {
    const count = listesJoueurs.reduce(
      (counter, joueur) => (joueur.equipe === i ? counter++ : counter),
      0,
    );
    if (typeEquipes === TypeEquipes.TETEATETE && count < 1) {
      pickerItem.push(equipePickerItem(i));
    } else if (typeEquipes === TypeEquipes.DOUBLETTE && count < 2) {
      pickerItem.push(equipePickerItem(i));
    } else if (typeEquipes === TypeEquipes.TRIPLETTE && count < 3) {
      pickerItem.push(equipePickerItem(i));
    } else if (equipe === i) {
      pickerItem.push(equipePickerItem(i));
    }
  }

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
