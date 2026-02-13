import { Button, ButtonText } from '@/components/ui/button';
import { NewJoueur, NewJoueursListes, NewListesJoueurs } from '@/db/schema';
import { useListesJoueurs } from '@/repositories/listesJoueurs/useListesJoueurs';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { listeType } from '@/types/types/searchParams';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export interface Props {
  type: listeType;
  idList: number | undefined;
  listeJoueurs: JoueurModel[];
}

const SubmitButton: React.FC<Props> = ({ type, idList, listeJoueurs }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const { insertListeJoueurs } = useListesJoueurs();

  const submitCreate = () => {
    const a: NewListesJoueurs = {};
    const z = insertListeJoueurs(a);

    const b: NewJoueur[] = [];
    const joueurs = saveJoueurs(b);

    const c: NewJoueursListes[] = [];
    joueurs.forEach((joueur) => {
      c.push({ joueurId: joueur.id, listeId: z.at(0)?.id });
    });
    insertListeJoueurs(c);
  };

  const submitEdit = (listId: number) => {
    //ListesJoueursRepository.update(listId, listesJoueurs);
  };

  const submit = async (type: string, listId?: number) => {
    if (type === 'create') {
      submitCreate();
    } else if (type === 'edit') {
      if (listId === undefined) {
        throw Error();
      }
      submitEdit(listId);
    }

    router.back();
  };

  const getButtonTitle = () => {
    return type === 'create' ? t('creer_liste') : t('valider_modification');
  };

  return (
    <Button
      isDisabled={listeJoueurs.length === 0}
      action="positive"
      onPress={() => submit(type, idList)}
    >
      <ButtonText>{getButtonTitle()}</ButtonText>
    </Button>
  );
};

export default SubmitButton;
