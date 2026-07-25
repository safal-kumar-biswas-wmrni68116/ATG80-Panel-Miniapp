import React, { useRef, useEffect } from 'react';
import { Text, View, Image, navigateTo } from '@ray-js/ray';
import { NavBar } from '@ray-js/smart-ui';
import { useDevInfo, useActions, useProps } from '@ray-js/panel-sdk';
import styles from './index.module.less';
import machineImg from '../../res/logo@3x.png';

export function Home() {
  const devInfo = useDevInfo();
  const dpState = useProps(state => state);
  const actions = useActions();
  const isNavigating = useRef(false);

  const isOn = dpState.switch === true;



  useEffect(() => {
    if (isOn === true) {
      navigateTo({ url: '/pages/operation/index'});
    }
  }, [isOn]);


  const handlePowerClick = () => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    actions.switch.set(true);
    actions.start.set(false);
    actions.child_lock.set(false);

    navigateTo({ url: '/pages/operation/index' });
  };

  return (
    <>
      <View className={styles.view}>
        
          <View className={styles.container}>
            <View className={styles.machineWrap}>
              <Image className={styles.machineImage} src={machineImg} mode="aspectFit" />
              </View>

              <Text className={styles.title}>Washing Machine ATG80</Text>

              <Text className={styles.helper}>
                Put your clothes inside the machine{'\n'}and change settings accordingly
              </Text>

              <View className={styles.footer}>
                <View className={styles.powerBtn} onClick={handlePowerClick}>
                  <Text className={styles.powerIcon}>&#9211;</Text>
                  <Text className={styles.powerText}>{isOn ? "ON" : "OFF"}</Text>
                </View>
              </View>
          </View>
      </View>
    </>
  );
}

export default Home;