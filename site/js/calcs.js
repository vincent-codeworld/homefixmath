/* HomeFixMath calculator math. No network, no store URLs. */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.HFMCalcs = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  function trimNum(n, digits) {
    if (!Number.isFinite(n)) return "";
    return Number(n.toFixed(digits)).toString();
  }

  function ceilStable(n) {
    if (!Number.isFinite(n)) return NaN;
    var nearest = Math.round(n);
    if (Math.abs(n - nearest) < 1e-6) return nearest;
    return Math.ceil(n);
  }

  function isInt(n) {
    return Number.isFinite(n) && Math.floor(n) === n;
  }

  function fail(msg) {
    return { ok: false, error: msg };
  }

  function byId(list, id) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  var fencePresets = [
    { id: "wood-8x6", label: "Wood privacy, 8 ft wide × 6 ft tall", widthFt: 8, heightFt: 6, material: "wood privacy panel" },
    { id: "wood-6x6", label: "Wood privacy, 6 ft wide × 6 ft tall", widthFt: 6, heightFt: 6, material: "wood privacy panel" },
    { id: "vinyl-6x6", label: "Vinyl privacy, 6 ft wide × 6 ft tall", widthFt: 6, heightFt: 6, material: "vinyl privacy panel" },
    { id: "vinyl-8x6", label: "Vinyl privacy, 8 ft wide × 6 ft tall", widthFt: 8, heightFt: 6, material: "vinyl privacy panel" },
    { id: "picket-4x4", label: "Wood picket section, 4 ft wide × 4 ft tall", widthFt: 4, heightFt: 4, material: "wood picket panel" },
    { id: "custom", label: "Custom width", widthFt: null, heightFt: null, material: "fence panel" }
  ];

  var fenceScenes = [
    { id: "backyard", label: "Backyard 100 ft + one gate", totalLengthFt: 100, presetId: "wood-8x6", gateCount: 1, gateWidthFt: 4, extraPosts: 0, includeCaps: true, wastePct: 10 },
    { id: "sideyard", label: "Side yard 60 ft, no gate", totalLengthFt: 60, presetId: "vinyl-6x6", gateCount: 0, gateWidthFt: 4, extraPosts: 0, includeCaps: true, wastePct: 10 },
    { id: "garden", label: "Garden 24 ft picket + 3 ft gate", totalLengthFt: 24, presetId: "picket-4x4", gateCount: 1, gateWidthFt: 3, extraPosts: 0, includeCaps: true, wastePct: 10 }
  ];

  var paintCoveragePresets = [
    { id: "latex-350", label: "Standard interior latex (about 350 ft²/gal)", coverage: 350, name: "standard interior latex" },
    { id: "premium-400", label: "Higher-coverage claim (about 400 ft²/gal)", coverage: 400, name: "higher-coverage interior paint" },
    { id: "low-250", label: "Dark color or rough surface (about 250 ft²/gal)", coverage: 250, name: "interior paint for a darker or rougher surface" },
    { id: "custom", label: "Custom coverage from the can", coverage: null, name: "interior paint" }
  ];

  var primerPresets = [
    { id: "primer-300", label: "Typical drywall primer (about 300 ft²/gal)", coverage: 300, name: "drywall primer" },
    { id: "primer-200", label: "Stain-blocking primer (about 200 ft²/gal)", coverage: 200, name: "stain-blocking primer" },
    { id: "custom", label: "Custom primer coverage", coverage: null, name: "primer" }
  ];

  var doorPresets = [
    { id: "door-std", label: "Standard door (about 21 ft²)", area: 21 },
    { id: "door-narrow", label: "Narrow door (about 17 ft²)", area: 17 },
    { id: "door-wide", label: "Double or sliding door (about 40 ft²)", area: 40 },
    { id: "custom", label: "Custom door area", area: null }
  ];

  var windowPresets = [
    { id: "win-typ", label: "Typical window (about 15 ft²)", area: 15 },
    { id: "win-small", label: "Small window (about 8 ft²)", area: 8 },
    { id: "win-large", label: "Large window (about 24 ft²)", area: 24 },
    { id: "custom", label: "Custom window area", area: null }
  ];

  var paintScenes = [
    { id: "bedroom", label: "12×12 bedroom, two coats", lengthFt: 12, widthFt: 12, heightFt: 8, doors: 1, windows: 1, doorPresetId: "door-std", windowPresetId: "win-typ", coats: 2, wastePct: 10, coveragePresetId: "latex-350", includeCeiling: false, includePrimer: false, primerPresetId: "primer-300" },
    { id: "example", label: "12×12, two doors and two windows", lengthFt: 12, widthFt: 12, heightFt: 8, doors: 2, windows: 2, doorPresetId: "door-std", windowPresetId: "win-typ", coats: 2, wastePct: 10, coveragePresetId: "latex-350", includeCeiling: false, includePrimer: false, primerPresetId: "primer-300" },
    { id: "living", label: "16×20 living room + ceiling", lengthFt: 16, widthFt: 20, heightFt: 9, doors: 2, windows: 3, doorPresetId: "door-std", windowPresetId: "win-typ", coats: 2, wastePct: 10, coveragePresetId: "latex-350", includeCeiling: true, includePrimer: false, primerPresetId: "primer-300" }
  ];

  var deckPresets = [
    { id: "pt-5-4x6", label: "5/4×6 pressure-treated (5.5 in face, 1/8 in gap)", faceIn: 5.5, gapIn: 0.125, name: "5/4×6 pressure-treated decking", fastener: "Exterior deck screws" },
    { id: "cedar-5-4x6", label: "5/4×6 cedar (5.5 in face, 1/8 in gap)", faceIn: 5.5, gapIn: 0.125, name: "5/4×6 cedar decking", fastener: "Exterior deck screws" },
    { id: "composite-clip", label: "Composite board (5.5 in face, 3/16 in clip gap)", faceIn: 5.5, gapIn: 0.1875, name: "composite decking", fastener: "Hidden deck clips" },
    { id: "two-by-six", label: "2×6 decking (5.5 in dressed face, 1/8 in gap)", faceIn: 5.5, gapIn: 0.125, name: "2×6 decking", fastener: "Exterior deck screws" },
    { id: "custom", label: "Custom face and gap", faceIn: null, gapIn: null, name: "decking", fastener: "Deck screws or hidden clips" }
  ];

  var finishPresets = [
    { id: "stain-250", label: "Typical deck stain (about 250 ft²/gal)", coverage: 250, name: "deck stain or sealer" },
    { id: "stain-150", label: "Thirsty wood (about 150 ft²/gal)", coverage: 150, name: "deck stain for thirsty wood" },
    { id: "custom", label: "Custom finish coverage", coverage: null, name: "deck finish" }
  ];

  var deckScenes = [
    { id: "classic", label: "16×12 deck, 5/4×6 boards", lengthFt: 16, widthFt: 12, presetId: "pt-5-4x6", stockFt: 12, wastePct: 10, runAlong: "length", includeFascia: false, includeFinish: false, finishPresetId: "stain-250", finishCoats: 2 },
    { id: "platform", label: "12×12 platform, 8 ft boards", lengthFt: 12, widthFt: 12, presetId: "pt-5-4x6", stockFt: 8, wastePct: 10, runAlong: "length", includeFascia: false, includeFinish: false, finishPresetId: "stain-250", finishCoats: 2 },
    { id: "composite", label: "20×14 composite, clip gap", lengthFt: 20, widthFt: 14, presetId: "composite-clip", stockFt: 16, wastePct: 10, runAlong: "length", includeFascia: false, includeFinish: false, finishPresetId: "stain-250", finishCoats: 2 }
  ];

  /* Published yields for QUIKRETE Concrete Mix #1101 (standard mix), not a partnership.
     40 lb ≈ 0.30 cu ft, 60 lb ≈ 0.45 cu ft, 80 lb ≈ 0.60 cu ft. */
  var concreteYields = [
    { pounds: 80, cuFt: 0.60 },
    { pounds: 60, cuFt: 0.45 },
    { pounds: 40, cuFt: 0.30 }
  ];

  var concreteYieldNote = "QUIKRETE Concrete Mix data sheet #1101 states a 40 lb bag yields approximately 0.30 cu ft, a 60 lb bag yields approximately 0.45 cu ft, and an 80 lb bag yields approximately 0.60 cu ft.";

  var concreteScenes = [
    { id: "sidewalk", label: "Sidewalk slab, 20×3 ft × 4 in", shape: "slab", lengthFt: 20, widthFt: 3, thicknessIn: 4, diameterIn: 12, depthIn: 24, holeCount: 1, footingLengthFt: 20, footingWidthIn: 12, footingDepthIn: 8, footingCount: 1, stepWidthFt: 4, treadIn: 11, riserIn: 7, stepCount: 4, wastePct: 10 },
    { id: "post", label: "Post footing, 12 in round × 24 in", shape: "cylinder", lengthFt: 20, widthFt: 3, thicknessIn: 4, diameterIn: 12, depthIn: 24, holeCount: 1, footingLengthFt: 20, footingWidthIn: 12, footingDepthIn: 8, footingCount: 1, stepWidthFt: 4, treadIn: 11, riserIn: 7, stepCount: 4, wastePct: 10 },
    { id: "strip", label: "Strip footing, 20 ft × 12 in × 8 in", shape: "footing", lengthFt: 20, widthFt: 3, thicknessIn: 4, diameterIn: 12, depthIn: 24, holeCount: 1, footingLengthFt: 20, footingWidthIn: 12, footingDepthIn: 8, footingCount: 1, stepWidthFt: 4, treadIn: 11, riserIn: 7, stepCount: 4, wastePct: 10 },
    { id: "steps", label: "Entry steps, 4 steps × 4 ft", shape: "steps", lengthFt: 20, widthFt: 3, thicknessIn: 4, diameterIn: 12, depthIn: 24, holeCount: 1, footingLengthFt: 20, footingWidthIn: 12, footingDepthIn: 8, footingCount: 1, stepWidthFt: 4, treadIn: 11, riserIn: 7, stepCount: 4, wastePct: 10 }
  ];

  function fence(input) {
    var total = input.totalLengthFt;
    var panelW = input.panelWidthFt;
    var height = input.panelHeightFt;
    var gates = input.gateCount;
    var gateW = input.gateWidthFt;
    var extra = input.extraPosts;
    var waste = input.wastePct;
    var material = input.materialName || "fence panel";

    if (!Number.isFinite(total) || total <= 0) return fail("Enter a fence length greater than 0 ft.");
    if (total > 2000) return fail("Fence length must be 2000 ft or less for this tool.");
    if (!Number.isFinite(panelW) || panelW < 4 || panelW > 12) return fail("Panel width must be between 4 and 12 ft.");
    if (!Number.isFinite(height) || height < 1 || height > 12) return fail("Panel height must be between 1 and 12 ft. It only labels the list.");
    if (!isInt(gates) || gates < 0) return fail("Gate count must be a whole number, 0 or more.");
    if (gates > 20) return fail("Gate count must be 20 or fewer.");
    if (!isInt(extra) || extra < 0) return fail("Extra posts must be a whole number, 0 or more.");
    if (extra > 100) return fail("Extra posts must be 100 or fewer.");
    if (!Number.isFinite(waste) || waste < 0 || waste > 40) return fail("Waste % must be between 0 and 40.");
    if (gates > 0) {
      if (!Number.isFinite(gateW) || gateW <= 0) return fail("Enter a gate width greater than 0 ft.");
      if (gateW > 20) return fail("Gate width must be 20 ft or less.");
    }

    var gateEach = gates > 0 ? gateW : 0;
    var gateTotal = gates * gateEach;
    if (gateTotal > total + 1e-9) return fail("Gate width × count exceeds total fence length.");

    var net = Math.max(0, total - gateTotal);
    var layoutPanels = net > 0 ? ceilStable(net / panelW) : 0;
    var lastBayFt = layoutPanels > 0 ? net - (layoutPanels - 1) * panelW : 0;
    var needsTrim = layoutPanels > 0 && lastBayFt < panelW - 0.01;
    var withWaste = layoutPanels * (1 + waste / 100);
    var buyPanels = layoutPanels === 0 ? 0 : ceilStable(withWaste);
    var spare = buyPanels - layoutPanels;
    var posts = (layoutPanels > 0 ? layoutPanels + 1 : 0) + (2 * gates) + extra;
    var caps = input.includeCaps ? posts : 0;

    var exactDiv = trimNum(layoutPanels === 0 ? 0 : net / panelW, 2);
    var wasteRaw = trimNum(withWaste, 2);

    var why = [];
    if (gates > 0) {
      why.push({ k: "Gates", v: gates + " × " + trimNum(gateEach, 2) + " ft = " + trimNum(gateTotal, 2) + " ft taken out of the panel run." });
    } else {
      why.push({ k: "Gates", v: "None. The whole run is paneled." });
    }
    why.push({ k: "Net run", v: trimNum(total, 2) + " − " + trimNum(gateTotal, 2) + " = " + trimNum(net, 2) + " ft." });
    if (layoutPanels === 0) {
      why.push({ k: "Panels", v: "No length left for panels." });
    } else if (needsTrim) {
      why.push({ k: "Panels", v: trimNum(net, 2) + " ÷ " + trimNum(panelW, 2) + " = " + exactDiv + " → " + layoutPanels + " panels. Rounded up because the last bay is " + trimNum(lastBayFt, 2) + " ft." });
    } else {
      why.push({ k: "Panels", v: trimNum(net, 2) + " ÷ " + trimNum(panelW, 2) + " = " + exactDiv + " → " + layoutPanels + " panels. The last bay is a full panel, so nothing to trim." });
    }
    if (layoutPanels === 0) {
      why.push({ k: "Waste", v: "No panels to add waste to." });
    } else if (waste === 0) {
      why.push({ k: "Waste", v: "0%. Buy " + buyPanels + ", the same as the layout." });
    } else {
      why.push({ k: "Waste", v: waste + "% of " + layoutPanels + " is " + wasteRaw + " → buy " + buyPanels + " panel" + (buyPanels === 1 ? "" : "s") + ". Rounded up so you are not short a whole panel." });
    }
    var postBits = [];
    if (layoutPanels > 0) postBits.push(layoutPanels + " bays + 1 end");
    postBits.push((2 * gates) + " gate posts");
    postBits.push(extra + " extra");
    why.push({ k: "Posts", v: postBits.join(" + ") + " = " + posts + ". Waste panels are spares, not extra bays, so they do not add posts." });
    why.push({ k: "Caps", v: input.includeCaps ? (caps + ", one per post.") : "Turned off." });

    var calloutParts = [];
    if (layoutPanels === 0 && gates > 0) {
      calloutParts.push("Gates take the whole run, so the panel count is 0. Posts here are for the gates" + (extra ? " plus the extras you typed." : "."));
    } else if (needsTrim) {
      calloutParts.push("Last bay may need a trim: it is " + trimNum(lastBayFt, 2) + " ft inside a " + trimNum(panelW, 2) + " ft panel. Buy the full panel and cut it down.");
    } else if (layoutPanels > 0) {
      calloutParts.push("The run lands on whole panels, so the last bay does not need a trim.");
    }
    if (layoutPanels > 0 && spare > 0) {
      calloutParts.push(trimNum(waste, 2) + "% waste moves the order from " + layoutPanels + " to " + buyPanels + " panels.");
    } else if (layoutPanels > 0 && waste > 0 && spare === 0) {
      calloutParts.push(trimNum(waste, 2) + "% waste is on, and it still rounds to " + buyPanels + " panels.");
    }
    var callout = calloutParts.join(" ");

    var sizeLabel = trimNum(panelW, 2) + " ft wide × " + trimNum(height, 2) + " ft tall";
    var panelName = buyPanels === 1 ? material : material.replace(/panel$/, "panels");
    var panelTail;
    if (layoutPanels === 0) panelTail = "no panel bays left after gates";
    else if (waste === 0) panelTail = layoutPanels + " for the bays; waste is 0%";
    else if (spare === 0) panelTail = layoutPanels + " for the bays; " + trimNum(waste, 2) + "% waste did not add a whole panel";
    else panelTail = layoutPanels + " for the bays + " + spare + " extra from " + trimNum(waste, 2) + "% waste";

    var lumber = [
      buyPanels + " × " + panelName + ", " + sizeLabel + " (" + panelTail + ")",
      posts + " × fence post" + (posts === 1 ? "" : "s") + ", matched to the panel system"
    ];
    if (input.includeCaps) lumber.push(caps + " × post cap" + (caps === 1 ? "" : "s"));
    else lumber.push("Post caps — not on this list");

    var hardware = [
      "Brackets and panel fasteners — follow the maker's pack. Not counted piece by piece here."
    ];
    if (gates > 0) {
      hardware.unshift(gates + " × gate kit" + (gates === 1 ? "" : "s") + ", about " + trimNum(gateEach, 2) + " ft wide, plus hinge and latch hardware");
    }
    hardware.push("Post-hole concrete or gravel — bag count is not on this list. Use a concrete calculator for a round hole, then confirm depth on site.");

    var how = [
      "Net length is the run minus every gate. " + trimNum(total, 2) + " − " + trimNum(gateTotal, 2) + " = " + trimNum(net, 2) + " ft.",
      "Panels are that length divided by the panel width, then rounded up. A short last bay still needs a whole panel you can trim. Height is only a label on the list.",
      waste > 0
        ? "Waste is " + trimNum(waste, 2) + "% on the layout count (" + layoutPanels + " → " + wasteRaw + "), rounded up again to " + buyPanels + " to buy."
        : "Waste is 0%, so the buy count matches the layout (" + buyPanels + ").",
      "Posts are one per panel bay, plus one so both ends of a straight run have a post, plus two for each gate, plus any extras you type for a corner you are adding by hand. This run: " + posts + " posts.",
      "Two posts per gate are added on top of the panel line. If your sketch reuses posts that are already in that line, trust the sketch — this tool will not remove them.",
      "This is a shopping count for prefab sections. It does not choose post size, hole depth, or concrete, and it is not a code or structural check."
    ];

    return {
      ok: true,
      netFt: net,
      layoutPanels: layoutPanels,
      buyPanels: buyPanels,
      posts: posts,
      caps: caps,
      needsTrim: needsTrim,
      lastBayFt: lastBayFt,
      sparePanels: spare,
      callout: callout,
      why: why,
      how: how,
      meta: trimNum(total, 2) + " ft run · " + sizeLabel + " · " + gates + " gate" + (gates === 1 ? "" : "s") + " · " + trimNum(waste, 2) + "% waste",
      groups: [
        { name: "Lumber", items: lumber },
        { name: "Hardware", items: hardware }
      ],
      copyNotes: [
        "Shop later: retailer links are not connected. Nothing on this list is a store link.",
        "Estimates only. Measure the line. Call 811 before you dig. Not a code or structural check."
      ]
    };
  }

  function paint(input) {
    var L = input.lengthFt;
    var W = input.widthFt;
    var H = input.heightFt;
    var doors = input.doors;
    var windows = input.windows;
    var doorA = input.doorArea;
    var winA = input.windowArea;
    var coats = input.coats;
    var waste = input.wastePct;
    var cov = input.coverage;
    var finishName = input.finishName || "interior paint";
    var ceilOn = !!input.includeCeiling;

    if (![L, W, H].every(function (v) { return Number.isFinite(v) && v > 0; })) {
      return fail("Enter room length, width, and height greater than 0 ft.");
    }
    if (L > 200 || W > 200 || H > 30) return fail("Room dimensions are outside the range this tool supports.");
    if (!isInt(doors) || doors < 0 || !isInt(windows) || windows < 0) {
      return fail("Doors and windows must be whole numbers, 0 or more.");
    }
    if (doors > 20 || windows > 40) return fail("Door or window counts are outside the supported range.");
    if (!isInt(coats) || coats < 1 || coats > 6) return fail("Coats must be a whole number from 1 to 6.");
    if (!Number.isFinite(doorA) || doorA < 1 || doorA > 80 || !Number.isFinite(winA) || winA < 1 || winA > 80) {
      return fail("Door and window areas must be between 1 and 80 ft².");
    }
    if (!Number.isFinite(waste) || waste < 0 || waste > 40) return fail("Waste % must be between 0 and 40.");
    if (!Number.isFinite(cov) || cov < 50 || cov > 600) return fail("Coverage must be between 50 and 600 ft² per gallon.");

    var primerOn = !!input.includePrimer;
    var primerCov = input.primerCoverage;
    var primerName = input.primerName || "primer";
    if (primerOn) {
      if (!Number.isFinite(primerCov) || primerCov < 50 || primerCov > 600) {
        return fail("Primer coverage must be between 50 and 600 ft² per gallon.");
      }
    }

    var gross = 2 * (L + W) * H;
    var doorDed = doors * doorA;
    var winDed = windows * winA;
    var walls = gross - doorDed - winDed;
    if (walls < -1e-6) return fail("Openings are larger than the wall area. Lower the door or window count, or the area of each.");
    if (walls < 0) walls = 0;
    var ceiling = ceilOn ? L * W : 0;
    var netArea = walls + ceiling;
    var withCoats = netArea * coats;
    var withWaste = withCoats * (1 + waste / 100);
    var exactGal = cov > 0 ? withWaste / cov : 0;
    var gallons = netArea === 0 ? 0 : ceilStable(exactGal);

    var primerExact = 0;
    var primerGallons = 0;
    if (primerOn && netArea > 0) {
      primerExact = (netArea * (1 + waste / 100)) / primerCov;
      primerGallons = ceilStable(primerExact);
    }

    var why = [
      { k: "Walls", v: "2 × (" + trimNum(L, 2) + " + " + trimNum(W, 2) + ") × " + trimNum(H, 2) + " = " + trimNum(gross, 1) + " ft² before openings." },
      { k: "Doors", v: doors === 0 ? "None subtracted." : (doors + " × " + trimNum(doorA, 2) + " = " + trimNum(doorDed, 1) + " ft² removed.") },
      { k: "Windows", v: windows === 0 ? "None subtracted." : (windows + " × " + trimNum(winA, 2) + " = " + trimNum(winDed, 1) + " ft² removed.") },
      { k: "Net walls", v: trimNum(walls, 1) + " ft²." },
      { k: "Ceiling", v: ceilOn ? (trimNum(ceiling, 1) + " ft² included.") : "Not on this list." },
      { k: "Coats", v: coats + " × " + trimNum(netArea, 1) + " ft² = " + trimNum(withCoats, 1) + " ft²." },
      { k: "Waste", v: trimNum(waste, 2) + "% for cut-in and touch-up → " + trimNum(withWaste, 1) + " ft²." },
      { k: "Round up", v: trimNum(withWaste, 1) + " ÷ " + trimNum(cov, 2) + " = " + trimNum(exactGal, 2) + " gallons → buy " + gallons + ". Cans are sold whole, and the fraction would leave a wall short." }
    ];
    if (primerOn) {
      why.push({ k: "Primer", v: "One coat on the same net area, with the same waste percent: " + trimNum(primerExact, 2) + " → buy " + primerGallons + " gallon" + (primerGallons === 1 ? "" : "s") + " at " + trimNum(primerCov, 0) + " ft²/gal." });
    } else {
      why.push({ k: "Primer", v: "Not on this list. Add it for new drywall, stains, or a big color change." });
    }

    var deduct = doorDed + winDed;
    var callout;
    if (deduct <= 0) {
      callout = "No door or window area was subtracted. The math comes to " + trimNum(exactGal, 2) + " gallons, so buy " + gallons + ".";
    } else {
      callout = "Doors and windows remove " + trimNum(deduct, 1) + " ft². The math comes to " + trimNum(exactGal, 2) + " gallons, so buy " + gallons + ".";
    }

    var coatings = [
      gallons + " gallon" + (gallons === 1 ? "" : "s") + " of " + finishName + " (" + trimNum(exactGal, 2) + " before rounding up; about " + trimNum(cov, 0) + " ft²/gal — the can label wins)"
    ];
    if (primerOn) {
      coatings.push(primerGallons + " gallon" + (primerGallons === 1 ? "" : "s") + " of " + primerName + ", one coat (" + trimNum(primerExact, 2) + " before rounding; about " + trimNum(primerCov, 0) + " ft²/gal)");
    } else {
      coatings.push("Primer — not added. Use it on new drywall, stains, or a large color change.");
    }
    coatings.push("Trim enamel — a quart often covers the baseboards in a small room. Not calculated from wall area.");

    var how = [
      "Wall area is the perimeter times the ceiling height: 2 × (" + trimNum(L, 2) + " + " + trimNum(W, 2) + ") × " + trimNum(H, 2) + " = " + trimNum(gross, 1) + " ft².",
      "Openings come off that area. Doors remove " + trimNum(doorDed, 1) + " ft² and windows remove " + trimNum(winDed, 1) + " ft², leaving " + trimNum(walls, 1) + " ft² of wall.",
      ceilOn
        ? "The ceiling is length × width = " + trimNum(ceiling, 1) + " ft², added once."
        : "The ceiling is off, so it adds 0 ft².",
      "That area is multiplied by " + coats + " coat" + (coats === 1 ? "" : "s") + " and by " + trimNum(waste, 2) + "% waste, then divided by " + trimNum(cov, 0) + " ft² per gallon.",
      trimNum(exactGal, 2) + " gallons rounds up to " + gallons + " because you cannot buy a fraction of a gallon, and the leftover fraction is the last wall.",
      "Coverage presets are common planning numbers, not a promise. If your can prints a different spread rate, use that. This is not a product specification."
    ];

    return {
      ok: true,
      gallons: gallons,
      wallsSqft: walls,
      ceilingSqft: ceiling,
      exactGallons: exactGal,
      primerGallons: primerGallons,
      callout: callout,
      why: why,
      how: how,
      meta: trimNum(L, 2) + "×" + trimNum(W, 2) + "×" + trimNum(H, 2) + " ft · " + coats + " coat" + (coats === 1 ? "" : "s") + " · " + trimNum(walls, 0) + " ft² walls" + (ceiling > 0 ? " + " + trimNum(ceiling, 0) + " ft² ceiling" : "") + " · " + trimNum(waste, 2) + "% waste",
      groups: [
        { name: "Coatings", items: coatings },
        { name: "Supplies", items: [
          "Roller cover, tray, and an angled brush",
          "Painter's tape and drop cloths"
        ] }
      ],
      copyNotes: [
        "Shop later: retailer links are not connected. Nothing on this list is a store link.",
        "Estimates only. Match the spread rate on the can. Not a product specification."
      ]
    };
  }

  function deck(input) {
    var L = input.lengthFt;
    var W = input.widthFt;
    var face = input.boardWidthIn;
    var gap = input.gapIn;
    var stock = input.stockFt;
    var waste = input.wastePct;
    var along = input.runAlong;
    var boardName = input.boardName || "decking";
    var fastener = input.fastenerName || "Deck screws or hidden clips";

    if (![L, W].every(function (v) { return Number.isFinite(v) && v > 0; })) {
      return fail("Enter deck length and width greater than 0 ft.");
    }
    if (L > 200 || W > 200) return fail("Deck dimensions are outside the range this tool supports.");
    if (!Number.isFinite(face) || face < 1 || face > 12) return fail("Board face width must be between 1 and 12 in.");
    if (!Number.isFinite(gap) || gap < 0 || gap > 1) return fail("Gap must be between 0 and 1 in.");
    if (!Number.isFinite(stock) || stock < 4 || stock > 24) return fail("Stock board length must be between 4 and 24 ft.");
    if (!Number.isFinite(waste) || waste < 0 || waste > 40) return fail("Waste % must be between 0 and 40.");
    if (along !== "length" && along !== "width") return fail("Choose which way the boards run.");
    var pitch = face + gap;
    if (pitch <= 0) return fail("Board width plus gap must be greater than 0.");

    var fasciaOn = !!input.includeFascia;
    var finishOn = !!input.includeFinish;
    var finishCov = input.finishCoverage;
    var finishCoats = input.finishCoats;
    var finishName = input.finishName || "deck finish";
    if (finishOn) {
      if (!Number.isFinite(finishCov) || finishCov < 50 || finishCov > 600) {
        return fail("Finish coverage must be between 50 and 600 ft² per gallon.");
      }
      if (!isInt(finishCoats) || finishCoats < 1 || finishCoats > 3) {
        return fail("Finish coats must be a whole number from 1 to 3.");
      }
    }

    var perpFt = along === "length" ? W : L;
    var alongFt = along === "length" ? L : W;
    var perpIn = perpFt * 12;
    var rowRaw = perpIn / pitch;
    var rows = ceilStable(rowRaw);
    var perRaw = alongFt / stock;
    var perRow = ceilStable(perRaw);
    var raw = rows * perRow;
    var buy = ceilStable(raw * (1 + waste / 100));
    var linFt = ceilStable(rows * alongFt * (1 + waste / 100));
    var stockFt = buy * stock;
    var extraIn = rows * pitch - perpIn;
    var needsRip = extraIn > gap + 0.05;
    var alongExact = Math.abs(alongFt - perRow * stock) < 0.01;
    var area = L * W;

    var fasciaRaw = 0;
    var fasciaBuy = 0;
    var perimeter = 2 * (L + W);
    if (fasciaOn) {
      fasciaRaw = ceilStable(perimeter / stock);
      fasciaBuy = ceilStable(fasciaRaw * (1 + waste / 100));
    }

    var finishExact = 0;
    var finishGallons = 0;
    if (finishOn) {
      finishExact = (area * finishCoats * (1 + waste / 100)) / finishCov;
      finishGallons = ceilStable(finishExact);
    }

    var alongName = along === "length" ? "the length" : "the width";
    var why = [
      { k: "Pitch", v: trimNum(face, 4) + " in face + " + trimNum(gap, 4) + " in gap = " + trimNum(pitch, 4) + " in. Use the dressed face, not the nominal name on the board." },
      { k: "Rows", v: trimNum(perpFt, 2) + " ft is " + trimNum(perpIn, 2) + " in ÷ " + trimNum(pitch, 4) + " = " + trimNum(rowRaw, 2) + " → " + rows + " rows. Rounded up so the closing row still has a board." },
      { k: "Last row", v: needsRip
        ? (rows + " rows at this pitch run about " + trimNum(extraIn, 2) + " in past the deck. The last board may need a rip, or the gaps may close a little. Match the gap the boards actually want.")
        : "The width lines up with this pitch, so rounding did not force a rip." },
      { k: "Along", v: trimNum(alongFt, 2) + " ft ÷ " + trimNum(stock, 2) + " ft stock = " + trimNum(perRaw, 2) + " → " + perRow + " board" + (perRow === 1 ? "" : "s") + " per row, parallel to " + alongName + "." + (alongExact ? " Each row is an even stock length." : " Offcuts are not reused on the next row, so this count can leave leftovers.") },
      { k: "Waste", v: raw + " boards × " + trimNum(waste, 2) + "% = " + trimNum(raw * (1 + waste / 100), 2) + " → buy " + buy + ". Rounded up to a whole board. That is " + trimNum(stockFt, 0) + " ft of stock. The surface itself is about " + trimNum(rows * alongFt, 0) + " ft; the difference is offcut this count does not reuse." },
      { k: "Fascia", v: fasciaOn
        ? ("Perimeter " + trimNum(perimeter, 2) + " ft ÷ " + trimNum(stock, 2) + " ft = " + fasciaRaw + " pieces, then waste → " + fasciaBuy + ". Corner miters are only covered by that waste percent.")
        : "Not on this list." },
      { k: "Finish", v: finishOn
        ? (trimNum(area, 1) + " ft² × " + finishCoats + " coat" + (finishCoats === 1 ? "" : "s") + " × waste ÷ " + trimNum(finishCov, 0) + " = " + trimNum(finishExact, 2) + " → buy " + finishGallons + " gallon" + (finishGallons === 1 ? "" : "s") + ".")
        : ("Not on this list. Walking surface is " + trimNum(area, 1) + " ft² if you shop a can by its label.") }
    ];

    var calloutParts = [];
    if (needsRip) {
      calloutParts.push("Last row may need a rip: this pitch runs about " + trimNum(extraIn, 2) + " in past the deck width.");
    } else {
      calloutParts.push("The width lines up with this pitch, so the last row is not a forced rip.");
    }
    if (!alongExact) {
      calloutParts.push(perRow > 1
        ? "Each row needs " + perRow + " boards. Offcuts are not reused on the next row."
        : "One stock board covers each row, with a cutoff at the end.");
    }
    calloutParts.push(trimNum(waste, 2) + "% waste moves the count from " + raw + " to " + buy + " boards.");
    var callout = calloutParts.join(" ");

    var lumber = [
      buy + " × " + trimNum(stock, 2) + " ft " + boardName + " (face " + trimNum(face, 4) + " in, gap " + trimNum(gap, 4) + " in; " + raw + " before " + trimNum(waste, 2) + "% waste)"
    ];
    if (fasciaOn) {
      lumber.push(fasciaBuy + " × " + trimNum(stock, 2) + " ft fascia boards (perimeter " + trimNum(perimeter, 2) + " ft; " + fasciaRaw + " before waste)");
    } else {
      lumber.push("Fascia boards — not added. Turn them on to count the perimeter.");
    }

    var coatings = [];
    if (finishOn) {
      coatings.push(finishGallons + " gallon" + (finishGallons === 1 ? "" : "s") + " of " + finishName + ", " + finishCoats + " coat" + (finishCoats === 1 ? "" : "s") + " (" + trimNum(finishExact, 2) + " before rounding; about " + trimNum(finishCov, 0) + " ft²/gal on " + trimNum(area, 0) + " ft²)");
    } else {
      coatings.push("Deck finish — not added. The walking surface is " + trimNum(area, 0) + " ft² if you shop a can by its coverage.");
    }

    var how = [
      "Boards run parallel to " + alongName + ". The other direction is " + trimNum(perpFt, 2) + " ft, which is " + trimNum(perpIn, 2) + " in.",
      "Pitch is the dressed face plus the gap you typed: " + trimNum(face, 4) + " + " + trimNum(gap, 4) + " = " + trimNum(pitch, 4) + " in. Nominal names like 5/4×6 are wider on the label than the face you install.",
      "Rows are the across-inches divided by that pitch, rounded up: " + trimNum(rowRaw, 2) + " → " + rows + ". The pitch counts a gap with every board, including the last, so a perfect fit can still look a hair long. A leftover about the size of the gap is that last gap, not a rip.",
      "Pieces per row are the run length divided by the stock length, rounded up: " + trimNum(perRaw, 2) + " → " + perRow + ". Offcuts are not assumed to start the next row.",
      "Raw boards are " + rows + " × " + perRow + " = " + raw + ". Waste is " + trimNum(waste, 2) + "% of that, rounded up to " + buy + " boards to buy.",
      "This counts decking boards only. It does not size joists, beams, footings, or fasteners, and it is not a code or structural check."
    ];

    return {
      ok: true,
      boards: buy,
      rows: rows,
      perRow: perRow,
      rawBoards: raw,
      linearFt: linFt,
      stockFt: stockFt,
      needsRip: needsRip,
      fasciaBoards: fasciaBuy,
      finishGallons: finishGallons,
      callout: callout,
      why: why,
      how: how,
      meta: trimNum(L, 2) + "×" + trimNum(W, 2) + " ft · " + rows + " rows · " + perRow + " per row · " + trimNum(stock, 2) + " ft stock · " + trimNum(waste, 2) + "% waste",
      groups: [
        { name: "Lumber", items: lumber },
        { name: "Hardware", items: [
          fastener + " — not counted. Joist spacing is outside this tool, so match the fastener the board maker calls for."
        ] },
        { name: "Coatings", items: coatings }
      ],
      copyNotes: [
        "Shop later: retailer links are not connected. Nothing on this list is a store link.",
        "Estimates only. Confirm the real face width and gap with the product. Not a code or structural check."
      ]
    };
  }

  function yieldFixed(n) {
    return n.toFixed(2);
  }

  function formatYards(cuYd) {
    if (cuYd < 0.1) return cuYd.toFixed(3);
    return cuYd.toFixed(2);
  }

  function concreteBag(volumeCuFt, spec) {
    var exact = volumeCuFt / spec.cuFt;
    return {
      pounds: spec.pounds,
      yieldCuFt: spec.cuFt,
      exact: exact,
      buy: ceilStable(exact),
      whole: Math.abs(exact - Math.round(exact)) < 1e-6
    };
  }

  function concrete(input) {
    var shape = input.shape;
    var waste = input.wastePct;
    var shapes = { slab: true, cylinder: true, footing: true, steps: true };
    if (!shapes[shape]) return fail("Choose a slab, round pier, strip footing, or steps.");
    if (!Number.isFinite(waste) || waste < 0 || waste > 40) return fail("Waste % must be between 0 and 40.");

    var neat = 0;
    var digs = true;
    var summary = "";
    var formula = "";
    var extraHow = "";

    if (shape === "slab") {
      var lengthFt = input.lengthFt;
      var widthFt = input.widthFt;
      var thicknessIn = input.thicknessIn;
      if (!Number.isFinite(lengthFt) || lengthFt <= 0) return fail("Enter a slab length greater than 0 ft.");
      if (lengthFt > 200) return fail("Slab length must be 200 ft or less for this tool.");
      if (!Number.isFinite(widthFt) || widthFt <= 0) return fail("Enter a slab width greater than 0 ft.");
      if (widthFt > 200) return fail("Slab width must be 200 ft or less for this tool.");
      if (!Number.isFinite(thicknessIn) || thicknessIn < 2 || thicknessIn > 24) {
        return fail("Thickness must be between 2 and 24 inches. The cited mix is published for pours about 2 inches thick or more. This is not a code thickness.");
      }
      var thickFt = thicknessIn / 12;
      neat = lengthFt * widthFt * thickFt;
      summary = "Slab " + trimNum(lengthFt, 2) + " ft × " + trimNum(widthFt, 2) + " ft × " + trimNum(thicknessIn, 2) + " in";
      formula = trimNum(lengthFt, 2) + " × " + trimNum(widthFt, 2) + " × (" + trimNum(thicknessIn, 2) + " ÷ 12) = " + trimNum(neat, 2) + " cu ft.";
      extraHow = "A slab is length × width × thickness, with inches turned into feet.";
    } else if (shape === "cylinder") {
      var diameterIn = input.diameterIn;
      var depthIn = input.depthIn;
      var holeCount = input.holeCount;
      if (!Number.isFinite(diameterIn) || diameterIn < 4 || diameterIn > 36) return fail("Diameter must be between 4 and 36 inches.");
      if (!Number.isFinite(depthIn) || depthIn < 6 || depthIn > 120) return fail("Depth must be between 6 and 120 inches.");
      if (!isInt(holeCount) || holeCount < 1 || holeCount > 50) return fail("Hole count must be a whole number from 1 to 50.");
      var radiusFt = diameterIn / 24;
      var heightFt = depthIn / 12;
      var oneHole = Math.PI * radiusFt * radiusFt * heightFt;
      neat = oneHole * holeCount;
      summary = holeCount + " round pier" + (holeCount === 1 ? "" : "s") + ", " + trimNum(diameterIn, 2) + " in across × " + trimNum(depthIn, 2) + " in deep";
      formula = "π × (" + trimNum(diameterIn / 2, 2) + " ÷ 12)² × (" + trimNum(depthIn, 2) + " ÷ 12) = " + trimNum(oneHole, 2) + " cu ft each. × " + holeCount + " = " + trimNum(neat, 2) + " cu ft.";
      extraHow = "A round pier or post hole is a cylinder: π × radius² × depth. Depth is the number you typed, not a frost-line recommendation.";
    } else if (shape === "footing") {
      var footingLengthFt = input.footingLengthFt;
      var footingWidthIn = input.footingWidthIn;
      var footingDepthIn = input.footingDepthIn;
      var footingCount = input.footingCount;
      if (!Number.isFinite(footingLengthFt) || footingLengthFt <= 0) return fail("Enter a footing length greater than 0 ft.");
      if (footingLengthFt > 200) return fail("Footing length must be 200 ft or less for this tool.");
      if (!Number.isFinite(footingWidthIn) || footingWidthIn < 4 || footingWidthIn > 48) return fail("Footing width must be between 4 and 48 inches.");
      if (!Number.isFinite(footingDepthIn) || footingDepthIn < 4 || footingDepthIn > 48) return fail("Footing depth must be between 4 and 48 inches.");
      if (!isInt(footingCount) || footingCount < 1 || footingCount > 20) return fail("Footing count must be a whole number from 1 to 20.");
      var oneFoot = footingLengthFt * (footingWidthIn / 12) * (footingDepthIn / 12);
      neat = oneFoot * footingCount;
      summary = footingCount + " strip footing" + (footingCount === 1 ? "" : "s") + ", " + trimNum(footingLengthFt, 2) + " ft × " + trimNum(footingWidthIn, 2) + " in wide × " + trimNum(footingDepthIn, 2) + " in deep";
      formula = trimNum(footingLengthFt, 2) + " × (" + trimNum(footingWidthIn, 2) + " ÷ 12) × (" + trimNum(footingDepthIn, 2) + " ÷ 12) = " + trimNum(oneFoot, 2) + " cu ft each. × " + footingCount + " = " + trimNum(neat, 2) + " cu ft.";
      extraHow = "A strip footing is length × width × depth, times how many identical ones you entered. The section is your measurement, not a structural size.";
    } else {
      var stepWidthFt = input.stepWidthFt;
      var treadIn = input.treadIn;
      var riserIn = input.riserIn;
      var stepCount = input.stepCount;
      if (!Number.isFinite(stepWidthFt) || stepWidthFt <= 0) return fail("Enter a step width greater than 0 ft.");
      if (stepWidthFt > 30) return fail("Step width must be 30 ft or less for this tool.");
      if (!Number.isFinite(treadIn) || treadIn < 6 || treadIn > 24) return fail("Tread depth must be between 6 and 24 inches.");
      if (!Number.isFinite(riserIn) || riserIn < 4 || riserIn > 12) return fail("Riser height must be between 4 and 12 inches.");
      if (!isInt(stepCount) || stepCount < 1 || stepCount > 20) return fail("Step count must be a whole number from 1 to 20.");
      var stack = stepCount * (stepCount + 1) / 2;
      neat = stepWidthFt * (treadIn / 12) * (riserIn / 12) * stack;
      digs = false;
      summary = stepCount + " solid step" + (stepCount === 1 ? "" : "s") + ", " + trimNum(stepWidthFt, 2) + " ft wide, " + trimNum(treadIn, 2) + " in tread, " + trimNum(riserIn, 2) + " in riser";
      formula = trimNum(stepWidthFt, 2) + " × (" + trimNum(treadIn, 2) + " ÷ 12) × (" + trimNum(riserIn, 2) + " ÷ 12) × " + trimNum(stack, 0) + " = " + trimNum(neat, 2) + " cu ft. The " + trimNum(stack, 0) + " is 1 + 2 + … + " + stepCount + " riser-heights, a filled stair.";
      extraHow = "Solid steps assume fill under the treads: the first step is one riser tall, the next is two, and so on. An open underside uses less concrete than this count. These ranges are for the form, not a stair code.";
    }

    if (!Number.isFinite(neat) || neat <= 0) return fail("Volume must be greater than 0.");
    if (neat > 5400) return fail("That volume is over 200 cubic yards. This tool is for a DIY bag estimate — split the pour or ask a ready-mix yard.");

    var withWaste = neat * (1 + waste / 100);
    var cuYd = withWaste / 27;
    var yardsLabel = formatYards(cuYd);
    var bags = concreteYields.map(function (spec) { return concreteBag(withWaste, spec); });
    var byPound = {};
    bags.forEach(function (bag) { byPound[bag.pounds] = bag; });

    var why = [
      { k: "Volume", v: formula },
      { k: "Waste", v: waste === 0
        ? "0%. The order uses " + trimNum(neat, 2) + " cu ft, the same as the shape."
        : trimNum(waste, 2) + "% on top of " + trimNum(neat, 2) + " cu ft → " + trimNum(withWaste, 2) + " cu ft." },
      { k: "Cubic yards", v: trimNum(withWaste, 2) + " ÷ 27 = " + yardsLabel + " cu yd with waste. Yards stay in decimals. They are not rounded up to a truck." }
    ];
    bags.forEach(function (bag) {
      var line = trimNum(withWaste, 2) + " ÷ " + yieldFixed(bag.yieldCuFt) + " = " + trimNum(bag.exact, 2) + " → buy " + bag.buy + ".";
      if (bag.whole) line += " That lands on a whole bag, so the round-up adds nothing.";
      else line += " Rounded up because you cannot buy a fraction of a bag.";
      why.push({ k: bag.pounds + " lb", v: line });
    });

    var roundups = bags.filter(function (bag) { return !bag.whole; });
    var callout;
    if (!roundups.length) {
      callout = "Each bag size lands on a whole number of bags, so the round-up adds nothing. Buy one size, not all three.";
    } else {
      callout = roundups.map(function (bag) {
        return bag.pounds + " lb is " + trimNum(bag.exact, 2) + " → buy " + bag.buy;
      }).join(". ") + ". Rounded up because you cannot buy a fraction of a bag. Buy one size, not all three.";
    }
    if (digs) callout += " Call 811 before you dig.";
    else callout += " If you excavate a pad for these steps, call 811 before you dig.";

    var groups = bags.map(function (bag) {
      var tail = bag.whole
        ? " → " + bag.buy + " (already a whole bag)."
        : " → buy " + bag.buy + ". Rounded up to a whole bag.";
      return {
        name: bag.pounds + " lb bags",
        items: [
          bag.buy + " × " + bag.pounds + " lb bag" + (bag.buy === 1 ? "" : "s") + " of concrete mix",
          trimNum(withWaste, 2) + " cu ft ÷ " + yieldFixed(bag.yieldCuFt) + " cu ft per bag = " + trimNum(bag.exact, 2) + tail
        ]
      };
    });

    var supplies = [
      "Water — follow the bag you buy. This list does not set a water amount.",
      "Reinforcement is not sized. This is not a structural design."
    ];
    if (shape === "slab") {
      supplies.unshift("Form boards and stakes — not counted.");
      supplies.unshift("Gravel subbase — not counted.");
    } else if (shape === "cylinder") {
      supplies.unshift("Tube or round form — not counted.");
      supplies.unshift("Gravel in the bottom of the hole — not counted.");
    } else if (shape === "footing") {
      supplies.unshift("Forms, if any of the footing is above grade — not counted.");
      supplies.unshift("The trench itself is your measurement, not a code section.");
    } else {
      supplies.unshift("Riser forms — not counted.");
      supplies.unshift("This count fills under the treads. An open underside needs less.");
    }
    groups.push({ name: "Not counted", items: supplies });

    var how = [
      extraHow + " " + formula,
      waste === 0
        ? "Waste is 0%, so the bag math uses " + trimNum(neat, 2) + " cu ft."
        : "Waste is " + trimNum(waste, 2) + "%: " + trimNum(neat, 2) + " × " + trimNum(1 + waste / 100, 2) + " = " + trimNum(withWaste, 2) + " cu ft.",
      "Cubic yards are that volume divided by 27, shown as " + yardsLabel + ". The decimals are the volume. They are not a ready-mix order, and many yards have their own minimum.",
      "Bag counts divide the waste-adjusted cubic feet by a published yield, then round up to a whole bag. " + concreteYieldNote + " HomeFixMath is not affiliated with QUIKRETE. Fast-setting and other mixes can yield less — read the bag you buy.",
      "Buy one bag size. The 80, 60, and 40 lb lines are the same pour.",
      "This is a planning volume only. It does not choose thickness, reinforcement, frost depth, or whether the pour meets a code. Verify it on site."
    ];
    if (digs) how.push("This shape means digging or disturbing soil. Call 811 before you dig.");
    else how.push("Steps may still need a dug pad. If you excavate, call 811 before you dig.");

    var copyNotes = [
      "Buy one bag size, not all three. The three lines are the same volume.",
      concreteYieldNote + " HomeFixMath is not affiliated with QUIKRETE. Fast-setting and other mixes can yield less — read the bag you buy.",
      "Cubic yards are the volume with waste (" + yardsLabel + " cu yd). They are not a rounded truck order.",
      "Shop later: retailer links are not connected. Nothing on this list is a store link.",
      "Planning estimate only. Not a structural design, footing size, or code check. Verify thickness, base, and the mix on site."
    ];
    if (digs) copyNotes.push("Call 811 before you dig.");
    else copyNotes.push("If you excavate a pad for these steps, call 811 before you dig.");

    return {
      ok: true,
      shape: shape,
      summary: summary,
      digs: digs,
      neatCuFt: neat,
      withWasteCuFt: withWaste,
      cuYd: cuYd,
      yardsLabel: yardsLabel,
      bags80: byPound[80].buy,
      bags60: byPound[60].buy,
      bags40: byPound[40].buy,
      bags: bags,
      callout: callout,
      why: why,
      how: how,
      meta: summary + " · " + trimNum(withWaste, 2) + " cu ft with " + trimNum(waste, 2) + "% waste · " + yardsLabel + " cu yd",
      groups: groups,
      pending: ["80 lb concrete mix", "60 lb concrete mix", "40 lb concrete mix"],
      copyNotes: copyNotes,
      yieldNote: concreteYieldNote
    };
  }

  function fenceFromScene(scene) {
    var preset = byId(fencePresets, scene.presetId);
    return fence({
      totalLengthFt: scene.totalLengthFt,
      panelWidthFt: preset.widthFt,
      panelHeightFt: preset.heightFt,
      gateCount: scene.gateCount,
      gateWidthFt: scene.gateWidthFt,
      extraPosts: scene.extraPosts,
      includeCaps: scene.includeCaps,
      wastePct: scene.wastePct,
      materialName: preset.material
    });
  }

  function paintFromScene(scene) {
    var coverage = byId(paintCoveragePresets, scene.coveragePresetId);
    var door = byId(doorPresets, scene.doorPresetId);
    var win = byId(windowPresets, scene.windowPresetId);
    var primer = byId(primerPresets, scene.primerPresetId);
    return paint({
      lengthFt: scene.lengthFt,
      widthFt: scene.widthFt,
      heightFt: scene.heightFt,
      doors: scene.doors,
      windows: scene.windows,
      doorArea: door.area,
      windowArea: win.area,
      coats: scene.coats,
      wastePct: scene.wastePct,
      coverage: coverage.coverage,
      finishName: coverage.name,
      includeCeiling: scene.includeCeiling,
      includePrimer: scene.includePrimer,
      primerCoverage: primer.coverage,
      primerName: primer.name
    });
  }

  function concreteFromScene(scene) {
    return concrete({
      shape: scene.shape,
      wastePct: scene.wastePct,
      lengthFt: scene.lengthFt,
      widthFt: scene.widthFt,
      thicknessIn: scene.thicknessIn,
      diameterIn: scene.diameterIn,
      depthIn: scene.depthIn,
      holeCount: scene.holeCount,
      footingLengthFt: scene.footingLengthFt,
      footingWidthIn: scene.footingWidthIn,
      footingDepthIn: scene.footingDepthIn,
      footingCount: scene.footingCount,
      stepWidthFt: scene.stepWidthFt,
      treadIn: scene.treadIn,
      riserIn: scene.riserIn,
      stepCount: scene.stepCount
    });
  }

  function deckFromScene(scene) {
    var preset = byId(deckPresets, scene.presetId);
    var finish = byId(finishPresets, scene.finishPresetId);
    return deck({
      lengthFt: scene.lengthFt,
      widthFt: scene.widthFt,
      boardWidthIn: preset.faceIn,
      gapIn: preset.gapIn,
      stockFt: scene.stockFt,
      wastePct: scene.wastePct,
      runAlong: scene.runAlong,
      boardName: preset.name,
      fastenerName: preset.fastener,
      includeFascia: scene.includeFascia,
      includeFinish: scene.includeFinish,
      finishCoverage: finish.coverage,
      finishCoats: scene.finishCoats,
      finishName: finish.name
    });
  }

  return {
    trimNum: trimNum,
    ceilStable: ceilStable,
    byId: byId,
    fencePresets: fencePresets,
    fenceScenes: fenceScenes,
    paintCoveragePresets: paintCoveragePresets,
    primerPresets: primerPresets,
    doorPresets: doorPresets,
    windowPresets: windowPresets,
    paintScenes: paintScenes,
    deckPresets: deckPresets,
    finishPresets: finishPresets,
    deckScenes: deckScenes,
    concreteYields: concreteYields,
    concreteYieldNote: concreteYieldNote,
    concreteScenes: concreteScenes,
    fence: fence,
    paint: paint,
    deck: deck,
    concrete: concrete,
    fenceFromScene: fenceFromScene,
    paintFromScene: paintFromScene,
    deckFromScene: deckFromScene,
    concreteFromScene: concreteFromScene
  };
});
