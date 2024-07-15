import { fabric } from 'fabric'

export interface Users {
  user_name: string
  token: string
  user_type: number
}
export interface FabricObject extends fabric.Object {
  id?: string
  _objects?: fabric.Object[]
}