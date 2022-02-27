import VSSM from './modules/VSSM.js'
import VSSMState from './modules/VSSMState.js'

let vssm
export const createState = (name, state) => new VSSMState(name, state)
export const getVSSM = () => vssm.combinedState
export const createVSSM = combinedState => {
  vssm = new VSSM(combinedState)
  return vssm
}
