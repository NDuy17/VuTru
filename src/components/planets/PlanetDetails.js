import React from 'react';
import SunDetails from './SunDetails';
import MercuryDetails from './MercuryDetails';
import VenusDetails from './VenusDetails';
import EarthDetails from './EarthDetails';
import MarsDetails from './MarsDetails';
import JupiterDetails from './JupiterDetails';
import SaturnDetails from './SaturnDetails';
import UranusDetails from './UranusDetails';
import NeptuneDetails from './NeptuneDetails';

const detailMap = {
  0: SunDetails,
  1: MercuryDetails,
  2: VenusDetails,
  3: EarthDetails,
  4: MarsDetails,
  5: JupiterDetails,
  6: SaturnDetails,
  7: UranusDetails,
  8: NeptuneDetails,
};

const PlanetDetails = ({ planet, onClose }) => {
  const SpecificDetails = detailMap[planet.id];
  return SpecificDetails ? <SpecificDetails planet={planet} onClose={onClose} /> : null;
};

export default PlanetDetails;
