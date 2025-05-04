import { Match } from '@/types/interfaces/match';
import { supabase } from '@/utils/supabase';

export const synchroniserMatchs = async (
  matchs: Match[],
  tournoi_id: number,
): Promise<void> => {
  matchs.forEach(async (match) => {
    const updatedMatch = {
      tournoi_id: tournoi_id,
      match_id: match.id,
      score_1: match.score1,
      score_2: match.score2,
      manche: match.manche,
      manche_nom: match.mancheName,
      //created_at: tournoi.creationDate,
      //updated_at: tournoi.updateDate,
    };
    upsertMatchs(updatedMatch);
  });
};

export const upsertMatchs = async (updatedMatch): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('No user on the session!');
  }

  updatedMatch.user_id = user.id;
  const { data, error } = await supabase
    .from('matchs')
    .upsert(updatedMatch, { onConflict: 'tournoi_id, match_id' })
    .select();
};
