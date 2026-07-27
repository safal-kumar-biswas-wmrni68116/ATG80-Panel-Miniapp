import React, { useRef, useState, useEffect } from 'react';
import { Text, View, Image, navigateTo } from '@ray-js/ray';
import { useActions, useDpSchema, useProps } from '@ray-js/panel-sdk';
import styles from './index.module.less';
import Strings from '../../i18n';
import { getDpLabel } from '../../i18n/getDpLabel';

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
const STAGE_LABELS = [
  Strings.getLang('soak'),
  Strings.getLang('wash'),
  Strings.getLang('rinse'),
  Strings.getLang('spin'),
];
const STAGE_SEGMENTS = STAGE_LABELS.length - 1; // 3 gaps between 4 dots

// The two numeric DPs that open a grid picker from the footer bar.
type NumberPickerKey = 'water_level' | 'reserve_time_hour' | null;

export function Operation() {
  const dpSchema = useDpSchema();
  const dpState = useProps(state => state);
  const actions = useActions();
  const isNavigating = useRef(false);

  const [isProgramPickerOpen, setProgramPickerOpen] = useState(false);
  const [activeNumberPicker, setActiveNumberPicker] = useState<NumberPickerKey>(null);

  const isOn = dpState?.switch === true;
  const isRunning = dpState?.start === true;
  const isLocked = dpState?.child_lock === true;
  const program = dpState?.program ?? 'NORMAL';
  const workState = dpState?.work_state ?? 'shut_down';

  // Program options pulled live from schema, not hardcoded
  const programRange = dpSchema?.program?.property?.range ?? [];
  const waterLevelRange = dpSchema?.water_level?.property?.range ?? [];
  const delayTimeRange = dpSchema?.reserve_time_hour?.property?.range ?? [];

  // remain_time is in minutes (per schema) -> format as MM:00
  const remainMinutes = Number(dpState?.remain_time ?? 0);
  const durationText = `${String(remainMinutes).padStart(2, '0')}:00`;

  const currentStageIndex = STAGE_ORDER.indexOf(workState);
  const stageRatio =
    currentStageIndex <= 0 ? 0 : Math.min(currentStageIndex, STAGE_SEGMENTS) / STAGE_SEGMENTS;

  const handlePowerOff = () => {
    if (isNavigating.current) return;
    isNavigating.current = true;

    actions.switch.set(false);
    actions.start.set(false);
    actions.child_lock.set(false);

    navigateTo({ url: '/pages/home/index' }); // matches the `route` value in routes.config.ts
  };

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
    if (isLocked) return;
    actions.start.set(false);
  };

  // useEffect(() => {
  //   if (isRunning && isProgramPickerOpen) {
  //     setProgramPickerOpen(false);
  //   }
  // }, [isRunning, isProgramPickerOpen]);

  // Close any open picker (program OR number) once the machine starts
  // running, since all rw params are locked while running.
  useEffect(() => {
    if (isRunning) {
      setProgramPickerOpen(false);
      setActiveNumberPicker(null);
    }
  }, [isRunning]);

  useEffect(() => {
    if (isOn === false) {
      navigateTo({ url: '/pages/home/index' });
      actions.start.set(false);
      actions.child_lock.set(false);
    }
  }, [isOn]);

  useEffect(() => {
    if (isLocked && isRunning) {
      actions.child_lock.set(true);
    } else {
      actions.child_lock.set(false);
    }
  }, [isLocked]);

  const handleOpenProgramPicker = () => {
    if (isRunning) return;
    setProgramPickerOpen(true);
  };

  const handleSelectProgram = (option: string) => {
    if (isRunning) return; // extra guard in case the modal was already open when start flipped true
    actions.program.set(option);
    setProgramPickerOpen(false);
  };

  // Opens the grid picker for either water_level or reserve_time_hour
  const handleOpenNumberPicker = (dpCode: NumberPickerKey) => {
    if (isRunning) return;
    setActiveNumberPicker(dpCode);
  };

  const handleSelectNumberValue = (option: string) => {
    if (isRunning || !activeNumberPicker) return;
    actions[activeNumberPicker].set(option);
    setActiveNumberPicker(null);
  };

  // Small lookup so the modal title/current-value logic can stay generic
  // instead of branching on which DP is active everywhere.
  const numberPickerConfig =
    activeNumberPicker === 'water_level'
      ? {
          titleKey: Strings.getLang('selectWaterLevel'),
          range: waterLevelRange,
          currentValue: dpState?.water_level,
        }
      : activeNumberPicker === 'reserve_time_hour'
      ? {
          titleKey: Strings.getLang('selectDelayTime'),
          range: delayTimeRange,
          currentValue: dpState?.reserve_time_hour,
        }
      : null;

  return (
    <View className={styles.view}>
      {/* <Text>{Strings.getLang('errorText')}</Text> */}

      {/* Top row: program pill + power button */}
      <View className={styles.topRow}>
        <View
          className={isRunning ? styles.programPillDisabled : styles.programPill}
          onClick={handleOpenProgramPicker}
        >
          <Text className={styles.starIcon}>&#9733;</Text>
          <Text className={styles.programText}>{getDpLabel('program', program)}</Text>
        </View>

        <View className={styles.powerCircle} onClick={handlePowerOff}>
          <Image className={styles.powerIcon} src={switchOnImg} mode="aspectFit" />
        </View>
      </View>

      {/* Work state + child lock row */}
      <View className={styles.statusRow}>
        <Text className={styles.stateText}>
          {/* {String(workState).replace(/_/g, ' ')} */}
          {getDpLabel('work_state', workState)}
        </Text>

        <View
          className={isRunning ? styles.lockRow : styles.lockRowDisabled}
          onClick={handleToggleChildLock}
        >
          <Text className={isRunning ? styles.lockLabel : styles.lockLabelDisabled}>
            {Strings.getLang('childLock')}
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
            <Text className={styles.dialOverlayBtnText}>{Strings.getLang('start')}</Text>
          </View>
        )}
      </View>

      <Text className={styles.durationText}>
        {Strings.getLang('duration')}: <Text className={styles.durationValue}>{durationText}</Text>
      </Text>

      {isRunning && (
        <View
          className={isLocked ? styles.pauseBtnDisabled : styles.pauseBtn}
          onClick={handlePause}
        >
          <Text className={isLocked ? styles.pauseBtnTextDisabled : styles.pauseBtnText}>
            {Strings.getLang('pause')}
          </Text>
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

      {/* Footer info bar — Water Level and Delay Time are now tappable */}
      <View className={styles.footerContainer}>
        <View
          className={isRunning ? styles.footerBarDisabled : styles.footerBar}
          onClick={() => handleOpenNumberPicker('water_level')}
        >
          <Image className={styles.footerIcon} src={waterImg} mode="aspectFit" />
          <View>
            <Text className={styles.footerValue}>{dpState?.water_level}</Text>
            <Text className={styles.footerLabel}>{Strings.getLang('waterLevel')}</Text>
          </View>
        </View>

        <View
          className={isRunning ? styles.footerBarDisabled : styles.footerBar}
          onClick={() => handleOpenNumberPicker('reserve_time_hour')}
        >
          <Image className={styles.footerIcon} src={delayImg} mode="aspectFit" />
          <View>
            <Text className={styles.footerValue}>{dpState?.reserve_time_hour}</Text>
            <Text className={styles.footerLabel}>{Strings.getLang('delayTime')}</Text>
          </View>
        </View>
      </View>

      {/* Program picker modal */}
      {isProgramPickerOpen && (
        <View className={styles.modalOverlay} onClick={() => setProgramPickerOpen(false)}>
          <View className={styles.modalCard} onClick={(e: any) => e.stopPropagation?.()}>
            <Text className={styles.modalTitle}>{Strings.getLang('selectProgram')}</Text>

            <View className={styles.modalList}>
              {programRange.map((option: string) => (
                <View
                  key={option}
                  className={option === program ? styles.modalItemActive : styles.modalItem}
                  onClick={() => handleSelectProgram(option)}
                >
                  <Text
                    className={
                      option === program ? styles.modalItemTextActive : styles.modalItemText
                    }
                  >
                    {getDpLabel('program', option)}
                  </Text>
                </View>
              ))}
            </View>

            <View className={styles.modalCancel} onClick={() => setProgramPickerOpen(false)}>
              <Text className={styles.modalCancelText}>{Strings.getLang('cancel')}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Number picker modal (grid style) — water_level / reserve_time_hour */}
      {numberPickerConfig && (
        <View className={styles.modalOverlay} onClick={() => setActiveNumberPicker(null)}>
          <View className={styles.modalCard} onClick={(e: any) => e.stopPropagation?.()}>
            <Text className={styles.modalTitle}>{numberPickerConfig.titleKey}</Text>

            <View className={styles.numberGrid}>
              {numberPickerConfig.range.map((option: string) => (
                <View
                  key={option}
                  className={
                    option === String(numberPickerConfig.currentValue)
                      ? styles.numberCellActive
                      : styles.numberCell
                  }
                  onClick={() => handleSelectNumberValue(option)}
                >
                  <Text
                    className={
                      option === String(numberPickerConfig.currentValue)
                        ? styles.numberCellTextActive
                        : styles.numberCellText
                    }
                  >
                    {option}
                  </Text>
                </View>
              ))}
            </View>

            <View className={styles.modalCancel} onClick={() => setActiveNumberPicker(null)}>
              <Text className={styles.modalCancelText}>{Strings.getLang('cancel')}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

export default Operation;
