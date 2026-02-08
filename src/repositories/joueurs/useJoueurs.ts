import { JoueursRepository } from './joueursRepository';

export const useJoueurs = () => {
  const checkJoueur = async (id: number, isChecked: boolean) => {
    const joueur = await JoueursRepository.select(id);
    await JoueursRepository.updateCheck(joueur.id, isChecked);
  };

  const renameJoueur = async (id: number, name: string) => {
    const joueur = await JoueursRepository.select(id);
    await JoueursRepository.updateName(joueur.id, name);
  };

  return {
    checkJoueur,
    renameJoueur,
  };
};
