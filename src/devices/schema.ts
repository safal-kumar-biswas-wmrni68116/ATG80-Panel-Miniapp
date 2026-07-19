export const defaultSchema = [
  {
    attr: 1664,
    canTrigger: true,
    code: "switch",
    defaultRecommend: true,
    editPermission: true,
    executable: true,
    extContent: "",
    iconname: "icon-dp_power2",
    id: 1,
    mode: "rw",
    name: "开关",
    property: {
      type: "bool"
    },
    type: "obj"
  },
  {
    attr: 1152,
    canTrigger: true,
    code: "start",
    defaultRecommend: false,
    editPermission: true,
    executable: true,
    extContent: "",
    iconname: "icon-dp_play",
    id: 2,
    mode: "rw",
    name: "启动/暂停",
    property: {
      type: "bool"
    },
    type: "obj"
  },
  {
    attr: 1152,
    canTrigger: true,
    code: "program",
    defaultRecommend: false,
    editPermission: true,
    executable: true,
    extContent: "",
    iconname: "icon-setting",
    id: 3,
    mode: "rw",
    name: "程序",
    property: {
      range: [
        "NORMAL",
        "MIX_WASH",
        "COTTON",
        "WOOL",
        "SANTIZE",
        "QUICK",
        "RINSE_SPIN",
        "ECO_40_60",
        "TUB_CLEAN",
        "AIR_DRY"
      ],
      type: "enum"
    },
    type: "obj"
  },
  {
    attr: 1152,
    canTrigger: true,
    code: "child_lock",
    defaultRecommend: false,
    editPermission: true,
    executable: true,
    extContent: "",
    iconname: "icon-dp_power2",
    id: 11,
    mode: "rw",
    name: "childlock",
    property: {
      type: "bool"
    },
    type: "obj"
  },
  {
    attr: 1152,
    canTrigger: true,
    code: "work_state",
    defaultRecommend: false,
    editPermission: true,
    executable: true,
    extContent: "",
    iconname: "icon-zhuangtai",
    id: 12,
    mode: "ro",
    name: "工作状态",
    property: {
      range: [
        "shut_down",
        "standby",
        "appointment",
        "soaking",
        "washing",
        "rinsing",
        "dewatering",
        "dry",
        "stop",
        "complete",
        "error"
      ],
      type: "enum"
    },
    type: "obj"
  },
  {
    attr: 1152,
    canTrigger: true,
    code: "water_level",
    defaultRecommend: false,
    editPermission: true,
    executable: true,
    extContent: "",
    iconname: "icon-dp_water",
    id: 13,
    mode: "rw",
    name: "档位",
    property: {
      range: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10"
      ],
      type: "enum"
    },
    type: "obj"
  },
  {
    attr: 0,
    canTrigger: true,
    code: "soaktime",
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: "",
    id: 101,
    mode: "rw",
    name: "浸泡",
    property: {
      range: [
        "0",
        "5",
        "10",
        "15",
        "20",
        "25"
      ],
      type: "enum"
    },
    type: "obj"
  },
  {
    attr: 0,
    canTrigger: true,
    code: "washtime",
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: "",
    id: 102,
    mode: "rw",
    name: "洗涤",
    property: {
      range: [
        "0",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20"
      ],
      type: "enum"
    },
    type: "obj"
  },
  {
    attr: 0,
    canTrigger: true,
    code: "rinsetimes",
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: "",
    id: 103,
    mode: "rw",
    name: "小时",
    property: {
      range: [
        "0",
        "1",
        "2",
        "3",
        "4"
      ],
      type: "enum"
    },
    type: "obj"
  },
  {
    attr: 0,
    canTrigger: true,
    code: "spintime",
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: "",
    id: 104,
    mode: "rw",
    name: "脱水",
    property: {
      range: [
        "0",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10"
      ],
      type: "enum"
    },
    type: "obj"
  },
  {
    attr: 0,
    canTrigger: true,
    code: "drytime",
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: "",
    id: 105,
    mode: "rw",
    name: "风干",
    property: {
      range: [
        "0",
        "10",
        "20",
        "30",
        "60",
        "90"
      ],
      type: "enum"
    },
    type: "obj"
  },
  {
    attr: 0,
    canTrigger: true,
    code: "reserve_time_hour",
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: "",
    id: 106,
    mode: "rw",
    name: "预约时长(小时)",
    property: {
      range: [
        "0",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18"
      ],
      type: "enum"
    },
    type: "obj"
  },
  {
    attr: 0,
    canTrigger: true,
    code: "reserve_time_min",
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: "",
    id: 107,
    mode: "rw",
    name: "Reserve Time (min)",
    property: {
      unit: "分钟",
      min: 0,
      max: 59,
      scale: 0,
      step: 1,
      type: "value"
    },
    type: "obj"
  },
  {
    attr: 0,
    canTrigger: true,
    code: "remain_time",
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: "",
    id: 108,
    mode: "ro",
    name: "Remain Time",
    property: {
      unit: "分钟",
      min: 0,
      max: 65535,
      scale: 0,
      step: 1,
      type: "value"
    },
    type: "obj"
  },
  {
    attr: 0,
    canTrigger: true,
    code: "error_report",
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: "",
    id: 109,
    mode: "ro",
    name: "故障上报",
    property: {
      range: [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9"
      ],
      type: "enum"
    },
    type: "obj"
  },
  {
    attr: 0,
    canTrigger: true,
    code: "complete_cycle",
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: "",
    id: 110,
    mode: "ro",
    name: "洗衣次数",
    property: {
      unit: "次数",
      min: 0,
      max: 65535,
      scale: 0,
      step: 1,
      type: "value"
    },
    type: "obj"
  },
  {
    attr: 0,
    canTrigger: true,
    code: "door_status",
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: "",
    id: 111,
    mode: "ro",
    name: "门盖状态",
    property: {
      type: "bool"
    },
    type: "obj"
  },
  {
    attr: 0,
    canTrigger: true,
    code: "Cloth_Weight",
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: "",
    id: 113,
    mode: "ro",
    name: "Cloth Weight布重量",
    property: {
      unit: "kg",
      min: 0,
      max: 255,
      scale: 1,
      step: 1,
      type: "value"
    },
    type: "obj"
  },
  {
    attr: 0,
    canTrigger: true,
    code: "Energy_Consumption",
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: "",
    id: 114,
    mode: "ro",
    name: "EnergyCon本次洗衣耗电量",
    property: {
      unit: "wH",
      min: 0,
      max: 65535,
      scale: 2,
      step: 1,
      type: "value"
    },
    type: "obj"
  },
  {
    attr: 0,
    canTrigger: true,
    code: "Water_Consumption",
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: "",
    id: 115,
    mode: "ro",
    name: "Water Con本次洗衣耗水量",
    property: {
      unit: "L",
      min: 0,
      max: 65535,
      scale: 0,
      step: 1,
      type: "value"
    },
    type: "obj"
  },
  {
    attr: 0,
    canTrigger: true,
    code: "Filter_clean_cycle",
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: "",
    id: 116,
    mode: "rw",
    name: "Filter Clean滤网清洗提醒",
    property: {
      unit: "次数",
      min: 0,
      max: 65535,
      scale: 0,
      step: 1,
      type: "value"
    },
    type: "obj"
  },
  {
    attr: 0,
    canTrigger: true,
    code: "Tub_clean_cycle",
    defaultRecommend: false,
    editPermission: false,
    executable: true,
    extContent: "",
    id: 117,
    mode: "ro",
    name: "Tub Clean洁桶清洗提醒",
    property: {
      unit: "次数",
      min: 0,
      max: 65535,
      scale: 0,
      step: 1,
      type: "value"
    },
    type: "obj"
  }
] as const;