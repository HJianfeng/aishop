import React, { useState } from 'react';
import { getSlogan } from '@/service'
import { Button, Form, Input, message, Select, Radio } from 'antd';

const Test: React.FC = () => {
  const [slogan, setSlogan] = React.useState<any>('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    try {
      setLoading(true)
      const res = await getSlogan(values)
      setLoading(false)
      console.log(res);
      setSlogan(res)
    } catch (error: any) {
      setLoading(false)
      message.error(error.message)
    }
  }; 
  const onReset = () => {
    form.resetFields();
  };
  return (
    <div className="p-[20px]">
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 1000 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="产品"
          name="main1"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="品类"
          name="main2"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="用途"
          name="minor1"
        >
          <Input.TextArea style={{ height: 80, width:800, resize: 'none' }} />
        </Form.Item>
        <Form.Item
          label="成份"
          name="minor2"
        >
          <Input.TextArea style={{ height: 80, width:800, resize: 'none' }} />
        </Form.Item>
        <Form.Item
          label="功能"
          name="minor3"
        >
          <Input.TextArea style={{ height: 80, width:800, resize: 'none' }} />
        </Form.Item>
        <Form.Item
          label="产地"
          name="minor4"
        >
          <Input.TextArea style={{ height: 80, width:800, resize: 'none' }} />
        </Form.Item>
        <Form.Item
          label="辅助信息"
          name="assist1"
        >
          <Input.TextArea style={{ height: 80, width:800, resize: 'none' }} />
        </Form.Item>
        <Form.Item
          label="侧重点"
          name="keypoint"
        >
          <Radio.Group>
            <Radio value={'用途'}>用途</Radio>
            <Radio value={'成份'}>成份</Radio>
            <Radio value={'功能'}>功能</Radio>
            <Radio value={'产地'}>产地</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="文案语气"
          name="tone"
        >
          <Select
            options={[
              { value: '文艺' },
              { value: '活泼' },
              { value: '幽默' },
              { value: '专业' },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="文案字数"
          name="solgan_len"
        >
          <Select
            options={[
              { value: '长' },
              { value: '短' },
            ]}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button loading={loading} type="primary" className='mr-[10px]' htmlType="submit">
            提交
          </Button>
          <Button htmlType="button" onClick={onReset}>
            重置
          </Button>
        </Form.Item>`
      </Form>
      <div className='mt-[50px] whitespace-pre-wrap'>{slogan}</div>
    </div>
  )
}

export default Test