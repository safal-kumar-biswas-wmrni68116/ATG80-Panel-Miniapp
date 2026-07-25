import React, { useRef, useState, useEffect } from 'react';
import { Text, View, Image, navigateTo } from '@ray-js/ray';
import { useActions, useDpSchema, useProps } from '@ray-js/panel-sdk';
import styles from './index.module.less';

import circleImg from '../../res/banner@2x.png';
import switchOnImg from '../../res/switch-on@2x.png';
import lockImg from '../../res/lock@2x.png';
import unlockImg from '../../res/unlock@2x.png';
import tempImg from '../../res/temp@2x.png';
import waterImg from '../../res/water@2x.png';
import delayImg from '../../res/startTime@2x.png';

// Work-state stages we visualize on the bottom tracker.
// Maps schema's work_state enum -> a step index.
const STAGE_ORDER = ['soaking', 'washing', 'rinsing', 'dewatering'];
const STAGE_LABELS = ['Soak', 'Wash', 'Rinse', 'Spin'];
const STAGE_SEGMENTS = STAGE_LABELS.length - 1; // 3 gaps between 4 dots

export function Demo() {
  const dpSchema = useDpSchema();
  const dpState = useProps(state => state);
  const actions = useActions();
  const isNavigating = useRef(false);

  const [isProgramPickerOpen, setProgramPickerOpen] = useState(false);

  const isOn = dpState?.switch === true;
  const isRunning = dpState.start === true;
  const isLocked = dpState.child_lock === true;
  const program = dpState.program ?? 'NORMAL';
  const workState = dpState.work_state ?? 'shut_down';

  // Program options pulled live from schema, not hardcoded
  const programRange = dpSchema?.program?.property?.range ?? [];

  // remain_time is in minutes (per schema) -> format as MM:00
  const remainMinutes = Number(dpState.remain_time ?? 0);
  const durationText = `${String(remainMinutes).padStart(2, '0')}:00`;

  const currentStageIndex = STAGE_ORDER.indexOf(workState);
  const stageRatio =
    currentStageIndex <= 0 ? 0 : Math.min(currentStageIndex, STAGE_SEGMENTS) / STAGE_SEGMENTS;


  useEffect(() => {
    if (isOn === false) {
      navigateTo({ url: '/pages/home/index',});
      actions.start.set(false);
      actions.child_lock.set(false);
    }
  }, [isOn]);

  const handlePowerOff = () => {
    if (isNavigating.current) return;
    isNavigating.current = true;

    actions.switch.set(false);
    actions.start.set(false);
    actions.child_lock.set(false);

    navigateTo({ url: '/pages/home/index' }); // matches the `route` value in routes.config.ts
  };






  // if(dpState.switch === false) {
  //   navigateTo({ url: '/pages/home/index' });
  // }






  // Child lock can only be toggled while the machine is actually running.
  // Tapping it while idle is a no-op — button is visually dimmed to match.
  const handleToggleChildLock = () => {
    if (!isRunning) return;
    actions.child_lock.set(!isLocked);
  };

  const handleStart = () => {
    actions.start.set(true);
  };

  const handlePause = () => {
    actions.start.set(false);
  };

  // Any rw parameter (program, water_level, etc.) should be locked while the
  // machine is running — user must Pause first. Add the same `if (isRunning) return;`
  // guard to any future rw control you wire up here.
  // Safety net: if `start` flips to true (e.g. DP updated elsewhere) while
  // the picker happens to be open, close it rather than leaving an editable
  // rw control exposed mid-run.
  useEffect(() => {
    if (isRunning && isProgramPickerOpen) {
      setProgramPickerOpen(false);
    }
  }, [isRunning, isProgramPickerOpen]);

  const handleOpenProgramPicker = () => {
    if (isRunning) return;
    setProgramPickerOpen(true);
  };

  const handleSelectProgram = (option: string) => {
    if (isRunning) return; // extra guard in case the modal was already open when start flipped true
    actions.program.set(option);
    setProgramPickerOpen(false);
  };


  return (
    <View className={styles.view}>
      {/* Top row: program pill + power button */}
      <View className={styles.topRow}>
        <View
          className={isRunning ? styles.programPillDisabled : styles.programPill}
          onClick={handleOpenProgramPicker}
        >
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

        <View
          className={isRunning ? styles.lockRow : styles.lockRowDisabled}
          onClick={handleToggleChildLock}
        >
          <Text className={isRunning ? styles.lockLabel : styles.lockLabelDisabled}>
            Child Lock
          </Text>
          <Image
            className={isRunning ? styles.lockIcon : styles.lockIconDisabled}
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

        {!isRunning && (
          <View className={styles.dialOverlayBtn} onClick={handleStart}>
            <Text className={styles.dialOverlayBtnText}>Start</Text>
          </View>
        )}
      </View>

      <Text className={styles.durationText}>
        Duration: <Text className={styles.durationValue}>{durationText}</Text>
      </Text>

      {isRunning && (
        <View className={styles.pauseBtn} onClick={handlePause}>
          <Text className={styles.pauseBtnText}>Pause</Text>
        </View>
      )}

      {/* Stage tracker */}
      <View className={styles.stageWrap}>
        <View className={styles.stageLineBg} />
        <View className={styles.stageLineActive} style={{ width: `${stageRatio * 75}%` }} />

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
      <View className={styles.footerContainer}>
        <View className={styles.footerBar}>
          <Image className={styles.footerIcon} src={tempImg} mode="aspectFit" />
          <View>
            <Text className={styles.footerValue}>0&deg;C</Text>
            <Text className={styles.footerLabel}>Temperature</Text>
          </View>
        </View>

        <View className={styles.footerBar}>
          <Image className={styles.footerIcon} src={waterImg} mode="aspectFit" />
          <View>
            <Text className={styles.footerValue}>{dpState.water_level}</Text>
            <Text className={styles.footerLabel}>Water Level</Text>
          </View>
        </View>

        <View className={styles.footerBar}>
          <Image className={styles.footerIcon} src={delayImg} mode="aspectFit" />
          <View>
            <Text className={styles.footerValue}>{dpState.reserve_time_hour}</Text>
            <Text className={styles.footerLabel}>Delay Time</Text>
          </View>
        </View>
      </View>

      {/* Program picker modal */}
      {isProgramPickerOpen && (
        <View className={styles.modalOverlay} onClick={() => setProgramPickerOpen(false)}>
          {/* Stop taps inside the card from bubbling up and closing the modal */}
          <View className={styles.modalCard} onClick={(e: any) => e.stopPropagation?.()}>
            <Text className={styles.modalTitle}>Select Program</Text>

            <View className={styles.modalList}>
              {programRange.map((option: string) => (
                <View
                  key={option}
                  className={
                    option === program ? styles.modalItemActive : styles.modalItem
                  }
                  onClick={() => handleSelectProgram(option)}
                >
                  <Text
                    className={
                      option === program ? styles.modalItemTextActive : styles.modalItemText
                    }
                  >
                    {option.replace(/_/g, ' ')}
                  </Text>
                </View>
              ))}
            </View>

            <View className={styles.modalCancel} onClick={() => setProgramPickerOpen(false)}>
              <Text className={styles.modalCancelText}>Cancel</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

export default Demo;