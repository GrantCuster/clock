import { atom } from "jotai";

export type LabelType =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | ":"
  | "AM"
  | "PM";

export const showChooserAtom = atom(false);
export const showEditorAtom = atom(false);
export const selectedDigitAtom = atom<LabelType>("0");
export const cameraStreamAtom = atom<MediaStream | null>(null);

export const cameraModeOnAtom = atom(false);

export const editModeOnAtom = atom(false);

export const cameraCameraAtom = atom({ x: 0, y: 0, z: 1 });
export const cameraCanvasContainerAtom = atom<HTMLDivElement | null>(null);
export const cameraVideoElementAtom = atom<HTMLVideoElement | null>(null);

export const activeCanvasAtom = atom<HTMLCanvasElement | null>(null);

export const submittedAtom = atom(false);
export const submittedCanvasAtom = atom<HTMLCanvasElement | null>(null);

export const customDigitsAtom = atom<Record<LabelType, string | null>>({
  "0": null,
  "1": null,
  "2": null,
  "3": null,
  "4": null,
  "5": null,
  "6": null,
  "7": null,
  "8": null,
  "9": null,
  ":": null,
  AM: null,
  PM: null,
});
