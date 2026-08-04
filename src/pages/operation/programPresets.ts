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
//
// lockedFields: rendered on the SelectProgram page but disabled/greyed —
//   the field is conceptually part of this program, its value is fixed,
//   and the user can SEE it but can't change it. Matches the "Wash 9
//   Minutes" greyed row in the Cotton reference screenshot.
// hiddenFields: not rendered at all — the stage isn't part of this
//   program's cycle. Matches Tub Clean's screenshot, where Soak/Wash/
//   Rinse/Spin don't appear as rows at all, only Water Level/Delay/Temp.
//
// This is a judgment call translating your original code-comment markers
// ("this can't be changed by user") into something the UI can actually
// read — re-categorize any of these if the hide-vs-disable split doesn't
// match what you intended for a given program.

export interface ProgramPreset {
  soaktime: string; // valid values: "0" | "5" | "10" | "15" | "20" | "25"
  washtime: string; // valid values: "0" | "4"–"20"
  rinsetimes: string; // valid values: "0" | "1" | "2" | "3" | "4"
  spintime: string; // valid values: "0" | "5"–"10"
  water_level: string; // default level for this program, "1"–"10"
  available_water_level: string[]; // subset of "1"–"10" allowed for this program
  drytime?: string; // only meaningful for AIR_DRY — default dry duration
  lockedFields?: Array<'soaktime' | 'washtime' | 'rinsetimes' | 'spintime' | 'water_level'>;
  hiddenFields?: Array<'soaktime' | 'washtime' | 'rinsetimes' | 'spintime' | 'water_level'>;
}

export const PROGRAM_PRESETS: Record<string, ProgramPreset> = {
  NORMAL: {
    soaktime: '0',
    washtime: '11',
    rinsetimes: '2',
    spintime: '7',
    water_level: '8',
    available_water_level: ['1', '2', '3', '4', '5', '6', '7', '8'],
    lockedFields: ['soaktime'],
  },
  MIX_WASH: {
    soaktime: '0',
    washtime: '11',
    rinsetimes: '2',
    spintime: '7',
    water_level: '8',
    available_water_level: ['1', '2', '3', '4', '5', '6', '7', '8'],
    lockedFields: ['soaktime'],
  },
  COTTON: {
    soaktime: '0',
    washtime: '9',
    rinsetimes: '2',
    spintime: '7',
    water_level: '8',
    available_water_level: ['3', '4', '5', '6', '7', '8', '9', '10'],
    lockedFields: ['washtime'],
  },
  WOOL: {
    soaktime: '0',
    washtime: '5',
    rinsetimes: '2',
    spintime: '7',
    water_level: '8',
    available_water_level: ['1', '2', '3', '4', '5', '6', '7', '8'],
    // no locked/hidden fields — fully editable
  },
  SANTIZE: {
    soaktime: '0',
    washtime: '11',
    rinsetimes: '2',
    spintime: '7',
    water_level: '8',
    available_water_level: ['5', '6', '7', '8', '9', '10'],
    lockedFields: ['soaktime'],
  },
  QUICK: {
    soaktime: '0',
    washtime: '5',
    rinsetimes: '1',
    spintime: '5',
    water_level: '4',
    available_water_level: ['1', '2', '3', '4'],
    // no locked/hidden fields — fully editable
  },
  RINSE_SPIN: {
    soaktime: '0',
    washtime: '0',
    rinsetimes: '2',
    spintime: '7',
    water_level: '8',
    available_water_level: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    lockedFields: ['soaktime', 'washtime'],
  },
  ECO_40_60: {
    soaktime: '0',
    washtime: '14',
    rinsetimes: '2',
    spintime: '7',
    water_level: '8',
    available_water_level: ['3', '4', '5', '6', '7'],
    // no locked/hidden fields — fully editable
  },
  TUB_CLEAN: {
    soaktime: '0',
    washtime: '0',
    rinsetimes: '0',
    spintime: '0',
    water_level: '4',
    available_water_level: ['8', '9', '10'],
    // Tub Clean isn't washing clothes — soak/wash/rinse/spin don't apply
    // as concepts, so they're hidden entirely rather than shown-and-locked.
    hiddenFields: ['soaktime', 'washtime', 'rinsetimes', 'spintime'],
  },
  AIR_DRY: {
    soaktime: '0',
    washtime: '0',
    rinsetimes: '0',
    spintime: '0',
    water_level: '1',
    available_water_level: [],
    drytime: '30',
    // Air Dry doesn't wash or use water at all — every wash-cycle field is
    // hidden. The page renders a Dry Time row (driven by the `drytime` DP)
    // in place of the water-level row for this program specifically,
    // mirroring the same AIR_DRY special-case already on the Operation page.
    hiddenFields: ['soaktime', 'washtime', 'rinsetimes', 'spintime', 'water_level'],
  },
};