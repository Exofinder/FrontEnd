import { atom } from "jotai";

export const camZoomAtom = atom<number>(1);

export const diameterAtom = atom<number>(6);

export const visibleExoplanetAtom = atom<string[]>([]);
export const visibleStarCountAtom = atom<number>(0);

export const hwoRaDecAtom = atom<{ ra: number; dec: number }>({
  ra: 0,
  dec: 0,
});

export const hoverExoplanetNameAtom = atom<string>("");
export const clickExoplanetNameAtom = atom<string>("");
export const zoomPlanetNamesAtom = atom<string[] | null>(null);
export const selectedExoplanetNameAtom = atom<string>("");

export const isCoronaOnAtom = atom<boolean>(false);
export const ableCoronaOnAtom = atom<boolean>(false);

export const habitableDataAtom = atom<
  | {
      planet: string;
      habitablePercent: string | number;
    }[]
  | null
>(null);

export const observationDateAtom = atom<"Mar" | "Sep">("Mar");
