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
  number1: { top: '52px', left: '280px' },      // B - Top (20 years)
  number2: { top: '115.5px', left: '130px' },   // E - Left top (10 years)
  number3: { top: '116px', left: '430px' },     // C - Right top (30 years)
  number4: { top: '267px', left: '66px' },     // D - Left center (0 years)
  number5: { top: '266px', left: '492px' },       // E - Right center (40 years)
  number6: { top: '417px', left: '130px' },       // F - Left bottom (70 years)
  number7: { top: '415px', left: '428px' },       // G - Right bottom (50 years)
  number8: { top: '479px', left: '278px' },       // H - Bottom (60 years)
  
  // Center position (X) - yellow circle
  'number-center': { top: '265px', left: '280px' },
  
  // Derived positions
  number12: { top: '93px', left: '278px' },      // B1
  number13: { top: '122.5px', left: '278px', fontSize: '12px' },  // B2
  number14: { top: '180px', left: '278.5px' },   // B3 - поднят вверх
  
  number22: { top: '145px', left: '159.5px' },
  number23: { top: '165.5px', left: '180px', fontSize: '12px' },
  
  number32: { top: '143.5px', left: '398px' },
  number33: { top: '165.5px', left: '379px', fontSize: '12px' },
  
  number42: { top: '266px', left: '107px' },
  number43: { top: '266.5px', left: '136px', fontSize: '12px' },
  number44: { top: '266px', left: '193px', fontSize: '12px' },
  
  number52: { top: '266px', left: '450px' },
  number53: { top: '266px', left: '420.5px', fontSize: '12px' },
  number54: { top: '266px', left: '330px' },
  
  number62: { top: '386.5px', left: '158px' },
  number63: { top: '366px', left: '179px', fontSize: '12px' },
  
  number72: { top: '385px', left: '400px' },
  number73: { top: '365.5px', left: '380px', fontSize: '12px' },
  number74: { top: '329.5px', left: '342px' },
  number75: { top: '363px', left: '310px', fontSize: '12px' },
  number76: { top: '297px', left: '375px' },
  
  number82: { top: '437px', left: '280px' },
  number83: { top: '408px', left: '280px', fontSize: '12px' },
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
  number1: { top: '32.5px', left: '175px' },      // B - пропорционально desktop
  number2: { top: '72px', left: '81px' },         // E
  number3: { top: '72.5px', left: '269px' },      // F
  number4: { top: '167px', left: '41px' },        // A
  number5: { top: '166px', left: '307.5px' },     // C
  number6: { top: '260.5px', left: '81px' },      // H
  number7: { top: '259px', left: '267.5px' },     // G
  number8: { top: '299px', left: '174px' },       // D
  
  // Center position (X)
  'number-center': { top: '166px', left: '175px' },
  
  // Derived positions
  number12: { top: '58px', left: '174px' },
  number13: { top: '76.5px', left: '174px', fontSize: '8px' },
  number14: { top: '112.5px', left: '174px', fontSize: '8px' },
  
  number22: { top: '90.5px', left: '100px' },
  number23: { top: '103.5px', left: '112.5px', fontSize: '8px' },
  
  number32: { top: '90px', left: '249px' },
  number33: { top: '103.5px', left: '237px', fontSize: '8px' },
  
  number42: { top: '166px', left: '67px' },
  number43: { top: '166.5px', left: '85px', fontSize: '8px' },
  number44: { top: '166px', left: '120.5px', fontSize: '8px' },
  
  number52: { top: '166px', left: '281px' },
  number53: { top: '166px', left: '263px', fontSize: '8px' },
  number54: { top: '166px', left: '206px' },
  
  number62: { top: '241.5px', left: '99px' },
  number63: { top: '229px', left: '112px', fontSize: '8px' },
  
  number72: { top: '241px', left: '250px' },
  number73: { top: '228.5px', left: '237.5px', fontSize: '8px' },
  number74: { top: '206px', left: '214px', fontSize: '8px' },
  number75: { top: '227px', left: '194px', fontSize: '8px' },
  number76: { top: '186px', left: '234px', fontSize: '8px' },
  
  number82: { top: '273px', left: '175px' },
  number83: { top: '255px', left: '175px', fontSize: '8px' },
};

/**
 * Small mobile positions (< 374px)
 */
export const SMALL_MOBILE_POSITIONS: MatrixPositions = {
  // Main positions (A, B, C, D, E, F, G, H)
  number1: { top: '27.5px', left: '149px', fontSize: '14px' },    // B
  number2: { top: '61.5px', left: '69px', fontSize: '14px' },     // E
  number3: { top: '62px', left: '229px', fontSize: '14px' },      // F
  number4: { top: '142px', left: '35px', fontSize: '14px' },      // A
  number5: { top: '142px', left: '262px', fontSize: '14px' },     // C
  number6: { top: '222px', left: '69px', fontSize: '14px' },      // H
  number7: { top: '221px', left: '228px', fontSize: '14px' },     // G
  number8: { top: '255px', left: '148px', fontSize: '14px' },     // D
  
  // Center position (X)
  'number-center': { top: '141px', left: '149px' },
  
  // Derived positions
  number12: { top: '49.5px', left: '148px' },
  number13: { top: '65px', left: '148px', fontSize: '7px' },
  number14: { top: '96px', left: '148px', fontSize: '7px' },
  
  number22: { top: '77px', left: '85px' },
  number23: { top: '88px', left: '96px', fontSize: '7px' },
  
  number32: { top: '76.5px', left: '212px' },
  number33: { top: '88px', left: '202px', fontSize: '7px' },
  
  number42: { top: '142px', left: '57px' },
  number43: { top: '142px', left: '72.5px', fontSize: '7px' },
  number44: { top: '142px', left: '103px', fontSize: '7px' },
  
  number52: { top: '142px', left: '240px' },
  number53: { top: '142px', left: '224px', fontSize: '7px' },
  number54: { top: '142px', left: '176px' },
  
  number62: { top: '206px', left: '84px' },
  number63: { top: '195px', left: '95.5px', fontSize: '7px' },
  
  number72: { top: '205px', left: '213px' },
  number73: { top: '195px', left: '202.5px', fontSize: '7px' },
  number74: { top: '175.5px', left: '182px', fontSize: '7px' },
  number75: { top: '193.5px', left: '165px', fontSize: '7px' },
  number76: { top: '158px', left: '200px', fontSize: '7px' },
  
  number82: { top: '233px', left: '149px' },
  number83: { top: '217px', left: '149px', fontSize: '7px' },
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
