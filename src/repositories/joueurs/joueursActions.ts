import { JoueursRepository } from './joueursRepository';

export const checkJoueur = async (uniqueBDDId: string, isChecked: boolean) => {
  const joueur = await JoueursRepository.select(uniqueBDDId);
  await JoueursRepository.updateCheck(joueur.id, isChecked);
};

export const renameJoueur = async (uniqueBDDId: string, name: string) => {
  const joueur = await JoueursRepository.select(uniqueBDDId);
  await JoueursRepository.updateName(joueur.id, name);
};

export const addEquipeJoueur = async (
  uniqueBDDId: string,
  equipeId: number,
) => {
  const joueur = await JoueursRepository.select(uniqueBDDId);
  await JoueursRepository.updateEquipe(joueur.id, equipeId);
};
