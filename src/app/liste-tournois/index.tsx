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
import { FlatList } from '@/components/ui/flat-list';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import ListeTournoiItem from '@components/ListeTournoiItem';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { ListRenderItem } from 'react-native';
import { dateFormatDateHeure } from '@/utils/date';
import { useCallback, useEffect, useState } from 'react';
import { useTournois } from '@/repositories/tournois/useTournois';
import Loading from '@/components/Loading';

const ListeTournois = () => {
  const { t } = useTranslation();

  const { getAllTournois, getActualTournoi, deleteTournoi, renameTournoi } =
    useTournois();

  const [modalTournoiInfosIsOpen, setModalTournoiInfosIsOpen] = useState(false);

  const [infosTournoi, setInfosTournoi] = useState<TournoiModel | undefined>(
    undefined,
  );
  const [listeTournois, setListeTournois] = useState<TournoiModel[]>([]);
  const [actualTournoi, setActualTournoi] = useState<TournoiModel | undefined>(
    undefined,
  );
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAllTournois();
      setListeTournois(result);
      const resulta = await getActualTournoi();
      setActualTournoi(resulta);
      setloading(false);
    };
    fetchData();
  }, [getActualTournoi, getAllTournois]);

  const handleDelete = useCallback(
    async (id: number) => {
      await deleteTournoi(id);
      setListeTournois((prev) => prev.filter((u) => u.tournoiId !== id));
    },
    [deleteTournoi],
  );

  const handleUpdateName = useCallback(
    async (id: number, name: string) => {
      await renameTournoi(id, name);
      setListeTournois((prev) =>
        prev.map((u) => (u.tournoiId === id ? { ...u, name: name } : u)),
      );
    },
    [renameTournoi],
  );

  if (loading) {
    return <Loading />;
  }

  const showModalInfos = (tournoi: TournoiModel) => {
    setModalTournoiInfosIsOpen(true);
    setInfosTournoi(tournoi);
  };

  const _modalTournoiInfos = () => {
    if (infosTournoi === undefined || infosTournoi.options === undefined) {
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

  const renderItem: ListRenderItem<TournoiModel> = ({ item }) => {
    const estTournoiActuel = actualTournoi
      ? item.tournoiId === actualTournoi.tournoiId
      : false;
    return (
      <ListeTournoiItem
        tournoi={item}
        estTournoiActuel={estTournoiActuel}
        showModalInfos={(tournoi: TournoiModel) => showModalInfos(tournoi)}
        onDelete={handleDelete}
        onUpdateName={handleUpdateName}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack className="flex-1 bg-custom-background">
        <TopBarBack title={t('choix_tournoi_navigation_title')} />
        <Text className="text-typography-white text-xl text-center px-10">
          {t('nombre_tournois', { nb: listeTournois.length })}
        </Text>
        <VStack className="flex-1 my-2">
          <FlatList
            data={listeTournois}
            initialNumToRender={20}
            keyExtractor={(item: TournoiModel) => item.tournoiId.toString()}
            renderItem={renderItem}
            className="h-1"
          />
        </VStack>
        {_modalTournoiInfos()}
      </VStack>
    </SafeAreaView>
  );
};

export default ListeTournois;
