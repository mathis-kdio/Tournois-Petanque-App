import { Heading } from '@/components/ui/heading';
import { CloseIcon, Icon } from '@/components/ui/icon';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@/components/ui/modal';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { dateFormatDateHeure } from '@/utils/date';
import { SetStateAction } from 'react';

export interface Props {
  infosTournoi: TournoiModel;
  modalTournoiInfosIsOpen: boolean;
  setModalTournoiInfosIsOpen: (value: SetStateAction<boolean>) => void;
}

const ModalInfosTournoi: React.FC<Props> = ({
  infosTournoi,
  modalTournoiInfosIsOpen,
  setModalTournoiInfosIsOpen,
}) => {
  const { t } = useTranslation();

  if (infosTournoi.options === undefined) {
    return;
  }
  const { options, creationDate, updateDate, tournoiId, name } = infosTournoi;
  const {
    nbPtVictoire,
    listeJoueurs,
    typeTournoi,
    typeEquipes,
    nbTours,
    nbMatchs,
    complement,
    memesEquipes,
    memesAdversaires,
    speciauxIncompatibles,
  } = options;
  let creationDateFormat = creationDate
    ? dateFormatDateHeure(creationDate)
    : t('date_inconnue');
  let updateDateFormat = updateDate
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
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text>{`${t('id_modal_informations_tournoi')} ${tournoiId}`}</Text>
          <Text>
            {`${t('nom_modal_informations_tournoi')} ${name ? name : t('sans_nom')}`}
          </Text>
          <Text>
            {`${t('creation_modal_informations_tournoi')} ${creationDateFormat}`}
          </Text>
          <Text>
            {`${t('derniere_modification_modal_informations_tournoi')} ${updateDateFormat}`}
          </Text>
          <Text>
            {`${t('nombre_joueurs_modal_informations_tournoi')} ${listeJoueurs.length}`}
          </Text>
          <Text>
            {`${t('type_tournoi_modal_informations_tournoi')} ${typeTournoi}`}
          </Text>
          <Text>
            {`${t('type_equipes_modal_informations_tournoi')} ${typeEquipes}`}
          </Text>
          <Text>
            {`${t('nombre_tours_modal_informations_tournoi')} ${nbTours}`}
          </Text>
          <Text>
            {`${t('nombre_matchs_modal_informations_tournoi')} ${nbMatchs}`}
          </Text>
          <Text>
            {`${t('nombre_points_victoire_modal_informations_tournoi')} ${nbPtVictoire ? nbPtVictoire : 13}`}
          </Text>
          {complement && (
            <Text>
              {`${t('complement_modal_informations_tournoi')} ${complement}`}
            </Text>
          )}
          <Text>
            {`${t('regle_equipes_differentes_modal_informations_tournoi')} ${memesEquipes ? t('oui') : t('non')}`}
          </Text>
          <Text>
            {`${t('regle_adversaires_modal_informations_tournoi')} ${memesAdversaires === 0 ? t('1_match') : t('pourcent_matchs', { pourcent: memesAdversaires })}`}
          </Text>
          <Text>
            {`${t('regle_speciaux_modal_informations_tournoi')} ${speciauxIncompatibles ? t('oui') : t('non')}`}
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalInfosTournoi;
