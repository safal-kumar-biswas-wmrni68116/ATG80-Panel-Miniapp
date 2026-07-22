import React, {useRef} from 'react';
import { navigateTo, Text, View } from '@ray-js/ray';
import { useDevInfo, useActions, useDpSchema, useProps, } from '@ray-js/panel-sdk';
import { NavBar, Button } from '@ray-js/smart-ui';
import styles from './index.module.less';

export function Demo() {

  const devInfo = useDevInfo();
  const dpState = useProps(state => state);
  const actions = useActions();
  const isNavigating = useRef(false);
  
  const isOn = dpState.switch === true;
  
  
  const handlePowerClick = () => {
    if (isNavigating.current) return;
    isNavigating.current = false;
    actions.switch.set(false);
    navigateTo({ url: '/pages/home/index' });
  };

  return (
    <>
      <View className={styles.view}>
        <View className={styles.footer}>
          <View className={styles.powerBtn} onClick={handlePowerClick}>
            <Text className={styles.powerIcon}>&#9211;</Text>
            <Text className={styles.powerText}>{isOn ? "ON" : "OFF"}</Text>
          </View>
        </View>
      </View>
    </>
  );
}

export default Demo;
