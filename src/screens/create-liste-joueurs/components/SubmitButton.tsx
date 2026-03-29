import { Button, ButtonText } from '@/components/ui/button';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { listeType } from '@/types/types/searchParams';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export interface Props {
  type: listeType;
  listeJoueurs: JoueurModel[];
}

const SubmitButton: React.FC<Props> = ({ type, listeJoueurs }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const submit = async () => {
    router.back();
  };

  const getButtonTitle = () => {
    return type === 'create' ? t('creer_liste') : t('valider_modification');
  };

  return (
    <Button
      isDisabled={listeJoueurs.length === 0}
      action="positive"
      onPress={submit}
    >
      <ButtonText>{getButtonTitle()}</ButtonText>
    </Button>
  );
};

export default SubmitButton;
