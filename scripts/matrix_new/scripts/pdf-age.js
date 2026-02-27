const dateActual = new Date().getFullYear();
const birthdayActual = localStorage['date'];

let ageNumberActual = dateActual - parseInt(birthdayActual.split('.')[2]);

let ageText = `Прогноз на год ${ageNumberActual}-${ageNumberActual+1}`;

const yearsPanelContent = document.querySelectorAll('#year_1_panel p');
let yearsArray = Array.from(yearsPanelContent);
let yearsArrayTexts = [];

const yearsPanelContent2 = document.querySelectorAll('#year_2_panel p');
let yearsArray2 = Array.from(yearsPanelContent2);
let yearsArrayTexts2 = [];

const yearsPanelContent3 = document.querySelectorAll('#year_3_panel p');
let yearsArray3 = Array.from(yearsPanelContent3);
let yearsArrayTexts3 = [];

const yearsPanelContent4 = document.querySelectorAll('#year_4_panel p');
let yearsArray4 = Array.from(yearsPanelContent4);
let yearsArrayTexts4 = [];

const yearsPanelContent5 = document.querySelectorAll('#year_5_panel p');
let yearsArray5 = Array.from(yearsPanelContent5);
let yearsArrayTexts5 = [];

const yearsPanelContent6 = document.querySelectorAll('#year_6_panel p');
let yearsArray6 = Array.from(yearsPanelContent6);
let yearsArrayTexts6 = [];

const yearsPanelContent7 = document.querySelectorAll('#year_7_panel p');
let yearsArray7 = Array.from(yearsPanelContent7);
let yearsArrayTexts7 = [];

const yearsPanelContent8 = document.querySelectorAll('#year_8_panel p');
let yearsArray8 = Array.from(yearsPanelContent8);
let yearsArrayTexts8 = [];

const yearsPanelContent9 = document.querySelectorAll('.white-block-age-forecast-block p');
let yearsArray9 = Array.from(yearsPanelContent9);
let yearsArrayTexts9 = [];


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

mainImage.crossOrigin="anonymous";
mainImage.src = 'https://humanmatrix.ru/wp-content/themes/matrix_new/img/pdf/main_2.jpg';

const headerClick = document.querySelector('.title-calculate h1');


function arrayContentCreate(array, textArray) {
  for (let i = 0; i < array.length; i++) {
     let obj = {
      text: array[i].textContent,
      fontSize: 12,
      margin: [0, 0, 0, 20],
    }
     
      if (i === 0) {
          obj = {
            text: array[i].textContent,
            fontSize: 25,
            color: '#5A5A5A',
            alignment: 'center',
            margin: [0, 0, 0, 20],
          }
      }
      
      if (i === 1) {
          obj = {
            text: array[i].textContent,
            fontSize: 20,
            color: '#34A0BC',
            alignment: 'center',
            margin: [0, 0, 0, 20],
          }
      }
      
      if (i === 2) {
          obj = {
            text: array[i].textContent,
            fontSize: 15,
            color: '#279B17',
            margin: [0, 0, 0, 20],
          }
      }
      
      if (i === 4) {
          obj = {
            text: array[i].textContent,
            fontSize: 15,
            color: '#D83A4E',
            margin: [0, 0, 0, 20],
          }
      }
      
    if (i === 6) {
          obj = {
            text: array[i].textContent,
            fontSize: 20,
            color: '#34A0BC',
            alignment: 'center',
            margin: [0, 0, 0, 20],
          }
      }

      if (i === 7) {
          obj = {
            text: array[i].textContent,
            fontSize: 15,
            color: '#279B17',
            margin: [0, 0, 0, 20],
          }
      }
      
      
      if (i === 9) {
          obj = {
            text: array[i].textContent,
            fontSize: 15,
            color: '#D83A4E',
            margin: [0, 0, 0, 20],
          }
      }
      
    textArray.push(obj);
  }
}

arrayContentCreate(yearsArray9, yearsArrayTexts9);
arrayContentCreate(yearsArray, yearsArrayTexts);
arrayContentCreate(yearsArray2, yearsArrayTexts2);
arrayContentCreate(yearsArray3, yearsArrayTexts3);
arrayContentCreate(yearsArray4, yearsArrayTexts4);
arrayContentCreate(yearsArray5, yearsArrayTexts5);
arrayContentCreate(yearsArray6, yearsArrayTexts6);
arrayContentCreate(yearsArray7, yearsArrayTexts7);
arrayContentCreate(yearsArray8, yearsArrayTexts8);

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
        text: `ПЕРСОНАЛЬНЫЙ ПРОГНОЗ НА 10 ЛЕТ`,
        bold: true,
        fontSize: 21,
        color: '#296DB5',
        alignment: 'center',
        margin: [0, 30, 0, 0],
      },
      {
        text: `ПО МЕТОДОЛОГИИ МАТРИЦЫ СУДЬБЫ `,
        fontSize: 15,
        alignment: 'center',
        color: '#4E4E4E',
        margin: [0, 10, 0, 60],
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
      ...yearsArrayTexts9,
      ...yearsArrayTexts,
      ...yearsArrayTexts2,
      ...yearsArrayTexts3,
      ...yearsArrayTexts4,
      ...yearsArrayTexts5,
      ...yearsArrayTexts6,
      ...yearsArrayTexts7,
      ...yearsArrayTexts8,
    ],
  }

  pdfMake.createPdf(pdfInformation).download(`${localStorage.getItem('name')} (${localStorage.getItem('date')}).pdf`)




window.onload = function () {

  // Получаем переменные
  var name = localStorage.getItem('name')
  var date = localStorage.getItem('date')
  var today = new Date();
  var now = today.getDate() + '.' + (Number(today.getMonth()) + 1) + '.' + today.getFullYear()
  var gen = localStorage.getItem('gender')
  var docs_name = "Прогноз по годам"

  // Отправляем в обработчик
  $.ajax({
    type: 'POST',
    url: 'https://humanmatrix.ru/wp-content/themes/matrix_new/pdf_bd.php',
    data: { name: name, date: date, now: now, gen: gen, docs_name: docs_name },
  });
}
