import TopBarBack from '@/components/topBar/TopBarBack';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { VStack } from '@/components/ui/vstack';
import { supabaseClient } from '@/utils/supabase';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

type SecuriteState = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  showOldPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  isLoading: boolean;
  error: boolean;
};

const initialState: SecuriteState = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
  showOldPassword: false,
  showNewPassword: false,
  showConfirmPassword: false,
  isLoading: false,
  error: false,
};

const Securite = () => {
  const { t } = useTranslation();
  const [state, setState] = useState<SecuriteState>(initialState);

  const {
    oldPassword,
    newPassword,
    confirmPassword,
    showOldPassword,
    showNewPassword,
    showConfirmPassword,
    isLoading,
    error,
  } = state;

  const mdpInput1 = useRef<any>(null);
  const mdpInput2 = useRef<any>(null);
  const mdpInput3 = useRef<any>(null);

  const setField = (
    field: 'oldPassword' | 'newPassword' | 'confirmPassword',
    value: string,
  ) => {
    setState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleShowPassword = (
    field: 'showOldPassword' | 'showNewPassword' | 'showConfirmPassword',
  ) => {
    setState((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const setLoading = (value: boolean) => {
    setState((prev) => ({
      ...prev,
      isLoading: value,
    }));
  };

  const setErrorState = (value: boolean) => {
    setState((prev) => ({
      ...prev,
      error: value,
    }));
  };

  const handleChangePassword = async () => {
    // TODO comparaison avec oldPassword de l'utilisateur à faire
    if (!oldPassword.trim() || oldPassword !== oldPassword) {
      Alert.alert('Erreur', 'Ancien mot de passe incorrecte.');
      setErrorState(true);
      return;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un nouveau mot de passe valide.');
      setErrorState(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      setErrorState(true);
      return;
    }

    setLoading(true);

    const { error } = await supabaseClient.auth
      .updateUser({
        password: newPassword,
      })
      .catch(() => ({
        error: new Error(
          'Une erreur est survenue lors du changement de mot de passe.',
        ),
      }));

    if (error) {
      Alert.alert('Erreur', error.message);
      setErrorState(true);
    } else {
      Alert.alert('Succès', 'Votre mot de passe a été changé avec succès.');
      setErrorState(false);
    }

    setLoading(false);
  };

  const handleInputChange = (
    field: 'oldPassword' | 'newPassword' | 'confirmPassword',
  ) => {
    return (value: string) => {
      setField(field, value);
    };
  };

  return (
    <ScrollView className="h-1 bg-custom-background">
      <TopBarBack title={t('securite')} />
      <VStack className="flex-1 px-10">
        <VStack className="flex-1">
          <Heading className="text-typography-white">
            {t('changer_mdp')}
          </Heading>
          <FormControl isInvalid={error} isRequired={true} className="mb-5">
            <FormControlLabel className="mb-1 *:text-typography-white">
              <FormControlLabelText>{t('ancien_mdp')}</FormControlLabelText>
            </FormControlLabel>
            <Input className="border-custom-bg-inverse">
              <InputField
                className="text-typography-white placeholder:text-typography-white"
                placeholder={t('ancien_mdp')}
                secureTextEntry={!showOldPassword}
                returnKeyType="next"
                autoCapitalize={'none'}
                onChangeText={handleInputChange('oldPassword')}
                onSubmitEditing={() => mdpInput2.current.focus()}
                ref={mdpInput1}
              />
              <InputSlot className="pr-3">
                <Button
                  className="bg-transparent text-custom-bg-inverse"
                  onPress={() => toggleShowPassword('showOldPassword')}
                >
                  <ButtonIcon as={showOldPassword ? EyeOffIcon : EyeIcon} />
                </Button>
              </InputSlot>
            </Input>
          </FormControl>
          <FormControl isInvalid={error} isRequired={true} className="mb-5">
            <FormControlLabel className="mb-1 *:text-typography-white">
              <FormControlLabelText>{t('nouveau_mdp')}</FormControlLabelText>
            </FormControlLabel>
            <Input className="border-custom-bg-inverse">
              <InputField
                className="text-typography-white placeholder:text-typography-white"
                placeholder={t('nouveau_mdp')}
                secureTextEntry={!showNewPassword}
                returnKeyType="next"
                autoCapitalize={'none'}
                onChangeText={handleInputChange('newPassword')}
                onSubmitEditing={() => mdpInput3.current.focus()}
                ref={mdpInput2}
              />
              <InputSlot className="pr-3">
                <Button
                  className="bg-transparent text-custom-bg-inverse"
                  onPress={() => toggleShowPassword('showNewPassword')}
                >
                  <ButtonIcon as={showNewPassword ? EyeOffIcon : EyeIcon} />
                </Button>
              </InputSlot>
            </Input>
          </FormControl>
          <FormControl isInvalid={error} isRequired={true} className="mb-5">
            <FormControlLabel className="mb-1 *:text-typography-white">
              <FormControlLabelText>
                {t('mot_de_passe_confirmation')}
              </FormControlLabelText>
            </FormControlLabel>
            <Input className="border-custom-bg-inverse">
              <InputField
                className="text-typography-white placeholder:text-typography-white"
                placeholder={t('confirmer_mdp')}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize={'none'}
                onChangeText={handleInputChange('confirmPassword')}
                ref={mdpInput3}
              />
              <InputSlot className="pr-3">
                <Button
                  className="bg-transparent text-custom-bg-inverse"
                  onPress={() => toggleShowPassword('showConfirmPassword')}
                >
                  <ButtonIcon as={showConfirmPassword ? EyeOffIcon : EyeIcon} />
                </Button>
              </InputSlot>
            </Input>
          </FormControl>
          <FormControl>
            <Button onPress={handleChangePassword} disabled={isLoading}>
              <ButtonText>
                {isLoading ? t('chargement') : t('changer_mdp')}
              </ButtonText>
            </Button>
          </FormControl>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default Securite;
