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
  number1: { top: '29px', left: '156px' },      // B (46*0.625, 250*0.625)
  number2: { top: '64px', left: '72px' },       // E (103*0.625, 115*0.625)
  number3: { top: '64px', left: '239px' },      // F (103*0.625, 383*0.625)
  number4: { top: '149px', left: '36px' },      // A (238*0.625, 58*0.625)
  number5: { top: '149px', left: '275px' },     // C (238*0.625, 440*0.625)
  number6: { top: '233px', left: '71px' },      // H (372*0.625, 114*0.625)
  number7: { top: '233px', left: '239px' },     // G (372*0.625, 383*0.625)
  number8: { top: '268px', left: '155px' },     // D (429*0.625, 248*0.625)
  
  // Center position (X)
  'number-center': { top: '148px', left: '155px' },  // (237*0.625, 248*0.625)
  
  // Derived positions
  number12: { top: '53px', left: '155px' },          // B1 (84*0.625, 248*0.625)
  number13: { top: '69px', left: '155px', fontSize: '8px' },   // B2 (111*0.625)
  number14: { top: '101px', left: '156px', fontSize: '8px' },  // B3 (162*0.625, 249*0.625)
  
  number22: { top: '81px', left: '88px' },           // (129*0.625, 141*0.625)
  number23: { top: '93px', left: '99px', fontSize: '8px' },    // (149*0.625, 159*0.625)
  
  number32: { top: '81px', left: '223px' },          // (129*0.625, 356*0.625)
  number33: { top: '93px', left: '211px', fontSize: '8px' },   // (149*0.625, 338*0.625)
  
  number42: { top: '148px', left: '59px' },          // (237*0.625, 94*0.625)
  number43: { top: '149px', left: '76px', fontSize: '8px' },   // (239*0.625, 121*0.625)
  number44: { top: '149px', left: '108px', fontSize: '8px' },  // (239*0.625, 172*0.625)
  
  number52: { top: '148px', left: '251px' },         // (237*0.625, 402*0.625)
  number53: { top: '149px', left: '236px', fontSize: '8px' },  // (239*0.625, 377*0.625)
  number54: { top: '148px', left: '184px' },         // (237*0.625, 295*0.625)
  
  number62: { top: '216px', left: '88px' },          // (345*0.625, 140*0.625)
  number63: { top: '206px', left: '99px', fontSize: '8px' },   // (330*0.625, 159*0.625)
  
  number72: { top: '216px', left: '223px' },         // (345*0.625, 357*0.625)
  number73: { top: '186px', left: '192px', fontSize: '8px' },  // (297*0.625, 307*0.625)
  number74: { top: '205px', left: '212px', fontSize: '8px' },  // (328*0.625, 339*0.625)
  number75: { top: '204px', left: '173px', fontSize: '8px' },  // (326*0.625, 277*0.625)
  number76: { top: '166px', left: '209px', fontSize: '8px' },  // (266*0.625, 335*0.625)
  
  number82: { top: '228px', left: '155px' },         // (365*0.625, 248*0.625)
  number83: { top: '246px', left: '155px', fontSize: '8px' },  // (393*0.625, 248*0.625)
};

/**
 * Small mobile positions (< 374px)
 */
export const SMALL_MOBILE_POSITIONS: MatrixPositions = {
  // Main positions (A, B, C, D, E, F, G, H)
  number1: { top: '25px', left: '133px', fontSize: '14px' },    // B (46*0.533, 250*0.533)
  number2: { top: '55px', left: '61px', fontSize: '14px' },     // E (103*0.533, 115*0.533)
  number3: { top: '55px', left: '204px', fontSize: '14px' },    // F (103*0.533, 383*0.533)
  number4: { top: '127px', left: '31px', fontSize: '14px' },    // A (238*0.533, 58*0.533)
  number5: { top: '127px', left: '235px', fontSize: '14px' },   // C (238*0.533, 440*0.533)
  number6: { top: '198px', left: '61px', fontSize: '14px' },    // H (372*0.533, 114*0.533)
  number7: { top: '198px', left: '204px', fontSize: '14px' },   // G (372*0.533, 383*0.533)
  number8: { top: '229px', left: '132px', fontSize: '14px' },   // D (429*0.533, 248*0.533)
  
  // Center position (X)
  'number-center': { top: '126px', left: '132px' },  // (237*0.533, 248*0.533)
  
  // Derived positions
  number12: { top: '45px', left: '132px' },          // B1 (84*0.533, 248*0.533)
  number13: { top: '59px', left: '132px', fontSize: '7px' },   // B2 (111*0.533)
  number14: { top: '86px', left: '133px', fontSize: '7px' },   // B3 (162*0.533, 249*0.533)
  
  number22: { top: '69px', left: '75px' },           // (129*0.533, 141*0.533)
  number23: { top: '79px', left: '85px', fontSize: '7px' },    // (149*0.533, 159*0.533)
  
  number32: { top: '69px', left: '190px' },          // (129*0.533, 356*0.533)
  number33: { top: '79px', left: '180px', fontSize: '7px' },   // (149*0.533, 338*0.533)
  
  number42: { top: '126px', left: '50px' },          // (237*0.533, 94*0.533)
  number43: { top: '127px', left: '65px', fontSize: '7px' },   // (239*0.533, 121*0.533)
  number44: { top: '127px', left: '92px', fontSize: '7px' },   // (239*0.533, 172*0.533)
  
  number52: { top: '126px', left: '214px' },         // (237*0.533, 402*0.533)
  number53: { top: '127px', left: '201px', fontSize: '7px' },  // (239*0.533, 377*0.533)
  number54: { top: '126px', left: '157px' },         // (237*0.533, 295*0.533)
  
  number62: { top: '184px', left: '75px' },          // (345*0.533, 140*0.533)
  number63: { top: '176px', left: '85px', fontSize: '7px' },   // (330*0.533, 159*0.533)
  
  number72: { top: '184px', left: '190px' },         // (345*0.533, 357*0.533)
  number73: { top: '158px', left: '164px', fontSize: '7px' },  // (297*0.533, 307*0.533)
  number74: { top: '175px', left: '181px', fontSize: '7px' },  // (328*0.533, 339*0.533)
  number75: { top: '174px', left: '148px', fontSize: '7px' },  // (326*0.533, 277*0.533)
  number76: { top: '142px', left: '179px', fontSize: '7px' },  // (266*0.533, 335*0.533)
  
  number82: { top: '195px', left: '132px' },         // (365*0.533, 248*0.533)
  number83: { top: '209px', left: '132px', fontSize: '7px' },  // (393*0.533, 248*0.533)
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
