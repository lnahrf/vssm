# Very Small State Manager <img src="misc/assets/vssm_logo_small.png" width="110">

<img src="misc/assets/speed_blazing.svg">
<img src="misc/assets/size_183kb.svg">
<img src="misc/assets/dependencies_none.svg">

A very small and oversimplified state manager written in pure Javascript.

## Why?

Vssm was created from a personal need for a small, fast and basic state management library. It exists to give the simplest solution to small frontend projects, so you won't have to install and configure robust libraries just to define some variables.

Vssm has **_no dependencies_** and it weighs **_1.9kb_** in it's minified version.
It's so small it's not even there. You can just plug it in your current project and start managing your state.

_Keep in mind that Vssm is not here to replace popular state management libraries, it's here to give a tiny, native solution for projects that wish to stay relatively small, and still enjoy state management._

### Vssm is

- Extremely light-weight
- A Plug-and-Play solution
- Super easy to get the hang of
- Has no actions, reducers or complicated cases
- Dependency-less

# Quick Start

### Create State

```javascript
import { createVSSM, createState } from 'vssm'

createVSSM({
  user: createState('user', {
    name: '',
    address: ''
  }),
  cart: createState('cart', {
    items: []
  })
})
```

### Assign New Values

```javascript
import { getVSSM } from 'vssm'
const { user, cart } = getVSSM()

user.name = 'Conor Mason'
user.address = 'P.Sherman 42 Wallaby Way, Sydney'

// If the state variable is not primitive (e.g it's an object or array), in order to trigger the mutation event, we need to create a new copy of our object in memory and save its reference inside the original variable.

// An easy way of doing so is deconstruction (e.g {...obj} or [...arr])
cart.items = [...cart.items, {
  name: 'Is Everyone Going Crazy?',
  type: 'Album'
  digital: true
  price: 25,
  currency: 'USD'
}]
```

### Watch for Changes

```javascript
import { getVSSM } from 'vssm'
const { user, cart } = getVSSM()

cart.items = () => {
  console.log('Cart updated!, current items in cart:', cart.items)
}
```

# Do's and Dont's

Make sure your state key and the string provided to `createState` have the same value.

```javascript
// Don't
createVSSM({
  user: createState('userState', {
    name: ''
  })
})

// Do
createVSSM({
  user: createState('user', {
    name: ''
  })
})
```

When assigning values to state parameters that aren't primitive (e.g. they're objects or arrays), in order to trigger the mutation event, we need to create a new copy of our object in memory and save its reference inside the original variable.

```javascript
const { cart } = getVSSM()

// Don't
cart.items.push(item)

// Do
cart.items = [...cart.items, item]
```

Don't interact directly with the state object, interact with it's parameters (interacting with the state object directly might lead to weird or unexpected behavior, like events not emitting or catching).

```javascript
// Don't
const { cart } = getVSSM()
cart = { ...cart, ...{ items: [] } }

// Do
const { cart } = getVSSM()
cart.items = []

// Do
cart.items = [...cart.items, newItem]
```

# Getting Started

Install using npm/yarn with

```bash
npm i vssm
# OR
yarn install vssm
```

## Using the minified version

If you wish to use Vssm's minified version (<2Kb instead of 2.8Kb).

You can download it directly from (https://github.com/tk-ni/vssm/blob/master/lib/vssm.min.js).

Along with the type declations file (https://github.com/tk-ni/vssm/blob/master/lib/vssm.min.d.ts).

Simply import all of Vssm's functions from the minified file.

```javascript
import { createVSSM, createState, getVSSM } from 'path/to/vssm.min.js'
```

Or simply install Vssm using npm/yarn and import your functions from `"vssm/lib/vssm.min.js"`

## Javascript

Configure your project's initial state

```javascript
// main.js
import { createVSSM, createState } from 'vssm'

createVSSM({
  user: createState('user', {
    name: 'Conor Mason'
  })
})
```

Each `state` created with `createState` is an instance in your project's global state.

Please make sure your state key and the string provided to `createState` have the same value.

(e.g. `test: createState("test", { ... })`).

**If they won't have the same value, some events will fail to emit and catch.**

## Getting State Values

Import `getVSSM` from `"vssm"` and deconstruct the required state.

```javascript
import { getVSSM } from 'vssm'
const { user } = getVSSM()

console.log(user.name) // Conor Mason
```

## Watching State Changes

To watch (or listen to) a state parameter for changes, simply assign a function value to the parameter and write your logic within the function.

```javascript
import { getVSSM } from 'vssm'
const { user } = getVSSM()

user.name = () => {
  console.log("Watching user.name, it's new value is", user.name)
}
```

## Setting the state

There is no dedicated method to set a new value to our state parameters, to do so simply assign the value as if it's a normal variable.

```javascript
import { getVSSM } from 'vssm'
const { user } = getVSSM()

test.name = 'Ryota Kohama'
```

## Using Vssm with React/Vue

While it's definitely possible to use Vssm with React/Preact/Vue, it was not designed to be used with a robust framework, and therefore will not trigger component renders by default (it might be a good thing, I'm not sure yet).

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
  user: createState('user', {
    name: 0
  })
})

ReactDOM.render(<App />, document.getElementById('root'))
```

In your components, use Vssm like you would in a normal Javascript project and simply change the local component's state when you wish to trigger a re-render.

```javascript
// SomeComponent.js

export default function SomeComponent() {
  const { user } = getVSSM()
  const [display, setDisplay] = useState(user.name)

  // Watching user.name for changes
  user.name = () => setDisplay(user.name)

  return <div>{display}</div>
}
```

## Vue 3

**Important:** set the initial state in your `main.js` file (this is important, it will prevent your Vssm instance from being garbage collected).

**Important:** Change all `"vssm"` imports to `"vssm/lib"`, for some reason Vue's default configuration won't declare the types of Vssm's classes and methods when importing from `"vssm"` (I'm not sure why this is happening, I might fix it in the future).

```javascript
// main.js

import { createApp } from 'vue'
import App from './App.vue'
import { createState, createVSSM } from 'vssm/lib'

createVSSM({
  user: createState('user', {
    name: ''
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
    const { user } = getVSSM()

    // Watching user.name for changes
    user.name = () => {
      this.display = user.name
    }
  },
  data() {
    return {
      display: ''
    }
  }
}
</script>
```

## TODO

- Create a simple documentation website, with React and Vssm!

## Found a bug?

Please open an issue in https://github.com/tk-ni/vssm/issues. Detailing the bug and your environment as much as you can. If you could provide reproduction steps or a repository that would be best.

I will try and answer open issues as quickly as possible, but since I'm working as a full-time developer it might take a while (so please be patient). I promise I will answer eventually.

## Want to contribute?

I'm honored that you would want to contribute to Vssm! I'm open to all suggestions and PR's (open issues here: https://github.com/tk-ni/vssm/issues).

Please keep in mind that the purpose of this library is to be extremely light-weight and simple. I probably won't merge new features unless it's necessary.
