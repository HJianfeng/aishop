import { Routes, Route } from "react-router-dom";

import Home from '@/pages/Home'
import Layout from '@/pages/Layout'
import NotFound from '@/pages/Layout/404'
import Fusion from '@/pages/Fusion'
import Cutout from '@/pages/Cutout'
import Hd from '@/pages/Hd'
import Repair from '@/pages/Repair'
import Smear from '@/pages/Smear'
import Zoomin from '@/pages/Zoomin'
import Statistic from '@/pages/Admin/Statistic'
import StyleList from '@/pages/Admin/StyleList'
import StatisticDetail from '@/pages/Admin/Statistic/detail'
import OtherDetail from '@/pages/Admin/Statistic/otherDetail'
import FusionDetail from '@/pages/Admin/Statistic/fusionDetail'
import UpscaleDetail from '@/pages/Admin/Statistic/upscaleDetail'
import AiTextDetail from '@/pages/Admin/Statistic/aiTextDetail'
import AdminLayout from '@/pages/Admin/AdminLayout'
import StyleLayout from '@/pages/StyleTool/Layout'
import StyleTool from '@/pages/StyleTool'
import TemplateCreate from '@/pages/Tool/templateCreate'
import Test from '@/pages/Test'
import Taobao from '@/pages/Taobao'
import TaobaoAuthError from '@/pages/Taobao/authError'
function isMobileDevice() {
  return /Mobile|Android|iPhone/i.test(navigator.userAgent);
}
export default function MainRouter() {
  if(isMobileDevice()) {
    return (
      <div className="h-[100vh] px-[10px] flex items-center justify-center">目前暂不支持手机端，请前往PC进行访问，谢谢。</div>
    )
  }
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/fusion' element={<Layout />} >
        <Route path='/fusion/workspace' element={<Fusion />} />
      </Route>
      <Route path='/tool' element={<Layout />} >
        <Route path='/tool/cutout' element={<Cutout />} />
        <Route path='/tool/hd' element={<Hd />} />
        <Route path='/tool/repair' element={<Repair />} />
        <Route path='/tool/smear' element={<Smear />} />
        <Route path='/tool/zoomin' element={<Zoomin />} />
      </Route>
      <Route path='/admin' element={<AdminLayout />} >
        <Route path='/admin' element={<Statistic />} />
        <Route path='/admin/collection' element={<StyleList />} />
        <Route path='/admin/detail/:type/:accountType/:login_name' element={<StatisticDetail />} />
        <Route path='/admin/otherdetail/:type/:accountType/:login_name' element={<OtherDetail />} />
        <Route path='/admin/fusionDetail/:login_name/:accountType' element={<FusionDetail />} />
        <Route path='/admin/upscaleDetail/:login_name/:accountType' element={<UpscaleDetail />} />
        <Route path='/admin/aiTextDetail/:login_name/:accountType' element={<AiTextDetail />} />

      </Route>
      <Route path='/model' element={<StyleLayout />} >
        <Route path='/model' element={<Fusion isDevMode={true} />} />
        <Route path='/model/style' element={<StyleTool />} />
        <Route path='/model/template' element={<TemplateCreate />} />
      </Route>
      <Route path='/test' element={<Test />} />
      <Route path='/tb' element={<Taobao />} />
      <Route path='/tb/autherr' element={<TaobaoAuthError />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}
