import { Events, IPaymentType } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Form } from './form';

// Интерфейс формы оплатой и доставкой

interface IOrderDeliveryForm {
	payment: IPaymentType; // Способ оплаты
	address: string; // Адрес доставки
}

// View-класс формы выбора способа оплаты и адреса доставки

class DeliveryForm extends Form<IOrderDeliveryForm> {
	protected _paymentContainer: HTMLDivElement; // Контейнер для кнопок выбора способа оплаты
	protected _paymentButtons: HTMLButtonElement[]; // Кнопки выбора способа оплаты

	// Базовый конструктор
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events); // Вызываем конструктор родительского класса Form

		// Инициализируем элементы на форме
		this._paymentContainer = ensureElement<HTMLDivElement>(
			'.order__buttons',
			this.container
		);
		this._paymentButtons = Array.from(
			this._paymentContainer.querySelectorAll('.button_alt')
		);

		// Подписываемся на событие клика по кнопке выбора способа оплаты
		this._paymentContainer.addEventListener('click', (e: MouseEvent) => {
			const target = e.target as HTMLButtonElement;
			this.setClassPaymentMethod(target.name); // Вызываем метод установки класса для выбранного способа оплаты
			events.emit(Events.SELECT_PAYMENT, { target: target.name }); // Эмитируем событие выбора способа оплаты
		});
	}

	// Управляем выделением кнопки в зависимости от выбранного способа оплаты

	setClassPaymentMethod(className: string): void {
		this._paymentButtons.forEach((btn) => {
			if (btn.name === className) {
				this.toggleClass(btn, 'button_alt-active', true); // Добавляем класс активности выбранной кнопке
			} else {
				this.toggleClass(btn, 'button_alt-active', false); // Удаляем класс активности у остальных кнопок
			}
		});
	}

	// Устанавливаем выбранный способ оплаты

	set payment(value: string) {
		this.setClassPaymentMethod(value); // Вызываем метод установки класса для выбранного способа оплаты
	}

	// Устанавливаем адрес доставки

	set address(value: IPaymentType) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value; // Устанавливаем значение в поле адреса доставки
	}
}

export { DeliveryForm, IOrderDeliveryForm };
