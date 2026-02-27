interface TermsOfServiceContentProps {
  locale: string;
}

export default function TermsOfServiceContent({ locale }: TermsOfServiceContentProps) {
  if (locale === 'ru') {
    return (
      <article className="prose prose-purple max-w-none">
        <h1 className="text-4xl font-bold text-purple-700 mb-6">Публичная оферта об использовании сервиса www.fatos.pro</h1>
        
        <p className="text-gray-700 mb-6 leading-relaxed">
          Перед использованием сервиса www.fatos.pro пожалуйста, ознакомьтесь с условиями этого документа.
        </p>
        
        <p className="text-gray-700 mb-8 leading-relaxed">
          Настоящий документ «Публичная оферта об использовании сервиса www.fatos.pro» представляет собой предложение Администрации сайта www.fatos.pro заключить договор на изложенных ниже условиях.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">1. ОСНОВНЫЕ ТЕРМИНЫ И ОПРЕДЕЛЕНИЯ</h2>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>1.1.</strong> Сервис www.fatos.pro (Сервис) – совокупность размещенных в сети Интернет веб-страниц, объединенных единым адресным пространством домена https://www.fatos.pro, а также интегрированные с ними приложения для мобильных устройств, предназначенные для ознакомления с информацией об Услугах и приобретения Услуг посредством сети Интернет.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>1.2.</strong> Администрация – осуществляющая деятельность по оказанию Услуг. Администрации принадлежат все соответствующие исключительные права на Сервис.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>1.3.</strong> Пользователь – физическое лицо, индивидуальный предприниматель или юридическое лицо, заключившие Договор с Администрацией в своем или чужом интересе условиях настоящей Оферты и, тем самым, получившие право использовать сервис и получать получить Услуги Администрации.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>1.4.</strong> Услуга – деятельность Администрации, связанная оказанием услуг по составлению индивидуальной информации о человеке на основании его имени и даты и рождения. В целях настоящей оферты под услугами понимается следующее: Предоставление доступа к полной расшифровке матрицы судьбы.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>1.5.</strong> Тариф – определенный пакет услуг, предоставляемый Пользователю за установленную плату, на условиях ограниченного или неограниченного доступа. С детальным описанием каждого тарифа и его актуальной стоимостью можно ознакомиться на сайте www.fatos.pro.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>1.6.</strong> Заказ – оформленный надлежащим образом запрос Пользователя на оказание Услуг.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>1.7.</strong> Оферта – текст настоящего документа со всеми приложениями, изменениями и дополнениями к нему, размещенный в Сервисе и содержащий условия и порядок использования Сервиса и оказания Услуг.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>1.8.</strong> Договор – договор на использование Сервиса и оказание Услуг, который заключается и исполняется Администрацией и Пользователем в порядке и на условиях, предусмотренных настоящей Офертой.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            <strong>1.9.</strong> Правила – совокупность прав и обязанностей пользователей Сервиса.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">2. ОБЩИЕ ПОЛОЖЕНИЯ</h2>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>2.1.</strong> Договор, заключенный на условиях настоящей Оферты является юридически обязательным документом и регулирует отношения между Администрацией и Пользователем, возникающие при использовании Сервиса и приобретении Услуг.
          </p>
          
          <p className="text-gray-700 mb-2 leading-relaxed">
            <strong>2.2.</strong> Приобретая Услуги посредством Сервиса, Пользователь соглашается с тем, что:
          </p>
          
          <div className="ml-6 mb-4">
            <p className="text-gray-700 mb-2 leading-relaxed">а) он ознакомился с условиями настоящей Оферты в полном объеме.</p>
            <p className="text-gray-700 mb-2 leading-relaxed">б) оплата Услуг означает, что он принимает все условия настоящей Оферты в полном объеме без каких-либо изъятий и ограничений с его стороны (акцепт). Договор, заключаемый путем акцепта настоящей Оферты, не требует двустороннего подписания и действителен в электронном виде.</p>
            <p className="text-gray-700 mb-2 leading-relaxed">в) если Пользователь не согласен с условиями настоящей Оферты или не имеет права на заключение Договора в силу закона, ему следует отказаться от использования Сервиса.</p>
            <p className="text-gray-700 mb-2 leading-relaxed">г) Оферта (в том числе любая из ее частей) может быть изменена Администрацией без какого-либо специального уведомления. Новая редакция Оферты вступает в силу с момента ее размещения в Сервисе, если иное не предусмотрено новой редакцией Оферты.</p>
            <p className="text-gray-700 leading-relaxed">д) Соглашаются с Правилами пользования Сервисом и обязуется не нарушать эти Правила.</p>
          </div>
          
          <p className="text-gray-700 leading-relaxed">
            <strong>2.3.</strong> Отношения Сторон могут быть дополнительно урегулированы отдельными документами и соглашениями, регламентирующими использование соответствующих Сервисов. Применение таких дополнительных документов и соглашений не отменяет действие настоящей Оферты.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">3. ПРЕДМЕТ ДОГОВОРА</h2>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>3.1.</strong> Администрация обязуется предоставить Пользователю доступ к использованию Сервиса, а также оказать Услуги на основании оформленных Заказов, а Пользователь обязуется использовать Сервис в соответствии с Договором и оплатить Услуги на условиях настоящей Оферты в соответствии с утвержденными тарифами.
          </p>
          
          <p className="text-gray-700 mb-2 leading-relaxed">
            <strong>3.1.1.</strong> В целях настоящей оферты применяются следующие тарифы:
          </p>
          
          <div className="ml-6 mb-4">
            <p className="text-gray-700 mb-2 leading-relaxed"><strong>3.1.1.0.</strong> Тариф «Матрица Судьбы» (включает в себя предоставление доступа к одной полной расшифровке «Матрицы Судьбы». При этом доступ будет открыт сразу после оплаты).</p>
            <p className="text-gray-700 mb-2 leading-relaxed"><strong>3.1.1.1.</strong> Тариф «Прогноз на 10 лет» (включает в себя предоставление доступа к расшифровке по одному прогнозу на 10 ближайших лет. При этом доступ будет открыт сразу после оплаты).</p>
            <p className="text-gray-700 mb-2 leading-relaxed"><strong>3.1.1.2.</strong> Тариф «2в1» (включает в себя предоставление доступа к одной полной расшифровке «Матрицы Судьбы» и одному прогнозу на 10 ближайших. При этом доступ будет открыт сразу после оплаты).</p>
            <p className="text-gray-700 leading-relaxed"><strong>3.1.1.3.</strong> Тариф «Безлимит на год» (включает в себя предоставление доступа к неограниченному количеству расшифровок «Матрицы Судьбы» и прогнозам на 10 ближайших лет. При этом доступ будет открыт сразу после оплаты и предоставляется на 1 год).</p>
          </div>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>3.2.</strong> Наименование, цена, количество Услуг, а также прочие необходимые условия Договора определяются на основании сведений, предоставленных Пользователем при оформлении Заказа.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            <strong>3.3.</strong> Обязательным условием заключения Договора является безоговорочное принятие Пользователем условий Данной оферты, политики конфиденциальности, правил пользования Сервисом, а также согласие на обработку персональной информации, согласно действующему Законодательству РФ.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">4. РЕГИСТРАЦИЯ</h2>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>4.1.</strong> Для того чтобы воспользоваться Услугами, Пользователь проходит процедуру регистрации, в результате которой для него создается персональный аккаунт на Сервисе.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>4.2.</strong> При регистрации Пользователь указывает следующие данные: фамилия, имя, пол, дата рождения, адрес электронной почты логин, пароль. Пользователь обязуется предоставить достоверную и полную информацию о себе.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>4.3.</strong> Учетные данные Пользователя, указанные им при регистрации, обрабатываются Администрацией для выполнения обязательств перед Пользователем. Пользователь выражает свое согласие Администрации на обработку учетных и персональных данных. При этом Администрация не несет ответственности перед любыми третьими лицами за точность и достоверность учетных данных Пользователя.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>4.4.</strong> Вход на Сервис осуществляется каждый раз путем прохождения процедуры авторизации — введения логина и пароля, в результате автоматической авторизации с использованием технологии cookies, получения данных от социальных сетей, привязанных к аккаунту и иными способами.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>4.5.</strong> Любые действия, совершенные с использованием логина и пароля Пользователя, считаются совершенными соответствующим Пользователем.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            <strong>4.6.</strong> В случае несанкционированного доступа к логину и паролю и/или аккаунту, или распространения логина и пароля Пользователь обязан незамедлительно сообщить об этом Администрации.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">5. ПОРЯДОК ОКАЗАНИЯ УСЛУГ</h2>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>5.1.</strong> Услуги оказываются Администрацией в соответствии с условиями настоящей Оферты и выбранным Пользователем Тарифом.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>5.2.</strong> Для получения Услуг Пользователь оформляет Заказ через Сервис, указывая необходимые данные (имя, дату рождения и другую информацию, необходимую для расчетов).
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>5.3.</strong> После оплаты Заказа Пользователю предоставляется доступ к результатам расчетов в соответствии с выбранным Тарифом.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>5.4.</strong> Услуги считаются оказанными с момента предоставления Пользователю доступа к результатам расчетов в его личном кабинете.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            <strong>5.5.</strong> Администрация не несет ответственности за решения и действия Пользователя, принятые на основании полученной информации.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">6. ОПЛАТА УСЛУГ</h2>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>6.1.</strong> Стоимость Услуг определяется в соответствии с действующими Тарифами, размещенными на Сервисе.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>6.2.</strong> Оплата Услуг производится Пользователем до момента получения доступа к результатам расчетов.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>6.3.</strong> Оплата производится через платежные системы, интегрированные с Сервисом (Stripe, ЮKassa и другие).
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>6.4.</strong> Администрация вправе изменять стоимость Услуг в одностороннем порядке. При этом стоимость оплаченных Пользователем Услуг изменению не подлежит.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            <strong>6.5.</strong> Возврат денежных средств за оказанные Услуги не производится, за исключением случаев, предусмотренных действующим законодательством РФ.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">7. ОТЗЫВЫ И КОММЕНТАРИИ</h2>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>7.1.</strong> Пользователь вправе оставлять отзывы и комментарии о работе Сервиса и качестве Услуг.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>7.2.</strong> Администрация оставляет за собой право модерировать отзывы и комментарии, удалять сообщения, содержащие ненормативную лексику, оскорбления, спам или иную информацию, нарушающую законодательство РФ или условия настоящей Оферты.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            <strong>7.3.</strong> Пользователь несет ответственность за содержание размещаемых им отзывов и комментариев в соответствии с действующим законодательством РФ.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">8. ПРАВИЛА ПОЛЬЗОВАНИЯ СЕРВИСОМ</h2>
          
          <p className="text-gray-700 mb-2 leading-relaxed">
            <strong>8.1.</strong> Пользователю запрещается:
          </p>
          
          <div className="ml-6 mb-4">
            <p className="text-gray-700 mb-2 leading-relaxed">а) использовать Сервис в целях, противоречащих законодательству РФ;</p>
            <p className="text-gray-700 mb-2 leading-relaxed">б) размещать информацию, нарушающую права третьих лиц;</p>
            <p className="text-gray-700 mb-2 leading-relaxed">в) осуществлять действия, направленные на нарушение нормальной работы Сервиса;</p>
            <p className="text-gray-700 mb-2 leading-relaxed">г) копировать, распространять или иным образом использовать информацию, размещенную на Сервисе, без письменного согласия Администрации;</p>
            <p className="text-gray-700 leading-relaxed">д) передавать свои учетные данные третьим лицам.</p>
          </div>
          
          <p className="text-gray-700 leading-relaxed">
            <strong>8.2.</strong> В случае нарушения Пользователем условий настоящей Оферты Администрация вправе заблокировать доступ Пользователя к Сервису без возврата денежных средств.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">9. ПРАВА АДМИНИСТРАЦИИ</h2>
          
          <p className="text-gray-700 mb-2 leading-relaxed">
            <strong>9.1.</strong> Администрация вправе:
          </p>
          
          <div className="ml-6 mb-4">
            <p className="text-gray-700 mb-2 leading-relaxed">а) изменять условия настоящей Оферты в одностороннем порядке;</p>
            <p className="text-gray-700 mb-2 leading-relaxed">б) изменять стоимость и условия предоставления Услуг;</p>
            <p className="text-gray-700 mb-2 leading-relaxed">в) приостанавливать или прекращать работу Сервиса для проведения технических работ;</p>
            <p className="text-gray-700 mb-2 leading-relaxed">г) блокировать доступ Пользователя к Сервису в случае нарушения им условий настоящей Оферты;</p>
            <p className="text-gray-700 leading-relaxed">д) удалять аккаунты Пользователей, не проявлявших активность в течение 12 месяцев.</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">10. ИНТЕЛЛЕКТУАЛЬНАЯ СОБСТВЕННОСТЬ</h2>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>10.1.</strong> Все объекты, размещенные на Сервисе, в том числе элементы дизайна, текст, графические изображения, иллюстрации, видео, программы для ЭВМ, базы данных, музыка, звуки и другие объекты (далее — содержание Сервиса), являются объектами исключительных прав Администрации и других правообладателей.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>10.2.</strong> Использование содержания Сервиса возможно только в рамках функционала, предлагаемого Сервисом. Никакие элементы содержания Сервиса не могут быть использованы иным образом без предварительного письменного разрешения Администрации.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            <strong>10.3.</strong> Использование Пользователем элементов содержания Сервиса для личного некоммерческого использования допускается при условии сохранения всех знаков охраны авторского права, смежных прав, товарных знаков, других уведомлений об авторстве.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">11. ГАРАНТИИ И ОТВЕТСТВЕННОСТЬ</h2>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>11.1.</strong> Сервис предоставляется на условиях «как есть». Администрация не гарантирует, что Сервис будет соответствовать требованиям Пользователя, что доступ к Сервису будет предоставляться непрерывно, быстро, надежно и без ошибок.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>11.2.</strong> Администрация не несет ответственности за любые виды убытков, произошедшие вследствие использования Пользователем Сервиса или отдельных частей/функций Сервиса.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>11.3.</strong> Информация, предоставляемая Сервисом, носит информационно-развлекательный характер и не может рассматриваться как профессиональная консультация. Администрация не несет ответственности за решения, принятые Пользователем на основании полученной информации.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            <strong>11.4.</strong> Пользователь несет ответственность за сохранность своих учетных данных и самостоятельно несет ответственность за все действия, совершенные с использованием его аккаунта.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">12. СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ</h2>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>12.1.</strong> Принимая условия настоящей Оферты, Пользователь дает свое согласие Администрации на обработку персональных данных в соответствии с Политикой конфиденциальности.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>12.2.</strong> Обработка персональных данных осуществляется в целях исполнения Договора, улучшения качества Услуг, информирования Пользователя о новых услугах и специальных предложениях.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            <strong>12.3.</strong> Пользователь вправе отозвать согласие на обработку персональных данных, направив соответствующее уведомление Администрации. При этом Администрация вправе продолжить обработку персональных данных в случаях, предусмотренных законодательством РФ.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">13. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ</h2>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>13.1.</strong> Настоящая Оферта вступает в силу с момента акцепта Пользователем и действует до момента отзыва Оферты Администрацией.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>13.2.</strong> Администрация вправе в любое время в одностороннем порядке изменять условия настоящей Оферты. Такие изменения вступают в силу с момента размещения новой версии Оферты на Сервисе.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>13.3.</strong> Все споры и разногласия, возникающие в связи с исполнением настоящей Оферты, решаются путем переговоров. В случае невозможности урегулирования спора путем переговоров, спор подлежит разрешению в судебном порядке в соответствии с законодательством РФ.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>13.4.</strong> К отношениям между Пользователем и Администрацией применяется право Российской Федерации.
          </p>
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>13.5.</strong> Если по тем или иным причинам одно или несколько положений настоящей Оферты будут признаны недействительными или не имеющими юридической силы, это не оказывает влияния на действительность или применимость остальных положений.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            <strong>13.6.</strong> По всем вопросам, не урегулированным настоящей Офертой, Стороны руководствуются действующим законодательством Российской Федерации.
          </p>
        </section>

        <div className="text-center mt-12 pt-8 border-t border-gray-300">
          <p className="text-gray-600 text-sm">
            Полный текст документа доступен на сайте <a href="https://www.fatos.pro" className="text-purple-600 hover:text-purple-800">www.fatos.pro</a>
          </p>
          <p className="text-gray-600 text-sm mt-2">
            По вопросам обращайтесь: <a href="mailto:info@fatos.pro" className="text-purple-600 hover:text-purple-800">info@fatos.pro</a>
          </p>
        </div>
      </article>
    );
  }

  // English version (simplified)
  return (
    <article className="prose prose-purple max-w-none">
      <h1 className="text-4xl font-bold text-purple-700 mb-6">Terms of Service</h1>
      
      <p className="text-gray-700 mb-6 leading-relaxed">
        Please read these terms carefully before using www.fatos.pro service.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">1. GENERAL TERMS</h2>
        <p className="text-gray-700 leading-relaxed">
          By using FATOS.pro services, you agree to these terms and conditions. The service provides numerological calculations and analysis based on your personal data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">2. USER OBLIGATIONS</h2>
        <p className="text-gray-700 leading-relaxed">
          Users must provide accurate information and use the service in accordance with applicable laws and regulations.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">3. PAYMENT TERMS</h2>
        <p className="text-gray-700 leading-relaxed">
          Services are provided on a paid basis according to the tariffs published on the website. Payment is processed through secure payment systems.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">4. LIMITATION OF LIABILITY</h2>
        <p className="text-gray-700 leading-relaxed">
          The service is provided "as is". The Administration is not responsible for decisions made based on numerological calculations.
        </p>
      </section>

      <div className="text-center mt-12 pt-8 border-t border-gray-300">
        <p className="text-gray-600 text-sm">
          Full document available at <a href="https://www.fatos.pro" className="text-purple-600 hover:text-purple-800">www.fatos.pro</a>
        </p>
        <p className="text-gray-600 text-sm mt-2">
          Contact: <a href="mailto:info@fatos.pro" className="text-purple-600 hover:text-purple-800">info@fatos.pro</a>
        </p>
      </div>
    </article>
  );
}
