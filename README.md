> [!WARNING]
> Experimental, not maintained.
> 
> I wrote VSSM at the beginning of 2022 just to push my own limits
> and publish a reasonable NPM package. It managed to impress interviewers and got me into different jobs since then.
> I will not maintain it, it was a fun project that I keep for novelty.

# Very Small State Manager <img src="misc/assets/vssm_logo_small.png" width="110">

<img src="misc/assets/speed_blazing.svg"> <img src="misc/assets/size_183kb.svg"> <img src="misc/assets/dependencies_none.svg">



A very small and oversimplified state manager written in pure Javascript.

## Read the full documentation on the [Vssm Documentation Site](https://tk-ni.github.io/Vssm-docs/)

## Why?

Vssm was created from a personal need for a small, fast and basic state management library. It exists to give the simplest solution to small frontend projects, so you won't have to install and configure robust libraries just to define some variables.

It has **_no dependencies_** and it weighs **_2.0kb_** in it's minified version. Just plug it into your frontend project and start managing your state.

_This project is not a replacement for other state management libraries, it's here to give a tiny, native solution for projects that wish to stay relatively small, and still enjoy state management._

### Vssm is

- Extremely light-weight
- A Plug-and-Play solution
- Super easy to get the hang of
- Has no actions, reducers or complicated cases
- Dependency-less

# Quick Guide

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

// If the state variable is not primitive (e.g it's an object or array),
// in order to trigger the mutation event,
// we need to create a new copy of our object in memory and save its reference inside the original variable.
// An easy way of doing so is deconstruction (e.g {...obj} or [...arr])

cart.items = [
  ...cart.items,
  {
    name: 'Is Everyone Going Crazy?',
    type: 'Album',
    digital: true,
    price: 25,
    currency: 'USD'
  }
]
```

### Watch for Changes

```javascript
import { getVSSM } from 'vssm'
const { user, cart } = getVSSM()

cart.items = () => {
  console.log('Cart updated!, current items in cart:', cart.items)
}
```
