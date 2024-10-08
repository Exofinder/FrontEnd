import { PlanetData, StarData } from "@@types/dataTypes";
import Earth from "@components/objects/Earth";
import Exoplanet from "@components/objects/Exoplanet";
import Orbit from "@components/objects/Orbit";
import Star from "@components/objects/Star";
import { useFrustumCheck } from "@hooks/useFrustumCheck";
import { useUpdateRaDec } from "@hooks/useUpdateRaDec";
import { useThree } from "@react-three/fiber";
import { camZoomAtom, diameterAtom } from "@store/jotai";
import { getESMAX } from "@utils/getESMAX";
import { getSNR } from "@utils/getSNR";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { Fragment } from "react/jsx-runtime";
import { PerspectiveCamera } from "three";

interface Props {
  starDatas: StarData[];
  planetDatas: PlanetData[];
}

export default function MainRenderer({ starDatas, planetDatas }: Props) {
  const { camera, scene } = useThree();
  const camZoom = useAtomValue(camZoomAtom);
  const diameter = useAtomValue(diameterAtom);

  useFrustumCheck(camera as PerspectiveCamera, scene);
  useUpdateRaDec(camera as PerspectiveCamera);

  useEffect(() => {
    const perspectiveCamera = camera as PerspectiveCamera;
    perspectiveCamera.zoom = camZoom;
    perspectiveCamera.updateProjectionMatrix();
  }, [camera, camZoom]);

  return (
    <>
      {starDatas.map((starData) => (
        <Star key={`${starData.starName}`} starData={starData} />
      ))}
      {planetDatas.map((planetData) => {
        const snr = getSNR(planetData, diameter);
        const esMax = getESMAX(planetData, diameter);
        if (snr > 5 && esMax > planetData.distance) {
          return (
            <Fragment key={planetData.planetName}>
              <Exoplanet planetData={planetData} snr={snr} esMax={esMax} />
              <Orbit planetData={planetData} color="green" />
            </Fragment>
          );
        } else if (
          getSNR(planetData, diameter + 1) > 5 &&
          getESMAX(planetData, diameter + 1) > planetData.distance
        ) {
          return (
            <Fragment key={planetData.planetName}>
              <Orbit planetData={planetData} color="red" />
            </Fragment>
          );
        }
      })}
      <Earth />
    </>
  );
}
