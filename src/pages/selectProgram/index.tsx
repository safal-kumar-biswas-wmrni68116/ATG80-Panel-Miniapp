import React, { useState, useEffect, useRef } from 'react';
import { Text, View, navigateTo } from '@ray-js/ray';
import { useActions, useDpSchema, useProps } from '@ray-js/panel-sdk';
import styles from './index.module.less';
import Strings from '../../i18n';
import { getDpLabel } from '../../i18n/getDpLabel';
import { PROGRAM_PRESETS, ProgramPreset } from '../operation/programPresets';

// Fields editable via a grid picker on this page (drytime is only relevant
// for AIR_DRY and isn't part of the base ProgramPreset numeric fields).
type EditableField = 'soaktime' | 'washtime' | 'rinsetimes' | 'spintime' | 'water_level' | 'drytime';

const FIELD_LABEL_KEYS: Record<EditableField, string> = {
  soaktime: 'soak',
  washtime: 'wash',
  rinsetimes: 'rinse',
  spintime: 'spin',
  water_level: 'waterLevel',
  drytime: 'airDryTime',
};

// Rendering order for the field rows (excluding water_level/drytime, which
// is handled separately since exactly one of the two shows, never both).
const TIME_FIELD_ORDER: EditableField[] = ['soaktime', 'washtime', 'rinsetimes', 'spintime'];

export function SelectProgram() {
  const dpSchema = useDpSchema();
  const dpState = useProps(state => state);
  const actions = useActions();
  const isNavigating = useRef(false);

  const programRange = dpSchema?.program?.property?.range ?? [];

  // Which program tab is currently highlighted on this page. Starts from
  // whatever the device currently reports.
  const [selectedProgram, setSelectedProgram] = useState<string>(
    dpState?.program ?? programRange[0] ?? 'NORMAL'
  );

  // Local DRAFT values — nothing here writes to a DP until Proceed is
  // tapped. Reset to the selected program's preset every time the tab
  // changes, but preserved across re-renders while the SAME program stays
  // selected (so in-page edits aren't lost on every render).
  const [draft, setDraft] = useState<Record<EditableField, string>>(() =>
    buildDraftFromPreset(PROGRAM_PRESETS[selectedProgram])
  );

  const [activeFieldPicker, setActiveFieldPicker] = useState<EditableField | null>(null);

  const preset: ProgramPreset | undefined = PROGRAM_PRESETS[selectedProgram];
  const isAirDry = selectedProgram === 'AIR_DRY';

  useEffect(() => {
    setDraft(buildDraftFromPreset(PROGRAM_PRESETS[selectedProgram]));
  }, [selectedProgram]);

  function buildDraftFromPreset(p: ProgramPreset | undefined): Record<EditableField, string> {
    return {
      soaktime: p?.soaktime ?? '0',
      washtime: p?.washtime ?? '0',
      rinsetimes: p?.rinsetimes ?? '0',
      spintime: p?.spintime ?? '0',
      water_level: p?.water_level ?? '1',
      drytime: p?.drytime ?? '0',
    };
  }

  const isFieldLocked = (field: EditableField) =>
    field !== 'drytime' && !!preset?.lockedFields?.includes(field as any);

  const isFieldHidden = (field: EditableField) =>
    field !== 'drytime' && !!preset?.hiddenFields?.includes(field as any);

  const getFieldRange = (field: EditableField): string[] => {
    if (field === 'water_level') return [...(preset?.available_water_level ?? [])];
    if (field === 'drytime') return [...(dpSchema?.drytime?.property?.range ?? [])];
    return [...((dpSchema as any)?.[field]?.property?.range ?? [])];
  };

  const handleSelectTab = (option: string) => {
    setSelectedProgram(option);
  };

  const handleOpenFieldPicker = (field: EditableField) => {
    if (field !== 'drytime' && isFieldLocked(field)) return;
    setActiveFieldPicker(field);
  };

  const handlePickValue = (value: string) => {
    if (!activeFieldPicker) return;
    setDraft(prev => ({ ...prev, [activeFieldPicker]: value }));
    setActiveFieldPicker(null);
  };

  // Rough decorative estimate only — soaktime/washtime/spintime are minutes,
  // rinsetimes is a cycle COUNT not minutes, so it's excluded from the sum
  // and shown separately. Not a claim about actual machine timing.
  const estimatedMinutes = (dpState?.reserve_time_hour ?? 0) * 60 + (dpState?.reserve_time_min ?? 0);
    // Number(draft.soaktime || 0) + Number(draft.washtime || 0) + Number(draft.spintime || 0);
  const estimatedHours = Math.floor(estimatedMinutes / 60);
  const estimatedRemainderMinutes = estimatedMinutes % 60;

  // Decorative droplet indicator — fewer droplets filled at higher water
  // levels (more water used = less "efficient"). Purely cosmetic.
  const waterLevelNum = Number(draft.water_level || 1);
  const filledDroplets = Math.max(1, 5 - Math.ceil(waterLevelNum / 2));

  const handleProceed = () => {
    if (isNavigating.current) return;
    isNavigating.current = true;

    actions.program.set(selectedProgram);

    // Write every field's FINAL value — draft for editable/visible fields,
    // the preset's fixed value for locked/hidden ones (hidden still needs
    // its correct fixed DP value written; it's just not shown in the UI).
    actions.soaktime.set(draft.soaktime);
    actions.washtime.set(draft.washtime);
    actions.rinsetimes.set(draft.rinsetimes);
    actions.spintime.set(draft.spintime);

    if (isAirDry) {
      actions.drytime.set(draft.drytime);
    } else {
      actions.water_level.set(draft.water_level);
    }

    actions.start.set(true);

    navigateTo({ url: '/pages/operation/index' }); // matches the `route` value in routes.config.ts
  };

  const renderFieldRow = (field: EditableField) => {
    if (isFieldHidden(field)) return null;

    const locked = isFieldLocked(field);
    const value = draft[field];

    return (
      <View
        key={field}
        className={locked ? styles.fieldRowLocked : styles.fieldRow}
        onClick={() => handleOpenFieldPicker(field)}
      >
        <Text className={locked ? styles.fieldLabelLocked : styles.fieldLabel}>
          {Strings.getLang(FIELD_LABEL_KEYS[field] as any)}
        </Text>
        <View className={styles.fieldValueRow}>
          <Text className={locked ? styles.fieldValueLocked : styles.fieldValue}>{value}</Text>
          {!locked && <Text className={styles.chevron}>&#8250;</Text>}
        </View>
      </View>
    );
  };

  const pickerRange = activeFieldPicker ? getFieldRange(activeFieldPicker) : [];

  return (
    <View className={styles.view}>
      <Text className={styles.pageTitle}>{Strings.getLang('selectProgram')}</Text>

      {/* Program carousel — horizontally scrollable tabs */}
      <View className={styles.tabScroll}>
        {programRange.map((option: string) => (
          <View
            key={option}
            className={option === selectedProgram ? styles.tabActive : styles.tab}
            onClick={() => handleSelectTab(option)}
          >
            <Text className={styles.tabStar}>&#9733;</Text>
            <Text
              className={option === selectedProgram ? styles.tabTextActive : styles.tabText}
            >
              {getDpLabel('program', option)}
            </Text>
          </View>
        ))}
      </View>

      {/* Field rows for the selected program */}
      <View className={styles.card}>
        {/* Water Level OR Air Dry Time — never both, mirrors Operation page's AIR_DRY handling */}
        {isAirDry
          ? renderFieldRow('drytime')
          : renderFieldRow('water_level')}

        {TIME_FIELD_ORDER.map(field => renderFieldRow(field))}

        {/* Delay End — informational only here; actually set via the Delay
            Time picker on the Operation page footer, not this page. */}
        <View className={styles.fieldRowLocked}>
          <Text className={styles.fieldLabelLocked}>{Strings.getLang('delayEnd')}</Text>
          <Text className={styles.fieldValueLocked}>
            {`${dpState?.reserve_time_hour ?? 0} Hr ${dpState?.reserve_time_min ?? 0} Min`}
          </Text>
        </View>

        {/* Temperature — cosmetic only, no matching DP exists in schema.ts */}
        <View className={styles.fieldRowLocked}>
          <Text className={styles.fieldLabelLocked}>{Strings.getLang('temperature')}</Text>
          <Text className={styles.fieldValueLocked}>0 &deg;C</Text>
        </View>
      </View>

      {/* Program Data — decorative summary, not a precise timing guarantee */}
      <Text className={styles.sectionTitle}>{Strings.getLang('programData')}</Text>

      <View className={styles.dataRow}>
        <Text className={styles.dataLabel}>{Strings.getLang('energyEfficient')}</Text>
        <Text className={styles.dropletRow}>
          {'\u{1F4A7}'.repeat(filledDroplets)}
        </Text>
      </View>

      <View className={styles.dataRow}>
        <Text className={styles.dataLabel}>{Strings.getLang('duration')}</Text>
        <Text className={styles.dataValue}>
          {`${estimatedHours} Hr ${estimatedRemainderMinutes} Min`}
        </Text>
      </View>

      {/* Proceed */}
      <View className={styles.proceedBtn} onClick={handleProceed}>
        <Text className={styles.proceedBtnText}>{Strings.getLang('proceed')}</Text>
      </View>

      {/* Numeric grid picker — shared by every editable field on this page */}
      {activeFieldPicker && (
        <View className={styles.modalOverlay} onClick={() => setActiveFieldPicker(null)}>
          <View className={styles.modalCard} onClick={(e: any) => e.stopPropagation?.()}>
            <Text className={styles.modalTitle}>
              {Strings.getLang(FIELD_LABEL_KEYS[activeFieldPicker] as any)}
            </Text>

            <View className={styles.numberGrid}>
              {pickerRange.map((option: string) => (
                <View
                  key={option}
                  className={
                    option === draft[activeFieldPicker]
                      ? styles.numberCellActive
                      : styles.numberCell
                  }
                  onClick={() => handlePickValue(option)}
                >
                  <Text
                    className={
                      option === draft[activeFieldPicker]
                        ? styles.numberCellTextActive
                        : styles.numberCellText
                    }
                  >
                    {option}
                  </Text>
                </View>
              ))}
            </View>

            <View className={styles.modalCancel} onClick={() => setActiveFieldPicker(null)}>
              <Text className={styles.modalCancelText}>{Strings.getLang('cancel')}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

export default SelectProgram;