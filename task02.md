# T02. Миграция данных
## 1.  Базовая версия
Разработать на языке C# (или на Node.js, используя только стандартные модули + модуль работы с БД) программу создания схемы реляционной БД

В качестве БД вы можете использовать:
- SQLite
- MSSQL
- MySQL
- или PostgreSQL

Схема БД, которая должна быть создана, описывается JSON-файлом следующей структуры:
```
[<Таблица 1>, <Таблица 2>,<Таблица 3>]
```
где `<Таблица N>`:

```
{
  "name": "Имя таблицы",
  "fields": [
    <Поле 1>,
    <Поле 2>,
    <Поле 3>,
  ]
}
```
где `<Поле N>`:
```
{
  "name": "Название поля",
  "type": "Тип данных"
}

ИЛИ

{
  "name": "Название поля",
  "link": "Название таблицы"
}
```
Например:

```
[
  { 
     "name": "player",
     "fields": [
        {
           "name":  "name",
           "type":  "string"
        },
        {
           "name":  "age",
           "type":  "integer"
        }      
     ]
  },
  {
     "name": "game",
     "field": [
        {
           "name": "created_at",
           "type": "datetime"
        },
        {
           "name": "mode",
           "type": "string"
        }
     ]
  },
  {
     "name": "player_in_game",
     "field": [
        {
           "name": "player_id",
           "link": "player"
        },
        {
           "name": "game_id",
           "link": "game"
        },
        {
           "name": "is_winner",
           "link": "bool"
        }
     ]
  }
]
```

Помимо полей, описанных явно, каждая таблица должна содержать поле `id` с автоинкрементом

Возможные типы данных полей:
- `bool` -логический
- `integer` - целый
- `string` - строка ограниченной длины (ограничение задайте сами)
- `text` - строка неограниченной длины
- `datetime` - дата и время

Поля с `link`, вместо указания типа, должны быть внешиними ключами к соответвующей таблице

Программа должна сгенерировать SQL-запросы создания таблиц и выполнить их в __одной транзакции__