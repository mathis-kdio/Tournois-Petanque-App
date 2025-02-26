import { Joueur } from '@/types/interfaces/joueur';
import { supabase } from '@/utils/supabase';

export const synchroniserJoueurs = async (
  joueurs: Joueur[],
  tournoi_id: number,
): Promise<void> => {
  joueurs.forEach(async (joueur) => {
    const updatedJoueur = {
      tournoi_id: tournoi_id,
      joueur_id: joueur.id,
      nom: joueur.name,
      type: joueur.type,
      equipe: joueur.equipe,
      coche: joueur.isChecked,
      //created_at: tournoi.creationDate,
      //updated_at: tournoi.updateDate,
    };
    upsertJoueurs(updatedJoueur);
  });
};

export const upsertJoueurs = async (updatedJoueur): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('No user on the session!');
  }

  updatedJoueur.user_id = user.id;
  const { data, error } = await supabase
    .from('joueurs')
    .upsert(updatedJoueur, { onConflict: 'tournoi_id, joueur_id' })
    .select();
  console.log('upsertJoueurs');
  console.log(data);
  console.log(error);
};
