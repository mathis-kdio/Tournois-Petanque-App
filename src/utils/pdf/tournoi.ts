import { Joueur } from '@/types/interfaces/joueur';
import { MatchModel } from '@/types/interfaces/match';
import { OptionsTournoi } from '@/types/interfaces/optionsTournoi';
import { ranking } from '@utils/ranking';
import { dateFormatDateCompact } from '../date';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { TFunction } from 'i18next';

export const generationPDFTournoi = (
  affichageScore: boolean,
  affichageClassement: boolean,
  listeJoueurs: Joueur[],
  optionsTournoi: OptionsTournoi,
  listeMatchs: MatchModel[],
  infosTournoi: TournoiModel,
  nbMatchsParTour: number,
  toursParLigne: number,
  nbToursRestants: number,
  nbTables: number,
  t: TFunction<'translation'>,
) => {
  let date = dateFormatDateCompact(infosTournoi.updateDate);
  let html = `<!DOCTYPE html><html><head><style>@page{margin: 10px;} table{width: 100%;} table,th,td{border: 1px solid black;border-collapse: collapse;} td{min-width: 50px; word-break:break-all;} .td-score{min-width: 20px;} .text-right{text-align: right;} .text-center{text-align: center;} .no-border-top{border-top: none;} .no-border-bottom{border-bottom: none;} .border-top{border-top: 1px solid;}</style></head><body>`;
  html += `<h1 class="text-center">${t('tournoi')} ${date}</h1>`;
  for (let tableIdx = 0; tableIdx < nbTables; tableIdx++) {
    let minTourTable = tableIdx * toursParLigne;
    html += '<table><tr>';
    let nbTourTable = toursParLigne;
    if (nbToursRestants < toursParLigne) {
      nbTourTable = nbToursRestants;
    }
    nbToursRestants -= toursParLigne;
    for (let i = 1; i <= nbTourTable; i++) {
      html += `<th colspan="4">${t('tour_numero')}${minTourTable + i}</th>`;
    }
    html += '</tr>';

    for (let i = 0; i < nbMatchsParTour; i++) {
      // Affichage du numéro du match ou du nom du terrain
      html += '<tr class="border-top">';
      for (let nb = 0; nb < nbTourTable; nb++) {
        let matchId =
          tableIdx * (toursParLigne * nbMatchsParTour) +
          nb * nbMatchsParTour +
          i;
        let nomMatch = `${t('match_numero')}${listeMatchs[matchId].id + 1}`;
        let terrainMatch = listeMatchs[matchId].terrain;
        if (terrainMatch && terrainMatch.name) {
          nomMatch = terrainMatch.name;
        }
        html += `<td colspan="4" class="text-center">${nomMatch}</td>`;
      }
      html += '</tr>';

      let matchNbJoueur = 1;
      if (listeMatchs[i].equipe[0][3] !== -1) {
        matchNbJoueur = 4;
      } else if (listeMatchs[i].equipe[0][2] !== -1) {
        matchNbJoueur = 3;
      } else if (listeMatchs[i].equipe[0][1] !== -1) {
        matchNbJoueur = 2;
      }

      for (let jidx = 0; jidx < matchNbJoueur; jidx++) {
        if (jidx === 0) {
          html += '<tr class="border-top">';
        } else {
          html += '<tr class="">';
        }
        for (let j = 0; j < nbTourTable; j++) {
          let matchId =
            tableIdx * (toursParLigne * nbMatchsParTour) +
            j * nbMatchsParTour +
            i;
          //Joueur equipe 1
          html += '<td class="no-border-bottom no-border-top">';
          if (listeMatchs[matchId].equipe[0][jidx] !== -1) {
            let joueur = listeJoueurs[listeMatchs[matchId].equipe[0][jidx]];
            if (joueur === undefined) {
              html += '';
            } else if (joueur.name === undefined) {
              html += `${t('sans_nom')} (${joueur.id + 1})`;
            } else if (joueur.name === '') {
              html += `${t('joueur')} ${joueur.id + 1}`;
            } else {
              html += `${joueur.name} (${joueur.id + 1})`;
            }
          }
          html += '</td>';

          if (jidx === 0) {
            //Cases scores
            //score equipe 1
            html += `<td rowspan="${matchNbJoueur}" class="td-score text-center">`;
            if (
              affichageScore === true &&
              listeMatchs[matchId].score1 !== undefined
            ) {
              html += listeMatchs[matchId].score1.toString();
            }
            html += '</td>';
            //score equipe 2
            html += `<td rowspan="${matchNbJoueur}" class="td-score text-center">`;
            if (
              affichageScore === true &&
              listeMatchs[matchId].score2 !== undefined
            ) {
              html += listeMatchs[matchId].score2.toString();
            }
            html += '</td>';
          }

          //Joueur equipe 2
          html += '<td class="text-right no-border-bottom no-border-top">';
          if (listeMatchs[matchId].equipe[1][jidx] !== -1) {
            let joueur = listeJoueurs[listeMatchs[matchId].equipe[1][jidx]];
            if (joueur === undefined) {
              html += '';
            } else if (joueur.name === undefined) {
              html += `${t('sans_nom')} (${joueur.id + 1})`;
            } else if (joueur.name === '') {
              html += `${t('joueur')} ${joueur.id + 1}`;
            } else {
              html += `${joueur.name} (${joueur.id + 1})`;
            }
          }
          html += '</td>';
        }
        html += '</tr>';
      }
    }
    html += '</tr></table><br>';
    if (toursParLigne === 1) {
      html += '<div class="pagebreak"></div>';
    }
  }
  if (affichageClassement === true) {
    // Saut de ligne dans le cas compact
    if (toursParLigne !== 1) {
      html += '<div class="pagebreak"></div>';
    }

    html += '<br><table><tr>';
    html += `<th>${t('place')}</th><th>${t('victoire')}</th><th>${t('m_j')}</th><th>${t('point')}</th>`;
    let classement = ranking(listeMatchs, optionsTournoi);
    for (let i = 0; i < listeJoueurs.length; i++) {
      html += '<tr>';
      html += '<td>' + classement[i].position + ' - ';
      let joueur = listeJoueurs[classement[i].joueurId];
      if (joueur.name === undefined) {
        html += `${t('sans_nom')} (${joueur.id + 1})`;
      } else if (joueur.name === '') {
        html += `${t('joueur')} ${joueur.id + 1}`;
      } else {
        html += `${joueur.name} (${joueur.id + 1})`;
      }
      html += '</td>';
      html += `<td class="text-center">${classement[i].victoires}</td>`;
      html += `<td class="text-center">${classement[i].nbMatchs}</td>`;
      html += `<td class="text-center">${classement[i].points}</td>`;
      html += '</tr>';
    }
    html += '</tr></table>';
  }
  html += `</body>
      <style>
        @page print {
          .pagebreak { break-before: page; }
        }
        @media print {
          .pagebreak { break-before: page; }
        }
        @page print {
          .pagebreak { page-break-before: always; }
        }
        @media print {
          .pagebreak { break-before: always; }
        }
      </style>
    </html>`;
  return html;
};
