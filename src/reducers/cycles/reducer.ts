import { ACTION_TYPES } from "./actions";

export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

export interface CycleState {
  cycles: Cycle[];
  activeCycleId: string | null;
}

export function CyclesReducer(state: CycleState, action: any) {
  if (action.type === ACTION_TYPES.ADD_NEW_CYCLE) {
    return {
      ...state,
      cycles: [...state.cycles, action.payload.newCycle],
      activeCycleId: action.payload.newCycle.id,
    };
  }

  if (action.type === ACTION_TYPES.INTERRUPT_CURRENT_CYCLE) {
    return {
      ...state,
      cycles: state.cycles.map((cycle) => {
        if (cycle.id === state.activeCycleId) {
          return { ...cycle, interruptedDate: new Date() };
        } else {
          return cycle;
        }
      }),
      activeCycleId: null,
    };
  }

  if (action.type === ACTION_TYPES.MARK_CURRENT_CYCLE_AS_FINISHED) {
    return {
      ...state,
      cycles: state.cycles.map((cycle) => {
        if (cycle.id === state.activeCycleId) {
          return { ...cycle, finishedDate: new Date() };
        } else {
          return cycle;
        }
      }),
      activeCycleId: null,
    };
  }

  return state;
}
