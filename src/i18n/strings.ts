export default {
  en: {
    // ----- Existing custom UI text -----
    submitText: 'Submit',
    errorTitle: 'Had an accident',
    errorText: 'You can click the button below to provide feedback, and we will handle it.',
    start_guide:
      'Please make sure there are no pets and children in the washing machine before starting',
    WM: 'Washing Machine',
    on: 'ON',
    off: 'OFF',
    childLock: 'Child Lock',
    start: 'Start',
    pause: 'Pause',
    duration: 'Duration',
    waterLevel: 'Water Level',
    delayTime: 'Delay Time (Hour)',

    soak: 'Soak',
    wash: 'Wash',
    rinse: 'Rinse',
    spin: 'Spin',

    tapToUnlock: 'Tap to unlock',

    // ----- Added: program picker modal text (was hardcoded in index.tsx) -----
    selectProgram: 'Select Program',
    selectWaterLevel: 'Select Water Level',
    selectDelayTime: 'Select Delay Hour',
    cancel: 'Cancel',

    // ----- Added: `program` DP values -----
    dp_program_normal: 'NORMAL',
    dp_program_mix_wash: 'MIX WASH',
    dp_program_cotton: 'COTTON',
    dp_program_wool: 'WOOL',
    dp_program_santize: 'SANITIZE',
    dp_program_quick: 'QUICK',
    dp_program_rinse_spin: 'RINSE AND SPIN',
    dp_program_eco_40_60: 'ECO 40_60',
    dp_program_tub_clean: 'TUB CLEAN',
    dp_program_air_dry: 'AIR DRY',

    // ----- Added: `work_state` DP values -----
    dp_work_state_shut_down: 'Shutdown',
    dp_work_state_standby: 'Standby',
    dp_work_state_appointment: 'Appointment',
    dp_work_state_soaking: 'Soaking',
    dp_work_state_washing: 'Washing',
    dp_work_state_rinsing: 'Rinsing',
    dp_work_state_dewatering: 'Dewatering',
    dp_work_state_dry: 'Drying',
    dp_work_state_stop: 'Paused',
    dp_work_state_complete: 'Complete',
    dp_work_state_error: 'Fault',
  },
  zh: {
    // ----- Existing custom UI text (blanks / mistranslations fixed) -----
    submitText: '提交',
    errorTitle: '发生点意外',
    errorText: '您可以点击下方的按钮反馈给我们，我们将第一时间处理',
    start_guide: '开始前请确保洗衣机内没有宠物和儿童',
    WM: '洗衣机',
    on: '开',
    off: '关',
    childLock: '童锁',
    start: '开始',
    pause: '暂停',
    duration: '持续时间',
    waterLevel: '水位',
    delayTime: '延迟时间（小时）',

    soak: '浸泡',
    wash: '洗涤',
    rinse: '漂洗',
    spin: '脱水',

    tapToUnlock: '点击解锁',

    // ----- Added: program picker modal text -----
    selectProgram: '选择程序',
    selectWaterLevel: '选择水位',
    selectDelayTime: '选择延迟小时',
    cancel: '取消',

    // ----- Added: `program` DP values -----
    dp_program_normal: '正常',
    dp_program_mix_wash: '混合洗',
    dp_program_cotton: '棉织物',
    dp_program_wool: '羊毛',
    dp_program_santize: '消毒',
    dp_program_quick: '快速',
    dp_program_rinse_spin: '漂洗和脱水',
    dp_program_eco_40_60: 'ECO 40_60',
    dp_program_tub_clean: '桶清洁',
    dp_program_air_dry: '空气干燥',

    // ----- Added: `work_state` DP values -----
    dp_work_state_shut_down: '关机',
    dp_work_state_standby: '待机',
    dp_work_state_appointment: '预约',
    dp_work_state_soaking: '浸泡',
    dp_work_state_washing: '洗涤',
    dp_work_state_rinsing: '漂洗',
    dp_work_state_dewatering: '脱水',
    dp_work_state_dry: '烘干',
    dp_work_state_stop: '暂停',
    dp_work_state_complete: '完成',
    dp_work_state_error: '故障',
  },
};