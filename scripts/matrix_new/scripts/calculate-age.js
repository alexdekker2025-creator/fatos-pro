const birthdayText = document.querySelector('#birthday');
const birthday = localStorage['date'];
const nameUser = document.querySelector('#name_text');
const gender = localStorage['gender'];

const date = new Date();

const birthdayArray = birthday.split('.');

let A = parseInt(calculation(birthdayArray[0]));
let B = parseInt(calculation(birthdayArray[1]));
let C = parseInt(calculation(birthdayArray[2]));

let ageNumber = date.getFullYear() - parseInt(birthdayArray[2]);
let ageMonths = date.getMonth() - parseInt(B) + 1;
let ageDays = date.getDate() - birthdayArray[0];

if (ageMonths <= 0 && ageDays > 0) {
    ageMonths += 12;
    ageNumber -= 1;
}

let fullAge = `${ageNumber}.${ageMonths}`;

const titleH2 = document.querySelector('.white-block-age-forecast h2');
titleH2.textContent = `Бесплатный прогноз на ${date.getFullYear()} - ${date.getFullYear() + 1}`;

const titles = document.querySelectorAll('.accordion h2');
let arrayTitles = Array.from(titles).slice(0, 8);

for(let i = 0; i < arrayTitles.length; i++) {
    let firstYear = date.getFullYear() + i+1;
    let secondYear = date.getFullYear() + i+2;

    if (i === 2 | i === 6) {
        arrayTitles[i].textContent = `${secondYear}`
    } else {
        if (i > 6) {
            arrayTitles[i].textContent = `${firstYear+1} - ${secondYear+1}`  
        } else {
            arrayTitles[i].textContent = `${firstYear} - ${secondYear}`
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
  nameUser.innerHTML = localStorage['name'];
  birthdayText.innerHTML = birthday;
});


const age = document.querySelector('#age');

age.innerHTML = fullAge.toString();

function calculation(number) {
  let sumNumber = number.toString().split('').reduce((previousValue, currentValue) => +previousValue + +currentValue);

  while(parseInt(number) > 22 || sumNumber > 22) {
    number = number.toString().split('').reduce((previousValue, currentValue) => +previousValue + +currentValue);

    if (parseInt(number) > 22) {
      number = number.toString().split('').reduce((previousValue, currentValue) => +previousValue + +currentValue);
    }

    return number;
  }

  return number
}

let D = calculation(A+B+C);

let X = calculation(A+B+C+D);
let D2 = calculation(D+X);
let D1 = calculation(D+D2);

let C2 = calculation(C+X);
let C1 = calculation(C+C2);

let K1 = calculation(D+C);
let K2 = calculation(D2+C2);

let G = calculation(C+D);
let F = calculation(B+C);
let H = calculation(D+A);
let E = calculation(A+B);
let Y = calculation(E+F+G+H);
let K3 = calculation(X+X);

let B2 = calculation(B+X);
let B3 = calculation(B2+X);

let A2 = calculation(A+X);
let A3 = calculation(A2+X);

let K4 = calculation(B3+A3);

let K5 = calculation(B2+A2);

let B1 = calculation(B+B2);

let A1 = calculation(A+A2);

let K6 = calculation(B1+A1);



let E2 = calculation(E+Y);
let E1 = calculation(E+E2);

let F2 = calculation(F+Y);
let F1 = calculation(F+F2);

let G2 = calculation(G+Y);
let G1 = calculation(G2+G);

let H2 = calculation(H+Y);
let H1 = calculation(H+H2);

let G4 = calculation(C2+D2)
let L = calculation(D2+G4);




let AE = calculation(A+E);
let AE1 = calculation(A+AE);
let AE2 = calculation(E+AE);
let AE3 = calculation(A+AE1);
let AE4 = calculation(AE+AE1);
let AE5 = calculation(AE+AE2);
let AE6 = calculation(E+AE2);

let EB = calculation(E+B);
let EB1 = calculation(E+EB);
let EB2 = calculation(B+EB);
let EB3 = calculation(E+EB1);
let EB4 = calculation(EB+EB1);
let EB5 = calculation(EB+EB2);
let EB6 = calculation(B+EB2);

let BF = calculation(B+F);
let BF1 = calculation(B+BF);
let BF2 = calculation(F+BF);
let BF3 = calculation(B+BF1);
let BF4 = calculation(BF+BF1);
let BF5 = calculation(BF1+BF2);
let BF6 = calculation(F+BF2);

let FC = calculation(F+C);
let FC1 = calculation(F+FC);
let FC2 = calculation(C+FC);
let FC3 = calculation(F+FC1);
let FC4 = calculation(FC+FC1);
let FC5 = calculation(FC+FC2);
let FC6 = calculation(C+FC2);

let CG = calculation(C+G);
let CG1 = calculation(C+CG);
let CG2 = calculation(G+CG);
let CG3 = calculation(C+CG1);
let CG4 = calculation(CG+CG1);
let CG5 = calculation(CG+CG2);
let CG6 = calculation(C+CG2);

let GD = calculation(G+D);
let GD1 = calculation(G+GD);
let GD2 = calculation(D+GD);
let GD3 = calculation(G+GD1);
let GD4 = calculation(GD+GD1);
let GD5 = calculation(GD+GD2);
let GD6 = calculation(G+GD2);

let DH = calculation(D+H);
let DH1 = calculation(D+DH);
let DH2 = calculation(H+DH);
let DH3 = calculation(D+DH1);
let DH4 = calculation(DH+DH1);
let DH5 = calculation(DH+DH2);
let DH6 = calculation(D+DH2);

let HA = calculation(H+A);
let HA1 = calculation(H+HA);
let HA2 = calculation(A+HA);
let HA3 = calculation(H+HA1);
let HA4 = calculation(HA+HA1);
let HA5 = calculation(HA+HA2);
let HA6 = calculation(A+HA2);

const panels = document.querySelectorAll('.panel');
const firstPanel = document.querySelector('.white-block-age-forecast-block');
let arrayPanels = Array.from(panels).slice(0, 8);
arrayPanels.unshift(firstPanel);
    
let isFlag = false;
let newIndex = 0;
let isUnbox = true;

for(let i = 0; i < arrayPanels.length; i++) {
    isUnbox = true;
    let actualPanel = arrayPanels[i];
    let actualAgeClone = parseFloat(fullAge) + i + newIndex;
    
    if (actualAgeClone > 1 && actualAgeClone < 2.5) {
        if (actualAgeClone > 1.49 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 4.49 && actualAgeClone < 6) {
        if (actualAgeClone > 5 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 6 && actualAgeClone < 7.5) {
        if (actualAgeClone > 6.49 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 9.49 && actualAgeClone < 11) {
        if (actualAgeClone > 10 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 11 && actualAgeClone < 12.5) {
        if (actualAgeClone > 11.49 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 14.49 && actualAgeClone < 16) {
        if (actualAgeClone > 15 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 16 && actualAgeClone < 17.5) {
        if (actualAgeClone > 16.49 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 19.49 && actualAgeClone < 21) {
        if (actualAgeClone > 20 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 21 && actualAgeClone < 22.5) {
        if (actualAgeClone > 21.49 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 24.49 && actualAgeClone < 26) {
        if (actualAgeClone > 25 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 26 && actualAgeClone < 27.5) {
        if (actualAgeClone > 26.49 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 29.49 && actualAgeClone < 31) {
        if (actualAgeClone > 30 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 31 && actualAgeClone < 32.5) {
        if (actualAgeClone > 31.49 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 34.49 && actualAgeClone < 35.91) {
        if (actualAgeClone > 35 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 35.92 && actualAgeClone < 37.5) {
        if (actualAgeClone > 36.49 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 39.49 && actualAgeClone < 41) {
        if (actualAgeClone > 40 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 41 && actualAgeClone < 42.5) {
        if (actualAgeClone > 41.49 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 44.49 && actualAgeClone < 45.9) {
        if (actualAgeClone > 45 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 46 && actualAgeClone < 47.5) {
        if (actualAgeClone > 46.49 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 49.49 && actualAgeClone < 51) {
        if (actualAgeClone > 50 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 51 && actualAgeClone < 52.5) {
        if (actualAgeClone > 51.49 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 54.49 && actualAgeClone < 56) {
        if (actualAgeClone > 55 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 56 && actualAgeClone < 57.5) {
        if (actualAgeClone > 56.49 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 59.49 && actualAgeClone < 61) {
        if (actualAgeClone > 60 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 64.49 && actualAgeClone < 66) {
        if (actualAgeClone > 65 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 56 && actualAgeClone < 57.5) {
        if (actualAgeClone > 56.49 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 61 && actualAgeClone < 62.5) {
        if (actualAgeClone > 61.49 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 69.49 && actualAgeClone < 71) {
        if (actualAgeClone > 70 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 66 && actualAgeClone < 67.5) {
        if (actualAgeClone > 26.49 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 71 && actualAgeClone < 72.5) {
        if (actualAgeClone > 1.49 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 74.49 && actualAgeClone < 76) {
        if (actualAgeClone > 75 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }
    
    if (actualAgeClone > 76 && actualAgeClone < 77.5) {
        if (actualAgeClone > 76.49 && !isFlag) {
            
        } else {
            if (isFlag) {
                newIndex += 1;
            
                isFlag = false;
                isUnbox = false;
            }
        
            if (isUnbox) {
                isFlag = true;
            }
        }
    }

    let actualAge = parseFloat(fullAge) + i + newIndex;
    
    let number = 0;
    let actualAgeText = '';

    if (actualAge) {
        if (actualAge > 1 && actualAge < 2.5) {
            number = AE3;
            actualAgeText = '1 - 2.5';
        }
        
        if (Math.round(actualAge) === 3) {
            number = AE1;
            actualAgeText = '2.5 - 3.5';
        }
        
        if (Math.round(actualAge) === 4) {
            number = AE4;
            actualAgeText = '3.5 - 4';
        }
        
        if (actualAge > 4.49 && actualAge < 5.9) {
            number = AE;
            actualAgeText = '5';
        }
        
        if (actualAge > 5.9 && actualAge < 7.5) {
            number = AE5;
            actualAgeText = '6 - 7.5';
        }
        
        if (Math.round(actualAge) === 8) {
            number = AE2;
            actualAgeText = '7.5 - 8.5';
        }
        
        if (Math.round(actualAge) === 9) {
            number = AE6;
            actualAgeText = '8.5 - 9';
        }
        
        if (actualAge > 9.49 && actualAge < 11) {
            number = E;
            actualAgeText = '10';
        }
        
        if (actualAge > 10.9 && actualAge < 12.5) {
            number = EB3;
            actualAgeText = '11 - 12.5';
        }
        
        if (Math.round(actualAge) === 13) {
            number = EB1;
            actualAgeText = '12.5 - 13.5';
        }
        
        if (Math.round(actualAge) === 14) {
            number = EB4;
            actualAgeText = '13.5 - 14';
        }
        
        if (actualAge > 14.49 && actualAge < 15.9) {
            number = EB;
            actualAgeText = '15';
        }
        
        if (actualAge > 15.9 && actualAge < 17.5) {
            number = EB5;
            actualAgeText = '16 - 17.5';
        }
        
        if (Math.round(actualAge) === 18) {
            number = EB2;
            actualAgeText = '17.5 - 18.5';
        }
        
        if (Math.round(actualAge) === 19) {
            number = EB6;
            actualAgeText = '18.5 - 19';
        }
        
        if (actualAge > 19.49 && actualAge < 20.9) {
            number = B;
            actualAgeText = '20';
        }
        
        if (actualAge > 20.9 && actualAge < 22.5) {
            number = BF3;
            actualAgeText = '21 - 22.5';
        }
        
        if (Math.round(actualAge) === 23) {
            number = BF1;
            actualAgeText = '22.5 - 23.5';
        }
        
        if (Math.round(actualAge) === 24) {
            number = BF4;
            actualAgeText = '23.5 - 24';
        }
        
        if (actualAge > 24.49 && actualAge < 25.9) {
            number = BF;
            actualAgeText = '25';
        }
        
        if (actualAge > 25.9 && actualAge < 27.5) {
            number = BF5;
            actualAgeText = '26 - 27.5';
        }
        
        if (Math.round(actualAge) === 28) {
            number = BF2;
            actualAgeText = '27.5 - 28.5';
        }
        
        if (Math.round(actualAge) === 29) {
            number = BF6;
            actualAgeText = '28.5 - 29';
        }
        
        if (actualAge > 29.49 && actualAge < 31) {
            number = F;
            actualAgeText = '30';
        }
        
        if (actualAge > 30.9 && actualAge < 32.5) {
            number = FC3;
            actualAgeText = '31 - 32.5';
        }
        
        if (Math.round(actualAge) === 33) {
            number = FC1;
            actualAgeText = '32.5 - 33.5';
        }
        
        if (Math.round(actualAge) === 34) {
            number = FC4;
            actualAgeText = '33.5 - 34';
        }
        
        if (actualAge > 34.49 && actualAge < 35.9) {
            number = FC;
            actualAgeText = '35';
        }
        
        if (actualAge > 35.9 && actualAge < 37.5) {
            number = FC5;
            actualAgeText = '36 - 37.5';
        }
        
        if (Math.round(actualAge) === 38) {
            number = FC2;
            actualAgeText = '37.5 - 38.5';
        }
        
        if (Math.round(actualAge) === 39) {
            number = FC6;
            actualAgeText = '38.5 - 39';
        }
        
        if (actualAge > 39.49 && actualAge < 40.9) {
            number = C;
            actualAgeText = '40';
        }
        
        if (actualAge > 40.9 && actualAge < 42.5) {
            number = CG3;
            actualAgeText = '41 - 42.5';
        }
        
        if (Math.round(actualAge) === 43) {
            number = CG1;
            actualAgeText = '42.5 - 43.5';
        }
        
        if (Math.round(actualAge) === 44) {
            number = CG4;
            actualAgeText = '43.5 - 44';
        }
        
        if (actualAge > 44.49 && actualAge < 45.9) {
            number = CG;
            actualAgeText = '45';
        }
        
        if (actualAge > 45.9 && actualAge < 47.5) {
            number = CG5;
            actualAgeText = '46 - 47.5';
        }
        
        if (Math.round(actualAge) === 48) {
            number = CG2;
            actualAgeText = '47.5 - 48.5';
        }
        
        if (Math.round(actualAge) === 49) {
            number = CG6;
            actualAgeText = '48.5 - 49';
        }
        
        if (actualAge > 49.49 && actualAge < 51) {
            number = G;
            actualAgeText = '50';
        }
        
        if (actualAge > 50.9 && actualAge < 52.5) {
            number = GD3;
            actualAgeText = '51 - 52.5';
        }
        
        if (Math.round(actualAge) === 53) {
            number = GD1;
            actualAgeText = '52.5 - 53.5';
        }
        
        if (Math.round(actualAge) === 54) {
            number = GD4;
            actualAgeText = '53.5 - 54';
        }
        
        if (actualAge > 54.49 && actualAge < 55.9) {
            number = GD;
            actualAgeText = '55';
        }
        
        if (actualAge > 55.9 && actualAge < 57.5) {
            number = GD5;
            actualAgeText = '56 - 57.5';
        }
        
        if (Math.round(actualAge) === 58) {
            number = GD2;
            actualAgeText = '57.5 - 58.5';
        }
        
        if (Math.round(actualAge) === 59) {
            number = GD6;
            actualAgeText = '58.5 - 59';
        }
        
        if (actualAge > 59.49 && actualAge < 61) {
            number = D;
            actualAgeText = '60';
        }
        
        if (actualAge > 60.9 && actualAge < 62.5) {
            number = DH3;
            actualAgeText = '61 - 62.5';
        }
        
        if (Math.round(actualAge) === 63) {
            number = DH1;
            actualAgeText = '62.5 - 63.5';
        }
        
        if (Math.round(actualAge) === 64) {
            number = DH4;
            actualAgeText = '63.5 - 64';
        }
        
        if (actualAge > 64.49 && actualAge < 65.9) {
            number = DH;
            actualAgeText = '65';
        }
        
        if (actualAge > 65.9 && actualAge < 67.5) {
            number = DH5;
            actualAgeText = '66 - 67.5';
        }
        
        if (Math.round(actualAge) === 68) {
            number = DH2;
            actualAgeText = '67.5 - 68.5';
        }
        
        if (Math.round(actualAge) === 69) {
            number = DH6;
            actualAgeText = '68.5 - 69';
        }
        
        if (actualAge > 69.49 && actualAge < 71) {
            number = H;
            actualAgeText = '70';
        }
        
        if (actualAge > 70.9 && actualAge < 72.5) {
            number = HA3;
            actualAgeText = '71 - 72.5';
        }
        
        if (Math.round(actualAge) === 73) {
            number = HA1;
            actualAgeText = '72.5 - 73.5';
        }
        
        if (Math.round(actualAge) === 74) {
            number = HA4;
            actualAgeText = '73.5 - 74';
        }
        
        if (actualAge > 74.49 && actualAge < 75.9) {
            number = HA;
            actualAgeText = '75';
        }
        
        if (actualAge > 75.9 && actualAge < 77.5) {
            number = HA5;
            actualAgeText = '76 - 77.5';
        }
        
        if (Math.round(actualAge) === 78) {
            number = HA2;
            actualAgeText = '77.5 - 78.5';
        }
        
        if (Math.round(actualAge) === 79) {
            number = HA6;
            actualAgeText = '78.5 - 79';
        }
    }
    
    let actualAgeWrapper = document.createElement('p');
    actualAgeWrapper.textContent = `Возраст ${actualAgeText}`;
    actualAgeWrapper.style.color = '#5A5A5A';
    actualPanel.appendChild(actualAgeWrapper);
    
    let itemParagraph = document.createElement('p');
    let itemParagraphListFirst = document.createElement('ul');
    let itemParagraphItemFirst = document.createElement('li')
    itemParagraph.textContent = 'Суть года, основной мотив';
    itemParagraph.style.textDecoration = 'none';
    itemParagraph.style.color = '#5A5A5A';
    itemParagraph.classList.add('panel-topic');
    itemParagraphItemFirst.appendChild(itemParagraph);
    itemParagraphListFirst.appendChild(itemParagraphItemFirst);
    actualPanel.appendChild(itemParagraphListFirst);
    
    if (gender === 'М') {
    const text = document.createElement('p');
    text.innerHTML = 'В плюсе';
    text.style.color = '#1B8909';
    text.style.fontWeight = '700';
    actualPanel.appendChild(text);

    switch (number) {
      case 3: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(3)  <span style="font-weight: 400;">Если Вы одиноки, то Вам предстоит встреча со своей второй половинкой, начнутся отношения. Если Вы уже в отношениях, то Вас ожидает развитие отношений, вступление в брак, красивая свадьба. Если Вы уже в браке, то обретёте гармонию, мир и спокойствие в семье, откроете для себя новые грани семейное жизни, обретёте взаимопонимание в случае его отсутствия, то есть Ваша семейная жизнь заиграет новыми красками. Это период, когда Вы прислушаетесь к своей женской энергии и не пойдёте против неё, откроете для себя счастье отцовства или создадите неповторимый уют и тепло в доме, станете первоклассным хозяином, понимающим и заботливым отцом, любящим и заботливым мужем. Поймёте и примите всего себя таким, какой Вы есть. Начнёте вдохновлять  противоположный пол. Станете спокойным, сбалансированным и гармоничным. Сумеете грамотно сочетать работу и дом. Возможно, повышение на работе, открытие своего бизнеса, увеличение дохода, расширение сфер своего влияния.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 4: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(4) <span style="font-weight: 400;">Благоприятный во всех смыслах период. Здесь может произойти квантовый скачок в развитии - будет достигнуто всё, к чему мужчина долго и упорно шёл, откроются новые горизонты, увеличатся многократно доходы, произойдёт расширение и укрепление бизнеса, быстрое продвижение по карьерной лестнице. Здесь же мужчина может стать главой семьи, отцом. Одним словом, в этот период мужчина себя полностью реализует во всех аспектах жизни.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 5: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(5) <span style="font-weight: 400;">Период приятной бумажной волокиты - оформление каких-то важных документов, которые до этого долго не было возможности оформить, официальное оформление отношений, рождение детей и получение на них всех необходимых документов (свидетельство о рождении, полис, СНИЛС, оформление выплат и пособий, материнского капитала), разрешение споров в суде. Часто бывает, что всё перечисленное идёт вместе или быстро друг за другом с малыми промежутками во времени. В любом случае это хороший период, когда жизнь упорядочивается, жизнь обретает смысл и систему, всё в ней происходит поэтапно, всё налаживается. 
<br>Также в этот период открываются двери для получения нового образования, продвижения на службе, обретения уважения и новых сфер влияния. </span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 6: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(6) <span style="font-weight: 400;">Прекрасный период влюблённости, любви и проявления любых тёплых чувств. В этот период сердце замирает, наполняясь любовью, и бабочки летают в животе. Время романтики, цветов, подарков, праздничных мероприятий. В такие периоды случаются свадьбы, помолвки, а также любые другие мероприятия, участниками и организаторами которых выступают влюблённые люди, готовые дарить радость всем вокруг. 
<br>Также это период активной общественной деятельности, бурного дружеского общения, весёлых вечеринок до утра. 
<br>Это отличный период, чтобы начать жить в гармонии с собой, принять и полюбить себя, осознать свою ценность и значимость, заняться любимым делом, окружить себя красотой, создать уют в доме, заняться своей внешностью и обновить гардероб, добавив в него новые красивые и интересные вещи. 
<br>В целом, это позитивная энергия дружбы, открытости и любви. Но чтобы обрести эту дружбу и любовь сначала предстоит пройти через предательства и разочарования, невозможно прийти к плюсу, не пройдя через минус. Здесь главное не закрывать глаза на эти предательства, не прятать голову в песок, делая вид, что всё хорошо, принять факт негатива в свою сторону, прожить это и тогда жизнь страну станет уходить в плюс.
</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 7: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(7) <span style="font-weight: 400;">Сильный и благоприятный период, во время которого мужчина добьётся успеха, ему будет сопутствовать удача, покорятся все вершины, будут достигнуты многие цели, будут показаны хорошие результаты в любой деятельности. Мужчина поистине проявит себя лидером и победителем.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 8: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(8) <span style="font-weight: 400;">Период стабильности и размерности. Жизнь сложилась, есть почва под ногами, быт налажен. Период, когда воздаётся по заслугам, когда получают награды за свои труды, когда разрешаются давние споры и конфликты, период, когда всё налаживается. Здесь возможно документальное оформление каких-то событий, например, получение гражданства или визы, разрешений на что-то. Возможно приобретение недвижимости или других крупных покупок, требующих оформления.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 9: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(9) <span style="font-weight: 400;">Период развития - интеллектуального и духовного. Период получения качественной информации извне, период изучения культуры и искусства, период определения, осмысливая и осознания происходящих вокруг событий,  период формирования нравственных идеалов и ценностей. Период анализа и познания этого мира. Период наполнения своего внутреннего мира всё новой и новой информацией, общаясь, учась, читая, смотря, слушая. Чем больше человек думает, тем лучше и эффективнее работает его мышление. В этот период надо стараться перерабатывать всю информацию, поступившую к Вам. Всё осмысливать, анализировать, сравнивать, делать выводы. То есть, применять все возможные мыслительные процессы. Этот период прекрасно подходит для развития воображения. Самый эффективный способ - мечтать и фантазировать. То есть, воображать все возможные и невозможные варианты развития событий. Но самый простой способ развития воображения - это чтение. Когда человек читает, он представляет то, о чём прочитал. То есть это период, когда человек наполняет свой внутренний мир и получает новые знания. В этот же период человек может начать делиться своими знаниями с другими, обрести единомышленников, сформировать узкий круг своих последователей.</span> 
`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 10: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(10) <span style="font-weight: 400;">Период чудесных радостных событий и удачных поворотов судьбы. Период, когда человек будет удачливым во всём, ему будет сопутствовать везение. Он будет легко добиваться в жизни всего, быстро достигнет желаемого, сможет избежать серьёзных опасностей и трудностей, выйдет из любых сложных жизненных ситуаций. И для всего этого ему не нужно будет прилагать больших усилий, всё уже предрешено высшими силами. Так же это период может ознаменоваться интересными путешествиями, новыми знакомствами с приятными людьми, морем положительных эмоций и незабываемых впечатлений.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 11: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(11) <span style="font-weight: 400;">Очень продуктивный и активный период в жизни, когда получаешь несоизмеримо хорошую отдачу на приложенные усилия. Сила и энергия бьют через край, человек чувствует, что может свернуть горы. Всё получается. Любая работа даётся легко, в короткие сроки выполняются большие объёмы. Если речь идёт о бизнесе, то он стремительно развивается и масштабируется. Это могут быть и колоссальные творческие успехи и приличные спортивные результаты. </span>
`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 12: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(12) <span style="font-weight: 400;">Период изменений и помощи другим. Этот период характеризуется событиями, которые вполне способны изменить ход жизни человека. И здесь нет никаких ограничений по тому, какими эти события могут быть - это может быть и прорыв в творчестве, когда человек запишет новый трек и взорвёт все чарты и музыкальные каналы. А может, человек захочет освоить новую профессию и приступит к обучению. Так же это период характеризуется активной помощью людям, здесь может быть и участие в волонтёрских движениях, и участие в благотворительных фондах, да и просто разовые пожертвования на восстановление храма или культурных достопримечательностей.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 13: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(13) <span style="font-weight: 400;">Период кардинальных изменений, когда можно и нужно перевернуть жизнь. Человек внутренне готов поменяться(он нарастил решительность, обрёл внутреннюю зрелость и способность использовать обстоятельства), а толчком к переменам станет неожиданный поворот судьбы. Не нужно смотреть на него сквозь призму недовольства, а воспользовавшись обстоятельствами, важно изменить к лучшему собственную жизнь. Здесь может быть и смена места работы, и смена сферы деятельности в целом, смена места жительства, рождение детей, смена образа жизни (например, человек перешёл на ЗОЖ, стал вегетарианцем, начал заниматься спортом и т.п.). Чтобы сделать шаг вперёд, потребуется разрушить общепринятые шаблоны и стереотипы, мешающие правила и устоявшиеся стандарты мышления. Произведя радикальные перемены в жизни, человек совершит внезапный и мощный рывок вперед.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 14: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(14) <span style="font-weight: 400;">Очень позитивный период в жизни, когда на душе светло и счастливо. Состояние полного счастья, человек доволен своей жизнью. При этом совершенно неважно, что является источником такого состояния. Для кого-то это гармония в семье, для другого – интересная работа. Каждый человек в этот период будет счастлив по-своему. 
<br>Этот период характеризуется отличным настроением, положительными эмоциями, совершенным спокойствием, умиротворением, оптимизмом, гармонией, уверенностью в себе, достижением поставленных целей.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 15: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(15) <span style="font-weight: 400;">Период материального процветания. В этот период значительно улучшается материальное состояние, получаются сверхприбыли, выигрываются лотереи, отдаются долги, приобретаются новые материальные ценности, то есть деньги нескончаемым потоком идут в руки. Меняется положение в обществе, расширяются сферы влияния, зарабатывается авторитет. Прекрасный период, чтобы научиться не впадать в зависимость от материального, научиться жить умеренно и сдержанно, начать проявлять щедрость, усилить связь с Богом и с его помощью побороть пороки и зависимости. </span>
`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 16: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(16) <span style="font-weight: 400;">Период внутренних изменений. В этот период происходит изменение восприятия реальности, меняются привычные взгляды на жизнь. ""Человек способен изменить свою жизнь, меняя всего лишь свою точку зрения"" (с) Дж. Вильямс. Это выражение как нельзя лучше описывает данный период жизни. 
<br>В этот период человек не боится бросить вызов самому себе, например, путешествовать в одиночку, переехать в новую страну или избавиться от какой-то зависимости. Он отказывается от старых правил и устанавливает новые, которые устраивают именно его. Меняются приоритеты - то, что было интересно в прошлом году, уже не актуально сейчас. Человек начинает одеваться для комфорта, а не для того, чтобы произвести впечатление. Больше не покупает вещи, которые не нужны, только потому, что они модные. 
<br>Жизнь больше не воспринимается, как чёрное и белое. Прекращается осуждение других людей, так как приходит понимание, что это их жизнь и их опыт. Человек понимает, что для него важно и сосредотачивается именно на этом. Не зацикливается и не зависит от соцсетей. Человек приходит к пониманию того, что сам несёт ответственность за свою жизнь и свою судьбу.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 17: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(17) <span style="font-weight: 400;">Период реализации всех способностей человека. Человек становится востребованным, высокооплачиваемым и успешным,  развивается, совершенствуется, обходит всех конкурентов, начинает буквально блистать среди своих коллег. Он достигает небывалых высот, становится эффектным и ярким, его становится невозможно не заметить. Он в центре внимания, о нём говорят, к его мнению прислушиваются, на него хотят быть похожим, он становится примером для многих. Это период подъёма, роста, развития, прогресса. Обретается гармония с окружающим миром и со своим внутренним «Я».</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 18: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(18) <span style="font-weight: 400;">Период смены окружения. На смену пессимистам и токсичным людям придут успешные и позитивно настроенные. За счёт энергетического обмена с ними и поддержки с их стороны будет происходить совершенствование и развитие. Общение с ними принесёт неоспоримую пользу в достижении целей и улучшит качество жизни. 
<br>В этот период также может произойти и смена мышления - с негативного на позитивное; либо же человек может уйти в творчество, стать ближе к искусству, увлечься модой.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 19: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(19) <span style="font-weight: 400;">Период успеха и благоприятных изменений в жизни. Человек добивается поставленных перед собой целей, доволен всеми своими достижениями, морально удовлетворён своим положением в обществе. Здесь он может получить новую интересную и высокооплачиваемую работу, о которой давно мечтал. Либо же может получить более высокую должность там, где уже работает. В любом случае, это увеличение материального достатка и материальных благ, обретение финансовой свободы, процветание, повышение социального статуса. 
<br>Человек становится способным вдохновлять и мотивировать окружающих, становится авторитетным лидером, способным заставить других следовать за ним.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 20: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(20) <span style="font-weight: 400;">Благоприятный период, связанный с приятными хлопотами в семье либо же переездом в другую страну. В семье происходят события, которые сплачивают её членов, приносят радость и счастье. Например, рождение детей. Возможно, приезд родственников, с которыми очень давно не виделись. Либо появляется тот, кого считали пропавшим. Здесь же может случиться и переезд в другую страну, знакомство и брак с иностранцем, работа в другой стране, либо же просто путешествия. 
<br>Могут открыться новые возможности в творчестве и работе, которые принесут популярность (работа на телевидении, блог эксперта, начало своего бизнеса).</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 21: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(21) <span style="font-weight: 400;">В первую очередь в этот период может произойти переезд. Это может быть переезд из одного жилья в другое, может быть переезд из одного города в другой, а может быть и переезд в другую страну. Но определённо меняется привычное место жительства. Также этот период может быть связан с появлением новых людей в окружении, новые встречи, знакомства, связи, новое общение. Жизнь меняется, выходит на иной уровень. Появляется новая работа, открываются новые возможности. В этот период происходит развитие в человеке уверенности в себе, в своих способностях, в своем потенциале и в важности своих действий и решений, чтобы положительно влиять на свою жизнь.
<br>Это период положительных изменений и движения вперёд.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 22: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(22) <span style="font-weight: 400;">Период начала новой жизни, когда все переживания и проблемы остаются в старой. Человек открывает себя по-новому - у него повышается самооценка, обретается уверенность в себе и желание следить за своим внешним видом и физическим здоровьем, уходит страх перемен и напрасные переживания, у него появляется сильное желание развиваться и двигаться вперёд, проходит зависть к другим, разрываются токсичные отношения, человек начинает жить здесь и сейчас. Появляется новая работа, завязываются новые отношения, появляются новые увлечения. Это период всего нового и интересного. Это так же может быть очень активный и жизнерадостный период путешествий, поездок, встреч с друзьями, участия в больших общественных проектах. Человек в этот момент чувствует себя абсолютно свободным и способным на всё. Это так и есть.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
    }

    const text2 = document.createElement('p');
    text2.innerHTML = 'В минусе';
    text2.style.color = '#D2320F';
    text2.style.fontWeight = '700';
    actualPanel.appendChild(text2);

    switch (number) {
      case 3: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(3) <span style="font-weight: 400;">Тяжёлый период в отношениях и семейной жизни, подразумевающий начало проблем между мужчиной и женщиной. Уходят взаимопонимание и взаимоуважение, а на первый план выходят упрёки и недоверие, обиды и разочарование в партнёре, ссоры и унижения. Мужчина может узнать о предательстве со стороны женщины. В этот период он может остаться один - отношения прекратятся, а брак рухнет. Мужчина может разочароваться в любви, семейной жизни и женщинах, появятся проблемы с самооценкой и принятием своей внешности, будет казаться, что всё хорошее осталось позади, а впереди лишь одиночество и пустота. У мужчины могут возникнуть недопонимания и конфликты не только с женщиной, но и с детьми, они могут отдалиться от него, перестать нормально общаться и воспринимать как близкого человека. Здесь же может развиваться и ситуация, когда мужчина взваливает на свои плечи женские обязанности, начинает выполнять в семье женские функции, забывает о своём мужском начале, становится мягким, капризным, агрессивным, инфантильным  то есть она забывает, что он - мужчина.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 4: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(4) <span style="font-weight: 400;">Период фатальных ошибок и неудач, период, когда жизнь проверяет мужчину на прочность. Здесь проблемы могут идти одна за другой, а могут обрушиться сразу все - проблемы на работе, потеря источника дохода, предательство со стороны коллег и друзей, проблемы с физическим и психическим здоровьем, распад или кризис в семье. Это период, когда мужчина теряет уверенность в себе, оказывается неспособным обеспечить свою семью, теряет материальные блага(например, попал в аварию и сильно разбил автомобиль), теряет самого себя. В этот период как никогда важно наладить отношения с родителями, потому что эти отношения напрямую влияют на его жизнь. Например, если мужчина держит обиды на мать, то у него отсутствует желание заботиться о любой женщине. В этот период важно собраться, взять всю свою волю в кулак, прочувствовать всю силу своего духа и идти напролом вперёд, не останавливаясь из-за неудач.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 5: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(5) <span style="font-weight: 400;">Период крупных и мелких неудач. Могут возникнуть проблемы с законом, проблемы в семье - с женой, с детьми, разладятся отношения с родителями или другими родственниками, всплывут какие-то ошибки на работе (например, во время проверки или ревизии). Будет казаться, что всё рушится. Глобально ничего трагического не произойдёт, но череда не совсем приятных инцидентов изрядно попортит нервы. Важно будет не впадать в панику, с холодной головой посмотреть на происходящее и твёрдой рукой навести порядок во всём - дома, на работе, в отношениях с другими людьми. Важно начать жить по правилам и следовать определённому порядку, не бежать впереди паровоза, не поучать других, не брать на себя много, не врать, не жить двойными стандартами. Также большое значение имеет отношение с родителями, а в особенности, с отцом. Важно принять его таким, какой он есть, простить все обиды и открыть своё сердце для любви к нему. </span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 6: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(6) <span style="font-weight: 400;">Неблагоприятный период, во время которого любимый человек может предать или совершить подлость; может изменить, сильно обидеть, не посчитаться с интересами и желаниями или же применить физическую силу; может ударить в самое больное место, не щадя главных ценностей и важных для человека моральных устоев. Во время этого периода очень часто происходят прекращения отношений и разводы. 
<br>Этот период также характеризуется отсутствием положительных эмоций, отсутствием желания любить и ухаживать за собой, потерей гармонии в жизни. В этот период жизненно важно следить за своим здоровьем, особенно за здоровьем сердечно-сосудистой системы. 
<br>Здесь же человек может оказаться перед трудным выбором, будет трудно принять решение, сделать шаг в ту или иную сторону. 
<br>В целом, это позитивная энергия дружбы, открытости и любви. Но чтобы обрести эту дружбу и любовь сначала предстоит пройти через предательства и разочарования, невозможно прийти к плюсу, не пройдя через минус. Здесь главное не закрывать глаза на эти предательства, не прятать голову в песок, делая вид, что всё хорошо, принять факт негатива в свою сторону, прожить это и тогда жизнь страну станет уходить в плюс.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 7: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(7) <span style="font-weight: 400;">Крайне неблагоприятный период болезней и неудач. Период, когда совершаются ошибки, принимаются неверные решения, теряется работа и уважение людей, преследуют поражения, предательства, появляются долги. Может произойти разрыв отношений с любимым человеком. В этот период можно стать жертвой насмешки, оскорбления и позора.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 8: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(8) <span style="font-weight: 400;">Период несправедливости, обмана и предательства. В этот период так же возможны противозаконные действия в Ваш адрес. Почва уходит из-под ног, нарушается стабильность и привычный образ жизни, друзья предают, любимые люди изменяют, коллеги подставляют. В этот период, главное всё это принять и переждать, а не вступать в борьбу с ветряными мельницами. Если же вы начнёте вступать в противостояние, взывать к справедливости, то только усугубите ситуацию и получите удары пострашнее тех неприятностей, которые уже произошли. Только смирение и холодная голова смогут выравнить ситуацию и обернуть минус в плюс. Воспринимайте все проблемы как испытания. Если испытания пройдены с достоинством, то жизнь возвращается в привычное русло. Если же в этих испытаниях Вы потеряли своё лицо и себя, то они продолжатся и обрушатся на Вас с новой силой.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 9: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(9) <span style="font-weight: 400;">Период болезней и одиночества. Начинаются проблемы с физическим здоровьем и здесь важно не пропустить момент, не запустить болезнь, а предпринять все меры для выздоровления. Также в этот период человек может остаться один на один со своими бедами, может остаться без работы, может лишиться семьи и поддержки родственников, может прекратить общения с друзьями. Главное, в этот период не уйти полностью в себя и не закрыться полностью от этого мира.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 10: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(10) <span style="font-weight: 400;">Отчётливая чёрная полоса в жизни. Всё валится из рук, деньги утекают как вода, предают близкие люди, не везёт ни в чем. Даже в самых незначительных бытовых мелочах происходят всякие катаклизмы и неурядицы. Создаётся ощущение, что в один день кто-то пришёл и забрал удачу. Появляется разочарование в окружающем мире и себе, агрессивность к другим людям, неуверенность в своих силах, обида на весь мир, чувство опустошенности. Также в этот период может появиться плохое окружение, которое будет оказывать значительное негативное влияние, что, в свою очередь, ещё более затянет в вопреки неудач.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 11: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(11) <span style="font-weight: 400;">Период работы на износ, физическое и моральное истощение, сильное эмоциональное выгорание, упадок сил, потеря мотивации, опустошение. Сильное разочарования в себе и своих силах, поскольку работа не приносит того результата, который хотелось бы. Работаешь и всё в пустую. На этой почве начинаются проблемы в семье, ссоры, обиды, непонимание, взаимные упрёки, проявляются негативные эмоции. Либо наоборот работа приносит результат, но всё время хочется больше - больше денег, больше недвижимости, больше власти. Человек всё больше и больше рвётся, именно уже рвётся, а не работает. Без отдыха, без расслабления. И загоняет себя в такую ситуацию, когда все заработанные блага не приносят удовольствия , так как усталость перекрывает  все остальные эмоции. При этом тоже начинаются проблемы в семье, поскольку семья его просто не видит. Нужно остановиться, вдохнуть-выдохнуть, понять, что есть вещи важнее материальных благ и что все деньги заработать невозможно.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 12: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(12) <span style="font-weight: 400;">Очень несчастливый период, в который с человеком могут происходить различные несчастные случаи, наносящие существенный вред здоровью. Это могут быть и ДТП, и разного рода травмы - переломы, ожоги, отравления. 
<br>Здесь же могут быть и ситуации, которые негативно влияют на эмоциональное состояние. Например, несправедливое отношение, оскорбления, предательства, обман. В этот период человек может попасть в отношения, в которых он будет выступать в роли жертвы, будет страдать морально, теперь унижения и манипуляции со стороны другого человека. Это могут быть и личные отношения, когда человек попадает в зависимость от своего избранника. Это могут быть и рабочие ситуации, при которых человек выполняет роль бесплатной рабочей силы для своего начальника. 
<br>Также этот период может быть периодом застоя, когда человек закрывается от всего нового, боится перемен и отказывается двигаться вперёд.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 13: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(13) <span style="font-weight: 400;">Достаточно тяжёлый период в жизни. Могут случиться болезненные потери и изменения, которые оставят далеко в прошлом привычную налаженную жизнь. Здесь можно столкнуться со смертью кого-то из близких людей и с этим человеком уйдёт и часть души, и часть жизни. Либо же могут произойти изменения, которые оставят лишь в воспоминаниях какие-то тёплые и душевные моменты в жизни. Например, продажа родительского дома и как следствие невозможно будет приехать туда, где прошло счастливое детство и где родители были молоды и здоровы. 
<br>В этот период может настигнуть и внутренний кризис, когда приходит осознание, что нет особых достижений и жизнь могла бы сложиться намного лучше, кажется, что уже достигнут ""потолок"" и больше не будет изменений к лучшему. Человек сталкивается с апатией, упадком сил, нежеланием вообще что-либо делать. Нет сил принять те изменения, которые преподносит жизнь. Резко падает самооценка, появляется огромное количество комплексов, ощущение беспомощности. Кажется, что никто не понимает, навязчивое чувство одиночества приводит к депрессии. Происходит переоценка взглядов и все, что раньше было важно, теряет ценность. Происходит эмоциональное выгорание и нарушается психическое здоровье. Важно понимать, что всё, что происходит, это не конец жизни, а переход на другой, более качественный уровень, не нужно замыкаться в себе и следует начать смотреть на действительность под другим углом.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 14: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(14) <span style="font-weight: 400;">Период, когда душа болит, а сердце плачет. В этот период человек может испытывать глубокие внутренние страдания, на душе катастрофически плохо. Часто это бывает вызвано развитием малоприятных событий, которые нарушают не только привычный уклад жизни, но и меняют взгляды на жизнь, опустошая при этом внутренний ресурс. В этот период ничего не мило, злят привычные вещи, нет желания ни с кем общаться.  Зачастую душевные переживания настигают человека, когда его личные представления не совпадают с тем, что происходит в реальной жизни и тогда человек попросту испытывает разочарование в этой жизни. Здесь может быть предательство любимого человека, или его смерть, когда душа разрывается от боли. Человек может начать глушить эту боль посредством алкоголя или запрещённых веществ, тем самым наносит ещё бОльший вред своей душе. </span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 15: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(15) <span style="font-weight: 400;">Неблагоприятный период, когда тёмная сторона души человека может дать о себе знать. Проявляются такие качества как гнев, зависть, лживость, ревность, тщеславие, эмоциональная зависимость и так далее. Человек может начать нарушать закон, занимаясь мошенничеством и воровством, ведь им движет непреодолимая тяга к деньгам. Здесь же могут появиться и различного рода зависимости - алкогольная, наркотическая, игровая. Человек может находиться в состоянии какой-то нездоровой эйфории и не может отказать себе ни в чем, так теряются большие суммы денег, начинаются долги. Чтобы покрыть долги человек впутывается в новые и новые аферы, получает деньги, снова их прогуливает, снова аферы и так по кругу.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 16: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(16) <span style="font-weight: 400;">Период регресса в жизни. Может произойти моральная деградация - человек откажется от тех моральных ценностей, которыми жил раньше, в угоду сомнительных удовольствий; его захватят негативные эмоции и качества(злость, зависть, агрессия, лицемерие, подлость). Этот период разрушения души и тела, отношений и карьеры, вся жизнь идёт под откос. Человек может остаться ни с чем. В этот период самое главное, не углубляться в темноту, суметь остановиться, достойно пройти испытания и тогда судьба сжалится. Если же человек полностью погрузится в темноту, то выйти из неё будет очень сложно, а иногда и невозможно.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 17: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(17) <span style="font-weight: 400;">Это период спада, который характеризуется состоянием подавленности и опустошения, мрачными настроениями,  унынием и тоской. У человека снижаются общительность и активность, повышается ипохондричность (преувеличение проблем со здоровьем) и мнительность, возникают неудовлетворенность текущими событиями и собой, пессимизм и скептическое отношение ко всему. Человек не может себя реализовать, сидит и сожалеет об упущенных возможностях, вспоминает прежние переломные моменты в жизни, «пережевывает» собственные неудачи. Накрывает состояние безысходности и бесполезности.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 18: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(18) <span style="font-weight: 400;">Период нахождения под влиянием плохого окружения. Это могут быть люди, которые постоянно генерируют негатив, независимо от внешних обстоятельств. Они всегда всем недовольны, им всегда все должны и все вокруг во всем виноваты. Это могут быть и обычные пессимисты, которые не могут справляться с событиями в своей жизни и сеют панику вокруг себя. Это могут быть и по-настоящему озлобленные люди, которые искренне ненавидят весь мир. А могут быть алкоголики и наркоманы. В любом случае, они излучают негативную энергетику, которая влияет на тех, кто находится с ними рядом. Начинаются проблемы со здоровьем, время тратится впустую, не получается радоваться жизни, нет движения вперёд, превращается развитие, снижается качество жизни. 
<br>Также в этот период человек подвластен сглазам и порчам, потому как подобное притягивает подобное. Человек окружён негативной энергетикой и ей притягивает всё нехорошее.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 19: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(19) <span style="font-weight: 400;">Неблагоприятный период, характеризующийся наплывом разного рода проблем: на работе, в семье, со здоровьем. Могут возникнуть большие денежные трудности, долги, большие непредвиденные расходы. Человек теряет своё прежнее положение в обществе, теряет авторитет и уважение, становится уязвимым для мнения окружающих, закрывается от людей, уходит в одиночеству. Если человек не впадает в панику, не начинает жить страхами(страх бедности, одиночества, непонимания), то этот период быстро проходит. Но если же страхи начинают есть его изнутри, то период может затянуться и закончиться непредсказуемо.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 20: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(20) <span style="font-weight: 400;">Очень тяжёлый период, во время которого испытания суждено пройти не только человеку, но и его семье. Это может быть и тяжёлая болезнь кого-то из родственников, а может быть и смерть. Либо же могут возникать серьёзные конфликты и ссоры внутри семьи, непонимание, упрёки, обиды, оскорбления. В этот период семья по каким-то причинам может отвернуться, отказаться, лишить поддержки и человек останется один, его исключат из рода. В этот период и сам человек может оказаться между жизнью и смертью (болезнь, ДТП, тяжёлая травма). В этот период вся плохая карма рода проявляется и человеку предстоит её проработать. В этот день период человек не может реализовать свои планы, случаются неприятности, которые не дают ему идти вперёд.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 21: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(21) <span style="font-weight: 400;">Этот период характеризуется трудными и болезненными для человека изменениями, которые он не хочет или не может принять, но вынужден это делать, так как именно так складываются обстоятельства, приходится переступать через себя, преодолевать, смириться. Человек выходит из зоны комфорта, где чувствовал себя относительно уверенно и спокойно. Это может быть понижение на работе, сокращение, потеря работы, вынужденный переезд в другой город, разрыв отношений и т.п. 
<br>Если человек в душе примет все эти изменения, то жизнь быстро наладится. Если же он начнёт сопротивляться, воевать, ругать эту жизнь, то период может значительно затянуться. Нужно бороться с недовольством, быть благодарным за всё, что имеешь, быть открытым для этого мира и Бога, открытым для любви.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 22: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(22) <span style="font-weight: 400;">Период ограничений и рамок. Ярко проявляются все негативные установки и представления о себе, которые препятствуют развитию и движению вперёд. ""Я не умею ладить с людьми"", ""У меня совсем нет способностей к бизнесу/пению/иностранным языкам"", ""Мне не дано…"", ""У меня ничего не получится"" и так далее. И исходя из этих убеждений строится жизнь. В этот же период человек может стать заложником каких-то обстоятельств, попасть в ситуацию, из которые кажется, что нет выхода, у человека может отсутствовать право выбора. То есть человек оказывается несвободным и неспособным действовать так, как ему хотелось бы. 
<br>Может быть и совершенно негативная ситуация, когда человек попадает в места лишения свободы или на лечение(когда эта энергия в минусе, может открыться шизофрения или иные психические расстройства, требующие помещение человека в специальные учреждения).</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
    }
  }

    if (gender === 'Ж') {
    const text = document.createElement('p');
    text.innerHTML = 'В плюсе';
    text.style.color = '#1B8909';
    text.style.fontWeight = '700';
    actualPanel.appendChild(text);

    switch (number) {
      case 3: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(3) <span style="font-weight: 400;">Раскрытие женского предназначения и женского потенциала. Если Вы одиноки, то Вам предстоит встреча со своей второй половинкой, начнутся отношения. Если Вы уже в отношениях, то Вас ожидает развитие отношений, вступление в брак, красивая свадьба. Если Вы уже в браке, то обретёте гармонию, мир и спокойствие в семье, откроете для себя новые грани семейное жизни, обретёте взаимопонимание в случае его отсутствия, то есть Ваша семейная жизнь заиграет новыми красками. Это период, когда Вы прислушаетесь к своей женской природе и не пойдёте против неё, откроете для себя счастье материнства или хранительницы очага, создадите неповторимый уют и тепло в доме, станете первоклассной хозяйкой, понимающей и заботливой матерью, любящей и заботливой женой. Поймёте и примите всю себя такой, какая Вы есть. Начнёте вдохновлять и станете музой для противоположного пола. Станете спокойной, сбалансированный и гармоничной. Станете Женщиной во всех её проявлениях. Сумеете грамотно сочетать работу и дом. Возможно, повышение на работе, открытие своего бизнеса, увеличение дохода, расширение сфер своего влияния.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 4: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(4) <span style="font-weight: 400;">Неплохой период, в который женщина может обрести крепкое мужское плечо. Если женщина ещё не в отношениях, то встретит мужчину. Если же она в отношениях, то вполне вероятна смена партнёра. В обоих случаях женщине необходимо принять патриархальный тип отношений, при котором он - добытчик, а она - хранительница очага; стать для него музой, вдохновляющей его на подвиги, а он в ответ будет боготворить её. При таком типе отношений нет сомнений в силе, авторитете и последнем слове мужчины, нет места не уважительному отношению к нему, упрёкам, требованиям, контролю. Это отличный период для замужества. Также в этот период возможно продвижение на работе, благодаря протекции мужчины. Либо же женщина встретит свой идеал в лице мужчины-начальника и обретёт его покровительство, которое поможет ей исполнить давние желания и достичь целей, которые она не могла достичь в одиночку.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 5: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(5) <span style="font-weight: 400;">Период приятной бумажной волокиты - оформление каких-то важных документов, которые до этого долго не было возможности оформить, официальное оформление отношений, рождение детей и получение на них всех необходимых документов (свидетельство о рождении, полис, СНИЛС, оформление выплат и пособий, материнского капитала), разрешение споров в суде. Часто бывает, что всё перечисленное идёт вместе или быстро друг за другом с малыми промежутками во времени. В любом случае это хороший период, когда жизнь упорядочивается, жизнь обретает смысл и систему, всё в ней происходит поэтапно, всё налаживается. 
<br>Также в этот период открываются двери для получения нового образования, продвижения на службе, обретения уважения и новых сфер влияния.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 6: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(6) <span style="font-weight: 400;">Прекрасный период влюблённости, любви и проявления любых тёплых чувств. В этот период сердце замирает, наполняясь любовью, и бабочки летают в животе. Время романтики, цветов, подарков, праздничных мероприятий. В такие периоды случаются свадьбы, помолвки, а также любые другие мероприятия, участниками и организаторами которых выступают влюблённые люди, готовые дарить радость всем вокруг. 
<br>Также это период активной общественной деятельности, бурного дружеского общения, весёлых вечеринок до утра. 
<br>Это отличный период, чтобы начать жить в гармонии с собой, принять и полюбить себя, осознать свою ценность и значимость, заняться любимым делом, окружить себя красотой, создать уют в доме, заняться своей внешностью и обновить гардероб, добавив в него новые красивые и интересные вещи. 
<br>В целом, это позитивная энергия дружбы, открытости и любви. Но чтобы обрести эту дружбу и любовь сначала предстоит пройти через предательства и разочарования, невозможно прийти к плюсу, не пройдя через минус. Здесь главное не закрывать глаза на эти предательства, не прятать голову в песок, делая вид, что всё хорошо, принять факт негатива в свою сторону, прожить это и тогда жизнь страну станет уходить в плюс.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 7: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(7) <span style="font-weight: 400;">Благоприятный период маленьких и больших побед, успехов и достижений. Женщина может выйти замуж, и непременно очень удачно. Может пойти вверх по карьерной лестнице. Может исполнить любые давно загаданные желания. </span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 8: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(8) <span style="font-weight: 400;">Период стабильности и размерности. Жизнь сложилась, есть почва под ногами, быт налажен. Период, когда воздаётся по заслугам, когда получают награды за свои труды, когда разрешаются давние споры и конфликты, период, когда всё налаживается. Здесь возможно документальное оформление каких-то событий, например, получение гражданства или визы, разрешений на что-то. Возможно приобретение недвижимости или других крупных покупок, требующих оформления.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 9: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(9) <span style="font-weight: 400;">Период развития - интеллектуального и духовного. Период получения качественной информации извне, период изучения культуры и искусства, период определения, осмысливая и осознания происходящих вокруг событий,  период формирования нравственных идеалов и ценностей. Период анализа и познания этого мира. Период наполнения своего внутреннего мира всё новой и новой информацией, общаясь, учась, читая, смотря, слушая. Чем больше человек думает, тем лучше и эффективнее работает его мышление. В этот период надо стараться перерабатывать всю информацию, поступившую к Вам. Всё осмысливать, анализировать, сравнивать, делать выводы. То есть, применять все возможные мыслительные процессы. Этот период прекрасно подходит для развития воображения. Самый эффективный способ - мечтать и фантазировать. То есть, воображать все возможные и невозможные варианты развития событий. Но самый простой способ развития воображения - это чтение. Когда человек читает, он представляет то, о чём прочитал. То есть это период, когда человек наполняет свой внутренний мир и получает новые знания. В этот же период человек может начать делиться своими знаниями с другими, обрести единомышленников, сформировать узкий круг своих последователей. 
<br>Для женщин этот период может означать беременность, так как во время неё женщина начинает неосознанно глубже смотреть на многие вещи, закрывается в своём собственном мире, начинает иначе воспринимать этот мир.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 10: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(10) <span style="font-weight: 400;">Период чудесных радостных событий и удачных поворотов судьбы. Период, когда человек будет удачливым во всём, ему будет сопутствовать везение. Он будет легко добиваться в жизни всего, быстро достигнет желаемого, сможет избежать серьёзных опасностей и трудностей, выйдет из любых сложных жизненных ситуаций. И для всего этого ему не нужно будет прилагать больших усилий, всё уже предрешено высшими силами. Так же это период может ознаменоваться интересными путешествиями, новыми знакомствами с приятными людьми, морем положительных эмоций и незабываемых впечатлений.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 11: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(11) <span style="font-weight: 400;">Очень продуктивный и активный период в жизни, когда получаешь несоизмеримо хорошую отдачу на приложенные усилия. Сила и энергия бьют через край, человек чувствует, что может свернуть горы. Всё получается. Любая работа даётся легко, в короткие сроки выполняются большие объёмы. Если речь идёт о бизнесе, то он стремительно развивается и масштабируется. Это могут быть и колоссальные творческие успехи и приличные спортивные результаты. 
<br>Для женщины - это может быть и беременность.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 12: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(12) <span style="font-weight: 400;">Период изменений и помощи другим. Этот период характеризуется событиями, которые вполне способны изменить ход жизни человека. И здесь нет никаких ограничений по тому, какими эти события могут быть - это может быть и неожиданная беременность и прорыв в творчестве, когда человек запишет новый трек и взорвёт все чарты и музыкальные каналы. А может, человек захочет освоить новую профессию и приступит к обучению. Так же это период характеризуется активной помощью людям, здесь может быть и участие в волонтёрских движениях, и участие в благотворительных фондах, да и просто разовые пожертвования на восстановление храма или культурных достопримечательностей.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 13: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(13) <span style="font-weight: 400;">Период кардинальных изменений, когда можно и нужно перевернуть жизнь. Человек внутренне готов поменяться(он нарастил решительность, обрёл внутреннюю зрелость и способность использовать обстоятельства), а толчком к переменам станет неожиданный поворот судьбы. Не нужно смотреть на него сквозь призму недовольства, а воспользовавшись обстоятельствами, важно изменить к лучшему собственную жизнь. Здесь может быть и смена места работы, и смена сферы деятельности в целом, смена места жительства, рождение детей, смена образа жизни (например, человек перешёл на ЗОЖ, стал вегетарианцем, начал заниматься спортом и т.п.). Чтобы сделать шаг вперёд, потребуется разрушить общепринятые шаблоны и стереотипы, мешающие правила и устоявшиеся стандарты мышления. Произведя радикальные перемены в жизни, человек совершит внезапный и мощный рывок вперед.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 14: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(14) <span style="font-weight: 400;">Очень позитивный период в жизни, когда на душе светло и счастливо. Состояние полного счастья, человек доволен своей жизнью. При этом совершенно неважно, что является источником такого состояния. Для кого-то это гармония в семье, для другого – интересная работа. Каждый человек в этот период будет счастлив по-своему. 
<br>Этот период характеризуется отличным настроением, положительными эмоциями, совершенным спокойствием, умиротворением, оптимизмом, гармонией, уверенностью в себе, достижением поставленных целей.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 15: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(15) <span style="font-weight: 400;">Период материального процветания. В этот период значительно улучшается материальное состояние, получаются сверхприбыли, выигрываются лотереи, отдаются долги, приобретаются новые материальные ценности, то есть деньги нескончаемым потоком идут в руки. Меняется положение в обществе, расширяются сферы влияния, зарабатывается авторитет. Прекрасный период, чтобы научиться не впадать в зависимость от материального, научиться жить умеренно и сдержанно, начать проявлять щедрость, усилить связь с Богом и с его помощью побороть пороки и зависимости. </span>
`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 16: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(16) <span style="font-weight: 400;">Период внутренних изменений. В этот период происходит изменение восприятия реальности, меняются привычные взгляды на жизнь. ""Человек способен изменить свою жизнь, меняя всего лишь свою точку зрения"" (с) Дж. Вильямс. Это выражение как нельзя лучше описывает данный период жизни. 
<br>В этот период человек не боится бросить вызов самому себе, например, путешествовать в одиночку, переехать в новую страну или избавиться от какой-то зависимости. Он отказывается от старых правил и устанавливает новые, которые устраивают именно его. Меняются приоритеты - то, что было интересно в прошлом году, уже не актуально сейчас. Человек начинает одеваться для комфорта, а не для того, чтобы произвести впечатление. Больше не покупает вещи, которые не нужны, только потому, что они модные. 
<br>Жизнь больше не воспринимается, как чёрное и белое. Прекращается осуждение других людей, так как приходит понимание, что это их жизнь и их опыт. Человек понимает, что для него важно и сосредотачивается именно на этом. Не зацикливается и не зависит от соцсетей. Человек приходит к пониманию того, что сам несёт ответственность за свою жизнь и свою судьбу.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 17: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(17) <span style="font-weight: 400;">Период реализации всех способностей человека. Человек становится востребованным, высокооплачиваемым и успешным,  развивается, совершенствуется, обходит всех конкурентов, начинает буквально блистать среди своих коллег. Он достигает небывалых высот, становится эффектным и ярким, его становится невозможно не заметить. Он в центре внимания, о нём говорят, к его мнению прислушиваются, на него хотят быть похожим, он становится примером для многих. Это период подъёма, роста, развития, прогресса. Обретается гармония с окружающим миром и со своим внутренним «Я».</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 18: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(18) <span style="font-weight: 400;">Период смены окружения. На смену пессимистам и токсичным людям придут успешные и позитивно настроенные. За счёт энергетического обмена с ними и поддержки с их стороны будет происходить совершенствование и развитие. Общение с ними принесёт неоспоримую пользу в достижении целей и улучшит качество жизни. 
<br>В этот период также может произойти и смена мышления - с негативного на позитивное; либо же человек может уйти в творчество, стать ближе к искусству, увлечься модой.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 19: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(19) <span style="font-weight: 400;">Период успеха и благоприятных изменений в жизни. Человек добивается поставленных перед собой целей, доволен всеми своими достижениями, морально удовлетворён своим положением в обществе. Здесь он может получить новую интересную и высокооплачиваемую работу, о которой давно мечтал. Либо же может получить более высокую должность там, где уже работает. В любом случае, это увеличение материального достатка и материальных благ, обретение финансовой свободы, процветание, повышение социального статуса. 
<br>Человек становится способным вдохновлять и мотивировать окружающих, становится авторитетным лидером, способным заставить других следовать за ним.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 20: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(20) <span style="font-weight: 400;">Благоприятный период, связанный с приятными хлопотами в семье либо же переездом в другую страну. В семье происходят события, которые сплачивают её членов, приносят радость и счастье. Например, рождение детей. Возможно, приезд родственников, с которыми очень давно не виделись. Либо появляется тот, кого считали пропавшим. Здесь же может случиться и переезд в другую страну, знакомство и брак с иностранцем, работа в другой стране, либо же просто путешествия. 
<br>Могут открыться новые возможности в творчестве и работе, которые принесут популярность (работа на телевидении, блог эксперта, начало своего бизнеса).</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 21: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(21) <span style="font-weight: 400;">В первую очередь в этот период может произойти переезд. Это может быть переезд из одного жилья в другое, может быть переезд из одного города в другой, а может быть и переезд в другую страну. Но определённо меняется привычное место жительства. Также этот период может быть связан с появлением новых людей в окружении, новые встречи, знакомства, связи, новое общение. Жизнь меняется, выходит на иной уровень. Появляется новая работа, открываются новые возможности. В этот период происходит развитие в человеке уверенности в себе, в своих способностях, в своем потенциале и в важности своих действий и решений, чтобы положительно влиять на свою жизнь.
<br>Это период положительных изменений и движения вперёд. </span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 22: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(22) <span style="font-weight: 400;">Период начала новой жизни, когда все переживания и проблемы остаются в старой. Человек открывает себя по-новому - у него повышается самооценка, обретается уверенность в себе и желание следить за своим внешним видом и физическим здоровьем, уходит страх перемен и напрасные переживания, у него появляется сильное желание развиваться и двигаться вперёд, проходит зависть к другим, разрываются токсичные отношения, человек начинает жить здесь и сейчас. Появляется новая работа, завязываются новые отношения, появляются новые увлечение. Это период всего нового и интересного. Это так же может быть очень активный и жизнерадостный период путешествий, поездок, встреч с друзьями, участия в больших общественных проектах. Человек в этот момент чувствует себя абсолютно свободным и способным на всё. Это так и есть.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
    }

    const text2 = document.createElement('p');
    text2.innerHTML = 'В минусе';
    text2.style.color = '#D2320F';
    text2.style.fontWeight = '700';
    actualPanel.appendChild(text2);

    switch (number) {
      case 3: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(3) <span style="font-weight: 400;">Тяжёлый период в отношениях и семейной жизни, подразумевающий начало проблем между мужчиной и женщиной. Уходят взаимопонимание и взаимоуважение, а на первый план выходят упрёки и недоверие, обиды и разочарование в партнёре, ссоры и унижения. Женщина может узнать о предательстве со стороны мужчины. В этот период она может остаться одна - отношения прекратятся, а брак рухнет. Женщина может разочароваться в любви, семейной жизни и мужчинах, появятся проблемы с самооценкой и принятием своей внешности, будет казаться, что всё хорошее осталось позади, а впереди лишь одиночество и пустота. У женщины могут возникнуть недопонимания и конфликты не только с мужчиной, но и с детьми, они могут отдалиться от неё, перестать нормально общаться и воспринимать как близкого человека. Здесь же может развиваться и ситуацию, когда женщина взваливает на свои плечи мужские обязанности, начинает выполнять в семье мужские функции, забывает о своём женском начале, становится категоричной, требовательной, агрессивной, грубой  то есть она забывает, что она женщина.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 4: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(4) <span style="font-weight: 400;">Период, когда женщина остаётся без мужской поддержки. Здесь может быть и то, что мужчина в прямом смысле уходит и оставляет женщину одну. Либо же он начинает вести двойную жизнь, изменяя ей. Либо же мужчина номинально есть, но не может стать опорой для женщины, поскольку является слишком мягкотелым, слабохарактерным, безответственным, у него отсутствуют цели и какие-либо амбиции, он не может материально обеспечить женщину, позаботиться о ней и детях. Либо женщина вступает в отношения с мужчиной, но при этом не может открыто рассказать о нём, поскольку он, к примеру, женат, либо занимает какую-то должность и связь с ней может скомпрометировать его. В этот период женщине важно не терять связь с отцом, при проблемах в общении с ним, постараться их устранить, простить обиды и начать общаться с ним, как с одним из самых близких людей. 
<br>Также несмотря на все трудности в отношениях с мужчинами, женщине в этот период важно не потерять уважение и доверие к мужскому полу, не потерять своё женское начало, не исключать возможность счастливых и гармоничных отношений с мужчинами.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 5: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(5) <span style="font-weight: 400;">Период крупных и мелких неудач. Могут возникнуть проблемы с законом, проблемы в семье - с мужем, с детьми, разладятся отношения с родителями или другими родственниками, всплывут какие-то ошибки на работе (например, во время проверки или ревизии). Будет казаться, что всё рушится. Глобально ничего трагического не произойдёт, но череда не совсем приятных инцидентов изрядно попортит нервы. Важно будет не впадать в панику, с холодной головой посмотреть на происходящее и твёрдой рукой навести порядок во всём - дома, на работе, в отношениях с другими людьми. Важно начать жить по правилам и следовать определённому порядку, не бежать впереди паровоза, не поучать других, не брать на себя много, не врать, не жить двойными стандартами. Также большое значение имеет отношение с родителями, а в особенности, с отцом. Важно принять его таким, какой он есть, простить все обиды и открыть своё сердце для любви к нему.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 6: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(6) <span style="font-weight: 400;">Неблагоприятный период, во время которого любимый человек может предать или совершить подлость; может изменить, сильно обидеть, не посчитаться с интересами и желаниями или же применить физическую силу; может ударить в самое больное место, не щадя главных ценностей и важных для человека моральных устоев. Во время этого периода очень часто происходят прекращения отношений и разводы. 
<br>Этот период также характеризуется отсутствием положительных эмоций, отсутствием желания любить и ухаживать за собой, потерей гармонии в жизни. В этот период жизненно важно следить за своим здоровьем, особенно за здоровьем сердечно-сосудистой системы. 
<br>Здесь же человек может оказаться перед трудным выбором, будет трудно принять решение, сделать шаг в ту или иную сторону. 
<br>В целом, это позитивная энергия дружбы, открытости и любви. Но чтобы обрести эту дружбу и любовь сначала предстоит пройти через предательства и разочарования, невозможно прийти к плюсу, не пройдя через минус. Здесь главное не закрывать глаза на эти предательства, не прятать голову в песок, делая вид, что всё хорошо, принять факт негатива в свою сторону, прожить это и тогда жизнь страну станет уходить в плюс.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 7: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(7) <span style="font-weight: 400;">Крайне неблагоприятный период болезней и неудач. Период, когда совершаются ошибки, принимаются неверные решения, теряется работа и уважение людей, преследуют поражения, предательства, появляются долги. Может произойти разрыв отношений с любимым человеком. В этот период можно стать жертвой насмешки, оскорбления и позора.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 8: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(8) <span style="font-weight: 400;">Период несправедливости, обмана и предательства. В этот период так же возможны противозаконные действия в Ваш адрес. Почва уходит из-под ног, нарушается стабильность и привычный образ жизни, друзья предают, любимые люди изменяют, коллеги подставляют. В этот период, главное всё это принять и переждать, а не вступать в борьбу с ветряными мельницами. Если же вы начнёте вступать в противостояние, взывать к справедливости, то только усугубите ситуацию и получите удары пострашнее тех неприятностей, которые уже произошли. Только смирение и холодная голова смогут выравнить ситуацию и обернуть минус в плюс. Воспринимайте все проблемы как испытания. Если испытания пройдены с достоинством, то жизнь возвращается в привычное русло. Если же в этих испытаниях Вы потеряли своё лицо и себя, то они продолжатся и обрушатся на Вас с новой силой.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 9: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(9) <span style="font-weight: 400;">Период болезней и одиночества. Начинаются проблемы с физическим здоровьем и здесь важно не пропустить момент, не запустить болезнь, а предпринять все меры для выздоровления. Также в этот период человек может остаться один на один со своими бедами, может остаться без работы, может лишиться семьи и поддержки родственников, может прекратить общения с друзьями. Главное, в этот период не уйти полностью в себя и не закрыться полностью от этого мира. </span>
`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 10: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(10) <span style="font-weight: 400;">Отчётливая чёрная полоса в жизни. Всё валится из рук, деньги утекают как вода, предают близкие люди, не везёт ни в чем. Даже в самых незначительных бытовых мелочах происходят всякие катаклизмы и неурядицы. Создаётся ощущение, что в один день кто-то пришёл и забрал удачу. Появляется разочарование в окружающем мире и себе, агрессивность к другим людям, неуверенность в своих силах, обида на весь мир, чувство опустошенности. Также в этот период может появиться плохое окружение, которое будет оказывать значительное негативное влияние, что, в свою очередь, ещё более затянет в вопреки неудач.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 11: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(11) <span style="font-weight: 400;">Период работы на износ, физическое и моральное истощение, сильное эмоциональное выгорание, упадок сил, потеря мотивации, опустошение. Сильное разочарования в себе и своих силах, поскольку работа не приносит того результата, который хотелось бы. Работаешь и всё в пустую. На этой почве начинаются проблемы в семье, ссоры, обиды, непонимание, взаимные упрёки, проявляются негативные эмоции. Либо наоборот работа приносит результат, но всё время хочется больше - больше денег, больше недвижимости, больше власти. Человек всё больше и больше рвётся, именно уже рвётся, а не работает. Без отдыха, без расслабления. И загоняет себя в такую ситуацию, когда все заработанные блага не приносят удовольствия , так как усталость перекрывает  все остальные эмоции. При этом тоже начинаются проблемы в семье, поскольку семья его просто не видит. Нужно остановиться, вдохнуть-выдохнуть, понять, что есть вещи важнее материальных благ и что все деньги заработать невозможно.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 12: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(12) <span style="font-weight: 400;">Очень несчастливый период, в который с человеком могут происходить различные несчастные случаи, наносящие существенный вред здоровью. Это могут быть и ДТП, и разного рода травмы - переломы, ожоги, отравления. Может даже случиться замершая беременность. 
<br>Здесь же могут быть и ситуации, которые негативно влияют на эмоциональное состояние. Например, несправедливое отношение, оскорбления, предательства, обман. В этот период человек может попасть в отношения, в которых он будет выступать в роли жертвы, будет страдать морально, теперь унижения и манипуляции со стороны другого человека. Это могут быть и личные отношения, когда человек попадает в зависимость от своего избранника. Это могут быть и рабочие ситуации, при которых человек выполняет роль бесплатной рабочей силы для своего начальника. 
<br>Также этот период может быть периодом застоя, когда человек закрывается от всего нового, боится перемен и отказывается двигаться вперёд.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 13: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(13) <span style="font-weight: 400;">Достаточно тяжёлый период в жизни. Могут случиться болезненные потери и изменения, которые оставят далеко в прошлом привычную налаженную жизнь. Здесь можно столкнуться со смертью кого-то из близких людей и с этим человеком уйдёт и часть души, и часть жизни. Либо же могут произойти изменения, которые оставят лишь в воспоминаниях какие-то тёплые и душевные моменты в жизни. Например, продажа родительского дома и как следствие невозможно будет приехать туда, где прошло счастливое детство и где родители были молоды и здоровы. 
<br>В этот период может настигнуть и внутренний кризис, когда приходит осознание, что нет особых достижений и жизнь могла бы сложиться намного лучше, кажется, что уже достигнут ""потолок"" и больше не будет изменений к лучшему. Человек сталкивается с апатией, упадком сил, нежеланием вообще что-либо делать. Нет сил принять те изменения, которые преподносит жизнь. Резко падает самооценка, появляется огромное количество комплексов, ощущение беспомощности. Кажется, что никто не понимает, навязчивое чувство одиночества приводит к депрессии. Происходит переоценка взглядов и все, что раньше было важно, теряет ценность. Происходит эмоциональное выгорание и нарушается психическое здоровье. Важно понимать, что всё, что происходит, это не конец жизни, а переход на другой, более качественный уровень, не нужно замыкаться в себе и следует начать смотреть на действительность под другим углом.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 14: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(14) <span style="font-weight: 400;">Период, когда душа болит, а сердце плачет. В этот период человек может испытывать глубокие внутренние страдания, на душе катастрофически плохо. Часто это бывает вызвано развитием малоприятных событий, которые нарушают не только привычный уклад жизни, но и меняют взгляды на жизнь, опустошая при этом внутренний ресурс. В этот период ничего не мило, злят привычные вещи, нет желания ни с кем общаться.  Зачастую душевные переживания настигают человека, когда его личные представления не совпадают с тем, что происходит в реальной жизни и тогда человек попросту испытывает разочарование в этой жизни. Здесь может быть предательство любимого человека, или его смерть, когда душа разрывается от боли. Человек может начать глушить эту боль посредством алкоголя или запрещённых веществ, тем самым наносит ещё бОльший вред своей душе.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 15: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(15) <span style="font-weight: 400;">Неблагоприятный период, когда тёмная сторона души человека может дать о себе знать. Проявляются такие качества как гнев, зависть, лживость, ревность, тщеславие, эмоциональная зависимость и так далее. Человек может начать нарушать закон, занимаясь мошенничеством и воровством, ведь им движет непреодолимая тяга к деньгам. Здесь же могут появиться и различного рода зависимости - алкогольная, наркотическая, игровая. Человек может находиться в состоянии какой-то нездоровой эйфории и не может отказать себе ни в чем, так теряются большие суммы денег, начинаются долги. Чтобы покрыть долги человек впутывается в новые и новые аферы, получает деньги, снова их прогуливает, снова аферы и так по кругу.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 16: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(16) <span style="font-weight: 400;">Период регресса в жизни. Может произойти моральная деградация - человек откажется от тех моральных ценностей, которыми жил раньше, в угоду сомнительных удовольствий; его захватят негативные эмоции и качества(злость, зависть, агрессия, лицемерие, подлость). Этот период разрушения души и тела, отношений и карьеры, вся жизнь идёт под откос. Человек может остаться ни с чем. В этот период самое главное, не углубляться в темноту, суметь остановиться, достойно пройти испытания и тогда судьба сжалится. Если же человек полностью погрузится в темноту, то выйти из неё будет очень сложно, а иногда и невозможно.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 17: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(17) <span style="font-weight: 400;">Это период спада, который характеризуется состоянием подавленности и опустошения, мрачными настроениями,  унынием и тоской. У человека снижаются общительность и активность, повышается ипохондричность (преувеличение проблем со здоровьем) и мнительность, возникают неудовлетворенность текущими событиями и собой, пессимизм и скептическое отношение ко всему. Человек не может себя реализовать, сидит и сожалеет об упущенных возможностях, вспоминает прежние переломные моменты в жизни, «пережевывает» собственные неудачи. Накрывает состояние безысходности и бесполезности.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 18: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(18) <span style="font-weight: 400;">Период нахождения под влиянием плохого окружения. Это могут быть люди, которые постоянно генерируют негатив, независимо от внешних обстоятельств. Они всегда всем недовольны, им всегда все должны и все вокруг во всем виноваты. Это могут быть и обычные пессимисты, которые не могут справляться с событиями в своей жизни и сеют панику вокруг себя. Это могут быть и по-настоящему озлобленные люди, которые искренне ненавидят весь мир. А могут быть алкоголики и наркоманы. В любом случае, они излучают негативную энергетику, которая влияет на тех, кто находится с ними рядом. Начинаются проблемы со здоровьем, время тратится впустую, не получается радоваться жизни, нет движения вперёд, превращается развитие, снижается качество жизни. 
<br>Также в этот период человек подвластен сглазам и порчам, потому как подобное притягивает подобное. Человек окружён негативной энергетикой и ей притягивает всё нехорошее.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 19: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(19) <span style="font-weight: 400;">Неблагоприятный период, характеризующийся наплывом разного рода проблем: на работе, в семье, со здоровьем. Могут возникнуть большие денежные трудности, долги, большие непредвиденные расходы. Человек теряет своё прежнее положение в обществе, теряет авторитет и уважение, становится уязвимым для мнения окружающих, закрывается от людей, уходит в одиночеству. Если человек не впадает в панику, не начинает жить страхами(страх бедности, одиночества, непонимания), то этот период быстро проходит. Но если же страхи начинают есть его изнутри, то период может затянуться и закончиться непредсказуемо.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 20: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(20) <span style="font-weight: 400;">Очень тяжёлый период, во время которого испытания суждено пройти не только человеку, но и его семье. Это может быть и тяжёлая болезнь кого-то из родственников, а может быть и смерть. Либо же могут возникать серьёзные конфликты и ссоры внутри семьи, непонимание, упрёки, обиды, оскорбления. В этот период семья по каким-то причинам может отвернуться, отказаться, лишить поддержки и человек останется один, его исключат из рода. В этот период и сам человек может оказаться между жизнью и смертью (болезнь, ДТП, тяжёлая травма). В этот период вся плохая карма рода проявляется и человеку предстоит её проработать. В этот день период человек не может реализовать свои планы, случаются неприятности, которые не дают ему идти вперёд.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 21: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(21) <span style="font-weight: 400;">Этот период характеризуется трудными и болезненными для человека изменениями, которые он не хочет или не может принять, но вынужден это делать, так как именно так складываются обстоятельства, приходится переступать через себя, преодолевать, смириться. Человек выходит из зоны комфорта, где чувствовал себя относительно уверенно и спокойно. Это может быть понижение на работе, сокращение, потеря работы, вынужденный переезд в другой город, разрыв отношений и т.п. 
<br>Если человек в душе примет все эти изменения, то жизнь быстро наладится. Если же он начнёт сопротивляться, воевать, ругать эту жизнь, то период может значительно затянуться. Нужно бороться с недовольством, быть благодарным за всё, что имеешь, быть открытым для этого мира и Бога, открытым для любви.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 22: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(22) <span style="font-weight: 400;">Период ограничений и рамок. Ярко проявляются все негативные установки и представления о себе, которые препятствуют развитию и движению вперёд. ""Я не умею ладить с людьми"", ""У меня совсем нет способностей к бизнесу/пению/иностранным языкам"", ""Мне не дано…"", ""У меня ничего не получится"" и так далее. И исходя из этих убеждений строится жизнь. В этот же период человек может стать заложником каких-то обстоятельств, попасть в ситуацию, из которые кажется, что нет выхода, у человека может отсутствовать право выбора. То есть человек оказывается несвободным и неспособным действовать так, как ему хотелось бы. 
<br>Может быть и совершенно негативная ситуация, когда человек попадает в места лишения свободы или на лечение(когда эта энергия в минусе, может открыться шизофрения или иные психические расстройства, требующие помещение человека в специальные учреждения).</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
    }
  }
  
    let newAge = 0;
    let number2 = 0;

    if (actualAge <= 41) {
        newAge = actualAge + 40;
    } else {
        newAge = actualAge - 40;
    }
    
    if (newAge) {
        if (newAge > 0 && newAge < 2.5) {
            number2 = AE3;
        }
        
        if (Math.round(newAge) === 3) {
            number2 = AE1;
        }
        
        if (Math.round(newAge) === 4) {
            number2 = AE4;
        }
        
        if (newAge > 4.49 && newAge < 5.9) {
            number2 = AE;
        }
        
        if (newAge > 5.9 && newAge < 7.5) {
            number2 = AE5;
        }
        
        if (Math.round(newAge) === 8) {
            number2 = AE2;
        }
        
        if (Math.round(newAge) === 9) {
            number2 = AE6;
        }
        
        if (newAge > 9.49 && newAge < 11) {
            number2 = E;
        }
        
        if (newAge > 10.9 && newAge < 12.5) {
            number2 = EB3;
        }
        
        if (Math.round(newAge) === 13) {
            number2 = EB1;
        }
        
        if (Math.round(newAge) === 14) {
            number2 = EB4;
        }
        
        if (newAge > 14.49 && newAge < 15.9) {
            number2 = EB;
        }
        
        if (newAge > 15.9 && newAge < 17.5) {
            number2 = EB5;
        }
        
        if (Math.round(newAge) === 18) {
            number2 = EB2;
        }
        
        if (Math.round(newAge) === 19) {
            number2 = EB6;
        }
        
        if (newAge > 19.5 && newAge < 21) {
            number2 = B;
        }
        
        if (newAge > 20.9 && newAge < 22.5) {
            number2 = BF3;
        }
        
        if (Math.round(newAge) === 23) {
            number2 = BF1;
        }

        if (Math.round(newAge) === 24) {
            number2 = BF4;
        }

        if (newAge > 24.49 && newAge < 25.9) {
            number2 = BF;
        }
        
        if (newAge > 25.9 && newAge < 27.5) {
            number2 = BF5;
        }
        
        if (Math.round(newAge) === 28) {
            number2 = BF2;
        }
        
        if (Math.round(newAge) === 29) {
            number2 = BF6;
        }
        
        if (newAge > 29.49 && newAge < 31) {
            number2 = F;
        }
        
        if (newAge > 30.9 && newAge < 32.5) {
            number2 = FC3;
        }
        
        if (Math.round(newAge) === 33) {
            number2 = FC1;
        }
        
        if (Math.round(newAge) === 34) {
            number2 = FC4;
        }
        
        if (newAge >= 34.49 && newAge < 35.9) {
            number2 = FC;
        }
        
        if (newAge > 35.9 && newAge < 37.5) {
            number2 = FC5;
        }
        
        if (Math.round(newAge) === 38) {
            number2 = FC2;
        }
        
        if (Math.round(newAge) === 39) {
            number2 = FC6;
        }
        
        if (newAge > 39.49 && newAge < 41) {
            number2 = C;
        }
        
        if (newAge > 40.9 && newAge < 42.5) {
            number2 = CG3;
        }
        
        if (Math.round(newAge) === 43) {
            number2 = CG1;
        }
        
        if (Math.round(newAge) === 44) {
            number2 = CG4;
        }
        
        if (newAge > 44.49 && newAge < 45.9) {
            number2 = CG;
        }
        
        if (newAge > 45.9 && newAge < 47.5) {
            number2 = CG5;
        }
        
        if (Math.round(newAge) === 48) {
            number2 = CG2;
        }
        
        if (Math.round(newAge) === 49) {
            number2 = CG6;
        }
        
        if (newAge > 49.49 && newAge < 51) {
            number2 = G;
        }
        
        if (newAge > 50.9 && newAge < 52.5) {
            number2 = GD3;
        }
        
        if (Math.round(newAge) === 53) {
            number2 = GD1;
        }
        
        if (Math.round(newAge) === 54) {
            number2 = GD4;
        }
        
        if (newAge > 54.49 && newAge < 55.9) {
            number2 = GD;
        }
        
        if (newAge > 55.9 && newAge < 57.5) {
            number2 = GD5;
        }
        
        if (Math.round(newAge) === 58) {
            number2 = GD2;
        }
        
        if (Math.round(newAge) === 59) {
            number2 = GD6;
        }
        
        if (newAge > 59.49 && newAge < 61) {
            number2 = D;
        }
        
        if (newAge > 60.9 && newAge < 62.5) {
            number2 = DH3;
        }
        
        if (Math.round(newAge) === 63) {
            number2 = DH1;
        }
        
        if (Math.round(newAge) === 64) {
            number2 = DH4;
        }
        
        if (newAge > 64.49 && newAge < 65.9) {
            number2 = DH;
        }
        
        if (newAge > 65.9 && newAge < 67.5) {
            number2 = DH5;
        }
        
        if (Math.round(newAge) === 68) {
            number2 = DH2;
        }
        
        if (Math.round(newAge) === 69) {
            number2 = DH6;
        }
        
        if (newAge > 69.49 && newAge < 71) {
            number2 = H;
        }
        
        if (newAge > 70.9 && newAge < 72.5) {
            number2 = HA3;
        }
        
        if (Math.round(newAge) === 73) {
            number2 = HA1;
        }
        
        if (Math.round(newAge) === 74) {
            number2 = HA4;
        }
        
        if (newAge > 74.49 && newAge < 75.9) {
            number2 = HA;
        }
        
        if (newAge > 75.9 && newAge < 77.5) {
            number2 = HA5;
        }
        
        if (Math.round(newAge) === 78) {
            number2 = HA2;
        }
        
        if (Math.round(newAge) === 79) {
            number2 = HA6;
        }
        
        if (newAge > 79.49 && newAge < 82) {
            number2 = A;
        }
    }
    
    let itemParagraph2 = document.createElement('p');
    let itemParagraphList = document.createElement('ul');
    let itemParagraphItem = document.createElement('li')
    itemParagraph2.textContent = 'Причины событий';
    itemParagraph2.style.textDecoration = 'none';
    itemParagraph2.style.color = '#5A5A5A';
    itemParagraph2.classList.add('panel-topic');
    itemParagraphItem.appendChild(itemParagraph2);
    itemParagraphList.appendChild(itemParagraphItem);
    actualPanel.appendChild(itemParagraphList);

  if (gender === 'М') {
    const text = document.createElement('p');
    text.innerHTML = 'В плюсе';
    text.style.color = '#1B8909';
    text.style.fontWeight = '700';
    actualPanel.appendChild(text);

    switch (number2) {
      case 3: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(3) <span style="font-weight: 400;">Раскрытие женского предназначения и женского потенциала. Если Вы одиноки, то Вам предстоит встреча со своей второй половинкой, начнутся отношения. Если Вы уже в отношениях, то Вас ожидает развитие отношений, вступление в брак, красивая свадьба. Если Вы уже в браке, то обретёте гармонию, мир и спокойствие в семье, откроете для себя новые грани семейное жизни, обретёте взаимопонимание в случае его отсутствия, то есть Ваша семейная жизнь заиграет новыми красками. Это период, когда Вы прислушаетесь к своей женской природе и не пойдёте против неё, откроете для себя счастье материнства или хранительницы очага, создадите неповторимый уют и тепло в доме, станете первоклассной хозяйкой, понимающей и заботливой матерью, любящей и заботливой женой. Поймёте и примите всю себя такой, какая Вы есть. Начнёте вдохновлять и станете музой для противоположного пола. Станете спокойной, сбалансированный и гармоничной. Станете Женщиной во всех её проявлениях. Сумеете грамотно сочетать работу и дом. Возможно, повышение на работе, открытие своего бизнеса, увеличение дохода, расширение сфер своего влияния.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 4: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(4) <span style="font-weight: 400;">Благоприятный во всех смыслах период. Здесь может произойти квантовый скачок в развитии - будет достигнуто всё, к чему мужчина долго и упорно шёл, откроются новые горизонты, увеличатся многократно доходы, произойдёт расширение и укрепление бизнеса, быстрое продвижение по карьерной лестнице. Здесь же мужчина может стать главой семьи, отцом. Одним словом, в этот период мужчина себя полностью реализует во всех аспектах жизни.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 5: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(5) <span style="font-weight: 400;">Период приятной бумажной волокиты - оформление каких-то важных документов, которые до этого долго не было возможности оформить, официальное оформление отношений, рождение детей и получение на них всех необходимых документов (свидетельство о рождении, полис, СНИЛС, оформление выплат и пособий, материнского капитала), разрешение споров в суде. Часто бывает, что всё перечисленное идёт вместе или быстро друг за другом с малыми промежутками во времени. В любом случае это хороший период, когда жизнь упорядочивается, жизнь обретает смысл и систему, всё в ней происходит поэтапно, всё налаживается. 
<br>Также в этот период открываются двери для получения нового образования, продвижения на службе, обретения уважения и новых сфер влияния.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 6: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(6) <span style="font-weight: 400;">Прекрасный период влюблённости, любви и проявления любых тёплых чувств. В этот период сердце замирает, наполняясь любовью, и бабочки летают в животе. Время романтики, цветов, подарков, праздничных мероприятий. В такие периоды случаются свадьбы, помолвки, а также любые другие мероприятия, участниками и организаторами которых выступают влюблённые люди, готовые дарить радость всем вокруг. 
<br>Также это период активной общественной деятельности, бурного дружеского общения, весёлых вечеринок до утра. 
<br>Это отличный период, чтобы начать жить в гармонии с собой, принять и полюбить себя, осознать свою ценность и значимость, заняться любимым делом, окружить себя красотой, создать уют в доме, заняться своей внешностью и обновить гардероб, добавив в него новые красивые и интересные вещи. 
<br>В целом, это позитивная энергия дружбы, открытости и любви. Но чтобы обрести эту дружбу и любовь сначала предстоит пройти через предательства и разочарования, невозможно прийти к плюсу, не пройдя через минус. Здесь главное не закрывать глаза на эти предательства, не прятать голову в песок, делая вид, что всё хорошо, принять факт негатива в свою сторону, прожить это и тогда жизнь страну станет уходить в плюс.
</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 7: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(7) <span style="font-weight: 400;">Сильный и благоприятный период, во время которого мужчина добьётся успеха, ему будет сопутствовать удача, покорятся все вершины, будут достигнуты многие цели, будут показаны хорошие результаты в любой деятельности. Мужчина поистине проявит себя лидером и победителем.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 8: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(8) <span style="font-weight: 400;">Период стабильности и размерности. Жизнь сложилась, есть почва под ногами, быт налажен. Период, когда воздаётся по заслугам, когда получают награды за свои труды, когда разрешаются давние споры и конфликты, период, когда всё налаживается. Здесь возможно документальное оформление каких-то событий, например, получение гражданства или визы, разрешений на что-то. Возможно приобретение недвижимости или других крупных покупок, требующих оформления.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 9: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(9) <span style="font-weight: 400;">Период развития - интеллектуального и духовного. Период получения качественной информации извне, период изучения культуры и искусства, период определения, осмысливая и осознания происходящих вокруг событий,  период формирования нравственных идеалов и ценностей. Период анализа и познания этого мира. Период наполнения своего внутреннего мира всё новой и новой информацией, общаясь, учась, читая, смотря, слушая. Чем больше человек думает, тем лучше и эффективнее работает его мышление. В этот период надо стараться перерабатывать всю информацию, поступившую к Вам. Всё осмысливать, анализировать, сравнивать, делать выводы. То есть, применять все возможные мыслительные процессы. Этот период прекрасно подходит для развития воображения. Самый эффективный способ - мечтать и фантазировать. То есть, воображать все возможные и невозможные варианты развития событий. Но самый простой способ развития воображения - это чтение. Когда человек читает, он представляет то, о чём прочитал. То есть это период, когда человек наполняет свой внутренний мир и получает новые знания. В этот же период человек может начать делиться своими знаниями с другими, обрести единомышленников, сформировать узкий круг своих последователей. 
<br>Для женщин этот период может означать беременность, так как во время неё женщина начинает неосознанно глубже смотреть на многие вещи, закрывается в своём собственном мире, начинает иначе воспринимать этот мир.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 10: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(10) <span style="font-weight: 400;">Период чудесных радостных событий и удачных поворотов судьбы. Период, когда человек будет удачливым во всём, ему будет сопутствовать везение. Он будет легко добиваться в жизни всего, быстро достигнет желаемого, сможет избежать серьёзных опасностей и трудностей, выйдет из любых сложных жизненных ситуаций. И для всего этого ему не нужно будет прилагать больших усилий, всё уже предрешено высшими силами. Так же это период может ознаменоваться интересными путешествиями, новыми знакомствами с приятными людьми, морем положительных эмоций и незабываемых впечатлений.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 11: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(11) <span style="font-weight: 400;">Очень продуктивный и активный период в жизни, когда получаешь несоизмеримо хорошую отдачу на приложенные усилия. Сила и энергия бьют через край, человек чувствует, что может свернуть горы. Всё получается. Любая работа даётся легко, в короткие сроки выполняются большие объёмы. Если речь идёт о бизнесе, то он стремительно развивается и масштабируется. Это могут быть и колоссальные творческие успехи и приличные спортивные результаты. 
<br>Для женщины - это может быть и беременность.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 12: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(12) <span style="font-weight: 400;">Период изменений и помощи другим. Этот период характеризуется событиями, которые вполне способны изменить ход жизни человека. И здесь нет никаких ограничений по тому, какими эти события могут быть - это может быть и неожиданная беременность и прорыв в творчестве, когда человек запишет новый трек и взорвёт все чарты и музыкальные каналы. А может, человек захочет освоить новую профессию и приступит к обучению. Так же это период характеризуется активной помощью людям, здесь может быть и участие в волонтёрских движениях, и участие в благотворительных фондах, да и просто разовые пожертвования на восстановление храма или культурных достопримечательностей.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 13: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(13) <span style="font-weight: 400;">Период кардинальных изменений, когда можно и нужно перевернуть жизнь. Человек внутренне готов поменяться(он нарастил решительность, обрёл внутреннюю зрелость и способность использовать обстоятельства), а толчком к переменам станет неожиданный поворот судьбы. Не нужно смотреть на него сквозь призму недовольства, а воспользовавшись обстоятельствами, важно изменить к лучшему собственную жизнь. Здесь может быть и смена места работы, и смена сферы деятельности в целом, смена места жительства, рождение детей, смена образа жизни (например, человек перешёл на ЗОЖ, стал вегетарианцем, начал заниматься спортом и т.п.). Чтобы сделать шаг вперёд, потребуется разрушить общепринятые шаблоны и стереотипы, мешающие правила и устоявшиеся стандарты мышления. Произведя радикальные перемены в жизни, человек совершит внезапный и мощный рывок вперед.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 14: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(14) <span style="font-weight: 400;">Очень позитивный период в жизни, когда на душе светло и счастливо. Состояние полного счастья, человек доволен своей жизнью. При этом совершенно неважно, что является источником такого состояния. Для кого-то это гармония в семье, для другого – интересная работа. Каждый человек в этот период будет счастлив по-своему. 
<br>Этот период характеризуется отличным настроением, положительными эмоциями, совершенным спокойствием, умиротворением, оптимизмом, гармонией, уверенностью в себе, достижением поставленных целей. </span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 15: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(15) <span style="font-weight: 400;">Период материального процветания. В этот период значительно улучшается материальное состояние, получаются сверхприбыли, выигрываются лотереи, отдаются долги, приобретаются новые материальные ценности, то есть деньги нескончаемым потоком идут в руки. Меняется положение в обществе, расширяются сферы влияния, зарабатывается авторитет. Прекрасный период, чтобы научиться не впадать в зависимость от материального, научиться жить умеренно и сдержанно, начать проявлять щедрость, усилить связь с Богом и с его помощью побороть пороки и зависимости. </span>
`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 16: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(16) <span style="font-weight: 400;">Период внутренних изменений. В этот период происходит изменение восприятия реальности, меняются привычные взгляды на жизнь. ""Человек способен изменить свою жизнь, меняя всего лишь свою точку зрения"" (с) Дж. Вильямс. Это выражение как нельзя лучше описывает данный период жизни. 
<br>В этот период человек не боится бросить вызов самому себе, например, путешествовать в одиночку, переехать в новую страну или избавиться от какой-то зависимости. Он отказывается от старых правил и устанавливает новые, которые устраивают именно его. Меняются приоритеты - то, что было интересно в прошлом году, уже не актуально сейчас. Человек начинает одеваться для комфорта, а не для того, чтобы произвести впечатление. Больше не покупает вещи, которые не нужны, только потому, что они модные. 
<br>Жизнь больше не воспринимается, как чёрное и белое. Прекращается осуждение других людей, так как приходит понимание, что это их жизнь и их опыт. Человек понимает, что для него важно и сосредотачивается именно на этом. Не зацикливается и не зависит от соцсетей. Человек приходит к пониманию того, что сам несёт ответственность за свою жизнь и свою судьбу.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 17: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(17) <span style="font-weight: 400;">Период реализации всех способностей человека. Человек становится востребованным, высокооплачиваемым и успешным,  развивается, совершенствуется, обходит всех конкурентов, начинает буквально блистать среди своих коллег. Он достигает небывалых высот, становится эффектным и ярким, его становится невозможно не заметить. Он в центре внимания, о нём говорят, к его мнению прислушиваются, на него хотят быть похожим, он становится примером для многих. Это период подъёма, роста, развития, прогресса. Обретается гармония с окружающим миром и со своим внутренним «Я».</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 18: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(18) <span style="font-weight: 400;">Период смены окружения. На смену пессимистам и токсичным людям придут успешные и позитивно настроенные. За счёт энергетического обмена с ними и поддержки с их стороны будет происходить совершенствование и развитие. Общение с ними принесёт неоспоримую пользу в достижении целей и улучшит качество жизни. 
<br>В этот период также может произойти и смена мышления - с негативного на позитивное; либо же человек может уйти в творчество, стать ближе к искусству, увлечься модой.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 19: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(19) <span style="font-weight: 400;">Период успеха и благоприятных изменений в жизни. Человек добивается поставленных перед собой целей, доволен всеми своими достижениями, морально удовлетворён своим положением в обществе. Здесь он может получить новую интересную и высокооплачиваемую работу, о которой давно мечтал. Либо же может получить более высокую должность там, где уже работает. В любом случае, это увеличение материального достатка и материальных благ, обретение финансовой свободы, процветание, повышение социального статуса. 
<br>Человек становится способным вдохновлять и мотивировать окружающих, становится авторитетным лидером, способным заставить других следовать за ним.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 20: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(20) <span style="font-weight: 400;">Благоприятный период, связанный с приятными хлопотами в семье либо же переездом в другую страну. В семье происходят события, которые сплачивают её членов, приносят радость и счастье. Например, рождение детей. Возможно, приезд родственников, с которыми очень давно не виделись. Либо появляется тот, кого считали пропавшим. Здесь же может случиться и переезд в другую страну, знакомство и брак с иностранцем, работа в другой стране, либо же просто путешествия. 
<br>Могут открыться новые возможности в творчестве и работе, которые принесут популярность (работа на телевидении, блог эксперта, начало своего бизнеса).</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 21: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(21) <span style="font-weight: 400;">В первую очередь в этот период может произойти переезд. Это может быть переезд из одного жилья в другое, может быть переезд из одного города в другой, а может быть и переезд в другую страну. Но определённо меняется привычное место жительства. Также этот период может быть связан с появлением новых людей в окружении, новые встречи, знакомства, связи, новое общение. Жизнь меняется, выходит на иной уровень. Появляется новая работа, открываются новые возможности. В этот период происходит развитие в человеке уверенности в себе, в своих способностях, в своем потенциале и в важности своих действий и решений, чтобы положительно влиять на свою жизнь.
<br>Это период положительных изменений и движения вперёд.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 22: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(22) <span style="font-weight: 400;">Период начала новой жизни, когда все переживания и проблемы остаются в старой. Человек открывает себя по-новому - у него повышается самооценка, обретается уверенность в себе и желание следить за своим внешним видом и физическим здоровьем, уходит страх перемен и напрасные переживания, у него появляется сильное желание развиваться и двигаться вперёд, проходит зависть к другим, разрываются токсичные отношения, человек начинает жить здесь и сейчас. Появляется новая работа, завязываются новые отношения, появляются новые увлечение. Это период всего нового и интересного. Это так же может быть очень активный и жизнерадостный период путешествий, поездок, встреч с друзьями, участия в больших общественных проектах. Человек в этот момент чувствует себя абсолютно свободным и способным на всё. Это так и есть.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
    }

    const text2 = document.createElement('p');
    text2.innerHTML = 'В минусе';
    text2.style.color = '#D2320F';
    text2.style.fontWeight = '700';
    actualPanel.appendChild(text2);

    switch (number2) {
      case 3: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(3) <span style="font-weight: 400;">Тяжёлый период в отношениях и семейной жизни, подразумевающий начало проблем между мужчиной и женщиной. Уходят взаимопонимание и взаимоуважение, а на первый план выходят упрёки и недоверие, обиды и разочарование в партнёре, ссоры и унижения. Женщина может узнать о предательстве со стороны мужчины. В этот период она может остаться одна - отношения прекратятся, а брак рухнет. Женщина может разочароваться в любви, семейной жизни и мужчинах, появятся проблемы с самооценкой и принятием своей внешности, будет казаться, что всё хорошее осталось позади, а впереди лишь одиночество и пустота. У женщины могут возникнуть недопонимания и конфликты не только с мужчиной, но и с детьми, они могут отдалиться от неё, перестать нормально общаться и воспринимать как близкого человека. Здесь же может развиваться и ситуацию, когда женщина взваливает на свои плечи мужские обязанности, начинает выполнять в семье мужские функции, забывает о своём женском начале, становится категоричной, требовательной, агрессивной, грубой  то есть она забывает, что она женщина.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 4: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(4) <span style="font-weight: 400;">Период фатальных ошибок и неудач, период, когда жизнь проверяет мужчину на прочность. Здесь проблемы могут идти одна за другой, а могут обрушиться сразу все - проблемы на работе, потеря источника дохода, предательство со стороны коллег и друзей, проблемы с физическим и психическим здоровьем, распад или кризис в семье. Это период, когда мужчина теряет уверенность в себе, оказывается неспособным обеспечить свою семью, теряет материальные блага(например, попал в аварию и сильно разбил автомобиль), теряет самого себя.В этот период как никогда важно наладить отношения с родителями, потому что эти отношения напрямую влияют на его жизнь. Например, если мужчина держит обиды на мать, то у него отсутствует желание заботиться о любой женщине. В этот период важно собраться, взять всю свою волю в кулак, прочувствовать всю силу своего духа и идти напролом вперёд, не останавливаясь из-за неудач.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 5: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(5) <span style="font-weight: 400;">Период крупных и мелких неудач. Могут возникнуть проблемы с законом, проблемы в семье - с мужем, с детьми, разладятся отношения с родителями или другими родственниками, всплывут какие-то ошибки на работе (например, во время проверки или ревизии). Будет казаться, что всё рушится. Глобально ничего трагического не произойдёт, но череда не совсем приятных инцидентов изрядно попортит нервы. Важно будет не впадать в панику, с холодной головой посмотреть на происходящее и твёрдой рукой навести порядок во всём - дома, на работе, в отношениях с другими людьми. Важно начать жить по правилам и следовать определённому порядку, не бежать впереди паровоза, не поучать других, не брать на себя много, не врать, не жить двойными стандартами. Также большое значение имеет отношение с родителями, а в особенности, с отцом. Важно принять его таким, какой он есть, простить все обиды и открыть своё сердце для любви к нему.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 6: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(6) <span style="font-weight: 400;">Неблагоприятный период, во время которого любимый человек может предать или совершить подлость; может изменить, сильно обидеть, не посчитаться с интересами и желаниями или же применить физическую силу; может ударить в самое больное место, не щадя главных ценностей и важных для человека моральных устоев. Во время этого периода очень часто происходят прекращения отношений и разводы. 
<br>Этот период также характеризуется отсутствием положительных эмоций, отсутствием желания любить и ухаживать за собой, потерей гармонии в жизни. В этот период жизненно важно следить за своим здоровьем, особенно за здоровьем сердечно-сосудистой системы. 
<br>Здесь же человек может оказаться перед трудным выбором, будет трудно принять решение, сделать шаг в ту или иную сторону. 
<br>В целом, это позитивная энергия дружбы, открытости и любви. Но чтобы обрести эту дружбу и любовь сначала предстоит пройти через предательства и разочарования, невозможно прийти к плюсу, не пройдя через минус. Здесь главное не закрывать глаза на эти предательства, не прятать голову в песок, делая вид, что всё хорошо, принять факт негатива в свою сторону, прожить это и тогда жизнь страну станет уходить в плюс.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 7: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(7) <span style="font-weight: 400;">Крайне неблагоприятный период болезней и неудач. Период, когда совершаются ошибки, принимаются неверные решения, теряется работа и уважение людей, преследуют поражения, предательства, появляются долги. Может произойти разрыв отношений с любимым человеком. В этот период можно стать жертвой насмешки, оскорбления и позора.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 8: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(8) <span style="font-weight: 400;">Период несправедливости, обмана и предательства. В этот период так же возможны противозаконные действия в Ваш адрес. Почва уходит из-под ног, нарушается стабильность и привычный образ жизни, друзья предают, любимые люди изменяют, коллеги подставляют. В этот период, главное всё это принять и переждать, а не вступать в борьбу с ветряными мельницами. Если же вы начнёте вступать в противостояние, взывать к справедливости, то только усугубите ситуацию и получите удары пострашнее тех неприятностей, которые уже произошли. Только смирение и холодная голова смогут выравнить ситуацию и обернуть минус в плюс. Воспринимайте все проблемы как испытания. Если испытания пройдены с достоинством, то жизнь возвращается в привычное русло. Если же в этих испытаниях Вы потеряли своё лицо и себя, то они продолжатся и обрушатся на Вас с новой силой.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 9: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(9) <span style="font-weight: 400;">Период болезней и одиночества. Начинаются проблемы с физическим здоровьем и здесь важно не пропустить момент, не запустить болезнь, а предпринять все меры для выздоровления. Также в этот период человек может остаться один на один со своими бедами, может остаться без работы, может лишиться семьи и поддержки родственников, может прекратить общения с друзьями. Главное, в этот период не уйти полностью в себя и не закрыться полностью от этого мира.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 10: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(10) <span style="font-weight: 400;">Отчётливая чёрная полоса в жизни. Всё валится из рук, деньги утекают как вода, предают близкие люди, не везёт ни в чем. Даже в самых незначительных бытовых мелочах происходят всякие катаклизмы и неурядицы. Создаётся ощущение, что в один день кто-то пришёл и забрал удачу. Появляется разочарование в окружающем мире и себе, агрессивность к другим людям, неуверенность в своих силах, обида на весь мир, чувство опустошенности. Также в этот период может появиться плохое окружение, которое будет оказывать значительное негативное влияние, что, в свою очередь, ещё более затянет в вопреки неудач.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 11: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(11) <span style="font-weight: 400;">Период работы на износ, физическое и моральное истощение, сильное эмоциональное выгорание, упадок сил, потеря мотивации, опустошение. Сильное разочарования в себе и своих силах, поскольку работа не приносит того результата, который хотелось бы. Работаешь и всё в пустую. На этой почве начинаются проблемы в семье, ссоры, обиды, непонимание, взаимные упрёки, проявляются негативные эмоции. Либо наоборот работа приносит результат, но всё время хочется больше - больше денег, больше недвижимости, больше власти. Человек всё больше и больше рвётся, именно уже рвётся, а не работает. Без отдыха, без расслабления. И загоняет себя в такую ситуацию, когда все заработанные блага не приносят удовольствия , так как усталость перекрывает  все остальные эмоции. При этом тоже начинаются проблемы в семье, поскольку семья его просто не видит. Нужно остановиться, вдохнуть-выдохнуть, понять, что есть вещи важнее материальных благ и что все деньги заработать невозможно.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 12: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(12) <span style="font-weight: 400;">Очень несчастливый период, в который с человеком могут происходить различные несчастные случаи, наносящие существенный вред здоровью. Это могут быть и ДТП, и разного рода травмы - переломы, ожоги, отравления. Может даже случиться замершая беременность. 
<br>Здесь же могут быть и ситуации, которые негативно влияют на эмоциональное состояние. Например, несправедливое отношение, оскорбления, предательства, обман. В этот период человек может попасть в отношения, в которых он будет выступать в роли жертвы, будет страдать морально, теперь унижения и манипуляции со стороны другого человека. Это могут быть и личные отношения, когда человек попадает в зависимость от своего избранника. Это могут быть и рабочие ситуации, при которых человек выполняет роль бесплатной рабочей силы для своего начальника. 
<br>Также этот период может быть периодом застоя, когда человек закрывается от всего нового, боится перемен и отказывается двигаться вперёд.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 13: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(13) <span style="font-weight: 400;">Достаточно тяжёлый период в жизни. Могут случиться болезненные потери и изменения, которые оставят далеко в прошлом привычную налаженную жизнь. Здесь можно столкнуться со смертью кого-то из близких людей и с этим человеком уйдёт и часть души, и часть жизни. Либо же могут произойти изменения, которые оставят лишь в воспоминаниях какие-то тёплые и душевные моменты в жизни. Например, продажа родительского дома и как следствие невозможно будет приехать туда, где прошло счастливое детство и где родители были молоды и здоровы. 
<br>В этот период может настигнуть и внутренний кризис, когда приходит осознание, что нет особых достижений и жизнь могла бы сложиться намного лучше, кажется, что уже достигнут ""потолок"" и больше не будет изменений к лучшему. Человек сталкивается с апатией, упадком сил, нежеланием вообще что-либо делать. Нет сил принять те изменения, которые преподносит жизнь. Резко падает самооценка, появляется огромное количество комплексов, ощущение беспомощности. Кажется, что никто не понимает, навязчивое чувство одиночества приводит к депрессии. Происходит переоценка взглядов и все, что раньше было важно, теряет ценность. Происходит эмоциональное выгорание и нарушается психическое здоровье. Важно понимать, что всё, что происходит, это не конец жизни, а переход на другой, более качественный уровень, не нужно замыкаться в себе и следует начать смотреть на действительность под другим углом.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 14: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(14) <span style="font-weight: 400;">Период, когда душа болит, а сердце плачет. В этот период человек может испытывать глубокие внутренние страдания, на душе катастрофически плохо. Часто это бывает вызвано развитием малоприятных событий, которые нарушают не только привычный уклад жизни, но и меняют взгляды на жизнь, опустошая при этом внутренний ресурс. В этот период ничего не мило, злят привычные вещи, нет желания ни с кем общаться.  Зачастую душевные переживания настигают человека, когда его личные представления не совпадают с тем, что происходит в реальной жизни и тогда человек попросту испытывает разочарование в этой жизни. Здесь может быть предательство любимого человека, или его смерть, когда душа разрывается от боли. Человек может начать глушить эту боль посредством алкоголя или запрещённых веществ, тем самым наносит ещё бОльший вред своей душе.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 15: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(15) <span style="font-weight: 400;">Неблагоприятный период, когда тёмная сторона души человека может дать о себе знать. Проявляются такие качества как гнев, зависть, лживость, ревность, тщеславие, эмоциональная зависимость и так далее. Человек может начать нарушать закон, занимаясь мошенничеством и воровством, ведь им движет непреодолимая тяга к деньгам. Здесь же могут появиться и различного рода зависимости - алкогольная, наркотическая, игровая. Человек может находиться в состоянии какой-то нездоровой эйфории и не может отказать себе ни в чем, так теряются большие суммы денег, начинаются долги. Чтобы покрыть долги человек впутывается в новые и новые аферы, получает деньги, снова их прогуливает, снова аферы и так по кругу.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 16: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(16) <span style="font-weight: 400;">Период регресса в жизни. Может произойти моральная деградация - человек откажется от тех моральных ценностей, которыми жил раньше, в угоду сомнительных удовольствий; его захватят негативные эмоции и качества(злость, зависть, агрессия, лицемерие, подлость). Этот период разрушения души и тела, отношений и карьеры, вся жизнь идёт под откос. Человек может остаться ни с чем. В этот период самое главное, не углубляться в темноту, суметь остановиться, достойно пройти испытания и тогда судьба сжалится. Если же человек полностью погрузится в темноту, то выйти из неё будет очень сложно, а иногда и невозможно.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 17: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(17) <span style="font-weight: 400;">Это период спада, который характеризуется состоянием подавленности и опустошения, мрачными настроениями,  унынием и тоской. У человека снижаются общительность и активность, повышается ипохондричность (преувеличение проблем со здоровьем) и мнительность, возникают неудовлетворенность текущими событиями и собой, пессимизм и скептическое отношение ко всему. Человек не может себя реализовать, сидит и сожалеет об упущенных возможностях, вспоминает прежние переломные моменты в жизни, «пережевывает» собственные неудачи. Накрывает состояние безысходности и бесполезности.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 18: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(18) <span style="font-weight: 400;">Период нахождения под влиянием плохого окружения. Это могут быть люди, которые постоянно генерируют негатив, независимо от внешних обстоятельств. Они всегда всем недовольны, им всегда все должны и все вокруг во всем виноваты. Это могут быть и обычные пессимисты, которые не могут справляться с событиями в своей жизни и сеют панику вокруг себя. Это могут быть и по-настоящему озлобленные люди, которые искренне ненавидят весь мир. А могут быть алкоголики и наркоманы. В любом случае, они излучают негативную энергетику, которая влияет на тех, кто находится с ними рядом. Начинаются проблемы со здоровьем, время тратится впустую, не получается радоваться жизни, нет движения вперёд, превращается развитие, снижается качество жизни. 
<br>Также в этот период человек подвластен сглазам и порчам, потому как подобное притягивает подобное. Человек окружён негативной энергетикой и ей притягивает всё нехорошее.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 19: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(19) <span style="font-weight: 400;">Неблагоприятный период, характеризующийся наплывом разного рода проблем: на работе, в семье, со здоровьем. Могут возникнуть большие денежные трудности, долги, большие непредвиденные расходы. Человек теряет своё прежнее положение в обществе, теряет авторитет и уважение, становится уязвимым для мнения окружающих, закрывается от людей, уходит в одиночеству. Если человек не впадает в панику, не начинает жить страхами(страх бедности, одиночества, непонимания), то этот период быстро проходит. Но если же страхи начинают есть его изнутри, то период может затянуться и закончиться непредсказуемо.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 20: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(20) <span style="font-weight: 400;">Очень тяжёлый период, во время которого испытания суждено пройти не только человеку, но и его семье. Это может быть и тяжёлая болезнь кого-то из родственников, а может быть и смерть. Либо же могут возникать серьёзные конфликты и ссоры внутри семьи, непонимание, упрёки, обиды, оскорбления. В этот период семья по каким-то причинам может отвернуться, отказаться, лишить поддержки и человек останется один, его исключат из рода. В этот период и сам человек может оказаться между жизнью и смертью (болезнь, ДТП, тяжёлая травма). В этот период вся плохая карма рода проявляется и человеку предстоит её проработать. В этот день период человек не может реализовать свои планы, случаются неприятности, которые не дают ему идти вперёд.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 21: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(21) <span style="font-weight: 400;">Этот период характеризуется трудными и болезненными для человека изменениями, которые он не хочет или не может принять, но вынужден это делать, так как именно так складываются обстоятельства, приходится переступать через себя, преодолевать, смириться. Человек выходит из зоны комфорта, где чувствовал себя относительно уверенно и спокойно. Это может быть понижение на работе, сокращение, потеря работы, вынужденный переезд в другой город, разрыв отношений и т.п. 
<br>Если человек в душе примет все эти изменения, то жизнь быстро наладится. Если же он начнёт сопротивляться, воевать, ругать эту жизнь, то период может значительно затянуться. Нужно бороться с недовольством, быть благодарным за всё, что имеешь, быть открытым для этого мира и Бога, открытым для любви.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 22: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(22) <span style="font-weight: 400;">Период ограничений и рамок. Ярко проявляются все негативные установки и представления о себе, которые препятствуют развитию и движению вперёд. ""Я не умею ладить с людьми"", ""У меня совсем нет способностей к бизнесу/пению/иностранным языкам"", ""Мне не дано…"", ""У меня ничего не получится"" и так далее. И исходя из этих убеждений строится жизнь. В этот же период человек может стать заложником каких-то обстоятельств, попасть в ситуацию, из которые кажется, что нет выхода, у человека может отсутствовать право выбора. То есть человек оказывается несвободным и неспособным действовать так, как ему хотелось бы. 
<br>Может быть и совершенно негативная ситуация, когда человек попадает в места лишения свободы или на лечение(когда эта энергия в минусе, может открыться шизофрения или иные психические расстройства, требующие помещение человека в специальные учреждения).</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
    }
  }

  if (gender === 'Ж') {
    const text = document.createElement('p');
    text.innerHTML = 'В плюсе';
    text.style.color = '#1B8909';
    text.style.fontWeight = '700';
    actualPanel.appendChild(text);

    switch (number2) {
      case 3: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(3) <span style="font-weight: 400;">Раскрытие женского предназначения и женского потенциала. Если Вы одиноки, то Вам предстоит встреча со своей второй половинкой, начнутся отношения. Если Вы уже в отношениях, то Вас ожидает развитие отношений, вступление в брак, красивая свадьба. Если Вы уже в браке, то обретёте гармонию, мир и спокойствие в семье, откроете для себя новые грани семейное жизни, обретёте взаимопонимание в случае его отсутствия, то есть Ваша семейная жизнь заиграет новыми красками. Это период, когда Вы прислушаетесь к своей женской природе и не пойдёте против неё, откроете для себя счастье материнства или хранительницы очага, создадите неповторимый уют и тепло в доме, станете первоклассной хозяйкой, понимающей и заботливой матерью, любящей и заботливой женой. Поймёте и примите всю себя такой, какая Вы есть. Начнёте вдохновлять и станете музой для противоположного пола. Станете спокойной, сбалансированный и гармоничной. Станете Женщиной во всех её проявлениях. Сумеете грамотно сочетать работу и дом. Возможно, повышение на работе, открытие своего бизнеса, увеличение дохода, расширение сфер своего влияния.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 4: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(4) <span style="font-weight: 400;">Неплохой период, в который женщина может обрести крепкое мужское плечо. Если женщина ещё не в отношениях, то встретит мужчину. Если же она в отношениях, то вполне вероятна смена партнёра. В обоих случаях женщине необходимо принять патриархальный тип отношений, при котором он - добытчик, а она - хранительница очага; стать для него музой, вдохновляющей его на подвиги, а он в ответ будет боготворить её. При таком типе отношений нет сомнений в силе, авторитете и последнем слове мужчины, нет места не уважительному отношению к нему, упрёкам, требованиям, контролю. Это отличный период для замужества. Также в этот период возможно продвижение на работе, благодаря протекции мужчины. Либо же женщина встретит свой идеал в лице мужчины-начальника и обретёт его покровительство, которое поможет ей исполнить давние желания и достичь целей, которые она не могла достичь в одиночку.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 5: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(5) <span style="font-weight: 400;">Период приятной бумажной волокиты - оформление каких-то важных документов, которые до этого долго не было возможности оформить, официальное оформление отношений, рождение детей и получение на них всех необходимых документов (свидетельство о рождении, полис, СНИЛС, оформление выплат и пособий, материнского капитала), разрешение споров в суде. Часто бывает, что всё перечисленное идёт вместе или быстро друг за другом с малыми промежутками во времени. В любом случае это хороший период, когда жизнь упорядочивается, жизнь обретает смысл и систему, всё в ней происходит поэтапно, всё налаживается. 
<br>Также в этот период открываются двери для получения нового образования, продвижения на службе, обретения уважения и новых сфер влияния.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 6: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(6) <span style="font-weight: 400;">Прекрасный период влюблённости, любви и проявления любых тёплых чувств. В этот период сердце замирает, наполняясь любовью, и бабочки летают в животе. Время романтики, цветов, подарков, праздничных мероприятий. В такие периоды случаются свадьбы, помолвки, а также любые другие мероприятия, участниками и организаторами которых выступают влюблённые люди, готовые дарить радость всем вокруг. 
<br>Также это период активной общественной деятельности, бурного дружеского общения, весёлых вечеринок до утра. 
<br>Это отличный период, чтобы начать жить в гармонии с собой, принять и полюбить себя, осознать свою ценность и значимость, заняться любимым делом, окружить себя красотой, создать уют в доме, заняться своей внешностью и обновить гардероб, добавив в него новые красивые и интересные вещи. 
<br>В целом, это позитивная энергия дружбы, открытости и любви. Но чтобы обрести эту дружбу и любовь сначала предстоит пройти через предательства и разочарования, невозможно прийти к плюсу, не пройдя через минус. Здесь главное не закрывать глаза на эти предательства, не прятать голову в песок, делая вид, что всё хорошо, принять факт негатива в свою сторону, прожить это и тогда жизнь страну станет уходить в плюс.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 7: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(7) <span style="font-weight: 400;">Благоприятный период маленьких и больших побед, успехов и достижений. Женщина может выйти замуж, и непременно очень удачно. Может пойти вверх по карьерной лестнице. Может исполнить любые давно загаданные желания. </span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 8: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(8) <span style="font-weight: 400;">Период стабильности и размерности. Жизнь сложилась, есть почва под ногами, быт налажен. Период, когда воздаётся по заслугам, когда получают награды за свои труды, когда разрешаются давние споры и конфликты, период, когда всё налаживается. Здесь возможно документальное оформление каких-то событий, например, получение гражданства или визы, разрешений на что-то. Возможно приобретение недвижимости или других крупных покупок, требующих оформления.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 9: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(9) <span style="font-weight: 400;">Период развития - интеллектуального и духовного. Период получения качественной информации извне, период изучения культуры и искусства, период определения, осмысливая и осознания происходящих вокруг событий,  период формирования нравственных идеалов и ценностей. Период анализа и познания этого мира. Период наполнения своего внутреннего мира всё новой и новой информацией, общаясь, учась, читая, смотря, слушая. Чем больше человек думает, тем лучше и эффективнее работает его мышление. В этот период надо стараться перерабатывать всю информацию, поступившую к Вам. Всё осмысливать, анализировать, сравнивать, делать выводы. То есть, применять все возможные мыслительные процессы. Этот период прекрасно подходит для развития воображения. Самый эффективный способ - мечтать и фантазировать. То есть, воображать все возможные и невозможные варианты развития событий. Но самый простой способ развития воображения - это чтение. Когда человек читает, он представляет то, о чём прочитал. То есть это период, когда человек наполняет свой внутренний мир и получает новые знания. В этот же период человек может начать делиться своими знаниями с другими, обрести единомышленников, сформировать узкий круг своих последователей. 
<br>Для женщин этот период может означать беременность, так как во время неё женщина начинает неосознанно глубже смотреть на многие вещи, закрывается в своём собственном мире, начинает иначе воспринимать этот мир.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 10: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(10) <span style="font-weight: 400;">Период чудесных радостных событий и удачных поворотов судьбы. Период, когда человек будет удачливым во всём, ему будет сопутствовать везение. Он будет легко добиваться в жизни всего, быстро достигнет желаемого, сможет избежать серьёзных опасностей и трудностей, выйдет из любых сложных жизненных ситуаций. И для всего этого ему не нужно будет прилагать больших усилий, всё уже предрешено высшими силами. Так же это период может ознаменоваться интересными путешествиями, новыми знакомствами с приятными людьми, морем положительных эмоций и незабываемых впечатлений.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 11: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(11) <span style="font-weight: 400;">Очень продуктивный и активный период в жизни, когда получаешь несоизмеримо хорошую отдачу на приложенные усилия. Сила и энергия бьют через край, человек чувствует, что может свернуть горы. Всё получается. Любая работа даётся легко, в короткие сроки выполняются большие объёмы. Если речь идёт о бизнесе, то он стремительно развивается и масштабируется. Это могут быть и колоссальные творческие успехи и приличные спортивные результаты. 
<br>Для женщины - это может быть и беременность.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 12: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(12) <span style="font-weight: 400;">Период изменений и помощи другим. Этот период характеризуется событиями, которые вполне способны изменить ход жизни человека. И здесь нет никаких ограничений по тому, какими эти события могут быть - это может быть и неожиданная беременность и прорыв в творчестве, когда человек запишет новый трек и взорвёт все чарты и музыкальные каналы. А может, человек захочет освоить новую профессию и приступит к обучению. Так же это период характеризуется активной помощью людям, здесь может быть и участие в волонтёрских движениях, и участие в благотворительных фондах, да и просто разовые пожертвования на восстановление храма или культурных достопримечательностей.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 13: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(13) <span style="font-weight: 400;">Период кардинальных изменений, когда можно и нужно перевернуть жизнь. Человек внутренне готов поменяться(он нарастил решительность, обрёл внутреннюю зрелость и способность использовать обстоятельства), а толчком к переменам станет неожиданный поворот судьбы. Не нужно смотреть на него сквозь призму недовольства, а воспользовавшись обстоятельствами, важно изменить к лучшему собственную жизнь. Здесь может быть и смена места работы, и смена сферы деятельности в целом, смена места жительства, рождение детей, смена образа жизни (например, человек перешёл на ЗОЖ, стал вегетарианцем, начал заниматься спортом и т.п.). Чтобы сделать шаг вперёд, потребуется разрушить общепринятые шаблоны и стереотипы, мешающие правила и устоявшиеся стандарты мышления. Произведя радикальные перемены в жизни, человек совершит внезапный и мощный рывок вперед.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 14: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(14) <span style="font-weight: 400;">Очень позитивный период в жизни, когда на душе светло и счастливо. Состояние полного счастья, человек доволен своей жизнью. При этом совершенно неважно, что является источником такого состояния. Для кого-то это гармония в семье, для другого – интересная работа. Каждый человек в этот период будет счастлив по-своему. 
<br>Этот период характеризуется отличным настроением, положительными эмоциями, совершенным спокойствием, умиротворением, оптимизмом, гармонией, уверенностью в себе, достижением поставленных целей.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 15: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(15) <span style="font-weight: 400;">Период материального процветания. В этот период значительно улучшается материальное состояние, получаются сверхприбыли, выигрываются лотереи, отдаются долги, приобретаются новые материальные ценности, то есть деньги нескончаемым потоком идут в руки. Меняется положение в обществе, расширяются сферы влияния, зарабатывается авторитет. Прекрасный период, чтобы научиться не впадать в зависимость от материального, научиться жить умеренно и сдержанно, начать проявлять щедрость, усилить связь с Богом и с его помощью побороть пороки и зависимости. 
</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 16: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(16) <span style="font-weight: 400;">Период внутренних изменений. В этот период происходит изменение восприятия реальности, меняются привычные взгляды на жизнь. ""Человек способен изменить свою жизнь, меняя всего лишь свою точку зрения"" (с) Дж. Вильямс. Это выражение как нельзя лучше описывает данный период жизни. 
<br>В этот период человек не боится бросить вызов самому себе, например, путешествовать в одиночку, переехать в новую страну или избавиться от какой-то зависимости. Он отказывается от старых правил и устанавливает новые, которые устраивают именно его. Меняются приоритеты - то, что было интересно в прошлом году, уже не актуально сейчас. Человек начинает одеваться для комфорта, а не для того, чтобы произвести впечатление. Больше не покупает вещи, которые не нужны, только потому, что они модные. 
<br>Жизнь больше не воспринимается, как чёрное и белое. Прекращается осуждение других людей, так как приходит понимание, что это их жизнь и их опыт. Человек понимает, что для него важно и сосредотачивается именно на этом. Не зацикливается и не зависит от соцсетей. Человек приходит к пониманию того, что сам несёт ответственность за свою жизнь и свою судьбу.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 17: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(17) <span style="font-weight: 400;">Период реализации всех способностей человека. Человек становится востребованным, высокооплачиваемым и успешным,  развивается, совершенствуется, обходит всех конкурентов, начинает буквально блистать среди своих коллег. Он достигает небывалых высот, становится эффектным и ярким, его становится невозможно не заметить. Он в центре внимания, о нём говорят, к его мнению прислушиваются, на него хотят быть похожим, он становится примером для многих. Это период подъёма, роста, развития, прогресса. Обретается гармония с окружающим миром и со своим внутренним «Я».</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 18: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(18) <span style="font-weight: 400;">Период смены окружения. На смену пессимистам и токсичным людям придут успешные и позитивно настроенные. За счёт энергетического обмена с ними и поддержки с их стороны будет происходить совершенствование и развитие. Общение с ними принесёт неоспоримую пользу в достижении целей и улучшит качество жизни. 
<br>В этот период также может произойти и смена мышления - с негативного на позитивное; либо же человек может уйти в творчество, стать ближе к искусству, увлечься модой.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 19: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(19) <span style="font-weight: 400;">Период успеха и благоприятных изменений в жизни. Человек добивается поставленных перед собой целей, доволен всеми своими достижениями, морально удовлетворён своим положением в обществе. Здесь он может получить новую интересную и высокооплачиваемую работу, о которой давно мечтал. Либо же может получить более высокую должность там, где уже работает. В любом случае, это увеличение материального достатка и материальных благ, обретение финансовой свободы, процветание, повышение социального статуса. 
<br>Человек становится способным вдохновлять и мотивировать окружающих, становится авторитетным лидером, способным заставить других следовать за ним.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 20: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(20) <span style="font-weight: 400;">Благоприятный период, связанный с приятными хлопотами в семье либо же переездом в другую страну. В семье происходят события, которые сплачивают её членов, приносят радость и счастье. Например, рождение детей. Возможно, приезд родственников, с которыми очень давно не виделись. Либо появляется тот, кого считали пропавшим. Здесь же может случиться и переезд в другую страну, знакомство и брак с иностранцем, работа в другой стране, либо же просто путешествия. 
<br>Могут открыться новые возможности в творчестве и работе, которые принесут популярность (работа на телевидении, блог эксперта, начало своего бизнеса).</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 21: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(21) <span style="font-weight: 400;">В первую очередь в этот период может произойти переезд. Это может быть переезд из одного жилья в другое, может быть переезд из одного города в другой, а может быть и переезд в другую страну. Но определённо меняется привычное место жительства. Также этот период может быть связан с появлением новых людей в окружении, новые встречи, знакомства, связи, новое общение. Жизнь меняется, выходит на иной уровень. Появляется новая работа, открываются новые возможности. В этот период происходит развитие в человеке уверенности в себе, в своих способностях, в своем потенциале и в важности своих действий и решений, чтобы положительно влиять на свою жизнь.
<br>Это период положительных изменений и движения вперёд.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 22: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(22) <span style="font-weight: 400;">Период начала новой жизни, когда все переживания и проблемы остаются в старой. Человек открывает себя по-новому - у него повышается самооценка, обретается уверенность в себе и желание следить за своим внешним видом и физическим здоровьем, уходит страх перемен и напрасные переживания, у него появляется сильное желание развиваться и двигаться вперёд, проходит зависть к другим, разрываются токсичные отношения, человек начинает жить здесь и сейчас. Появляется новая работа, завязываются новые отношения, появляются новые увлечение. Это период всего нового и интересного. Это так же может быть очень активный и жизнерадостный период путешествий, поездок, встреч с друзьями, участия в больших общественных проектах. Человек в этот момент чувствует себя абсолютно свободным и способным на всё. Это так и есть.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
    }

    const text2 = document.createElement('p');
    text2.innerHTML = 'В минусе';
    text2.style.color = '#D2320F';
    text2.style.fontWeight = '700';
    actualPanel.appendChild(text2);

    switch (number2) {
      case 3: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(3) <span style="font-weight: 400;">Тяжёлый период в отношениях и семейной жизни, подразумевающий начало проблем между мужчиной и женщиной. Уходят взаимопонимание и взаимоуважение, а на первый план выходят упрёки и недоверие, обиды и разочарование в партнёре, ссоры и унижения. Женщина может узнать о предательстве со стороны мужчины. В этот период она может остаться одна - отношения прекратятся, а брак рухнет. Женщина может разочароваться в любви, семейной жизни и мужчинах, появятся проблемы с самооценкой и принятием своей внешности, будет казаться, что всё хорошее осталось позади, а впереди лишь одиночество и пустота. У женщины могут возникнуть недопонимания и конфликты не только с мужчиной, но и с детьми, они могут отдалиться от неё, перестать нормально общаться и воспринимать как близкого человека. Здесь же может развиваться и ситуацию, когда женщина взваливает на свои плечи мужские обязанности, начинает выполнять в семье мужские функции, забывает о своём женском начале, становится категоричной, требовательной, агрессивной, грубой  то есть она забывает, что она женщина.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 4: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(4) <span style="font-weight: 400;">Период, когда женщина остаётся без мужской поддержки. Здесь может быть и то, что мужчина в прямом смысле уходит и оставляет женщину одну. Либо же он начинает вести двойную жизнь, изменяя ей. Либо же мужчина номинально есть, но не может стать опорой для женщины, поскольку является слишком мягкотелым, слабохарактерным, безответственным, у него отсутствуют цели и какие-либо амбиции, он не может материально обеспечить женщину, позаботиться о ней и детях. Либо женщина вступает в отношения с мужчиной, но при этом не может открыто рассказать о нём, поскольку он, к примеру, женат, либо занимает какую-то должность и связь с ней может скомпрометировать его. В этот период женщине важно не терять связь с отцом, при проблемах в общении с ним, постараться их устранить, простить обиды и начать общаться с ним, как с одним из самых близких людей. 
<br>Также несмотря на все трудности в отношениях с мужчинами, женщине в этот период важно не потерять уважение и доверие к мужскому полу, не потерять своё женское начало, не исключать возможность счастливых и гармоничных отношений с мужчинами.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 5: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(5) <span style="font-weight: 400;">Период крупных и мелких неудач. Могут возникнуть проблемы с законом, проблемы в семье - с мужем, с детьми, разладятся отношения с родителями или другими родственниками, всплывут какие-то ошибки на работе (например, во время проверки или ревизии). Будет казаться, что всё рушится. Глобально ничего трагического не произойдёт, но череда не совсем приятных инцидентов изрядно попортит нервы. Важно будет не впадать в панику, с холодной головой посмотреть на происходящее и твёрдой рукой навести порядок во всём - дома, на работе, в отношениях с другими людьми. Важно начать жить по правилам и следовать определённому порядку, не бежать впереди паровоза, не поучать других, не брать на себя много, не врать, не жить двойными стандартами. Также большое значение имеет отношение с родителями, а в особенности, с отцом. Важно принять его таким, какой он есть, простить все обиды и открыть своё сердце для любви к нему.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 6: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(6) <span style="font-weight: 400;">Неблагоприятный период, во время которого любимый человек может предать или совершить подлость; может изменить, сильно обидеть, не посчитаться с интересами и желаниями или же применить физическую силу; может ударить в самое больное место, не щадя главных ценностей и важных для человека моральных устоев. Во время этого периода очень часто происходят прекращения отношений и разводы. 
<br>Этот период также характеризуется отсутствием положительных эмоций, отсутствием желания любить и ухаживать за собой, потерей гармонии в жизни. В этот период жизненно важно следить за своим здоровьем, особенно за здоровьем сердечно-сосудистой системы. 
<br>Здесь же человек может оказаться перед трудным выбором, будет трудно принять решение, сделать шаг в ту или иную сторону. 
<br>В целом, это позитивная энергия дружбы, открытости и любви. Но чтобы обрести эту дружбу и любовь сначала предстоит пройти через предательства и разочарования, невозможно прийти к плюсу, не пройдя через минус. Здесь главное не закрывать глаза на эти предательства, не прятать голову в песок, делая вид, что всё хорошо, принять факт негатива в свою сторону, прожить это и тогда жизнь страну станет уходить в плюс.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 7: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(7) <span style="font-weight: 400;">Крайне неблагоприятный период болезней и неудач. Период, когда совершаются ошибки, принимаются неверные решения, теряется работа и уважение людей, преследуют поражения, предательства, появляются долги. Может произойти разрыв отношений с любимым человеком. В этот период можно стать жертвой насмешки, оскорбления и позора.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 8: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(8) <span style="font-weight: 400;">Период несправедливости, обмана и предательства. В этот период так же возможны противозаконные действия в Ваш адрес. Почва уходит из-под ног, нарушается стабильность и привычный образ жизни, друзья предают, любимые люди изменяют, коллеги подставляют. В этот период, главное всё это принять и переждать, а не вступать в борьбу с ветряными мельницами. Если же вы начнёте вступать в противостояние, взывать к справедливости, то только усугубите ситуацию и получите удары пострашнее тех неприятностей, которые уже произошли. Только смирение и холодная голова смогут выравнить ситуацию и обернуть минус в плюс. Воспринимайте все проблемы как испытания. Если испытания пройдены с достоинством, то жизнь возвращается в привычное русло. Если же в этих испытаниях Вы потеряли своё лицо и себя, то они продолжатся и обрушатся на Вас с новой силой.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 9: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(9) <span style="font-weight: 400;">Период болезней и одиночества. Начинаются проблемы с физическим здоровьем и здесь важно не пропустить момент, не запустить болезнь, а предпринять все меры для выздоровления. Также в этот период человек может остаться один на один со своими бедами, может остаться без работы, может лишиться семьи и поддержки родственников, может прекратить общения с друзьями. Главное, в этот период не уйти полностью в себя и не закрыться полностью от этого мира. </span>
`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 10: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(10) <span style="font-weight: 400;">Отчётливая чёрная полоса в жизни. Всё валится из рук, деньги утекают как вода, предают близкие люди, не везёт ни в чем. Даже в самых незначительных бытовых мелочах происходят всякие катаклизмы и неурядицы. Создаётся ощущение, что в один день кто-то пришёл и забрал удачу. Появляется разочарование в окружающем мире и себе, агрессивность к другим людям, неуверенность в своих силах, обида на весь мир, чувство опустошенности. Также в этот период может появиться плохое окружение, которое будет оказывать значительное негативное влияние, что, в свою очередь, ещё более затянет в вопреки неудач.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 11: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(11) <span style="font-weight: 400;">Период работы на износ, физическое и моральное истощение, сильное эмоциональное выгорание, упадок сил, потеря мотивации, опустошение. Сильное разочарования в себе и своих силах, поскольку работа не приносит того результата, который хотелось бы. Работаешь и всё в пустую. На этой почве начинаются проблемы в семье, ссоры, обиды, непонимание, взаимные упрёки, проявляются негативные эмоции. Либо наоборот работа приносит результат, но всё время хочется больше - больше денег, больше недвижимости, больше власти. Человек всё больше и больше рвётся, именно уже рвётся, а не работает. Без отдыха, без расслабления. И загоняет себя в такую ситуацию, когда все заработанные блага не приносят удовольствия , так как усталость перекрывает  все остальные эмоции. При этом тоже начинаются проблемы в семье, поскольку семья его просто не видит. Нужно остановиться, вдохнуть-выдохнуть, понять, что есть вещи важнее материальных благ и что все деньги заработать невозможно.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 12: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(12) <span style="font-weight: 400;">Очень несчастливый период, в который с человеком могут происходить различные несчастные случаи, наносящие существенный вред здоровью. Это могут быть и ДТП, и разного рода травмы - переломы, ожоги, отравления. Может даже случиться замершая беременность. 
<br>Здесь же могут быть и ситуации, которые негативно влияют на эмоциональное состояние. Например, несправедливое отношение, оскорбления, предательства, обман. В этот период человек может попасть в отношения, в которых он будет выступать в роли жертвы, будет страдать морально, теперь унижения и манипуляции со стороны другого человека. Это могут быть и личные отношения, когда человек попадает в зависимость от своего избранника. Это могут быть и рабочие ситуации, при которых человек выполняет роль бесплатной рабочей силы для своего начальника. 
<br>Также этот период может быть периодом застоя, когда человек закрывается от всего нового, боится перемен и отказывается двигаться вперёд.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 13: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(13) <span style="font-weight: 400;">Достаточно тяжёлый период в жизни. Могут случиться болезненные потери и изменения, которые оставят далеко в прошлом привычную налаженную жизнь. Здесь можно столкнуться со смертью кого-то из близких людей и с этим человеком уйдёт и часть души, и часть жизни. Либо же могут произойти изменения, которые оставят лишь в воспоминаниях какие-то тёплые и душевные моменты в жизни. Например, продажа родительского дома и как следствие невозможно будет приехать туда, где прошло счастливое детство и где родители были молоды и здоровы. 
<br>В этот период может настигнуть и внутренний кризис, когда приходит осознание, что нет особых достижений и жизнь могла бы сложиться намного лучше, кажется, что уже достигнут ""потолок"" и больше не будет изменений к лучшему. Человек сталкивается с апатией, упадком сил, нежеланием вообще что-либо делать. Нет сил принять те изменения, которые преподносит жизнь. Резко падает самооценка, появляется огромное количество комплексов, ощущение беспомощности. Кажется, что никто не понимает, навязчивое чувство одиночества приводит к депрессии. Происходит переоценка взглядов и все, что раньше было важно, теряет ценность. Происходит эмоциональное выгорание и нарушается психическое здоровье. Важно понимать, что всё, что происходит, это не конец жизни, а переход на другой, более качественный уровень, не нужно замыкаться в себе и следует начать смотреть на действительность под другим углом.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 14: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(14) <span style="font-weight: 400;">Период, когда душа болит, а сердце плачет. В этот период человек может испытывать глубокие внутренние страдания, на душе катастрофически плохо. Часто это бывает вызвано развитием малоприятных событий, которые нарушают не только привычный уклад жизни, но и меняют взгляды на жизнь, опустошая при этом внутренний ресурс. В этот период ничего не мило, злят привычные вещи, нет желания ни с кем общаться.  Зачастую душевные переживания настигают человека, когда его личные представления не совпадают с тем, что происходит в реальной жизни и тогда человек попросту испытывает разочарование в этой жизни. Здесь может быть предательство любимого человека, или его смерть, когда душа разрывается от боли. Человек может начать глушить эту боль посредством алкоголя или запрещённых веществ, тем самым наносит ещё бОльший вред своей душе.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 15: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(15) <span style="font-weight: 400;">Неблагоприятный период, когда тёмная сторона души человека может дать о себе знать. Проявляются такие качества как гнев, зависть, лживость, ревность, тщеславие, эмоциональная зависимость и так далее. Человек может начать нарушать закон, занимаясь мошенничеством и воровством, ведь им движет непреодолимая тяга к деньгам. Здесь же могут появиться и различного рода зависимости - алкогольная, наркотическая, игровая. Человек может находиться в состоянии какой-то нездоровой эйфории и не может отказать себе ни в чем, так теряются большие суммы денег, начинаются долги. Чтобы покрыть долги человек впутывается в новые и новые аферы, получает деньги, снова их прогуливает, снова аферы и так по кругу. </span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 16: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(16) <span style="font-weight: 400;">Период регресса в жизни. Может произойти моральная деградация - человек откажется от тех моральных ценностей, которыми жил раньше, в угоду сомнительных удовольствий; его захватят негативные эмоции и качества(злость, зависть, агрессия, лицемерие, подлость). Этот период разрушения души и тела, отношений и карьеры, вся жизнь идёт под откос. Человек может остаться ни с чем. В этот период самое главное, не углубляться в темноту, суметь остановиться, достойно пройти испытания и тогда судьба сжалится. Если же человек полностью погрузится в темноту, то выйти из неё будет очень сложно, а иногда и невозможно.</span>`;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 17: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(17) <span style="font-weight: 400;">Это период спада, который характеризуется состоянием подавленности и опустошения, мрачными настроениями,  унынием и тоской. У человека снижаются общительность и активность, повышается ипохондричность (преувеличение проблем со здоровьем) и мнительность, возникают неудовлетворенность текущими событиями и собой, пессимизм и скептическое отношение ко всему. Человек не может себя реализовать, сидит и сожалеет об упущенных возможностях, вспоминает прежние переломные моменты в жизни, «пережевывает» собственные неудачи. Накрывает состояние безысходности и бесполезности.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 18: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(18) <span style="font-weight: 400;">Период нахождения под влиянием плохого окружения. Это могут быть люди, которые постоянно генерируют негатив, независимо от внешних обстоятельств. Они всегда всем недовольны, им всегда все должны и все вокруг во всем виноваты. Это могут быть и обычные пессимисты, которые не могут справляться с событиями в своей жизни и сеют панику вокруг себя. Это могут быть и по-настоящему озлобленные люди, которые искренне ненавидят весь мир. А могут быть алкоголики и наркоманы. В любом случае, они излучают негативную энергетику, которая влияет на тех, кто находится с ними рядом. Начинаются проблемы со здоровьем, время тратится впустую, не получается радоваться жизни, нет движения вперёд, превращается развитие, снижается качество жизни. 
<br>Также в этот период человек подвластен сглазам и порчам, потому как подобное притягивает подобное. Человек окружён негативной энергетикой и ей притягивает всё нехорошее.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 19: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(19) <span style="font-weight: 400;">Неблагоприятный период, характеризующийся наплывом разного рода проблем: на работе, в семье, со здоровьем. Могут возникнуть большие денежные трудности, долги, большие непредвиденные расходы. Человек теряет своё прежнее положение в обществе, теряет авторитет и уважение, становится уязвимым для мнения окружающих, закрывается от людей, уходит в одиночеству. Если человек не впадает в панику, не начинает жить страхами(страх бедности, одиночества, непонимания), то этот период быстро проходит. Но если же страхи начинают есть его изнутри, то период может затянуться и закончиться непредсказуемо.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 20: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(20) <span style="font-weight: 400;">Очень тяжёлый период, во время которого испытания суждено пройти не только человеку, но и его семье. Это может быть и тяжёлая болезнь кого-то из родственников, а может быть и смерть. Либо же могут возникать серьёзные конфликты и ссоры внутри семьи, непонимание, упрёки, обиды, оскорбления. В этот период семья по каким-то причинам может отвернуться, отказаться, лишить поддержки и человек останется один, его исключат из рода. В этот период и сам человек может оказаться между жизнью и смертью (болезнь, ДТП, тяжёлая травма). В этот период вся плохая карма рода проявляется и человеку предстоит её проработать. В этот день период человек не может реализовать свои планы, случаются неприятности, которые не дают ему идти вперёд.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 21: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(21) <span style="font-weight: 400;">Этот период характеризуется трудными и болезненными для человека изменениями, которые он не хочет или не может принять, но вынужден это делать, так как именно так складываются обстоятельства, приходится переступать через себя, преодолевать, смириться. Человек выходит из зоны комфорта, где чувствовал себя относительно уверенно и спокойно. Это может быть понижение на работе, сокращение, потеря работы, вынужденный переезд в другой город, разрыв отношений и т.п. 
<br>Если человек в душе примет все эти изменения, то жизнь быстро наладится. Если же он начнёт сопротивляться, воевать, ругать эту жизнь, то период может значительно затянуться. Нужно бороться с недовольством, быть благодарным за всё, что имеешь, быть открытым для этого мира и Бога, открытым для любви.</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
      case 22: {
        let paragraph = document.createElement('p');

        paragraph.innerHTML = `(22) <span style="font-weight: 400;">Период ограничений и рамок. Ярко проявляются все негативные установки и представления о себе, которые препятствуют развитию и движению вперёд. ""Я не умею ладить с людьми"", ""У меня совсем нет способностей к бизнесу/пению/иностранным языкам"", ""Мне не дано…"", ""У меня ничего не получится"" и так далее. И исходя из этих убеждений строится жизнь. В этот же период человек может стать заложником каких-то обстоятельств, попасть в ситуацию, из которые кажется, что нет выхода, у человека может отсутствовать право выбора. То есть человек оказывается несвободным и неспособным действовать так, как ему хотелось бы. 
<br>Может быть и совершенно негативная ситуация, когда человек попадает в места лишения свободы или на лечение(когда эта энергия в минусе, может открыться шизофрения или иные психические расстройства, требующие помещение человека в специальные учреждения).</span> `;
        actualPanel.appendChild(paragraph);
        break;
      }
    }
  }
}


