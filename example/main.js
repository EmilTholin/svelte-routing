import { createBrowserHistory } from 'svelte-routing';
import App from './App.html';

createBrowserHistory();

const app = new App({
  target: document.getElementById('app'),
  hydrate: true
});
