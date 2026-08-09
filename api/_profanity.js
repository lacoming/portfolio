// Проверка ников: мат-фильтр и нормализация для брони имени.
//
// ВАЖНО: тот же список продублирован на клиенте игры —
// `D:\cody\vizitka\portfolio (1)\src\lib\profanity.ts`. Клиент даёт мгновенную
// подсказку в форме ника, сервер решает, попадёт ли имя в общий топ. Правишь
// список здесь - правь и там, иначе клиент пропустит то, что отвергнет сервер.
//
// Разбор идёт в два прохода, потому что маскируют мат по-разному:
//   латиница  - английская брань и транслит («hui», «blyat»);
//   кириллица - обычный мат, в том числе с латинскими двойниками («хyй»).

// Латинские буквы и цифры, которыми подменяют кириллицу.
const HOMOGLYPHS = {
  a: 'а', b: 'ь', c: 'с', d: 'д', e: 'е', g: 'г', h: 'н', i: 'и', k: 'к',
  l: 'л', m: 'м', n: 'п', o: 'о', p: 'р', r: 'г', s: 'с', t: 'т', u: 'и',
  v: 'в', x: 'х', y: 'у', z: 'з',
  0: 'о', 1: 'и', 3: 'е', 4: 'ч', 5: 'з', 6: 'б', 8: 'в', '@': 'а', $: 'с',
};

// Корни, безопасные как подстрока: внутри приличных слов не встречаются.
// «еб» отдельно не берём - оно живёт в «хлеб», «требовать», «погреб».
const RU_ROOTS = [
  'хуй', 'хуе', 'хуё', 'хуя', 'хуи', 'хую', 'хуа', 'хй',
  'пизд', 'пезд',
  'ебат', 'ебал', 'ебан', 'ебаш', 'ебуч', 'ебну', 'ебло', 'ебля', 'ебут',
  'ебис', 'ебош', 'ебыр', 'еблив',
  'наеб', 'заеб', 'поеб', 'подъеб', 'отъеб', 'съеб', 'уеб', 'выеб', 'доеб',
  'перееб', 'разъеб', 'въеб', 'объеб', 'долбоеб', 'долбаеб',
  'бляд', 'блят', 'бляц',
  'мудак', 'мудил', 'мудох', 'мудоз', 'мудач',
  'пидор', 'пидар', 'пидр', 'пидер', 'педрил',
  'гандон', 'гондон', 'залуп', 'дроч', 'шлюх', 'шалав', 'мандав',
  'херн', 'херов', 'херас', 'нахер', 'похер',
  'говн', 'срак', 'срал', 'обосра', 'посра',
  'трахн', 'трахат', 'ссан', 'ссыт', 'ссыш',
  'мраз', 'ублюд', 'сперм', 'пенис', 'вагин',
];

// Слова, у которых как подстрока есть приличные соседи: «сука» - «сукно»,
// «бля» - «бляха», «хер» - «херес», «анус» - «Янус». Ловим только целиком.
const RU_WORDS = [
  'бля', 'хер', 'сука', 'суки', 'суке', 'суку', 'сукой', 'сукин',
  'сучка', 'сучар', 'сучий', 'жопа', 'жопу', 'жопе', 'срака', 'анус',
];

// Английская брань и транслит русского мата.
const LAT_ROOTS = [
  'fuck', 'fuk', 'fck', 'phuck', 'shit', 'bitch', 'cunt', 'whore', 'slut',
  'nigger', 'nigga', 'asshole', 'wanker', 'dick', 'cock', 'pussy',
  'hui', 'huy', 'huj', 'xui', 'xuy', 'huesos', 'nahui', 'nahuy', 'pohui',
  'pizd', 'ebat', 'ebal', 'eban', 'eblan', 'eblo', 'zaeb', 'naeb', 'dolboeb',
  'blyad', 'blyat', 'bljad', 'suka', 'sukin', 'suchka',
  'mudak', 'mudila', 'pidor', 'pidar', 'pidr', 'gandon', 'zalup', 'droch',
  'shlyuh', 'shluh', 'govno', 'otsosi',
];

// Кириллическая форма: латинские двойники разворачиваются обратно в кириллицу,
// всё нечитаемое (пробелы, точки, звёздочки) выбрасывается - так «х.у.й» и
// «х у й» схлопываются в один корень.
function toCyrillic(raw) {
  let out = '';
  for (const ch of String(raw).toLowerCase()) {
    const mapped = HOMOGLYPHS[ch] ?? ch;
    if (/[а-яё]/.test(mapped)) out += mapped === 'ё' ? 'е' : mapped;
  }
  return out;
}

// Латинская форма: остаются только буквы a-z, цифры-двойники разворачиваются.
function toLatin(raw) {
  return String(raw)
    .toLowerCase()
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/@/g, 'a')
    .replace(/\$/g, 's')
    .replace(/[^a-z]/g, '');
}

// Корень рвут не только точками и пробелами, но и «немыми» буквами: «хЪуй»
// после toCyrillic остаётся «хъуй» и подстроку `хуй` уже не содержит. Поэтому
// вторым заходом выбрасываем ь/ъ и схлопываем повторы букв.
function squash(cyr) {
  return cyr.replace(/[ьъ]/g, '').replace(/(.)\1+/g, '$1');
}

export function isProfane(raw) {
  const cyr = toCyrillic(raw);
  const sq = squash(cyr);
  if (RU_ROOTS.some((r) => cyr.includes(r) || sq.includes(squash(r)))) return true;

  // Слова целиком считаем по исходной разбивке на слова: подстрочный поиск
  // здесь ловил бы «сукно» и «команду».
  const words = String(raw)
    .toLowerCase()
    .split(/[^а-яёa-z0-9]+/i)
    .map((w) => toCyrillic(w))
    .filter(Boolean);
  if (words.some((w) => RU_WORDS.includes(w))) return true;

  const lat = toLatin(raw);
  return LAT_ROOTS.some((r) => lat.includes(r));
}

// Ключ брони. Регистр, пробелы и латинские двойники не считаются разными
// именами: «Атос», «атос» и «Atoc» - один и тот же садовник.
export function nickKey(raw) {
  const cyr = toCyrillic(raw);
  if (cyr.length >= 2) return cyr;
  // Ник без кириллицы (латиница, цифры) - ключ по латинской форме.
  return String(raw).toLowerCase().replace(/[^a-zа-яё0-9]/gi, '');
}

export const NICK_MAX = 18;

// Единая проверка ника. Возвращает { ok, nick, key } либо { ok: false, reason }.
export function validateNick(raw) {
  const nick = String(raw ?? '').trim().replace(/\s+/g, ' ').slice(0, NICK_MAX);
  if (nick.replace(/[^a-zа-яё0-9]/gi, '').length < 2) return { ok: false, reason: 'short' };
  if (isProfane(nick)) return { ok: false, reason: 'profanity' };
  const key = nickKey(nick);
  if (!key) return { ok: false, reason: 'short' };
  return { ok: true, nick, key };
}
