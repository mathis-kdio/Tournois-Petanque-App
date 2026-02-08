import { Button, ButtonText } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { listeType } from '@/types/types/searchParams';
import { NewJoueur, NewJoueursListes, NewListesJoueurs } from '@/db/schema';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { useListesJoueurs } from '@/repositories/listesJoueurs/useListesJoueurs';

export interface Props {
  type: listeType;
  idList: number | undefined;
  listesJoueurs: JoueurModel[];
}

const SubmitButton: React.FC<Props> = ({ type, idList, listesJoueurs }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

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
      isDisabled={listesJoueurs.length === 0}
      action="positive"
      onPress={() => submit(type, idList)}
    >
      <ButtonText>{getButtonTitle()}</ButtonText>
    </Button>
  );
};

export default SubmitButton;
