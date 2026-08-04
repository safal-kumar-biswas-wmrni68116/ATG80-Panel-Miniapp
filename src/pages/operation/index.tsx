import React, { useRef, useState, useEffect } from 'react';
import { Text, View, Image, navigateTo } from '@ray-js/ray';
import { useActions, useDpSchema, useProps } from '@ray-js/panel-sdk';
import styles from './index.module.less';
import Strings from '../../i18n';
import { getDpLabel } from '../../i18n/getDpLabel';
import { PROGRAM_PRESETS } from './programPresets';

import circleImg from '../../res/banner@2x.png';
import switchOnImg from '../../res/switch-on@2x.png';
import lockImg from '../../res/lock@2x.png';
import unlockImg from '../../res/unlock@2x.png';
import waterImg from '../../res/water@2x.png';
import delayImg from '../../res/startTime@2x.png';
import airDryImg from '../../res/cloth-type/wind@2x.png'

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

// The numeric DPs that open a grid picker from the footer bar.
type NumberPickerKey = 'water_level' | 'reserve_time_hour' | 'drytime' | null;

// error_report "0" == "No fault" / E0 in schema.ts + the i18n export.
// Any other value means a real fault is being reported.
const NO_ERROR_CODE = '0';
const Errors = [
  { eCode: '1', errorType: Strings.getLang('e1') },
  { eCode: '2', errorType: Strings.getLang('e2') },
  { eCode: '3', errorType: Strings.getLang('e3') },
  { eCode: '4', errorType: Strings.getLang('e4') },
  { eCode: '5', errorType: Strings.getLang('e5') },
  { eCode: '6', errorType: Strings.getLang('e6') },
  { eCode: '7', errorType: Strings.getLang('e7') },
  { eCode: '8', errorType: Strings.getLang('e8') },
  { eCode: '9', errorType: Strings.getLang('e9') },
];


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

  // ===== ERROR HANDLING =====
  // Treat a missing error_report the same as "0" (no fault) so we never
  // flash an error box before the DP has reported in.
  const errorCode = String(dpState?.error_report ?? NO_ERROR_CODE);
  const hasError = errorCode !== NO_ERROR_CODE;

  // Human-readable label for the current fault. Falls back to a generic
  // string if the reported code isn't in our lookup table yet.
  const errorLabel = Errors.find(e => e.eCode === errorCode)?.errorType ?? 'Unknown Error';

  // While an error is present, every control except the power button is
  // locked out — this OR's together with the existing isRunning gate so
  // both "machine running" and "machine faulted" produce the same
  // only-power-active behavior.
  const controlsLocked = isRunning || hasError;

  // Program options pulled live from schema, not hardcoded
  const programRange = dpSchema?.program?.property?.range ?? [];
  // Water level options are scoped to whatever the CURRENT program allows —
  // falls back to the full DP range if the selected program has no preset
  // (shouldn't normally happen, but keeps the picker usable either way).
  const currentPreset = PROGRAM_PRESETS[program];
  const waterLevelRange =
    currentPreset?.available_water_level ?? dpSchema?.water_level?.property?.range ?? [];
  const isAirDryProgram = program === 'AIR_DRY';
  const drytimeRange = dpSchema?.drytime?.property?.range ?? [];
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

  // Child lock can only be toggled while the machine is actually running
  // AND there's no active fault.
  const handleToggleChildLock = () => {
    if (!isRunning || hasError) return;
    actions.child_lock.set(!isLocked);
  };

  const handleStart = () => {
    if (controlsLocked) return; // can't start into/through a fault
    actions.start.set(true);
  };

  const handlePause = () => {
    if (isLocked) return;
    actions.start.set(false);
  };

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

  // ===== ERROR HANDLING =====
  // The moment a fault is reported while the machine is running, force it
  // into a paused state. Runs whenever hasError or isRunning changes, so it
  // self-corrects even if `start` gets set true again while a fault is
  // still active (e.g. a stray DP write from elsewhere).
  useEffect(() => {
    if (hasError && isRunning) {
      actions.start.set(false);
    }
  }, [hasError, isRunning]);

  // ===== EXTERNAL PROGRAM SYNC =====
  // `handleSelectProgram` only pushes the preset (soak/wash/rinse/spin
  // times + default water level) when the change comes from THIS app's
  // picker. If `program` changes from the physical machine's own control
  // panel instead, dpState.program updates fine on its own — but nothing
  // re-applies the matching preset, so the derived DPs and the water-level
  // picker's available range can drift from whatever program the machine
  // actually reports.
  //
  // This watches `program` itself (regardless of who changed it) and
  // reapplies its preset. `prevProgramRef` skips the very first render so
  // opening the panel doesn't immediately stomp on values already stored
  // on the device — it only fires on an ACTUAL change after that.
  const prevProgramRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevProgramRef.current === null) {
      prevProgramRef.current = program;
      return;
    }

    if (prevProgramRef.current !== program) {
      prevProgramRef.current = program;

      const preset = PROGRAM_PRESETS[program];
      if (preset) {
        actions.soaktime.set(preset.soaktime);
        actions.washtime.set(preset.washtime);
        actions.rinsetimes.set(preset.rinsetimes);
        actions.spintime.set(preset.spintime);
        actions.water_level.set(preset.water_level);
      }
    }
  }, [program]);

  const handleOpenProgramPicker = () => {
    if (controlsLocked) return;
    // setProgramPickerOpen(true);
    navigateTo({ url: '/pages/selectProgram/index' });
  };

  const handleSelectProgram = (option: string) => {
    if (controlsLocked) return;
    actions.program.set(option);

    // Selecting a program applies its full preset — the individual
    // soak/wash/rinse/spin times and default water level aren't exposed as
    // separate controls; they're implied entirely by the program choice.
    const preset = PROGRAM_PRESETS[option];
    if (preset) {
      actions.soaktime.set(preset.soaktime);
      actions.washtime.set(preset.washtime);
      actions.rinsetimes.set(preset.rinsetimes);
      actions.spintime.set(preset.spintime);
      actions.water_level.set(preset.water_level);
    }

    setProgramPickerOpen(false);
  };

  // Opens the grid picker for either water_level or reserve_time_hour
  const handleOpenNumberPicker = (dpCode: NumberPickerKey) => {
    if (controlsLocked) return;
    setActiveNumberPicker(dpCode);
  };

  const handleSelectNumberValue = (option: string) => {
    if (controlsLocked || !activeNumberPicker) return;
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
      : activeNumberPicker === 'drytime'
      ? {
          // NEW: Air Dry Time picker — only ever opened when isAirDryProgram is true
          titleKey: Strings.getLang('selectAirDryTime'),
          range: drytimeRange,
          currentValue: dpState?.drytime,
        }
      : null;

  return (
    <View className={styles.view}>
      {/* Top row: program pill + power button */}
      <View className={styles.topRow}>
        <View
          className={controlsLocked ? styles.programPillDisabled : styles.programPill}
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
        <Text className={styles.stateText}>{getDpLabel('work_state', workState)}</Text>

        <View>
          <View
            className={
              !isRunning || hasError
                ? styles.lockRowDisabled
                : isLocked
                ? styles.lockRowLocked
                : styles.lockRow
            }
            onClick={handleToggleChildLock}
          >
            <Text
              className={
                !isRunning || hasError
                  ? styles.lockLabelDisabled
                  : isLocked
                  ? styles.lockLabelLocked
                  : styles.lockLabel
              }
            >
              {Strings.getLang('childLock')}
            </Text>
            <Image
              className={
                !isRunning || hasError
                  ? styles.lockIconDisabled
                  : isLocked
                  ? styles.lockIconLocked
                  : styles.lockIcon
              }
              src={isLocked ? lockImg : unlockImg}
              mode="aspectFit"
            />
          </View>

          {isLocked && !hasError && (
            <Text className={styles.unlockHint}>{Strings.getLang('tapToUnlock')}</Text>
          )}
        </View>
      </View>

      {/* Gradient dial */}
      <View className={styles.dialWrap}>
        <Image
          className={`${styles.dialImage} ${isRunning ? styles.dialImageSpinning : ''}`}
          src={circleImg}
          mode="aspectFit"
        />

        {/* Hidden entirely during a fault — only the power button stays usable */}
        {!isRunning && !hasError && (
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

      {/* ===== ERROR HANDLING =====
          Error banner only renders when error_report is anything other
          than "0" (E0 = No Error Code). Flashes red to grab attention. */}
      {hasError && (
        <View className={styles.errorBanner}>
          <Text className={styles.errorBannerCode}>{`E${errorCode}`}</Text>
          <Text className={styles.errorBannerText}>{errorLabel}</Text>
        </View>
      )}

      {/* Footer info bar — Water Level and Delay Time are tappable */}
      <View className={styles.footerContainer}>
        <View
          className={controlsLocked ? styles.footerBarDisabled : styles.footerBar}
          onClick={() => handleOpenNumberPicker(isAirDryProgram ? 'drytime' : 'water_level')}
        >
          <Image
            className={styles.footerIcon}
            src={isAirDryProgram ? airDryImg : waterImg}
            mode="aspectFit"
          />
          <View>
            <Text className={styles.footerValue}>
              {isAirDryProgram ? dpState?.drytime : dpState?.water_level}
            </Text>
            <Text className={styles.footerLabel}>
              {isAirDryProgram ? Strings.getLang('airDryTime') : Strings.getLang('waterLevel')}
            </Text>
          </View>
        </View>

        <View
          className={controlsLocked ? styles.footerBarDisabled : styles.footerBar}
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