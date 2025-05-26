import { VStack } from '@/components/ui/vstack';
import { Divider } from '@/components/ui/divider';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Joueur } from '@/types/interfaces/joueur';
import { Victoire } from '@/types/interfaces/victoire';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export interface Props {
  joueur: Victoire;
}

const ListeResultatItem: React.FC<Props> = ({ joueur }) => {
  const { t } = useTranslation();

  const listeMatchs = useSelector(
    (state: any) => state.gestionMatchs.listematchs,
  );

  const _displayName = (joueurId: number) => {
    let listeJoueurs = listeMatchs[listeMatchs.at(-1)].listeJoueurs;
    let joueur = listeJoueurs.find((item: Joueur) => item.id === joueurId);
    let joueurName = '';
    if (joueur.name === undefined) {
      joueurName = t('sans_nom') + ' (' + (joueur.id + 1) + ')';
    } else if (joueur.name === '') {
      joueurName = t('joueur') + ' ' + (joueur.id + 1);
    } else {
      joueurName = joueur.name + ' (' + (joueur.id + 1) + ')';
    }

    return <Text className="text-white text-lg">{joueurName}</Text>;
  };

  const _fanny = (joueurNumber: number) => {
    let fanny = false;
    let nbFanny = 0;
    for (let i = 0; i < listeMatchs[listeMatchs.at(-1)].nbMatchs; i++) {
      if (
        listeMatchs[i].equipe[0].includes(joueurNumber) &&
        listeMatchs[i].score1 === '0'
      ) {
        fanny = true;
        nbFanny++;
      } else if (
        listeMatchs[i].equipe[1].includes(joueurNumber) &&
        listeMatchs[i].score2 === '0'
      ) {
        fanny = true;
        nbFanny++;
      }
    }
    if (fanny === true) {
      return (
        <HStack>
          <Image
            size="2xs"
            alt="Fanny"
            source={require('@assets/images/fanny.png')}
          />
          <Text className="text-white text-lg">X{nbFanny}</Text>
        </HStack>
      );
    }
  };

  return (
    <VStack>
      <HStack className="flex px-2 py-0.5">
        <HStack className="basis-2/5">
          <Text className="text-white text-lg">{joueur.position} - </Text>
          {_displayName(joueur.joueurId)}
        </HStack>
        <Text className="basis-1/5 text-center text-white text-lg">
          {joueur.victoires}
        </Text>
        <Text className="basis-1/5 text-center text-white text-lg">
          {joueur.nbMatchs}
        </Text>
        <HStack className="basis-1/5 justify-end">
          {_fanny(joueur.joueurId)}
          <Text className="text-white text-lg"> {joueur.points}</Text>
        </HStack>
      </HStack>
      <Divider />
    </VStack>
  );
};

export default ListeResultatItem;
