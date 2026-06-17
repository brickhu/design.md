/* @refresh reload */
import { render } from 'solid-js/web'
import { HashRouter, Route } from '@solidjs/router'
import Home from './pages/Home'
import Editor from './pages/Editor'
import './index.css'

const root = document.getElementById('root')
if (root) {
  render(() => (
    <HashRouter>
      <Route path="/" component={Home} />
      <Route path="/editor" component={Editor} />
    </HashRouter>
  ), root)
}
