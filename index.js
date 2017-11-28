import createMemoryHistory from 'history/es/createMemoryHistory';
import createHashHistory from 'history/es/createHashHistory';
import createBrowserHistory from 'history/es/createBrowserHistory';

let history;

const createHistory = type => {
  switch (type) {
    case 'memory':
      history = createMemoryHistory();
      break;
    case 'hash':
      history = createHashHistory();
      break;
    case 'browser':
    default:
      history = createBrowserHistory();
      break;
  }

  return history;
};

const getHistory = () => history;

const isModifiedEvent = event => {
  return Boolean(
    event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
  );
};

export { matchPath } from './matchPath.js';
export { getHistory, createHistory, isModifiedEvent };
