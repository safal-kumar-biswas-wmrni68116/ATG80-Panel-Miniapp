import React from 'react';
import { navigateTo, Text, View } from '@ray-js/ray';
import { useDevInfo, useActions, useDpSchema, useProps } from '@ray-js/panel-sdk';
import { NavBar, Button } from '@ray-js/smart-ui';
import styles from './index.module.less';

export function Home() {
  // Schema: keyed by dpCode -> { code, name, mode, property: { type, range/min/max/step } }
  const dpSchema = useDpSchema();

  // State: keyed by dpCode -> current live value
  const dpState = useProps(state => state);

  // actions[dpCode].set(value) is how you PUBLISH a new value for a DP
  const actions = useActions();

  console.log('This is Home Page 26');

  return (
    <>
      {/* <NavBar leftText="Washing Machine" leftTextType="home" /> */}
      

      <View className={styles.view}>
        {Object.keys(dpSchema || {}).map(dpCode => {
          const schemaItem = dpSchema[dpCode];
          const value = dpState[dpCode];
          const isEditable = schemaItem.mode === 'rw'; // only rw DPs should get controls
          const propType = schemaItem.property?.type; // similar to typeOf

          // console.log(dpCode, dpState[dpCode]);


          let greeting;
          if(dpCode === 'switch' && dpState[dpCode] === true) {
              greeting = "Power On";
          }
          else if(dpCode === 'switch' && dpState[dpCode] === false) {
              greeting = "Power Off";
          }


          return (
            <View key={dpCode} className={styles.dpRow}>
              <Text className={styles.dpLabel}>{dpCode}</Text>
              <Text>{greeting}</Text>


              {/* Read-only DPs: just show the value, no control */}
              {!isEditable && <Text className={styles.dpValue}>{String(value)}</Text>}

              {/* Boolean DPs: switch/start/child_lock -> toggle */}
              {isEditable && propType === 'bool' && (
                <Button
                  size="mini"
                  type={value ? 'primary' : 'default'}
                  className={styles.toggleBtn}
                  onClick={() => {
                    actions[dpCode].set(!value);
                  }}
                >
                  {value ? 'ON' : 'OFF'}
                </Button>
              )}

              {/* Enum DPs: program/water_level -> option buttons */}
              {isEditable && propType === 'enum' && (
                <View className={styles.optionRow}>
                  {schemaItem.property.range.map((option: string) => (
                    <Button
                      key={option}
                      size="mini"
                      type={value === option ? 'primary' : 'default'}
                      className={styles.optionBtn}
                      onClick={() => actions[dpCode].set(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </View>
              )}

              {/* Numeric DPs: reserve_time_min etc -> +/- stepper */}
              {isEditable && propType === 'value' && (
                <View className={styles.stepperRow}>
                  <Button
                    size="mini"
                    onClick={() => {
                      const { min = 0, step = 1 } = schemaItem.property;
                      const next = Math.max(min, Number(value) - step);
                      actions[dpCode].set(next);
                    }}
                  >
                    -
                  </Button>
                  <Text className={styles.stepperValue}>{value}</Text>
                  <Button
                    size="mini"
                    onClick={() => {
                      const { max = 100, step = 1 } = schemaItem.property;
                      const next = Math.min(max, Number(value) + step);
                      actions[dpCode].set(next);
                    }}
                  >
                    +
                  </Button>
                </View>
              )}
            </View>
          );
        })}
      </View>

      <Button onClick={() => navigateTo({ url: '/pages/demo/index' })}>
        Go to Demo Page
      </Button>

      {/* <Button>Go to Demo Page</Button> */}
    </>
  );
}

export default Home;
