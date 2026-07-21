import React from 'react';
import { navigateTo, Text, View } from '@ray-js/ray';
import { useDevInfo, useActions, useDpSchema, useProps } from '@ray-js/panel-sdk';
import { NavBar, Button } from '@ray-js/smart-ui';
import styles from './index.module.less';

export function Demo() {
  
  console.log('This is Demo Page');

  return (
    <>
      <Button onClick={() => navigateTo({ url: '/pages/home/index' })}>
        Go to Home Page
      </Button>
    </>
  );
}

export default Demo;
