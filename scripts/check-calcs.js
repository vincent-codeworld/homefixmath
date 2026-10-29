/* Node check for calculator presets, rounding, and shopping-list shape. */
var calcs = require("../site/js/calcs.js");

var failed = 0;
function assert(cond, msg) {
  if (!cond) {
    failed += 1;
    console.error("FAIL: " + msg);
  }
}

function scene(list, id) {
  return calcs.byId(list, id);
}

function blob(result) {
  return JSON.stringify(result);
}

function noStoreUrls(result, label) {
  var text = blob(result);
  assert(!/https?:\/\//i.test(text), label + " has no URL");
  assert(!/homedepot|lowes\.com|amazon\.com|awin|shareasale|impact\.com/i.test(text), label + " has no store or network URL");
}

var backyard = scene(calcs.fenceScenes, "backyard");
var fenceBack = calcs.fenceFromScene(backyard);
assert(fenceBack.ok, "backyard fence ok");
assert(fenceBack.layoutPanels === 12, "backyard layout panels 12, got " + fenceBack.layoutPanels);
assert(fenceBack.buyPanels === 14, "backyard buy panels 14, got " + fenceBack.buyPanels);
assert(fenceBack.posts === 15 && fenceBack.caps === 15, "backyard posts and caps 15");
assert(fenceBack.needsTrim === false, "backyard does not trim");
assert(fenceBack.groups.map(function (g) { return g.name; }).join(",") === "Lumber,Hardware", "fence groups");
assert(/wood privacy panels/.test(fenceBack.groups[0].items[0]), "panel line is plural");
assert(/gate kit/.test(fenceBack.groups[1].items[0]), "gate is on the hardware list");
noStoreUrls(fenceBack, "fence");

var side = calcs.fenceFromScene(scene(calcs.fenceScenes, "sideyard"));
assert(side.ok && side.layoutPanels === 10 && side.buyPanels === 11 && side.posts === 11, "side yard 60 ft vinyl: layout 10, buy 11, posts 11");
assert(!/gate kit/.test(blob(side.groups)), "side yard has no gate kit");

var garden = calcs.fenceFromScene(scene(calcs.fenceScenes, "garden"));
assert(garden.ok && garden.netFt === 21 && garden.layoutPanels === 6 && garden.needsTrim === true, "garden 24 ft with 3 ft gate trims");
assert(garden.posts === 6 + 1 + 2, "garden posts");

var trimRun = calcs.fence({
  totalLengthFt: 100.5,
  panelWidthFt: 8,
  panelHeightFt: 6,
  gateCount: 0,
  gateWidthFt: 4,
  extraPosts: 0,
  includeCaps: true,
  wastePct: 10,
  materialName: "fence panel"
});
assert(trimRun.ok && trimRun.layoutPanels === 13 && trimRun.needsTrim && trimRun.buyPanels === 15 && trimRun.posts === 14, "100.5 ft trim + waste posts ignore spares");
assert(/Last bay may need a trim/.test(trimRun.callout), "trim callout");

var gatesOnly = calcs.fence({
  totalLengthFt: 4,
  panelWidthFt: 8,
  panelHeightFt: 6,
  gateCount: 1,
  gateWidthFt: 4,
  extraPosts: 0,
  includeCaps: false,
  wastePct: 10,
  materialName: "fence panel"
});
assert(gatesOnly.ok && gatesOnly.layoutPanels === 0 && gatesOnly.buyPanels === 0 && gatesOnly.posts === 2 && gatesOnly.caps === 0, "gate-only run");

var tooWide = calcs.fence({
  totalLengthFt: 10,
  panelWidthFt: 8,
  panelHeightFt: 6,
  gateCount: 2,
  gateWidthFt: 6,
  extraPosts: 0,
  includeCaps: true,
  wastePct: 0,
  materialName: "fence panel"
});
assert(!tooWide.ok && /exceeds/.test(tooWide.error), "gates wider than the run");

var noWaste = calcs.fence({
  totalLengthFt: 100,
  panelWidthFt: 8,
  panelHeightFt: 6,
  gateCount: 1,
  gateWidthFt: 4,
  extraPosts: 2,
  includeCaps: true,
  wastePct: 0,
  materialName: "wood privacy panel"
});
assert(noWaste.ok && noWaste.buyPanels === 12 && noWaste.posts === 17, "0% waste keeps 12 panels; extras add posts");

var room = calcs.paintFromScene(scene(calcs.paintScenes, "example"));
assert(room.ok, "paint example ok");
assert(Math.round(room.wallsSqft) === 312, "paint walls 312, got " + room.wallsSqft);
assert(room.gallons === 2, "paint example 2 gallons, got " + room.gallons);
assert(room.groups[0].name === "Coatings" && room.groups[1].name === "Supplies", "paint groups");
assert(/2 gallons of standard interior latex/.test(room.groups[0].items[0]), "paint list says gallons of paint");
assert(/not added/.test(room.groups[0].items[1]), "primer is visible when off");
noStoreUrls(room, "paint");

var bedroom = calcs.paintFromScene(scene(calcs.paintScenes, "bedroom"));
assert(bedroom.ok && bedroom.gallons === 3, "bedroom two coats buys 3 gallons, got " + bedroom.gallons);

var living = calcs.paintFromScene(scene(calcs.paintScenes, "living"));
assert(living.ok && living.ceilingSqft === 320 && living.gallons === 6, "living room + ceiling buys 6, got " + living.gallons);

var openings = calcs.paint({
  lengthFt: 10, widthFt: 10, heightFt: 8,
  doors: 20, windows: 0, doorArea: 80, windowArea: 15,
  coats: 2, wastePct: 10, coverage: 350,
  includeCeiling: false, includePrimer: false
});
assert(!openings.ok && /Openings/.test(openings.error), "openings cannot exceed walls");

var withPrimer = calcs.paint({
  lengthFt: 12, widthFt: 12, heightFt: 8,
  doors: 2, windows: 2, doorArea: 21, windowArea: 15,
  coats: 2, wastePct: 10, coverage: 350, finishName: "standard interior latex",
  includeCeiling: false, includePrimer: true, primerCoverage: 300, primerName: "drywall primer"
});
assert(withPrimer.ok && withPrimer.primerGallons === 2, "primer gallons, got " + withPrimer.primerGallons);
assert(/drywall primer/.test(withPrimer.groups[0].items[1]), "primer line on the coatings list");

var classic = calcs.deckFromScene(scene(calcs.deckScenes, "classic"));
assert(classic.ok, "deck classic ok");
assert(classic.rows === 26 && classic.perRow === 2 && classic.rawBoards === 52 && classic.boards === 58 && classic.stockFt === 696, "deck 26×2 → 58 boards, 696 stock ft, got " + [classic.rows, classic.perRow, classic.rawBoards, classic.boards, classic.stockFt].join(","));
assert(classic.needsRip === true, "classic deck last row rips");
assert(classic.groups.map(function (g) { return g.name; }).join(",") === "Lumber,Hardware,Coatings", "deck groups");
assert(/not added/.test(classic.groups[2].items[0]), "finish visible when off");
noStoreUrls(classic, "deck");

var platform = calcs.deckFromScene(scene(calcs.deckScenes, "platform"));
assert(platform.ok && platform.rows === 26 && platform.perRow === 2 && platform.boards === 58, "12×12 on 8 ft boards");

var composite = calcs.deckFromScene(scene(calcs.deckScenes, "composite"));
assert(composite.ok && composite.rows === 30 && composite.perRow === 2 && composite.boards === 66 && composite.stockFt === 1056, "composite scene, got " + composite.boards + " / " + composite.stockFt);
assert(/Hidden deck clips/.test(composite.groups[1].items[0]), "composite fastener name");

var fascia = calcs.deck({
  lengthFt: 16, widthFt: 12, boardWidthIn: 5.5, gapIn: 0.125, stockFt: 12,
  wastePct: 10, runAlong: "length", boardName: "5/4×6 pressure-treated decking",
  fastenerName: "Exterior deck screws", includeFascia: true, includeFinish: true,
  finishCoverage: 250, finishCoats: 2, finishName: "deck stain or sealer"
});
assert(fascia.ok && fascia.fasciaBoards === 6 && fascia.finishGallons === 2, "fascia 6 and finish 2, got " + fascia.fasciaBoards + "/" + fascia.finishGallons);

var exactGap = calcs.deck({
  lengthFt: 10, widthFt: 56.125 / 12, boardWidthIn: 5.5, gapIn: 0.125, stockFt: 10,
  wastePct: 0, runAlong: "length", boardName: "decking", fastenerName: "screws",
  includeFascia: false, includeFinish: false
});
assert(exactGap.ok && exactGap.rows === 10 && exactGap.needsRip === false, "phantom last gap is not a rip");

if (failed) {
  console.error(failed + " failed");
  process.exit(1);
}
console.log("calc checks passed");
