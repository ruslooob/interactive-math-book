export type PropertyItem = {
  term: string
  formula: string
  explanation: string
}

export type ExampleData = {
  title: string
  formula?: string
  table?: { labels: string[]; values: string[][] }
  steps?: { formula: string; note?: string }[]
}

export type NoteData = {
  title: string
  text: string
}

export type MethodData = {
  title: string
  lead: string
  steps: { title: string; formula?: string; text: string }[]
}

export type QuizQuestion = {
  text: string
  answers: { id: string; label: string }[]
  correct: string
  explanation: string
}

export type InteractiveKind =
  | 'exponential-function'
  | 'exponential-equation'
  | 'exponential-inequality'
  | 'exponential-inequality-trainer'
  | 'logarithm-definition'
  | 'logarithmic-function'
  | 'logarithm-properties'
  | 'logarithm-properties-trainer'
  | 'logarithmic-equation'
  | 'logarithmic-equation-trainer'
  | 'logarithmic-inequality'
  | 'logarithmic-inequality-trainer'
  | 'derivatives'
  | 'derivatives-trainer'

export type InteractiveData = {
  type: 'parameter-animation' | 'trainer'
  kind: InteractiveKind
  label?: string
}

export type LearningGoal = {
  type: 'introduce-concept' | 'develop-skill'
  text: string
}

export type ParagraphData = {
  number: number
  title: string
  goal: LearningGoal
  introduction: string
  formulaLead: string
  formula: string
  conditions?: string
  interactives: InteractiveData[]
  example: ExampleData
  exampleVariants?: ExampleData[]
  method?: MethodData
  propertiesTitle: string
  properties: PropertyItem[]
  notes: NoteData[]
  questions: QuizQuestion[]
}

const trueFalse = (text: string, correct: 'yes' | 'no', explanation: string): QuizQuestion => ({
  text,
  answers: [{ id: 'yes', label: 'Да' }, { id: 'no', label: 'Нет' }],
  correct,
  explanation,
})

export const chapter3Paragraphs: Record<number, ParagraphData> = {
  11: {
    number: 11,
    title: 'Показательная функция, её свойства и график',
    goal: { type: 'introduce-concept', text: 'Понять, как основание определяет значения и график показательной функции.' },
    introduction: 'Показательная функция — функция с постоянным положительным основанием степени и переменным показателем.',
    formulaLead: 'На языке формул это записывается так:',
    formula: "y=a^x",
    conditions: "a>0,\\ a\\ne1,\\ x\\in\\mathbb{R}",
    interactives: [{ type: 'parameter-animation', kind: 'exponential-function' }],
    example: {
      title: 'Функция y = 2ˣ',
      table: { labels: ['x', 'y'], values: [['−2', '−1', '0', '1', '2'], ['0,25', '0,5', '1', '2', '4']] },
    },
    propertiesTitle: 'Показательная функция',
    properties: [
      { term: 'Область определения', formula: "x\\in\\mathbb{R}", explanation: 'В функцию можно подставить любое действительное значение x.' },
      { term: 'Область значений', formula: "y\\in(0;+\\infty)", explanation: 'Значение показательной функции всегда положительно.' },
      { term: 'Точка при x = 0', formula: "a^0=1", explanation: 'Все показательные графики проходят через точку (0; 1).' },
      { term: 'Монотонность', formula: "a>1\\;\\uparrow,\\qquad 0<a<1\\;\\downarrow", explanation: 'При основании больше единицы функция возрастает, а при основании между нулём и единицей — убывает.' },
    ],
    notes: [
      { title: 'Граничный случай', text: 'При a = 1 получается постоянная функция y = 1, поэтому этот случай исключён из определения.' },
      { title: 'Обратите внимание', text: 'График приближается к оси Ox, но не пересекает её: aˣ всегда больше нуля.' },
    ],
    questions: [
      { text: 'Что происходит с функцией при a > 1?', answers: [{ id: 'growth', label: 'Возрастает' }, { id: 'decay', label: 'Убывает' }], correct: 'growth', explanation: 'При a > 1 большему показателю соответствует большее значение функции.' },
      trueFalse('Может ли график показательной функции пересечь ось Ox?', 'no', 'Значение aˣ всегда положительно.'),
      { text: 'Через какую точку проходят все показательные графики?', answers: [{ id: 'zero', label: '(0; 0)' }, { id: 'one', label: '(0; 1)' }, { id: 'base', label: '(a; 1)' }], correct: 'one', explanation: 'При x = 0 значение a⁰ равно 1.' },
    ],
  },
  12: {
    number: 12,
    title: 'Показательные уравнения',
    goal: { type: 'develop-skill', text: 'Научиться решать показательные уравнения методом одинаковых оснований.' },
    introduction: 'Показательное уравнение — уравнение, в котором неизвестная входит в показатель степени.',
    formulaLead: 'При одинаковых допустимых основаниях показатели равны:',
    formula: "a^{f(x)}=a^{g(x)}\\iff f(x)=g(x)",
    conditions: "a>0,\\ a\\ne1",
    interactives: [{ type: 'trainer', kind: 'exponential-equation' }],
    example: {
      title: 'Основания уже одинаковы',
      steps: [
        { formula: "2^{x+1}=2^5", note: 'Основания обеих степеней равны 2.' },
        { formula: "x+1=5", note: 'Приравниваем показатели.' },
        { formula: "x=4", note: 'Решаем полученное линейное уравнение.' },
      ],
    },
    exampleVariants: [
      {
        title: 'Число нужно записать как степень',
        steps: [
          { formula: "3^{2x-1}=27", note: 'Распознаём: 27 = 3³.' },
          { formula: "3^{2x-1}=3^3", note: 'Получаем одинаковое основание 3.' },
          { formula: "x=2", note: 'Приравниваем показатели и решаем уравнение.' },
        ],
      },
      {
        title: 'Оба основания нужно преобразовать',
        steps: [
          { formula: "4^x=8^{x-1}", note: 'Распознаём: 4 = 2², а 8 = 2³.' },
          { formula: "2^{2x}=2^{3x-3}", note: 'Приводим обе части к основанию 2.' },
          { formula: "x=3", note: 'Решаем уравнение 2x = 3x − 3.' },
        ],
      },
    ],
    method: {
      title: 'Метод одинаковых оснований',
      lead: 'Цель метода — получить одинаковые основания степеней, а затем перейти к уравнению без степеней.',
      steps: [
        { title: 'Найти общее основание', formula: "4=2^2,\\quad 8=2^3", text: 'Распознайте числа, которые являются степенями одного положительного числа, не равного единице.' },
        { title: 'Переписать обе части', formula: "a^{f(x)}=a^{g(x)}", text: 'Используйте свойства степеней и приведите левую и правую части к одному основанию.' },
        { title: 'Приравнять показатели', formula: "f(x)=g(x)", text: 'При одинаковом допустимом основании равенство степеней равносильно равенству показателей.' },
        { title: 'Решить и проверить', formula: "x=x_0", text: 'Решите полученное уравнение и подставьте корень в исходное.' },
      ],
    },
    propertiesTitle: '',
    properties: [],
    notes: [],
    questions: [
      { text: 'Чему равен x в уравнении 2ˣ = 2⁴?', answers: [{ id: '2', label: '2' }, { id: '4', label: '4' }, { id: '8', label: '8' }], correct: '4', explanation: 'При одинаковом основании показатели равны: x = 4.' },
      trueFalse('Равенство 5²ˣ = 5ˣ⁺³ можно заменить равенством 2x = x + 3?', 'yes', 'Основания одинаковы и допустимы.'),
      { text: 'Как представить 9ˣ, чтобы сравнить её с 3ˣ⁺²?', answers: [{ id: 'right', label: '3²ˣ' }, { id: 'wrong', label: '3ˣ' }, { id: 'other', label: '9²ˣ' }], correct: 'right', explanation: '9ˣ = (3²)ˣ = 3²ˣ.' },
    ],
  },
  13: {
    number: 13,
    title: 'Показательные неравенства',
    goal: { type: 'develop-skill', text: 'Научиться решать показательные неравенства с учётом величины основания.' },
    introduction: 'Показательное неравенство — неравенство, в котором неизвестная входит в показатель степени.',
    formulaLead: 'Знак между показателями зависит от основания:',
    formula: "a>1:\\ a^u>a^v\\iff u>v;\\qquad 0<a<1:\\ a^u>a^v\\iff u<v",
    conditions: "a>0,\\ a\\ne1,\\ u,v\\in\\mathbb{R}",
    interactives: [
      { type: 'parameter-animation', kind: 'exponential-inequality', label: 'Наглядность' },
      { type: 'trainer', kind: 'exponential-inequality-trainer', label: 'Тренажёры' },
    ],
    example: {
      title: 'Основание больше единицы',
      steps: [
        { formula: "3^{2x-1}>3^5", note: 'Основание 3 больше единицы.' },
        { formula: "2x-1>5", note: 'Знак между показателями сохраняется.' },
        { formula: "x>3", note: 'Решаем линейное неравенство.' },
      ],
    },
    exampleVariants: [
      {
        title: 'Основание между нулём и единицей',
        steps: [
          { formula: "\\left(\\frac12\\right)^{x-1}>\\left(\\frac12\\right)^2", note: 'Показательная функция убывает.' },
          { formula: "x-1<2", note: 'Знак между показателями меняется.' },
          { formula: "x<3", note: 'Решаем линейное неравенство.' },
        ],
      },
      {
        title: 'Основания нужно преобразовать',
        steps: [
          { formula: "4^x\\le8", note: 'Распознаём степени двойки.' },
          { formula: "2^{2x}\\le2^3", note: 'Приводим обе части к основанию 2.' },
          { formula: "x\\le\\frac32", note: 'Основание больше единицы, знак сохраняется.' },
        ],
      },
    ],
    method: {
      title: 'Метод одинаковых оснований',
      lead: 'После приведения к одному основанию направление неравенства определяется тем, возрастает или убывает показательная функция.',
      steps: [
        { title: 'Привести к одному основанию', formula: "a^{f(x)}\\gtrless a^{g(x)}", text: 'Представьте обе части как степени одного допустимого основания.' },
        { title: 'Сравнить основание с единицей', formula: "a>1\\quad\\text{или}\\quad0<a<1", text: 'От этого зависит направление сравнения показателей.' },
        { title: 'Перейти к показателям', formula: "f(x)\\gtrless g(x)", text: 'При a > 1 знак сохраняется, при 0 < a < 1 — меняется.' },
        { title: 'Решить неравенство', formula: "x\\in X", text: 'Решите полученное неравенство и запишите множество решений.' },
      ],
    },
    propertiesTitle: '',
    properties: [],
    notes: [],
    questions: [
      { text: 'Как сравниваются показатели при 3ᵘ > 3ᵛ?', answers: [{ id: 'same', label: 'u > v' }, { id: 'reverse', label: 'u < v' }], correct: 'same', explanation: 'Функция 3ˣ возрастает.' },
      { text: 'Как сравниваются показатели при (1/3)ᵘ > (1/3)ᵛ?', answers: [{ id: 'same', label: 'u > v' }, { id: 'reverse', label: 'u < v' }], correct: 'reverse', explanation: 'Функция (1/3)ˣ убывает.' },
      trueFalse('При основании a = 1 можно применять правило сравнения показателей?', 'no', 'При a = 1 обе степени равны единице при любых показателях.'),
    ],
  },
  14: {
    number: 14,
    title: 'Понятие логарифма',
    goal: { type: 'introduce-concept', text: 'Понять логарифм как показатель степени и переводить записи между двумя формами.' },
    introduction: 'Логарифм положительного числа b по основанию a — показатель степени, в которую нужно возвести a, чтобы получить b.',
    formulaLead: 'Логарифмическая и степенная записи равносильны:',
    formula: "\\log_a b=c\\iff a^c=b",
    conditions: "a>0,\\ a\\ne1,\\ b>0,\\ c\\in\\mathbb{R}",
    interactives: [{ type: 'parameter-animation', kind: 'logarithm-definition' }],
    example: {
      title: 'Логарифм log₂8',
      steps: [
        { formula: "2^3=8", note: 'Два в третьей степени равно восьми.' },
        { formula: "\\log_2 8=3", note: 'Поэтому логарифм равен трём.' },
      ],
    },
    propertiesTitle: 'Следствия из определения',
    properties: [
      { term: 'Логарифм единицы', formula: "\\log_a1=0", explanation: 'Для любого допустимого основания a⁰ = 1.' },
      { term: 'Логарифм основания', formula: "\\log_aa=1", explanation: 'Для любого допустимого основания a¹ = a.' },
      { term: 'Основное тождество', formula: "a^{\\log_a b}=b", explanation: 'Логарифм указывает ровно тот показатель, который возвращает число b.' },
    ],
    notes: [
      { title: 'Аргумент', text: 'В действительных числах логарифм определён только для положительного аргумента b.' },
      { title: 'Основание', text: 'Основание должно быть положительным и не должно равняться единице.' },
    ],
    questions: [
      { text: 'Чему равен log₂8?', answers: [{ id: '2', label: '2' }, { id: '3', label: '3' }, { id: '4', label: '4' }], correct: '3', explanation: '2³ = 8.' },
      { text: 'Какая запись равносильна log₅125 = 3?', answers: [{ id: 'right', label: '5³ = 125' }, { id: 'wrong', label: '3⁵ = 125' }], correct: 'right', explanation: 'Основание логарифма остаётся основанием степени.' },
      trueFalse('Существует ли log₂(−4) в действительных числах?', 'no', 'Аргумент действительного логарифма должен быть положительным.'),
    ],
  },
  15: {
    number: 15,
    title: 'Логарифмическая функция, её свойства и график',
    goal: { type: 'introduce-concept', text: 'Понять свойства логарифмической функции и влияние основания на её график.' },
    introduction: 'Логарифмическая функция сопоставляет положительному числу показатель степени, необходимый для получения этого числа.',
    formulaLead: 'На языке формул это записывается так:',
    formula: "y=\\log_a x",
    conditions: "a>0,\\ a\\ne1,\\ x>0",
    interactives: [{ type: 'parameter-animation', kind: 'logarithmic-function' }],
    example: {
      title: 'Функция y = log₂x',
      table: { labels: ['x', 'y'], values: [['0,25', '0,5', '1', '2', '4'], ['−2', '−1', '0', '1', '2']] },
    },
    propertiesTitle: 'Логарифмическая функция',
    properties: [
      { term: 'Область определения', formula: "x\\in(0;+\\infty)", explanation: 'Аргумент логарифма должен быть положительным.' },
      { term: 'Область значений', formula: "y\\in\\mathbb{R}", explanation: 'Логарифм может принимать любое действительное значение.' },
      { term: 'Точка при x = 1', formula: "\\log_a1=0", explanation: 'Все логарифмические графики проходят через точку (1; 0).' },
      { term: 'Монотонность', formula: "a>1\\;\\uparrow,\\qquad 0<a<1\\;\\downarrow", explanation: 'Направление графика определяется положением основания относительно единицы.' },
    ],
    notes: [
      { title: 'Вертикальная граница', text: 'Прямая x = 0 — вертикальная асимптота графика; сам график находится справа от неё.' },
      { title: 'Обратная функция', text: 'Функции y = logₐx и y = aˣ взаимно обратны.' },
    ],
    questions: [
      { text: 'Какова область определения y = log₂x?', answers: [{ id: 'positive', label: 'x > 0' }, { id: 'all', label: 'Все x' }, { id: 'nonnegative', label: 'x ≥ 0' }], correct: 'positive', explanation: 'Аргумент логарифма строго положителен.' },
      trueFalse('Проходит ли график y = logₐx через точку (1; 0)?', 'yes', 'logₐ1 = 0.'),
      { text: 'Что делает функция при 0 < a < 1?', answers: [{ id: 'growth', label: 'Возрастает' }, { id: 'decay', label: 'Убывает' }], correct: 'decay', explanation: 'Логарифмическая функция с таким основанием убывает.' },
    ],
  },
  16: {
    number: 16,
    title: 'Свойства логарифмов',
    goal: { type: 'develop-skill', text: 'Научиться преобразовывать выражения с помощью свойств логарифмов.' },
    introduction: 'Свойства логарифмов переводят умножение и деление аргументов в сложение и вычитание логарифмов, а степень — в множитель.',
    formulaLead: 'Для положительных x и y выполняются равенства:',
    formula: "\\log_a(xy)=\\log_ax+\\log_ay,\\quad \\log_a\\frac{x}{y}=\\log_ax-\\log_ay",
    conditions: "a>0,\\ a\\ne1,\\ x>0,\\ y>0",
    interactives: [
      { type: 'parameter-animation', kind: 'logarithm-properties', label: 'Наглядность' },
      { type: 'trainer', kind: 'logarithm-properties-trainer', label: 'Тренажёр' },
    ],
    example: {
      title: 'Сумма превращается в произведение',
      steps: [
        { formula: "\\log_2 8+\\log_2 4", note: 'Складываем логарифмы с одним основанием.' },
        { formula: "=\\log_2(8\\cdot4)=\\log_2 32", note: 'Переходим к логарифму произведения.' },
        { formula: "=5", note: 'Поскольку 2⁵ = 32.' },
      ],
    },
    exampleVariants: [
      {
        title: 'Разность превращается в частное',
        steps: [
          { formula: "\\log_3 81-\\log_3 3", note: 'Вычитаем логарифмы с одним основанием.' },
          { formula: "=\\log_3\\frac{81}{3}=\\log_3 27", note: 'Переходим к логарифму частного.' },
          { formula: "=3", note: 'Поскольку 3³ = 27.' },
        ],
      },
      {
        title: 'Множитель становится степенью',
        steps: [
          { formula: "2\\log_5 5", note: 'Множитель перед логарифмом можно внести в показатель.' },
          { formula: "=\\log_5 5^2=\\log_5 25", note: 'Получаем один логарифм.' },
          { formula: "=2", note: 'Поскольку 5² = 25.' },
        ],
      },
    ],
    method: {
      title: 'Как выбрать свойство',
      lead: 'Сначала определите действие между логарифмами или положение степени, затем примените соответствующее свойство.',
      steps: [
        { title: 'Проверить условия', formula: "a>0,\\ a\\ne1,\\ x>0", text: 'Основания должны совпадать, а аргументы — быть положительными.' },
        { title: 'Распознать действие', formula: "+,\\quad-,\\quad r\\log_a x", text: 'Сумма связана с произведением, разность — с частным, множитель — со степенью.' },
        { title: 'Применить свойство', formula: "\\log_a x+\\log_a y=\\log_a(xy)", text: 'Замените исходную запись равносильной, не меняя основание.' },
        { title: 'Упростить результат', formula: "\\log_a a^k=k", text: 'Вычислите логарифм или продолжите преобразование выражения.' },
      ],
    },
    propertiesTitle: 'Правила преобразования логарифмов',
    properties: [
      { term: 'Произведение', formula: "\\log_a(xy)=\\log_ax+\\log_ay", explanation: 'Логарифм произведения равен сумме логарифмов множителей.' },
      { term: 'Частное', formula: "\\log_a\\frac{x}{y}=\\log_ax-\\log_ay", explanation: 'Логарифм частного равен разности логарифмов.' },
      { term: 'Степень', formula: "\\log_a(x^r)=r\\log_ax", explanation: 'Показатель степени аргумента можно вынести перед логарифмом.' },
      { term: 'Новое основание', formula: "\\log_ab=\\frac{\\log_cb}{\\log_ca}", explanation: 'Формула позволяет перейти к любому допустимому основанию c.' },
    ],
    notes: [
      { title: 'Условия', text: 'В формулах x > 0, y > 0, a > 0 и a ≠ 1.' },
      { title: 'Частая ошибка', text: 'Для суммы аргументов нет правила: logₐ(x + y) обычно не равен logₐx + logₐy.' },
    ],
    questions: [
      { text: 'Чему равно logₐx + logₐy?', answers: [{ id: 'product', label: 'logₐ(xy)' }, { id: 'sum', label: 'logₐ(x + y)' }, { id: 'quotient', label: 'logₐ(x/y)' }], correct: 'product', explanation: 'Сумма логарифмов превращается в логарифм произведения.' },
      { text: 'Как вынести степень из logₐ(x³)?', answers: [{ id: 'right', label: '3logₐx' }, { id: 'wrong', label: '(logₐx)³' }], correct: 'right', explanation: 'Показатель степени становится множителем.' },
      trueFalse('Верно ли равенство log₂(3 + 5) = log₂3 + log₂5?', 'no', 'Свойство суммы аргументов не существует.'),
    ],
  },
  17: {
    number: 17,
    title: 'Логарифмические уравнения',
    goal: { type: 'develop-skill', text: 'Научиться решать логарифмические уравнения с учётом области допустимых значений.' },
    introduction: 'Логарифмическое уравнение — уравнение, в котором неизвестная входит в аргумент логарифма или в его основание.',
    formulaLead: 'Уравнение с одним логарифмом переводится в степенную форму:',
    formula: "\\log_a f(x)=c\\iff f(x)=a^c",
    conditions: "a>0,\\ a\\ne1,\\ f(x)>0",
    interactives: [
      { type: 'parameter-animation', kind: 'logarithmic-equation', label: 'Наглядность' },
      { type: 'trainer', kind: 'logarithmic-equation-trainer', label: 'Тренажёры' },
    ],
    example: {
      title: 'Один логарифм',
      steps: [
        { formula: "x-1>0", note: 'Записываем условие существования логарифма.' },
        { formula: "x-1=3^2", note: 'Переходим к степенной форме.' },
        { formula: "x=10", note: 'Корень удовлетворяет условию x > 1.' },
      ],
    },
    exampleVariants: [
      {
        title: 'Логарифмы с одинаковым основанием',
        steps: [
          { formula: "\\log_3(x-1)=\\log_3 8", note: 'Записываем условие x > 1.' },
          { formula: "x-1=8", note: 'Приравниваем аргументы.' },
          { formula: "x=9", note: 'Корень входит в область допустимых значений.' },
        ],
      },
      {
        title: 'Сумма логарифмов',
        steps: [
          { formula: "\\log_2x+\\log_2(x-2)=3", note: 'Область допустимых значений: x > 2.' },
          { formula: "x(x-2)=2^3", note: 'Объединяем логарифмы и переходим к степенной форме.' },
          { formula: "x=4", note: 'Корень −2 исключается по области допустимых значений.' },
        ],
      },
    ],
    method: {
      title: 'Решение с учётом ограничений',
      lead: 'Преобразования выполняются только на области допустимых значений, поэтому ограничения записываются до решения.',
      steps: [
        { title: 'Записать ОДЗ', formula: "f(x)>0", text: 'Каждый аргумент логарифма должен быть строго положительным.' },
        { title: 'Выбрать преобразование', formula: "\\log_a f(x)=c\\quad\\text{или}\\quad\\log_a f(x)=\\log_a g(x)", text: 'Перейдите к степенной форме или приравняйте аргументы.' },
        { title: 'Решить уравнение', formula: "f(x)=a^c", text: 'Решите полученное алгебраическое уравнение.' },
        { title: 'Отобрать корни', formula: "x\\in\\text{ОДЗ}", text: 'Проверьте каждый корень по ограничениям и исходному уравнению.' },
      ],
    },
    propertiesTitle: '',
    properties: [],
    notes: [],
    questions: [
      { text: 'Какое условие нужно для log₂(x − 4)?', answers: [{ id: 'right', label: 'x > 4' }, { id: 'zero', label: 'x ≥ 4' }, { id: 'all', label: 'Любое x' }], correct: 'right', explanation: 'Аргумент x − 4 должен быть строго положительным.' },
      { text: 'Чему равен x в log₂x = 3?', answers: [{ id: '6', label: '6' }, { id: '8', label: '8' }, { id: '9', label: '9' }], correct: '8', explanation: 'x = 2³ = 8.' },
      trueFalse('Нужно ли проверять найденный корень по условиям существования логарифма?', 'yes', 'Преобразованное уравнение может дать недопустимый корень.'),
    ],
  },
  18: {
    number: 18,
    title: 'Логарифмические неравенства',
    goal: { type: 'develop-skill', text: 'Научиться решать логарифмические неравенства и учитывать область допустимых значений.' },
    introduction: 'Логарифмическое неравенство — неравенство, в котором неизвестная входит в аргумент логарифма или в его основание.',
    formulaLead: 'При сравнении аргументов направление зависит от основания:',
    formula: "a>1:\\ \\log_au>\\log_av\\iff u>v;\\quad 0<a<1:\\ \\log_au>\\log_av\\iff u<v",
    conditions: "a>0,\\ a\\ne1,\\ u>0,\\ v>0",
    interactives: [
      { type: 'parameter-animation', kind: 'logarithmic-inequality', label: 'Наглядность' },
      { type: 'trainer', kind: 'logarithmic-inequality-trainer', label: 'Тренажёры' },
    ],
    example: {
      title: 'Основание больше единицы',
      steps: [
        { formula: "x-1>0", note: 'Аргумент должен быть положительным.' },
        { formula: "x-1\\ge2^3", note: 'Основание 2 > 1, поэтому знак сохраняется.' },
        { formula: "x\\ge9", note: 'Все такие x входят в область допустимых значений.' },
      ],
    },
    exampleVariants: [
      {
        title: 'Основание между нулём и единицей',
        steps: [
          { formula: "\\log_{1/2}(x+1)>-2", note: 'Область допустимых значений: x > −1.' },
          { formula: "x+1<\\left(\\frac12\\right)^{-2}", note: 'Функция убывает, поэтому знак меняется.' },
          { formula: "-1<x<3", note: 'Пересекаем результат x < 3 с областью допустимых значений.' },
        ],
      },
      {
        title: 'Два логарифма',
        steps: [
          { formula: "\\log_3(x-2)\\le\\log_3 7", note: 'Область допустимых значений: x > 2.' },
          { formula: "x-2\\le7", note: 'Основание 3 > 1, поэтому знак сохраняется.' },
          { formula: "2<x\\le9", note: 'Пересекаем решение с областью допустимых значений.' },
        ],
      },
    ],
    method: {
      title: 'Сравнение аргументов и ОДЗ',
      lead: 'Ответ получается пересечением области допустимых значений и решения неравенства между аргументами.',
      steps: [
        { title: 'Записать ОДЗ', formula: "u(x)>0,\\quad v(x)>0", text: 'Каждый аргумент логарифма должен быть строго положительным.' },
        { title: 'Определить монотонность', formula: "a>1\\quad\\text{или}\\quad0<a<1", text: 'При основании больше единицы функция возрастает, при основании меньше единицы — убывает.' },
        { title: 'Сравнить аргументы', formula: "u(x)\\gtrless v(x)", text: 'Сохраните знак для a > 1 и измените его для 0 < a < 1.' },
        { title: 'Пересечь решения', formula: "X_{\\text{ответ}}=X_{\\text{ОДЗ}}\\cap X_{\\text{неравенства}}", text: 'В ответ входят только допустимые значения.' },
      ],
    },
    propertiesTitle: '',
    properties: [],
    notes: [],
    questions: [
      { text: 'Как изменится знак при основании 1/2?', answers: [{ id: 'same', label: 'Сохранится' }, { id: 'reverse', label: 'Изменится' }], correct: 'reverse', explanation: 'Функция log₁⧸₂x убывает.' },
      { text: 'Какое условие нужно добавить к log₃(x + 2) > 1?', answers: [{ id: 'right', label: 'x > −2' }, { id: 'wrong', label: 'x ≥ −2' }, { id: 'none', label: 'Никакое' }], correct: 'right', explanation: 'Аргумент x + 2 должен быть строго положительным.' },
      trueFalse('Можно ли включить x = 0 в решение log₂x < 3?', 'no', 'Логарифм при x = 0 не определён.'),
    ],
  },
  19: {
    number: 19,
    title: 'Дифференцирование показательной и логарифмической функций',
    goal: { type: 'develop-skill', text: 'Научиться находить производные показательных и логарифмических функций.' },
    introduction: 'Производные показательной и логарифмической функций выражаются через сами функции и натуральный логарифм основания.',
    formulaLead: 'Основные формулы дифференцирования:',
    formula: "\\frac{d}{dx}a^x=a^x\\ln a,\\qquad \\frac{d}{dx}\\log_a x=\\frac{1}{x\\ln a}",
    conditions: "a>0,\\ a\\ne1,\\ x>0",
    interactives: [
      { type: 'parameter-animation', kind: 'derivatives', label: 'Наглядность' },
      { type: 'trainer', kind: 'derivatives-trainer', label: 'Тренажёр' },
    ],
    example: {
      title: 'Показательная функция',
      steps: [
        { formula: "y=2^x", note: 'Основание a = 2.' },
        { formula: "y'=2^x\\ln2", note: 'Применяем формулу (aˣ)′ = aˣ ln a.' },
      ],
    },
    exampleVariants: [
      {
        title: 'Натуральная экспонента',
        steps: [
          { formula: "y=e^x", note: 'Для основания e натуральный логарифм основания равен единице.' },
          { formula: "y'=e^x", note: 'Производная совпадает с исходной функцией.' },
        ],
      },
      {
        title: 'Натуральный логарифм',
        steps: [
          { formula: "y=\\ln x", note: 'Функция определена при x > 0.' },
          { formula: "y'=\\frac1x", note: 'Применяем формулу производной натурального логарифма.' },
        ],
      },
      {
        title: 'Логарифм по основанию a',
        steps: [
          { formula: "y=\\log_3x", note: 'Основание a = 3.' },
          { formula: "y'=\\frac{1}{x\\ln3}", note: 'Подставляем основание в общую формулу.' },
        ],
      },
    ],
    method: {
      title: 'Как выбрать формулу производной',
      lead: 'Сначала определяется вид исходной функции, затем в соответствующую формулу подставляется основание.',
      steps: [
        { title: 'Распознать функцию', formula: "e^x,\\quad a^x,\\quad\\ln x,\\quad\\log_a x", text: 'Отделите показательные функции от логарифмических.' },
        { title: 'Выбрать формулу', formula: "(a^x)'=a^x\\ln a", text: 'Используйте формулу, соответствующую виду функции.' },
        { title: 'Подставить основание', formula: "a=2,3,\\ldots", text: 'Для произвольного основания сохраняется множитель ln a.' },
        { title: 'Проверить область', formula: "x>0\\quad\\text{для логарифма}", text: 'Производная логарифмической функции рассматривается на её области определения.' },
      ],
    },
    propertiesTitle: 'Частные и общие формулы',
    properties: [
      { term: 'Экспонента', formula: "(e^x)'=e^x", explanation: 'Поскольку ln e = 1, производная экспоненты равна самой функции.' },
      { term: 'Показательная функция', formula: "(a^x)'=a^x\\ln a", explanation: 'Знак производной совпадает со знаком ln a.' },
      { term: 'Натуральный логарифм', formula: "(\\ln x)'=\\frac1x", explanation: 'Формула действует при x > 0.' },
      { term: 'Логарифм по основанию a', formula: "(\\log_a x)'=\\frac{1}{x\\ln a}", explanation: 'Формула получается из перехода к натуральному логарифму.' },
    ],
    notes: [
      { title: 'Основание e', text: 'Число e выделено тем, что производная eˣ снова равна eˣ.' },
      { title: 'Область определения', text: 'Производная logₐx рассматривается только при x > 0.' },
    ],
    questions: [
      { text: 'Чему равна производная eˣ?', answers: [{ id: 'right', label: 'eˣ' }, { id: 'one', label: '1' }, { id: 'x', label: 'xeˣ⁻¹' }], correct: 'right', explanation: 'Экспонента не меняется при дифференцировании.' },
      { text: 'Какой множитель появляется в производной aˣ?', answers: [{ id: 'right', label: 'ln a' }, { id: 'wrong', label: 'a' }, { id: 'x', label: 'x' }], correct: 'right', explanation: '(aˣ)′ = aˣ ln a.' },
      { text: 'Чему равна производная ln x?', answers: [{ id: 'right', label: '1/x' }, { id: 'wrong', label: 'ln x' }, { id: 'one', label: '1' }], correct: 'right', explanation: '(ln x)′ = 1/x при x > 0.' },
    ],
  },
}
