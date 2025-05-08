import { VStack } from '@/components/ui/vstack';
import { ScrollView } from '@/components/ui/scroll-view';
import React from 'react';
import { Session } from '@supabase/supabase-js';
import { withTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import TopBarBack from '@/components/topBar/TopBarBack';
import { withSession } from '@/components/supabase/withSession';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { supabase } from '@/utils/supabase';
import { Alert } from 'react-native';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { FontAwesome5 } from '@expo/vector-icons';
import { Heading } from '@/components/ui/heading';

export interface Props {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
  session: Session | null;
}

interface State {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  showOldPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  isLoading: boolean;
  error: boolean;
}

class Securite extends React.Component<Props, State> {
  mdpInput1 = React.createRef<any>();
  mdpInput2 = React.createRef<any>();
  mdpInput3 = React.createRef<any>();

  constructor(props: Props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      showOldPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      isLoading: false,
      error: true,
    };
  }

  handleChangePassword = async () => {
    const { oldPassword, newPassword, confirmPassword } = this.state;

    if (oldPassword !== oldPassword) {
      Alert.alert('Erreur', 'Ancien mot de passe incorrecte.');
      this.setState({ error: true });
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      this.setState({ error: true });
      return;
    }

    this.setState({ isLoading: true });
    try {
      // Mise à jour du mot de passe
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        Alert.alert('Erreur', error.message);
        this.setState({ error: true });
      } else {
        Alert.alert('Succès', 'Votre mot de passe a été changé avec succès.');
      }
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors du changement de mot de passe.',
      );
      this.setState({ error: true });
    } finally {
      this.setState({ isLoading: false });
      this.setState({ error: false });
    }
  };

  handleInputChange =
    (field: 'oldPassword' | 'newPassword' | 'confirmPassword') =>
    (value: string) => {
      this.setState({ [field]: value } as Pick<State, typeof field>);
    };

  render() {
    const { t } = this.props;
    const { isLoading } = this.state;
    return (
      <ScrollView className="h-1 bg-[#0594ae]">
        <TopBarBack
          title={t('securite')}
          navigation={this.props.navigation}
        />
        <VStack className="flex-1 px-10">
          <VStack className="flex-1">
            <Heading className="text-white">Changer le mot de passe</Heading>
            <FormControl
              isInvalid={this.state.error}
              isRequired={true}
              className="mb-5"
            >
              <FormControlLabel className="mb-1">
                <FormControlLabelText className="text-white">
                  {t('ancien_mdp')}
                </FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder={t('ancien_mdp')}
                  secureTextEntry={!this.state.showOldPassword}
                  returnKeyType="next"
                  autoCapitalize={'none'}
                  onChangeText={this.handleInputChange('oldPassword')}
                  onSubmitEditing={() => this.mdpInput2.current.focus()}
                  ref={this.mdpInput1}
                />
                <InputSlot className="pr-3">
                  <FontAwesome5.Button
                    name={this.state.showOldPassword ? 'eye' : 'eye-slash'}
                    backgroundColor="#00000000"
                    iconStyle={{ marginRight: 0 }}
                    size={16}
                    onPress={() =>
                      this.setState({
                        showOldPassword: !this.state.showOldPassword,
                      })
                    }
                  />
                </InputSlot>
              </Input>
            </FormControl>
            <FormControl
              isInvalid={this.state.error}
              isRequired={true}
              className="mb-5"
            >
              <FormControlLabel className="mb-1">
                <FormControlLabelText className="text-white">
                  {t('nouveau_mdp')}
                </FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder={t('nouveau_mdp')}
                  secureTextEntry={!this.state.showNewPassword}
                  returnKeyType="next"
                  autoCapitalize={'none'}
                  onChangeText={this.handleInputChange('newPassword')}
                  onSubmitEditing={() => this.mdpInput3.current.focus()}
                  ref={this.mdpInput2}
                />
                <InputSlot className="pr-3">
                  <FontAwesome5.Button
                    name={this.state.showNewPassword ? 'eye' : 'eye-slash'}
                    backgroundColor="#00000000"
                    iconStyle={{ marginRight: 0 }}
                    size={16}
                    onPress={() =>
                      this.setState({
                        showNewPassword: !this.state.showNewPassword,
                      })
                    }
                  />
                </InputSlot>
              </Input>
            </FormControl>
            <FormControl
              isInvalid={this.state.error}
              isRequired={true}
              className="mb-5"
            >
              <FormControlLabel className="mb-1">
                <FormControlLabelText className="text-white">
                  {t('mot_de_passe_confirmation')}
                </FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder={t('confirmer_mdp')}
                  secureTextEntry={!this.state.showConfirmPassword}
                  autoCapitalize={'none'}
                  onChangeText={this.handleInputChange('confirmPassword')}
                  ref={this.mdpInput3}
                />
                <InputSlot className="pr-3">
                  <FontAwesome5.Button
                    name={
                      this.state.showConfirmPassword ? 'eye' : 'eye-slash'
                    }
                    backgroundColor="#00000000"
                    iconStyle={{ marginRight: 0 }}
                    size={16}
                    onPress={() =>
                      this.setState({
                        showConfirmPassword: !this.state.showConfirmPassword,
                      })
                    }
                  />
                </InputSlot>
              </Input>
            </FormControl>
            <FormControl>
              <Button
                onPress={this.handleChangePassword}
                disabled={isLoading}
              >
                <ButtonText>
                  {isLoading ? 'Chargement...' : 'Changer le mot de passe'}
                </ButtonText>
              </Button>
            </FormControl>
          </VStack>
        </VStack>
      </ScrollView>
    );
  }
}

export default withSession(withTranslation()(Securite));
