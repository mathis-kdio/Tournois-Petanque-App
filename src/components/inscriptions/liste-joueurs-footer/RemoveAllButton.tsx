import { Button, ButtonText } from '@/components/ui/button';
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface Props {
  setModalRemoveIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RemoveAllButton: React.FC<Props> = ({ setModalRemoveIsOpen }) => {
  const { t } = useTranslation();

  return (
    <Button action="negative" onPress={() => setModalRemoveIsOpen(true)}>
      <ButtonText>{t('supprimer_joueurs_bouton')}</ButtonText>
    </Button>
  );
};

export default RemoveAllButton;
