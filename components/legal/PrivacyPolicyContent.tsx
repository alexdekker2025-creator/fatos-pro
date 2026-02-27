interface PrivacyPolicyContentProps {
  locale: string;
}

export default function PrivacyPolicyContent({ locale }: PrivacyPolicyContentProps) {
  if (locale === 'ru') {
    return (
      <article className="prose prose-purple max-w-none">
        <h1 className="text-4xl font-bold text-purple-700 mb-6">ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ</h1>
        
        <p className="text-sm text-gray-600 mb-4">
          Документ размещен на интернет-сайте: <a href="https://www.fatos.pro" className="text-purple-600 hover:text-purple-800">www.fatos.pro</a>
        </p>

        <div className="bg-white rounded-lg p-6 mb-6">
          <p className="text-gray-700 mb-4 leading-relaxed">
            Настоящая Политика конфиденциальности персональных данных (далее – Политика, Политика конфиденциальности) действует в отношении всей информации, размещенной на сайте в сети Интернет по адресу: www.fatos.pro (далее - Сайт), которую владелец сайта (далее - Оператор) может получить о Пользователе (посетители и другие пользователи Сайта) во время использования Сайта, их сервисов, программ и продуктов.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Использование Сайта, их сервисов, программ и продуктов означает безоговорочное согласие Пользователя с настоящей Политикой и указанными в ней условиями обработки его персональной информации; в случае несогласия с этими условиями Пользователь должен воздержаться от использования сервисов, программ, продуктов и Сайтов.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Настоящая Политика конфиденциальности применяется только к Сайту www.fatos.pro и не контролирует, не несет ответственности за сайты третьих лиц, на которые Пользователь может перейти по ссылкам, доступным на Сайте www.fatos.pro.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">1. ОБЩИЕ ПОЛОЖЕНИЯ</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1.1. В настоящей Политике используются следующие термины:</h3>
          
          <div className="ml-4 mb-4">
            <p className="text-gray-700 mb-3 leading-relaxed">
              <strong>1.1.1.</strong> &ldquo;Администрация Cайта&rdquo; (далее – Администрация Сайта) – сотрудники на управление Сайтом, которые организуют и (или) осуществляют обработку персональных данных, а также определяют цели обработки персональных данных, состав персональных данных, подлежащих обработке, действия (операции), совершаемые с персональными данными.
            </p>
            
            <p className="text-gray-700 mb-2 leading-relaxed">
              <strong>1.1.2.</strong> В рамках настоящей Политики под персональной информацией Пользователя понимаются:
            </p>
            <div className="ml-6 mb-4">
              <p className="text-gray-700 mb-2 leading-relaxed">
                <strong>1.1.2.1.</strong> Персональная информация, которую Пользователь предоставляет о себе самостоятельно при использовании Сайта, его сервисов, программ и продуктов, включая персональные данные Пользователя. Обязательная для предоставления сервисов Сайта информация помечена специальным образом. Иная информация предоставляется Пользователем на его усмотрение.
              </p>
              <p className="text-gray-700 mb-2 leading-relaxed">
                <strong>1.1.2.2.</strong> Данные, которые автоматически передаются сервисам, программам и продуктам Сайта в процессе их использования с помощью установленного на устройстве Пользователя программного обеспечения, в том числе IP-адрес, данные файлов Cookies, информация о браузере Пользователя (или иной программе, с помощью которой осуществляется доступ к сервисам, программам и продуктам Сайтов), технические характеристики оборудования и программного обеспечения, используемых Пользователем, дата и время доступа к сервисам, программам и продуктам Сайтов, адреса запрашиваемых страниц и иная подобная информация.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>1.1.2.3.</strong> Иная информация о Пользователе, обработка которой предусмотрена при использовании Сайтов, их сервисов, программ и продуктов.
              </p>
            </div>
            
            <p className="text-gray-700 mb-3 leading-relaxed">
              <strong>1.1.3.</strong> &ldquo;Персональные данные&rdquo; - любая информация, относящаяся к прямо или косвенно определенному или определяемому физическому лицу (субъекту персональных данных).
            </p>
            
            <p className="text-gray-700 mb-3 leading-relaxed">
              <strong>1.1.4.</strong> &ldquo;Обработка персональных данных&rdquo; - любое действие (операция) или совокупность действий (операций), совершаемых с использованием средств автоматизации или без использования таких средств с персональными данными, включая сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передачу (распространение, предоставление, доступ), обезличивание, блокирование, удаление, уничтожение персональных данных.
            </p>
            
            <p className="text-gray-700 mb-3 leading-relaxed">
              <strong>1.1.5.</strong> &ldquo;Конфиденциальность персональных данных&rdquo; - обязательное для соблюдения Администрацией Сайтов или иным получившим доступ к персональным данным лицом требование не раскрывать третьим лицам и не распространять персональные данные без согласия субъекта персональных данных.
            </p>
            
            <p className="text-gray-700 mb-3 leading-relaxed">
              <strong>1.1.6.</strong> &ldquo;Cookies&rdquo; — небольшой фрагмент данных, отправленный веб-сервером и хранимый на компьютере пользователя, который веб-клиент или веб-браузер каждый раз пересылает веб-серверу в HTTP-запросе при попытке открыть страницу соответствующего сайта.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              <strong>1.1.7.</strong> &ldquo;IP-адрес&rdquo; — уникальный сетевой адрес узла в компьютерной сети, построенной по протоколу IP.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">2. ЦЕЛИ ОБРАБОТКИ ПЕРСОНАЛЬНОЙ ИНФОРМАЦИИ ПОЛЬЗОВАТЕЛЕЙ</h2>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            <strong>2.1.</strong> Сайты собирают и хранят только ту персональную информацию, которая необходима для предоставления сервисов, программ и продуктов Сайта за исключением случаев, когда законодательством предусмотрено обязательное хранение персональной информации в течение определенного законом срока.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            <strong>2.2.</strong> Персональную информацию Пользователя Сайта обрабатывают в целях заключения договора (договоров), стороной которого (которых) является Пользователь, при условии того, что персональные данные не распространяются, а также не предоставляются третьим лицам без согласия Пользователя и используются для исполнения указанного договора и заключения договоров с Пользователем.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">3. ПРЕДМЕТ ПОЛИТИКИ КОНФИДЕНЦИАЛЬНОСТИ</h2>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            <strong>3.1.</strong> Настоящая Политика конфиденциальности устанавливает обязательства Администрации Сайта по неразглашению и обеспечению режима защиты конфиденциальности персональной информации, которые Пользователь предоставляет при использовании сервисов, программ, продуктов Сайтов и отправке запросов.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>3.2.</strong> Персональные данные, разрешённые к обработке в рамках настоящей Политики конфиденциальности, предоставляются Пользователем путём заполнения формы на Сайтах в разделах «Форма обратной связи», «Расчет» включают в себя следующую информацию:
          </p>
          
          <div className="ml-6 mb-4">
            <p className="text-gray-700 mb-2 font-semibold">3.2.1. Для раздела &laquo;Форма обратной связи&raquo;:</p>
            <ul className="list-disc ml-6 mb-4 text-gray-700">
              <li>Имя Пользователя;</li>
              <li>Актуальный контактный номер телефона Пользователя;</li>
              <li>Место нахождения (город) Пользователя.</li>
            </ul>
            
            <p className="text-gray-700 mb-2 font-semibold">3.2.2. Для раздела &laquo;Расчет&raquo;:</p>
            <ul className="list-disc ml-6 mb-4 text-gray-700">
              <li>Фамилию Имя Отчество Пользователя;</li>
              <li>Место рождения Пользователя;</li>
              <li>Электронная почта;</li>
              <li>Дата и место рождения Пользователя.</li>
            </ul>
          </div>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            <strong>3.3.</strong> Сайты используют Cookies для целей, изложенных в разделе 2 настоящей Политики конфиденциальности.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            <strong>3.4.</strong> Любая иная персональная информация, неоговоренная выше, подлежит надежному хранению и нераспространению, за исключением случая, предусмотренного в пп. 4.3. настоящей Политики конфиденциальности.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">4. УСЛОВИЯ ОБРАБОТКИ ПЕРСОНАЛЬНОЙ ИНФОРМАЦИИ ПОЛЬЗОВАТЕЛЕЙ И ЕЕ ПЕРЕДАЧИ ТРЕТЬИМ ЛИЦАМ</h2>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            <strong>4.1.</strong> Сайты хранят персональную информацию Пользователей в соответствии с внутренними регламентами конкретных сервисов.
          </p>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            <strong>4.2.</strong> В отношении персональной информации Пользователя сохраняется ее конфиденциальность, кроме случаев добровольного предоставления Пользователем информации о себе для общего доступа неограниченному кругу лиц. При использовании отдельных сервисов, программ и продуктов Сайта Пользователь соглашается с тем, что определенная часть его персональной информации становится общедоступной.
          </p>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            <strong>4.3.</strong> Сайты вправе передать персональную информацию Пользователя третьим лицам в случае, когда Пользователь прямо выразил согласие на такое действие, либо путем использования Пользователем определенного сервиса, продукта или программы Сайта, либо в целях исполнения определенного соглашения или договора, стороной которого, выгодоприобретателем или поручителем по которому является Пользователь.
          </p>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            <strong>4.4.</strong> Пользователь соглашается с тем, что Администрация сайта вправе передавать персональные данные третьим лицам, исключительно в целях выполнения заказа Пользователя, оформленного на Сайте.
          </p>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            <strong>4.5.</strong> Обработка персональных данных Пользователя осуществляется без ограничения срока любым законным способом, в том числе в информационных системах персональных данных с использованием средств автоматизации или без использования таких средств. Обработка персональных данных Пользователей осуществляется в соответствии с Федеральным законом от 27 июля 2006 г. № 152-ФЗ &laquo;О персональных данных&raquo;.
          </p>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            <strong>4.6.</strong> При утрате или разглашении персональных данных Администрация Сайта информирует Пользователя об утрате или разглашении персональных данных.
          </p>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            <strong>4.7.</strong> Администрация Сайта принимает необходимые организационные и технические меры для защиты персональной информации Пользователя от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, распространения, а также от иных неправомерных действий третьих лиц.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            <strong>4.8.</strong> Администрация Сайта совместно с Пользователем принимает все необходимые меры по предотвращению убытков или иных отрицательных последствий, вызванных утратой или разглашением персональных данных Пользователя.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">5. ОБЯЗАТЕЛЬСТВА СТОРОН</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.1. Пользователь обязан:</h3>
          <p className="text-gray-700 mb-4 leading-relaxed ml-4">
            <strong>5.1.1.</strong> Предоставить информацию о персональных данных, необходимую для пользования Сайтом, его сервисами, программами и продуктами. При предоставлении Пользователем информации о персональных данных презюмируется добросовестность Пользователя и достоверность предоставляемой им информации.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.2. Администрация Сайта обязана:</h3>
          <div className="ml-4">
            <p className="text-gray-700 mb-4 leading-relaxed">
              <strong>5.2.1.</strong> Использовать полученную информацию исключительно для целей, указанных в настоящей Политике конфиденциальности.
            </p>
            
            <p className="text-gray-700 mb-4 leading-relaxed">
              <strong>5.2.2.</strong> Обеспечить хранение конфиденциальной информации в тайне, не разглашать без предварительного письменного разрешения Пользователя, а также не осуществлять продажу, обмен, опубликование либо разглашение иными возможными способами переданных персональных данных Пользователя, за исключением предусмотренных настоящей Политикой конфиденциальности.
            </p>
            
            <p className="text-gray-700 mb-4 leading-relaxed">
              <strong>5.2.3.</strong> Принимать меры предосторожности для защиты конфиденциальности персональных данных Пользователя согласно порядку, обычно используемому для защиты такого рода информации в существующем деловом обороте.
            </p>
            
            <p className="text-gray-700 mb-4 leading-relaxed">
              <strong>5.2.4.</strong> Осуществить блокирование персональных данных, относящихся к соответствующему Пользователю, с момента обращения или запроса Пользователя или его законного представителя либо уполномоченного органа по защите прав субъектов персональных данных на период проверки в случае выявления недостоверных персональных данных или неправомерных действий. Данный запрос должен быть отправлен по электронной почте Администрации Сайта: <a href="mailto:www.fatos.pro@gmail.com" className="text-purple-600 hover:text-purple-800">www.fatos.pro@gmail.com</a>
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              <strong>5.2.5.</strong> В случае отзыва Пользователем согласия на обработку его персональных данных прекратить их обработку или обеспечить прекращение такой обработки и в случае, если сохранение персональных данных более не требуется для целей обработки персональных данных, уничтожить персональные данные или обеспечить уничтожение персональных данных в срок, не превышающий 30 (тридцать) дней с даты поступления указанного отзыва, если иное не предусмотрено договором, стороной которого, выгодоприобретателем или поручителем по которому является Пользователь.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">6. ОТВЕТСТВЕННОСТЬ СТОРОН</h2>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            <strong>6.1.</strong> Администрация Сайта, не исполнившая свои обязательства, несет ответственность за убытки, понесенные Пользователем в связи с неправомерным использованием персональных данных, в соответствии с законодательством Российской Федерации.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>6.2.</strong> В случае утраты или разглашения конфиденциальной информации Администрация Сайтов не несет ответственности, если данная конфиденциальная информация:
          </p>
          
          <div className="ml-6">
            <p className="text-gray-700 mb-2 leading-relaxed">
              <strong>6.2.1.</strong> Стала публичным достоянием до ее утраты или разглашения.
            </p>
            <p className="text-gray-700 mb-2 leading-relaxed">
              <strong>6.2.2.</strong> Была получена от третьей стороны до момента ее получения Администрацией Сайта.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>6.2.3.</strong> Была разглашена с согласия Пользователя.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">7. РАЗРЕШЕНИЕ СПОРОВ</h2>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            <strong>7.1.</strong> До обращения в суд с иском по спорам, возникающим из отношений между Пользователем Сайтов и Администрацией Сайтов, обязательным является предъявление претензии (письменного предложения о добровольном урегулировании спора).
          </p>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            <strong>7.2.</strong> Получатель претензии в течение 20 (двадцати) календарных дней со дня получения претензии письменно уведомляет заявителя претензии о результатах рассмотрения претензии.
          </p>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            <strong>7.3.</strong> При недостижении соглашения спор будет передан на рассмотрение в суд в соответствии с действующим законодательством Российской Федерации.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            <strong>7.4.</strong> К настоящей Политике конфиденциальности и отношениям между Пользователем и Администрацией Сайта применяется действующее законодательство Российской Федерации.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">8. ДОПОЛНИТЕЛЬНЫЕ УСЛОВИЯ</h2>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            <strong>8.1.</strong> Администрация Сайта вправе вносить изменения в настоящую Политику конфиденциальности без согласия Пользователя.
          </p>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            <strong>8.2.</strong> Новая Политика конфиденциальности вступает в силу с момента ее размещения на Сайте, если иное не предусмотрено новой редакцией Политики конфиденциальности.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            <strong>8.3.</strong> Все предложения или вопросы по настоящей Политике конфиденциальности следует сообщать по электронной почте Администрации Сайта: <a href="mailto:www.fatos.pro@gmail.com" className="text-purple-600 hover:text-purple-800">www.fatos.pro@gmail.com</a>
          </p>
        </section>
      </article>
    );
  }

  // English version (simplified)
  return (
    <article className="prose prose-purple max-w-none">
      <h1 className="text-4xl font-bold text-purple-700 mb-6">PRIVACY POLICY</h1>
      
      <p className="text-sm text-gray-600 mb-4">
        Document published at: <a href="https://www.fatos.pro" className="text-purple-600 hover:text-purple-800">www.fatos.pro</a>
      </p>

      <div className="bg-white rounded-lg p-6 mb-6">
        <p className="text-gray-700 mb-4 leading-relaxed">
          This Privacy Policy applies to all information posted on the website at www.fatos.pro (hereinafter - the Site), which the site owner (hereinafter - the Operator) may receive about the User (visitors and other users of the Site) during the use of the Site, their services, programs and products.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Use of the Site, their services, programs and products means the User's unconditional consent to this Policy and the conditions specified in it for processing their personal information.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">1. GENERAL PROVISIONS</h2>
        <p className="text-gray-700 leading-relaxed">
          The Site collects and stores only the personal information necessary to provide the Site's services, programs and products, except in cases where the law provides for mandatory storage of personal information for a period determined by law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">2. DATA COLLECTION</h2>
        <p className="text-gray-700 leading-relaxed">
          We collect information you provide during registration, including name, email, and birth date for numerological calculations. We also automatically collect data about service usage.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">3. DATA USAGE</h2>
        <p className="text-gray-700 leading-relaxed">
          Your data is used to provide numerological calculations, improve the service, and communicate with you about your account.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">4. DATA PROTECTION</h2>
        <p className="text-gray-700 leading-relaxed">
          We use modern encryption and security methods to protect your data. Only authorized personnel have access to personal data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">5. CONTACT</h2>
        <p className="text-gray-700 leading-relaxed">
          For questions about this Privacy Policy, contact us at: <a href="mailto:www.fatos.pro@gmail.com" className="text-purple-600 hover:text-purple-800">www.fatos.pro@gmail.com</a>
        </p>
      </section>
    </article>
  );
}
