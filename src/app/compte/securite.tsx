import { VStack } from '@/components/ui/vstack';
import { ScrollView } from '@/components/ui/scroll-view';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { supabaseClient } from '@/utils/supabase';
import { Alert } from 'react-native';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { FontAwesome5 } from '@expo/vector-icons';
import { Heading } from '@/components/ui/heading';

const Securite = () => {
  const { t } = useTranslation();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(true);

  const mdpInput1 = React.createRef<any>();
  const mdpInput2 = React.createRef<any>();
  const mdpInput3 = React.createRef<any>();

  const handleChangePassword = async () => {
    if (oldPassword !== oldPassword) {
      Alert.alert('Erreur', 'Ancien mot de passe incorrecte.');
      setError(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      setError(true);
      return;
    }

    setIsLoading(true);
    try {
      // Mise à jour du mot de passe
      const { error } = await supabaseClient.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        Alert.alert('Erreur', error.message);
        setError(true);
      } else {
        Alert.alert('Succès', 'Votre mot de passe a été changé avec succès.');
      }
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors du changement de mot de passe.',
      );
      setError(true);
    } finally {
      setIsLoading(false);
      setError(false);
    }
  };

  const handleInputChange =
    (field: 'oldPassword' | 'newPassword' | 'confirmPassword') =>
    (value: string) => {
      switch (field) {
        case 'oldPassword':
          setOldPassword(value);
          break;
        case 'newPassword':
          setNewPassword(value);
          break;
        case 'confirmPassword':
          setConfirmPassword(value);
          break;
        default:
          break;
      }
    };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="h-1 bg-custom-background">
        <TopBarBack title={t('securite')} />
        <VStack className="flex-1 px-10">
          <VStack className="flex-1">
            <Heading className="text-typography-white">
              Changer le mot de passe
            </Heading>
            <FormControl isInvalid={error} isRequired={true} className="mb-5">
              <FormControlLabel className="mb-1">
                <FormControlLabelText className="text-typography-white">
                  {t('ancien_mdp')}
                </FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder={t('ancien_mdp')}
                  secureTextEntry={!showOldPassword}
                  returnKeyType="next"
                  autoCapitalize={'none'}
                  onChangeText={handleInputChange('oldPassword')}
                  onSubmitEditing={() => mdpInput2.current.focus()}
                  ref={mdpInput1}
                />
                <InputSlot className="pr-3">
                  <FontAwesome5.Button
                    name={showOldPassword ? 'eye' : 'eye-slash'}
                    backgroundColor="#00000000"
                    iconStyle={{ marginRight: 0 }}
                    size={16}
                    onPress={() => setShowOldPassword(!showOldPassword)}
                  />
                </InputSlot>
              </Input>
            </FormControl>
            <FormControl isInvalid={error} isRequired={true} className="mb-5">
              <FormControlLabel className="mb-1">
                <FormControlLabelText className="text-typography-white">
                  {t('nouveau_mdp')}
                </FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder={t('nouveau_mdp')}
                  secureTextEntry={!showNewPassword}
                  returnKeyType="next"
                  autoCapitalize={'none'}
                  onChangeText={handleInputChange('newPassword')}
                  onSubmitEditing={() => mdpInput3.current.focus()}
                  ref={mdpInput2}
                />
                <InputSlot className="pr-3">
                  <FontAwesome5.Button
                    name={showNewPassword ? 'eye' : 'eye-slash'}
                    backgroundColor="#00000000"
                    iconStyle={{ marginRight: 0 }}
                    size={16}
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  />
                </InputSlot>
              </Input>
            </FormControl>
            <FormControl isInvalid={error} isRequired={true} className="mb-5">
              <FormControlLabel className="mb-1">
                <FormControlLabelText className="text-typography-white">
                  {t('mot_de_passe_confirmation')}
                </FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder={t('confirmer_mdp')}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize={'none'}
                  onChangeText={handleInputChange('confirmPassword')}
                  ref={mdpInput3}
                />
                <InputSlot className="pr-3">
                  <FontAwesome5.Button
                    name={showConfirmPassword ? 'eye' : 'eye-slash'}
                    backgroundColor="#00000000"
                    iconStyle={{ marginRight: 0 }}
                    size={16}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </InputSlot>
              </Input>
            </FormControl>
            <FormControl>
              <Button onPress={handleChangePassword} disabled={isLoading}>
                <ButtonText>
                  {isLoading ? 'Chargement...' : 'Changer le mot de passe'}
                </ButtonText>
              </Button>
            </FormControl>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Securite;
