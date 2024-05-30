// Подключение стилей
import './scss/styles.scss';

// Импортирование необходимых утилит, компонентов и типов данных
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/Events';
import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { Page } from './components/views/Page';
import { Modal } from './components/views/Modal';
import { Basket } from './components/views/Basket';
import { Card } from './components/views/Card';
import { Success } from './components/views/Success';
import {
	CatalogChangeEvent,
	Events,
	IFormErrors,
	ILot,
	IPaymentType,
} from './types/index';
import { AppState } from './components/models/AppState';
import { DeliveryForm } from './components/views/DeliveryForm';
import { ContactsForm } from './components/views/ContactsForm';
import { BasketItem } from './components/views/BasketItem';

// Создание экземпляров API и EventEmitter
const api = new LarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();

// Инициализирование шаблонов
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Создание экземпляров моделей данных
const appData = new AppState({}, events);

// Создание экземплярорв глобальных View-контейнеров
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Создание переиспользуемых частей интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const deliveryForm = new DeliveryForm(cloneTemplate(deliveryTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);

// Логика обработки событий

// Обновление каталога лотов при загрузке
events.on<CatalogChangeEvent>(Events.LOAD_LOTS, () => {
	// Отрисовка каждой карточки в каталоге
	page.galery = appData.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), events, {
			onClick: () => events.emit(Events.OPEN_LOT, item),
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

// Открывка корзины
events.on(Events.OPEN_BASKET, () => {
	modal.render({
		content: basket.render({
			valid: appData.getBasketLength() > 0,
		}),
	});
});

// Открыть модальное окно с информацией о лоте
events.on(Events.OPEN_LOT, (item: ILot) => {
	const card = new Card('card', cloneTemplate(cardPreviewTemplate), events, {
		onClick: () => {
			if (appData.isLotInBasket(item)) {
				item.removeFromBasket();
			} else {
				item.placeInBasket();
			}
			events.emit(Events.OPEN_LOT, item);
		},
	});

	modal.render({
		content: card.render({
			category: item.category,
			title: item.title,
			description: item.description,
			image: item.image,
			price: item.price,
			button: item.isOrdered ? 'Удалить из корзины' : 'Купить',
		}),
	});
});

// Обновление состояния корзины при изменении
events.on(Events.CHANGE_LOT_IN_BASKET, () => {
	page.counter = appData.getBasketLength();

	basket.items = appData.basket.map((item, index) => {
		const card = new BasketItem(cloneTemplate(cardBasketTemplate), events, {
			onClick: (event) => {
				item.removeFromBasket();
				events.emit(Events.OPEN_BASKET);
			},
		});
		return card.render({
			index: index,
			title: item.title,
			price: item.price,
		});
	});

	basket.total = appData.getTotalAmount();
});

// Открытие первой формы оформления заказа
events.on(Events.OPEN_FIRST_ORDER_PART, () => {
	const order = appData.initOrder();
	modal.render({
		content: deliveryForm.render({
			payment: order.payment,
			address: order.address,
			valid: false,
			errors: [],
		}),
	});
});

// Изменение способа оплаты
events.on(Events.SELECT_PAYMENT, (data: { target: string }) => {
	appData.order.payment = data.target as IPaymentType;
});

// Изменение адреса доставки
events.on(Events.INPUT_ORDER_ADDRESS, (data: { value: string }) => {
	appData.order.address = data.value;
});

// Изменение электронной почты
events.on(Events.INPUT_ORDER_EMAIL, (data: { value: string }) => {
	appData.order.email = data.value;
});

// Изменение телефона
events.on(Events.INPUT_ORDER_PHONE, (data: { value: string }) => {
	appData.order.phone = data.value;
});

// Обновление состояния валидации формы оформления заказа
events.on(Events.VALIDATE_ORDER, (errors: Partial<IFormErrors>) => {
	const { payment, address, email, phone } = errors;
	deliveryForm.valid = !payment && !address;
	contactsForm.valid = !email && !phone;
	deliveryForm.errors = Object.values({ payment, address })
		.filter((i) => typeof i === 'string') // Фильтруем только строки
		.map((i) => i.toString());
	contactsForm.errors = Object.values({ email, phone })
		.filter((i) => typeof i === 'string') // Фильтруем только строки
		.map((i) => i.toString()); // Преобразуем значения в строки и создаем массив строк
});

// Заполнение первой формы оформления заказа
events.on(Events.FINISH_FIRST_ORDER_PART, () => {
	events.emit(Events.OPEN_SECOND_ORDER_PART);
});

// Открыть вторую форму оформления заказа
events.on(Events.OPEN_SECOND_ORDER_PART, () => {
	const order = appData.order;
	modal.render({
		content: contactsForm.render({
			email: order.email,
			phone: order.phone,
			valid: false,
			errors: [],
		}),
	});
});

// Завершить оформление заказа
events.on(Events.FINISH_SECOND_ORDER_PART, () => {
	const order = appData.order;

	api
		.postOrderLots({
			payment: order.payment,
			address: order.address,
			email: order.email,
			phone: order.phone,
			total: appData.getTotalAmount(),
			items: appData.getBasketIds(),
		})
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), events, {
				onClick: () => {
					modal.close();
				},
			});
			modal.render({
				content: success.render({
					total: result.total,
				}),
			});

			appData.clearBasket(); // Очистить корзину после успешного заказа
		})
		.catch((err) => {
			console.error(err);
		});
});

// Блокировать прокрутку страницы при открытии модального окна
events.on(Events.OPEN_MODAL, () => {
	page.locked = true;
});

// Разблокировать прокрутку страницы при закрытии модального окна
events.on(Events.CLOSE_MODAL, () => {
	page.locked = false;
});

// Инициализировать загрузку списка лотов
api
	.getLotList()
	.then((res) => {
		appData.catalog = res;
	})
	.catch(console.error);
