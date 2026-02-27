const dateActual = new Date().getFullYear();
const birthdayActual = localStorage['date'];

const AElement = document.querySelector('#A');
const A1Element = document.querySelector('#A1');
const A2Element = document.querySelector('#A2');

const childrenNumbers = new Set([parseInt(AElement.textContent), parseInt(A1Element.textContent), parseInt(A2Element.textContent)]);

function getBase64Image(img) {
  let canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  let ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  return canvas.toDataURL("image/png");
}


let mainImage = new Image();
let mainImageBase64;

mainImage.onload = function () {
  mainImageBase64 = getBase64Image(this);
}

mainImage.crossOrigin = "anonymous";
mainImage.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/logo.jpg';


let personalImage = new Image();
let personalImageBase64;

personalImage.onload = function () {
  personalImageBase64 = getBase64Image(this);
}

personalImage.crossOrigin = "anonymous";
personalImage.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/personal.jpg';


let talentsImage = new Image();
let talentsImageBase64;

talentsImage.onload = function () {
  talentsImageBase64 = getBase64Image(this);
}

talentsImage.crossOrigin = "anonymous";
talentsImage.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents.jpg';


let purposeImage = new Image();
let purposeImageBase64;

purposeImage.onload = function () {
  purposeImageBase64 = getBase64Image(this);
}

purposeImage.crossOrigin = "anonymous";
purposeImage.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/purpose.jpg';


let pastImage = new Image();
let pastImageBase64;

pastImage.onload = function () {
  pastImageBase64 = getBase64Image(this);
}

pastImage.crossOrigin = "anonymous";
pastImage.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past.jpg';


let healthImage = new Image();
let healthImageBase64;

healthImage.onload = function () {
  healthImageBase64 = getBase64Image(this);
}

healthImage.crossOrigin = "anonymous";
healthImage.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/health.jpg';


let testsImage = new Image();
let testsImageBase64;

testsImage.onload = function () {
  testsImageBase64 = getBase64Image(this);
}

testsImage.crossOrigin = "anonymous";
testsImage.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests.jpg';

let lovesImage = new Image();
let lovesImageBase64;

lovesImage.onload = function () {
  lovesImageBase64 = getBase64Image(this);
}

lovesImage.crossOrigin = "anonymous";
lovesImage.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/loves.jpg';


let yearsImage = new Image();
let yearsImageBase64;

yearsImage.onload = function () {
  yearsImageBase64 = getBase64Image(this);
}

yearsImage.crossOrigin = "anonymous";
yearsImage.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/years.jpg';


let moneyImage = new Image();
let moneyImageBase64;

moneyImage.onload = function () {
  moneyImageBase64 = getBase64Image(this);
}

moneyImage.crossOrigin = "anonymous";
moneyImage.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money.jpg';


let parentsImage = new Image();
let parentsImageBase64;

parentsImage.onload = function () {
  parentsImageBase64 = getBase64Image(this);
}

parentsImage.crossOrigin = "anonymous";
parentsImage.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/parents.jpg';


let childrenImage = new Image();
let childrenImageBase64;

childrenImage.onload = function () {
  childrenImageBase64 = getBase64Image(this);
}

childrenImage.crossOrigin = "anonymous";
childrenImage.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children.jpg';


let managementImage = new Image();
let managementImageBase64;

managementImage.onload = function () {
  managementImageBase64 = getBase64Image(this);
}

managementImage.crossOrigin = "anonymous";
managementImage.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/management.jpg';


let personalSuper3Image = new Image();
let personalSuper3Base64;

personalSuper3Image.onload = function () {
  personalSuper3Base64 = getBase64Image(this);
}

personalSuper3Image.crossOrigin = "anonymous";
personalSuper3Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/superpower/3.jpg';


let personalSuper4Image = new Image();
let personalSuper4Base64;

personalSuper4Image.onload = function () {
  personalSuper4Base64 = getBase64Image(this);
}

personalSuper4Image.crossOrigin = "anonymous";
personalSuper4Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/superpower/4.jpg';


let personalSuper5Image = new Image();
let personalSuper5Base64;

personalSuper5Image.onload = function () {
  personalSuper5Base64 = getBase64Image(this);
}

personalSuper5Image.crossOrigin = "anonymous";
personalSuper5Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/superpower/5.jpg';


let personalSuper6Image = new Image();
let personalSuper6Base64;

personalSuper6Image.onload = function () {
  personalSuper6Base64 = getBase64Image(this);
}

personalSuper6Image.crossOrigin = "anonymous";
personalSuper6Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/superpower/6.jpg';


let personalSuper7Image = new Image();
let personalSuper7Base64;

personalSuper7Image.onload = function () {
  personalSuper7Base64 = getBase64Image(this);
}

personalSuper7Image.crossOrigin = "anonymous";
personalSuper7Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/superpower/7.jpg';


let personalSuper8Image = new Image();
let personalSuper8Base64;

personalSuper8Image.onload = function () {
  personalSuper8Base64 = getBase64Image(this);
}

personalSuper8Image.crossOrigin = "anonymous";
personalSuper8Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/superpower/8.jpg';


let personalSuper9Image = new Image();
let personalSuper9Base64;

personalSuper9Image.onload = function () {
  personalSuper9Base64 = getBase64Image(this);
}

personalSuper9Image.crossOrigin = "anonymous";
personalSuper9Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/superpower/9.jpg';


let personalSuper10Image = new Image();
let personalSuper10Base64;

personalSuper10Image.onload = function () {
  personalSuper10Base64 = getBase64Image(this);
}

personalSuper10Image.crossOrigin = "anonymous";
personalSuper10Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/superpower/10.jpg';


let personalSuper11Image = new Image();
let personalSuper11Base64;

personalSuper11Image.onload = function () {
  personalSuper11Base64 = getBase64Image(this);
}

personalSuper11Image.crossOrigin = "anonymous";
personalSuper11Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/superpower/11.jpg';


let personalSuper12Image = new Image();
let personalSuper12Base64;

personalSuper12Image.onload = function () {
  personalSuper12Base64 = getBase64Image(this);
}

personalSuper12Image.crossOrigin = "anonymous";
personalSuper12Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/superpower/12.jpg';


let personalSuper13Image = new Image();
let personalSuper13Base64;

personalSuper13Image.onload = function () {
  personalSuper13Base64 = getBase64Image(this);
}

personalSuper13Image.crossOrigin = "anonymous";
personalSuper13Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/superpower/13.jpg';


let personalSuper14Image = new Image();
let personalSuper14Base64;

personalSuper14Image.onload = function () {
  personalSuper14Base64 = getBase64Image(this);
}

personalSuper14Image.crossOrigin = "anonymous";
personalSuper14Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/superpower/14.jpg';


let personalSuper15Image = new Image();
let personalSuper15Base64;

personalSuper15Image.onload = function () {
  personalSuper15Base64 = getBase64Image(this);
}

personalSuper15Image.crossOrigin = "anonymous";
personalSuper15Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/superpower/15.jpg';


let personalSuper16Image = new Image();
let personalSuper16Base64;

personalSuper16Image.onload = function () {
  personalSuper16Base64 = getBase64Image(this);
}

personalSuper16Image.crossOrigin = "anonymous";
personalSuper16Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/superpower/16.jpg';


let personalSuper17Image = new Image();
let personalSuper17Base64;

personalSuper17Image.onload = function () {
  personalSuper17Base64 = getBase64Image(this);
}

personalSuper17Image.crossOrigin = "anonymous";
personalSuper17Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/superpower/17.jpg';


let personalSuper18Image = new Image();
let personalSuper18Base64;

personalSuper18Image.onload = function () {
  personalSuper18Base64 = getBase64Image(this);
}

personalSuper18Image.crossOrigin = "anonymous";
personalSuper18Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/superpower/18.jpg';


let personalSuper19Image = new Image();
let personalSuper19Base64;

personalSuper19Image.onload = function () {
  personalSuper19Base64 = getBase64Image(this);
}

personalSuper19Image.crossOrigin = "anonymous";
personalSuper19Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/superpower/19.jpg';


let personalSuper20Image = new Image();
let personalSuper20Base64;

personalSuper20Image.onload = function () {
  personalSuper20Base64 = getBase64Image(this);
}

personalSuper20Image.crossOrigin = "anonymous";
personalSuper20Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/superpower/20.jpg';


let personalSuper21Image = new Image();
let personalSuper21Base64;

personalSuper21Image.onload = function () {
  personalSuper21Base64 = getBase64Image(this);
}

personalSuper21Image.crossOrigin = "anonymous";
personalSuper21Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/superpower/21.jpg';


let personalSuper22Image = new Image();
let personalSuper22Base64;

personalSuper22Image.onload = function () {
  personalSuper22Base64 = getBase64Image(this);
}

personalSuper22Image.crossOrigin = "anonymous";
personalSuper22Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/superpower/22.jpg';


let tests1Image = new Image();
let tests1ImageBase64;

tests1Image.onload = function () {
  tests1ImageBase64 = getBase64Image(this);
}

tests1Image.crossOrigin = "anonymous";
tests1Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/1.jpg';


let tests2Image = new Image();
let tests2ImageBase64;

tests2Image.onload = function () {
  tests2ImageBase64 = getBase64Image(this);
}

tests2Image.crossOrigin = "anonymous";
tests2Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/2.jpg';


let tests3Image = new Image();
let tests3ImageBase64;

tests3Image.onload = function () {
  tests3ImageBase64 = getBase64Image(this);
}

tests3Image.crossOrigin = "anonymous";
tests3Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/3.jpg';


let tests4Image = new Image();
let tests4ImageBase64;

tests4Image.onload = function () {
  tests4ImageBase64 = getBase64Image(this);
}

tests4Image.crossOrigin = "anonymous";
tests4Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/4.jpg';


let tests5Image = new Image();
let tests5ImageBase64;

tests5Image.onload = function () {
  tests5ImageBase64 = getBase64Image(this);
}

tests5Image.crossOrigin = "anonymous";
tests5Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/5.jpg';


let tests6Image = new Image();
let tests6ImageBase64;

tests6Image.onload = function () {
  tests6ImageBase64 = getBase64Image(this);
}

tests6Image.crossOrigin = "anonymous";
tests6Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/6.jpg';


let tests7Image = new Image();
let tests7ImageBase64;

tests7Image.onload = function () {
  tests7ImageBase64 = getBase64Image(this);
}

tests7Image.crossOrigin = "anonymous";
tests7Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/7.jpg';


let tests8Image = new Image();
let tests8ImageBase64;

tests8Image.onload = function () {
  tests8ImageBase64 = getBase64Image(this);
}

tests8Image.crossOrigin = "anonymous";
tests8Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/8.jpg';


let tests9Image = new Image();
let tests9ImageBase64;

tests9Image.onload = function () {
  tests9ImageBase64 = getBase64Image(this);
}

tests9Image.crossOrigin = "anonymous";
tests9Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/9.jpg';


let tests10Image = new Image();
let tests10ImageBase64;

tests10Image.onload = function () {
  tests10ImageBase64 = getBase64Image(this);
}

tests10Image.crossOrigin = "anonymous";
tests10Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/10.jpg';


let tests11Image = new Image();
let tests11ImageBase64;

tests11Image.onload = function () {
  tests11ImageBase64 = getBase64Image(this);
}

tests11Image.crossOrigin = "anonymous";
tests11Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/11.jpg';


let tests12Image = new Image();
let tests12ImageBase64;

tests12Image.onload = function () {
  tests12ImageBase64 = getBase64Image(this);
}

tests12Image.crossOrigin = "anonymous";
tests12Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/12.jpg';


let tests13Image = new Image();
let tests13ImageBase64;

tests13Image.onload = function () {
  tests13ImageBase64 = getBase64Image(this);
}

tests13Image.crossOrigin = "anonymous";
tests13Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/13.jpg';


let tests14Image = new Image();
let tests14ImageBase64;

tests14Image.onload = function () {
  tests14ImageBase64 = getBase64Image(this);
}

tests14Image.crossOrigin = "anonymous";
tests14Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/14.jpg';


let tests15Image = new Image();
let tests15ImageBase64;

tests15Image.onload = function () {
  tests15ImageBase64 = getBase64Image(this);
}

tests15Image.crossOrigin = "anonymous";
tests15Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/15.jpg';


let tests16Image = new Image();
let tests16ImageBase64;

tests16Image.onload = function () {
  tests16ImageBase64 = getBase64Image(this);
}

tests16Image.crossOrigin = "anonymous";
tests16Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/16.jpg';


let tests17Image = new Image();
let tests17ImageBase64;

tests17Image.onload = function () {
  tests17ImageBase64 = getBase64Image(this);
}

tests17Image.crossOrigin = "anonymous";
tests17Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/17.jpg';


let tests18Image = new Image();
let tests18ImageBase64;

tests18Image.onload = function () {
  tests18ImageBase64 = getBase64Image(this);
}

tests18Image.crossOrigin = "anonymous";
tests18Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/18.jpg';


let tests19Image = new Image();
let tests19ImageBase64;

tests19Image.onload = function () {
  tests19ImageBase64 = getBase64Image(this);
}

tests19Image.crossOrigin = "anonymous";
tests19Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/19.jpg';


let tests20Image = new Image();
let tests20ImageBase64;

tests20Image.onload = function () {
  tests20ImageBase64 = getBase64Image(this);
}

tests20Image.crossOrigin = "anonymous";
tests20Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/20.jpg';


let tests21Image = new Image();
let tests21ImageBase64;

tests21Image.onload = function () {
  tests21ImageBase64 = getBase64Image(this);
}

tests21Image.crossOrigin = "anonymous";
tests21Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/21.jpg';


let tests22Image = new Image();
let tests22ImageBase64;

tests22Image.onload = function () {
  tests22ImageBase64 = getBase64Image(this);
}

tests22Image.crossOrigin = "anonymous";
tests22Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/tests/22.jpg';


let children1Image = new Image();
let children1ImageBase64;

children1Image.onload = function () {
  children1ImageBase64 = getBase64Image(this);
}

children1Image.crossOrigin = "anonymous";
children1Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/1.jpg';


let children2Image = new Image();
let children2ImageBase64;

children2Image.onload = function () {
  children2ImageBase64 = getBase64Image(this);
}

children2Image.crossOrigin = "anonymous";
children2Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/2.jpg';


let children3Image = new Image();
let children3ImageBase64;

children3Image.onload = function () {
  children3ImageBase64 = getBase64Image(this);
}

children3Image.crossOrigin = "anonymous";
children3Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/3.jpg';


let children4Image = new Image();
let children4ImageBase64;

children4Image.onload = function () {
  children4ImageBase64 = getBase64Image(this);
}

children4Image.crossOrigin = "anonymous";
children4Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/4.jpg';


let children5Image = new Image();
let children5ImageBase64;

children5Image.onload = function () {
  children5ImageBase64 = getBase64Image(this);
}

children5Image.crossOrigin = "anonymous";
children5Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/5.jpg';


let children6Image = new Image();
let children6ImageBase64;

children6Image.onload = function () {
  children6ImageBase64 = getBase64Image(this);
}

children6Image.crossOrigin = "anonymous";
children6Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/6.jpg';


let children7Image = new Image();
let children7ImageBase64;

children7Image.onload = function () {
  children7ImageBase64 = getBase64Image(this);
}

children7Image.crossOrigin = "anonymous";
children7Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/7.jpg';


let children8Image = new Image();
let children8ImageBase64;

children8Image.onload = function () {
  children8ImageBase64 = getBase64Image(this);
}

children8Image.crossOrigin = "anonymous";
children8Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/8.jpg';


let children9Image = new Image();
let children9ImageBase64;

children9Image.onload = function () {
  children9ImageBase64 = getBase64Image(this);
}

children9Image.crossOrigin = "anonymous";
children9Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/9.jpg';


let children10Image = new Image();
let children10ImageBase64;

children10Image.onload = function () {
  children10ImageBase64 = getBase64Image(this);
}

children10Image.crossOrigin = "anonymous";
children10Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/10.jpg';


let children11Image = new Image();
let children11ImageBase64;

children11Image.onload = function () {
  children11ImageBase64 = getBase64Image(this);
}

children11Image.crossOrigin = "anonymous";
children11Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/11.jpg';


let children12Image = new Image();
let children12ImageBase64;

children12Image.onload = function () {
  children12ImageBase64 = getBase64Image(this);
}

children12Image.crossOrigin = "anonymous";
children12Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/12.jpg';


let children13Image = new Image();
let children13ImageBase64;

children13Image.onload = function () {
  children13ImageBase64 = getBase64Image(this);
}

children13Image.crossOrigin = "anonymous";
children13Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/13.jpg';


let children14Image = new Image();
let children14ImageBase64;

children14Image.onload = function () {
  children14ImageBase64 = getBase64Image(this);
}

children14Image.crossOrigin = "anonymous";
children14Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/14.jpg';


let children15Image = new Image();
let children15ImageBase64;

children15Image.onload = function () {
  children15ImageBase64 = getBase64Image(this);
}

children15Image.crossOrigin = "anonymous";
children15Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/15.jpg';


let children16Image = new Image();
let children16ImageBase64;

children16Image.onload = function () {
  children16ImageBase64 = getBase64Image(this);
}

children16Image.crossOrigin = "anonymous";
children16Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/16.jpg';


let children17Image = new Image();
let children17ImageBase64;

children17Image.onload = function () {
  children17ImageBase64 = getBase64Image(this);
}

children17Image.crossOrigin = "anonymous";
children17Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/17.jpg';


let children18Image = new Image();
let children18ImageBase64;

children18Image.onload = function () {
  children18ImageBase64 = getBase64Image(this);
}

children18Image.crossOrigin = "anonymous";
children18Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/18.jpg';


let children19Image = new Image();
let children19ImageBase64;

children19Image.onload = function () {
  children19ImageBase64 = getBase64Image(this);
}

children19Image.crossOrigin = "anonymous";
children19Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/19.jpg';


let children20Image = new Image();
let children20ImageBase64;

children20Image.onload = function () {
  children20ImageBase64 = getBase64Image(this);
}

children20Image.crossOrigin = "anonymous";
children20Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/20.jpg';


let children21Image = new Image();
let children21ImageBase64;

children21Image.onload = function () {
  children21ImageBase64 = getBase64Image(this);
}

children21Image.crossOrigin = "anonymous";
children21Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/21.jpg';


let children22Image = new Image();
let children22ImageBase64;

children22Image.onload = function () {
  children22ImageBase64 = getBase64Image(this);
}

children22Image.crossOrigin = "anonymous";
children22Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/children/22.jpg';


let past1Image = new Image();
let past1ImageBase64;

past1Image.onload = function () {
  past1ImageBase64 = getBase64Image(this);
}

past1Image.crossOrigin = "anonymous";
past1Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/1.jpg';


let past2Image = new Image();
let past2ImageBase64;

past2Image.onload = function () {
  past2ImageBase64 = getBase64Image(this);
}

past2Image.crossOrigin = "anonymous";
past2Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/2.jpg';


let past3Image = new Image();
let past3ImageBase64;

past3Image.onload = function () {
  past3ImageBase64 = getBase64Image(this);
}

past3Image.crossOrigin = "anonymous";
past3Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/3.jpg';


let past4Image = new Image();
let past4ImageBase64;

past4Image.onload = function () {
  past4ImageBase64 = getBase64Image(this);
}

past4Image.crossOrigin = "anonymous";
past4Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/4.jpg';


let past5Image = new Image();
let past5ImageBase64;

past5Image.onload = function () {
  past5ImageBase64 = getBase64Image(this);
}

past5Image.crossOrigin = "anonymous";
past5Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/5.jpg';


let past6Image = new Image();
let past6ImageBase64;

past6Image.onload = function () {
  past6ImageBase64 = getBase64Image(this);
}

past6Image.crossOrigin = "anonymous";
past6Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/6.jpg';


let past7Image = new Image();
let past7ImageBase64;

past7Image.onload = function () {
  past7ImageBase64 = getBase64Image(this);
}

past7Image.crossOrigin = "anonymous";
past7Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/7.jpg';


let past8Image = new Image();
let past8ImageBase64;

past8Image.onload = function () {
  past8ImageBase64 = getBase64Image(this);
}

past8Image.crossOrigin = "anonymous";
past8Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/8.jpg';


let past9Image = new Image();
let past9ImageBase64;

past9Image.onload = function () {
  past9ImageBase64 = getBase64Image(this);
}

past9Image.crossOrigin = "anonymous";
past9Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/9.jpg';


let past10Image = new Image();
let past10ImageBase64;

past10Image.onload = function () {
  past10ImageBase64 = getBase64Image(this);
}

past10Image.crossOrigin = "anonymous";
past10Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/10.jpg';


let past11Image = new Image();
let past11ImageBase64;

past11Image.onload = function () {
  past11ImageBase64 = getBase64Image(this);
}

past11Image.crossOrigin = "anonymous";
past11Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/11.jpg';


let past12Image = new Image();
let past12ImageBase64;

past12Image.onload = function () {
  past12ImageBase64 = getBase64Image(this);
}

past12Image.crossOrigin = "anonymous";
past12Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/12.jpg';


let past13Image = new Image();
let past13ImageBase64;

past13Image.onload = function () {
  past13ImageBase64 = getBase64Image(this);
}

past13Image.crossOrigin = "anonymous";
past13Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/13.jpg';


let past14Image = new Image();
let past14ImageBase64;

past14Image.onload = function () {
  past14ImageBase64 = getBase64Image(this);
}

past14Image.crossOrigin = "anonymous";
past14Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/14.jpg';


let past15Image = new Image();
let past15ImageBase64;

past15Image.onload = function () {
  past15ImageBase64 = getBase64Image(this);
}

past15Image.crossOrigin = "anonymous";
past15Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/15.jpg';


let past16Image = new Image();
let past16ImageBase64;

past16Image.onload = function () {
  past16ImageBase64 = getBase64Image(this);
}

past16Image.crossOrigin = "anonymous";
past16Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/16.jpg';


let past17Image = new Image();
let past17ImageBase64;

past17Image.onload = function () {
  past17ImageBase64 = getBase64Image(this);
}

past17Image.crossOrigin = "anonymous";
past17Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/17.jpg';


let past18Image = new Image();
let past18ImageBase64;

past18Image.onload = function () {
  past18ImageBase64 = getBase64Image(this);
}

past18Image.crossOrigin = "anonymous";
past18Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/18.jpg';


let past19Image = new Image();
let past19ImageBase64;

past19Image.onload = function () {
  past19ImageBase64 = getBase64Image(this);
}

past19Image.crossOrigin = "anonymous";
past19Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/19.jpg';


let past20Image = new Image();
let past20ImageBase64;

past20Image.onload = function () {
  past20ImageBase64 = getBase64Image(this);
}

past20Image.crossOrigin = "anonymous";
past20Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/20.jpg';


let past21Image = new Image();
let past21ImageBase64;

past21Image.onload = function () {
  past21ImageBase64 = getBase64Image(this);
}

past21Image.crossOrigin = "anonymous";
past21Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/21.jpg';


let past22Image = new Image();
let past22ImageBase64;

past22Image.onload = function () {
  past22ImageBase64 = getBase64Image(this);
}

past22Image.crossOrigin = "anonymous";
past22Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/22.jpg';


let past23Image = new Image();
let past23ImageBase64;

past23Image.onload = function () {
  past23ImageBase64 = getBase64Image(this);
}

past23Image.crossOrigin = "anonymous";
past23Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/23.jpg';


let past24Image = new Image();
let past24ImageBase64;

past24Image.onload = function () {
  past24ImageBase64 = getBase64Image(this);
}

past24Image.crossOrigin = "anonymous";
past24Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/past/24.jpg';


let zone1Image = new Image();
let zone1ImageBase64;

zone1Image.onload = function () {
  zone1ImageBase64 = getBase64Image(this);
}

zone1Image.crossOrigin = "anonymous";
zone1Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/1.jpg';


let zone2Image = new Image();
let zone2ImageBase64;

zone2Image.onload = function () {
  zone2ImageBase64 = getBase64Image(this);
}

zone2Image.crossOrigin = "anonymous";
zone2Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/2.jpg';


let zone3Image = new Image();
let zone3ImageBase64;

zone3Image.onload = function () {
  zone3ImageBase64 = getBase64Image(this);
}

zone3Image.crossOrigin = "anonymous";
zone3Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/3.jpg';


let zone4Image = new Image();
let zone4ImageBase64;

zone4Image.onload = function () {
  zone4ImageBase64 = getBase64Image(this);
}

zone4Image.crossOrigin = "anonymous";
zone4Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/4.jpg';


let zone5Image = new Image();
let zone5ImageBase64;

zone5Image.onload = function () {
  zone5ImageBase64 = getBase64Image(this);
}

zone5Image.crossOrigin = "anonymous";
zone5Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/5.jpg';


let zone6Image = new Image();
let zone6ImageBase64;

zone6Image.onload = function () {
  zone6ImageBase64 = getBase64Image(this);
}

zone6Image.crossOrigin = "anonymous";
zone6Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/6.jpg';


let zone7Image = new Image();
let zone7ImageBase64;

zone7Image.onload = function () {
  zone7ImageBase64 = getBase64Image(this);
}

zone7Image.crossOrigin = "anonymous";
zone7Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/7.jpg';


let zone8Image = new Image();
let zone8ImageBase64;

zone8Image.onload = function () {
  zone8ImageBase64 = getBase64Image(this);
}

zone8Image.crossOrigin = "anonymous";
zone8Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/8.jpg';


let zone9Image = new Image();
let zone9ImageBase64;

zone9Image.onload = function () {
  zone9ImageBase64 = getBase64Image(this);
}

zone9Image.crossOrigin = "anonymous";
zone9Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/9.jpg';


let zone10Image = new Image();
let zone10ImageBase64;

zone10Image.onload = function () {
  zone10ImageBase64 = getBase64Image(this);
}

zone10Image.crossOrigin = "anonymous";
zone10Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/10.jpg';


let zone11Image = new Image();
let zone11ImageBase64;

zone11Image.onload = function () {
  zone11ImageBase64 = getBase64Image(this);
}

zone11Image.crossOrigin = "anonymous";
zone11Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/11.jpg';


let zone12Image = new Image();
let zone12ImageBase64;

zone12Image.onload = function () {
  zone12ImageBase64 = getBase64Image(this);
}

zone12Image.crossOrigin = "anonymous";
zone12Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/12.jpg';


let zone13Image = new Image();
let zone13ImageBase64;

zone13Image.onload = function () {
  zone13ImageBase64 = getBase64Image(this);
}

zone13Image.crossOrigin = "anonymous";
zone13Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/13.jpg';


let zone14Image = new Image();
let zone14ImageBase64;

zone14Image.onload = function () {
  zone14ImageBase64 = getBase64Image(this);
}

zone14Image.crossOrigin = "anonymous";
zone14Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/14.jpg';


let zone15Image = new Image();
let zone15ImageBase64;

zone15Image.onload = function () {
  zone15ImageBase64 = getBase64Image(this);
}

zone15Image.crossOrigin = "anonymous";
zone15Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/15.jpg';


let zone16Image = new Image();
let zone16ImageBase64;

zone16Image.onload = function () {
  zone16ImageBase64 = getBase64Image(this);
}

zone16Image.crossOrigin = "anonymous";
zone16Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/16.jpg';


let zone17Image = new Image();
let zone17ImageBase64;

zone17Image.onload = function () {
  zone17ImageBase64 = getBase64Image(this);
}

zone17Image.crossOrigin = "anonymous";
zone17Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/17.jpg';


let zone18Image = new Image();
let zone18ImageBase64;

zone18Image.onload = function () {
  zone18ImageBase64 = getBase64Image(this);
}

zone18Image.crossOrigin = "anonymous";
zone18Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/18.jpg';


let zone19Image = new Image();
let zone19ImageBase64;

zone19Image.onload = function () {
  zone19ImageBase64 = getBase64Image(this);
}

zone19Image.crossOrigin = "anonymous";
zone19Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/19.jpg';


let zone20Image = new Image();
let zone20ImageBase64;

zone20Image.onload = function () {
  zone20ImageBase64 = getBase64Image(this);
}

zone20Image.crossOrigin = "anonymous";
zone20Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/20.jpg';


let zone21Image = new Image();
let zone21ImageBase64;

zone21Image.onload = function () {
  zone21ImageBase64 = getBase64Image(this);
}

zone21Image.crossOrigin = "anonymous";
zone21Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/21.jpg';


let zone22Image = new Image();
let zone22ImageBase64;

zone22Image.onload = function () {
  zone22ImageBase64 = getBase64Image(this);
}

zone22Image.crossOrigin = "anonymous";
zone22Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/zone/22.jpg';


let money2Image = new Image();
let money2ImageBase64;

money2Image.onload = function () {
  money2ImageBase64 = getBase64Image(this);
}

money2Image.crossOrigin = "anonymous";
money2Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money/2.jpg';


let money3Image = new Image();
let money3ImageBase64;

money3Image.onload = function () {
  money3ImageBase64 = getBase64Image(this);
}

money3Image.crossOrigin = "anonymous";
money3Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money/3.jpg';


let money4Image = new Image();
let money4ImageBase64;

money4Image.onload = function () {
  money4ImageBase64 = getBase64Image(this);
}

money4Image.crossOrigin = "anonymous";
money4Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money/4.jpg';


let money5Image = new Image();
let money5ImageBase64;

money5Image.onload = function () {
  money5ImageBase64 = getBase64Image(this);
}

money5Image.crossOrigin = "anonymous";
money5Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money/5.jpg';


let money6Image = new Image();
let money6ImageBase64;

money6Image.onload = function () {
  money6ImageBase64 = getBase64Image(this);
}

money6Image.crossOrigin = "anonymous";
money6Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money/6.jpg';


let money7Image = new Image();
let money7ImageBase64;

money7Image.onload = function () {
  money7ImageBase64 = getBase64Image(this);
}

money7Image.crossOrigin = "anonymous";
money7Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money/7.jpg';


let money8Image = new Image();
let money8ImageBase64;

money8Image.onload = function () {
  money8ImageBase64 = getBase64Image(this);
}

money8Image.crossOrigin = "anonymous";
money8Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money/8.jpg';


let money9Image = new Image();
let money9ImageBase64;

money9Image.onload = function () {
  money9ImageBase64 = getBase64Image(this);
}

money9Image.crossOrigin = "anonymous";
money9Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money/9.jpg';


let money10Image = new Image();
let money10ImageBase64;

money10Image.onload = function () {
  money10ImageBase64 = getBase64Image(this);
}

money10Image.crossOrigin = "anonymous";
money10Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money/10.jpg';


let money11Image = new Image();
let money11ImageBase64;

money11Image.onload = function () {
  money11ImageBase64 = getBase64Image(this);
}

money11Image.crossOrigin = "anonymous";
money11Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money/11.jpg';


let money12Image = new Image();
let money12ImageBase64;

money12Image.onload = function () {
  money12ImageBase64 = getBase64Image(this);
}

money12Image.crossOrigin = "anonymous";
money12Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money/12.jpg';


let money13Image = new Image();
let money13ImageBase64;

money13Image.onload = function () {
  money13ImageBase64 = getBase64Image(this);
}

money13Image.crossOrigin = "anonymous";
money13Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money/13.jpg';


let money14Image = new Image();
let money14ImageBase64;

money14Image.onload = function () {
  money14ImageBase64 = getBase64Image(this);
}

money14Image.crossOrigin = "anonymous";
money14Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money/14.jpg';


let money15Image = new Image();
let money15ImageBase64;

money15Image.onload = function () {
  money15ImageBase64 = getBase64Image(this);
}

money15Image.crossOrigin = "anonymous";
money15Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money/15.jpg';


let money16Image = new Image();
let money16ImageBase64;

money16Image.onload = function () {
  money16ImageBase64 = getBase64Image(this);
}

money16Image.crossOrigin = "anonymous";
money16Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money/16.jpg';


let money17Image = new Image();
let money17ImageBase64;

money17Image.onload = function () {
  money17ImageBase64 = getBase64Image(this);
}

money17Image.crossOrigin = "anonymous";
money17Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money/17.jpg';


let money18Image = new Image();
let money18ImageBase64;

money18Image.onload = function () {
  money18ImageBase64 = getBase64Image(this);
}

money18Image.crossOrigin = "anonymous";
money18Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money/18.jpg';


let money19Image = new Image();
let money19ImageBase64;

money19Image.onload = function () {
  money19ImageBase64 = getBase64Image(this);
}

money19Image.crossOrigin = "anonymous";
money19Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money/19.jpg';


let money20Image = new Image();
let money20ImageBase64;

money20Image.onload = function () {
  money20ImageBase64 = getBase64Image(this);
}

money20Image.crossOrigin = "anonymous";
money20Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money/20.jpg';


let money21Image = new Image();
let money21ImageBase64;

money21Image.onload = function () {
  money21ImageBase64 = getBase64Image(this);
}

money21Image.crossOrigin = "anonymous";
money21Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money/21.jpg';


let money22Image = new Image();
let money22ImageBase64;

money22Image.onload = function () {
  money22ImageBase64 = getBase64Image(this);
}

money22Image.crossOrigin = "anonymous";
money22Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/money/22.jpg';


let work1Image = new Image();
let work1ImageBase64;

work1Image.onload = function () {
  work1ImageBase64 = getBase64Image(this);
}

work1Image.crossOrigin = "anonymous";
work1Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/1.jpg';


let work2Image = new Image();
let work2ImageBase64;

work2Image.onload = function () {
  work2ImageBase64 = getBase64Image(this);
}

work2Image.crossOrigin = "anonymous";
work2Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/2.jpg';


let work3Image = new Image();
let work3ImageBase64;

work3Image.onload = function () {
  work3ImageBase64 = getBase64Image(this);
}

work3Image.crossOrigin = "anonymous";
work3Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/3.jpg';


let work4Image = new Image();
let work4ImageBase64;

work4Image.onload = function () {
  work4ImageBase64 = getBase64Image(this);
}

work4Image.crossOrigin = "anonymous";
work4Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/4.jpg';


let work5Image = new Image();
let work5ImageBase64;

work5Image.onload = function () {
  work5ImageBase64 = getBase64Image(this);
}

work5Image.crossOrigin = "anonymous";
work5Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/5.jpg';


let work6Image = new Image();
let work6ImageBase64;

work6Image.onload = function () {
  work6ImageBase64 = getBase64Image(this);
}

work6Image.crossOrigin = "anonymous";
work6Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/6.jpg';


let work7Image = new Image();
let work7ImageBase64;

work7Image.onload = function () {
  work7ImageBase64 = getBase64Image(this);
}

work7Image.crossOrigin = "anonymous";
work7Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/7.jpg';


let work8Image = new Image();
let work8ImageBase64;

work8Image.onload = function () {
  work8ImageBase64 = getBase64Image(this);
}

work8Image.crossOrigin = "anonymous";
work8Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/8.jpg';


let work9Image = new Image();
let work9ImageBase64;

work9Image.onload = function () {
  work9ImageBase64 = getBase64Image(this);
}

work9Image.crossOrigin = "anonymous";
work9Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/9.jpg';


let work10Image = new Image();
let work10ImageBase64;

work10Image.onload = function () {
  work10ImageBase64 = getBase64Image(this);
}

work10Image.crossOrigin = "anonymous";
work10Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/10.jpg';


let work11Image = new Image();
let work11ImageBase64;

work11Image.onload = function () {
  work11ImageBase64 = getBase64Image(this);
}

work11Image.crossOrigin = "anonymous";
work11Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/11.jpg';


let work12Image = new Image();
let work12ImageBase64;

work12Image.onload = function () {
  work12ImageBase64 = getBase64Image(this);
}

work12Image.crossOrigin = "anonymous";
work12Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/12.jpg';


let work13Image = new Image();
let work13ImageBase64;

work13Image.onload = function () {
  work13ImageBase64 = getBase64Image(this);
}

work13Image.crossOrigin = "anonymous";
work13Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/13.jpg';


let work14Image = new Image();
let work14ImageBase64;

work14Image.onload = function () {
  work14ImageBase64 = getBase64Image(this);
}

work14Image.crossOrigin = "anonymous";
work14Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/14.jpg';


let work15Image = new Image();
let work15ImageBase64;

work15Image.onload = function () {
  work15ImageBase64 = getBase64Image(this);
}

work15Image.crossOrigin = "anonymous";
work15Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/15.jpg';


let work16Image = new Image();
let work16ImageBase64;

work16Image.onload = function () {
  work16ImageBase64 = getBase64Image(this);
}

work16Image.crossOrigin = "anonymous";
work16Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/16.jpg';


let work17Image = new Image();
let work17ImageBase64;

work17Image.onload = function () {
  work17ImageBase64 = getBase64Image(this);
}

work17Image.crossOrigin = "anonymous";
work17Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/17.jpg';


let work18Image = new Image();
let work18ImageBase64;

work18Image.onload = function () {
  work18ImageBase64 = getBase64Image(this);
}

work18Image.crossOrigin = "anonymous";
work18Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/18.jpg';


let work19Image = new Image();
let work19ImageBase64;

work19Image.onload = function () {
  work19ImageBase64 = getBase64Image(this);
}

work19Image.crossOrigin = "anonymous";
work19Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/19.jpg';


let work20Image = new Image();
let work20ImageBase64;

work20Image.onload = function () {
  work20ImageBase64 = getBase64Image(this);
}

work20Image.crossOrigin = "anonymous";
work20Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/20.jpg';


let work21Image = new Image();
let work21ImageBase64;

work21Image.onload = function () {
  work21ImageBase64 = getBase64Image(this);
}

work21Image.crossOrigin = "anonymous";
work21Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/21.jpg';


let work22Image = new Image();
let work22ImageBase64;

work22Image.onload = function () {
  work22ImageBase64 = getBase64Image(this);
}

work22Image.crossOrigin = "anonymous";
work22Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/work/22.jpg';


let talents1Image = new Image();
let talents1ImageBase64;

talents1Image.onload = function () {
  talents1ImageBase64 = getBase64Image(this);
}

talents1Image.crossOrigin = "anonymous";
talents1Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/1.jpg';


let talents2Image = new Image();
let talents2ImageBase64;

talents2Image.onload = function () {
  talents2ImageBase64 = getBase64Image(this);
}

talents2Image.crossOrigin = "anonymous";
talents2Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/2.jpg';


let talents3Image = new Image();
let talents3ImageBase64;

talents3Image.onload = function () {
  talents3ImageBase64 = getBase64Image(this);
}

talents3Image.crossOrigin = "anonymous";
talents3Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/3.jpg';


let talents4Image = new Image();
let talents4ImageBase64;

talents4Image.onload = function () {
  talents4ImageBase64 = getBase64Image(this);
}

talents4Image.crossOrigin = "anonymous";
talents4Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/4.jpg';


let talents5Image = new Image();
let talents5ImageBase64;

talents5Image.onload = function () {
  talents5ImageBase64 = getBase64Image(this);
}

talents5Image.crossOrigin = "anonymous";
talents5Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/5.jpg';


let talents6Image = new Image();
let talents6ImageBase64;

talents6Image.onload = function () {
  talents6ImageBase64 = getBase64Image(this);
}

talents6Image.crossOrigin = "anonymous";
talents6Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/6.jpg';


let talents7Image = new Image();
let talents7ImageBase64;

talents7Image.onload = function () {
  talents7ImageBase64 = getBase64Image(this);
}

talents7Image.crossOrigin = "anonymous";
talents7Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/7.jpg';


let talents8Image = new Image();
let talents8ImageBase64;

talents8Image.onload = function () {
  talents8ImageBase64 = getBase64Image(this);
}

talents8Image.crossOrigin = "anonymous";
talents8Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/8.jpg';


let talents9Image = new Image();
let talents9ImageBase64;

talents9Image.onload = function () {
  talents9ImageBase64 = getBase64Image(this);
}

talents9Image.crossOrigin = "anonymous";
talents9Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/9.jpg';


let talents10Image = new Image();
let talents10ImageBase64;

talents10Image.onload = function () {
  talents10ImageBase64 = getBase64Image(this);
}

talents10Image.crossOrigin = "anonymous";
talents10Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/10.jpg';


let talents11Image = new Image();
let talents11ImageBase64;

talents11Image.onload = function () {
  talents11ImageBase64 = getBase64Image(this);
}

talents11Image.crossOrigin = "anonymous";
talents11Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/11.jpg';


let talents12Image = new Image();
let talents12ImageBase64;

talents12Image.onload = function () {
  talents12ImageBase64 = getBase64Image(this);
}

talents12Image.crossOrigin = "anonymous";
talents12Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/12.jpg';


let talents13Image = new Image();
let talents13ImageBase64;

talents13Image.onload = function () {
  talents13ImageBase64 = getBase64Image(this);
}

talents13Image.crossOrigin = "anonymous";
talents13Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/13.jpg';


let talents14Image = new Image();
let talents14ImageBase64;

talents14Image.onload = function () {
  talents14ImageBase64 = getBase64Image(this);
}

talents14Image.crossOrigin = "anonymous";
talents14Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/14.jpg';


let talents15Image = new Image();
let talents15ImageBase64;

talents15Image.onload = function () {
  talents15ImageBase64 = getBase64Image(this);
}

talents15Image.crossOrigin = "anonymous";
talents15Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/15.jpg';


let talents16Image = new Image();
let talents16ImageBase64;

talents16Image.onload = function () {
  talents16ImageBase64 = getBase64Image(this);
}

talents16Image.crossOrigin = "anonymous";
talents16Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/16.jpg';


let talents17Image = new Image();
let talents17ImageBase64;

talents17Image.onload = function () {
  talents17ImageBase64 = getBase64Image(this);
}

talents17Image.crossOrigin = "anonymous";
talents17Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/17.jpg';


let talents18Image = new Image();
let talents18ImageBase64;

talents18Image.onload = function () {
  talents18ImageBase64 = getBase64Image(this);
}

talents18Image.crossOrigin = "anonymous";
talents18Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/18.jpg';


let talents19Image = new Image();
let talents19ImageBase64;

talents19Image.onload = function () {
  talents19ImageBase64 = getBase64Image(this);
}

talents19Image.crossOrigin = "anonymous";
talents19Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/19.jpg';


let talents20Image = new Image();
let talents20ImageBase64;

talents20Image.onload = function () {
  talents20ImageBase64 = getBase64Image(this);
}

talents20Image.crossOrigin = "anonymous";
talents20Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/20.jpg';


let talents21Image = new Image();
let talents21ImageBase64;

talents21Image.onload = function () {
  talents21ImageBase64 = getBase64Image(this);
}

talents21Image.crossOrigin = "anonymous";
talents21Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/21.jpg';


let talents22Image = new Image();
let talents22ImageBase64;

talents22Image.onload = function () {
  talents22ImageBase64 = getBase64Image(this);
}

talents22Image.crossOrigin = "anonymous";
talents22Image.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/talents/22.jpg';


let ageNumberActual = dateActual - parseInt(birthdayActual.split('.')[2]);

let ageText = `Прогноз на год ${ageNumberActual}-${ageNumberActual + 1}`;

const headerClick = document.querySelector('.title-calculate');

const personalPanelContent = document.querySelectorAll('#personal_panel p');
let personalArray = Array.from(personalPanelContent);
let personalArrayTexts = [];

const talentsPanelContent = document.querySelectorAll('#talents_panel p');
let talentsArray = Array.from(talentsPanelContent);
let talentsArrayTexts = [];

const purposePanelContent = document.querySelectorAll('#purpose_panel p');
let purposeArray = Array.from(purposePanelContent);
let purposeArrayTexts = [];

const moneyPanelContent = document.querySelectorAll('#money_panel p');
let moneyArray = Array.from(moneyPanelContent);
let moneyArrayTexts = [];

const pastLivesPanelContent = document.querySelectorAll('#past_lives_panel p');
let pastLivesArray = Array.from(pastLivesPanelContent);
let pastLivesArrayTexts = [];

const parentsPanelContent = document.querySelectorAll('#parents_panel p');
let parentsArray = Array.from(parentsPanelContent);
let parentsArrayTexts = [];

const childrenPanelContent = document.querySelectorAll('#children_panel p');
let childrenArray = Array.from(childrenPanelContent);
let childrenArrayTexts = [];

const lovesPanelContent = document.querySelectorAll('#love_panel p');
let lovesArray = Array.from(lovesPanelContent);
let lovesArrayTexts = [];

const healthPanelContent = document.querySelectorAll('#health_panel p');
let healthArray = Array.from(healthPanelContent);
let healthArrayTexts = [];

const managementPanelContent = document.querySelectorAll('#management_panel p');
let managementArray = Array.from(managementPanelContent);
let managementArrayTexts = [];

const testsPanelContent = document.querySelectorAll('#tests_panel p');
let testsArray = Array.from(testsPanelContent);
let testsArrayTexts = [];

const yearsPanelContent = document.querySelectorAll('#years_panel p');
let yearsArray = Array.from(yearsPanelContent);
let yearsArrayTexts = [];



function arrayContentCreate(array, textArray) {
  for (let i = 0; i < array.length; i++) {
    let obj = {
      text: array[i].textContent,
      fontSize: 14,
      margin: [0, 0, 0, 20],
    }

    textArray.push(obj);
  }
}



function arrayContentHealthCreate(array, textArray) {
  for (let i = 0; i < array.length; i++) {
    let obj = {
      text: array[i].textContent,
      fontSize: 14,
      margin: [0, 0, 0, 20],
    }

    textArray.push(obj);
  }
}



arrayContentCreate(purposeArray, purposeArrayTexts);
arrayContentCreate(parentsArray, parentsArrayTexts);
arrayContentCreate(lovesArray, lovesArrayTexts);
arrayContentHealthCreate(healthArray, healthArrayTexts);
arrayContentCreate(managementArray, managementArrayTexts);
arrayContentCreate(yearsArray, yearsArrayTexts);



window.onload = function () {
  function arrayContentPersonalCreate(array, textArray) {
    let superpower = document.querySelector('#X');

    for (let i = 0; i < array.length; i++) {
      if (i === array.length - 1) {
        let obj;

        switch (parseInt(superpower.textContent)) {
          case 3: {
            obj = {
              image: personalSuper3Base64,
              width: 500,
            }
            break;
          }
          case 4: {
            obj = {
              image: personalSuper4Base64,
              width: 500,
            }
            break;
          }
          case 5: {
            obj = {
              image: personalSuper5Base64,
              width: 500,
            }
            break;
          }
          case 6: {
            obj = {
              image: personalSuper6Base64,
              width: 500,
            }
            break;
          }
          case 7: {
            obj = {
              image: personalSuper7Base64,
              width: 500,
            }
            break;
          }
          case 8: {
            obj = {
              image: personalSuper8Base64,
              width: 500,
            }
            break;
          }
          case 9: {
            obj = {
              image: personalSuper9Base64,
              width: 500,
            }
            break;
          }
          case 10: {
            obj = {
              image: personalSuper10Base64,
              width: 500,
            }
            break;
          }
          case 11: {
            obj = {
              image: personalSuper11Base64,
              width: 500,
            }
            break;
          }
          case 12: {
            obj = {
              image: personalSuper12Base64,
              width: 500,
            }
            break;
          }
          case 13: {
            obj = {
              image: personalSuper13Base64,
              width: 500,
            }
            break;
          }
          case 14: {
            obj = {
              image: personalSuper14Base64,
              width: 500,
            }
            break;
          }
          case 15: {
            obj = {
              image: personalSuper15Base64,
              width: 500,
            }
            break;
          }
          case 16: {
            obj = {
              image: personalSuper16Base64,
              width: 500,
            }
            break;
          }
          case 17: {
            obj = {
              image: personalSuper17Base64,
              width: 500,
            }
            break;
          }
          case 18: {
            obj = {
              image: personalSuper18Base64,
              width: 500,
            }
            break;
          }
          case 19: {
            obj = {
              image: personalSuper19Base64,
              width: 500,
            }
            break;
          }
          case 20: {
            obj = {
              image: personalSuper20Base64,
              width: 500,
            }
            break;
          }
          case 21: {
            obj = {
              image: personalSuper21Base64,
              width: 500,
            }
            break;
          }
          case 22: {
            obj = {
              image: personalSuper22Base64,
              width: 500,
            }
            break;
          }
        }

        textArray.push(obj)
      }

      if (i === array.length - 2) {
        let obj;

        switch (parseInt(superpower.textContent)) {
          case 1: {
            obj = {
              image: zone1ImageBase64,
              width: 500,
            }
            break;
          }
          case 2: {
            obj = {
              image: zone2ImageBase64,
              width: 500,
            }
            break;
          }
          case 3: {
            obj = {
              image: zone3ImageBase64,
              width: 500,
            }
            break;
          }
          case 4: {
            obj = {
              image: zone4ImageBase64,
              width: 500,
            }
            break;
          }
          case 5: {
            obj = {
              image: zone5ImageBase64,
              width: 500,
            }
            break;
          }
          case 6: {
            obj = {
              image: zone6ImageBase64,
              width: 500,
            }
            break;
          }
          case 7: {
            obj = {
              image: zone7ImageBase64,
              width: 500,
            }
            break;
          }
          case 8: {
            obj = {
              image: zone8ImageBase64,
              width: 500,
            }
            break;
          }
          case 9: {
            obj = {
              image: zone9ImageBase64,
              width: 500,
            }
            break;
          }
          case 10: {
            obj = {
              image: zone10ImageBase64,
              width: 500,
            }
            break;
          }
          case 11: {
            obj = {
              image: zone11ImageBase64,
              width: 500,
            }
            break;
          }
          case 12: {
            obj = {
              image: zone12ImageBase64,
              width: 500,
            }
            break;
          }
          case 13: {
            obj = {
              image: zone13ImageBase64,
              width: 500,
            }
            break;
          }
          case 14: {
            obj = {
              image: zone14ImageBase64,
              width: 500,
            }
            break;
          }
          case 15: {
            obj = {
              image: zone15ImageBase64,
              width: 500,
            }
            break;
          }
          case 16: {
            obj = {
              image: zone16ImageBase64,
              width: 500,
            }
            break;
          }
          case 17: {
            obj = {
              image: zone17ImageBase64,
              width: 500,
            }
            break;
          }
          case 18: {
            obj = {
              image: zone18ImageBase64,
              width: 500,
            }
            break;
          }
          case 19: {
            obj = {
              image: zone19ImageBase64,
              width: 500,
            }
            break;
          }
          case 20: {
            obj = {
              image: zone20ImageBase64,
              width: 500,
            }
            break;
          }
          case 21: {
            obj = {
              image: zone21ImageBase64,
              width: 500,
            }
            break;
          }
          case 22: {
            obj = {
              image: zone22ImageBase64,
              width: 500,
            }
            break;
          }
        }

        textArray.push(obj)
      }

      if (i !== array.length - 1) {

        let obj = {
          text: array[i].textContent,
          fontSize: 14,
          margin: [0, 0, 0, 20],
        }

        textArray.push(obj);
      }
    }
  }

  function arrayContentTestsCreate(array, textArray) {
    let superpower = document.querySelector('#X');

    for (let i = 0; i < array.length; i++) {
      let obj;

      switch (parseInt(superpower.textContent)) {
        case 1: {
          obj = {
            image: tests1ImageBase64,
            width: 500,
          }
          break;
        }
        case 2: {
          obj = {
            image: tests2ImageBase64,
            width: 500,
          }
          break;
        }
        case 3: {
          obj = {
            image: tests3ImageBase64,
            width: 500,
          }
          break;
        }
        case 4: {
          obj = {
            image: tests4ImageBase64,
            width: 500,
          }
          break;
        }
        case 5: {
          obj = {
            image: tests5ImageBase64,
            width: 500,
          }
          break;
        }
        case 6: {
          obj = {
            image: tests6ImageBase64,
            width: 500,
          }
          break;
        }
        case 7: {
          obj = {
            image: tests7ImageBase64,
            width: 500,
          }
          break;
        }
        case 8: {
          obj = {
            image: tests8ImageBase64,
            width: 500,
          }
          break;
        }
        case 9: {
          obj = {
            image: tests9ImageBase64,
            width: 500,
          }
          break;
        }
        case 10: {
          obj = {
            image: tests10ImageBase64,
            width: 500,
          }
          break;
        }
        case 11: {
          obj = {
            image: tests11ImageBase64,
            width: 500,
          }
          break;
        }
        case 12: {
          obj = {
            image: tests12ImageBase64,
            width: 500,
          }
          break;
        }
        case 13: {
          obj = {
            image: tests13ImageBase64,
            width: 500,
          }
          break;
        }
        case 14: {
          obj = {
            image: tests14ImageBase64,
            width: 500,
          }
          break;
        }
        case 15: {
          obj = {
            image: tests15ImageBase64,
            width: 500,
          }
          break;
        }
        case 16: {
          obj = {
            image: tests16ImageBase64,
            width: 500,
          }
          break;
        }
        case 17: {
          obj = {
            image: tests17ImageBase64,
            width: 500,
          }
          break;
        }
        case 18: {
          obj = {
            image: tests18ImageBase64,
            width: 500,
          }
          break;
        }
        case 19: {
          obj = {
            image: tests19ImageBase64,
            width: 500,
          }
          break;
        }
        case 20: {
          obj = {
            image: tests20ImageBase64,
            width: 500,
          }
          break;
        }
        case 21: {
          obj = {
            image: tests21ImageBase64,
            width: 500,
          }
          break;
        }
        case 22: {
          obj = {
            image: tests22ImageBase64,
            width: 500,
          }
          break;
        }
      }

      textArray.push(obj);
    }
  }

  function arrayContentChildrenCreate(array, textArray) {
    childrenNumbers.forEach((number) => {
      let obj;

      switch (number) {
        case 1: {
          obj = {
            image: children1ImageBase64,
            width: 500,
          }
          break;
        }
        case 2: {
          obj = {
            image: children2ImageBase64,
            width: 500,
          }
          break;
        }
        case 3: {
          obj = {
            image: children3ImageBase64,
            width: 500,
          }
          break;
        }
        case 4: {
          obj = {
            image: children4ImageBase64,
            width: 500,
          }
          break;
        }
        case 5: {
          obj = {
            image: children5ImageBase64,
            width: 500,
          }
          break;
        }
        case 6: {
          obj = {
            image: children6ImageBase64,
            width: 500,
          }
          break;
        }
        case 7: {
          obj = {
            image: children7ImageBase64,
            width: 500,
          }
          break;
        }
        case 8: {
          obj = {
            image: children8ImageBase64,
            width: 500,
          }
          break;
        }
        case 9: {
          obj = {
            image: children9ImageBase64,
            width: 500,
          }
          break;
        }
        case 10: {
          obj = {
            image: children10ImageBase64,
            width: 500,
          }
          break;
        }
        case 11: {
          obj = {
            image: children11ImageBase64,
            width: 500,
          }
          break;
        }
        case 12: {
          obj = {
            image: children12ImageBase64,
            width: 500,
          }
          break;
        }
        case 13: {
          obj = {
            image: children13ImageBase64,
            width: 500,
          }
          break;
        }
        case 14: {
          obj = {
            image: children14ImageBase64,
            width: 500,
          }
          break;
        }
        case 15: {
          obj = {
            image: children15ImageBase64,
            width: 500,
          }
          break;
        }
        case 16: {
          obj = {
            image: children16ImageBase64,
            width: 500,
          }
          break;
        }
        case 17: {
          obj = {
            image: children17ImageBase64,
            width: 500,
          }
          break;
        }
        case 18: {
          obj = {
            image: children18ImageBase64,
            width: 500,
          }
          break;
        }
        case 19: {
          obj = {
            image: children19ImageBase64,
            width: 500,
          }
          break;
        }
        case 20: {
          obj = {
            image: children20ImageBase64,
            width: 500,
          }
          break;
        }
        case 21: {
          obj = {
            image: children21ImageBase64,
            width: 500,
          }
          break;
        }
        case 22: {
          obj = {
            image: children22ImageBase64,
            width: 500,
          }
          break;
        }
      }

      textArray.push(obj);
    })
  }

  function arrayContentPastCreate(array, textArray) {
    let obj;
    const D2Element = document.querySelector('#D2_diagram');
    const D1Element = document.querySelector('#D1_diagram');
    const DElement = document.querySelector('#D_diagram');

    let D2 = parseInt(D2Element.textContent);
    let D1 = parseInt(D1Element.textContent);
    let D = parseInt(DElement.textContent);

    if (D2 === 3 && D1 === 7 && D === 22) {
      obj = {
        image: past1ImageBase64,
        width: 500
      }
    }

    if (D2 === 3 && D1 === 13 && D === 10) {
      obj = {
        image: past2ImageBase64,
        width: 500
      }
    }

    if (D2 === 3 && D1 === 22 && D === 19) {
      obj = {
        image: past3ImageBase64,
        width: 500
      }
    }

    if (D2 === 6 && D1 === 5 && D === 17) {
      obj = {
        image: past4ImageBase64,
        width: 500
      }
    }

    if (D2 === 6 && D1 === 8 && D === 20) {
      obj = {
        image: past5ImageBase64,
        width: 500
      }
    }

    if (D2 === 6 && D1 === 14 && D === 8) {
      obj = {
        image: past6ImageBase64,
        width: 500
      }
    }

    if (D2 === 6 && D1 === 17 && D === 11) {
      obj = {
        image: past7ImageBase64,
        width: 500
      }
    }

    if (D2 === 6 && D1 === 20 && D === 14) {
      obj = {
        image: past8ImageBase64,
        width: 500
      }
    }

    if (D2 === 9 && D1 === 3 && D === 21) {
      obj = {
        image: past9ImageBase64,
        width: 500
      }
    }

    if (D2 === 9 && D1 === 12 && D === 3) {
      obj = {
        image: past10ImageBase64,
        width: 500
      }
    }

    if (D2 === 9 && D1 === 15 && D === 6) {
      obj = {
        image: past11ImageBase64,
        width: 500
      }
    }

    if (D2 === 12 && D1 === 16 && D === 4) {
      obj = {
        image: past12ImageBase64,
        width: 500
      }
    }

    if (D2 === 12 && D1 === 19 && D === 7) {
      obj = {
        image: past13ImageBase64,
        width: 500
      }
    }

    if (D2 === 15 && D1 === 5 && D === 8) {
      obj = {
        image: past14ImageBase64,
        width: 500
      }
    }

    if (D2 === 15 && D1 === 8 && D === 11) {
      obj = {
        image: past15ImageBase64,
        width: 500
      }
    }

    if (D2 === 15 && D1 === 20 && D === 5) {
      obj = {
        image: past16ImageBase64,
        width: 500
      }
    }

    if (D2 === 18 && D1 === 3 && D === 12) {
      obj = {
        image: past17ImageBase64,
        width: 500
      }
    }

    if (D2 === 18 && D1 === 6 && D === 6) {
      obj = {
        image: past18ImageBase64,
        width: 500
      }
    }

    if (D2 === 18 && D1 === 6 && D === 15) {
      obj = {
        image: past19ImageBase64,
        width: 500
      }
    }

    if (D2 === 18 && D1 === 9 && D === 9 || D2 === 9 && D1 === 18 && D === 9 || D2 === 9 && D1 === 9 && D === 18) {
      obj = {
        image: past20ImageBase64,
        width: 500
      }
    }

    if (D2 === 21 && D1 === 4 && D === 10) {
      obj = {
        image: past21ImageBase64,
        width: 500
      }
    }

    if (D2 === 21 && D1 === 7 && D === 13) {
      obj = {
        image: past22ImageBase64,
        width: 500
      }
    }

    if (D2 === 21 && D1 === 10 && D === 7) {
      obj = {
        image: past23ImageBase64,
        width: 500
      }
    }

    if (D2 === 21 && D1 === 10 && D === 16) {
      obj = {
        image: past24ImageBase64,
        width: 500
      }
    }

    textArray.push(obj);
  }

  function arrayContentMoneyCreate(array, textArray) {
    let CElement = document.querySelector('#C');
    let C1Element = document.querySelector('#C1');
    let MElement = document.querySelector('#M_diagram');

    for (let i = 0; i < array.length; i++) {
      let obj;

      if (i === 2) {
        switch (parseInt(MElement.textContent)) {
          case 2: {
            obj = {
              image: work2ImageBase64,
              width: 500,
              margin: [0, 20, 0, 20],
            }
            break;
          }
          case 3: {
            obj = {
              image: work3ImageBase64,
              width: 500,
              margin: [0, 20, 0, 20],
            }
            break;
          }
          case 4: {
            obj = {
              image: work4ImageBase64,
              width: 500,
              margin: [0, 20, 0, 20],
            }
            break;
          }
          case 5: {
            obj = {
              image: work5ImageBase64,
              width: 500,
              margin: [0, 20, 0, 20],
            }
            break;
          }
          case 6: {
            obj = {
              image: work6ImageBase64,
              width: 500,
              margin: [0, 20, 0, 20],
            }
            break;
          }
          case 7: {
            obj = {
              image: work7ImageBase64,
              width: 500,
              margin: [0, 20, 0, 20],
            }
            break;
          }
          case 8: {
            obj = {
              image: work8ImageBase64,
              width: 500,
              margin: [0, 20, 0, 20],
            }
            break;
          }
          case 9: {
            obj = {
              image: work9ImageBase64,
              width: 500,
              margin: [0, 20, 0, 20],
            }
            break;
          }
          case 10: {
            obj = {
              image: work10ImageBase64,
              width: 500,
              margin: [0, 20, 0, 20],
            }
            break;
          }
          case 11: {
            obj = {
              image: work11ImageBase64,
              width: 500,
              margin: [0, 20, 0, 20],
            }
            break;
          }
          case 12: {
            obj = {
              image: work12ImageBase64,
              width: 500,
              margin: [0, 20, 0, 20],
            }
            break;
          }
          case 13: {
            obj = {
              image: work13ImageBase64,
              width: 500,
              margin: [0, 20, 0, 20],
            }
            break;
          }
          case 14: {
            obj = {
              image: work14ImageBase64,
              width: 500,
              margin: [0, 20, 0, 20],
            }
            break;
          }
          case 15: {
            obj = {
              image: work15ImageBase64,
              width: 500,
              margin: [0, 20, 0, 20],
            }
            break;
          }
          case 16: {
            obj = {
              image: work16ImageBase64,
              width: 500,
              margin: [0, 20, 0, 20],
            }
            break;
          }
          case 17: {
            obj = {
              image: work17ImageBase64,
              width: 500,
              margin: [0, 20, 0, 20],
            }
            break;
          }
          case 18: {
            obj = {
              image: work18ImageBase64,
              width: 500,
              margin: [0, 20, 0, 20],
            }
            break;
          }
          case 19: {
            obj = {
              image: work19ImageBase64,
              width: 500,
              margin: [0, 20, 0, 20],
            }
            break;
          }
          case 20: {
            obj = {
              image: work20ImageBase64,
              width: 500,
              margin: [0, 20, 0, 20],
            }
            break;
          }
          case 21: {
            obj = {
              image: work21ImageBase64,
              width: 500,
              margin: [0, 20, 0, 20],
            }
            break;
          }
          case 22: {
            obj = {
              image: work22ImageBase64,
              width: 500,
              margin: [0, 20, 0, 20],
            }
            break;
          }
        }

        textArray.push(obj);
      }

      if (i === array.length - 2 && (parseInt(C1Element.textContent) !== parseInt(CElement.textContent))) {

        switch (parseInt(CElement.textContent)) {
          case 2: {
            obj = {
              image: money2ImageBase64,
              width: 500,
              margin: [0, 0, 0, 30],
            }
            break;
          }
          case 3: {
            obj = {
              image: money3ImageBase64,
              width: 500,
              margin: [0, 0, 0, 30],
            }
            break;
          }
          case 4: {
            obj = {
              image: money4ImageBase64,
              width: 500,
              margin: [0, 0, 0, 30],
            }
            break;
          }
          case 5: {
            obj = {
              image: money5ImageBase64,
              width: 500,
              margin: [0, 0, 0, 30],
            }
            break;
          }
          case 6: {
            obj = {
              image: money6ImageBase64,
              width: 500,
              margin: [0, 0, 0, 30],
            }
            break;
          }
          case 7: {
            obj = {
              image: money7ImageBase64,
              width: 500,
              margin: [0, 0, 0, 30],
            }
            break;
          }
          case 8: {
            obj = {
              image: money8ImageBase64,
              width: 500,
              margin: [0, 0, 0, 30],
            }
            break;
          }
          case 9: {
            obj = {
              image: money9ImageBase64,
              width: 500,
              margin: [0, 0, 0, 30],
            }
            break;
          }
          case 10: {
            obj = {
              image: money10ImageBase64,
              width: 500,
              margin: [0, 0, 0, 30],
            }
            break;
          }
          case 11: {
            obj = {
              image: money11ImageBase64,
              width: 500,
              margin: [0, 0, 0, 30],
            }
            break;
          }
          case 12: {
            obj = {
              image: money12ImageBase64,
              width: 500,
              margin: [0, 0, 0, 30],
            }
            break;
          }
          case 13: {
            obj = {
              image: money13ImageBase64,
              width: 500,
              margin: [0, 0, 0, 30],
            }
            break;
          }
          case 14: {
            obj = {
              image: money14ImageBase64,
              width: 500,
              margin: [0, 0, 0, 30],
            }
            break;
          }
          case 15: {
            obj = {
              image: money15ImageBase64,
              width: 500,
              margin: [0, 0, 0, 30],
            }
            break;
          }
          case 16: {
            obj = {
              image: money16ImageBase64,
              width: 500,
              margin: [0, 0, 0, 30],
            }
            break;
          }
          case 17: {
            obj = {
              image: money17ImageBase64,
              width: 500,
              margin: [0, 0, 0, 30],
            }
            break;
          }
          case 18: {
            obj = {
              image: money18ImageBase64,
              width: 500,
              margin: [0, 0, 0, 30],
            }
            break;
          }
          case 19: {
            obj = {
              image: money19ImageBase64,
              width: 500,
              margin: [0, 0, 0, 30],
            }
            break;
          }
          case 20: {
            obj = {
              image: money20ImageBase64,
              width: 500,
              margin: [0, 0, 0, 30],
            }
            break;
          }
          case 21: {
            obj = {
              image: money21ImageBase64,
              width: 500,
              margin: [0, 0, 0, 30],
            }
            break;
          }
          case 22: {
            obj = {
              image: money22ImageBase64,
              width: 500,
              margin: [0, 0, 0, 30],
            }
            break;
          }
        }

        textArray.push(obj);
      }

      if (i === array.length - 1) {

        switch (parseInt(C1Element.textContent)) {
          case 2: {
            obj = {
              image: money2ImageBase64,
              width: 500,
            }
            break;
          }
          case 3: {
            obj = {
              image: money3ImageBase64,
              width: 500,
            }
            break;
          }
          case 4: {
            obj = {
              image: money4ImageBase64,
              width: 500,
            }
            break;
          }
          case 5: {
            obj = {
              image: money5ImageBase64,
              width: 500,
            }
            break;
          }
          case 6: {
            obj = {
              image: money6ImageBase64,
              width: 500,
            }
            break;
          }
          case 7: {
            obj = {
              image: money7ImageBase64,
              width: 500,
            }
            break;
          }
          case 8: {
            obj = {
              image: money8ImageBase64,
              width: 500,
            }
            break;
          }
          case 9: {
            obj = {
              image: money9ImageBase64,
              width: 500,
            }
            break;
          }
          case 10: {
            obj = {
              image: money10ImageBase64,
              width: 500,
            }
            break;
          }
          case 11: {
            obj = {
              image: money11ImageBase64,
              width: 500,
            }
            break;
          }
          case 12: {
            obj = {
              image: money12ImageBase64,
              width: 500,
            }
            break;
          }
          case 13: {
            obj = {
              image: money13ImageBase64,
              width: 500,
            }
            break;
          }
          case 14: {
            obj = {
              image: money14ImageBase64,
              width: 500,
            }
            break;
          }
          case 15: {
            obj = {
              image: money15ImageBase64,
              width: 500,
            }
            break;
          }
          case 16: {
            obj = {
              image: money16ImageBase64,
              width: 500,
            }
            break;
          }
          case 17: {
            obj = {
              image: money17ImageBase64,
              width: 500,
            }
            break;
          }
          case 18: {
            obj = {
              image: money18ImageBase64,
              width: 500,
            }
            break;
          }
          case 19: {
            obj = {
              image: money19ImageBase64,
              width: 500,
            }
            break;
          }
          case 20: {
            obj = {
              image: money20ImageBase64,
              width: 500,
            }
            break;
          }
          case 21: {
            obj = {
              image: money21ImageBase64,
              width: 500,
            }
            break;
          }
          case 22: {
            obj = {
              image: money22ImageBase64,
              width: 500,
            }
            break;
          }
        }

        textArray.push(obj);
      }

      if (i !== array.length - 2) {
        if (i === array.length - 1) {
          return
        }

        let obj = {
          text: array[i].textContent,
          fontSize: 14,
          margin: [0, 0, 0, 20],
        }

        textArray.push(obj);
      }
    }
  }

  function arrayContentTalentsCreate(array, textArray) {
    let E2 = parseInt(document.querySelector('#E2_diagram').textContent);
    let E1 = parseInt(document.querySelector('#E1_diagram').textContent);
    let E = parseInt(document.querySelector('#E_diagram').textContent);

    let F2 = parseInt(document.querySelector('#F2_diagram').textContent);
    let F1 = parseInt(document.querySelector('#F1_diagram').textContent);
    let F = parseInt(document.querySelector('#F_diagram').textContent);

    let B2 = parseInt(document.querySelector('#B2_diagram').textContent);
    let B1 = parseInt(document.querySelector('#B1_diagram').textContent);
    let B = parseInt(document.querySelector('#B_diagram').textContent);

    let E_duplicate = E;
    let E1_duplicate = E1;
    let E2_duplicate = E2;

    let F_duplicate = F;
    let F1_duplicate = F1;
    let F2_duplicate = F2;

    if (E === B || E === B1 || E === B2) {
      E_duplicate = 0;
    }

    if (E1 === B || E1 === B1 || E2 === B2) {
      E1_duplicate = 0;
    }

    if (E2 === B || E2 === B1 || E2 === B2) {
      E2_duplicate = 0;
    }


    if (F === B || F === B1 || F === B2 || F === E || F === E1 || F === E2) {
      F_duplicate = 0;
    }

    if (F1 === B || F1 === B1 || F1 === B2 || F1 === E || F1 === E1 || F1 === E2) {
      F1_duplicate = 0;
    }

    if (F2 === B || F2 === B1 || F2 === B2 || F2 === E || F2 === E1 || F2 === E2) {
      F2_duplicate = 0;
    }

    const firstArray = [B, B1, B2];
    const secondArray = [E_duplicate, E1_duplicate, E2_duplicate];
    const thirdArray = [F_duplicate, F1_duplicate, F2_duplicate];

    let title = {
      text: 'Талант от Бога',
      fontSize: 14,
      margin: [0, 0, 0, 20],
    }

    textArray.push(title);

    firstArray.forEach((number) => {
      let obj;

      switch (number) {
        case 0: {
          break;
        }
        case 1: {
          obj = {
            image: talents1ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 2: {
          obj = {
            image: talents2ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 3: {
          obj = {
            image: talents3ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 4: {
          obj = {
            image: talents4ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 5: {
          obj = {
            image: talents5ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 6: {
          obj = {
            image: talents6ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 7: {
          obj = {
            image: talents7ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 8: {
          obj = {
            image: talents8ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 9: {
          obj = {
            image: talents9ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 10: {
          obj = {
            image: talents10ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 11: {
          obj = {
            image: talents11ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 12: {
          obj = {
            image: talents12ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 13: {
          obj = {
            image: talents13ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 14: {
          obj = {
            image: talents14ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 15: {
          obj = {
            image: talents15ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 16: {
          obj = {
            image: talents16ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 17: {
          obj = {
            image: talents17ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 18: {
          obj = {
            image: talents18ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 19: {
          obj = {
            image: talents19ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 20: {
          obj = {
            image: talents20ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 21: {
          obj = {
            image: talents21ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 22: {
          obj = {
            image: talents22ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
      }

      textArray.push(obj);
    })


    let title2 = {
      text: 'Талант от Отца',
      fontSize: 14,
      margin: [0, 0, 0, 20],
    }

    textArray.push(title2);

    secondArray.forEach((number) => {
      let obj;

      switch (number) {
        case 0: {
          break;
        }
        case 1: {
          obj = {
            image: talents1ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 2: {
          obj = {
            image: talents2ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 3: {
          obj = {
            image: talents3ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 4: {
          obj = {
            image: talents4ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 5: {
          obj = {
            image: talents5ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 6: {
          obj = {
            image: talents6ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 7: {
          obj = {
            image: talents7ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 8: {
          obj = {
            image: talents8ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 9: {
          obj = {
            image: talents9ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 10: {
          obj = {
            image: talents10ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 11: {
          obj = {
            image: talents11ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 12: {
          obj = {
            image: talents12ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 13: {
          obj = {
            image: talents13ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 14: {
          obj = {
            image: talents14ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 15: {
          obj = {
            image: talents15ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 16: {
          obj = {
            image: talents16ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 17: {
          obj = {
            image: talents17ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 18: {
          obj = {
            image: talents18ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 19: {
          obj = {
            image: talents19ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 20: {
          obj = {
            image: talents20ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 21: {
          obj = {
            image: talents21ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 22: {
          obj = {
            image: talents22ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
      }

      textArray.push(obj);
    })


    let title3 = {
      text: 'Талант от Матери',
      fontSize: 14,
      margin: [0, 0, 0, 20],
    }

    if (thirdArray[0] > 0 || thirdArray[1] > 0 || thirdArray[2] > 0) {
      textArray.push(title3);
    }

    thirdArray.forEach((number) => {
      let obj;

      switch (number) {
        case 0: {
          break;
        }
        case 1: {
          obj = {
            image: talents1ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 2: {
          obj = {
            image: talents2ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 3: {
          obj = {
            image: talents3ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 4: {
          obj = {
            image: talents4ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 5: {
          obj = {
            image: talents5ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 6: {
          obj = {
            image: talents6ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 7: {
          obj = {
            image: talents7ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 8: {
          obj = {
            image: talents8ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 9: {
          obj = {
            image: talents9ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 10: {
          obj = {
            image: talents10ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 11: {
          obj = {
            image: talents11ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 12: {
          obj = {
            image: talents12ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 13: {
          obj = {
            image: talents13ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 14: {
          obj = {
            image: talents14ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 15: {
          obj = {
            image: talents15ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 16: {
          obj = {
            image: talents16ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 17: {
          obj = {
            image: talents17ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 18: {
          obj = {
            image: talents18ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 19: {
          obj = {
            image: talents19ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 20: {
          obj = {
            image: talents20ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 21: {
          obj = {
            image: talents21ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
        case 22: {
          obj = {
            image: talents22ImageBase64,
            width: 500,
            margin: [0, 0, 0, 30],
          }
          break;
        }
      }

      textArray.push(obj);
    })
  }


  arrayContentPersonalCreate(personalArray, personalArrayTexts);
  arrayContentTalentsCreate(talentsArray, talentsArrayTexts);
  arrayContentTestsCreate(testsArray, testsArrayTexts);
  arrayContentChildrenCreate(childrenArray, childrenArrayTexts);
  arrayContentPastCreate(pastLivesArray, pastLivesArrayTexts);
  arrayContentMoneyCreate(moneyArray, moneyArrayTexts);


  const pdfInformation = {
    content: [
      {
        text: 'HUMANMATRIX.RU ',
        bold: true,
        fontSize: 16,
        alignment: 'center',
        color: '#F95954',
        margin: [0, 0, 0, 50],
      },
      {
        image: `${mainImageBase64}`,
        width: 500,
      },
      {
        text: `МАТРИЦА СУДЬБЫ`,
        bold: true,
        fontSize: 29,
        color: '#F95954',
        alignment: 'center',
        margin: [0, 30, 0, 30],
      },
      {
        text: `Персональная книга с полной расшифровкой вашей личности`,
        fontSize: 17,
        alignment: 'center',
        color: '#F95954',
        margin: [0, 30, 0, 30],
      },
      {
        text: `${localStorage.getItem('name')} (${localStorage.getItem('date')})`,
        alignment: 'center',
        fontSize: 17,
      },
      {
        text: `Вступительное слово от Humanmatrix.ru`,
        fontSize: 17,
        alignment: 'center',
        color: '#F95954',
        margin: [0, 0, 0, 35],
        pageBreak: 'before'
      },
      {
        text: `Здравствуйте, ${localStorage.getItem('name')} \n` +
          'Мы рады приветствовать Вас в сервисе Humanmatrix. \n' +
          'Мы долго и тщательно работали, чтобы вы могли моментально получить подробную и структурированную информацию по методологии Матрицы Судьбы. Мы искренне благодарим вас за доверие и будем стараться и дальше радовать вас новинками в  сервисе и другими продуктами по самопознанию человека.',
        fontSize: 14,
        color: '#5A5A5A',
        margin: [0, 0, 0, 50],
      },
      {
        text: `Рекомендации по изучению расшифровки Матрицы судьбы`,
        fontSize: 17,
        alignment: 'center',
        color: '#F95954',
        margin: [0, 0, 0, 35],
      },
      {
        text: 'Перед Вами самое простое и быстрое решение для тех, кому нужны точные ответы здесь и сейчас.  Однако нужно понимать, что Матрица Судьбы это не волшебная таблетка, которая все сделает  за вас. \n' +
          '\n' +
          'После изучения этой расшифровки,  Вы будете владеть всей информацией о своем потенциале. Но как Вы распорядитесь этой информацией зависит только от вас.\n' +
          '\n' +
          'Также нужно проанализировать в какой вибрации вы сейчас находитесь - в плюсе или минусе и скорректировать ее. Как это сделать, мы также добавили в ваши расшифровки.\n' +
          '\n' +
          'Тщательно взвешивайте и выписывайте  данную информацию. Для этого мы дополнительно дарим Вам еще и рабочую тетрадь для проработки всех инсайтов и мыслей. Также мы дополнили ее несколькими практиками, для востановления жизненного баланса и вывода себя в плюс. \n' +
          'Пользуйтесь на здоровье!\n' +
          '\n',
        fontSize: 14,
        color: '#5A5A5A',
        margin: [0, 0, 0, 150],
      },
      {
        text: 'Ваш заботливый Humanmatrix.ru',
        alignment: 'center',
        color: '#5A5A5A',
        fontSize: 14,
      },
      {
        text: 'ПАРТНЕРСКАЯ ПРОГРАММА',
        pageBreak: 'before',
        alignment: 'center',
        fontSize: 17,
        margin: [0, 0, 0, 30],
        color: '#F95954',
      },
      {
        text: 'Рекомендуйте друзьям наш сервис матрицы судьбы и получайте за это деньги!',
        color: '#5A5A5A',
        alignment: 'center',
        margin: [0, 0, 0, 50],
      },
      {
        text: 'КАК РАБОТАЕТ?',
        color: '#5A5A5A',
        margin: [0, 0, 0, 10],
      },
      {
        text:
          '1. Зарегистрируйтесь в партнёрской программе Humanmatrix',
        margin: [0, 0, 0, 5],
        color: '#5A5A5A',
        fontSize: 14,
      },
      {
        text:
          '2. Скопируйте и передайте свою индивидуальную реферальную ссылку знакомым или подписчикам в любых соцсетях (ссылки генерируются автоматически при регистрации в программе).',
        margin: [0, 0, 0, 5],
        color: '#5A5A5A',
        fontSize: 14,
      },
      {
        text:
          '3. Порекомендуйте друзьям наш сервис и расскажите, что при регистрации по ВАШЕЙ реферальной ссылке их ждёт приятный бонус (скидка 10%).',
        margin: [0, 0, 0, 5],
        color: '#5A5A5A',
        fontSize: 14,
      },
      {
        text:
          '4. Получите своё вознаграждение (10% с каждой оплаты)!',
        margin: [0, 0, 0, 5],
        color: '#5A5A5A',
        fontSize: 14,
      },
      {
        text:
          '5. При этом каждый приглашённый участник будет закреплён за вами. И при последующих покупках вам будет приходить до 5% с каждой его самостоятельной оплаты на нашем сайте.',
        margin: [0, 0, 0, 50],
        color: '#5A5A5A',
        fontSize: 14,
      },
      {
        text: 'КУДА ПОТРАТИТЬ БОНУС? Куда хотите!\n' +
          'БОНУС — это реальные деньги, которые вернутся на ваш счет!',
        color: '#F95954',
        fontSize: 14,
        alignment: 'center',
        margin: [0, 0, 0, 30],
      },
      {
        text: 'Мы сделаем для вас отчет по совершенным оплатам, который автоматически обновляется в реальном времени. В любой момент вы можете посмотреть, сколько людей купили расшифровки по вашей ссылке, сколько вы уже заработали и вывести деньги на карту.',
        fontSize: 14,
        color: '#5A5A5A',
        margin: [0, 0, 0, 150],
      },
      {
        text: 'ЕСТЬ ВОПРОСЫ?\n' +
          'Напишите в техподдержку\n' +
          'mail@humanmatrix.ru \n' +
          'Телеграм: Humanmatrix',
        fontSize: 14,
        margin: [0, 0, 0, 100],
        color: '#5A5A5A',
      },
      {
        image: personalImageBase64,
        width: 500,
        margin: [0, 20, 0, 20],
      },
      ...personalArrayTexts,
      {
        image: talentsImageBase64,
        width: 500,
        margin: [0, 20, 0, 20],
      },
      ...talentsArrayTexts,
      {
        image: pastImageBase64,
        width: 500,
        margin: [0, 20, 0, 20],
      },
      ...pastLivesArrayTexts,
      {
        image: healthImageBase64,
        width: 500,
        margin: [0, 20, 0, 20],
      },
      ...healthArrayTexts,
      {
        image: purposeImageBase64,
        width: 500,
        margin: [0, 20, 0, 20],
      },
      ...purposeArrayTexts,
      {
        image: testsImageBase64,
        width: 500,
        margin: [0, 20, 0, 20],
      },
      ...testsArrayTexts,
      {
        image: lovesImageBase64,
        width: 500,
        margin: [0, 20, 0, 20],
      },
      ...lovesArrayTexts,
      {
        image: yearsImageBase64,
        width: 500,
        margin: [0, 20, 0, 20],
      },
      {
        text: ageText,
        fontSize: 14,
        margin: [0, 0, 0, 30],
      },
      ...yearsArrayTexts,
      {
        image: moneyImageBase64,
        width: 500,
        margin: [0, 20, 0, 20],
      },
      ...moneyArrayTexts,
      {
        image: parentsImageBase64,
        width: 500,
        margin: [0, 20, 0, 20],
      },
      ...parentsArrayTexts,
      {
        image: childrenImageBase64,
        width: 500,
        margin: [0, 20, 0, 20],
      },
      ...childrenArrayTexts,
      {
        image: managementImageBase64,
        width: 500,
        margin: [0, 20, 0, 20],
      },
      ...managementArrayTexts,
    ],
  }

  // Получаем переменные
  var name = localStorage.getItem('name')
  var date = localStorage.getItem('date')
  var today = new Date();
  var now = today.getDate() + '.' + (Number(today.getMonth()) + 1) + '.' + today.getFullYear()
  var gen = localStorage.getItem('gender')
  var docs_name = "Матрица судьбы"

  // Отправляем в обработчик
  $.ajax({
    type: 'POST',
    url: 'https://humanmatrix.ru/wp-content/themes/matrix_new/pdf_bd.php',
    data: { name: name, date: date, now: now, gen: gen, docs_name: docs_name },
  });
}
