import {
  footballIcon,
  gymIcon,
  swimmingIcon,
  golfIcon,
  basketballIcon,
  iceSkatingIcon,
  runningIcon,
  tennisIcon,
  hockeyIcon,
  boxingIcon,
  volleyballIcon,
  infoIcon,
  skateIcon,
  danceIcon,
  baseballIcon,
  motorsportsIcon,
  petsIcon,
  horseIcon,
  binocularIcon,
  defaultIcon,
} from '../assets/Icons';

import {
  footballCircle,
  gymCircle,
  swimmingCircle,
  golfCircle,
  basketballCircle,
  iceSkatingCircle,
  runningCircle,
  tennisCircle,
  hockeyCircle,
  boxingCircle,
  volleyballCircle,
  infoCircle,
  skateCircle,
  danceCircle,
  baseballCircle,
  motorsportsCircle,
  petsCircle,
  horseCircle,
  binocularCircle,
  defaultCircle,
} from '../assets/Icons/circle';

export function getAllSportsIcons() {
  return [
    { name: 'footballIcon', uri: footballCircle, uri2: footballIcon},
    { name: 'gymIcon', uri: gymCircle, uri2: gymIcon},
    { name: 'swimmingIcon', uri: swimmingCircle, uri2: swimmingIcon},
    { name: 'defaultIcon', uri: defaultCircle, uri2: defaultIcon},
    { name: 'golfIcon', uri: golfCircle, uri2: golfIcon},
    { name: 'iceSkatingIcon', uri: iceSkatingCircle, uri2: iceSkatingIcon},
    { name: 'basketballIcon', uri: basketballCircle, uri2: basketballIcon},
    { name: 'runningIcon', uri: runningCircle, uri2: runningIcon},
    { name: 'tennisIcon', uri: tennisCircle, uri2: tennisIcon},
    { name: 'hockeyIcon', uri: hockeyCircle, uri2: hockeyIcon},
    { name: 'boxingIcon', uri: boxingCircle, uri2: boxingIcon},
    { name: 'volleyballIcon', uri: volleyballCircle, uri2: volleyballIcon},
    { name: 'infoIcon', uri: infoCircle, uri2: infoIcon},
    { name: 'skateIcon', uri: skateCircle, uri2: skateIcon},
    { name: 'danceIcon', uri: danceCircle, uri2: danceIcon},
    { name: 'baseballIcon', uri: baseballCircle, uri2: baseballIcon},
    { name: 'motorsportsIcon', uri: motorsportsCircle, uri2: motorsportsIcon},
    { name: 'petsIcon', uri: petsCircle, uri2: petsIcon},
  ]
}

export function getSportIcon(type, context) {
  switch (true) {
    case type === 'Pallokenttä' || type === 'Jalkapallohalli' || type === 'Jalkapallostadion':
      return context === 'map' ? footballIcon : footballCircle;
    case type === 'Kuntosali' || type === 'Ulkokuntoilupaikka' || type === 'Liikuntapuisto' || type === 'Liikuntahalli' || type === 'Liikuntasali' || type === 'Kuntokeskus' || type === 'Voimailusali' || type === 'Lähiliikuntapaikka' || type === 'Naisten kuntokeskus':
      return context === 'map' ? gymIcon : gymCircle;
    case type === 'Uimahalli' || type === 'Uimaranta' || type === 'Uimapaikka' || type === 'Talviuintipaikka' || type === 'Uima-allas' || type === 'Maauimala':
      return context === 'map' ? swimmingIcon : swimmingCircle;
    case type === 'Ratagolf' || type === 'Golfkenttä' || type === 'Golfin harjoitusalue' || type === 'Golfin harjoitushalli' || type === 'Frisbeegolfrata':
      return context === 'map' ? golfIcon : golfCircle;
    case type === 'Koripallokenttä':
      return context === 'map' ? basketballIcon : basketballCircle;
    case type === 'Luistelukenttä' || type === 'Luistelureitti' || type === 'Pikaluistelurata':
      return context === 'map' ? iceSkatingIcon : iceSkatingCircle;
    case type === 'Juoksurata' || type === 'Yleisurheilukenttä' || type === 'Yleisurheilun harjoitusalue' || type === 'Juoksusuora' || type === 'Yksittäinen yleisurheilun suorituspaikka' || type === 'Monitoimihalli/areena':
      return context === 'map' ? runningIcon : runningCircle;
    case type === 'Tenniskenttä' || type === 'Tenniskenttäalue' || type === 'Tennishalli' || type === 'Tenniskeskus' || type === 'Tenniskentät' || type === 'Padelhalli' || type === 'Padelkenttäalue' || type === 'Pöytätennistila' || type === 'Squash-halli' || type === 'Sulkapallohalli':
      return context === 'map' ? tennisIcon : tennisCircle;
    case type === 'Kaukalo' || type === 'Jääkiekkokaukalo' || type === 'Harjoitusjäähalli' || type === 'Tekojääkenttä':
      return context === 'map' ? hockeyIcon : hockeyCircle;
    case type === 'Kamppailulajien sali':
      return context === 'map' ? boxingIcon : boxingCircle;
    case type === 'Lentopallokenttä' || type === 'Beachvolleykenttä':
      return context === 'map' ? volleyballIcon : volleyballCircle;
    case type === 'Opastuspiste':
      return context === 'map' ? infoIcon : infoCircle;
    case type === 'Skeitti-/rullaluistelupaikka':
      return context === 'map' ? skateIcon : skateCircle;
    case type === 'Tanssisali' || type === 'Tanssitila':
      return context === 'map' ? danceIcon : danceCircle;
    case type === 'Pesäpallokenttä':
      return context === 'map' ? baseballIcon : baseballCircle;
    case type === 'Moottorirata' || type === 'Karting-rata' || type === 'Moottoripyöräilyalue':
      return context === 'map' ? motorsportsIcon : motorsportsCircle;
    case type === 'Koiraurheilualue' || type === 'Koirapuisto' || type === 'Koirien uintipaikka' || type === 'Koiraurheiluhalli':
      return context === 'map' ? petsIcon : petsCircle;
    case type === 'Ratsastuskenttä' || type === 'Ratsastusmaneesi' || type === 'Ratsastusreitti' || type === 'Ratsastuskoulu' || type === 'Ratsastustalli' || type === 'Esteratsastuskenttä':
      return context === 'map' ? horseIcon : horseCircle;
    case type === 'Luontotorni' || type === 'Näköalatorni' || type === 'Tähystyspaikka' || type === 'Torni':
      return context === 'map' ? binocularIcon : binocularCircle;
    case type === 'Huoltorakennukset':
    case type === 'Veneilyn palvelupaikka':
    case type === 'Kalastusalue/-paikka':
      return null;
    default:
      return context === 'map' ? defaultIcon : defaultCircle;
  }
}