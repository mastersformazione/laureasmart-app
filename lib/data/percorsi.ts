import { CLASSI_LAUREA } from "./classiLaurea";
import type { ClasseLaurea } from "./classiLaurea";

import { masterEconomia } from "./master/master-economia";
import { masterGiuridici } from "./master/master-giuridici";
import { masterIngegneria } from "./master/master-ingegneria";
import { masterLettere } from "./master/master-lettere";
import { masterPA } from "./master/master-pa";
import { masterPsicologia } from "./master/master-psicologia";
import { masterSanitari } from "./master/master-sanitari";
import { masterScuola } from "./master/master-scuola";

export type Percorso = {
  id: string;
  titolo: string;
  classe: string;
  tipo:
    | "laurea_triennale"
    | "laurea_ciclo_unico"
    | "corso_post_diploma"
    | "laurea_magistrale"
    | "master_primo_livello"
    | "master_secondo_livello";
  settore: string;
  durata: string;
  accesso: string[];
  sbocchi?: string[];
  prosecuzione?: string[];
  tags: string[];
  prioritaCommerciale: number;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function settoreDaAreaClasse(area: ClasseLaurea["area"]): string {
  const mappa: Record<ClasseLaurea["area"], string> = {
    ECONOMIA: "economia",
    PSICOLOGIA: "psicologia",
    EDUCAZIONE: "educazione",
    GIURIDICA: "giuridico",
    SPORT: "scienze_motorie",
    COMUNICAZIONE: "comunicazione",
    TECNOLOGIA: "informatica_ingegneria",
    UMANISTICA: "lettere_arte_spettacolo",
    SANITARIA: "sanitario",
    SCIENTIFICA: "biologia",
    INGEGNERIA: "ingegneria_industriale",
    ARCHITETTURA: "design_moda",
    AGRARIA: "turismo",
    TURISMO: "turismo",
    SOCIALE: "politico_sociale",
    ALTRO: "altro",
  };

  return mappa[area] || "altro";
}

function tipoPercorsoDaClasse(classe: ClasseLaurea): Percorso["tipo"] {
  const codice = classe.codice.toUpperCase().replace(/\s+/g, "");

  if (
    classe.tipo === "laurea_ciclo_unico" ||
    codice === "LMG/01" ||
    codice === "LM-85BIS" ||
    codice === "LM85BIS"
  ) {
    return "laurea_ciclo_unico";
  }

  if (classe.tipo === "laurea_magistrale") {
    return "laurea_magistrale";
  }

  if (classe.tipo === "laurea_sanitaria") {
    return "laurea_triennale";
  }

  if (classe.tipo === "laurea_professionalizzante") {
    return "corso_post_diploma";
  }

  return "laurea_triennale";
}

function durataDaClasseLaurea(classe: ClasseLaurea): string {
  if (classe.tipo === "laurea_magistrale") {
    return `${classe.cfuDefault / 60} anni - ${classe.cfuDefault} CFU`;
  }

  if (classe.tipo === "laurea_ciclo_unico") {
    return `${classe.cfuDefault / 60} anni - ${classe.cfuDefault} CFU`;
  }

  if (classe.tipo === "laurea_sanitaria") {
    return `${classe.cfuDefault / 60} anni - ${classe.cfuDefault} CFU`;
  }

  if (classe.tipo === "laurea_professionalizzante") {
    return `${classe.cfuDefault / 60} anni - ${classe.cfuDefault} CFU`;
  }

  return `${classe.cfuDefault / 60} anni - ${classe.cfuDefault} CFU`;
}

function accessoDaClasseLaurea(classe: ClasseLaurea): string[] {
  const tipo = tipoPercorsoDaClasse(classe);

  if (tipo === "laurea_magistrale") {
    return ["laurea_triennale", "laurea_magistrale"];
  }

  return ["diploma"];
}

function sbocchiDaClasseLaurea(classe: ClasseLaurea): string[] {
  const settore = settoreDaAreaClasse(classe.area);

  const mappa: Record<string, string[]> = {
    economia: [
      "aziende e imprese",
      "amministrazione e gestione",
      "consulenza",
      "controllo di gestione",
      "marketing e organizzazione",
    ],
    psicologia: [
      "servizi alla persona",
      "risorse umane",
      "orientamento",
      "contesti educativi e sociali",
      "prosecuzione verso percorsi abilitanti o specialistici",
    ],
    educazione: [
      "servizi educativi",
      "formazione",
      "terzo settore",
      "progettazione educativa",
      "coordinamento di attività socio-educative",
    ],
    giuridico: [
      "uffici legali e amministrativi",
      "pubblica amministrazione",
      "consulenza giuridica",
      "supporto a studi professionali",
      "concorsi pubblici coerenti",
    ],
    scienze_motorie: [
      "sport e benessere",
      "preparazione atletica",
      "centri sportivi",
      "educazione motoria",
      "promozione di stili di vita attivi",
    ],
    comunicazione: [
      "comunicazione digitale",
      "media e contenuti",
      "marketing",
      "uffici comunicazione",
      "relazioni pubbliche",
    ],
    informatica_ingegneria: [
      "informatica e tecnologie digitali",
      "sistemi informativi",
      "data analysis",
      "innovazione tecnologica",
      "supporto tecnico e progettuale",
    ],
    lettere_arte_spettacolo: [
      "cultura ed editoria",
      "comunicazione culturale",
      "musei e beni culturali",
      "formazione",
      "produzione di contenuti",
    ],
    sanitario: [
      "servizi sanitari e socio-sanitari",
      "prevenzione e assistenza",
      "supporto tecnico-sanitario",
      "contesti clinici e territoriali",
      "prosecuzione in area sanitaria specialistica",
    ],
    biologia: [
      "laboratori e ricerca",
      "ambiente",
      "controllo qualità",
      "settore alimentare o scientifico",
      "prosecuzione in ambito scientifico",
    ],
    ingegneria_industriale: [
      "industria e produzione",
      "progettazione tecnica",
      "energia e processi",
      "gestione tecnica",
      "innovazione applicata",
    ],
    design_moda: [
      "design e progettazione",
      "architettura e territorio",
      "moda e comunicazione visiva",
      "studi tecnici o creativi",
      "valorizzazione degli spazi",
    ],
    turismo: [
      "turismo e ospitalità",
      "valorizzazione territoriale",
      "beni culturali",
      "food e filiere territoriali",
      "organizzazione eventi",
    ],
    politico_sociale: [
      "servizi sociali",
      "enti pubblici",
      "terzo settore",
      "cooperazione",
      "progettazione sociale",
    ],
  };

  return (
    mappa[settore] || [
      "ambiti professionali coerenti con la classe di laurea",
      "prosecuzione degli studi",
      "concorsi pubblici se previsti dai bandi",
      "contesti organizzativi pubblici o privati",
      "percorsi di specializzazione successivi",
    ]
  );
}

function prosecuzioneDaClasseLaurea(classe: ClasseLaurea): string[] {
  if (
    classe.tipo === "laurea_magistrale" ||
    classe.tipo === "laurea_ciclo_unico"
  ) {
    return [
      "Master universitari coerenti con l’area disciplinare",
      "Corsi di perfezionamento",
      "Dottorato di ricerca se previsto dal percorso",
      "Specializzazioni e percorsi professionalizzanti",
    ];
  }

  return [
    "Laurea magistrale coerente con la classe di laurea",
    "Master universitari di primo livello",
    "Corsi di perfezionamento",
    "Percorsi professionalizzanti o abilitanti se previsti dalla normativa",
  ];
}

function tagsDaClasseLaurea(classe: ClasseLaurea): string[] {
  const settore = settoreDaAreaClasse(classe.area);

  return Array.from(
    new Set([
      classe.codice.toLowerCase(),
      classe.nome.toLowerCase(),
      settore.replaceAll("_", " "),
      classe.area.toLowerCase(),
      classe.tipo.replaceAll("_", " "),
    ])
  );
}

const laureeDaClassi: Percorso[] = CLASSI_LAUREA.filter(
  (classe) => classe.tipo !== "altro"
).map((classe) => {
  const tipo = tipoPercorsoDaClasse(classe);
  const settore = settoreDaAreaClasse(classe.area);

  return {
    id: slugify(`${classe.codice}-${classe.nome}`),
    titolo: classe.nome,
    classe: classe.codice,
    tipo,
    settore,
    durata: durataDaClasseLaurea(classe),
    accesso: accessoDaClasseLaurea(classe),
    sbocchi: sbocchiDaClasseLaurea(classe),
    prosecuzione: prosecuzioneDaClasseLaurea(classe),
    tags: tagsDaClasseLaurea(classe),
    prioritaCommerciale: 2,
  };
});

export const percorsi: Percorso[] = [
  ...laureeDaClassi,

  ...masterEconomia,
  ...masterGiuridici,
  ...masterIngegneria,
  ...masterLettere,
  ...masterPA,
  ...masterPsicologia,
  ...masterSanitari,
  ...masterScuola,
];

export function normalizzaTitoloStudio(titoloStudio: string) {
  const titolo = titoloStudio.toLowerCase().trim();

  if (titolo === "diploma") return "diploma";

  if (titolo === "laurea triennale" || titolo === "laurea_triennale") {
    return "laurea_triennale";
  }

  if (
    titolo === "laurea magistrale" ||
    titolo === "laurea_magistrale" ||
    titolo === "laurea vecchio ordinamento"
  ) {
    return "laurea_magistrale";
  }

  if (
    titolo.includes("afam") ||
    titolo.includes("conservatorio") ||
    titolo.includes("accademia")
  ) {
    return "laurea_triennale";
  }

  return "diploma";
}

export function getTipiPercorsoPerTitolo(titoloStudio: string) {
  const titoloNormalizzato = normalizzaTitoloStudio(titoloStudio);

  if (titoloNormalizzato === "diploma") {
    return ["laurea_triennale", "laurea_ciclo_unico", "corso_post_diploma"];
  }

  if (titoloNormalizzato === "laurea_triennale") {
    return ["laurea_magistrale", "master_primo_livello"];
  }

  if (titoloNormalizzato === "laurea_magistrale") {
    return [
      "master_primo_livello",
      "master_secondo_livello",
      "laurea_magistrale",
      "laurea_triennale",
    ];
  }

  return [];
}

export function getPercorsiVisibili(titoloStudio: string) {
  const tipiVisibili = getTipiPercorsoPerTitolo(titoloStudio);

  return percorsi.filter((percorso) =>
    tipiVisibili.includes(percorso.tipo as string)
  );
}
