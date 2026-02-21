import fs from 'fs';
import path from 'path';

describe('Middleware Configuration', () => {
  let middlewareContent: string;

  beforeAll(() => {
    const middlewarePath = path.join(process.cwd(), 'middleware.ts');
    middlewareContent = fs.readFileSync(middlewarePath, 'utf-8');
  });

  it('should redirect root path to default locale', () => {
    expect(middlewareContent).toContain('if (pathname === \'/\')');
    expect(middlewareContent).toContain('NextResponse.redirect');
    expect(middlewareContent).toContain('/ru');
  });

  it('should have matcher for pathnames', () => {
    expect(middlewareContent).toContain('matcher');
    expect(middlewareContent).toContain('/((?!api|_next|_vercel|.*\\\\..*).*)');
  });

  it('should export middleware function', () => {
    expect(middlewareContent).toContain('export function middleware');
    expect(middlewareContent).toContain('NextRequest');
  });
});

describe('i18n Configuration File', () => {
  let i18nContent: string;
  let i18nUtilsContent: string;

  beforeAll(() => {
    const i18nPath = path.join(process.cwd(), 'i18n.ts');
    const i18nUtilsPath = path.join(process.cwd(), 'i18n-utils.ts');
    i18nContent = fs.readFileSync(i18nPath, 'utf-8');
    i18nUtilsContent = fs.readFileSync(i18nUtilsPath, 'utf-8');
  });

  it('should define supported locales in i18n-utils', () => {
    expect(i18nUtilsContent).toContain('locales');
    expect(i18nUtilsContent).toContain('ru');
    expect(i18nUtilsContent).toContain('en');
  });

  it('should set Russian as default locale in i18n-utils', () => {
    expect(i18nUtilsContent).toContain('defaultLocale');
    expect(i18nUtilsContent).toContain('ru');
  });

  it('should validate incoming locale parameter', () => {
    expect(i18nContent).toContain('if (!locales.includes(validLocale as Locale))');
    expect(i18nContent).toContain('notFound()');
  });

  it('should dynamically import message files', () => {
    expect(i18nContent).toContain('import(`./messages/${validLocale}.json`)');
  });

  it('should return locale and messages', () => {
    expect(i18nContent).toContain('locale: validLocale');
    expect(i18nContent).toContain('messages:');
  });
});
