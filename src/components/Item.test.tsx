import { fireEvent, render } from '@testing-library/react-native';
import Item from './Item';

const defaultProps = {
  text: 'Mon élément',
  action: jest.fn(),
  icon: null,
  type: 'default',
  drapeau: undefined,
};

describe('Item', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche le texte passé en prop', async () => {
    const { getByText } = await render(
      <Item {...defaultProps} text="Test texte" />,
    );
    expect(getByText('Test texte')).toBeTruthy();
  });

  it('appelle la fonction action quand on appuie dessus', async () => {
    const action = jest.fn();
    const { getByText } = await render(
      <Item {...defaultProps} text="Cliquez" action={action} />,
    );
    fireEvent.press(getByText('Cliquez'));
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('rend sans planter en mode danger', async () => {
    const { getByText } = await render(
      <Item {...defaultProps} text="Supprimer" type="danger" />,
    );
    expect(getByText('Supprimer')).toBeTruthy();
  });

  it('rend sans planter en mode modal', async () => {
    const { getByText } = await render(
      <Item {...defaultProps} text="Option" type="modal" />,
    );
    expect(getByText('Option')).toBeTruthy();
  });

  it('rend sans planter avec une icône', async () => {
    const { getByText } = await render(
      <Item {...defaultProps} text="Avec icône" icon="home" type="default" />,
    );
    expect(getByText('Avec icône')).toBeTruthy();
  });
});
