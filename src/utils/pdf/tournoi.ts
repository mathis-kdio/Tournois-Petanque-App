import { Joueur } from '@/types/interfaces/joueur';
import { Match } from '@/types/interfaces/match';
import { OptionsTournoi } from '@/types/interfaces/optionsTournoi';
import { ranking } from '@utils/ranking';
import { dateFormatDateCompact } from "../date";
import { Tournoi } from '@/types/interfaces/tournoi';

export const generationPDFTournoi = (affichageScore: boolean, affichageClassement: boolean, listeJoueurs: Joueur[], optionsTournoi: OptionsTournoi, listeMatchs: Match[], infosTournoi: Tournoi nbMatchsParTour: number, toursParLigne: number, nbToursRestants: number, nbTables: number) => {
  let date = dateFormatDateCompact(infosTournoi.updateDate)
  let html = `<!DOCTYPE html><html><head><style>@page{margin: 10px;} table{width: 100%;} table,th,td{border: 1px solid black;border-collapse: collapse;} td{min-width: 50px; word-break:break-all;} .td-score{min-width: 20px;} .text-right{text-align: right;} .text-center{text-align: center;} .no-border-top{border-top: none;} .no-border-bottom{border-bottom: none;} .border-top{border-top: 1px solid;}</style></head><body>`;
  html += '<h1 class="text-center">Tournoi '+ date +'</h1>';
  for (let tableIdx = 0; tableIdx < nbTables; tableIdx++) {
    let minTourTable = tableIdx * toursParLigne;
    html += '<table><tr>';
    let nbTourTable = toursParLigne;
    if (nbToursRestants < toursParLigne) {
      nbTourTable = nbToursRestants;
    }
    nbToursRestants -= toursParLigne; 
    for (let i = 1; i <= nbTourTable; i++) {
      html += '<th colspan="4">Tour n°' + (minTourTable + i) + '</th>';      
    }
    html += '</tr>';

    for (let i = 0; i < nbMatchsParTour; i++) {
      let matchNbJoueur = 1;
      if (listeMatchs[i].equipe[0][2] != -1) {
        matchNbJoueur = 3;
      }
      else if (listeMatchs[i].equipe[0][1] != -1) {
        matchNbJoueur = 2;
      }
      for (let jidx = 0; jidx < matchNbJoueur; jidx++) {
        if (jidx == 0) {
          html += '<tr class="border-top">';
        }
        else {
          html += '<tr class="">';
        }
        for (let j = 0; j < nbTourTable; j++) {
          let matchId = tableIdx * (toursParLigne * nbMatchsParTour) + j * nbMatchsParTour + i;
          //Joueur equipe 1
          html += '<td class="no-border-bottom no-border-top">';
          if (listeMatchs[matchId].equipe[0][jidx] != -1) {
            let joueur = listeJoueurs[listeMatchs[matchId].equipe[0][jidx]];
            if (joueur.name === undefined) {
              html += 'Sans Nom ('+ (joueur.id+1) +')';
            }
            else if (joueur.name == "") {
              html += 'Joueur '+ (joueur.id+1);
            }
            else {
              html += joueur.name +' ('+ (joueur.id+1) +')';
            }
          }
          html += '</td>';

          if (jidx == 0) {//Cases scores
            //score equipe 1
            html += '<td rowspan="'+ matchNbJoueur +'" class="td-score text-center">';
            if (affichageScore == true && listeMatchs[matchId].score1) {
              html += listeMatchs[matchId].score1.toString();
            }
            html += '</td>';
            //score equipe 2
            html += '<td rowspan="'+ matchNbJoueur +'" class="td-score text-center">';
            if (affichageScore == true && listeMatchs[matchId].score2) {
              html += listeMatchs[matchId].score2.toString();
            }
            html += '</td>';
          }

          //Joueur equipe 2
          html += '<td class="text-right no-border-bottom no-border-top">';
          if (listeMatchs[matchId].equipe[1][jidx] != -1) {
            let joueur = listeJoueurs[listeMatchs[matchId].equipe[1][jidx]];
            if (joueur.name === undefined) {
              html += 'Sans Nom ('+ (joueur.id+1) +')';
            }
            else if (joueur.name == "") {
              html += 'Joueur '+ (joueur.id+1);
            }
            else {
              html += joueur.name +' ('+ (joueur.id+1) +')';
            }
          }
          html += '</td>';
        }
        html += '</tr>';
      }
    }
    html += '</tr></table><br>';
  }
  if (affichageClassement == true) {
    html += '<div class="pagebreak"></div>';
    html += '<br><table><tr>';
    html += '<th>Place</th><th>Victoires</th><th>Matchs Joués</th><th>Points</th>';
    let classement = ranking(listeMatchs, optionsTournoi);
    for (let i = 0; i < listeJoueurs.length; i++) {
      html += '<tr>';
      html += '<td>' + classement[i].position + ' - ';
      let joueur = listeJoueurs[classement[i].joueurId];
      if (joueur.name === undefined) {
        html += 'Sans Nom ('+ (joueur.id+1) +')';
      }
      else if (joueur.name == "") {
        html += 'Joueur '+ (joueur.id+1);
      }
      else {
        html += joueur.name +' ('+ (joueur.id+1) +')';
      }
      html += '</td>'
      html += '<td class="text-center">'+ classement[i].victoires +'</td>';
      html += '<td class="text-center">'+ classement[i].nbMatchs +'</td>';
      html += '<td class="text-center">'+ classement[i].points +'</td>';
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
}