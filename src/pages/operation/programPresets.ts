// Preset settings applied automatically when a program is selected.
// Keys MUST match `program`'s DP enum values exactly (schema.ts).
//
// All numeric fields are stored as strings because every underlying DP
// (soaktime, washtime, rinsetimes, spintime, water_level) is an `enum`
// type in schema.ts, not a `value` type — DP writes need string values
// matching one of that DP's allowed `range` entries exactly.
//
// available_water_level restricts which levels the water-level picker
// shows FOR THIS PROGRAM ONLY. water_level is the default/preset level
// applied the moment the program is selected — it's always included in
// available_water_level so the picker's initial selection is valid.

export interface ProgramPreset {
  soaktime: string; // valid values: "0" | "5" | "10" | "15" | "20" | "25"
  washtime: string; // valid values: "0" | "4"–"20"
  rinsetimes: string; // valid values: "0" | "1" | "2" | "3" | "4"
  spintime: string; // valid values: "0" | "5"–"10"
  water_level: string; // default level for this program, "1"–"10"
  available_water_level: string[]; // subset of "1"–"10" allowed for this program
}

export const PROGRAM_PRESETS: Record<string, ProgramPreset> = {
  NORMAL: {
    soaktime: '10',
    washtime: '15',
    rinsetimes: '2',
    spintime: '9',
    water_level: '5',
    available_water_level: ['1', '2', '3', '4', '5', '6', '7', '8'],
  },
  MIX_WASH: {
    soaktime: '5',
    washtime: '10',
    rinsetimes: '2',
    spintime: '7',
    water_level: '5',
    available_water_level: ['1', '2', '3', '4', '5', '6'],
  },
  COTTON: {
    soaktime: '15',
    washtime: '20',
    rinsetimes: '3',
    spintime: '10',
    water_level: '8',
    available_water_level: ['3', '4', '5', '6', '7', '8', '9', '10'],
  },
  WOOL: {
    soaktime: '10',
    washtime: '10',
    rinsetimes: '1',
    spintime: '5',
    water_level: '4',
    available_water_level: ['1', '2', '3', '4', '5'],
  },
  SANTIZE: {
    soaktime: '20',
    washtime: '18',
    rinsetimes: '3',
    spintime: '9',
    water_level: '7',
    available_water_level: ['5', '6', '7', '8', '9', '10'],
  },
  QUICK: {
    soaktime: '0',
    washtime: '4',
    rinsetimes: '1',
    spintime: '6',
    water_level: '3',
    available_water_level: ['1', '2', '3', '4'],
  },
  RINSE_SPIN: {
    soaktime: '0',
    washtime: '0',
    rinsetimes: '2',
    spintime: '10',
    water_level: '5',
    available_water_level: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  },
  ECO_40_60: {
    soaktime: '5',
    washtime: '12',
    rinsetimes: '2',
    spintime: '8',
    water_level: '6',
    available_water_level: ['3', '4', '5', '6', '7'],
  },
  TUB_CLEAN: {
    soaktime: '25',
    washtime: '20',
    rinsetimes: '4',
    spintime: '10',
    water_level: '10',
    available_water_level: ['8', '9', '10'],
  },
  AIR_DRY: {
    soaktime: '0',
    washtime: '0',
    rinsetimes: '0',
    spintime: '0',
    water_level: '1',
    available_water_level: [''],
  },
};
