import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import React, { useState } from 'react';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { Pressable } from 'react-native';
import TriListeJoueurs from './inscriptions/TriListeJoueurs';
import { Tri } from '@/types/enums/tri';
import { JoueurType as JoueurTypeEnum } from '@/types/enums/joueurType';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import InscriptionForm from './inscriptions/InscriptionForm';
import InscriptionRemoveAllModal from './inscriptions/InscriptionRemoveAllModal';
import InscriptionListeJoueurs from './inscriptions/InscriptionListeJoueurs';

export interface Props {
  listeJoueurs: JoueurModel[];
  preparationTournoi: PreparationTournoiModel;
  loadListScreen: boolean;
  onAddJoueur: (
    joueurName: string,
    joueurType: JoueurTypeEnum | undefined,
  ) => void;
  onDeleteJoueur: (id: number) => void;
  onAddEquipeJoueur: (id: number, equipeId: number) => void;
  onUpdateName: (joueurModel: JoueurModel, name: string) => void;
  onCheckJoueur: (joueurModel: JoueurModel, isChecked: boolean) => void;
  onDeleteAllJoueurs: () => void;
}

const Inscription: React.FC<Props> = ({
  listeJoueurs,
  preparationTournoi,
  loadListScreen,
  onAddJoueur,
  onDeleteJoueur,
  onAddEquipeJoueur,
  onUpdateName,
  onCheckJoueur,
  onDeleteAllJoueurs,
}) => {
  const { t } = useTranslation();

  const [modalRemoveIsOpen, setModalRemoveIsOpen] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [showTri, setshowTri] = useState(false);
  const [triType, setTriType] = useState<Tri>(Tri.ID);

  const checkboxSection = () => {
    const icon = showCheckbox ? 'eye-slash' : 'eye';
    const text = showCheckbox ? t('cacher') : t('afficher');
    return (
      <Pressable
        onPress={() => setShowCheckbox(!showCheckbox)}
        className="my-1 flex-row items-center"
      >
        <FontAwesome5
          name={icon}
          size={15}
          className="text-custom-bg-inverse"
        />
        <Text className="text-typography-white text-md">
          {` ${text} ${t('case_a_cocher')}`}
        </Text>
      </Pressable>
    );
  };

  const triSection = () => {
    return (
      <Box>
        <Pressable
          onPress={() => setshowTri(!showTri)}
          className="my-1 flex-row items-center"
        >
          <MaterialCommunityIcons
            name="sort"
            size={24}
            className="text-custom-bg-inverse"
          />
          <Text className="text-typography-white text-md">{` ${t('trier_joueurs')}`}</Text>
        </Pressable>
        <TriListeJoueurs
          isOpen={showTri}
          onClose={() => setshowTri(false)}
          setTriType={setTriType}
        />
      </Box>
    );
  };

  return (
    <VStack className="flex-1">
      <InscriptionForm
        preparationTournoi={preparationTournoi}
        onAddJoueur={onAddJoueur}
      />
      <Divider className="bg-custom-bg-inverse h-0.5 my-2" />
      <HStack className="px-1 items-center justify-between">
        <Box className="w-fit">{triSection()}</Box>
        <Box className="w-fit">{checkboxSection()}</Box>
      </HStack>
      <VStack className="flex-1">
        <InscriptionListeJoueurs
          listeJoueurs={listeJoueurs}
          preparationTournoi={preparationTournoi}
          loadListScreen={loadListScreen}
          showCheckbox={showCheckbox}
          triType={triType}
          onAddJoueur={onAddJoueur}
          onDeleteJoueur={onDeleteJoueur}
          onAddEquipeJoueur={onAddEquipeJoueur}
          onUpdateName={onUpdateName}
          onCheckJoueur={onCheckJoueur}
          setModalRemoveIsOpen={setModalRemoveIsOpen}
        />
      </VStack>
      <InscriptionRemoveAllModal
        modalRemoveIsOpen={modalRemoveIsOpen}
        setModalRemoveIsOpen={setModalRemoveIsOpen}
        onDeleteAllJoueurs={onDeleteAllJoueurs}
      />
    </VStack>
  );
};

export default Inscription;
