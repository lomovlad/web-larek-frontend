# Проектная работа "Web-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

Взаимодействие внутри приложения "Web-ларёк" основано на событийной модели. Модели инициируют события, которые обрабатываются слушателями событий в основном коде. Эти слушатели передают данные компонентам интерфейса, выполняют необходимые вычисления и обновляют значения в моделях.


# Описание классов базового кода

## 1. Класс Api

**Api** — это ключевой класс для взаимодействия с веб-сервером. Он выполняет два основных типа операций: безопасные, использующие метод GET для получения данных, и небезопасные, которые включают методы POST и DELETE для изменения данных на сервере.

## 2. Класс Component

**Component<T>** является абстрактным базовым классом, предназначенным для создания компонентов пользовательского интерфейса. Он предоставляет инструменты для управления DOM элементами и поведением компонента. Все классы представления (View) наследуются от него.

### Конструктор:

- `constructor(container: HTMLElement)` - принимает элемент контейнера, в который будет помещен компонент.

### Методы:

- `toggleClass` - переключает класс для переданного элемента.
- `setText` - задает текстовое содержимое для переданного элемента.
- `setImage` - устанавливает изображение и альтернативный текст (опционально) для переданного элемента типа HTMLImageElement.
- `setDisabled` - изменяет статус блокировки переданного элемента.
- `setHidden`, `setVisible` - скрывает или отображает переданный элемент.
- `render` - рендерит компонент с использованием переданных данных. Этот метод должен быть переопределен в дочерних классах.

## 3. Класс EventEmitter

**EventEmitter** реализует интерфейс IEvents для управления событиями. Он предоставляет методы для подписки на события, инициирования событий, создания триггеров событий и отписки от событий.

### Конструктор:

- `constructor()` - инициализирует хранилище событий и подписчиков, используя Map для хранения событий и подписчиков.

### Методы:

- `on<T extends object>(eventName: EventName, callback: (data: T) => void): void` - метод для подписки на событие. Принимает имя события `eventName` и функцию обратного вызова `callback`, которая будет вызываться при наступлении события.
- `off(eventName: EventName, callback: Subscriber): void` - метод для отписки от события. Принимает имя события `eventName` и функцию обратного вызова `callback`, которая была использована при подписке на событие.
- `emit<T extends object>(eventName: string, data?: T): void` - метод для инициирования события. Принимает имя события `eventName` и опциональные данные `data`, связанные с этим событием.
- `onAll(callback: (event: EmitterEvent) => void): void` - метод для подписки на все события. Принимает функцию обратного вызова `callback`, которая будет вызываться при любом событии.
- `offAll(): void` - метод для отписки от всех событий. Удаляет все подписки на события и очищает хранилище событий и подписчиков.
- `trigger<T extends object>(eventName: string, context?: Partial<T>): (data: T) => void` - метод для создания триггера события. Принимает имя события `eventName` и опциональный контекст `context`, который будет добавлен к данным события при инициировании. Возвращает функцию, которая инициирует событие с переданными данными.

## 4. Класс Model

**Model<T>** является абстрактным базовым классом, предназначенным для создания моделей данных в приложении. Он предоставляет основной функционал для работы с данными и уведомления об изменениях в данных. Этот класс наследуется другими классами, представляющими конкретные модели данных.

### Конструктор:

- `constructor(data: Partial<T>, protected events: IEvents)` - принимает частичные данные типа `T` и объект брокера событий `events`, который используется для уведомления об изменениях в данных.

### Метод:

- `emitChanges` - используется для сообщения об изменениях в модели. Принимает идентификатор события (`event`) и данные (`payload`), связанные с этим событием. Затем метод инициирует событие с переданными данными через объект брокера событий.

# Классы модели данных

## 1. Класс AppState

Класс **AppState** представляет собой модель данных всего приложения и позволяет отслеживать его состояние. Внутри него находятся следующие свойства:

- `catalog`: хранит список доступных лотов. Изменение этого свойства вызывает событие `catalog:changed`.
- `basket`: хранит лоты, добавленные в корзину.
- `order`: отслеживает текущее состояние заказа.
- `preview`: содержит данные лота, который отображается для подробного изучения в модальном окне.

Класс **AppState** также предоставляет дополнительные методы для доступа к функционалу перечисленных свойств.

## 2. Класс LotItem

Класс **LotItem** представляет собой модель данных отдельного лота. Его структура определяется ответом от API-сервера, дополняясь свойствами и методами для взаимодействия с корзиной через событие `lot:changed`.

## 3. Класс Order

Класс **Order** представляет собой модель данных для процесса оформления заказа. Он содержит свойства, соответствующие полям формы оформления заказа, и реализует базовую логику валидации этих свойств на наличие значений. Изменения в любом из свойств инициируют проверку всех полей и вызывают событие `formErrors:changed`.

# Компоненты представления

## 1. Класс Basket

Класс **Basket** представляет собой вид корзины. Он позволяет задать следующие элементы:

- `list`: список отображаемых элементов в корзине.
- `total`: общая стоимость корзины.
- `button`: кнопка для открытия формы оформления заказа. Нажатие этой кнопки вызывает событие `order_payment:open`.

## 2. Класс BasketItem

Класс **BasketItem** представляет элементы корзины. Он позволяет задать следующие свойства:

- `index`: порядковый номер элемента в корзине.
- `title`: название элемента.
- `price`: стоимость элемента.
- `deleteBtn`: кнопка для удаления элемента из корзины.

## 3. Класс Card

Класс **Card** представляет отдельную карточку лота.

## 4. Класс ContactsForm

Класс **ContactsForm** наследуется от класса **Form** и представляет форму для ввода контактной информации при оформлении заказа.

Он позволяет задать следующие свойства:

- `email`: адрес электронной почты.
- `phone`: номер телефона.

## 5. Класс DeliveryForm

Класс **DeliveryForm** наследуется от класса **Form** и представляет форму для ввода информации о способе оплаты и адресе доставки.

Он позволяет задать следующие свойства:

- `payment`: способ оплаты.
- `address`: адрес доставки.

## 6. Класс Form

Класс **Form** представляет базовую форму. Он позволяет задать следующие элементы:

- `submit`: кнопка для отправки формы.
- `errors`: блок для отображения ошибок в форме.

В этом классе привязывается событие отслеживания ввода (`input`) на весь контейнер для вызова событий `container.field:change` и `container:submit`.

## 7. Класс Modal

Класс **Modal** представляет собой вид модального окна. Он позволяет задать следующие элементы:

- `content`: содержимое модального окна.
- `closeButton`: кнопка для закрытия модального окна.

Класс также привязывает событие закрытия модального окна (`modal:close`) к кликам по кнопке закрытия и по родительскому контейнеру модального окна.

## 8. Класс Page

Класс **Page** представляет собой вид всей страницы. Он позволяет задать следующие элементы:

- `counter`: элемент для отображения количества товаров в корзине.
- `gallery`: элемент для отображения всех доступных карточек.
- `wrapper`: обёртка, которая блокирует прокрутку страницы при открытии модального окна.
- `basket`: кнопка для отображения корзины. Нажатие на кнопку вызывает событие `basket:open`.

## 9. Класс Success

Класс **Success** определяет отображение основной информации об оформленном заказе, такой как общая сумма заказа, полученная из ответа сервера.

# Внешние связи

## LarekAPI

**LarekAPI** обеспечивает взаимодействие с конкретным API-сервером.

### Методы:

- `getLotItem`: Получение информации о конкретном лоте.
- `getLotList`: Получение информации о всех доступных лотах.
- `postOrderLots`: Оформление заказа с помощью запроса на сервер.

# Ключевые типы данных

```ts
Модель лота (ILot)

interface ILot {
    id: string;
    title: string;
    description: string;
    image: string;
    category: ILotCategory;
    price: number;
    isOrdered: boolean;
    placeInBasket: () => void;
    removeFromBasket: () => void;
}

Модель приложения (IAppState)

interface IAppState {
    catalog: ILot[]; // Каталог лотов
    basket: ILot[]; // Лоты в корзине
    order: IOrder; // Заказ
    preview: ILot; // Предпросмотр лота
    isLotInBasket(item: ILot): boolean; // Проверка наличия лота в корзине
    clearBasket(): void; // Очистить корзину
    getTotalAmount(): number; // Получить общую стоимость корзины
    getBasketIds(): number[]; // Получить список идентификаторов в корзине
    getBasketLength(): number; // Получить количество товаров в корзине
    initOrder(): IOrder; // Инициализировать объект заказа
}

Модель заказа (IOrder)

interface IOrder {
    payment: IPaymentType; // Тип оплаты заказа
    address: string; // Адрес доставки
    email: string; // Почта для связи
    phone: string; // Телефон для связи
    items: ILot[]; // Лоты в корзине
    formErrors: IFormErrors; // Ошибки валидации формы заказа
    validateOrder(): void; // Проверка полей формы
    clearOrder(): void; // Очистка полей заказа
    validatePayment(): void; // Проверка способа оплаты
    validateAddress(): void; // Проверка адреса доставки
    validateEmail(): void; // Проверка почты
    validatePhone(): void; // Проверка телефона
    postOrder(): void; // Отправка заказа
}


События приложения (Events)

enum Events {
    LOAD_LOTS = 'catalog:changed', // Загрузка доступных лотов
    OPEN_LOT = 'card:open', // Открытие карточки лота для просмотра
    OPEN_BASKET = 'basket:open', // Открытие корзины
    CHANGE_LOT_IN_BASKET = 'lot:changed', // Изменение лота в корзине
    VALIDATE_ORDER = 'formErrors:changed', // Проверка формы заказа
    OPEN_FIRST_ORDER_PART = 'order_payment:open', // Начало оформления заказа
    FINISH_FIRST_ORDER_PART = 'order:submit', // Завершение первой части заказа
    OPEN_SECOND_ORDER_PART = 'order_contacts:open', // Продолжение оформления заказа
    FINISH_SECOND_ORDER_PART = 'contacts:submit', // Завершение второй части заказа
    PLACE_ORDER = 'order:post', // Размещение заказа
    SELECT_PAYMENT = 'payment:changed', // Выбор способа оплаты
    INPUT_ORDER_ADDRESS = 'order.address:change', // Ввод адреса доставки
    INPUT_ORDER_EMAIL = 'contacts.email:change', // Ввод электронной почты
    INPUT_ORDER_PHONE = 'contacts.phone:change', // Ввод номера телефона
    OPEN_MODAL = 'modal:open', // Открытие модального окна
    CLOSE_MODAL = 'modal:close', // Закрытие модального окна
}
```