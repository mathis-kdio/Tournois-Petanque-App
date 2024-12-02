const rand0ToMax = (max) => {
  return Math.floor(Math.random() * (max + 1));
}

const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

export const uniqueValueArrayRandOrder = (arrayLength) => {
  const res = [];
  for (let i = 0; i < arrayLength; ) {
    const random = rand0ToMax(arrayLength - 1);
    if (countOccurrences(res, random) < 1) {
      res.push(random);
      i++;
    }
  }
  return res;
}

export const calcNbMatchsParTour = (nbjoueurs, typeEquipes, modeTournoi, typeTournoi, complement) => {
  let nbMatchsParTour = undefined;

  if (modeTournoi == "avecEquipes" || typeTournoi == "championnat") {
    if (typeEquipes == "teteatete") {
      nbMatchsParTour = nbjoueurs / 2;
    }
    else if (typeEquipes == "doublette") {
      nbMatchsParTour = Math.ceil(nbjoueurs / 4);
    }
    else if (typeEquipes == "triplette") {
      nbMatchsParTour = Math.ceil(nbjoueurs / 6);
    }
    else {
      console.log("calcNbMatchsParTour : typeEquipes inconnu pour avecEquipes/championnat");
    }
  }
  else if (typeTournoi == "mele-demele") {
    if (typeEquipes == "tete-a-tete") {
      nbMatchsParTour = nbjoueurs / 2;
    }
    else if (typeEquipes == "doublette") {
      if (complement == "1") {
        nbMatchsParTour = Math.ceil(nbjoueurs / 4);
      }
      else if (complement == "3") {
        nbMatchsParTour = Math.floor(nbjoueurs / 4);
      }
      else {
        console.log("calcNbMatchsParTour : complement inconnu pour mele-demele");
      }
    }
    else if (typeEquipes == "triplette") {
      nbMatchsParTour = Math.ceil(nbjoueurs / 6);
    }
    else {
      console.log("calcNbMatchsParTour : typeEquipes inconnu pour mele-demele");
    }
  }
  else if (typeTournoi == "coupe") {
    console.log("calcNbMatchsParTour: coupe non prise en charge");
  }
  else {
    console.log("calcNbMatchsParTour: type de tournoi inconnu");
  }

  return nbMatchsParTour;
}

export const shuffle = (o) => {
  for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};