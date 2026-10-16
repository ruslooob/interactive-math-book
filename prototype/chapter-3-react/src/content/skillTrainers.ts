import type { TrainerChoice } from '../components/TrainerControls'
import type { InteractiveKind } from './chapter3'

export type SkillTrainerTask = {
  formula: string
  prompt: string
  note: string
  choices: TrainerChoice[]
}

export type SkillTrainerModule = {
  title: string
  skill: string
  completion: string
  tasks: SkillTrainerTask[]
}

export const skillTrainerSets: Partial<Record<InteractiveKind, SkillTrainerModule[]>> = {
  'exponential-inequality-trainer': [
    {
      title: 'Определить направление знака',
      skill: 'Монотонность',
      completion: 'Направление сравнения определено верно во всех заданиях.',
      tasks: [
        {
          formula: '5^u>5^v',
          prompt: 'Как сравниваются показатели?',
          note: 'Основание 5 больше единицы, поэтому функция возрастает.',
          choices: [
            { id: 'greater', label: 'u > v', correct: true, feedback: 'Верно: знак сохраняется.', result: 'u>v' },
            { id: 'less', label: 'u < v', feedback: 'Знак меняется только при основании между нулём и единицей.' },
          ],
        },
        {
          formula: '\\left(\\frac13\\right)^u>\\left(\\frac13\\right)^v',
          prompt: 'Как сравниваются показатели?',
          note: 'Основание 1/3 находится между нулём и единицей, поэтому функция убывает.',
          choices: [
            { id: 'less', label: 'u < v', correct: true, feedback: 'Верно: знак между показателями меняется.', result: 'u<v' },
            { id: 'greater', label: 'u > v', feedback: 'Для убывающей функции большему значению соответствует меньший показатель.' },
          ],
        },
        {
          formula: '2^u\\le2^v',
          prompt: 'Как сравниваются показатели?',
          note: 'Основание 2 больше единицы.',
          choices: [
            { id: 'less-equal', label: 'u ≤ v', correct: true, feedback: 'Верно: знак сохраняется вместе с равенством.', result: 'u\\le v' },
            { id: 'greater-equal', label: 'u ≥ v', feedback: 'Основание больше единицы, поэтому менять знак не нужно.' },
          ],
        },
      ],
    },
    {
      title: 'Решить неравенство полностью',
      skill: 'Полное решение',
      completion: 'Неравенство решено: x < 3.',
      tasks: [
        {
          formula: '\\left(\\frac12\\right)^{x-1}>\\left(\\frac12\\right)^2',
          prompt: 'К какому неравенству между показателями нужно перейти?',
          note: 'Основание 1/2 находится между нулём и единицей.',
          choices: [
            { id: 'reverse', label: 'x − 1 < 2', correct: true, feedback: 'Верно: убывающая функция меняет направление знака.', result: 'x-1<2' },
            { id: 'same', label: 'x − 1 > 2', feedback: 'При основании 1/2 знак должен измениться.' },
          ],
        },
        {
          formula: 'x-1<2',
          prompt: 'Как решить линейное неравенство?',
          note: 'Прибавьте единицу к обеим частям.',
          choices: [
            { id: 'x-less-3', label: 'x < 3', correct: true, feedback: 'Верно.', result: 'x<3' },
            { id: 'x-greater-3', label: 'x > 3', feedback: 'При прибавлении одного направление знака не меняется.' },
            { id: 'x-less-1', label: 'x < 1', feedback: 'Нужно прибавить 1 к числу 2.' },
          ],
        },
        {
          formula: 'x<3',
          prompt: 'Как записать множество решений?',
          note: 'Число 3 не входит в решение строгого неравенства.',
          choices: [
            { id: 'interval', label: '(−∞; 3)', correct: true, feedback: 'Верно: правая граница не включена.', result: 'x\\in(-\\infty;3)' },
            { id: 'closed', label: '(−∞; 3]', feedback: 'Квадратная скобка включила бы число 3.' },
            { id: 'right', label: '(3; +∞)', feedback: 'Этот промежуток соответствует условию x > 3.' },
          ],
        },
      ],
    },
  ],
  'logarithm-properties-trainer': [
    {
      title: 'Выбрать и применить свойство',
      skill: 'Преобразование',
      completion: 'Свойства суммы, разности и степени применены верно.',
      tasks: [
        {
          formula: '\\log_2 4+\\log_2 8',
          prompt: 'Как объединить логарифмы?',
          note: 'Сумме логарифмов соответствует произведение аргументов.',
          choices: [
            { id: 'product', label: 'log₂(4 · 8)', correct: true, feedback: 'Верно: получаем log₂32 = 5.', result: '\\log_2 32=5' },
            { id: 'sum', label: 'log₂(4 + 8)', feedback: 'Свойства для суммы аргументов нет.' },
            { id: 'quotient', label: 'log₂(8 / 4)', feedback: 'Частному соответствует разность логарифмов.' },
          ],
        },
        {
          formula: '\\log_5 125-\\log_5 5',
          prompt: 'Как объединить логарифмы?',
          note: 'Разности логарифмов соответствует частное аргументов.',
          choices: [
            { id: 'quotient', label: 'log₅(125 / 5)', correct: true, feedback: 'Верно: получаем log₅25 = 2.', result: '\\log_5 25=2' },
            { id: 'difference', label: 'log₅(125 − 5)', feedback: 'Аргументы не вычитаются.' },
            { id: 'product', label: 'log₅(125 · 5)', feedback: 'Произведение соответствует сумме логарифмов.' },
          ],
        },
        {
          formula: '3\\log_2 x',
          prompt: 'Как внести множитель под знак логарифма?',
          note: 'Множитель становится показателем степени аргумента.',
          choices: [
            { id: 'power', label: 'log₂(x³)', correct: true, feedback: 'Верно.', result: '\\log_2(x^3)' },
            { id: 'multiply', label: 'log₂(3x)', feedback: 'Множитель перед логарифмом не умножает аргумент.' },
            { id: 'base', label: 'log₆x', feedback: 'Основание логарифма не изменяется.' },
          ],
        },
        {
          formula: '\\log_2(x+3)',
          prompt: 'Можно ли разложить этот логарифм в сумму?',
          note: 'Свойства логарифма применяются к произведению, частному и степени, но не к сумме.',
          choices: [
            { id: 'cannot', label: 'Нет, разложить нельзя', correct: true, feedback: 'Верно: log₂(x + 3) обычно не равен log₂x + log₂3.', result: '\\log_2(x+3)' },
            { id: 'split', label: 'log₂x + log₂3', feedback: 'Это распространённая ошибка: свойства для суммы аргументов нет.' },
          ],
        },
      ],
    },
  ],
  'logarithmic-equation-trainer': [
    {
      title: 'Записать область допустимых значений',
      skill: 'Ограничения',
      completion: 'Области допустимых значений найдены верно.',
      tasks: [
        {
          formula: '\\log_2(x-4)',
          prompt: 'При каких x существует логарифм?',
          note: 'Аргумент должен быть строго положительным.',
          choices: [
            { id: 'greater-4', label: 'x > 4', correct: true, feedback: 'Верно: x − 4 > 0.', result: 'x>4' },
            { id: 'greater-equal-4', label: 'x ≥ 4', feedback: 'При x = 4 аргумент равен нулю, а логарифм нуля не определён.' },
            { id: 'less-4', label: 'x < 4', feedback: 'Тогда аргумент x − 4 отрицателен.' },
          ],
        },
        {
          formula: '\\log_3(2-x)',
          prompt: 'При каких x существует логарифм?',
          note: 'Решите условие 2 − x > 0.',
          choices: [
            { id: 'less-2', label: 'x < 2', correct: true, feedback: 'Верно.', result: 'x<2' },
            { id: 'greater-2', label: 'x > 2', feedback: 'При таких x выражение 2 − x отрицательно.' },
            { id: 'less-equal-2', label: 'x ≤ 2', feedback: 'При x = 2 аргумент равен нулю.' },
          ],
        },
        {
          formula: '\\log_2(x+1)+\\log_2(x-2)',
          prompt: 'Какова общая область допустимых значений?',
          note: 'Оба аргумента должны быть положительными одновременно.',
          choices: [
            { id: 'greater-2', label: 'x > 2', correct: true, feedback: 'Верно: это пересечение x > −1 и x > 2.', result: 'x>2' },
            { id: 'greater-minus-1', label: 'x > −1', feedback: 'Это условие учитывает только первый логарифм.' },
            { id: 'between', label: '−1 < x < 2', feedback: 'На этом промежутке второй аргумент отрицателен.' },
          ],
        },
      ],
    },
    {
      title: 'Решить уравнение полностью',
      skill: 'Полное решение',
      completion: 'Уравнение решено, недопустимый корень исключён: x = 4.',
      tasks: [
        {
          formula: '\\log_2x+\\log_2(x-2)=3',
          prompt: 'Какую область допустимых значений нужно записать?',
          note: 'Оба аргумента должны быть положительными.',
          choices: [
            { id: 'odz', label: 'x > 2', correct: true, feedback: 'Верно.', result: 'x>2' },
            { id: 'positive', label: 'x > 0', feedback: 'Это условие не учитывает аргумент x − 2.' },
            { id: 'not-2', label: 'x ≠ 2', feedback: 'Аргумент должен быть положительным, а не просто ненулевым.' },
          ],
        },
        {
          formula: '\\log_2x+\\log_2(x-2)=3',
          prompt: 'Как объединить логарифмы?',
          note: 'Сумме соответствует произведение аргументов.',
          choices: [
            { id: 'product', label: 'log₂(x(x − 2)) = 3', correct: true, feedback: 'Верно.', result: '\\log_2(x(x-2))=3' },
            { id: 'sum', label: 'log₂(2x − 2) = 3', feedback: 'Аргументы нужно умножить, а не сложить.' },
            { id: 'quotient', label: 'log₂(x/(x − 2)) = 3', feedback: 'Частное соответствует разности логарифмов.' },
          ],
        },
        {
          formula: '\\log_2(x(x-2))=3',
          prompt: 'К какому алгебраическому уравнению нужно перейти?',
          note: 'Используйте определение логарифма.',
          choices: [
            { id: 'quadratic', label: 'x² − 2x = 8', correct: true, feedback: 'Верно: x(x − 2) = 2³.', result: 'x^2-2x=8' },
            { id: 'linear', label: 'x − 2 = 8', feedback: 'Аргументом логарифма является произведение x(x − 2).' },
            { id: 'three', label: 'x² − 2x = 3', feedback: 'Правая часть равна 2³, то есть 8.' },
          ],
        },
        {
          formula: 'x^2-2x=8',
          prompt: 'Какие корни входят в ответ?',
          note: 'Корни уравнения: 4 и −2. Учитывайте условие x > 2.',
          choices: [
            { id: 'four', label: 'Только x = 4', correct: true, feedback: 'Верно: x = −2 не входит в ОДЗ.', result: 'x=4' },
            { id: 'both', label: 'x = 4 и x = −2', feedback: 'Корень −2 делает оба аргумента недопустимыми.' },
            { id: 'minus-2', label: 'Только x = −2', feedback: 'Этот корень не входит в область допустимых значений.' },
          ],
        },
      ],
    },
  ],
  'logarithmic-inequality-trainer': [
    {
      title: 'Определить направление знака',
      skill: 'Монотонность',
      completion: 'Направление сравнения аргументов определено верно.',
      tasks: [
        {
          formula: '\\log_3u>\\log_3v',
          prompt: 'Как сравниваются аргументы?',
          note: 'Основание 3 больше единицы.',
          choices: [
            { id: 'greater', label: 'u > v', correct: true, feedback: 'Верно: возрастающая функция сохраняет знак.', result: 'u>v' },
            { id: 'less', label: 'u < v', feedback: 'Знак меняется только для убывающей функции.' },
          ],
        },
        {
          formula: '\\log_{1/2}u>\\log_{1/2}v',
          prompt: 'Как сравниваются аргументы?',
          note: 'Основание 1/2 находится между нулём и единицей.',
          choices: [
            { id: 'less', label: 'u < v', correct: true, feedback: 'Верно: убывающая функция меняет знак.', result: 'u<v' },
            { id: 'greater', label: 'u > v', feedback: 'Для основания 1/2 направление знака меняется.' },
          ],
        },
        {
          formula: '\\log_5u\\le\\log_5v',
          prompt: 'Как сравниваются аргументы?',
          note: 'Основание 5 больше единицы.',
          choices: [
            { id: 'less-equal', label: 'u ≤ v', correct: true, feedback: 'Верно.', result: 'u\\le v' },
            { id: 'greater-equal', label: 'u ≥ v', feedback: 'Основание больше единицы, поэтому знак сохраняется.' },
          ],
        },
      ],
    },
    {
      title: 'Решить неравенство полностью',
      skill: 'Полное решение',
      completion: 'Неравенство решено с учётом ОДЗ: −1 < x < 3.',
      tasks: [
        {
          formula: '\\log_{1/2}(x+1)>-2',
          prompt: 'Какова область допустимых значений?',
          note: 'Аргумент x + 1 должен быть положительным.',
          choices: [
            { id: 'greater-minus-1', label: 'x > −1', correct: true, feedback: 'Верно.', result: 'x>-1' },
            { id: 'greater-equal-minus-1', label: 'x ≥ −1', feedback: 'При x = −1 аргумент равен нулю.' },
            { id: 'less-minus-1', label: 'x < −1', feedback: 'Тогда аргумент отрицателен.' },
          ],
        },
        {
          formula: '\\log_{1/2}(x+1)>-2',
          prompt: 'Как перейти к сравнению аргумента со степенью?',
          note: 'Логарифмическая функция с основанием 1/2 убывает.',
          choices: [
            { id: 'less-4', label: 'x + 1 < 4', correct: true, feedback: 'Верно: знак меняется, а (1/2)⁻² = 4.', result: 'x+1<4' },
            { id: 'greater-4', label: 'x + 1 > 4', feedback: 'Для убывающей функции знак нужно изменить.' },
            { id: 'less-minus-2', label: 'x + 1 < −2', feedback: 'Число −2 является значением логарифма, а не аргументом.' },
          ],
        },
        {
          formula: 'x>-1,\\qquad x<3',
          prompt: 'Как записать пересечение условий?',
          note: 'Оба условия должны выполняться одновременно.',
          choices: [
            { id: 'interval', label: '−1 < x < 3', correct: true, feedback: 'Верно.', result: '-1<x<3' },
            { id: 'union', label: 'x < −1 или x > 3', feedback: 'Это объединение противоположных промежутков, а нужно пересечение.' },
            { id: 'right', label: 'x < 3', feedback: 'Так теряется ограничение области допустимых значений.' },
          ],
        },
      ],
    },
  ],
  'derivatives-trainer': [
    {
      title: 'Выбрать формулу производной',
      skill: 'Распознавание функции',
      completion: 'Формулы для четырёх основных видов функций выбраны верно.',
      tasks: [
        {
          formula: 'y=e^x',
          prompt: 'Чему равна производная?',
          note: 'Экспонента сохраняется при дифференцировании.',
          choices: [
            { id: 'exp', label: 'eˣ', correct: true, feedback: 'Верно.', result: "y'=e^x" },
            { id: 'one', label: '1', feedback: 'Производная eˣ не является постоянной.' },
            { id: 'x-exp', label: 'xeˣ⁻¹', feedback: 'Это правило степени, а не показательной функции.' },
          ],
        },
        {
          formula: 'y=3^x',
          prompt: 'Чему равна производная?',
          note: 'Для основания a появляется множитель ln a.',
          choices: [
            { id: 'general-exp', label: '3ˣ ln 3', correct: true, feedback: 'Верно.', result: "y'=3^x\\ln3" },
            { id: 'same', label: '3ˣ', feedback: 'Функция сохраняется без множителя только при основании e.' },
            { id: 'power', label: 'x · 3ˣ⁻¹', feedback: 'Это правило производной степенной функции x³.' },
          ],
        },
        {
          formula: 'y=\\ln x',
          prompt: 'Чему равна производная?',
          note: 'Натуральный логарифм определён при x > 0.',
          choices: [
            { id: 'reciprocal', label: '1/x', correct: true, feedback: 'Верно.', result: "y'=\\frac1x" },
            { id: 'same', label: 'ln x', feedback: 'Логарифм не сохраняется при дифференцировании.' },
            { id: 'one', label: '1', feedback: 'Производная зависит от x.' },
          ],
        },
        {
          formula: 'y=\\log_2x',
          prompt: 'Чему равна производная?',
          note: 'В знаменателе появляется ln 2.',
          choices: [
            { id: 'log', label: '1/(x ln 2)', correct: true, feedback: 'Верно.', result: "y'=\\frac{1}{x\\ln2}" },
            { id: 'ln', label: '1/x', feedback: 'Это производная натурального логарифма.' },
            { id: 'base', label: '1/(2x)', feedback: 'Основание входит в формулу как ln 2.' },
          ],
        },
      ],
    },
    {
      title: 'Найти производную выражения',
      skill: 'Применение формул',
      completion: 'Производная суммы найдена верно.',
      tasks: [
        {
          formula: 'y=5^x+\\ln x',
          prompt: 'Какая производная верна?',
          note: 'Производная суммы равна сумме производных.',
          choices: [
            { id: 'correct', label: '5ˣ ln 5 + 1/x', correct: true, feedback: 'Верно: к каждому слагаемому применена своя формула.', result: "y'=5^x\\ln5+\\frac1x" },
            { id: 'missing-ln', label: '5ˣ + 1/x', feedback: 'У производной 5ˣ отсутствует множитель ln 5.' },
            { id: 'wrong-log', label: '5ˣ ln 5 + ln x', feedback: 'Производная ln x равна 1/x.' },
          ],
        },
      ],
    },
  ],
}
