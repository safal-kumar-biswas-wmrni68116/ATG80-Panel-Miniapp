import React from 'react';
import { Text, View } from '@ray-js/ray';
import { useDevInfo, useActions, useDpSchema, useProps } from "@ray-js/panel-sdk";
import { NavBar, Button, Icon } from '@ray-js/smart-ui';
import styles from './index.module.less';

export function Home() {

  // Get all dpSchema
  const dpSchema = useDpSchema();
  console.log("dpSchema", dpSchema);

  const dpSchemaList = Object.entries(dpSchema);
  console.log("dpSchemaList", dpSchemaList[0][1].name);


  // Get all dpState
  const dpState = useProps((state) => state);
  console.log("dpState", dpState);

  
  const dpStateList = Object.entries(dpState);
  console.log("dpStateList", dpStateList[0][1]);



  // const actions = useActions();

  return (
    <>

    <NavBar leftText="Washing Machine" leftTextType="home" />
    
    <View>
      {dpStateList.map(([name, value]) => (
        <View key={name}>
        <Text>{name}: {value}</Text>
        </View>
      ))}
    </View>

    </>
  );
}

export default Home;
