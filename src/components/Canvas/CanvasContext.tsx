import React, { FC, createContext, useRef, useReducer} from 'react';
import { CanvasContext, initialState, reducerFunction, offset, canvasInfo } from './reducer';
interface IProps {
  children: React.ReactNode
}

export const Context = createContext<CanvasContext>({
  state: initialState,
  dispatch: () => {},
  imageOffset: {
    current: {
      x: 0,
      y: 0,
      width: 0,
      angle: 0
    }
  },
  canvasInfo: { width: 440, height: 440 },
})

export const CanvasProvider: FC<IProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducerFunction, initialState);
  const imageOffset = useRef<offset>({ x: 0, y: 0, width: 0, angle: 0 })
  const canvasInfo: canvasInfo = { width: 440, height: 440}

  const context = { state, dispatch, imageOffset, canvasInfo }

  return <Context.Provider value={context}>{children}</Context.Provider>
}
