/* Small DOM helpers shared by the calculator pages. */
(function (root) {
  function clear(node) {
    while (node && node.firstChild) node.removeChild(node.firstChild);
  }

  function renderWhy(container, rows) {
    clear(container);
    if (!rows || !rows.length) return;
    var ul = document.createElement("ul");
    ul.className = "why-list";
    rows.forEach(function (row) {
      var li = document.createElement("li");
      var k = document.createElement("span");
      k.className = "why-k";
      k.textContent = row.k;
      var v = document.createElement("span");
      v.textContent = row.v;
      li.appendChild(k);
      li.appendChild(v);
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }

  function renderGroups(container, groups) {
    clear(container);
    (groups || []).forEach(function (group) {
      var sec = document.createElement("section");
      sec.className = "shop-group";
      var h = document.createElement("h3");
      h.textContent = group.name;
      var ul = document.createElement("ul");
      ul.className = "shop-list";
      group.items.forEach(function (text) {
        var li = document.createElement("li");
        li.textContent = text;
        ul.appendChild(li);
      });
      sec.appendChild(h);
      sec.appendChild(ul);
      container.appendChild(sec);
    });
  }

  function renderHow(container, paragraphs) {
    clear(container);
    (paragraphs || []).forEach(function (text) {
      var p = document.createElement("p");
      p.textContent = text;
      container.appendChild(p);
    });
  }

  function renderPending(container, names) {
    clear(container);
    if (!names || !names.length) return;
    var ul = document.createElement("ul");
    ul.className = "pending-links";
    names.forEach(function (name) {
      var li = document.createElement("li");
      var label = document.createElement("span");
      label.textContent = name;
      var tag = document.createElement("span");
      tag.className = "pending-tag";
      tag.textContent = "Link pending";
      li.appendChild(label);
      li.appendChild(tag);
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }

  function toPlainText(title, metaLines, groups, why, notes) {
    var lines = [title, ""];
    (metaLines || []).forEach(function (line) { lines.push(line); });
    lines.push("");
    (groups || []).forEach(function (group) {
      lines.push(group.name);
      group.items.forEach(function (item) { lines.push("- " + item); });
      lines.push("");
    });
    if (why && why.length) {
      lines.push("Why these counts");
      why.forEach(function (row) { lines.push("- " + row.k + ": " + row.v); });
      lines.push("");
    }
    (notes || []).forEach(function (note) { lines.push(note); });
    return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  }

  function setupScenes(container, scenes, onPick) {
    clear(container);
    function setPressed(id) {
      var buttons = container.querySelectorAll("button");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].setAttribute("aria-pressed", buttons[i].getAttribute("data-scene") === id ? "true" : "false");
      }
    }
    scenes.forEach(function (scene) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.setAttribute("data-scene", scene.id);
      btn.setAttribute("aria-pressed", "false");
      btn.textContent = scene.label;
      btn.addEventListener("click", function () {
        setPressed(scene.id);
        onPick(scene);
      });
      container.appendChild(btn);
    });
    return {
      press: setPressed,
      clear: function () { setPressed(""); }
    };
  }

  function bindPrint(button, howEl) {
    var wasOpen = false;
    window.addEventListener("beforeprint", function () {
      if (!howEl) return;
      wasOpen = howEl.open;
      howEl.open = true;
    });
    window.addEventListener("afterprint", function () {
      if (!howEl) return;
      howEl.open = wasOpen;
    });
    button.addEventListener("click", function () {
      if (button.disabled) return;
      window.print();
    });
  }

  function bindCopy(button, statusEl, getText) {
    button.addEventListener("click", function () {
      var text = getText();
      if (!text || button.disabled) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          statusEl.textContent = "Shopping list copied.";
        }).catch(function () {
          statusEl.textContent = "Could not copy — select the list and copy manually.";
        });
      } else {
        statusEl.textContent = "Clipboard unavailable — select the list and copy manually.";
      }
    });
  }

  root.HFMUI = {
    clear: clear,
    renderWhy: renderWhy,
    renderGroups: renderGroups,
    renderHow: renderHow,
    renderPending: renderPending,
    toPlainText: toPlainText,
    setupScenes: setupScenes,
    bindPrint: bindPrint,
    bindCopy: bindCopy
  };
})(typeof window !== "undefined" ? window : globalThis);
