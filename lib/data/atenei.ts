export type CategoriaAteneo =
  | "statale"
  | "non_statale"
  | "telematica"
  | "altro"
  | "non_indicato";

export type ModalitaAteneo =
  | "presenza"
  | "online"
  | "mista"
  | "non_applicabile";

export type AteneoItaliano = {
  id: string;
  nome: string;
  categoria: CategoriaAteneo;
  modalita: ModalitaAteneo;
};

export const ateneiItaliani: AteneoItaliano[] = [
  {
    id: "non_indicato",
    nome: "Preferisco non indicarlo",
    categoria: "non_indicato",
    modalita: "non_applicabile",
  },
  {
    id: "altro_ateneo",
    nome: "Altro ateneo non in elenco",
    categoria: "altro",
    modalita: "non_applicabile",
  },

  // Università statali
  {
    id: "univaq",
    nome: "Università degli Studi dell’Aquila",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unich",
    nome: 'Università degli Studi di Chieti-Pescara "Gabriele D’Annunzio"',
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unite",
    nome: "Università degli Studi di Teramo",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unibas",
    nome: "Università degli Studi della Basilicata",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unicampania",
    nome: 'Università degli Studi della Campania "Luigi Vanvitelli"',
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unina",
    nome: 'Università degli Studi di Napoli "Federico II"',
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unior",
    nome: 'Università degli Studi di Napoli "L’Orientale"',
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "uniparthenope",
    nome: 'Università degli Studi di Napoli "Parthenope"',
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unisannio",
    nome: "Università degli Studi del Sannio",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unisa",
    nome: "Università degli Studi di Salerno",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unical",
    nome: "Università della Calabria",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unicz",
    nome: 'Università degli Studi "Magna Graecia" di Catanzaro',
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unirc",
    nome: "Università degli Studi Mediterranea di Reggio Calabria",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unibo",
    nome: "Università degli Studi di Bologna",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unife",
    nome: "Università degli Studi di Ferrara",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unimore",
    nome: "Università degli Studi di Modena e Reggio Emilia",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unipr",
    nome: "Università degli Studi di Parma",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "units",
    nome: "Università degli Studi di Trieste",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "uniud",
    nome: "Università degli Studi di Udine",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "uniroma1",
    nome: 'Università degli Studi di Roma "La Sapienza"',
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "uniroma2",
    nome: 'Università degli Studi di Roma "Tor Vergata"',
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "uniroma3",
    nome: "Università degli Studi Roma Tre",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "foroitalico",
    nome: 'Università degli Studi di Roma "Foro Italico"',
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "uniclam",
    nome: "Università degli Studi di Cassino e del Lazio Meridionale",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unitus",
    nome: "Università degli Studi della Tuscia",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unige",
    nome: "Università degli Studi di Genova",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unibg",
    nome: "Università degli Studi di Bergamo",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unibs",
    nome: "Università degli Studi di Brescia",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "uninsubria",
    nome: "Università degli Studi dell’Insubria",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unimi",
    nome: "Università degli Studi di Milano",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unimib",
    nome: "Università degli Studi di Milano-Bicocca",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "polimi",
    nome: "Politecnico di Milano",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unipv",
    nome: "Università degli Studi di Pavia",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unicam",
    nome: "Università degli Studi di Camerino",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unimc",
    nome: "Università degli Studi di Macerata",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "univpm",
    nome: "Università Politecnica delle Marche",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "uniurb",
    nome: 'Università degli Studi di Urbino "Carlo Bo"',
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unimol",
    nome: "Università degli Studi del Molise",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unipmn",
    nome: 'Università degli Studi del Piemonte Orientale "Amedeo Avogadro"',
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unito",
    nome: "Università degli Studi di Torino",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "polito",
    nome: "Politecnico di Torino",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "uniba",
    nome: 'Università degli Studi di Bari "Aldo Moro"',
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "poliba",
    nome: "Politecnico di Bari",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unifg",
    nome: "Università degli Studi di Foggia",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unisalento",
    nome: "Università del Salento",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unica",
    nome: "Università degli Studi di Cagliari",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "uniss",
    nome: "Università degli Studi di Sassari",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unict",
    nome: "Università degli Studi di Catania",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unime",
    nome: "Università degli Studi di Messina",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unipa",
    nome: "Università degli Studi di Palermo",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unifi",
    nome: "Università degli Studi di Firenze",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unipi",
    nome: "Università di Pisa",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unisi",
    nome: "Università degli Studi di Siena",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unistrasi",
    nome: "Università per Stranieri di Siena",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unitn",
    nome: "Università degli Studi di Trento",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unipg",
    nome: "Università degli Studi di Perugia",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unistrapg",
    nome: "Università per Stranieri di Perugia",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unive",
    nome: "Università Ca’ Foscari Venezia",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "iuav",
    nome: "Università IUAV di Venezia",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "unipd",
    nome: "Università degli Studi di Padova",
    categoria: "statale",
    modalita: "presenza",
  },
  {
    id: "univr",
    nome: "Università degli Studi di Verona",
    categoria: "statale",
    modalita: "presenza",
  },

  // Università non statali riconosciute
  {
    id: "unistrada",
    nome: 'Università per Stranieri "Dante Alighieri"',
    categoria: "non_statale",
    modalita: "presenza",
  },
  {
    id: "link",
    nome: "Link Campus University",
    categoria: "non_statale",
    modalita: "mista",
  },
  {
    id: "unisob",
    nome: 'Università degli Studi "Suor Orsola Benincasa"',
    categoria: "non_statale",
    modalita: "presenza",
  },
  {
    id: "unicatt",
    nome: "Università Cattolica del Sacro Cuore",
    categoria: "non_statale",
    modalita: "presenza",
  },
  {
    id: "luiss",
    nome: 'LUISS - Libera Università Internazionale degli Studi Sociali "Guido Carli"',
    categoria: "non_statale",
    modalita: "presenza",
  },
  {
    id: "lumsa",
    nome: "LUMSA - Libera Università Maria Santissima Assunta",
    categoria: "non_statale",
    modalita: "presenza",
  },
  {
    id: "unicamillus",
    nome: "Saint Camillus International University of Health and Medical Sciences",
    categoria: "non_statale",
    modalita: "presenza",
  },
  {
    id: "unicampus",
    nome: "Università Campus Bio-Medico di Roma",
    categoria: "non_statale",
    modalita: "presenza",
  },
  {
    id: "uer",
    nome: "Università Europea di Roma",
    categoria: "non_statale",
    modalita: "presenza",
  },
  {
    id: "unint",
    nome: "Università degli Studi Internazionali di Roma - UNINT",
    categoria: "non_statale",
    modalita: "presenza",
  },
  {
    id: "humanitas",
    nome: "Humanitas University",
    categoria: "non_statale",
    modalita: "presenza",
  },
  {
    id: "iulm",
    nome: "IULM - Libera Università di Lingue e Comunicazione",
    categoria: "non_statale",
    modalita: "presenza",
  },
  {
    id: "liuc",
    nome: "LIUC - Università Cattaneo",
    categoria: "non_statale",
    modalita: "presenza",
  },
  {
    id: "bocconi",
    nome: 'Università Commerciale "Luigi Bocconi"',
    categoria: "non_statale",
    modalita: "presenza",
  },
  {
    id: "unisr",
    nome: "Università Vita-Salute San Raffaele",
    categoria: "non_statale",
    modalita: "presenza",
  },
  {
    id: "unineuromed",
    nome: "UNINEUROMED - Neuromed Mediterranean University",
    categoria: "non_statale",
    modalita: "presenza",
  },
  {
    id: "unisg",
    nome: "Università degli Studi di Scienze Gastronomiche",
    categoria: "non_statale",
    modalita: "presenza",
  },
  {
    id: "lum",
    nome: 'LUM - Libera Università Mediterranea "Giuseppe Degennaro"',
    categoria: "non_statale",
    modalita: "presenza",
  },
  {
    id: "unikore",
    nome: 'Università degli Studi "Kore" di Enna',
    categoria: "non_statale",
    modalita: "presenza",
  },
  {
    id: "unibz",
    nome: "Libera Università di Bolzano",
    categoria: "non_statale",
    modalita: "presenza",
  },
  {
    id: "univda",
    nome: "Università della Valle d’Aosta",
    categoria: "non_statale",
    modalita: "presenza",
  },

  // Università telematiche riconosciute
  {
    id: "iuline",
    nome: 'Università telematica degli studi "IUL"',
    categoria: "telematica",
    modalita: "online",
  },
  {
    id: "ecampus",
    nome: 'Università telematica "e-Campus"',
    categoria: "telematica",
    modalita: "online",
  },
  {
    id: "giustino_fortunato",
    nome: 'Università telematica "Giustino Fortunato"',
    categoria: "telematica",
    modalita: "online",
  },
  {
    id: "unimarconi",
    nome: 'Università telematica "Guglielmo Marconi"',
    categoria: "telematica",
    modalita: "online",
  },
  {
    id: "uninettuno",
    nome: 'Università telematica internazionale "Uninettuno"',
    categoria: "telematica",
    modalita: "online",
  },
  {
    id: "unidav",
    nome: 'Università telematica "Leonardo da Vinci"',
    categoria: "telematica",
    modalita: "online",
  },
  {
    id: "unicusano",
    nome: 'Università telematica "Niccolò Cusano"',
    categoria: "telematica",
    modalita: "online",
  },
  {
    id: "pegaso",
    nome: 'Università telematica "Pegaso"',
    categoria: "telematica",
    modalita: "online",
  },
  {
    id: "san_raffaele_telematica",
    nome: 'Università telematica "San Raffaele"',
    categoria: "telematica",
    modalita: "online",
  },
  {
    id: "unitelma",
    nome: 'Università telematica "UNITELMA Sapienza"',
    categoria: "telematica",
    modalita: "online",
  },
  {
    id: "mercatorum",
    nome: 'Università telematica "Universitas Mercatorum"',
    categoria: "telematica",
    modalita: "online",
  },
];

export function getAteneoByNome(nome: string) {
  const normalized = nome.trim().toLowerCase();
  return ateneiItaliani.find(
    (ateneo) => ateneo.nome.trim().toLowerCase() === normalized
  );
}

export function getAteneoCategoriaLabel(categoria: CategoriaAteneo) {
  if (categoria === "statale") return "Università statale";
  if (categoria === "non_statale") return "Università non statale riconosciuta";
  if (categoria === "telematica") return "Università telematica";
  if (categoria === "altro") return "Altro ateneo";
  return "Non indicato";
}
