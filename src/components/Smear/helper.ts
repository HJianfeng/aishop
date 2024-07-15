
export interface SetTextOptions {
  fill?: string
  backgroundColor?: string
  fontWeight?: 'normal' | 'bold'
  fontStyle?: '' | 'normal' | 'italic' | 'oblique'
  textAlign?: 'left' | 'center' | 'right'
  fontFamily?: string
  cornerStyle?: 'circle' | 'rect'
}

export const fontList = [
  { value: 'alibaba', label: '阿里巴巴普惠体' },
  { value: 'alimama', label: '阿里妈妈方圆体' },
  { value: 'zk', label: '站酷文艺体' },
  { value: 'md', label: '摩登小方体' },
  { value: 'zh', label: '字魂扁桃体' },
  { value: 'fzhtjt', label: '方正黑体简体' },
  { value: 'rzcp', label: '锐字潮牌' },
  { value: 'yshst', label: '优设好身体' },

]