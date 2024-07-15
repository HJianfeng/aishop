import React from 'react';
import { Form,Input, Slider } from 'antd';
import styles from './index.module.scss';


const Advanced: React.FC = () => {

  return (
    <div className={styles.advanced}>
      <Form
        // labelCol={{ span: 4 }}
        // wrapperCol={{ span: 14 }}
        layout="vertical"
        style={{ maxWidth: 400 }}
      >
        <Form.Item label="描述你的产品">
          <Input placeholder="请描述你的产品" />
        </Form.Item>
        <Form.Item label="产品是什么">
          <Input placeholder="产品是什么" />
        </Form.Item>
        <Form.Item label="在哪里">
          <Input placeholder="在哪里" />
        </Form.Item>
        <Form.Item label="周围环境怎么样">
          <Input placeholder="周围环境怎么样" />
        </Form.Item>
        <Form.Item label="场景融合度">
          <Slider />
        </Form.Item>

      </Form>
    </div>
  );
};

export default Advanced;