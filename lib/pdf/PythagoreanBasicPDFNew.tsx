import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import {
  generateIntroduction,
  generateCellInterpretation,
  generateOverallPicture,
  generateSummary,
  generateHowToUse,
  generateNextSteps,
} from '../generators/pythagoreanReportGenerator';
import { cellNames } from '../interpretations/pythagoreanBasicInterpretations';

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
    backgroundColor: '#ffffff',
  },
  // Заголовок с логотипом
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  logo: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#7C3AED',
    marginBottom: 5,
    letterSpacing: 2,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#1F2937',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 15,
  },
  divider: {
    borderBottom: '2pt solid #D97706',
    marginVertical: 15,
  },
  // Секции
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: '#7C3AED',
    marginTop: 15,
    marginBottom: 10,
  },
  text: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.6,
    marginBottom: 10,
  },
  // Квадрат Пифагора
  squareContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 15,
    justifyContent: 'center',
  },
  squareCell: {
    width: '33.33%',
    padding: 15,
    border: '1pt solid #D1D5DB',
    textAlign: 'center',
  },
  squareCellValue: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#D97706',
  },
  // Интерпретации ячеек
  cellInterpretation: {
    marginBottom: 12,
  },
  cellTitle: {
    fontSize: 11,
    fontFamily: 'Roboto-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  cellContent: {
    fontSize: 10,
    color: '#4B5563',
    lineHeight: 1.6,
  },
  // Итог
  summaryBox: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    marginVertical: 10,
    borderLeft: '3pt solid #7C3AED',
  },
  summaryText: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 5,
  },
  // Список
  listItem: {
    fontSize: 10,
    color: '#4B5563',
    marginBottom: 6,
    paddingLeft: 10,
  },
  // Футер
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 9,
    color: '#9CA3AF',
    borderTop: '1pt solid #E5E7EB',
    paddingTop: 10,
  },
});

interface PythagoreanBasicPDFNewProps {
  userName: string;
  birthDate: { day: number; month: number; year: number };
  square: number[];
  purchaseDate: string;
}

export const PythagoreanBasicPDFNew: React.FC<PythagoreanBasicPDFNewProps> = ({
  userName,
  birthDate,
  square,
  purchaseDate,
}) => {
  const formattedDate = `${birthDate.day.toString().padStart(2, '0')}.${birthDate.month.toString().padStart(2, '0')}.${birthDate.year}`;
  const introduction = generateIntroduction(userName);
  const overallPicture = generateOverallPicture(square);
  const summary = generateSummary(square);
  const howToUse = generateHowToUse();
  const nextSteps = generateNextSteps();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>✦ FATOS.PRO ✦</Text>
          <Text style={styles.title}>ТВОЙ ЛИЧНЫЙ ЦИФРОВОЙ ПОРТРЕТ</Text>
          <Text style={styles.subtitle}>По дате рождения {formattedDate}</Text>
        </View>

        <View style={styles.divider} />

        {/* Введение */}
        <Text style={styles.sectionTitle}>Вступление</Text>
        <Text style={styles.text}>{introduction}</Text>

        <View style={styles.divider} />

        {/* Квадрат Пифагора */}
        <Text style={styles.sectionTitle}>Твой Квадрат Пифагора</Text>
        <View style={styles.squareContainer}>
          {[1, 4, 7, 2, 5, 8, 3, 6, 9].map((num) => {
            const count = square[num - 1];
            let display = '---';
            if (count > 0) {
              display = num.toString().repeat(count);
            }
            return (
              <View key={num} style={styles.squareCell}>
                <Text style={styles.squareCellValue}>{display}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.divider} />

        {/* О чём говорят твои цифры */}
        <Text style={styles.sectionTitle}>О чём говорят твои цифры</Text>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => {
          const count = square[digit - 1];
          const interpretation = generateCellInterpretation(digit, count);
          return (
            <View key={digit} style={styles.cellInterpretation}>
              <Text style={styles.cellTitle}>
                {digit}. {interpretation.title}
              </Text>
              <Text style={styles.cellContent}>{interpretation.content}</Text>
            </View>
          );
        })}
      </Page>

      {/* Вторая страница */}
      <Page size="A4" style={styles.page}>
        <View style={styles.divider} />

        {/* Общая картина */}
        <Text style={styles.sectionTitle}>Общая картина</Text>
        <Text style={styles.text}>{overallPicture}</Text>

        <View style={styles.divider} />

        {/* Твои главные опоры */}
        <Text style={styles.sectionTitle}>Твои главные опоры</Text>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>Самая сильная цифра: {summary.strongest}</Text>
          <Text style={styles.summaryText}>Самая слабая цифра: {summary.weakest}</Text>
          <Text style={styles.summaryText}>{summary.mainSupport}</Text>
          <Text style={styles.summaryText}>{summary.growthZone}</Text>
        </View>

        <View style={styles.divider} />

        {/* Как с этим жить */}
        <Text style={styles.sectionTitle}>Как с этим жить</Text>
        <Text style={styles.text}>Этот отчёт — не инструкция. Это карта. Ты сама решаешь, куда идти.</Text>
        {howToUse.map((item, index) => (
          <Text key={index} style={styles.listItem}>• {item}</Text>
        ))}

        <View style={styles.divider} />

        {/* А если хочется глубже? */}
        <Text style={styles.sectionTitle}>А если хочется глубже?</Text>
        <Text style={styles.text}>{nextSteps}</Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={{ fontFamily: 'Roboto-Bold', marginBottom: 3 }}>FATOS — твои цифры, твой путь.</Text>
          <Text>Дата формирования отчета: {new Date(purchaseDate).toLocaleDateString('ru-RU')}</Text>
        </View>
      </Page>
    </Document>
  );
};
