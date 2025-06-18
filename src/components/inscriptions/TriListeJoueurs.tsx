import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from '@/components/ui/actionsheet';
import { useTranslation } from 'react-i18next';

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  setTriType: (arg0: string) => void;
}

const TriListeJoueurs: React.FC<Props> = ({ isOpen, onClose, setTriType }) => {
  const { t } = useTranslation();

  const onPress = (type: string) => {
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
        <ActionsheetItem onPress={() => onPress('id')}>
          <ActionsheetItemText>{t('defaut')}</ActionsheetItemText>
        </ActionsheetItem>
        <ActionsheetItem onPress={() => onPress('alpha')}>
          <ActionsheetItemText>{t('alphaAZ')}</ActionsheetItemText>
        </ActionsheetItem>
        <ActionsheetItem onPress={() => onPress('alphaDesc')}>
          <ActionsheetItemText>{t('alphaZA')}</ActionsheetItemText>
        </ActionsheetItem>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default TriListeJoueurs;
