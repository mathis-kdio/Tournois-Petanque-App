import { Heading } from '@/components/ui/heading';
import { CloseIcon, Icon } from '@/components/ui/icon';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from '@/components/ui/modal';
import { Text } from '@/components/ui/text';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { dateFormatDateHeure } from '@/utils/date';
import { useTranslation } from 'react-i18next';

export interface Props {
  infosTournoi: TournoiModel;
  listeJoueurs: JoueurModel[];
  modalTournoiInfosIsOpen: boolean;
  setModalTournoiInfosIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalInfosTournoi: React.FC<Props> = ({
  infosTournoi,
  listeJoueurs,
  modalTournoiInfosIsOpen,
  setModalTournoiInfosIsOpen,
}) => {
  const { t } = useTranslation();

  const { options, creationDate, updateDate, tournoiId, name } = infosTournoi;
  const {
    nbPtVictoire,
    typeTournoi,
    typeEquipes,
    nbTours,
    nbMatchs,
    complement,
    memesEquipes,
    memesAdversaires,
    speciauxIncompatibles,
  } = options;
  const creationDateFormat = creationDate
    ? dateFormatDateHeure(creationDate)
    : t('date_inconnue');
  const updateDateFormat = updateDate
    ? dateFormatDateHeure(updateDate)
    : t('date_inconnue');
  return (
    <Modal
      isOpen={modalTournoiInfosIsOpen}
      onClose={() => setModalTournoiInfosIsOpen(false)}
    >
      <ModalBackdrop />
      <ModalContent className="max-h-5/6">
        <ModalHeader>
          <Heading className="text-custom-text" size="lg">
            {t('informations_tournoi_modal_titre')}
          </Heading>
          <ModalCloseButton>
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-gray-600 group-[:hover]/modal-close-button:stroke-gray-300 group-active/modal-close-button:stroke-gray-100 group-focus-visible/modal-close-button:stroke-gray-100"
            />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text className="text-custom-text-modal">{`${t('id_modal_informations_tournoi')} ${tournoiId}`}</Text>
          <Text className="text-custom-text-modal">
            {`${t('nom_modal_informations_tournoi')} ${name ? name : t('sans_nom')}`}
          </Text>
          <Text className="text-custom-text-modal">
            {`${t('creation_modal_informations_tournoi')} ${creationDateFormat}`}
          </Text>
          <Text className="text-custom-text-modal">
            {`${t('derniere_modification_modal_informations_tournoi')} ${updateDateFormat}`}
          </Text>
          <Text className="text-custom-text-modal">
            {`${t('nombre_joueurs_modal_informations_tournoi')} ${listeJoueurs.length}`}
          </Text>
          <Text className="text-custom-text-modal">
            {`${t('type_tournoi_modal_informations_tournoi')} ${typeTournoi}`}
          </Text>
          <Text className="text-custom-text-modal">
            {`${t('type_equipes_modal_informations_tournoi')} ${typeEquipes}`}
          </Text>
          <Text className="text-custom-text-modal">
            {`${t('nombre_tours_modal_informations_tournoi')} ${nbTours}`}
          </Text>
          <Text className="text-custom-text-modal">
            {`${t('nombre_matchs_modal_informations_tournoi')} ${nbMatchs}`}
          </Text>
          <Text className="text-custom-text-modal">
            {`${t('nombre_points_victoire_modal_informations_tournoi')} ${nbPtVictoire ? nbPtVictoire : 13}`}
          </Text>
          {complement && (
            <Text className="text-custom-text-modal">
              {`${t('complement_modal_informations_tournoi')} ${complement}`}
            </Text>
          )}
          <Text className="text-custom-text-modal">
            {`${t('regle_equipes_differentes_modal_informations_tournoi')} ${memesEquipes ? t('oui') : t('non')}`}
          </Text>
          <Text className="text-custom-text-modal">
            {`${t('regle_adversaires_modal_informations_tournoi')} ${memesAdversaires === 0 ? t('1_match') : t('pourcent_matchs', { pourcent: memesAdversaires })}`}
          </Text>
          <Text className="text-custom-text-modal">
            {`${t('regle_speciaux_modal_informations_tournoi')} ${speciauxIncompatibles ? t('oui') : t('non')}`}
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalInfosTournoi;
