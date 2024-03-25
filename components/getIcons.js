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

export function getSportIcon(type) {
    switch (true) {
      case type === 'Pallokenttä' || type === 'Jalkapallohalli' || type === 'Jalkapallostadion':
        return footballIcon;
      case type === 'Kuntosali' || type === 'Ulkokuntoilupaikka' || type === 'Liikuntapuisto' || type === 'Liikuntahalli' || type === 'Liikuntasali' || type === 'Kuntokeskus' || type === 'Voimailusali' || type === 'Lähiliikuntapaikka' || type === 'Naisten kuntokeskus':
        return gymIcon;
      case type === 'Uimahalli' || type === 'Uimaranta' || type === 'Uimapaikka' || type === 'Talviuintipaikka' || type === 'Uima-allas' || type === 'Maauimala':
        return swimmingIcon;
      case type === 'Ratagolf' || type === 'Golfkenttä' || type === 'Golfin harjoitusalue' || type === 'Golfin harjoitushalli' || type === 'Frisbeegolfrata':
        return golfIcon;
      case type === 'Koripallokenttä':
        return basketballIcon;
      case type === 'Luistelukenttä' || type === 'Luistelureitti' || type === 'Pikaluistelurata':
        return iceSkatingIcon;
      case type === 'Juoksurata' || type === 'Yleisurheilukenttä' || type === 'Yleisurheilun harjoitusalue' || type === 'Juoksusuora' || type === 'Yksittäinen yleisurheilun suorituspaikka' || type === 'Monitoimihalli/areena':
        return runningIcon;
      case type === 'Tenniskenttä' || type === 'Tenniskenttäalue' || type === 'Tennishalli' || type === 'Tenniskeskus' || type === 'Tenniskentät' || type === 'Padelhalli' || type === 'Padelkenttäalue' || type === 'Pöytätennistila' || type === 'Squash-halli' || type === 'Sulkapallohalli':
        return tennisIcon;
      case type === 'Kaukalo' || type === 'Jääkiekkokaukalo' || type === 'Harjoitusjäähalli' || type === 'Tekojääkenttä':
        return hockeyIcon;
      case type === 'Kamppailulajien sali':
        return boxingIcon;
      case type === 'Lentopallokenttä' || type === 'Beachvolleykenttä':
        return volleyballIcon;
      case type === 'Opastuspiste':
        return infoIcon;
      case type === 'Skeitti-/rullaluistelupaikka':
        return skateIcon;
      case type === 'Tanssisali' || type === 'Tanssitila':
        return danceIcon;
      case type === 'Pesäpallokenttä':
        return baseballIcon;
      case type === 'Moottorirata' || type === 'Karting-rata' || type === 'Moottoripyöräilyalue':
        return motorsportsIcon;
      case type === 'Koiraurheilualue' || type === 'Koirapuisto' || type === 'Koirien uintipaikka' || type === 'Koiraurheiluhalli':
        return petsIcon;
      case type === 'Ratsastuskenttä' || type === 'Ratsastusmaneesi' || type === 'Ratsastusreitti' || type === 'Ratsastuskoulu' || type === 'Ratsastustalli' || type === 'Esteratsastuskenttä':
        return horseIcon;
      case type === 'Luontotorni' || type === 'Näköalatorni' || type === 'Tähystyspaikka' || type === 'Torni':
        return binocularIcon;
      case type === 'Huoltorakennukset':
      case type === 'Veneilyn palvelupaikka':
      case type === 'Kalastusalue/-paikka':
        return null;
      default:
        return defaultIcon;
    }
  }