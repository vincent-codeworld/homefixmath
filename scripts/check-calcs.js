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

var sidewalk = calcs.concreteFromScene(scene(calcs.concreteScenes, "sidewalk"));
assert(sidewalk.ok && sidewalk.shape === "slab" && sidewalk.digs === true, "sidewalk ok");
assert(sidewalk.neatCuFt === 20 && sidewalk.withWasteCuFt === 22, "sidewalk 20 cu ft, 22 with waste, got " + sidewalk.neatCuFt + "/" + sidewalk.withWasteCuFt);
assert(sidewalk.yardsLabel === "0.81", "sidewalk yards 0.81, got " + sidewalk.yardsLabel);
assert(sidewalk.bags80 === 37 && sidewalk.bags60 === 49 && sidewalk.bags40 === 74, "sidewalk bags 37/49/74, got " + [sidewalk.bags80, sidewalk.bags60, sidewalk.bags40].join("/"));
assert(sidewalk.groups.map(function (g) { return g.name; }).join(",") === "80 lb bags,60 lb bags,40 lb bags,Not counted", "concrete groups");
assert(/Rounded up/.test(sidewalk.callout) && /36\.67/.test(sidewalk.callout), "sidewalk explains the 80 lb round-up");
assert(/Buy one size/.test(sidewalk.callout), "sidewalk says buy one size");
assert(/0\.60 cu ft/.test(sidewalk.yieldNote) && /0\.45 cu ft/.test(sidewalk.yieldNote) && /0\.30 cu ft/.test(sidewalk.yieldNote), "yield note cites 0.60/0.45/0.30");
assert(/QUIKRETE Concrete Mix data sheet #1101/.test(sidewalk.how.join(" ")), "how cites the data sheet");
assert(/Call 811/.test(sidewalk.callout), "sidewalk mentions 811");
assert(sidewalk.pending.join(",") === "80 lb concrete mix,60 lb concrete mix,40 lb concrete mix", "pending bag labels");
noStoreUrls(sidewalk, "concrete");

var postHole = calcs.concreteFromScene(scene(calcs.concreteScenes, "post"));
var postExact = Math.PI * 0.5 * 0.5 * 2 * 1.1;
assert(postHole.ok && postHole.shape === "cylinder" && postHole.digs === true, "post footing ok");
assert(Math.abs(postHole.withWasteCuFt - postExact) < 1e-9, "post hole volume");
assert(postHole.bags80 === 3 && postHole.bags60 === 4 && postHole.bags40 === 6, "post bags 3/4/6, got " + [postHole.bags80, postHole.bags60, postHole.bags40].join("/"));
assert(postHole.yardsLabel === "0.064", "post yards 0.064, got " + postHole.yardsLabel);

var strip = calcs.concreteFromScene(scene(calcs.concreteScenes, "strip"));
assert(strip.ok && strip.shape === "footing" && strip.digs === true, "strip footing ok");
assert(Math.abs(strip.neatCuFt - (20 * (8 / 12))) < 1e-9, "strip neat volume");
assert(strip.bags80 === 25 && strip.bags60 === 33 && strip.bags40 === 49, "strip bags 25/33/49, got " + [strip.bags80, strip.bags60, strip.bags40].join("/"));

var steps = calcs.concreteFromScene(scene(calcs.concreteScenes, "steps"));
var stepNeat = 4 * (11 / 12) * (7 / 12) * (4 * 5 / 2);
assert(steps.ok && steps.shape === "steps" && steps.digs === false, "steps ok and not marked as a dig");
assert(Math.abs(steps.neatCuFt - stepNeat) < 1e-9, "steps solid-stack volume");
assert(steps.bags80 === 40 && steps.bags60 === 53 && steps.bags40 === 79, "steps bags 40/53/79, got " + [steps.bags80, steps.bags60, steps.bags40].join("/"));
assert(/excavate/.test(steps.callout), "steps still mention 811 if you excavate");
assert(/filled stair|fill under/.test(steps.how.join(" ")), "steps explain the solid stack");

var oneYard = calcs.concrete({
  shape: "slab", lengthFt: 9, widthFt: 9, thicknessIn: 4, wastePct: 0
});
assert(oneYard.ok && oneYard.neatCuFt === 27 && oneYard.yardsLabel === "1.00", "1 cu yd slab, got " + oneYard.yardsLabel);
assert(oneYard.bags80 === 45 && oneYard.bags60 === 60 && oneYard.bags40 === 90, "1 cu yd is 45/60/90 bags");
assert(/whole number of bags/.test(oneYard.callout), "exact bags do not pretend to round up");

var partial = calcs.concrete({
  shape: "slab", lengthFt: 20, widthFt: 3, thicknessIn: 4, wastePct: 0
});
assert(partial.ok && partial.bags80 === 34 && /Rounded up/.test(partial.callout), "0% waste still rounds a partial bag, got " + partial.bags80);

var thin = calcs.concrete({ shape: "slab", lengthFt: 10, widthFt: 10, thicknessIn: 1, wastePct: 10 });
assert(!thin.ok && /2 and 24/.test(thin.error), "thickness under 2 in is rejected");

var huge = calcs.concrete({ shape: "slab", lengthFt: 200, widthFt: 200, thicknessIn: 12, wastePct: 0 });
assert(!huge.ok && /200 cubic yards/.test(huge.error), "oversize pour is rejected");

var badShape = calcs.concrete({ shape: "driveway", wastePct: 10 });
assert(!badShape.ok, "unknown shape fails");

var fs = require("fs");
var path = require("path");
var root = path.join(__dirname, "..");
function read(rel) { return fs.readFileSync(path.join(root, rel), "utf8"); }
var concretePage = read("site/calculators/concrete.html");
var homePage = read("site/index.html");
var sitemap = read("site/sitemap.xml");
assert(concretePage.indexOf("Concrete Calculator — Cubic Yards &amp; Bags (40/60/80 lb) | HomeFixMath") !== -1, "concrete title");
assert(concretePage.indexOf('href="https://homefixmath.com/calculators/concrete"') !== -1, "concrete canonical");
assert(concretePage.indexOf("How this was calculated") !== -1, "how summary");
assert(concretePage.indexOf("QUIKRETE Concrete Mix data sheet #1101 states a 40 lb bag yields approximately 0.30 cu ft") !== -1, "on-page yield citation");
assert(concretePage.indexOf("https://www.quikrete.com/pdfs/data_sheet-concrete%20mix%201101.pdf") !== -1, "data sheet link");
assert(!/homedepot\.com|lowes\.com|amazon\.com|shareasale|impact\.com/i.test(concretePage), "concrete page has no store or network URL");
assert(concretePage.indexOf("Link pending") !== -1, "link pending copy");
assert(homePage.indexOf("Open concrete calculator") !== -1, "homepage CTA");
assert(homePage.indexOf("calculators/fence-panels.html") !== -1 && homePage.indexOf("calculators/paint.html") !== -1 && homePage.indexOf("calculators/deck-boards.html") !== -1, "homepage keeps fence paint deck");
assert(sitemap.indexOf("https://homefixmath.com/calculators/concrete") !== -1, "sitemap concrete");
assert(sitemap.indexOf("https://homefixmath.com/calculators/fence-panels") !== -1, "sitemap still has fence");

if (failed) {
  console.error(failed + " failed");
  process.exit(1);
}
console.log("calc checks passed");
