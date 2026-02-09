import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from '@/components/ui/checkbox';
import { CheckIcon } from '@/components/ui/icon';
import { Box } from '@/components/ui/box';
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface Props {
  isChecked: boolean;
  showCheckbox: boolean;
  setModalConfirmUncheckIsOpen: (value: React.SetStateAction<boolean>) => void;
  ajoutCheck: (isChecked: boolean) => void;
}

const JoueurCheckox: React.FC<Props> = ({
  isChecked,
  showCheckbox,
  setModalConfirmUncheckIsOpen,
  ajoutCheck,
}) => {
  const { t } = useTranslation();

  const onCheckboxChange = () => {
    if (!isChecked) {
      ajoutCheck(true);
    } else {
      setModalConfirmUncheckIsOpen(true);
    }
  };

  if (!showCheckbox) {
    return;
  }

  return (
    <Box className="mr-1 place-self-center">
      <Checkbox
        value="joueurCheckbox"
        onChange={onCheckboxChange}
        aria-label={t('checkbox_inscription_joueuritem')}
        size="md"
        isChecked={isChecked}
      >
        <CheckboxIndicator className="mr-2 border-typography-white data-[checked=true]:bg-custom-background data-[checked=true]:border-typography-white">
          <CheckboxIcon
            as={CheckIcon}
            className="text-typography-white bg-custom-background"
          />
        </CheckboxIndicator>
        <CheckboxLabel />
      </Checkbox>
    </Box>
  );
};

export default JoueurCheckox;
