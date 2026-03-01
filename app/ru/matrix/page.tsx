'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePurchases } from '@/lib/hooks/usePurchases';
import { useUpgradeEligibility } from '@/lib/hooks/useUpgradeEligibility';
import StarryBackground from '@/components/StarryBackground';
import AuthButton from '@/components/AuthButton';
import AuthModal from '@/components/AuthModal';
import UpgradeButton from '@/components/UpgradeButton';
import { validateBirthDate } from '@/lib/validation/date';
import { DestinyMatrixCalculator, DestinyMatrixResult } from '@/lib/calculators/destinyMatrix';
import { calculateAge } from '@/lib/utils/ageCalculation';
import MatrixWithHealth from '@/components/matrix/MatrixWithHealth';

export default function MatrixPage() {
  const { user } = useAuth();
  const { hasPurchased } = usePurchases();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Calculator state
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [dateError, setDateError] = useState('');
  const [matrix, setMatrix] = useState<DestinyMatrixResult | null>(null);
  const [age, setAge] = useState<number | null>(null);
  
  // Check purchases
  const hasBasic = user && hasPurchased('matrix_basic');
  const hasFull = user && hasPurchased('matrix_full');
  
  // Check upgrade eligibility
  const { isEligible: isUpgradeEligible, upgradePrice } = useUpgradeEligibility('matrix_full');

  const handleCalculate = () => {
    // Check if user is logged in
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    // Validate date
    const birthDate = {
      day: parseInt(day),
      month: parseInt(month),
      year: parseInt(year)
    };
    
    const validation = validateBirthDate(birthDate);
    if (!validation.isValid) {
      setDateError(validation.error || 'Неверная дата');
      return;
    }
    
    setDateError('');
    
    // Calculate Destiny Matrix
    const calculator = new DestinyMatrixCalculator();
    const result = calculator.calculate(birthDate);
    setMatrix(result);
    
    // Calculate age
    const calculatedAge = calculateAge(birthDate);
    setAge(calculatedAge);
  };

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      <StarryBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sm:mb-8 animate-fade-in">
          <Link
            href="/ru"
            className="text-white hover:text-purple-200 transition-colors"
          >
            ← Назад
          </Link>
          <AuthButton />
        </div>

        {/* Title */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            Матрица Судьбы
          </h1>
          <p className="text-purple-200">
            Ваш путь через призму арканов Таро
          </p>
        </div>

        {/* Info Block */}
        <div className="mb-8 glass-strong rounded-lg p-6 sm:p-8 border border-purple-400/30">
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 mb-6 text-center">
            Матрица Судьбы: что это такое?
          </h2>

          <div className="space-y-6 text-purple-100">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Что это за система?
              </h3>
              <p className="text-purple-200 leading-relaxed">
                Матрица Судьбы — это метод нумерологического анализа личности, основанный на дате рождения 
                и системе арканов Таро. Это диаграмма, которая показывает ваши таланты, предназначение, 
                кармические задачи и жизненные циклы.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Как это работает?
              </h3>
              <p className="text-purple-200 leading-relaxed">
                Метод использует дату рождения для расчета ключевых арканов, которые влияют на разные 
                аспекты вашей жизни: личность, таланты, отношения, карьеру, здоровье и духовное развитие.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Что вы узнаете?
              </h3>
              <p className="text-purple-200 leading-relaxed">
                Матрица покажет ваши сильные стороны, скрытые таланты, кармические задачи, 
                особенности отношений с родителями и партнерами, а также ваш жизненный путь 
                и предназначение.
              </p>
            </div>
          </div>
        </div>

        {/* Calculator */}
        <div className="mb-8 glass-strong rounded-lg p-6 sm:p-8 border border-purple-400/30">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-6 text-center">
            Введите данные для расчета
          </h2>
          
          <div className="max-w-md mx-auto space-y-4">
            {/* Name Input */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
              className="w-full px-4 py-2 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 min-h-[44px] bg-white/10 backdrop-blur-sm text-white border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700] hover:border-purple-400/50 placeholder-purple-300"
            />
            
            <div className="grid grid-cols-3 gap-3">
              {/* Day Select */}
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full px-4 py-2 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 min-h-[44px] bg-white/10 backdrop-blur-sm text-white border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700] hover:border-purple-400/50"
              >
                <option value="" className="bg-purple-900">День</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d} className="bg-purple-900">
                    {d}
                  </option>
                ))}
              </select>

              {/* Month Select */}
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-4 py-2 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 min-h-[44px] bg-white/10 backdrop-blur-sm text-white border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700] hover:border-purple-400/50"
              >
                <option value="" className="bg-purple-900">Месяц</option>
                {[
                  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
                ].map((m, i) => (
                  <option key={i + 1} value={i + 1} className="bg-purple-900">
                    {m}
                  </option>
                ))}
              </select>

              {/* Year Select */}
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-2 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 min-h-[44px] bg-white/10 backdrop-blur-sm text-white border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700] hover:border-purple-400/50"
              >
                <option value="" className="bg-purple-900">Год</option>
                {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <option key={y} value={y} className="bg-purple-900">
                    {y}
                  </option>
                ))}
              </select>
            </div>
            
            {dateError && (
              <div className="text-red-400 text-sm mb-4 text-center">
                {dateError}
              </div>
            )}
            
            <button
              onClick={handleCalculate}
              className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-purple-950 font-bold rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Рассчитать матрицу
            </button>
          </div>
        </div>

        {/* Matrix Display */}
        {matrix && (
          <div className="space-y-8 animate-fade-in">
            {/* Combined Matrix and Health */}
            <MatrixWithHealth 
              result={matrix}
              name={name}
              birthDate={{ day: parseInt(day), month: parseInt(month), year: parseInt(year) }}
              age={age}
            />
          </div>
        )}

        {/* Pricing Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-12">
          {/* Start Tier - 3500₽ */}
          <div className="glass-strong rounded-xl p-6 sm:p-8 border border-purple-400/30 flex flex-col">
            <div className="text-center mb-4">
              <div className="text-4xl mb-3">🔮</div>
              <h3 className="text-xl font-bold text-white mb-2">МАТРИЦА СУДЬБЫ — СТАРТ</h3>
              <div className="text-3xl font-bold text-amber-400 mb-1">3500 ₽</div>
            </div>
            
            <div className="flex-grow mb-6">
              <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                🌱 <strong className="text-white">Это ваш первый шаг к пониманию себя</strong><br/>
                Матрица судьбы — это карта вашей жизни, составленная по дате рождения. 22 аркана, 5 ключевых позиций и никакой воды. Только то, что относится лично к вам.
              </p>

              <h4 className="text-white font-semibold mb-3 text-sm">Вы получите ответы на вопросы:</h4>
              <div className="space-y-2 text-purple-200 text-sm mb-4">
                <p>Какая энергия дана мне от рождения?</p>
                <p>В чём моя главная опора?</p>
                <p>Куда двигаться, чтобы чувствовать себя на своём месте?</p>
              </div>

              <h4 className="text-white font-semibold mb-3 text-sm">🎨 Что внутри</h4>
              <ul className="space-y-2 text-purple-200 text-sm mb-4">
                <li>🔹 <strong className="text-white">Личный квадрат — 4 главных аркана</strong><br/>Месяц, день, год рождения и их сумма. Это ваши таланты, характер, финансовая энергия и зона роста.</li>
                <li>🔹 <strong className="text-white">Центр матрицы</strong><br/>Ваша точка покоя и внутренний ресурс. То, что восстанавливает, когда силы на исходе.</li>
                <li>🔹 <strong className="text-white">Краткая расшифровка каждой позиции</strong><br/>Коротко, по делу, без заумных терминов.</li>
                <li>🔹 <strong className="text-white">Общий вывод</strong><br/>Главная задача, талант и зона роста — собрано в один понятный итог.</li>
                <li>🔹 <strong className="text-white">«Как с этим жить»</strong><br/>Простые, тёплые рекомендации — с чего начать и на что опираться.</li>
              </ul>

              <h4 className="text-white font-semibold mb-2 text-sm">💝 Для кого этот тариф</h4>
              <ul className="space-y-1 text-purple-200 text-xs mb-4">
                <li>✅ Для первого знакомства с матрицей</li>
                <li>✅ Для тех, кто хочет понять свои основные энергии</li>
                <li>✅ Для тех, кто не готов к глубокому разбору, но хочет получить опору</li>
              </ul>

              <h4 className="text-white font-semibold mb-2 text-sm">💎 Почему это стоит 3500 ₽</h4>
              <p className="text-purple-200 text-xs mb-2">Потому что это:</p>
              <ul className="space-y-1 text-purple-200 text-xs mb-3">
                <li>не общая статья из интернета (всё под вашу дату)</li>
                <li>не «вода» и абстракции (только суть)</li>
                <li>не консультация с ожиданием (вы получаете PDF сразу)</li>
              </ul>
              <p className="text-purple-200 text-xs leading-relaxed">
                Это вход в мир арканов. Достаточно, чтобы увидеть направление. А если захотите глубже — для этого есть «Глубокий» тариф.
              </p>

              <div className="bg-white/5 rounded-lg p-3 mt-4">
                <p className="text-purple-200 text-xs leading-relaxed">
                  🔥 <strong className="text-white">Главное</strong><br/>
                  Старт — это не «урезанная версия». Это полноценный разбор, который даёт ответы на главные вопросы. Просто без родовых программ и линий судьбы. Всему свое время.
                </p>
              </div>
            </div>
            
            <button
              disabled
              className="w-full py-3 px-6 rounded-lg font-semibold bg-gray-600 text-gray-400 cursor-not-allowed"
            >
              Скоро доступно
            </button>
          </div>

          {/* Deep Tier - 5500₽ */}
          <div className="glass-strong rounded-xl p-6 sm:p-8 border-2 border-amber-500/50 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-purple-950 text-xs font-bold px-3 py-1 rounded-bl-lg">
              🔥 ПОПУЛЯРНЫЙ
            </div>
            
            <div className="text-center mb-4 mt-2">
              <div className="text-4xl mb-3">🔥</div>
              <h3 className="text-xl font-bold text-white mb-2">МАТРИЦА СУДЬБЫ — ГЛУБОКИЙ РАЗБОР</h3>
              <div className="text-3xl font-bold text-amber-400 mb-1">5500 ₽</div>
            </div>
            
            <div className="flex-grow mb-6">
              <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                🍃 <strong className="text-white">Это не просто «больше страниц». Это ответ на вопрос «что со всем этим делать»</strong><br/>
                В тарифе «Старт» вы получили свои главные арканы, увидели основные энергии и поняли направление. Этого достаточно, чтобы сделать первый шаг.
              </p>
              <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                Но если вы чувствуете, что готовы к большему — если вам мало просто «знать», вы хотите понимать, как это работает в связке и куда двигаться дальше — для этого есть «Глубокий» разбор.
              </p>

              <h4 className="text-white font-semibold mb-3 text-sm">🧠 Что вы получите дополнительно</h4>
              <ul className="space-y-2 text-purple-200 text-sm mb-4">
                <li>✅ <strong className="text-white">Всё из тарифа «Старт» — личный квадрат, 5 позиций, краткие расшифровки, общий вывод</strong></li>
                <li>✅ <strong className="text-white">Личный квадрат — всё 6 позиций</strong><br/>Добавляются линии талантов и отношений. Вы узнаете, как ваши энергии складываются в линии силы.</li>
                <li>✅ <strong className="text-white">Родовой квадрат (прямой) — полный разбор</strong><br/>Линия отца: что передано по мужской линии<br/>Линия матери: что передано по женской линии<br/>Что вы взяли от рода, а что нужно отработать</li>
                <li>✅ <strong className="text-white">Кармический хвост</strong><br/>Задачи, которые вы тянете из прошлого. То, что мешает, пока не осознать.</li>
                <li>✅ <strong className="text-white">Зона денег — отдельный разбор</strong><br/>Не просто «деньги», а объяснение: как вам зарабатывать, где искать финансовый поток, какие блоки мешают.</li>
                <li>✅ <strong className="text-white">Зона отношений — отдельный разбор</strong><br/>Какой партнёр вам нужен, почему вы притягиваете одних и тех же людей, как строить гармоничные связи.</li>
                <li>✅ <strong className="text-white">Полная расшифровка всех позиций</strong><br/>5–7 предложений на каждую — подробно, с душой, без воды.</li>
                <li>✅ <strong className="text-white">Связи и диссонансы</strong><br/>Где ваши энергии усиливают друг друга, а где конфликтуют. Почему иногда хочется одного, а получается другое.</li>
                <li>✅ <strong className="text-white">Практические рекомендации под вашу матрицу</strong><br/>Не общие советы, а конкретные шаги.</li>
              </ul>

              <div className="space-y-3 text-purple-200 text-xs mb-4">
                <p>В какой сфере реализовываться</p>
                <p>Как улучшить отношения</p>
                <p>Что делать с родовыми программами</p>
                <p>Какие энергии сейчас в минусе и как их вывести в плюс</p>
              </div>

              <h4 className="text-white font-semibold mb-2 text-sm">✅ Ссылки на другие продукты</h4>
              <p className="text-purple-200 text-xs mb-4">
                Мягкий анонс того, что будет дальше — включая отдельный разбор «Таланты и предназначение».
              </p>

              <h4 className="text-white font-semibold mb-2 text-sm">💝 Для кого этот тариф</h4>
              <ul className="space-y-1 text-purple-200 text-xs mb-4">
                <li>✅ Для кого этот тариф</li>
                <li>✅ Для тех, кто уже знаком с базой и хочет копнуть глубже</li>
                <li>✅ Для тех, кто готов работать с судьбой всерьёз</li>
                <li>✅ Для тех, кому мало «знать» — нужно понимать, что делать</li>
              </ul>

              <h4 className="text-white font-semibold mb-2 text-sm">💎 Почему это стоит 5500 ₽</h4>
              <p className="text-purple-200 text-xs mb-2">Потому что это:</p>
              <ul className="space-y-1 text-purple-200 text-xs mb-3">
                <li>не просто ещё один отчёт, а полная карта вашей жизни</li>
                <li>не абстрактные рассуждения, а конкретика под вашу дату</li>
                <li>не консультация с ожиданием, а PDF, который можно открывать снова и снова</li>
              </ul>
              <p className="text-purple-200 text-xs leading-relaxed mb-3">
                Базовый отчёт — это фотография.<br/>
                Глубокий — это инструкция к этой фотографии.
              </p>

              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-purple-200 text-xs leading-relaxed">
                  🔥 <strong className="text-white">Главное</strong><br/>
                  «Старт» даёт вам направление.<br/>
                  «Глубокий» даёт вам карту, компас и план действий.<br/>
                  <br/>
                  Выбирайте, что вам нужно сейчас.
                </p>
              </div>
            </div>
            
            {/* Conditional button rendering based on purchase status and upgrade eligibility */}
            {hasFull ? (
              <div className="w-full py-3 px-6 rounded-lg font-semibold text-center bg-green-600 text-white">
                ✅ У вас есть доступ
              </div>
            ) : hasBasic && isUpgradeEligible && upgradePrice ? (
              <UpgradeButton
                serviceId="matrix_full"
                price={upgradePrice}
                currency="RUB"
                locale="ru"
                onUpgradeClick={() => {}}
              />
            ) : !hasBasic && !hasFull ? (
              <button
                disabled={true}
                className="w-full py-3 px-6 rounded-lg font-semibold transition-all bg-gray-600 text-gray-400 cursor-not-allowed"
              >
                Скоро доступно
              </button>
            ) : (
              <button
                disabled={true}
                className="w-full py-3 px-6 rounded-lg font-semibold transition-all bg-gray-600 text-gray-400 cursor-not-allowed"
              >
                Скоро доступно
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </main>
  );
}
