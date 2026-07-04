const $ = id => document.getElementById(id);

const fields = {
  roomLength: $("roomLength"), roomWidth: $("roomWidth"), wallHeight: $("wallHeight"),
  waste: $("wastePercent"), walls: $("calculateWalls"), floor: $("calculateFloor"),
  wallTileWidth: $("wallTileWidth"), wallTileHeight: $("wallTileHeight"),
  subtractDoor: $("subtractDoor"), doorWidth: $("doorWidth"), doorHeight: $("doorHeight"), doorCount: $("doorCount"),
  floorTileWidth: $("floorTileWidth"), floorTileHeight: $("floorTileHeight")
};

const out = {
  grossWall: $("grossWallArea"), door: $("doorAreaResult"), netWall: $("netWallArea"),
  wallBuy: $("wallPurchaseArea"), wallCount: $("wallTileCount"), floorArea: $("floorArea"),
  floorBuy: $("floorPurchaseArea"), floorCount: $("floorTileCount"),
  message: $("validationMessage"), summary: $("summaryText")
};

const number = input => Number.parseFloat(input.value);
const positive = value => Number.isFinite(value) && value > 0;
const format = value => value.toLocaleString("hu-HU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const clear = elements => elements.forEach(element => { element.textContent = "–"; });

function setVisibility() {
  $("wallFields").hidden = !fields.walls.checked;
  $("wallResults").hidden = !fields.walls.checked;
  $("floorFields").hidden = !fields.floor.checked;
  $("floorResults").hidden = !fields.floor.checked;
  $("doorFields").hidden = !fields.walls.checked || !fields.subtractDoor.checked;
}

function calculate() {
  setVisibility();
  out.message.textContent = "";
  const summaries = [];
  const length = number(fields.roomLength);
  const width = number(fields.roomWidth);
  const waste = number(fields.waste);

  if (!fields.walls.checked && !fields.floor.checked) {
    out.message.textContent = "Jelöld be legalább a falak vagy a padló számítását.";
    out.summary.textContent = "Válaszd ki a számítandó felületet.";
    return;
  }

  if (!positive(length) || !positive(width) || !Number.isFinite(waste) || waste < 0) {
    clear([out.grossWall, out.door, out.netWall, out.wallBuy, out.wallCount, out.floorArea, out.floorBuy, out.floorCount]);
    out.summary.textContent = "Add meg a helyiség hosszát és szélességét.";
    return;
  }

  const multiplier = 1 + waste / 100;

  if (fields.walls.checked) {
    const height = number(fields.wallHeight);
    const tileWidth = number(fields.wallTileWidth);
    const tileHeight = number(fields.wallTileHeight);

    if (!positive(height) || !positive(tileWidth) || !positive(tileHeight)) {
      clear([out.grossWall, out.door, out.netWall, out.wallBuy, out.wallCount]);
      summaries.push("A falakhoz add meg a burkolási magasságot és a falicsempe méretét.");
    } else {
      const grossArea = 2 * (length + width) * height;
      let doorArea = 0;
      let doorValid = true;

      if (fields.subtractDoor.checked) {
        const doorWidth = number(fields.doorWidth);
        const doorHeight = number(fields.doorHeight);
        const doorCount = number(fields.doorCount);
        doorValid = positive(doorWidth) && positive(doorHeight) && Number.isInteger(doorCount) && doorCount > 0;
        if (doorValid) doorArea = (doorWidth / 100) * (doorHeight / 100) * doorCount;
      }

      if (!doorValid || doorArea >= grossArea) {
        clear([out.grossWall, out.door, out.netWall, out.wallBuy, out.wallCount]);
        out.message.textContent = !doorValid
          ? "Az ajtó levonásához adj meg érvényes méretet és egész darabszámot."
          : "Az ajtók felülete nem lehet nagyobb a falak teljes felületénél.";
      } else {
        const netArea = grossArea - doorArea;
        const purchaseArea = netArea * multiplier;
        const tileArea = (tileWidth / 100) * (tileHeight / 100);
        const tileCount = Math.ceil(purchaseArea / tileArea);

        out.grossWall.textContent = `${format(grossArea)} m²`;
        out.door.textContent = fields.subtractDoor.checked ? `${format(doorArea)} m²` : "Nincs levonva";
        out.netWall.textContent = `${format(netArea)} m²`;
        out.wallBuy.textContent = `${format(purchaseArea)} m²`;
        out.wallCount.textContent = `${tileCount.toLocaleString("hu-HU")} db`;
        summaries.push(`A négy fal nettó felülete ${format(netArea)} m². ${waste}% ráhagyással ${format(purchaseArea)} m², vagyis körülbelül ${tileCount.toLocaleString("hu-HU")} darab falicsempe szükséges.`);
      }
    }
  }

  if (fields.floor.checked) {
    const tileWidth = number(fields.floorTileWidth);
    const tileHeight = number(fields.floorTileHeight);

    if (!positive(tileWidth) || !positive(tileHeight)) {
      clear([out.floorArea, out.floorBuy, out.floorCount]);
      summaries.push("A padlóhoz add meg a járólap méretét.");
    } else {
      const area = length * width;
      const purchaseArea = area * multiplier;
      const tileArea = (tileWidth / 100) * (tileHeight / 100);
      const tileCount = Math.ceil(purchaseArea / tileArea);

      out.floorArea.textContent = `${format(area)} m²`;
      out.floorBuy.textContent = `${format(purchaseArea)} m²`;
      out.floorCount.textContent = `${tileCount.toLocaleString("hu-HU")} db`;
      summaries.push(`A padló felülete ${format(area)} m². ${waste}% ráhagyással ${format(purchaseArea)} m², vagyis körülbelül ${tileCount.toLocaleString("hu-HU")} darab járólap szükséges.`);
    }
  }

  out.summary.innerHTML = summaries.length
    ? `<strong>Burkolási összesítő</strong><br><br>${summaries.join("<br><br>")}`
    : "Add meg a hiányzó adatokat a számításhoz.";
}

Object.values(fields).forEach(field => {
  field?.addEventListener("input", calculate);
  field?.addEventListener("change", calculate);
});

calculate();
