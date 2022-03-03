import VSSMParam from './VSSMParam.js'
export default class VSSMState {
  constructor(name, state) {
    this.name = name
    this.origin = { ...state }
    this.mutationEvents = VSSMState.defineMutationEvents(this.origin, this.name)
    this.params = VSSMState.initParams(state, this.mutationEvents)

    this.watchParam = (param, task) => {
      VSSMState.validateParamExistence(this.params, param)
      const origin = this.params[param]
      document.removeEventListener(origin.event.type, origin.performTasks)
      origin.tasks.push(task)
      document.addEventListener(origin.event.type, origin.performTasks)
    }

    this.proxy = new Proxy(this, {
      set: (target, prop, value) => {
        if (typeof value === 'function') {
          this.watchParam(prop, value)
        } else {
          VSSMState.validateParamExistence(this.params, prop)
          this.params[prop].proxy.value = value
        }
        return target
      },
      get: (_, prop) => {
        VSSMState.validateParamExistence(this.params, prop)
        return this.params[prop].proxy.value
      }
    })
  }

  static defineMutationEvents = (state, path) => {
    const events = {}
    for (const key of Object.keys(state)) {
      events[key] = new Event(VSSMState.resolveEventPath(`${path}.${key}`))
    }
    return events
  }

  static initParams = (state, events) => {
    const params = {}
    for (const [key, value] of Object.entries(state)) {
      params[key] = new VSSMParam(value, key, events[key])
    }
    return params
  }

  static resolveEventPath = path => `vssm.${path}`

  static validateParamExistence = (state, param) => {
    if (!state[param])
      throw new Error(`VSSM Error: Trying to watch, get or set unresolved: ${param}`)
  }
}
