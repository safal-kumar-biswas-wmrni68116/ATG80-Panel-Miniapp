import React, { useRef } from 'react';
import { Text, View, Image, navigateTo } from '@ray-js/ray';
import { useActions, useProps } from '@ray-js/panel-sdk';
import styles from './index.module.less';

import circleImg from '../../res/banner@2x.png';
import switchOnImg from '../../res/switch-on@2x.png';
import lockImg from '../../res/lock@2x.png';
import unlockImg from '../../res/unlock@2x.png';
import tempImg from '../../res/temp@2x.png';

// Work-state stages we visualize on the bottom tracker.
// Maps schema's work_state enum -> a step index.
const STAGE_ORDER = ['soaking', 'washing', 'rinsing', 'dewatering'];
const STAGE_LABELS = ['Soak', 'Wash', 'Rinse', 'Spin'];
const STAGE_SEGMENTS = STAGE_LABELS.length - 1; // 3 gaps between 4 dots

export function Demo() {
  const dpState = useProps(state => state);
  const actions = useActions();
  const isNavigating = useRef(false);
  const isStart = useRef(false);
  const isChildLock = useRef(false);

  const isRunning = dpState.start === true;
  const isLocked = dpState.child_lock === true;
  const program = dpState.program ?? 'NORMAL';
  const workState = dpState.work_state ?? 'shut_down';

  // remain_time is in minutes (per schema) -> format as MM:00
  const remainMinutes = Number(dpState.remain_time ?? 0);
  const durationText = `${String(remainMinutes).padStart(2, '0')}:00`;

  const currentStageIndex = STAGE_ORDER.indexOf(workState);
  // Progress ratio (0 to 1) across the tracker, used to size the active line
  const stageRatio =
    currentStageIndex <= 0 ? 0 : Math.min(currentStageIndex, STAGE_SEGMENTS) / STAGE_SEGMENTS;

  const handlePowerOff = () => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    actions.switch.set(false);

    isStart.current = true;
    actions.start.set(false);

    isChildLock.current = true;
    actions.child_lock.set(false);

    navigateTo({ url: '/pages/home/index' });
  };

  const handleToggleChildLock = () => {
    actions.child_lock.set(!isLocked);
  };

  const handleStart = () => {
    actions.start.set(true);
  };

  const handlePause = () => {
    actions.start.set(false);
  };

  return (
    <View className={styles.view}>
      {/* Top row: program pill + power button */}
      <View className={styles.topRow}>
        <View className={styles.programPill}>
          <Text className={styles.starIcon}>&#9733;</Text>
          <Text className={styles.programText}>{String(program).toUpperCase()}</Text>
        </View>

        <View className={styles.powerCircle} onClick={handlePowerOff}>
          <Image className={styles.powerIcon} src={switchOnImg} mode="aspectFit" />
        </View>
      </View>

      {/* Work state + child lock row */}
      <View className={styles.statusRow}>
        <Text className={styles.stateText}>
          {String(workState).replace(/_/g, ' ')}
        </Text>

        <View className={styles.lockRow} onClick={handleToggleChildLock}>
          <Text className={styles.lockLabel}>Child Lock</Text>
          <Image
            className={styles.lockIcon}
            src={isLocked ? lockImg : unlockImg}
            mode="aspectFit"
          />
        </View>
      </View>

      {/* Gradient dial */}
      <View className={styles.dialWrap}>
        <Image
          className={`${styles.dialImage} ${isRunning ? styles.dialImageSpinning : ''}`}
          src={circleImg}
          mode="aspectFit"
        />
 
        {/* Start CTA overlaid inside the dial when idle */}
        {!isRunning && (
          <View className={styles.dialOverlayBtn} onClick={handleStart}>
            <Text className={styles.dialOverlayBtnText}>Start</Text>
          </View>
        )}
      </View>
 
      <Text className={styles.durationText}>
        Duration: <Text className={styles.durationValue}>{durationText}</Text>
      </Text>
 
      {/* Pause CTA shown below the dial while running */}
      {isRunning && (
        <View className={styles.pauseBtn} onClick={handlePause}>
          <Text className={styles.pauseBtnText}>Pause</Text>
        </View>
      )}

      {/* Stage tracker */}
      <View className={styles.stageWrap}>
        <View className={styles.stageLineBg} />
        <View
          className={styles.stageLineActive}
          style={{ width: `${stageRatio * 75}%` }}
        />
 
        <View className={styles.stageDotsRow}>
          {STAGE_LABELS.map((label, index) => (
            <View key={label} className={styles.stageItem}>
              <Text className={styles.stageLabel}>{label}</Text>
              <View
                className={index <= currentStageIndex ? styles.stageDotActive : styles.stageDot}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Footer info bar (Temperature is cosmetic — no matching DP exists in schema.ts) */}
      <View className={styles.footerBar}>
        <Image className={styles.footerIcon} src={tempImg} mode="aspectFit" />
        <View>
          <Text className={styles.footerValue}>0&deg;C</Text>
          <Text className={styles.footerLabel}>Temperature</Text>
        </View>
      </View>
    </View>
  );
}

export default Demo;