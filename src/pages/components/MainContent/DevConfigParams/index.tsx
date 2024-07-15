import React, { useEffect } from 'react';
import { Input, Form, Row, Col, Radio, Select } from 'antd';
import { useCanvasContext } from '@/components/Canvas/hooks';
import { ActionTypeEnums } from '@/constant/reducer';
import { getSdConfig } from '@/service';
import { parseJson } from '@/utils';
import { ISelectItem } from '@/interface'
interface IDevConfigParams {
  config: ISelectItem
}
const DevConfigParams: React.FC<IDevConfigParams> = (props) => {
  const [form] = Form.useForm();

  const { dispatch } = useCanvasContext();

  useEffect(() => {
    if (props?.config?.id) {
      getSdConfig({ task_id: props?.config?.id}).then((res: any) => {
        form.setFieldsValue(parseJson(res));
        dispatch({
          type: ActionTypeEnums.SET_DEV_PARAMS,
          payload: {
            devParams: parseJson(res)
          }
        })
      })
    }
  }, [props?.config?.id])

  return (
    <div style={{ padding: '20px 5px' }}>
      <Form form={form} onValuesChange={(cur, values) => {
        dispatch({
          type: ActionTypeEnums.SET_DEV_PARAMS,
          payload: {
            devParams: values
          }
        })
      }}>
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item label="模型:" name="sd_model_checkpoint">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="种子:" name="seed">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="clip:" name="clip">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="正向:" name="prompt">
          <Input.TextArea style={{ height: 150,width:500, resize: 'none' }} />
        </Form.Item>
        <Form.Item label="反向:" name="negative_prompt">
          <Input.TextArea style={{ height: 150,width:500, resize: 'none' }} />
        </Form.Item>
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item label="模糊:" name="mask_blur">
              <Input />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="" name="inpainting_fill">
              <Radio.Group>
                <Radio value={0}>填充</Radio>
                <Radio value={1}>原图</Radio>
                <Radio value={2}>噪声</Radio>
                <Radio value={3}>数值零</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={6}>
            <Form.Item label="采样:" name="sampler_name">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="步数:" name="steps">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="CFG:" name="cfg_scale">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="重绘:" name="denoising_strength">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        controlNet:
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item label="预处理:" name="cnargs_module">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="模型:" name="cnargs_model">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="权重:" name="cnargs_weight">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={6}>
            <Form.Item label="start:" name="cnargs_guidance_start">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="end:" name="cnargs_guidance_end">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default DevConfigParams;