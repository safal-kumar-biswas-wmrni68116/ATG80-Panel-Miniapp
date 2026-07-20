import React from 'react';
import { Text, View } from '@ray-js/ray';
import { useDevInfo, useActions, useDpSchema, useProps } from "@ray-js/panel-sdk";
import { NavBar, Button} from '@ray-js/smart-ui';
import styles from './index.module.less';
import { TySwitch } from "@ray-js/components-ty";

export function Home() {

  const dpSchema = useDpSchema();
  const dpState = useProps((state) => state);
  const actions = useActions();

  console.log("dpSchema", dpSchema);
  console.log("dpState", dpState);


  return (
    <>

    <NavBar leftText="Washing Machine" leftTextType="home" />
    

    {/* Render all DPs*/}
    <View>
      {dpState && Object.keys(dpSchema).map((dpCode) => {
        return (
          <View key={dpCode}>
            <Text>{dpCode}: {dpState?.[dpCode as keyof typeof dpState]}</Text>
          </View>
        );
      })}
    </View>


    </>
  );
}

export default Home;
