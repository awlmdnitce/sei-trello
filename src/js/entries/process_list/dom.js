const findAllProcessAnchors = () => {
  // SEI 3.x: anchors with class starting with "processo" (e.g. processoAguardando, processoGerado)
  let anchors = Array.prototype.slice.call(document.querySelectorAll('a[class^="processo"]'));

  // SEI 4.x fallback: anchors linking to procedimento_trabalhar that sit inside a table row
  if (anchors.length === 0) {
    anchors = Array.prototype.slice.call(
      document.querySelectorAll('a[href*="acao=procedimento_trabalhar"]')
    );
  }

  return anchors;
};

const extractRelevantDataFromRow = (row) => {
  let data = {};

  const noteAnchor = row.querySelector('a[href*="controlador.php?acao=anotacao_registrar"]');
  if (noteAnchor !== null) {
    const noteAnchorTooltipInfo = noteAnchor.getAttribute('onmouseover');
    if (noteAnchorTooltipInfo) {
      const noteAnchorInfoArray = noteAnchorTooltipInfo.split("'");
      if (noteAnchorInfoArray.length === 5)
        data['default-description'] = noteAnchorInfoArray[1]
          .replace(/(\\r\\n|\\r|\\n)/g, '\n')
          .replace(/\\&quot;/g, '"');
    }
  }

  const processAnchor = row.querySelector('a[href*="controlador.php?acao=procedimento_trabalhar"]');
  if (processAnchor !== null) {
    const processAnchorTooltipInfo = processAnchor.getAttribute('onmouseover');
    if (processAnchorTooltipInfo) {
      const processAnchorInfoArray = processAnchorTooltipInfo.split("'");
      if (processAnchorInfoArray.length === 5 && processAnchorInfoArray[1].length > 0) {
        data['default-name'] = processAnchorInfoArray[1];
      }
    }
  }

  return data;
};

const addTrelloCommandButtons = () => {
  // SEI 3.x uses #divComandos; SEI 4.x may use #divComandosSEI or #divComandos
  const whereToAdd =
    document.querySelector('#divComandos') ||
    document.querySelector('#divComandosSEI') ||
    document.querySelector('.infraBarraComandos') ||
    document.querySelector('[id*="Comandos"]');

  if (!whereToAdd) return;

  let placeholder = document.createElement('div');
  placeholder.classList.add('trello-refresh-button');
  whereToAdd.appendChild(placeholder);

  placeholder = document.createElement('div');
  placeholder.classList.add('trello-filter-button');
  whereToAdd.appendChild(placeholder);
};

const findTableRow = (anchor) => {
  // Walk up until we find a <tr> element (handles varying nesting depths)
  let node = anchor.parentNode;
  while (node && node.tagName !== 'TR' && node.tagName !== 'BODY') {
    node = node.parentNode;
  }
  return node && node.tagName === 'TR' ? node : null;
};

const addTrelloBoxes = () => {
  const anchors = findAllProcessAnchors();
  anchors.forEach((anchor) => {
    const tableRow = findTableRow(anchor);
    if (!tableRow) return;

    const tds = tableRow.querySelectorAll('td');
    if (tds.length < 2) return;

    const processNumber = anchor.textContent.trim();
    if (!processNumber) return;

    /* skip if already processed */
    if (tableRow.hasAttribute('data-trello-process-box')) return;

    /* transform the row in a process-box */
    tableRow.setAttribute('data-trello-process-box', '');
    tableRow.setAttribute('data-trello-process-number', processNumber);

    /* mark the anchor */
    anchor.setAttribute('data-trello-process-anchor', '');

    /* add trello card placeholder — use last td as fallback if tds[2] absent */
    const cardPlaceholder = document.createElement('div');
    cardPlaceholder.classList.add('trello-card');
    const cardTd = tds[2] || tds[tds.length - 1];
    cardTd.appendChild(cardPlaceholder);

    /* add create trello card button placeholder */
    const createCardPlaceHolder = document.createElement('div');
    createCardPlaceHolder.classList.add('trello-create-card-button');
    const buttonTd = tds[1] || tds[0];
    buttonTd.appendChild(createCardPlaceHolder);

    /* get more data from row */
    const extraData = extractRelevantDataFromRow(tableRow);
    for (let key in extraData) tableRow.setAttribute('data-trello-' + key, extraData[key]);
  });
};

export const prepare = () => {
  addTrelloCommandButtons();
  addTrelloBoxes();
};
