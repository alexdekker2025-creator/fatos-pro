import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Регистрируем шрифты для поддержки кириллицы
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
});

Font.register({
  family: 'Roboto-Bold',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Roboto',
    backgroundColor: '#1a0b2e', // Темно-фиолетовый фон
  },
  // Магический градиентный заголовок
  header: {
    marginBottom: 25,
    borderBottom: '3pt solid #D97706', // Amber border
    paddingBottom: 15,
    backgroundColor: '#2D1B4E', // Purple background
    padding: 20,
    borderRadius: 8,
  },
  logo: {
    fontSize: 28,
    fontFamily: 'Roboto-Bold',
    color: '#FFD700', // Gold
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 2,
  },
  logoSubtext: {
    fontSize: 10,
    color: '#D97706', // Amber
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Roboto-Bold',
    color: '#FFD700', // Gold
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    color: '#C4B5FD', // Light purple
    marginBottom: 3,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#2D1B4E', // Purple background
    padding: 15,
    borderRadius: 8,
    border: '1pt solid #7C3AED', // Purple border
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#FFD700', // Gold
    marginBottom: 12,
    textAlign: 'center',
  },
  squareContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: 15,
  },
  cell: {
    width: '33.33%',
    padding: 12,
    border: '2pt solid #7C3AED', // Purple border
    backgroundColor: '#1a0b2e', // Dark purple
  },
  cellLabel: {
    fontSize: 9,
    color: '#C4B5FD', // Light purple
    marginBottom: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  cellValue: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#FFD700', // Gold
    marginBottom: 3,
    textAlign: 'center',
  },
  cellCount: {
    fontSize: 8,
    color: '#D97706', // Amber
    textAlign: 'center',
  },
  interpretationBox: {
    backgroundColor: '#1a0b2e', // Dark purple
    padding: 12,
    marginBottom: 10,
    borderLeft: '4pt solid #D97706', // Amber accent
    borderRadius: 4,
  },
  interpretationTitle: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    color: '#FFD700', // Gold
    marginBottom: 6,
  },
  interpretationText: {
    fontSize: 10,
    color: '#E9D5FF', // Very light purple
    lineHeight: 1.6,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#C4B5FD', // Light purple
    borderTop: '2pt solid #7C3AED', // Purple border
    paddingTop: 12,
  },
  decorativeLine: {
    height: 2,
    backgroundColor: '#D97706', // Amber
    marginVertical: 10,
  },
  magicSymbol: {
    fontSize: 16,
    color: '#FFD700', // Gold
    textAlign: 'center',
    marginVertical: 5,
  },
});

interface PythagoreanBasicPDFProps {
  userName: string;
  birthDate: { day: number; month: number; year: number };
  square: number[];
  purchaseDate: string;
}

const cellNames: Record<number, string> = {
  1: 'Характер',
  2: 'Энергия',
  3: 'Наука',
  4: 'Здоровье',
  5: 'Логика',
  6: 'Труд',
  7: 'Удача',
  8: 'Долг',
  9: 'Память',
};

const getBasicInterpretation = (digit: number, count: number): string => {
  if (count === 0) {
    return `Отсутствие цифры ${digit} указывает на область, требующую развития и внимания.`;
  }
  
  const interpretations: Record<number, Record<number, string>> = {
    1: {
      1: 'Мягкий характер, склонность к компромиссам.',
      2: 'Уверенный характер, способность отстаивать свою позицию.',
      3: 'Сильный характер, лидерские качества.',
    },
    2: {
      1: 'Низкий энергетический потенциал, нужно беречь силы.',
      2: 'Нормальная энергетика, достаточно для повседневных задач.',
      3: 'Высокая энергетика, способность заряжать других.',
    },
    3: {
      1: 'Гуманитарный склад ума, творческое мышление.',
      2: 'Баланс между точными и гуманитарными науками.',
      3: 'Аналитический склад ума, способности к точным наукам.',
    },
    4: {
      1: 'Здоровье требует внимания и заботы.',
      2: 'Хорошее здоровье при правильном образе жизни.',
      3: 'Крепкое здоровье, высокая жизнестойкость.',
    },
    5: {
      1: 'Интуитивное мышление преобладает над логикой.',
      2: 'Развитая логика, способность к анализу.',
      3: 'Сильная логика, математический склад ума.',
    },
    6: {
      1: 'Творческая натура, не склонная к рутинному труду.',
      2: 'Трудолюбие, способность к систематической работе.',
      3: 'Высокое трудолюбие, мастер своего дела.',
    },
    7: {
      1: 'Удача требует усилий, нужно создавать возможности.',
      2: 'Везение присутствует, но не стоит на него полагаться.',
      3: 'Высокое везение, способность оказываться в нужном месте.',
    },
    8: {
      1: 'Чувство долга развито слабо, свободолюбие.',
      2: 'Ответственность и чувство долга присутствуют.',
      3: 'Высокое чувство долга, надежность.',
    },
    9: {
      1: 'Память избирательная, запоминается важное.',
      2: 'Хорошая память, способность к обучению.',
      3: 'Отличная память, способность запоминать детали.',
    },
  };

  const maxCount = Math.min(count, 3);
  return interpretations[digit]?.[maxCount] || `Количество цифр ${digit}: ${count}`;
};

export const PythagoreanBasicPDF: React.FC<PythagoreanBasicPDFProps> = ({
  userName,
  birthDate,
  square,
  purchaseDate,
}) => {
  const gridNumbers = [1, 4, 7, 2, 5, 8, 3, 6, 9];
  const formattedDate = `${birthDate.day.toString().padStart(2, '0')}.${birthDate.month.toString().padStart(2, '0')}.${birthDate.year}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Text style={styles.logo}>✦ FATOS.PRO ✦</Text>
          <Text style={styles.logoSubtext}>НУМЕРОЛОГИЧЕСКИЙ ПОРТАЛ</Text>
          <View style={styles.decorativeLine} />
          <Text style={styles.title}>Квадрат Пифагора — Базовый разбор</Text>
          <Text style={styles.magicSymbol}>✦</Text>
          <Text style={styles.subtitle}>Персональный отчет для: {userName}</Text>
          <Text style={styles.subtitle}>Дата рождения: {formattedDate}</Text>
          <Text style={styles.subtitle}>Дата формирования отчета: {new Date(purchaseDate).toLocaleDateString('ru-RU')}</Text>
        </View>

        {/* Pythagorean Square */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ваш Квадрат Пифагора</Text>
          <View style={styles.squareContainer}>
            {gridNumbers.map((num) => {
              const count = square[num - 1];
              let repeatedDigits = '---';
              if (count > 0) {
                repeatedDigits = num.toString().repeat(count);
              }

              return (
                <View key={num} style={styles.cell}>
                  <Text style={styles.cellLabel}>{cellNames[num]}</Text>
                  <Text style={styles.cellValue}>{repeatedDigits}</Text>
                  <Text style={styles.cellCount}>({count})</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Interpretations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Расшифровка ячеек</Text>
          {gridNumbers.map((num) => {
            const count = square[num - 1];
            return (
              <View key={num} style={styles.interpretationBox}>
                <Text style={styles.interpretationTitle}>
                  {cellNames[num]} ({num}): {count > 0 ? num.toString().repeat(count) : '---'}
                </Text>
                <Text style={styles.interpretationText}>
                  {getBasicInterpretation(num, count)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.magicSymbol}>✦</Text>
          <Text style={{ fontFamily: 'Roboto-Bold', color: '#FFD700', marginBottom: 3 }}>FATOS.PRO</Text>
          <Text>Нумерологический портал • Ваш путь к самопознанию</Text>
          <Text style={{ marginTop: 5, fontSize: 8 }}>Этот отчет создан специально для вас на основе вашей даты рождения</Text>
        </View>
      </Page>
    </Document>
  );
};
