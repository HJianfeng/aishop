import { createSlice } from '@reduxjs/toolkit'

export const toolSlice = createSlice({
  name: 'tool',
  initialState: {
    hdPageTooltip: false,
    repairPageTooltip: false,
    cutoutPageTooltip: false,
    smearPageTooltip: false,
    fusionImgInfo: {
      width: 440,
      height: 440
    },
    fusionSmearDialog: false
  },
  reducers: {
    setFusionImgInfo: (state, action) => {
      state.fusionImgInfo = action.payload
    },
    setTooltip: (state, action) => {
      switch (action.payload) {
        case 'hd':
          state.hdPageTooltip = true
          break;
        case 'repair':
          state.repairPageTooltip = true
          break;
        case 'cutout':
          state.cutoutPageTooltip = true
          break;
        case 'smear':
          state.smearPageTooltip = true
          break;
      }
    },
    hideTooltip: (state, action) => {
      switch (action.payload) {
        case 'hd':
          state.hdPageTooltip = false
          break;
        case 'repair':
          state.repairPageTooltip = false
          break;
        case 'cutout':
          state.cutoutPageTooltip = false
          break;
        case 'smear':
          state.smearPageTooltip = false
          break;
      }
    },
    hideAllTooltip: (state) => {
      state.hdPageTooltip = false
      state.cutoutPageTooltip = false
      state.smearPageTooltip = false
      state.repairPageTooltip = false
    },
    setSmearDialog: (state, action) => {
      state.fusionSmearDialog = action.payload
    },
  }
})
// 每个 case reducer 函数会生成对应的 Action creators
export const { setTooltip, hideTooltip, hideAllTooltip, setSmearDialog } = toolSlice.actions

export default toolSlice.reducer