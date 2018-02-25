import memoryHistory from 'history/es/createMemoryHistory';
import hashHistory from 'history/es/createHashHistory';
import browserHistory from 'history/es/createBrowserHistory';

let history;

const createMemoryHistory = () => history = memoryHistory();
const createHashHistory = () => history = hashHistory();
const createBrowserHistory = () => history = browserHistory();

const getHistory = () => history;

const isModifiedEvent = event => {
  return Boolean(
    event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
  );
};

export { matchPath } from './matchPath.js';
export {
  createMemoryHistory,
  createHashHistory,
  createBrowserHistory,
  getHistory,
  isModifiedEvent
};
