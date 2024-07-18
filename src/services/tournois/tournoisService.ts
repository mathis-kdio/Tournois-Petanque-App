import { Tournoi } from "@/types/interfaces/tournoi"
import { supabase } from "@/utils/supabase"
import { synchroniserMatchs } from "../matchs/matchsServices";
import { Match } from "@/types/interfaces/match";
import { synchroniserJoueurs } from "../joueurs/joueursServices";
import { OptionsTournoi } from "@/types/interfaces/optionsTournoi";

export const synchroniserTournois = async (tournois: Tournoi[]): Promise<void> => {
  tournois.forEach(async tournoi => {
    const updatedTournoi = {
      tournoi_id: tournoi.tournoiId,
      nom: tournoi.name,
      created_at: tournoi.creationDate,
      updated_at: tournoi.updateDate,
    }
    upsertTournois(updatedTournoi);
    let matchs = tournoi.tournoi.slice(0, -1) as Match[];
    let optionsTournoi = tournoi.tournoi.at(-1) as OptionsTournoi;
    const tournoiServ = await getTournoi(tournoi.tournoiId);
    synchroniserMatchs(matchs, tournoiServ.id);
    synchroniserJoueurs(optionsTournoi.listeJoueurs, tournoiServ.id);
  });
}

export const upsertTournois = async (updatedTournoi): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('No user on the session!');
  }

  updatedTournoi.user_id = user.id;
  const { data, error } = await supabase.from('tournois').upsert(updatedTournoi, { onConflict: "user_id, tournoi_id"}).select();
}

export const getTournoi = async (tournoiId: number): Promise<any> => {
  const { data, error } = await supabase
  .from('tournois')
  .select()
  .eq('tournoi_id', tournoiId);
  return data[0];
}