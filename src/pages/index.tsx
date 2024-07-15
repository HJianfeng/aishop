import React from 'react';
import { Layout } from 'antd';
import NavBar from './components/NavBar';
import MainContent from './components/MainContent';
import { CanvasProvider } from '@/components/Canvas'
import styles from './index.module.scss'

const { Header, Content } = Layout;

export default function Home() {
  return (
    <Layout>
      <Header className={styles.header}>
        <NavBar />
      </Header>
      <Content>
        <CanvasProvider>
          <MainContent />
        </CanvasProvider>
      </Content>
    </Layout>
  )
}