export default class VSSMParam {
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
