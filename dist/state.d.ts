import type { AOPAction } from './action.js';
export interface AOPState {
    [key: string]: unknown;
}
export interface AOPReducer {
    reduce(state: AOPState, action: AOPAction): AOPState;
}
//# sourceMappingURL=state.d.ts.map