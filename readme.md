Описание

Нужно реализовать функцию validate для проверки данных в объекте. На вход приходит набор данных (например, данные формы) и набор правил для валидации, описанных в определенном формате. Нужно понять, соответствуют ли данные этим правилам и, если нет, выдать информацию - какие данные каким правилам не соответствуют.
Входные данные

    data - объект, где ключи - имена полей, а значения - значения притивных типов (не массивы/объекты)
    rules - объект набором правил, где ключи - имена полей, а значения - объект с правилами валидации. Правила записаны

Выходные данные - объект с полями:

    result - булево значение, если ошибок не было - true, были - false
    errors - если не было ошибок - пустой массив, если были - массив объектов формата с полями:
        field - название поля
        value - значение поля
        rule - имя правила, которому не соответсвовало поле

Пример:

var data = {
  name: 'Alex',
  age: 30,
  profession: 
};
var rules = {
  name: { required: true, minLength: 1, maxLength: 3 },
  age: { min: 18, max: 60 },
}

validate(data, rules); // { result: true, errors: [] }
data.age = 5;
validate(data, rules); // { result: false, errors: [{field: 'age', value: 30, error: 'max'}] }

Набор возможных правил (в скобках - параметр):

    required (bool) - поле содержится в объекте и не равно null. Если required в правилах нет - поле считается опциональным.
    isString (bool) - поле - это строка
    isNumber (bool) - поле - это корректное число
    isBoolean (bool) - поле - это булево значение
    minLength (number) - поле - это строка с длиной больше или равной параметру
    maxLength (number) - поле - это строка с длиной меньше или равной параметру
    min (number) - поле - это число больше или равное параметру
    max (number) - поле - это число меньше или равное параметру
    isEmail (bool) - поле - корректный email (базовая проверка на корректность, без сложных случаев)
