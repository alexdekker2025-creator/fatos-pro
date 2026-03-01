/**
 * Matrix Position Coordinates Data
 * Contains position coordinates for all matrix numbers across different breakpoints
 * Extracted from scripts/matrix_new/calculator.css
 */

export interface Position {
  top: string;
  left: string;
  fontSize?: string;
}

export interface MatrixPositions {
  [key: string]: Position;
}

/**
 * Desktop positions (default, > 600px)
 * Coordinates from original calculator.css
 */
export const DESKTOP_POSITIONS: MatrixPositions = {
  // Main positions (A, B, C, D, E, F, G, H) - large circles on outer ring
  number1: { top: '46px', left: '250px' },      // B - Top (20 years)
  number2: { top: '103px', left: '115px' },   // E - Left top (10 years)
  number3: { top: '103px', left: '383px' },     // C - Right top (30 years)
  number4: { top: '238px', left: '58px' },     // D - Left center (0 years)
  number5: { top: '238px', left: '440px' },       // E - Right center (40 years)
  number6: { top: '372px', left: '114px' },       // F - Left bottom (70 years)
  number7: { top: '372px', left: '383px' },       // G - Right bottom (50 years)
  number8: { top: '429px', left: '248px' },       // H - Bottom (60 years)
  
  // Center position (X) - yellow circle
  'number-center': { top: '237px', left: '248px' },
  
  // Derived positions
  number12: { top: '84px', left: '248px' },      // B1
  number13: { top: '111px', left: '248px', fontSize: '12px' },  // B2
  number14: { top: '162px', left: '249px' },   // B3 - поднят вверх
  
  number22: { top: '129px', left: '141px' },
  number23: { top: '149px', left: '159px', fontSize: '12px' },
  
  number32: { top: '129px', left: '356px' },
  number33: { top: '149px', left: '338px', fontSize: '12px' },
  
  number42: { top: '237px', left: '94px' },
  number43: { top: '239px', left: '121px', fontSize: '12px' },
  number44: { top: '239px', left: '172px', fontSize: '12px' },
  
  number52: { top: '237px', left: '402px' },
  number53: { top: '239px', left: '377px', fontSize: '12px' },
  number54: { top: '237px', left: '295px' },
  
  number62: { top: '345px', left: '140px' },
  number63: { top: '330px', left: '159px', fontSize: '12px' },
  
  number72: { top: '345px', left: '357px' },
  number73: { top: '297px', left: '307px', fontSize: '12px' },
  number74: { top: '328px', left: '339px' },
  number75: { top: '326px', left: '277px', fontSize: '12px' },
  number76: { top: '266px', left: '335px' },
  
  number82: { top: '365px', left: '248px' },
  number83: { top: '393px', left: '248px', fontSize: '12px' },
};

/**
 * Tablet positions (600px - 830px)
 * Same as desktop for now, can be customized if needed
 */
export const TABLET_POSITIONS: MatrixPositions = DESKTOP_POSITIONS;

/**
 * Mobile positions (< 600px)
 */
export const MOBILE_POSITIONS: MatrixPositions = {
  // Main positions (A, B, C, D, E, F, G, H)
  number1: { top: '27px', left: '144px' },      // B (43*0.625, 230*0.625)
  number2: { top: '59px', left: '66px' },       // E (95*0.625, 105*0.625)
  number3: { top: '59px', left: '221px' },      // F (95*0.625, 353*0.625)
  number4: { top: '138px', left: '33px' },      // A (220*0.625, 53*0.625)
  number5: { top: '138px', left: '253px' },     // C (220*0.625, 405*0.625)
  number6: { top: '216px', left: '66px' },      // H (345*0.625, 105*0.625)
  number7: { top: '216px', left: '221px' },     // G (345*0.625, 353*0.625)
  number8: { top: '247px', left: '143px' },     // D (395*0.625, 228*0.625)
  
  // Center position (X)
  'number-center': { top: '137px', left: '144px' },  // (219*0.625, 230*0.625)
  
  // Derived positions
  number12: { top: '48px', left: '143px' },          // B1 (76*0.625, 228*0.625)
  number13: { top: '64px', left: '143px', fontSize: '8px' },   // B2 (103*0.625)
  number14: { top: '93px', left: '143px', fontSize: '8px' },   // B3 (149*0.625)
  
  number22: { top: '75px', left: '81px' },           // (120*0.625, 130*0.625)
  number23: { top: '86px', left: '91px', fontSize: '8px' },    // (138*0.625, 145*0.625)
  
  number32: { top: '75px', left: '205px' },          // (120*0.625, 328*0.625)
  number33: { top: '86px', left: '194px', fontSize: '8px' },   // (138*0.625, 311*0.625)
  
  number42: { top: '138px', left: '53px' },          // (220*0.625, 85*0.625)
  number43: { top: '138px', left: '69px', fontSize: '8px' },   // (220*0.625, 110*0.625)
  number44: { top: '138px', left: '99px', fontSize: '8px' },   // (220*0.625, 158*0.625)
  
  number52: { top: '138px', left: '233px' },         // (220*0.625, 372*0.625)
  number53: { top: '138px', left: '218px', fontSize: '8px' },  // (220*0.625, 348*0.625)
  number54: { top: '138px', left: '170px' },         // (220*0.625, 272*0.625)
  
  number62: { top: '199px', left: '81px' },          // (319*0.625, 129*0.625)
  number63: { top: '190px', left: '91px', fontSize: '8px' },   // (304*0.625, 146*0.625)
  
  number72: { top: '199px', left: '206px' },         // (319*0.625, 330*0.625)
  number73: { top: '172px', left: '176px', fontSize: '8px' },  // (275*0.625, 282*0.625)
  number74: { top: '189px', left: '194px', fontSize: '8px' },  // (303*0.625, 311*0.625)
  number75: { top: '189px', left: '159px', fontSize: '8px' },  // (302*0.625, 255*0.625)
  number76: { top: '153px', left: '194px', fontSize: '8px' },  // (245*0.625, 310*0.625)
  
  number82: { top: '211px', left: '143px' },         // (338*0.625, 228*0.625)
  number83: { top: '227px', left: '143px', fontSize: '8px' },  // (363*0.625, 228*0.625)
};

/**
 * Small mobile positions (< 374px)
 */
export const SMALL_MOBILE_POSITIONS: MatrixPositions = {
  // Main positions (A, B, C, D, E, F, G, H)
  number1: { top: '23px', left: '123px', fontSize: '14px' },    // B (43*0.533, 230*0.533)
  number2: { top: '51px', left: '56px', fontSize: '14px' },     // E (95*0.533, 105*0.533)
  number3: { top: '51px', left: '188px', fontSize: '14px' },    // F (95*0.533, 353*0.533)
  number4: { top: '117px', left: '28px', fontSize: '14px' },    // A (220*0.533, 53*0.533)
  number5: { top: '117px', left: '216px', fontSize: '14px' },   // C (220*0.533, 405*0.533)
  number6: { top: '184px', left: '56px', fontSize: '14px' },    // H (345*0.533, 105*0.533)
  number7: { top: '184px', left: '188px', fontSize: '14px' },   // G (345*0.533, 353*0.533)
  number8: { top: '211px', left: '122px', fontSize: '14px' },   // D (395*0.533, 228*0.533)
  
  // Center position (X)
  'number-center': { top: '117px', left: '123px' },  // (219*0.533, 230*0.533)
  
  // Derived positions
  number12: { top: '41px', left: '122px' },          // B1 (76*0.533, 228*0.533)
  number13: { top: '55px', left: '122px', fontSize: '7px' },   // B2 (103*0.533)
  number14: { top: '79px', left: '122px', fontSize: '7px' },   // B3 (149*0.533)
  
  number22: { top: '64px', left: '69px' },           // (120*0.533, 130*0.533)
  number23: { top: '74px', left: '77px', fontSize: '7px' },    // (138*0.533, 145*0.533)
  
  number32: { top: '64px', left: '175px' },          // (120*0.533, 328*0.533)
  number33: { top: '74px', left: '166px', fontSize: '7px' },   // (138*0.533, 311*0.533)
  
  number42: { top: '117px', left: '45px' },          // (220*0.533, 85*0.533)
  number43: { top: '117px', left: '59px', fontSize: '7px' },   // (220*0.533, 110*0.533)
  number44: { top: '117px', left: '84px', fontSize: '7px' },   // (220*0.533, 158*0.533)
  
  number52: { top: '117px', left: '198px' },         // (220*0.533, 372*0.533)
  number53: { top: '117px', left: '185px', fontSize: '7px' },  // (220*0.533, 348*0.533)
  number54: { top: '117px', left: '145px' },         // (220*0.533, 272*0.533)
  
  number62: { top: '170px', left: '69px' },          // (319*0.533, 129*0.533)
  number63: { top: '162px', left: '78px', fontSize: '7px' },   // (304*0.533, 146*0.533)
  
  number72: { top: '170px', left: '176px' },         // (319*0.533, 330*0.533)
  number73: { top: '147px', left: '150px', fontSize: '7px' },  // (275*0.533, 282*0.533)
  number74: { top: '161px', left: '166px', fontSize: '7px' },  // (303*0.533, 311*0.533)
  number75: { top: '161px', left: '136px', fontSize: '7px' },  // (302*0.533, 255*0.533)
  number76: { top: '131px', left: '165px', fontSize: '7px' },  // (245*0.533, 310*0.533)
  
  number82: { top: '180px', left: '122px' },         // (338*0.533, 228*0.533)
  number83: { top: '194px', left: '122px', fontSize: '7px' },  // (363*0.533, 228*0.533)
};

/**
 * Matrix image widths for different breakpoints
 */
export const MATRIX_WIDTHS = {
  desktop: '600px',
  tablet: '600px',
  mobile: '375px',
  smallMobile: '320px',
};

/**
 * Base font sizes for matrix numbers
 */
export const BASE_FONT_SIZES = {
  desktop: '14px',
  tablet: '14px',
  mobile: '10px',
  smallMobile: '9px',
};

/**
 * Get positions for current breakpoint
 */
export function getPositionsForBreakpoint(width: number): MatrixPositions {
  if (width < 374) {
    return SMALL_MOBILE_POSITIONS;
  } else if (width < 600) {
    return MOBILE_POSITIONS;
  } else if (width < 830) {
    return TABLET_POSITIONS;
  }
  return DESKTOP_POSITIONS;
}

/**
 * Get matrix width for current breakpoint
 */
export function getMatrixWidth(width: number): string {
  if (width < 374) {
    return MATRIX_WIDTHS.smallMobile;
  } else if (width < 600) {
    return MATRIX_WIDTHS.mobile;
  } else if (width < 830) {
    return MATRIX_WIDTHS.tablet;
  }
  return MATRIX_WIDTHS.desktop;
}

/**
 * Get base font size for current breakpoint
 */
export function getBaseFontSize(width: number): string {
  if (width < 374) {
    return BASE_FONT_SIZES.smallMobile;
  } else if (width < 600) {
    return BASE_FONT_SIZES.mobile;
  } else if (width < 830) {
    return BASE_FONT_SIZES.tablet;
  }
  return BASE_FONT_SIZES.desktop;
}

/**
 * Mapping of calculator result keys to position keys
 */
export const POSITION_KEY_MAP: Record<string, string> = {
  // Main positions
  A: 'number1',
  B: 'number2',
  C: 'number3',
  D: 'number4',
  E: 'number5',
  F: 'number6',
  G: 'number7',
  H: 'number8',
  X: 'number-center',
  
  // Derived positions (examples, add more as needed)
  A1: 'number12',
  A2: 'number13',
  A3: 'number14',
  
  B1: 'number22',
  B2: 'number23',
  
  C1: 'number32',
  C2: 'number33',
  
  D1: 'number42',
  D2: 'number43',
  D3: 'number44',
  
  E1: 'number52',
  E2: 'number53',
  E3: 'number54',
  
  F1: 'number62',
  F2: 'number63',
  
  G1: 'number72',
  G2: 'number73',
  G3: 'number74',
  G4: 'number75',
  G5: 'number76',
  
  H1: 'number82',
  H2: 'number83',
};
