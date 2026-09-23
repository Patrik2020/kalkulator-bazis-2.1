"use strict";

const fullSiteViewports = Object.freeze([
  { name: "phone-320-portrait", width: 320, height: 720, mobile: true },
  { name: "phone-360-portrait", width: 360, height: 800, mobile: true },
  { name: "phone-375-portrait", width: 375, height: 812, mobile: true },
  { name: "phone-390-portrait", width: 390, height: 844, mobile: true },
  { name: "phone-430-portrait", width: 430, height: 932, mobile: true },
  { name: "phone-568-landscape", width: 568, height: 320, mobile: true },
  { name: "phone-667-landscape", width: 667, height: 375, mobile: true },
  { name: "phone-844-landscape", width: 844, height: 390, mobile: true },
  { name: "tablet-768-portrait", width: 768, height: 1024, mobile: false },
  { name: "tablet-1024-landscape", width: 1024, height: 768, mobile: false },
  { name: "desktop-1050-breakpoint", width: 1050, height: 900, mobile: false },
  { name: "desktop-1280", width: 1280, height: 960, mobile: false },
  { name: "desktop-1440", width: 1440, height: 1000, mobile: false },
  { name: "desktop-1920", width: 1920, height: 1080, mobile: false },
].map(Object.freeze));

const calculatorSmokeNames = new Set([
  "phone-320-portrait",
  "phone-667-landscape",
  "tablet-768-portrait",
  "desktop-1440",
  "desktop-1920",
]);

const calculatorSmokeViewports = Object.freeze(
  fullSiteViewports.filter((viewport) => calculatorSmokeNames.has(viewport.name))
);

const requiredResponsiveWidths = Object.freeze([
  320,
  360,
  375,
  390,
  430,
  768,
  1024,
  1280,
  1440,
  1920,
]);

module.exports = {
  calculatorSmokeViewports,
  fullSiteViewports,
  requiredResponsiveWidths,
};
