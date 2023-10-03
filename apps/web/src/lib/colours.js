import {
  inRange,
  parseInt,
  words
} from 'lodash-es';

export const GRAY = 'rgba(244, 244, 244, 1)';

export const levelColours = {
  alpha: 'rgba(230, 25, 75, 1)',
  beta: 'rgba(0, 130, 200, 1)',
  stable: 'rgba(60, 180, 75, 1)',
  unused: 'rgba(244, 244, 244, 1)'
};


export const categoryColours = {
  admissionregistration: 'rgba(183, 28, 28, 1)',
  apiextensions: 'rgba(49, 27, 146, 1)',
  apiregistration: 'rgba(1, 87, 155, 1)',
  apis: 'rgba(27, 94, 32, 1)',
  apps: 'rgba(245, 127, 23, 1)',
  authentication: 'rgba(191, 54, 12, 1)',
  authorization: 'rgba(156, 39, 176, 1)',
  autoscaling: 'rgba(33, 150, 243, 1)',
  batch: 'rgba(0, 150, 136, 1)',
  telemetryIstioIo: 'rgba(0, 150, 136, 1)',
  certificates: 'rgba(205, 220, 57, 1)',
  core: 'rgba(255, 152, 0, 1)',
  securityIstioIo: 'rgba(255, 152, 0, 1)',
  discovery: 'rgba(136, 14, 79, 1)',
  events: 'rgba(136, 14, 79, 1)',
  extensions: 'rgba(26, 35, 126, 1)',
  extensionsIstioIo: 'rgba(255, 215, 0, 1)',
  logs: 'rgba(0, 96, 100, 1)',
  installIstioIo: 'rgba(0, 96, 100, 1)',
  networking: 'rgba(51, 105, 30, 1)',
  networkingIstioIo: 'rgba(51, 105, 30, 1)',
  node: 'rgba(53, 105, 30, 1)',
  policy: 'rgba(255, 111, 0, 1)',
  rbacAuthorization: 'rgba(244, 67, 54, 1)',
  scheduling: 'rgba(103, 58, 183, 1)',
  settings: 'rgba(3, 169, 244, 1)',
  storage: 'rgba(255, 215, 0, 1)',
  storageIstioIo: 'rgba(255, 215, 0, 1)',
  version: 'rgba(255, 235, 59, 1)',
  auditregistration: 'rgba(255, 87, 34, 1)',
  coordination: 'rgba(74, 20, 140, 1)'
};

export function endpointColour (endpoint) {
  let endpointColour = categoryColours[endpoint.category] || 'rgba(53,105,35,1)';
  if (!endpoint.tested) {
    return GRAY;
  } else if (!endpoint.conf_tested) {
    return fadeColour(endpointColour, 0.75);
  } else {
    return endpointColour;
  }
};

export function fadeColour (colour, desiredOpacity) {
  let rgbaPattern = /rgba\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3},(1|0\.[0-9])\)/g;
  let rgbaIsValid = rgbaPattern.test(colour.replace(/\s+/g, ''));
  let opacityIsValid = inRange(parseInt(desiredOpacity), 0, 1.1);
  if (!rgbaIsValid) {
    console.log('color given to fadeColour does not match rgba pattern: ', colour);
    return `rgba(244,244,244,1)`;
  } else if (!opacityIsValid) {
    console.log('opacity is not valid: ', desiredOpacity);
    return `rgba(244,244,244,1)`;
  } else {
    let rgba = words(colour);
    let c = {
      red: rgba[1],
      green: rgba[2],
      blue: rgba[3]
    };
    return `rgba(${c.red}, ${c.green}, ${c.blue}, ${desiredOpacity})`;
  };
};

export const conformanceColours = {
  promotedWithTests: "hsl(177, 70.6%, 54.7%)",
  oldCoveredByNew: "hsl(341, 100.0%, 50.0%)",
  tested: "hsl(207, 83.8%, 21.8%)",
  promotedWithoutTests: "hsl(27, 100.0%, 50.0%)",
  untested: "hsl(205, 14.1%, 69.4%)"
};
