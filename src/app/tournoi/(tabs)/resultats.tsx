import useExitAlertOnBack from '@/components/with-exit-alert/with-exit-alert';
import ListeResultats from '@/screens/resultats';

const ListeResultatsScreen = () => {
  useExitAlertOnBack();

  return <ListeResultats />;
};

export default ListeResultatsScreen;
