import ruMessages from '@/messages/ru.json';
import enMessages from '@/messages/en.json';

describe('Translations', () => {
  it('should have matching keys in both language files', () => {
    const ruKeys = getAllKeys(ruMessages);
    const enKeys = getAllKeys(enMessages);

    expect(ruKeys.sort()).toEqual(enKeys.sort());
  });

  it('should have all required common translations', () => {
    const requiredCommonKeys = [
      'language',
      'russian',
      'english',
      'loading',
      'error',
      'save',
      'cancel',
      'close',
    ];

    requiredCommonKeys.forEach((key) => {
      expect(ruMessages.common).toHaveProperty(key);
      expect(enMessages.common).toHaveProperty(key);
    });
  });

  it('should have all required calculator translations', () => {
    const requiredCalculatorKeys = [
      'title',
      'birthDate',
      'day',
      'month',
      'year',
      'calculate',
      'results',
      'workingNumbers',
      'pythagoreanSquare',
      'destinyNumber',
      'destinyMatrix',
    ];

    requiredCalculatorKeys.forEach((key) => {
      expect(ruMessages.calculator).toHaveProperty(key);
      expect(enMessages.calculator).toHaveProperty(key);
    });
  });

  it('should have all required validation translations', () => {
    const requiredValidationKeys = [
      'invalidDate',
      'futureDate',
      'dateBeforeMin',
      'required',
      'invalidEmail',
      'passwordTooShort',
    ];

    requiredValidationKeys.forEach((key) => {
      expect(ruMessages.validation).toHaveProperty(key);
      expect(enMessages.validation).toHaveProperty(key);
    });
  });

  it('should not have empty translation values', () => {
    const allRuValues = getAllValues(ruMessages);
    const allEnValues = getAllValues(enMessages);

    allRuValues.forEach((value) => {
      expect(value).toBeTruthy();
      expect(value.trim()).not.toBe('');
    });

    allEnValues.forEach((value) => {
      expect(value).toBeTruthy();
      expect(value.trim()).not.toBe('');
    });
  });
});

// Helper function to get all keys from nested object
function getAllKeys(obj: any, prefix = ''): string[] {
  let keys: string[] = [];

  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

// Helper function to get all values from nested object
function getAllValues(obj: any): string[] {
  let values: string[] = [];

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      values = values.concat(getAllValues(obj[key]));
    } else {
      values.push(obj[key]);
    }
  }

  return values;
}
