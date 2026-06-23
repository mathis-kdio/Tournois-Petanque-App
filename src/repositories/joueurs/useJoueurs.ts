import { JoueursRepository } from './joueursRepository';

const checkJoueur = async (uniqueBDDId: number, isChecked: boolean) => {
  const joueur = await JoueursRepository.select(uniqueBDDId);
  await JoueursRepository.updateCheck(joueur.id, isChecked);
};

const renameJoueur = async (uniqueBDDId: number, name: string) => {
  const joueur = await JoueursRepository.select(uniqueBDDId);
  await JoueursRepository.updateName(joueur.id, name);
};

const addEquipeJoueur = async (uniqueBDDId: number, equipeId: number) => {
  const joueur = await JoueursRepository.select(uniqueBDDId);
  await JoueursRepository.updateEquipe(joueur.id, equipeId);
};

export const useJoueurs = () => {
  return {
    checkJoueur,
    renameJoueur,
    addEquipeJoueur,
  };
};
