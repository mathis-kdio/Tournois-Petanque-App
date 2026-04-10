import { cssInterop } from 'nativewind';
import { SwitchProps } from 'react-native';
import { Switch } from '.';

type TrackColorInput = {
  backgroundColor?: string;
};

type CustomSwitchProps = SwitchProps & {
  trackColor?: TrackColorInput;
};

const StyledSwitchImpl = ({ trackColor, ...props }: CustomSwitchProps) => {
  return (
    <Switch
      {...props}
      trackColor={{
        true: 'var(--color-custom-dark-blue)',
        false: '#ffffff',
      }}
    />
  );
};

export const StyledSwitch = cssInterop(StyledSwitchImpl, {
  trackColorclassName: 'trackColor'
});
