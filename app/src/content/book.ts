export type BookParagraph = {
  number: number
  title: string
  page: number
}

export type BookChapter = {
  number: number
  title: string
  paragraphs: BookParagraph[]
}

export const book = {
  title: 'Алгебра и начала математического анализа. 11 класс',
  chapters: [
    {
      number: 1,
      title: 'Многочлены',
      paragraphs: [
        { number: 1, title: 'Многочлены от одной переменной', page: 10 },
        { number: 2, title: 'Многочлены от нескольких переменных', page: 18 },
        { number: 3, title: 'Уравнения высших степеней', page: 24 },
      ],
    },
    {
      number: 2,
      title: 'Степени и корни. Степенные функции',
      paragraphs: [
        { number: 4, title: 'Понятие корня n-й степени из действительного числа', page: 29 },
        { number: 5, title: 'Функции y = ⁿ√x, их свойства и графики', page: 31 },
        { number: 6, title: 'Свойства корня n-й степени', page: 36 },
        { number: 7, title: 'Преобразование выражений, содержащих радикалы', page: 39 },
        { number: 8, title: 'Понятие степени с любым рациональным показателем', page: 46 },
        { number: 9, title: 'Степенные функции, их свойства и графики', page: 50 },
        { number: 10, title: 'Извлечение корней из комплексных чисел', page: 57 },
      ],
    },
    {
      number: 3,
      title: 'Показательная и логарифмическая функции',
      paragraphs: [
        { number: 11, title: 'Показательная функция, её свойства и график', page: 62 },
        { number: 12, title: 'Показательные уравнения', page: 73 },
        { number: 13, title: 'Показательные неравенства', page: 80 },
        { number: 14, title: 'Понятие логарифма', page: 86 },
        { number: 15, title: 'Логарифмическая функция, её свойства и график', page: 89 },
        { number: 16, title: 'Свойства логарифмов', page: 96 },
        { number: 17, title: 'Логарифмические уравнения', page: 105 },
        { number: 18, title: 'Логарифмические неравенства', page: 111 },
        { number: 19, title: 'Дифференцирование показательной и логарифмической функций', page: 118 },
      ],
    },
    {
      number: 4,
      title: 'Первообразная и интеграл',
      paragraphs: [
        { number: 20, title: 'Первообразная и неопределённый интеграл', page: 124 },
        { number: 21, title: 'Определённый интеграл', page: 132 },
      ],
    },
    {
      number: 5,
      title: 'Элементы теории вероятностей и математической статистики',
      paragraphs: [
        { number: 22, title: 'Вероятность и геометрия', page: 149 },
        { number: 23, title: 'Независимые повторения испытаний с двумя исходами', page: 153 },
        { number: 24, title: 'Статистические методы обработки информации', page: 157 },
        { number: 25, title: 'Гауссова кривая. Закон больших чисел', page: 162 },
      ],
    },
    {
      number: 6,
      title: 'Уравнения и неравенства. Системы уравнений и неравенств',
      paragraphs: [
        { number: 26, title: 'Равносильность уравнений', page: 166 },
        { number: 27, title: 'Общие методы решения уравнений', page: 168 },
        { number: 28, title: 'Равносильность неравенств', page: 174 },
        { number: 29, title: 'Уравнения и неравенства с модулями', page: 180 },
        { number: 30, title: 'Уравнения и неравенства со знаком радикала', page: 189 },
        { number: 31, title: 'Доказательство неравенств', page: 198 },
        { number: 32, title: 'Уравнения и неравенства с двумя переменными', page: 202 },
        { number: 33, title: 'Системы уравнений', page: 208 },
        { number: 34, title: 'Задачи с параметрами', page: 215 },
      ],
    },
  ] satisfies BookChapter[],
}

export const implementedParagraphs = new Set(
  book.chapters.find((chapter) => chapter.number === 3)?.paragraphs.map((paragraph) => paragraph.number),
)
