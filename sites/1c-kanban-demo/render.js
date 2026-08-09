// render.js - чистая отрисовка канбан-доски из данных board (демо-копия боевого рендера).
// Подключается ДО app.js обычным <script> (без модулей). Здесь нет сети и нет состояния:
// только DOM из данных + текущих фильтров. Drag-drop и демо-данные - в app.js.

var Board = (function () {

  // Цвета подразделений подобраны читаемыми и на тёмной, и на светлой теме.
  var BRANCH_COLORS = {
    'Форсаж-Центр': '#14b8a6',
    'Форсаж-Восток': '#d97706',
    'Моторный цех': '#8b5cf6'
  };
  var BRANCH_FALLBACK = '#94a3b8';

  function branchColor(name) {
    return BRANCH_COLORS[name] || BRANCH_FALLBACK;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function formatMoney(n) {
    if (n === null || n === undefined || isNaN(n)) return '-';
    return Math.round(n).toLocaleString('ru-RU') + ' ₽';
  }

  function formatHours(h) {
    if (h === null || h === undefined || isNaN(h)) return '-';
    return h.toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + ' ч';
  }

  function formatTime(iso) {
    if (!iso) return '--:--:--';
    var d = new Date(String(iso).replace(' ', 'T'));
    if (isNaN(d.getTime())) return String(iso);
    return d.toLocaleTimeString('ru-RU');
  }

  // Класс подсветки карточки по времени в этапе (P5.6):
  // просрочка -> красный; приближение (>75% нормы) -> янтарный; иначе - обычная.
  function overdueClass(order) {
    if (order.is_overdue) return 'card-overdue';
    if (order.norm_hours > 0 && order.hours_in_stage > 0.75 * order.norm_hours) return 'card-warn';
    return '';
  }

  // Вкладки подразделений (P5.2/P5.5). activeBranch - имя активной колонки-набора.
  function renderTabs(nav, branches, activeBranch) {
    var html = '';
    branches.forEach(function (b) {
      var active = b.branch === activeBranch ? ' active' : '';
      var overdue = 0;
      (b.orders || []).forEach(function (o) { if (o.is_overdue) overdue += 1; });
      html += '<button class="branch-tab' + active + '" type="button" data-branch="' + esc(b.branch) + '"';
      html += ' style="--branch-color:' + branchColor(b.branch) + '">';
      html += esc(b.branch) + ' <span class="tab-count">' + (b.orders ? b.orders.length : 0) + '</span>';
      if (overdue > 0) html += '<span class="tab-overdue">' + overdue + '</span>';
      html += '</button>';
    });
    nav.innerHTML = html;
  }

  // Заполнить фильтр «приёмщик» приёмщиками активного подразделения (P5.5).
  function fillReceivers(select, receivers, branch, current) {
    var list = (receivers || []).filter(function (r) { return !branch || r.branch === branch; });
    var html = '<option value="">все</option>';
    list.forEach(function (r) {
      var sel = r.id === current ? ' selected' : '';
      html += '<option value="' + esc(r.id) + '"' + sel + '>' + esc(r.name) + '</option>';
    });
    select.innerHTML = html;
  }

  function cardHtml(order) {
    var cls = overdueClass(order);
    var html = '<div class="card ' + cls + '" draggable="true"';
    html += ' data-order-id="' + esc(order.order_id) + '"';
    html += ' data-stage-id="' + esc(order.stage_id) + '">';

    html += '<div class="card-top">';
    html += '<span class="card-number">' + esc(order.number) + '</span>';
    html += '<span class="card-hours' + (order.is_overdue ? ' over' : '') + '">' + formatHours(order.hours_in_stage) + '</span>';
    html += '</div>';

    html += '<div class="card-client">' + esc(order.client_name) + '</div>';

    var car = order.car || {};
    html += '<div class="card-car">' + esc(car.model || '-');
    if (car.plate) html += ' <span class="card-plate">' + esc(car.plate) + '</span>';
    html += '</div>';

    html += '<div class="card-foot">';
    html += '<span class="card-receiver">' + esc(order.receiver || '-') + '</span>';
    if (order.is_warranty) {
      html += '<span class="card-warranty">гарантийный</span>';
    } else {
      html += '<span class="card-total">' + formatMoney(order.total) + '</span>';
    }
    html += '</div>';

    if (order.is_overdue) {
      html += '<div class="card-badge">просрочка &middot; норма ' + formatHours(order.norm_hours) + '</div>';
    }
    html += '</div>';
    return html;
  }

  // Одна колонка-этап со своими карточками.
  function columnHtml(stage, orders, color) {
    var overdue = 0;
    orders.forEach(function (o) { if (o.is_overdue) overdue += 1; });
    var html = '<section class="column" data-stage-id="' + esc(stage.stage_id) + '" style="--branch-color:' + color + '">';
    html += '<header class="column-head">';
    html += '<span class="column-name">' + esc(stage.name) + '</span>';
    html += '<span class="column-count">' + orders.length;
    if (overdue > 0) html += '<span class="column-overdue">' + overdue + '</span>';
    html += '</span>';
    html += '</header>';
    html += '<div class="column-body">';
    if (!orders.length) {
      html += '<div class="column-empty">-</div>';
    } else {
      orders.forEach(function (o) { html += cardHtml(o); });
    }
    html += '</div></section>';
    return html;
  }

  // Проходит ли заказ через активные фильтры приёмщика/дат (P5.5).
  function passesFilters(order, filters) {
    if (filters.receiver && order.receiver_id !== filters.receiver) return false;
    var day = (order.created || '').slice(0, 10);
    if (filters.dateFrom && day && day < filters.dateFrom) return false;
    if (filters.dateTo && day && day > filters.dateTo) return false;
    return true;
  }

  // Отрисовать колонки активного подразделения (P5.2-P5.6). Карточки без хардкода этапов -
  // раскладываются по stage_id из данных; неизвестный этап карточки не теряется (см. app.js).
  function renderColumns(container, branchData, filters) {
    if (!branchData) { container.innerHTML = '<div class="board-empty">Нет данных</div>'; return; }
    var color = branchColor(branchData.branch);
    var byStage = {};
    (branchData.stages || []).forEach(function (s) { byStage[s.stage_id] = []; });
    (branchData.orders || []).forEach(function (o) {
      if (!passesFilters(o, filters)) return;
      if (!byStage[o.stage_id]) byStage[o.stage_id] = [];   // этап карточки вне воронки - своя колонка ниже
      byStage[o.stage_id].push(o);
    });
    // сортировка внутри колонки: дольше всех в этапе - выше
    Object.keys(byStage).forEach(function (k) {
      byStage[k].sort(function (a, b) { return (b.hours_in_stage || 0) - (a.hours_in_stage || 0); });
    });
    var known = {};
    var html = '';
    (branchData.stages || []).forEach(function (s) {
      known[s.stage_id] = true;
      html += columnHtml(s, byStage[s.stage_id] || [], color);
    });
    // этапы карточек, которых нет в воронке (данные 1С разошлись со списком stages) -
    // не теряем: рисуем отдельной колонкой в хвост с самим stage_id как именем
    Object.keys(byStage).forEach(function (sid) {
      if (known[sid] || !byStage[sid].length) return;
      html += columnHtml({ stage_id: sid, name: byStage[sid][0].stage || sid }, byStage[sid], color);
    });
    container.innerHTML = html || '<div class="board-empty">Воронка не задана</div>';
  }

  return {
    branchColor: branchColor,
    formatTime: formatTime,
    renderTabs: renderTabs,
    fillReceivers: fillReceivers,
    renderColumns: renderColumns
  };
})();
