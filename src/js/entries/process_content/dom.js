const getProcessNumber = () => {
  // Try all scripts looking for infraArvoreNo with the process number
  // Format: infraArvoreNo(...,"ifrVisualizacao","08660.018176/2014-60",...)
  const regexArvoreNo = /infraArvoreNo\([^)]*?["']ifrVisualizacao["']\s*,\s*["']([\d./-]+)["']/;

  for (let i = document.scripts.length - 1; i >= 0; i--) {
    const scriptContent = document.scripts[i].innerText || document.scripts[i].textContent || '';
    const match = regexArvoreNo.exec(scriptContent);
    if (match && match[1]) return match[1];
  }

  // Fallback: look for the process number in the page heading (SEI 4.x)
  const selectors = [
    '#divArvoreAcoes .protocoloNR',
    '.protocoloNR',
    'span.h6',
    '#spanNrProcesso',
    '.linker[title]',
  ];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) {
      const text = (el.getAttribute('title') || el.textContent || '').trim();
      if (/[\d./-]{10,}/.test(text)) return text;
    }
  }

  return null;
};

const checkIfSEI3015 = () => {
  return !!document.querySelector('div#header') && !!document.querySelector('div#container');
};

const addTrelloBox = () => {
  if (checkIfSEI3015()) document.documentElement.classList.add('sei-v3015');

  const body = document.querySelector('body');

  const processNumber = getProcessNumber();

  if (!processNumber) return; /* couldn't find a process number */

  const trelloBox = document.createElement('div');
  trelloBox.setAttribute('data-trello-process-box', '');
  trelloBox.setAttribute('data-trello-process-number', processNumber);

  /* add trello card placeholder */
  const cardPlaceholder = document.createElement('div');
  cardPlaceholder.classList.add('trello-card');
  cardPlaceholder.setAttribute('data-full-width', '');
  trelloBox.appendChild(cardPlaceholder);

  /* add create trello card button placeholder */
  const createCardPlaceHolder = document.createElement('div');
  createCardPlaceHolder.classList.add('trello-create-card-button');
  trelloBox.appendChild(createCardPlaceHolder);

  body.insertAdjacentElement('afterbegin', trelloBox);
};

export const prepare = () => {
  addTrelloBox();
};
