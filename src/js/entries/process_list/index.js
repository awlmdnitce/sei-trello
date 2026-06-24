import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as dom from './dom.js';
import * as controller from 'controller/trello.js';
import { injectSEITheme } from 'view/helper/sei-theme.js';

import 'css/process_list.scss';

injectSEITheme();
dom.prepare();

controller.load();
