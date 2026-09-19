import { render } from '@testing-library/react-native';
import Loading from './Loading';

describe('Loading', () => {
  it('rend un composant sans planter', async () => {
    const { toJSON } = await render(<Loading />);
    expect(toJSON()).not.toBeNull();
  });

  it('produit un arbre de rendu non vide', async () => {
    const { toJSON } = await render(<Loading />);
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });
});
