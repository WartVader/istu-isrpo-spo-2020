# T01. Генерация программ
## 1.  Базовая версия
Разработать на языке C# генератор текстовых HTML-квестов, который на вход принимает объект описания квеста и на выходе создает множество HTML-файлов квеста. Квест начинается с вопроса с id 1.
Каждый вопрос - отдельный HTML файл

Структура входного JSON-файла
```
[
  {
     "question": "Вы находитесь в компьютерном классе. Преподаватель по ИСРПО выдал вам интересное задание. Ваши действия?",
     "id": 1,
     "answers": [
        { "text": "Делать интересное задание", id: 2},
        { "text": "Делать усердный вид", id: 3},
        // ...
     ]
  },
  {
     "question": "2",
     "id": 2,
     "answers": [
        // ....
     ]
  },
  {
     // ...
  }
]
```

Файл первого экрана квеста должен иметь название `index.html`

Для разбора JSON-файла используйте одну из следующих библиотек:
* https://www.nuget.org/packages/System.Json
* https://www.nuget.org/packages/Newtonsoft.Json

## 2. Отслеживание изменений

Дополните программу следующим функционалом:
* Программа должна получать путь к входному JSON-файлу из первого аргумента командной строки, а так же путь к папке для хранения результата во втором аргументе
* Если добавлен в командной строке дополнительный ключ `serve` программа должна сгенерировать результат, а далее подписаться на изменение входного файла (используя класс FileSystemWatcher). Как только входной файл изменяется, программа должна автоматически перегенерировать результат при этом пересоздав только те файлы, которые были затронуты изменением

```
> my_generator.exe input.json results/folder serve
```

## 3. Автопубликация

Создайте новый репозиторий на GitHub (или аналогичном сервисе). Настойте GitHub Pages, чтобы заданная папка репозитория публиковалась в виде веб-сайта

Склонируйте репозиторий на свой компьютер

Доработайте программу, чтобы при каждой генерации выходных файлов программа выполняла следующие команды в локальном репозитории:

```
git add -A                    ; добавить все измененные файлы в следующий коммит
git commit -m "Some message"  ; зафиксировать новую версию
git push                      ; отправить на GitHub
```

Таким образом, при каждой генерации выходных файлах, должны обновляться файлы в репозитории и сайт, созданный с помощью GitHub Pages

Для выполнения команды `git push` вам может понадобится использование SSH-ключей