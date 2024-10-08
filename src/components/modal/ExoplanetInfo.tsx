import { PlanetData } from "@@types/dataTypes";
import { getPlanetHabitable } from "@apis/getPlanetHabitable";
import QuestionComp from "@components/tooltip/QuestionComp";
import {
  EXOPLANET_INFO_TOOLTIP,
  PREV_NEXT_BTN_TOOLTIP,
} from "@constants/tooltip";
import {
  diameterAtom,
  habitableDataAtom,
  selectedExoplanetNameAtom,
  zoomPlanetNamesAtom,
} from "@store/jotai";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import { ImEarth } from "react-icons/im";
import { PiApproximateEqualsBold } from "react-icons/pi";

interface Props {
  planetDatas: PlanetData[];
}

export default function ExoplanetInfo({ planetDatas }: Props) {
  const zoomPlanetNames = useAtomValue(zoomPlanetNamesAtom);
  const [selectedExoplanetName, setSelectedExoplanetName] = useAtom(
    selectedExoplanetNameAtom
  );
  const diameter = useAtomValue(diameterAtom);
  const [habitableData, setHabitableData] = useAtom(habitableDataAtom);
  const [idx, setIdx] = useState<number>(0);
  const [detailExoplanetInfo, setDetailExoplanetInfo] = useState<string>("");

  const handleNextBtn = () => {
    if (!zoomPlanetNames) return;
    if (idx + 1 < zoomPlanetNames.length) {
      setIdx((prev) => prev + 1);
    }
  };

  const handlePrevBtn = () => {
    if (!zoomPlanetNames) return;
    if (idx - 1 >= 0) {
      setIdx((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (habitableData) {
      if (parseFloat(habitableData[idx].habitablePercent) > 0) {
        setDetailExoplanetInfo(
          `The semi-major axis of the planet ${habitableData[idx].plName} is ${
            habitableData[idx].plOrbsmax
          } AU, which exists within the Goldilocks zone range f [${
            habitableData[idx].innerBoundHabitableZone
          } AU to ${
            habitableData[idx].outerBoundHabitableZone
          } AU] of the host star. Finally, the probability of habitable planet based on the planet eccentricity and density is ${(
            parseFloat(habitableData[idx].habitablePercent) * 100
          ).toFixed(2)}%.`
        );
      } else if (habitableData[idx].habitablePercent === "0") {
        setDetailExoplanetInfo(
          `The semi-major axis of the planet ${habitableData[idx].plName} is ${habitableData[idx].plOrbsmax} AU, which does not belong within the Goldilocks zone range f [${habitableData[idx].innerBoundHabitableZone} AU to ${habitableData[idx].outerBoundHabitableZone} AU] of the host star. As a result, the probability of habitable planet is extremely small.`
        );
      } else if (habitableData[idx].habitablePercent === "-1") {
        setDetailExoplanetInfo(
          `${habitableData[idx].plName} planet does not have the essential parameters to calculate the probability of a habitable zone. Try your hand at indirect probability estimation`
        );
      }
    } else {
      setDetailExoplanetInfo("");
    }
  }, [habitableData, idx]);

  useEffect(() => {
    const fetchData = async () => {
      if (zoomPlanetNames) {
        const data = await getPlanetHabitable(
          planetDatas.find(
            (planetData) => planetData.planetName === zoomPlanetNames[0]
          )?.hostName,
          diameter
        );
        if (data) {
          setHabitableData(data);
        }
      }
    };
    if (zoomPlanetNames) {
      fetchData();
    }
  }, [diameter, planetDatas, setHabitableData, zoomPlanetNames]);

  useEffect(() => {
    if (zoomPlanetNames) {
      setSelectedExoplanetName(zoomPlanetNames[idx]);
    } else {
      setIdx(0);
    }
  }, [idx, zoomPlanetNames, setSelectedExoplanetName]);

  if (!zoomPlanetNames) return null;

  return (
    <div className="fixed w-96 top-5 left-5 bg-slate-400 rounded-xl z-50">
      <div className="flex flex-row items-center m-2">
        <GrCaretPrevious
          className={`w-8 h-8 m-1 border border-black p-1 ${
            idx === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={idx === 0 ? () => {} : handlePrevBtn}
        />
        <GrCaretNext
          className={`w-8 h-8 m-1 border border-black p-1 mr-3 ${
            idx === zoomPlanetNames.length - 1
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
          onClick={
            idx === zoomPlanetNames.length - 1 ? () => {} : handleNextBtn
          }
        />
        <QuestionComp text={PREV_NEXT_BTN_TOOLTIP} />
      </div>
      <div className="m-3">
        <p className="py-1">Planet Name: {selectedExoplanetName}</p>
        <p className="py-1">
          Host Name:{" "}
          {
            planetDatas.find(
              (planetData) => planetData.planetName === selectedExoplanetName
            )?.hostName
          }
        </p>
        <p className="py-1">Location:</p>
        <div className="ml-6">
          <p className="py-1">
            Right Ascension (RA):{" "}
            {
              planetDatas.find(
                (planetData) => planetData.planetName === selectedExoplanetName
              )?.ra
            }
          </p>
          <p className="py-1">
            Declination (DEC):{" "}
            {
              planetDatas.find(
                (planetData) => planetData.planetName === selectedExoplanetName
              )?.dec
            }
          </p>
          <p className="py-1">
            Distance:{" "}
            {
              planetDatas.find(
                (planetData) => planetData.planetName === selectedExoplanetName
              )?.distance
            }
          </p>
        </div>
        <p className="py-1 underline underline-offset-4">
          The name of this planet is {selectedExoplanetName}, and it orbits
          around{" "}
          {
            planetDatas.find(
              (planetData) => planetData.planetName === selectedExoplanetName
            )?.hostName
          }
          . It was discovered in{" "}
          {
            planetDatas.find(
              (planetData) => planetData.planetName === selectedExoplanetName
            )?.discYear
          }{" "}
          by{" "}
          {
            planetDatas.find(
              (planetData) => planetData.planetName === selectedExoplanetName
            )?.discFacility
          }{" "}
          using the{" "}
          {
            planetDatas.find(
              (planetData) => planetData.planetName === selectedExoplanetName
            )?.discoveryMethod
          }
          . This planet is{" "}
          {
            planetDatas.find(
              (planetData) => planetData.planetName === selectedExoplanetName
            )?.distance
          }{" "}
          pc away from the HWO telescope.
        </p>

        <div className="flex items-center mt-8">
          <PiApproximateEqualsBold className="w-6 h-6" />
          <ImEarth className="w-8 h-8 ml-1" />
          <p className="text-xl font-bold ml-2">
            :{" "}
            {habitableData?.find((data) => data.plName === zoomPlanetNames[idx])
              ?.habitablePercent !== undefined &&
            habitableData.find((data) => data.plName === zoomPlanetNames[idx])
              ?.habitablePercent !== "-1"
              ? (
                  parseFloat(
                    habitableData.find(
                      (data) => data.plName === zoomPlanetNames[idx]
                    )?.habitablePercent || "0"
                  ) * 100
                ).toFixed(2) + "%"
              : "???"}{" "}
            <QuestionComp text={EXOPLANET_INFO_TOOLTIP} />
          </p>
        </div>
        <p className="mt-3 py-1 underline underline-offset-4">
          {detailExoplanetInfo}
        </p>
      </div>
    </div>
  );
}
