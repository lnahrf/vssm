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
  static defineParents = (obj, name = '') => {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object') {
        value.parent = name
        this.defineParents(value, key)
      }
    }
  }

  static defineMutationEvents = (obj, name) => {
    const events = {}
    for (const key of Object.keys(obj)) {
      events[key] = document.createEvent('MutationEvents')
      events[key].initEvent(`${name}.${key}`, true, true)
    }
    return events
  }

  static initParams = (state, name, events) => {
    const obj = {}
    for (const [key, value] of Object.entries(state)) {
      obj[key] = new VSSMParam(value, key, name, events[key])
    }
    return obj
  }

  constructor(name, obj) {
    this.name = name
    this.origin = { ...obj }
    this.constructor.defineParents(this.origin)
    this.mutationEvents = this.constructor.defineMutationEvents(this.origin, this.name)
    this.params = this.constructor.initParams(obj, this.name, this.mutationEvents)
    this.watchParam = (param, task) => {
      const origin = this.params[param]
      const eventKey = `${origin.parent}.${origin.key}`
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

export const createVSSM = obj => {
  vssm = new VSSM(obj)
  return vssm
}

export const createState = (name, obj) => new VSSMState(name, obj)
export const getVSSM = () => vssm.combinedState
