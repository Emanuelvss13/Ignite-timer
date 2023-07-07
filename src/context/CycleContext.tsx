import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { Cycle, CyclesReducer } from '../reducers/cycles/reducer'
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
} from '../reducers/cycles/actions'
import { differenceInSeconds } from 'date-fns'

interface CycleContextProviderProps {
  children: ReactNode
}

interface NewCycleFormData {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  amountSecondsPassed: number
  activeCycleId: string | null
  activeCycle: Cycle | undefined
  interruptCycle: () => void
  markCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: NewCycleFormData) => void
}

export const CycleContext = createContext({} as CyclesContextType)

export function CycleContextProvider({ children }: CycleContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    CyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedCycles = localStorage.getItem('@ignite-timer-cycles')

      if (storedCycles) {
        return JSON.parse(storedCycles)
      }

      return initialState
    },
  )

  const { cycles, activeCycleId } = cyclesState

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })

  useEffect(() => {
    const cyclesToStore = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer-cycles', cyclesToStore)
  }, [cyclesState])

  function createNewCycle(data: NewCycleFormData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))

    setAmountSecondsPassed(0)
  }

  function interruptCycle() {
    dispatch(interruptCurrentCycleAction)
  }

  function markCycleAsFinished() {
    dispatch(markCycleAsFinished)
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  return (
    <CycleContext.Provider
      value={{
        activeCycle,
        amountSecondsPassed,
        cycles: cyclesState.cycles,
        activeCycleId,
        createNewCycle,
        interruptCycle,
        setSecondsPassed,
        markCycleAsFinished,
      }}
    >
      {children}
    </CycleContext.Provider>
  )
}
