/**
 * Chakra Information Data
 * Contains names, colors, and health descriptions for all 7 chakras
 * Used in HealthTable component for display and tooltips
 */

export interface ChakraInfo {
  number: number;
  name: string;
  color: string;
  description: string;
}

export const CHAKRA_COLORS = {
  MULADHARA: '#D83A4E',    // Red - 1st chakra
  SVADHISTHANA: '#FF6B00', // Orange - 2nd chakra
  MANIPURA: '#FBC93B',     // Yellow - 3rd chakra
  ANAHATA: '#1DBA08',      // Green - 4th chakra
  VISHUDDHA: '#27AAE1',    // Blue - 5th chakra
  AJNA: '#005791',         // Indigo - 6th chakra
  SAHASRARA: '#9D2D9D',    // Violet - 7th chakra
} as const;

export const CHAKRAS: ChakraInfo[] = [
  {
    number: 1,
    name: 'Муладхара',
    color: CHAKRA_COLORS.MULADHARA,
    description: 'Отвечает за - Мочеполовая система, нижние конечности, толстый кишечник, копчик, крестец, ноги',
  },
  {
    number: 2,
    name: 'Свадхистана',
    color: CHAKRA_COLORS.SVADHISTHANA,
    description: 'Отвечает за - Надпочечники, матка и яичники, почки, кишечник, предстательная железа у мужчин, поясничный район позвоночного столба.',
  },
  {
    number: 3,
    name: 'Манипура',
    color: CHAKRA_COLORS.MANIPURA,
    description: 'Отвечает за - ЖКТ, органы брюшной полости, поджелудочная железа, селезёнка, печень, желчный пузырь, тонкий кишечник, центральная часть позвоночника.',
  },
  {
    number: 4,
    name: 'Анахата',
    color: CHAKRA_COLORS.ANAHATA,
    description: 'Отвечает за - Сердце, кровеносная система, органы дыхания, легкие, бронхи, грудной отдел позвоночника, рёбра, лопаточная зона спины, грудь.',
  },
  {
    number: 5,
    name: 'Вишудха',
    color: CHAKRA_COLORS.VISHUDDHA,
    description: 'Отвечает за - Щитовидная железа, трахея, бронхи, горло, голосовые связки, плечи, руки, седьмой шейный позвонок, все шейные позвонки, нижняя челюсть, зубы нижней челюсти.',
  },
  {
    number: 6,
    name: 'Аджна',
    color: CHAKRA_COLORS.AJNA,
    description: 'Отвечает за - Затылочные и височные доли мозга, глаз, уши, нос, лицо, верхняя челюсть, зубы верхней челюсти, зрительный нерв, кора головного мозга.',
  },
  {
    number: 7,
    name: 'Сахасрара',
    color: CHAKRA_COLORS.SAHASRARA,
    description: 'Отвечает за - Головной мозг, волосы, верхняя часть черепа.',
  },
];

/**
 * Get chakra info by number (1-7)
 */
export function getChakraInfo(number: number): ChakraInfo | undefined {
  return CHAKRAS.find(chakra => chakra.number === number);
}

/**
 * Get chakra color by number (1-7)
 */
export function getChakraColor(number: number): string {
  const chakra = getChakraInfo(number);
  return chakra?.color || '#000000';
}
