// app.js - демо-режим канбана: те же вкладки, фильтры и drag-drop, что в боевой
// версии, но вместо HTTP-сервисов 1С - вымышленные данные в памяти страницы.
// Отрисовка - в render.js (Board). Фирма «Форсаж» и все заказ-наряды выдуманы.

var board = null;
var activeBranch = null;
var filters = { receiver: '', dateFrom: '', dateTo: '' };
var dragging = false;

function $(id) { return document.getElementById(id); }

// --- Демо-данные ---

function daysAgo(n) {
  var d = new Date(Date.now() - n * 86400000);
  return d.toISOString().slice(0, 10);
}

function makeOrder(num, stage, client, model, plate, receiver, total, hours, norm, created, extra) {
  var o = {
    order_id: num, number: num, stage_id: stage, stage: '',
    client_name: client, car: { model: model, plate: plate },
    receiver: receiver, receiver_id: receiver, total: total,
    hours_in_stage: hours, norm_hours: norm,
    is_overdue: false, is_warranty: false, created: created
  };
  if (extra) Object.keys(extra).forEach(function (k) { o[k] = extra[k]; });
  return o;
}

function buildDemoBoard() {
  var FUNNEL = [
    { stage_id: 's1', name: 'Приёмка' },
    { stage_id: 's2', name: 'Диагностика' },
    { stage_id: 's3', name: 'Согласование' },
    { stage_id: 's4', name: 'В работе' },
    { stage_id: 's5', name: 'Готов к выдаче' }
  ];
  // У моторного цеха воронка своя - как и в боевой версии, этапы приходят из данных.
  var FUNNEL_MOTOR = [
    { stage_id: 'm1', name: 'Приёмка' },
    { stage_id: 'm2', name: 'Дефектовка' },
    { stage_id: 'm3', name: 'Механообработка' },
    { stage_id: 'm4', name: 'Сборка' },
    { stage_id: 'm5', name: 'Обкатка' },
    { stage_id: 'm6', name: 'Выдача' }
  ];
  var center = [
    makeOrder('ЗН-01418', 's1', 'Григорьев П. А.', 'Kia Rio', 'В 347 КМ 22', 'Мальцев И.', 6800, 0.4, 4, daysAgo(0)),
    makeOrder('ЗН-01417', 's1', 'ООО «ГрузАвто»', 'ГАЗель Next', 'У 052 ТР 22', 'Мальцев И.', 24500, 1.2, 4, daysAgo(0)),
    makeOrder('ЗН-01416', 's1', 'Севостьянова Е. В.', 'Hyundai Creta', 'Е 811 АХ 122', 'Козлов Д.', 12300, 2.1, 4, daysAgo(1)),
    makeOrder('ЗН-01409', 's2', 'Литвинов С. С.', 'Toyota RAV4', 'К 209 ОМ 22', 'Козлов Д.', 18900, 1.8, 6, daysAgo(1)),
    makeOrder('ЗН-01404', 's2', 'ИП Черкасов', 'Lada Vesta SW', 'М 566 ВУ 22', 'Мальцев И.', 9400, 8.3, 6, daysAgo(2), { is_overdue: true }),
    makeOrder('ЗН-01411', 's2', 'Ковалёва Н. И.', 'Renault Duster', 'О 733 СЕ 122', 'Юрченко А.', 15200, 3.5, 6, daysAgo(1)),
    makeOrder('ЗН-01398', 's3', 'ООО «СибТрансСервис»', 'КамАЗ-43118', 'Х 901 НК 22', 'Юрченко А.', 87600, 6.7, 8, daysAgo(3)),
    makeOrder('ЗН-01402', 's3', 'Ерофеев Д. М.', 'Skoda Octavia', 'Т 118 РА 22', 'Козлов Д.', 31400, 2.9, 8, daysAgo(2)),
    makeOrder('ЗН-01371', 's4', 'Наумов В. Г.', 'Mazda CX-5', 'А 645 ЕК 122', 'Мальцев И.', 52700, 26.4, 24, daysAgo(5), { is_overdue: true }),
    makeOrder('ЗН-01388', 's4', 'Пастухова О. Л.', 'VW Polo', 'Р 272 УС 22', 'Юрченко А.', 0, 14.0, 24, daysAgo(4), { is_warranty: true }),
    makeOrder('ЗН-01393', 's4', 'Агафонов К. К.', 'УАЗ Патриот', 'Н 484 ММ 22', 'Козлов Д.', 44100, 19.6, 24, daysAgo(4)),
    makeOrder('ЗН-01395', 's4', 'Брагина Т. Ф.', 'Nissan Qashqai', 'С 350 ВВ 22', 'Мальцев И.', 27800, 9.2, 24, daysAgo(3)),
    makeOrder('ЗН-01380', 's5', 'Тимофеев А. Р.', 'Ford Focus', 'В 918 ТН 22', 'Юрченко А.', 16750, 3.1, 12, daysAgo(6)),
    makeOrder('ЗН-01377', 's5', 'ООО «АлтайПродторг»', 'ГАЗон Next', 'У 207 КХ 22', 'Козлов Д.', 39200, 5.8, 12, daysAgo(6))
  ];
  var east = [
    makeOrder('ЗН-В0512', 's1', 'Малахов Ю. Б.', 'Chevrolet Niva', 'К 118 УВ 22', 'Прохорова С.', 8900, 0.9, 4, daysAgo(0)),
    makeOrder('ЗН-В0511', 's2', 'ООО «ТехСнабРегион»', 'Isuzu NQR', 'Н 774 ЕТ 22', 'Дёмин В.', 46300, 2.4, 6, daysAgo(1)),
    makeOrder('ЗН-В0508', 's2', 'Кулагина А. П.', 'Haval Jolion', 'Т 355 ОР 122', 'Прохорова С.', 21700, 5.1, 6, daysAgo(2)),
    makeOrder('ЗН-В0503', 's3', 'Родионов Е. Е.', 'Mitsubishi Outlander', 'А 902 СН 22', 'Дёмин В.', 58200, 3.3, 8, daysAgo(2)),
    makeOrder('ЗН-В0499', 's4', 'ИП Валеев', 'ГАЗель Бизнес', 'М 067 КА 22', 'Прохорова С.', 33500, 27.9, 24, daysAgo(6), { is_overdue: true }),
    makeOrder('ЗН-В0496', 's4', 'Шестакова И. Д.', 'Kia Sportage', 'Е 481 ВМ 22', 'Дёмин В.', 29800, 12.6, 24, daysAgo(4)),
    makeOrder('ЗН-В0490', 's5', 'Богданов Л. Н.', 'Lada Largus', 'О 240 ММ 122', 'Прохорова С.', 14600, 1.7, 12, daysAgo(7))
  ];
  var motor = [
    makeOrder('МЦ-0231', 'm1', 'СТО «Пилигрим»', 'ЗМЗ-406', '', 'Артюхов М.', 18000, 1.5, 8, daysAgo(0)),
    makeOrder('МЦ-0229', 'm2', 'Тарасенко В. В.', 'Nissan QR20DE', '', 'Артюхов М.', 36500, 4.2, 12, daysAgo(1)),
    makeOrder('МЦ-0225', 'm3', 'ООО «АгроТехАлтай»', 'Д-245 (МТЗ)', '', 'Артюхов М.', 94000, 41.8, 36, daysAgo(6), { is_overdue: true }),
    makeOrder('МЦ-0224', 'm4', 'Ушаков Г. С.', 'Toyota 1ZZ-FE', '', 'Артюхов М.', 67200, 15.3, 30, daysAgo(4)),
    makeOrder('МЦ-0219', 'm6', 'ИП Костенко', 'ВАЗ-21126', '', 'Артюхов М.', 42800, 2.6, 10, daysAgo(8))
  ];
  return {
    generated_at: new Date().toISOString(),
    branches: [
      { branch: 'Форсаж-Центр', stages: FUNNEL, orders: center },
      { branch: 'Форсаж-Восток', stages: FUNNEL, orders: east },
      { branch: 'Моторный цех', stages: FUNNEL_MOTOR, orders: motor }
    ],
    receivers: [
      { id: 'Мальцев И.', name: 'Мальцев И.', branch: 'Форсаж-Центр' },
      { id: 'Козлов Д.', name: 'Козлов Д.', branch: 'Форсаж-Центр' },
      { id: 'Юрченко А.', name: 'Юрченко А.', branch: 'Форсаж-Центр' },
      { id: 'Прохорова С.', name: 'Прохорова С.', branch: 'Форсаж-Восток' },
      { id: 'Дёмин В.', name: 'Дёмин В.', branch: 'Форсаж-Восток' },
      { id: 'Артюхов М.', name: 'Артюхов М.', branch: 'Моторный цех' }
    ]
  };
}

// --- Модель ---

function branchByName(name) {
  var found = null;
  board.branches.forEach(function (b) { if (b.branch === name) found = b; });
  return found;
}

function orderById(orderId) {
  var found = null;
  board.branches.forEach(function (b) {
    b.orders.forEach(function (o) { if (o.order_id === orderId) found = o; });
  });
  return found;
}

function renderAll() {
  Board.renderTabs($('branch-tabs'), board.branches, activeBranch);
  Board.fillReceivers($('filter-receiver'), board.receivers, activeBranch, filters.receiver);
  Board.renderColumns($('board'), branchByName(activeBranch), filters);
  $('data-time').textContent = 'данные на ' + new Date().toLocaleTimeString('ru-RU');
}

// Смена этапа перетаскиванием: в демо сервер не нужен - двигаем в модели и перерисовываем.
function moveOrder(orderId, targetStageId) {
  var order = orderById(orderId);
  if (!order || order.stage_id === targetStageId) return;
  order.stage_id = targetStageId;
  order.hours_in_stage = 0;
  order.is_overdue = false;
  renderAll();
}

// --- Обработчики UI ---

function onTabsClick(e) {
  var tab = e.target.closest ? e.target.closest('.branch-tab') : null;
  if (!tab) return;
  activeBranch = tab.getAttribute('data-branch');
  filters.receiver = '';                    // приёмщики у подразделений разные
  renderAll();
}

function onFilterChange() {
  filters.receiver = $('filter-receiver').value;
  filters.dateFrom = $('filter-date-from').value;
  filters.dateTo = $('filter-date-to').value;
  renderAll();
}

function onFilterReset() {
  filters = { receiver: '', dateFrom: '', dateTo: '' };
  $('filter-receiver').value = '';
  $('filter-date-from').value = '';
  $('filter-date-to').value = '';
  renderAll();
}

function onThemeToggle() {
  var root = document.documentElement;
  var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('kanban-demo-theme', next); } catch (e) {}
  $('theme-toggle').setAttribute('aria-checked', next === 'dark' ? 'true' : 'false');
}

// --- Drag-and-drop (делегирование на постоянном контейнере #board) ---

function onDragStart(e) {
  var card = e.target.closest ? e.target.closest('.card') : null;
  if (!card) return;
  dragging = true;
  card.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', card.getAttribute('data-order-id'));
}

function onDragEnd(e) {
  dragging = false;
  var card = e.target.closest ? e.target.closest('.card') : null;
  if (card) card.classList.remove('dragging');
  var cols = document.querySelectorAll('.column.drop-hover');
  for (var i = 0; i < cols.length; i++) cols[i].classList.remove('drop-hover');
}

function onDragOver(e) {
  var col = e.target.closest ? e.target.closest('.column') : null;
  if (!col) return;
  e.preventDefault();                        // разрешаем drop
  e.dataTransfer.dropEffect = 'move';
  col.classList.add('drop-hover');
}

function onDragLeave(e) {
  var col = e.target.closest ? e.target.closest('.column') : null;
  if (col && !col.contains(e.relatedTarget)) col.classList.remove('drop-hover');
}

function onDrop(e) {
  var col = e.target.closest ? e.target.closest('.column') : null;
  if (!col) return;
  e.preventDefault();
  col.classList.remove('drop-hover');
  var orderId = e.dataTransfer.getData('text/plain');
  var targetStageId = col.getAttribute('data-stage-id');
  dragging = false;
  if (orderId && targetStageId) moveOrder(orderId, targetStageId);
}

document.addEventListener('DOMContentLoaded', function () {
  board = buildDemoBoard();
  activeBranch = board.branches[0].branch;

  $('branch-tabs').addEventListener('click', onTabsClick);
  $('filter-receiver').addEventListener('change', onFilterChange);
  $('filter-date-from').addEventListener('change', onFilterChange);
  $('filter-date-to').addEventListener('change', onFilterChange);
  $('filter-reset').addEventListener('click', onFilterReset);
  $('theme-toggle').addEventListener('click', onThemeToggle);
  $('theme-toggle').setAttribute('aria-checked',
    document.documentElement.getAttribute('data-theme') === 'dark' ? 'true' : 'false');

  var boardEl = $('board');
  boardEl.addEventListener('dragstart', onDragStart);
  boardEl.addEventListener('dragend', onDragEnd);
  boardEl.addEventListener('dragover', onDragOver);
  boardEl.addEventListener('dragleave', onDragLeave);
  boardEl.addEventListener('drop', onDrop);

  renderAll();
});
