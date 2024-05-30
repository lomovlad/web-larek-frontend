import { IEvents } from './Events';

// Класс модели
export abstract class Model<T> {
	// Базовый конструктор модели
	constructor(data: Partial<T>, protected events: IEvents) {
		// Присваиваем данные модели из переданных данных
		Object.assign(this, data);
	}

	// Сообщаем об изменении в модели
	emitChanges(event: string, payload?: object) {
		// Эмитируем событие с переданным идентификатором и данными (если они есть)
		this.events.emit(event, payload ?? {});
	}
}
