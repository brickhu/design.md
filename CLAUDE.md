# DESIGN.md — 开发指南

## 技术栈

| 工具 | 用途 |
|---|---|
| [Vite](https://vitejs.dev/) | 构建工具 & 开发服务器 |
| [SolidJS](https://www.solidjs.com/) | 响应式 UI 框架 |
| [Tailwind CSS 4.x](https://tailwindcss.com/) | 原子化 CSS 框架 |
| [Solid Router](https://docs.solidjs.com/solid-router) | 客户端路由（hash 模式） |
| GitHub Pages | 静态站点部署 |

## 项目结构

```
src/
├── index.jsx          # 应用入口：挂载 Router → #root
├── index.css          # Tailwind CSS 入口 & 设计令牌
├── pages/             # 页面组件（每个 Route 对应一个页面）
│   └── Home.jsx
├── components/        # 可复用 UI 组件
└── lib/               # 工具函数、状态管理、导出逻辑等
```

### 目录约定

- **`pages/`** — 页面级组件。每个文件代表一个路由页面。页面组件负责布局和数据获取，尽量减少业务逻辑。
- **`components/`** — 可复用的 UI 组件。每个组件一个文件，用 `export default function` 导出。组件应该是纯展示或包含自包含的交互逻辑。
- **`lib/`** — 工具函数、信号/状态 store、导出逻辑等非 UI 代码。

## 路由

项目使用 `@solidjs/router`，采用 **hash 路由模式**（`#/path`），确保 GitHub Pages 静态托管下路由正常工作。

### 路由配置

所有路由在 `src/index.jsx` 中统一注册：

```jsx
import { HashRouter, Route } from '@solidjs/router'

render(() => (
  <HashRouter>
    <Route path="/" component={Home} />
    <Route path="/editor" component={Editor} />
    <Route path="/export" component={Export} />
  </HashRouter>
), root)
```

### 添加新页面

1. 在 `src/pages/` 下创建 `PageName.jsx`，`export default function` 导出页面组件
2. 在 `src/index.jsx` 中 `import` 页面组件
3. 在 `<Router>` 内添加 `<Route path="/path" component={PageName} />`

### 路由跳转与参数

```jsx
import { useNavigate, useParams, A } from '@solidjs/router'

// 编程式跳转
const navigate = useNavigate()
navigate('/editor')

// 读取路由参数（Route path="/edit/:id"）
const params = useParams()
console.log(params.id)

// 声明式链接
<A href="/about">About</A>
```

### 为什么用 hash 路由

GitHub Pages 是纯静态托管，不支持服务端路由 fallback。hash 路由（`#/path`）是客户端路由，无需服务端支持即可正确处理页面刷新和直接访问。

## 组件写法

```jsx
// src/components/Button.jsx
export default function Button(props) {
  return (
    <button
      class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      {...props}
    />
  )
}
```

### 要点
- 用 `export default function` 导出组件（不用箭头函数，方便 HMR）
- 用 `class` 而非 `className`（SolidJS JSX 使用标准 HTML 属性名）
- 用 `props` 接收参数，直接展开 `{...props}` 透传
- 组件文件用 PascalCase 命名：`ColorPicker.jsx`、`ThemePanel.jsx`

## 响应式状态

```jsx
import { createSignal } from 'solid-js'

// 局部状态
const [count, setCount] = createSignal(0)

// 派生值（自动追踪依赖）
const doubled = () => count() * 2

// 副作用
import { createEffect } from 'solid-js'
createEffect(() => {
  console.log('count changed:', count())
})
```

- **`createSignal`** — 创建响应式状态，返回 `[getter, setter]`
- **`createEffect`** — 当依赖的 signal 变化时自动执行
- **`createMemo`** — 缓存派生计算结果
- **`createResource`** — 异步数据获取

## 控制流

```jsx
import { Show, For, Switch, Match } from 'solid-js'

// 条件渲染
<Show when={isVisible()} fallback={<p>Loading...</p>}>
  <Content />
</Show>

// 列表渲染
<For each={items()}>
  {(item, index) => <li>{item.name}</li>}
</For>

// 多条件
<Switch>
  <Match when={status() === 'loading'}><Spinner /></Match>
  <Match when={status() === 'error'}><Error /></Match>
  <Match when={status() === 'done'}><Content /></Match>
</Switch>
```

## Tailwind CSS 4.x

### 配置文件
- **无需 `tailwind.config.js`** — Tailwind 4.x 使用 CSS-first 配置
- 所有设计令牌定义在 `src/index.css` 的 `@theme` 块中

### 定义设计令牌

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.6 0.2 260);
  --color-surface: #ffffff;
  --font-display: 'Inter', sans-serif;
  --spacing-section: 2rem;
}
```

定义的令牌会自动生成对应的工具类：
- `--color-primary` → `bg-primary`、`text-primary`、`border-primary` 等
- `--font-display` → `font-display`

### 使用颜色
- Tailwind 4.x 支持 `oklch()`、`oklab()`、`hsl()`、`rgb()` 等任意 CSS 颜色语法
- 推荐使用 `oklch()` 以获得更好的感知均匀性

## 构建 & 部署

```bash
npm run dev      # 启动开发服务器（http://localhost:5173）
npm run build    # 构建生产版本到 dist/
npm run preview  # 预览生产构建
```

Push 到 `main` 分支会自动触发 GitHub Actions 部署到 GitHub Pages。

## 设计令牌导出（规划中）

项目的核心功能之一是从 `@theme` 块导出多种格式的令牌文件：
- **DESIGN.md** — 人类可读的设计规范文档
- **Design Tokens** — JSON/W3C 格式的令牌文件
- **Tailwind CSS 4.0 主题** — 可直接复用的 `index.css` 主题文件
