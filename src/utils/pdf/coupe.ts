import { Joueur } from '@/types/interfaces/joueur';
import { Match } from '@/types/interfaces/match';
import { OptionsTournoi } from '@/types/interfaces/optionsTournoi';
import { ranking } from '@utils/ranking';
import { dateFormatDateCompact } from '../date';
import { Tournoi } from '@/types/interfaces/tournoi';

export const generationPDFCoupe = (
  affichageScore: boolean,
  affichageClassement: boolean,
  listeJoueurs: Joueur[],
  optionsTournoi: OptionsTournoi,
  listeMatchs: Match[],
  infosTournoi: Tournoi,
  nbMatchsParTour: number,
  toursParLigne: number,
  nbToursRestants: number,
  nbTables: number,
) => {
  let date = dateFormatDateCompact(infosTournoi.updateDate);
  let html = `<!DOCTYPE html><html><head><style>@page{margin: 10px;} table{width: 100%;} table,th,td{border: 1px solid black;border-collapse: collapse;} td{min-width: 50px; word-break:break-all;} .td-score{min-width: 20px;} .text-right{text-align: right;} .text-center{text-align: center;} .no-border-top{border-top: none;} .no-border-bottom{border-bottom: none;} .border-top{border-top: 1px solid;}</style></head><body>`;
  html += `<h1 class="text-center">Tournoi ${date}</h1>`;
  let idxFirstMatchsTable = 0;
  let nbMatchTourEnCours = nbMatchsParTour;
  for (let tableIdx = 0; tableIdx < nbTables; tableIdx++) {
    let minTourTable = tableIdx * toursParLigne;
    html += '<table><tr>';
    let nbTourTable = toursParLigne;
    if (nbToursRestants < toursParLigne) {
      nbTourTable = nbToursRestants;
    }
    nbToursRestants -= toursParLigne;
    for (let i = 1; i <= nbTourTable; i++) {
      html += `<th colspan="4">Tour n°${minTourTable + i}</th>`;
    }
    html += '</tr>';
    for (let i = 0; i < nbMatchTourEnCours; i++) {
      // Affichage du numéro du match ou du nom du terrain
      html += '<tr class="border-top">';

      let nbMatchsTour = nbMatchsParTour;
      let idxFirstMatchsTour = idxFirstMatchsTable;
      for (let nb = 0; nb < nbTourTable; nb++) {
        if (nb !== 0) {
          idxFirstMatchsTour += nbMatchsTour;
          nbMatchsTour = nbMatchsTour / 2;
        }
        let matchId = idxFirstMatchsTour + i;
        if (matchId < idxFirstMatchsTour + nbMatchsTour) {
          let nomMatch = `Match n°' ${listeMatchs[matchId].id + 1}`;
          let terrainMatch = listeMatchs[matchId].terrain;
          if (terrainMatch && terrainMatch.name) {
            nomMatch = terrainMatch.name;
          }
          html += `<td colspan="4" class="text-center">${nomMatch}</td>`;
        } else {
          html +=
            '<td colspan="4" class="no-border-bottom no-border-top"></td>';
        }
      }
      html += '</tr>';

      let matchNbJoueur = 1;
      if (listeMatchs[i].equipe[0][2] !== -1) {
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
        let nbMatchsTour = nbMatchsParTour;
        let idxFirstMatchsTour = idxFirstMatchsTable;
        for (let j = 0; j < nbTourTable; j++) {
          if (j !== 0) {
            idxFirstMatchsTour += nbMatchsTour;
            nbMatchsTour = nbMatchsTour / 2;
          }
          let matchId = idxFirstMatchsTour + i;
          //Joueur equipe 1
          if (matchId < idxFirstMatchsTour + nbMatchsTour) {
            html += '<td class="no-border-bottom no-border-top">';
            if (listeMatchs[matchId].equipe[0][jidx] !== -1) {
              let joueur = listeJoueurs[listeMatchs[matchId].equipe[0][jidx]];
              if (joueur.name === undefined) {
                html += `Sans Nom (${joueur.id + 1})`;
              } else if (joueur.name === '') {
                html += `Joueur ${joueur.id + 1}`;
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
              if (joueur.name === undefined) {
                html += `Sans Nom (${joueur.id + 1})`;
              } else if (joueur.name === '') {
                html += `Joueur ${joueur.id + 1}`;
              } else {
                html += `${joueur.name} (${joueur.id + 1})`;
              }
            }
            html += '</td>';
          } else {
            html +=
              '<td colspan="4" class="no-border-bottom no-border-top"></td>';
          }
        }
        html += '</tr>';
      }
    }
    idxFirstMatchsTable += nbMatchTourEnCours;
    nbMatchTourEnCours /= 2;
    html += '</tr></table><br>';
    if (toursParLigne === 1) {
      html += '<div class="pagebreak"></div>';
    }
  }
  if (affichageClassement === true) {
    html += '<br><table><tr>';
    html +=
      '<th>Place</th><th>Victoires</th><th>Matchs Joués</th><th>Points</th>';
    let classement = ranking(listeMatchs, optionsTournoi);
    for (let i = 0; i < listeJoueurs.length; i++) {
      html += '<tr>';
      html += `<td>${classement[i].position} - `;
      let joueur = listeJoueurs[classement[i].joueurId];
      if (joueur.name === undefined) {
        html += `Sans Nom (${joueur.id + 1})`;
      } else if (joueur.name === '') {
        html += `Joueur ${joueur.id + 1}`;
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
