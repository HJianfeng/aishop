
import { Dispatch } from 'react';
import { fabric } from 'fabric';
import { IAction, ActionTypeEnums } from '@/constant/reducer';

export const initialState = {
  canvas: null,
  loading: false,
  devParams: null,
}
export interface IState {
  canvas: fabric.Canvas | null;
  loading: boolean;
  devParams: Record<string, any> | null,
}
export type canvasInfo = {
  width: number,
  height: number,
}
export interface CanvasContext {
  state: IState,
  dispatch: Dispatch<IAction>;
  imageOffset: React.MutableRefObject<offset>;
  canvasInfo: canvasInfo;
}

export type offset = {
  x: number,
  y: number,
  width: number,
  angle: number
}
export const reducerFunction = (state: IState, action: IAction) => {
  switch (action.type) {
    case ActionTypeEnums.SET_CANVAS:
      return {
        ...state,
        ...action.payload,
      };
    case ActionTypeEnums.SET_CANVAS_IS_LOAD:
      return {
        ...state,
        ...action.payload,
      };
    case ActionTypeEnums.SET_DEV_PARAMS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      break;
  }
};