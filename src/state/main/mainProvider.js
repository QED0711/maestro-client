
import Multistate from 'multistate';

import state from './state'
import setters from './setters'
import methods from './methods'


const main = new Multistate(state)

main.addCustomSetters(setters)
main.addMethods(methods)



export const mainContext = main.context;
export const MainProvider = main.createProvider();

