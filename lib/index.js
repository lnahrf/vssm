let vssm

class VSSM {
  constructor(combinedState) {
    const initState = combinedState => {
      let proxies = {}
      for (const [key, value] of Object.entries(combinedState)) {
        proxies[key] = value.proxy
      }
      return proxies
    }
    this.combinedState = initState(combinedState)
  }
}

class VSSMState {
  static defineParents = (state, parent = '') => {
    for (const [key, value] of Object.entries(state)) {
      if (typeof value === 'object') {
        value.parent = parent
        VSSMState.defineParents(value, key)
      }
    }
  }

  static defineMutationEvents = (state, path) => {
    const events = {}
    for (const key of Object.keys(state)) {
      events[key] = new Event(VSSMState.resolveEventPath(`${path}.${key}`))
    }
    return events
  }

  static initParams = (state, parent, events) => {
    const params = {}
    for (const [key, value] of Object.entries(state)) {
      params[key] = new VSSMParam(value, key, parent, events[key])
    }
    return params
  }

  static resolveEventPath = path => `vssm.${path}`

  constructor(name, state) {
    this.name = name
    this.origin = { ...state }
    VSSMState.defineParents(this.origin)
    this.mutationEvents = VSSMState.defineMutationEvents(this.origin, this.name)
    this.params = VSSMState.initParams(state, this.name, this.mutationEvents)
    this.watchParam = (param, task) => {
      const origin = this.params[param]
      const eventKey = VSSMState.resolveEventPath(`${origin.parent}.${origin.key}`)
      document.removeEventListener(eventKey, origin.performTasks)
      origin.tasks.push(task)
      document.addEventListener(eventKey, origin.performTasks)
    }
    this.proxy = new Proxy(this, {
      set: (target, prop, value) => {
        if (typeof value === 'function') {
          this.watchParam(prop, value)
        } else {
          this.params[prop].proxy.value = value
        }
        return target
      },
      get: (_, prop) => this.params[prop].proxy.value
    })
  }
}

class VSSMParam {
  constructor(value, key, parent, event) {
    this.value = value
    this.key = key
    this.parent = parent
    this.event = event
    this.tasks = []
    this.performTasks = () => this.tasks.map(t => t())
    this.proxy = new Proxy(
      {
        value: this.value
      },
      {
        set: (target, prop, value) => {
          if (prop in target) {
            target[prop] = value
            document.dispatchEvent(this.event)
            return target
          }
        },
        get: target => target.value
      }
    )
  }
}

export const createVSSM = combinedState => {
  vssm = new VSSM(combinedState)
  return vssm
}

export const createState = (name, state) => new VSSMState(name, state)
export const getVSSM = () => vssm.combinedState
