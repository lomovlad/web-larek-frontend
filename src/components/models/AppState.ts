import _ from 'lodash';
import { Events, IAppState, ILot, IOrder } from '../../types/index';
import { Model } from '../base/Model';
import { IEvents } from '../base/events';
import { LotItem } from './LotItem';
import { Order } from './Order';

// Класс модели приложения
class AppState extends Model<IAppState> {
	private _catalog: ILot[]; // Каталог лотов
	private _order: IOrder; // Заказ
	private _preview: ILot; // Предпросмотр лота

	// Базовый конструктор
	constructor(data: Partial<IAppState>, events: IEvents) {
		super(data, events); // Вызываем конструктор родительского класса Model
	}

	// Устанавливаем каталог лотов
	set catalog(items: ILot[]) {
		// Преобразуем элементы к классу LotItem и эмитируем событие загрузки лотов
		this._catalog = items.map((item) => new LotItem(item, this.events));
		this.emitChanges(Events.LOAD_LOTS, { catalog: this.catalog });
	}

	// Получаем каталог лотов
	get catalog(): ILot[] {
		return this._catalog;
	}

	// Получаем лоты в корзине
	get basket(): ILot[] {
		return this._catalog.filter((item) => item.isOrdered);
	}

	// Получаем объект заказа
	get order(): IOrder {
		return this._order;
	}

	// Получаем предпросмотр лота
	get preview(): ILot {
		return this._preview;
	}

	// Устанавливаем предпросмотр лота и эмитируем событие
	set preview(value: ILot) {
		this._preview = value;
		this.emitChanges('preview:changed', this.preview);
	}

	// Проверяем, находится ли лот в корзине

	isLotInBasket(item: ILot): boolean {
		return item.isOrdered;
	}

	// Очищаем корзину
	clearBasket(): void {
		this.basket.forEach((lot) => lot.removeFromBasket());
	}

	// Получаем общую стоимость товаров в корзине

	getTotalAmount(): number {
		return this.basket.reduce((a, c) => a + c.price, 0);
	}

	// Получаем список индексов в корзине

	getBasketIds(): string[] {
		return this.basket.map((item) => item.id);
	}

	// Получаем количество товаров в корзине

	getBasketLength(): number {
		return this.basket.length;
	}

	// Инициализируем объект заказа
	initOrder(): IOrder {
		this._order = new Order({}, this.events);
		this.order.clearOrder();
		return this.order;
	}
}

export { AppState };
