# Very Small State Manager (vssm)

A very small and oversimplified state manager written in pure Javascript.

## Why?

Vssm was created from a personal need for a small and fast state management library. It exists to give a dumb-simple state management solution to small frontend projects, without having to install and configure robust state managers just to define some variables.

Vssm is written in pure Javascript, this means Vssm has **_no dependencies_** and it weighs **_1.9kb_** in it's minified version.
It's so small it's not even there. You can just plug it in your current project and start managing your state.

**_Disclaimer_**: _Vssm is not here to replace popular state management libraries, it's here to give a tiny, native solution to projects that wish to stay relatively small, and still enjoy the perks of global state management._

# Getting Started

Install using npm/yarn with

```bash
npm i vssm
# OR
yarn install vssm
```

### Using the minified version

If you wish to use Vssm's minified version (<2Kb instead of 2.8Kb).

You can download it directly from (https://github.com/tk-ni/vssm/blob/master/lib/vssm.min.js).

Along with the type declations file (https://github.com/tk-ni/vssm/blob/master/lib/vssm.min.d.ts).

Simply import all of Vssm's functions from the minified file.

```javascript
import { createVSSM, createState, getVSSM } from 'path/to/file/vssm.min.js'
```

Or simply install Vssm using npm/yarn and import your functions from `"vssm/lib/vssm.min.js"`

## Javascript

```javascript
import { createVSSM, createState } from 'vssm'
```

Configure your project's initial state

```javascript
// main.js

createVSSM({
  test: createState('test', {
    param: 0
  })
})
```

Each `state` created with `createState` is an instance in your project's global state.

Please make sure your state key and the string provided to `createState` have the same value.

(e.g. `test: createState("test", { ... })`).

**If they won't have the same value, some events will fail to emit and catch.**

## Getting the state

Fetching the state value from a different module/component.

```javascript
import { getVSSM } from 'vssm'
const { test } = getVSSM()
console.log(test.param) // 0
```

## Watching state changes

Catching the mutation event.

To watch (or listen to) a state parameter for changes, simply assign a function value to the parameter and write your logic within that function.

```javascript
const { test } = getVSSM()
test.param = () => {
  console.log("Watching test.param, it's new value is", test.param) // new value after mutation
}
```

## Setting the state

Emitting the mutation event.

There is no dedicated method to set a new value to our state parameters, to do so simply assign the value to the state parameter as if it's a normal variable.

```javascript
const { test } = getVSSM()
test.param = 1
```

## Using Vssm with React/Vue

While it's definitely possible to use Vssm with React/Preact/Vue, it was not designed to be used in a robust framework, and therefore will not trigger component renders by default (it might be a good thing, I'm not sure yet).

A possible workaround is to set the local component's state when catching the Vssm event. It will force the specific component to re-render on Vssm changes, and is still a relatively simple approach.

## React

**Important:** set the initial state in your `index.js` file (this is important, it will prevent your Vssm instance from being garbage collected).

```javascript
// index.js

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { createState, createVSSM } from 'vssm'

createVSSM({
  test: createState('test', {
    param: 0
  })
})

ReactDOM.render(<App />, document.getElementById('root'))
```

In your components, use Vssm like you would in a normal Javascript project and simply change the local component's state when you wish to trigger a re-render.

```javascript
// SomeComponent.js

export default function SomeComponent() {
  const { test } = getVSSM()
  const [display, setDisplay] = useState(test.param)

  // Watching test.param for changes
  test.param = () => setDisplay(test.param)

  return <div>{display}</div>
}
```

## Vue 3

**Important:** set the initial state in your `main.js` file (this is important, it will prevent your Vssm instance from being garbage collected).

**Important:** Change all `"vssm"` imports to `"vssm/lib"`, for some reason Vue's default configuration won't declare the types of Vssm's classes and methods when importing from `"vssm"` (I'm not sure why this is happening, I might fix it in the future).

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import { createState, createVSSM } from 'vssm/lib'

createVSSM({
  test: createState('test', {
    param: 0
  })
})

createApp(App).mount('#app')
```

In your components, use Vssm like you would in a normal Javascript project and simply change the local component's state when you wish to trigger a re-render.

```javascript
// SomeComponent.vue

<template>
  <div>
    {{ display }}
  </div>
</template>

<script>
import { getVSSM } from "vssm/lib"
export default {
  name: "SomeComponent",
  mounted() {
    const { test } = getVSSM()

    // Watching test.param for changes
    test.param = () => {
      this.display = test.param
    }
  },
  data() {
    return {
      display: 0
    }
  }
}
</script>
```

## TODO

- Improve error handling.
- Test in bigger projects to see how Vssm handles more than a couple variables.
- Create a simple documentation website, with React and Vssm!

## Found a bug?

Please open an issue in https://github.com/tk-ni/vssm/issues. Detailing the bug and your environment as much as you can. If you could provide reproduction steps or a repository that would be best.

I will try and answer open issues as quickly as possible, but since I'm working as a full-time developer it might take a while (so please be patient). I promise I will answer eventually.

## Want to contribute?

I'm honored that you would want to contribute to Vssm! I'm open to all suggestions and PR's (open issues here: https://github.com/tk-ni/vssm/issues).

Please keep in mind that the purpose of this library is to be extremely light-weight and simple. I probably won't merge new features unless it's necessary.
