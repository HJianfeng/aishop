export enum ActionTypeEnums {
  SET_CANVAS = 'SET_CANVAS',
  SET_CANVAS_IS_LOAD = 'SET_CANVAS_IS_LOAD',
  SET_DEV_PARAMS = 'SET_DEV_PARAMS',
}

export type IAction =
  | {
    type: ActionTypeEnums.SET_CANVAS,
    payload: any
  }
  | {
    type: ActionTypeEnums.SET_CANVAS_IS_LOAD,
    payload: any
  }
  | {
    type: ActionTypeEnums.SET_DEV_PARAMS,
    payload: any
  }