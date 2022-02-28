import VSSMParam from './VSSMParam.js'
export default class VSSMState {
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
}
