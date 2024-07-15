
import { fabric } from 'fabric'
import type { FabricObject } from '@/utils/types'
import { PURE_GROUP_TYPE } from './options'
import { useMemo } from 'react'


function GroupConfig({ canvas, curSelectObj } :{canvas?: fabric.Canvas , curSelectObj?: FabricObject|null}) {
  
  const groupObjects = curSelectObj?._objects || []
  const groupTypes: string[] = []
  groupObjects.forEach((obj: fabric.Object) => {
    const type = ['rect', 'circle', 'triangle'].includes(obj.type || '')?'shape':obj.type|| ''
    if(!groupTypes.includes(type)) {
      groupTypes.push(type)
    }
  })
  groupTypes.sort((a:string, b:string) => {
    return b.charCodeAt(0) - a.charCodeAt(0)
  })
  const type = PURE_GROUP_TYPE[groupTypes.join(',')]
  // console.log(type, groupTypes)


  return (
    <div>{type}</div>
  )
}
export default GroupConfig
