export default class VSSM {
  constructor(combinedState) {
    VSSM.checkDuplicateNames(combinedState)
    const initState = combinedState => {
      let proxies = {}
      for (const [key, value] of Object.entries(combinedState)) {
        proxies[key] = value.proxy
      }
      return proxies
    }
    this.combinedState = initState(combinedState)
  }

  static checkDuplicateNames = combinedState => {
    const names = Object.values(combinedState)
      .map(v => v.name)
      .reduce((previous, current) => {
        return previous[current] ? ++previous[current] : (previous[current] = 1), previous
      }, {})
    for (const [name, count] of Object.entries(names)) {
      if (count > 1)
        throw new Error(
          `VSSM Error: Failed to define global state. State names must be unique, change or remove the duplicate of "${name}"`
        )
    }
  }
}
