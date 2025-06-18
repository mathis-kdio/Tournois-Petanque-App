import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from '@/components/ui/actionsheet';
import { Tri } from '@/types/enums/tri';
import { useTranslation } from 'react-i18next';

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  setTriType: (arg0: Tri) => void;
}

const TriListeJoueurs: React.FC<Props> = ({ isOpen, onClose, setTriType }) => {
  const { t } = useTranslation();

  const onPress = (type: Tri) => {
    setTriType(type);
    onClose();
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <ActionsheetItem onPress={() => onPress(Tri.ID)}>
          <ActionsheetItemText>{t('defaut')}</ActionsheetItemText>
        </ActionsheetItem>
        <ActionsheetItem onPress={() => onPress(Tri.ALPHA_ASC)}>
          <ActionsheetItemText>{t('alphaAZ')}</ActionsheetItemText>
        </ActionsheetItem>
        <ActionsheetItem onPress={() => onPress(Tri.ALPHA_DESC)}>
          <ActionsheetItemText>{t('alphaZA')}</ActionsheetItemText>
        </ActionsheetItem>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default TriListeJoueurs;
