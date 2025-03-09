import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@components/TopBarBack';
import CardButton from '@components/buttons/CardButton';
import { withTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { PropsFromRedux, connector } from '@/store/connector';
import { Divider } from '@/components/ui/divider';
import { Complement } from '@/types/enums/complement';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
}

interface State {
  options: Complement[];
  complementTeteATeteDispo: boolean;
  complementTripletteDispo: boolean;
  complement2vs1Dispo: boolean;
}

class ChoixComplement extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      options: [],
      complementTeteATeteDispo: false,
      complementTripletteDispo: false,
      complement2vs1Dispo: false,
    };
  }

  componentDidMount(): void {
    this.complementDoublette();
  }

  _navigate(complement: Complement) {
    const updateOptionComplement = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['complement', complement],
    };
    this.props.dispatch(updateOptionComplement);

    let screenName = 'GenerationMatchs';
    if (this.props.optionsTournoi.avecTerrains) {
      screenName = 'ListeTerrains';
    }
    this.props.navigation.navigate({
      name: screenName,
      params: {
        screenStackName: 'InscriptionsAvecNoms',
      },
    });
  }

  complementDoublette() {
    const { mode } = this.props.optionsTournoi;
    const { listesJoueurs } = this.props;
    const nbJoueurs = listesJoueurs[mode].length;

    let options = [];
    if (nbJoueurs % 4 === 1) {
      options.push(Complement.TROISVSDEUX);
    } else if (nbJoueurs % 4 === 2) {
      options.push(Complement.TETEATETE, Complement.TRIPLETTE);
    } else if (nbJoueurs % 4 === 3) {
      options.push(Complement.DEUXVSUN);
    } else {
      console.error('nbJoueurs ne nécessite pas de choisir un complément');
    }

    this.setState({
      options: options,
    });
  }

  card(complement: Complement) {
    const { t } = this.props;
    const complementTextMap: Record<
      Complement,
      { text: string; icons: string[] }
    > = {
      [Complement.TROISVSDEUX]: {
        text: t('3contre2'),
        icons: ['users', 'handshake', 'user-friends'],
      },
      [Complement.TETEATETE]: {
        text: t('1contre1'),
        icons: ['user-alt', 'handshake', 'user-alt'],
      },
      [Complement.TRIPLETTE]: {
        text: t('3contre3'),
        icons: ['users', 'handshake', 'users'],
      },
      [Complement.DEUXVSUN]: {
        text: t('2contre1'),
        icons: ['user-friends', 'handshake', 'user-alt'],
      },
    };
    const item = complementTextMap[complement];
    return (
      <VStack className="flex-1">
        <CardButton
          text={item.text}
          icons={item.icons}
          navigate={() => this._navigate(complement)}
          newBadge={false}
        />
      </VStack>
    );
  }

  render() {
    const { t } = this.props;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView className="h-1 bg-[#0594ae]">
          <TopBarBack
            title={t('choix_complement')}
            navigation={this.props.navigation}
          />
          <VStack space="2xl" className="flex-1 px-10">
            <Text size={'lg'} className="text-white text-center">
              {t('choix_complement_title_1')}
            </Text>
            <Text size={'lg'} className="text-white text-center">
              {t('choix_complement_title_2')}
            </Text>
            {this.state.options.map((complement, index) => (
              <VStack>
                {this.card(complement)}
                {index + 1 !== this.state.options.length && (
                  <Divider className="mt-5 h-1" />
                )}
              </VStack>
            ))}
          </VStack>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connector(withTranslation()(ChoixComplement));
