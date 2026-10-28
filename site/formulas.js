/* Pure planning math for HomeFixMath calculators. No DOM. */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.HomeFixMath = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function num(value) {
    if (typeof value === "number") return value;
    if (value == null) return NaN;
    var s = String(value).trim();
    if (s === "") return NaN;
    return Number(s);
  }

  function numOrZero(value) {
    if (value == null) return 0;
    var s = String(value).trim();
    if (s === "") return 0;
    return Number(s);
  }

  function isPositive(n) {
    return Number.isFinite(n) && n > 0;
  }

  function isWhole(n, max) {
    return Number.isFinite(n) && n >= 0 && n <= max && Math.abs(n - Math.round(n)) < 1e-6;
  }

  function fail(message) {
    return { ok: false, message: message };
  }

  /* Ceil that treats values landing on an integer (within float noise) as that integer. */
  function safeCeil(n) {
    if (!Number.isFinite(n)) return NaN;
    var nearest = Math.round(n);
    if (Math.abs(n - nearest) < 1e-6) return nearest;
    return Math.ceil(n);
  }

  function round2(n) {
    return Math.round(n * 100) / 100;
  }

  function formatNum(n) {
    if (!Number.isFinite(n)) return "";
    var r = Math.round(n * 100) / 100;
    if (Math.abs(r - Math.round(r)) < 1e-9) return String(Math.round(r));
    return String(r);
  }

  function fence(input) {
    var lengthFt = num(input.lengthFt);
    var panelFt = num(input.panelFt);
    var hasGate = !!input.hasGate;

    if (!isPositive(lengthFt)) {
      return fail("Enter a fence length greater than 0.");
    }
    if (!isPositive(panelFt)) {
      return fail("Choose a panel width greater than 0.");
    }
    if (lengthFt > 2000) {
      return fail("That run is too long for one list. Split it into sections under 2,000 ft.");
    }
    if (panelFt > 16) {
      return fail("Panel width should be a stock size, usually 6 or 8 ft.");
    }

    var bays = safeCeil(lengthFt / panelFt);
    var panels = hasGate ? Math.max(0, bays - 1) : bays;
    var posts = bays + 1;
    var coveredFt = round2(bays * panelFt);

    return {
      ok: true,
      lengthFt: lengthFt,
      panelFt: panelFt,
      bays: bays,
      panels: panels,
      posts: posts,
      gates: hasGate ? 1 : 0,
      coveredFt: coveredFt,
      overrunFt: round2(Math.max(0, coveredFt - lengthFt)),
      concreteBags: posts * 2
    };
  }

  function paint(input) {
    var lengthFt = num(input.lengthFt);
    var widthFt = num(input.widthFt);
    var heightFt = num(input.heightFt);
    var doors = num(input.doors);
    var windows = num(input.windows);
    var otherSqFt = numOrZero(input.otherSqFt);
    var coats = num(input.coats);
    var coverage = num(input.coverage);
    var ceiling = !!input.ceiling;

    if (!isPositive(lengthFt) || !isPositive(widthFt)) {
      return fail("Enter a room length and width greater than 0.");
    }
    if (!isPositive(heightFt)) {
      return fail("Enter a wall height greater than 0.");
    }
    if (lengthFt > 500 || widthFt > 500 || heightFt > 40) {
      return fail("Those dimensions are too large for one room. Split the job.");
    }
    if (!isWhole(doors, 100) || !isWhole(windows, 100)) {
      return fail("Doors and windows should be whole numbers from 0 to 100.");
    }
    if (!Number.isFinite(otherSqFt) || otherSqFt < 0 || otherSqFt > 100000) {
      return fail("Other openings should be 0 or a positive area in square feet.");
    }
    if (!isPositive(coats) || coats > 5) {
      return fail("Enter between 1 and 5 coats.");
    }
    if (!isPositive(coverage) || coverage < 50 || coverage > 1000) {
      return fail("Coverage should be between 50 and 1,000 sq ft per gallon.");
    }

    var grossWall = 2 * (lengthFt + widthFt) * heightFt;
    var openings = doors * 20 + windows * 15 + otherSqFt;
    var wall = grossWall - openings;
    var warn = "";
    if (wall < 0) {
      wall = 0;
      warn = "Openings add up to more than the wall area, so wall paint is set to 0. Check the counts.";
    }
    var ceilingSq = ceiling ? lengthFt * widthFt : 0;
    var area = wall + ceilingSq;
    var gallons = area <= 0 || coverage <= 0 ? 0 : (area * coats) / coverage;
    var quarts = gallons <= 0 ? 0 : Math.max(1, safeCeil(gallons * 4));

    return {
      ok: true,
      wallSqFt: round2(wall),
      ceilingSqFt: round2(ceilingSq),
      areaSqFt: round2(area),
      coats: coats,
      coverage: coverage,
      gallonsExact: gallons,
      quarts: quarts,
      buyGal: Math.floor(quarts / 4),
      buyQt: quarts % 4,
      warn: warn
    };
  }

  function deck(input) {
    var lengthFt = num(input.lengthFt);
    var widthFt = num(input.widthFt);
    var boardWidthIn = num(input.boardWidthIn);
    var boardLengthFt = num(input.boardLengthFt);
    var gapIn = num(input.gapIn);
    var wastePct = num(input.wastePct);

    if (!isPositive(lengthFt) || !isPositive(widthFt)) {
      return fail("Enter a deck length and width greater than 0.");
    }
    if (lengthFt > 500 || widthFt > 500) {
      return fail("That deck is too large for one list. Split it into sections.");
    }
    if (!isPositive(boardWidthIn) || boardWidthIn > 12) {
      return fail("Board width should be between 0 and 12 inches.");
    }
    if (!isPositive(boardLengthFt) || boardLengthFt > 24) {
      return fail("Pick a stock board length of 24 ft or less.");
    }
    if (!Number.isFinite(gapIn) || gapIn < 0 || gapIn > 1) {
      return fail("Gap should be between 0 and 1 inch.");
    }
    if (!Number.isFinite(wastePct) || wastePct < 0 || wastePct > 50) {
      return fail("Waste should be between 0 and 50%.");
    }

    var widthIn = widthFt * 12;
    var across = safeCeil((widthIn + gapIn) / (boardWidthIn + gapIn));
    var perRow = safeCeil(lengthFt / boardLengthFt);
    var raw = across * perRow;
    var buy = safeCeil(raw * (1 + wastePct / 100));
    var leftoverFt = round2(Math.max(0, perRow * boardLengthFt - lengthFt));

    return {
      ok: true,
      lengthFt: lengthFt,
      widthFt: widthFt,
      boardWidthIn: boardWidthIn,
      boardLengthFt: boardLengthFt,
      across: across,
      perRow: perRow,
      raw: raw,
      buy: buy,
      wastePct: wastePct,
      leftoverFt: leftoverFt
    };
  }

  return {
    fence: fence,
    paint: paint,
    deck: deck,
    formatNum: formatNum
  };
});
