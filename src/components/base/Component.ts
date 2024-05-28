import { IEvents } from './events';

// Абстрактный класс View
export abstract class Component<T> {
	protected constructor(
		protected readonly container: HTMLElement,
		protected events: IEvents
	) {}

	// Переключить класс у элемента

	toggleClass(element: HTMLElement, className: string, force?: boolean): void {
		element.classList.toggle(className, force);
	}

	// Установить текстовое содержимое элемента
	protected setText(element: HTMLElement, value: unknown): void {
		if (element) {
			element.textContent = String(value);
		}
	}

	// Изменить статус блокировки элемента
	setDisabled(element: HTMLElement, state: boolean): void {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	// Скрыть элемент
	protected setHidden(element: HTMLElement): void {
		element.style.display = 'none';
	}

	// Показать элемент
	protected setVisible(element: HTMLElement): void {
		element.style.removeProperty('display');
	}

	// Установить изображение с альтернативным текстом
	protected setImage(
		element: HTMLImageElement,
		src: string,
		alt?: string
	): void {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	// Вернуть корневой DOM-элемент
	render(data?: Partial<T>): HTMLElement {
		// Сливаем данные с текущим экземпляром класса, если они предоставлены
		Object.assign(this as object, data ?? {});
		// Возвращаем контейнер
		return this.container;
	}
}
