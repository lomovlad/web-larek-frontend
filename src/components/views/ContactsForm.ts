import { IEvents } from '../base/Events';
import { Form } from './form';

// Интерфейс формы с контактной информацией

interface IOrderContactsForm {
	email: string; // Почта для связи
	phone: string; // Телефон для связи
}

// View-класс формы с контактной информацией

class ContactsForm extends Form<IOrderContactsForm> {
	// Базовый конструктор

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events); // Вызываем конструктор родительского класса Form
	}

	// Устанавливаем значение телефона в форме

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value; // Устанавливаем значение в поле телефона
	}

	// Устанавливаем значение почты в форме

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value; // Устанавливаем значение в поле почты
	}
}

export { IOrderContactsForm, ContactsForm };
