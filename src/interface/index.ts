export interface ISelectItem {
  coordinate: string;
  id: string;
  main_img: string;
  task_name: string;
  tbn_main_img: string;
  user_name: string;
  /**
   * 1: demo
   */
  is_demo: number
  img_width: string | number
}

export interface ISceneItem {
  id: number;
  n_prompt: string;
  prompt: string;
  style_img: string;
  style_name: string;
  type_name: string
  cost_time?: number
}

export interface DemoItem {
  DemoImg: string
  MainImgKey: string
  TbnImgKey: string
  TaskEnName: string
  TaskName: string
  BoxImgKey: string
}