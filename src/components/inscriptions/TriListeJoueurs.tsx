import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from '@/components/ui/actionsheet';

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  setTriType: (arg0: string) => void;
}

const TriListeJoueurs: React.FC<Props> = ({ isOpen, onClose, setTriType }) => {
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
          <ActionsheetItemText>Par défaut</ActionsheetItemText>
        </ActionsheetItem>
        <ActionsheetItem onPress={() => onPress('alpha')}>
          <ActionsheetItemText>Alphabétique A  Z</ActionsheetItemText>
        </ActionsheetItem>
        <ActionsheetItem onPress={() => onPress('alphaDesc')}>
          <ActionsheetItemText>Alphabétique Z  A</ActionsheetItemText>
        </ActionsheetItem>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default TriListeJoueurs;
