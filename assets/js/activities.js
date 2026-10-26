/* Data Center desde 0 — Interactive labs (vanilla JS) */
window.Activities = (function () {
  "use strict";

  var cleanups = [];

  function tr(lang, key, vars) {
    var dict = (window.I18N && window.I18N[lang]) || window.I18N.en;
    var value = dict[key] != null ? dict[key] : key;
    if (typeof value !== "string") return value;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        value = value.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]);
      });
    }
    return value;
  }

  function numberLocale(lang) {
    return ({ en: "en-US", es: "es-ES", it: "it-IT" })[lang] || "en-US";
  }

  function fmt(lang, value, digits) {
    try {
      return new Intl.NumberFormat(numberLocale(lang), { maximumFractionDigits: digits == null ? 1 : digits }).format(value);
    } catch (e) {
      return String(value);
    }
  }

  function onCleanup(fn) { cleanups.push(fn); }

  function cleanupAll() {
    while (cleanups.length) {
      try { cleanups.pop()(); } catch (e) { /* noop */ }
    }
  }

  function node(id, label, sub, cls) {
    return '<div class="flow-node ' + (cls || "") + '" data-node="' + id + '">' +
      '<span class="dot"></span><strong>' + label + '</strong><small>' + sub + '</small></div>';
  }

  /* ------------------------------------------------------------ */
  /* 1. Inside the box                                            */
  /* ------------------------------------------------------------ */
  function renderLayers(mount, module, lang) {
    var layers = tr(lang, "act1Layers");
    var icons = ["AC", "\u0394T", "CTL"];
    var keys = ["electrical", "mechanical", "control"];
    var html = '<div class="layers">';
    layers.forEach(function (layer, i) {
      html += '<button type="button" class="layer" data-layer="' + keys[i] + '" aria-expanded="false">' +
        '<span class="layer-ico">' + icons[i] + '</span>' +
        '<span class="layer-main"><strong>' + layer.name + '</strong><span>' + layer.sub + '</span></span>' +
        '<span class="layer-toggle" aria-hidden="true">+</span>' +
        '<span class="layer-detail">' + layer.detail + '</span></button>';
    });
    html += '</div><div class="result-box ok"><span class="big">' + tr(lang, "act1Status") + '</span></div>';
    mount.innerHTML = html;
    mount.querySelectorAll(".layer").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var open = btn.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  /* ------------------------------------------------------------ */
  /* 2. Power flow                                                */
  /* ------------------------------------------------------------ */
  function renderPowerflow(mount, module, lang) {
    var nodeDefs = [
      ["utility", "Utility", "GRID"],
      ["transmission", "Transmission", "HV"],
      ["switchgear", "Switchgear", "IN"],
      ["transformer", "Transformer", "480 V"],
      ["generator", "Generator / ATS", "60 s"],
      ["ups", "UPS", "BATT"],
      ["upssb", "UPS SB", "PROT"],
      ["pdu", "PDU", "208/415 V"],
      ["rpp", "RPP", "BR"],
      ["rpdu", "rPDU", "RACK"],
      ["servers", "Servers", "IT"]
    ];
    function row(ids) {
      return '<div class="flow-row">' + ids.map(function (id) {
        var def = nodeDefs.filter(function (n) { return n[0] === id; })[0];
        return node(def[0], def[1], def[2]);
      }).join('<span class="flow-arrow" aria-hidden="true">\u2192</span>') + '</div>';
    }
    mount.innerHTML =
      '<div class="flow">' +
        '<div class="flow-divider">' + tr(lang, "pfHvMv") + '</div>' + row(["utility", "transmission", "switchgear", "transformer"]) +
        '<div class="flow-divider">' + tr(lang, "pfBackup") + '</div>' + row(["generator", "ups", "upssb", "pdu"]) +
        row(["rpp", "rpdu", "servers"]) +
      '</div>' +
      '<div class="hero-actions" style="margin-top:14px">' +
        '<button type="button" class="btn danger" id="pfCut">' + tr(lang, "act2Cut") + '</button>' +
        '<button type="button" class="btn" id="pfRestore" disabled>' + tr(lang, "act2Restore") + '</button>' +
        '<span class="badge" id="pfUpsBadge" style="display:none">' + tr(lang, "act2Ups") + '</span>' +
        '<span class="badge ok" id="pfGenBadge" style="display:none">' + tr(lang, "act2Gen") + '</span>' +
      '</div>' +
      '<div class="result-box" id="pfStatus">' + tr(lang, "act2Idle") + '</div>' +
      '<p class="hint" style="margin-top:8px">' + tr(lang, "act2Note") + '</p>';

    var state = { grid: true, gen: false, seconds: 60, mode: "idle" };
    var timer = null;
    var cut = mount.querySelector("#pfCut");
    var restore = mount.querySelector("#pfRestore");
    var status = mount.querySelector("#pfStatus");
    var upsBadge = mount.querySelector("#pfUpsBadge");
    var genBadge = mount.querySelector("#pfGenBadge");

    function setNode(id, cls) {
      var el = mount.querySelector('[data-node="' + id + '"]');
      if (!el) return;
      el.classList.remove("active", "warn", "dead");
      if (cls) el.classList.add(cls);
    }

    function update() {
      var gridUp = state.grid;
      ["utility", "transmission", "switchgear", "transformer"].forEach(function (id) {
        setNode(id, gridUp ? "active" : "dead");
      });
      if (gridUp) {
        setNode("generator", "");
        ["ups", "upssb", "pdu", "rpp", "rpdu", "servers"].forEach(function (id) { setNode(id, "active"); });
      } else if (state.gen) {
        setNode("generator", "active");
        ["ups", "upssb", "pdu", "rpp", "rpdu", "servers"].forEach(function (id) { setNode(id, "active"); });
      } else {
        setNode("generator", "warn");
        ["ups", "upssb", "pdu", "rpp", "rpdu", "servers"].forEach(function (id) { setNode(id, "active"); });
      }
      upsBadge.style.display = !gridUp && !state.gen ? "inline-flex" : "none";
      genBadge.style.display = state.gen ? "inline-flex" : "none";
      cut.disabled = !gridUp;
      restore.disabled = gridUp;
      status.className = "result-box " + (!gridUp && state.gen ? "ok" : (!gridUp ? "warn" : ""));
      if (gridUp) status.textContent = tr(lang, "act2Idle");
      else if (state.gen) status.textContent = tr(lang, "act2GenOnline");
      else status.textContent = tr(lang, "act2Transition", { s: state.seconds });
    }

    function stopTimer() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    onCleanup(stopTimer);

    cut.addEventListener("click", function () {
      if (!state.grid) return;
      state.grid = false;
      state.gen = false;
      state.mode = "transition";
      state.seconds = 60;
      update();
      stopTimer();
      timer = setInterval(function () {
        state.seconds -= 1;
        if (state.seconds <= 0) {
          state.seconds = 0;
          state.gen = true;
          state.mode = "online";
          stopTimer();
        }
        update();
      }, 700);
    });

    restore.addEventListener("click", function () {
      stopTimer();
      state.grid = true;
      state.gen = false;
      state.seconds = 60;
      state.mode = "idle";
      update();
      status.textContent = tr(lang, "act2Restored");
      setTimeout(function () { if (mount.isConnected) status.textContent = tr(lang, "act2Idle"); }, 2600);
    });

    update();
  }

  /* ------------------------------------------------------------ */
  /* 3. Cooling matrix                                            */
  /* ------------------------------------------------------------ */
  function renderCooling(mount, module, lang) {
    mount.innerHTML =
      '<div class="sim-grid two">' +
        '<div class="sim-panel">' +
          '<div class="field"><label for="cwRacks">' + tr(lang, "act3Racks") + '</label>' +
            '<div class="range-row"><input type="range" id="cwRacks" min="1" max="400" step="1" value="40"><output id="cwRacksOut">40</output></div></div>' +
          '<div class="field"><label for="cwDensity">' + tr(lang, "act3Density") + '</label>' +
            '<div class="range-row"><input type="range" id="cwDensity" min="1" max="150" step="1" value="18"><output id="cwDensityOut">18</output></div></div>' +
          '<div class="field"><label for="cwClimate">' + tr(lang, "act3Climate") + '</label>' +
            '<select class="select" id="cwClimate">' +
              '<option value="cold">' + tr(lang, "act3Cold") + '</option>' +
              '<option value="temperate" selected>' + tr(lang, "act3Temperate") + '</option>' +
              '<option value="hot">' + tr(lang, "act3Hot") + '</option>' +
              '<option value="arid">' + tr(lang, "act3Arid") + '</option>' +
            '</select></div>' +
        '</div>' +
        '<div class="sim-panel" style="display:flex;flex-direction:column;justify-content:center;align-items:center">' +
          '<div class="ring" id="cwRing" style="--p:15%"><div class="ring-center"><strong id="cwRingVal">18</strong><span>kW / rack</span></div></div>' +
          '<div class="metric-grid" style="width:100%;margin-top:14px">' +
            '<div class="metric"><small>' + tr(lang, "act3Total") + '</small><strong id="cwTotal">720<span class="unit">kW</span></strong></div>' +
            '<div class="metric"><small>' + tr(lang, "act3Rec") + '</small><strong id="cwRec" style="font-size:13px">Aire close-coupled</strong></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="result-box ok" style="margin-top:14px"><span class="big" id="cwTitle"></span><span id="cwNote"></span></div>';

    var racks = mount.querySelector("#cwRacks");
    var density = mount.querySelector("#cwDensity");
    var climate = mount.querySelector("#cwClimate");
    var racksOut = mount.querySelector("#cwRacksOut");
    var densityOut = mount.querySelector("#cwDensityOut");
    var ring = mount.querySelector("#cwRing");
    var ringVal = mount.querySelector("#cwRingVal");
    var total = mount.querySelector("#cwTotal");
    var rec = mount.querySelector("#cwRec");
    var title = mount.querySelector("#cwTitle");
    var note = mount.querySelector("#cwNote");

    function update() {
      var r = Number(racks.value);
      var d = Number(density.value);
      var c = climate.value;
      racksOut.value = r;
      densityOut.value = d;
      ringVal.textContent = d;
      total.innerHTML = fmt(lang, r * d, 0) + '<span class="unit">kW</span>';
      ring.style.setProperty("--p", Math.min(100, Math.round(d / 120 * 100)) + "%");

      var name, text;
      if (d <= 5) { name = tr(lang, "act3Room"); text = tr(lang, "act3NoteRoom"); }
      else if (d <= 20) { name = tr(lang, "act3Close"); text = tr(lang, "act3NoteClose"); }
      else if (d <= 120) { name = tr(lang, "act3Direct"); text = tr(lang, "act3NoteDirect"); }
      else { name = tr(lang, "act3Immersion"); text = tr(lang, "act3NoteImmersion"); }

      rec.textContent = name;
      title.textContent = name;
      note.textContent = text + (c === "arid" ? " " + tr(lang, "act3AridNote") : "");
    }

    racks.addEventListener("input", update);
    density.addEventListener("input", update);
    climate.addEventListener("change", update);
    update();
  }

  /* ------------------------------------------------------------ */
  /* 4. Tier simulator                                            */
  /* ------------------------------------------------------------ */
  function renderTiers(mount, module, lang) {
    var schemes = {
      "N": { total: 4, tol: 0, uptime: "99.671%" },
      "N+1": { total: 5, tol: 1, uptime: "99.749%" },
      "N+2": { total: 6, tol: 2, uptime: "99.900%" },
      "2N": { total: 8, tol: 4, uptime: "99.995%" },
      "2(N+1)": { total: 10, tol: 5, uptime: "99.995%+" },
      "3N/2": { total: 6, tol: 2, uptime: "99.990%" }
    };
    var required = 4;
    mount.innerHTML =
      '<div class="sim-grid two">' +
        '<div class="sim-panel">' +
          '<div class="field"><label for="tierScheme">' + tr(lang, "act4Scheme") + '</label>' +
            '<select class="select" id="tierScheme">' +
              Object.keys(schemes).map(function (s) { return '<option value="' + s + '">' + s + '</option>'; }).join("") +
            '</select></div>' +
          '<div class="hero-actions" style="margin-top:6px">' +
            '<button type="button" class="btn danger" id="tierFail">' + tr(lang, "act4Fail") + '</button>' +
            '<button type="button" class="btn ghost" id="tierReset">' + tr(lang, "act4Reset") + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="sim-panel">' +
          '<div class="metric-grid">' +
            '<div class="metric"><small>' + tr(lang, "act4Required") + '</small><strong id="tierN">4</strong></div>' +
            '<div class="metric"><small>' + tr(lang, "act4Available") + '</small><strong id="tierAvail">4</strong></div>' +
            '<div class="metric"><small>' + tr(lang, "act4Spare") + '</small><strong id="tierSpare">0</strong></div>' +
            '<div class="metric"><small>' + tr(lang, "act4Uptime") + '</small><strong id="tierUptime" style="font-size:14px">99.671%</strong></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="tier-units" id="tierUnits" style="margin-top:14px"></div>' +
      '<div class="result-box" id="tierStatus" style="margin-top:12px"></div>' +
      '<p class="hint" style="margin-top:8px">' + tr(lang, "act4Note") + '</p>';

    var select = mount.querySelector("#tierScheme");
    var fail = mount.querySelector("#tierFail");
    var reset = mount.querySelector("#tierReset");
    var units = mount.querySelector("#tierUnits");
    var status = mount.querySelector("#tierStatus");
    var avail = mount.querySelector("#tierAvail");
    var spare = mount.querySelector("#tierSpare");
    var uptime = mount.querySelector("#tierUptime");
    var failed = new Set();

    function current() { return schemes[select.value]; }

    function update() {
      var cfg = current();
      var n = cfg.total;
      var alive = n - failed.size;
      units.innerHTML = "";
      for (var i = 0; i < n; i++) {
        var div = document.createElement("div");
        div.className = "unit" + (i >= required ? " extra" : "") + (failed.has(i) ? " failed" : "");
        div.textContent = i < required ? "N" : "+";
        units.appendChild(div);
      }
      avail.textContent = alive;
      var sp = Math.max(0, alive - required);
      spare.textContent = sp;
      uptime.textContent = cfg.uptime;
      avail.className = alive >= required ? "good" : "bad";
      spare.className = sp > 0 ? "good" : "warn";
      var ok = failed.size <= cfg.tol;
      status.className = "result-box " + (ok ? "ok" : "bad");
      status.innerHTML = '<span class="big">' + (ok ? tr(lang, "act4Survives") : tr(lang, "act4Fails")) + "</span>" +
        (ok ? tr(lang, "act4SpareNote", { n: sp }) : tr(lang, "act4FailNote", { n: failed.size, t: cfg.tol }));
      fail.disabled = failed.size >= n;
    }

    select.addEventListener("change", function () { failed.clear(); update(); });
    fail.addEventListener("click", function () {
      var cfg = current();
      var candidates = [];
      for (var i = 0; i < cfg.total; i++) if (!failed.has(i)) candidates.push(i);
      if (!candidates.length) return;
      failed.add(candidates[Math.floor(Math.random() * candidates.length)]);
      update();
    });
    reset.addEventListener("click", function () { failed.clear(); update(); });
    update();
  }

  /* ------------------------------------------------------------ */
  /* 5. Double conversion UPS                                     */
  /* ------------------------------------------------------------ */
  function renderUps(mount, module, lang) {
    mount.innerHTML =
      '<div class="sim-grid two">' +
        '<div class="sim-panel">' +
          '<div class="switch-row"><span>' + tr(lang, "act5Mains") + '</span>' +
            '<label class="switch"><input type="checkbox" id="upsMains" checked><i></i></label></div>' +
          '<div class="switch-row"><span>' + tr(lang, "act5Battery") + '</span>' +
            '<label class="switch"><input type="checkbox" id="upsBatt" checked><i></i></label></div>' +
          '<div class="switch-row"><span>' + tr(lang, "act5Bypass") + '</span>' +
            '<label class="switch"><input type="checkbox" id="upsBypass"><i></i></label></div>' +
        '</div>' +
        '<div class="sim-panel">' +
          '<div class="ups-grid">' +
            '<div class="ups-box" id="ubMains"><strong>Utility</strong><small>AC in</small></div>' +
            '<div class="ups-box" id="ubRect"><strong>Rectifier</strong><small>AC / DC</small></div>' +
            '<div class="ups-box" id="ubInv"><strong>Inverter</strong><small>DC / AC</small></div>' +
            '<div class="ups-box" id="ubLoad"><strong>IT load</strong><small>servers</small></div>' +
          '</div>' +
          '<div class="ups-wire" id="uwMain"></div>' +
          '<div class="ups-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">' +
            '<div class="ups-box" id="ubBatt"><strong>Batteries</strong><small>DC bank</small></div>' +
            '<div class="ups-box" id="ubOut"><strong>UPS SB</strong><small>protected</small></div>' +
          '</div>' +
          '<div class="ups-bypass" id="ubBypass" style="margin-top:9px"><span>' + tr(lang, "act5BypassPath") + '</span><b id="ubBypassState">OFF</b></div>' +
        '</div>' +
      '</div>' +
      '<div class="result-box" id="upsStatus" style="margin-top:12px"></div>' +
      '<p class="hint" id="upsWarn" style="margin-top:8px;display:none">' + tr(lang, "act5Warn") + '</p>';

    var mains = mount.querySelector("#upsMains");
    var batt = mount.querySelector("#upsBatt");
    var bypass = mount.querySelector("#upsBypass");
    var bMains = mount.querySelector("#ubMains");
    var bRect = mount.querySelector("#ubRect");
    var bInv = mount.querySelector("#ubInv");
    var bLoad = mount.querySelector("#ubLoad");
    var bBatt = mount.querySelector("#ubBatt");
    var bOut = mount.querySelector("#ubOut");
    var wire = mount.querySelector("#uwMain");
    var bypassRow = mount.querySelector("#ubBypass");
    var bypassState = mount.querySelector("#ubBypassState");
    var status = mount.querySelector("#upsStatus");
    var warn = mount.querySelector("#upsWarn");

    function active(el, cls) {
      el.classList.remove("active", "hot");
      if (cls) el.classList.add(cls);
    }

    function update() {
      var m = mains.checked, b = batt.checked, by = bypass.checked;
      var bypassLive = by && m;
      var rect = m && !by;
      var inv = !by && (m || b);
      var load = bypassLive || (!by && (m || b));
      var battCharge = m && !by;
      var battDischarge = !m && b && !by;

      active(bMains, m ? "active" : "");
      active(bRect, rect ? "active" : "");
      active(bInv, inv ? "active" : "");
      active(bLoad, load ? "active" : "");
      active(bOut, load ? "active" : "");
      active(bBatt, battDischarge ? "hot" : (battCharge ? "active" : ""));
      wire.classList.toggle("live", load);
      bypassRow.classList.toggle("live", bypassLive);
      bypassState.textContent = bypassLive ? "ON" : "OFF";
      warn.style.display = by ? "block" : "none";

      if (bypassLive) {
        status.className = "result-box warn";
        status.textContent = tr(lang, "act5StatusBypass");
      } else if (!m && b && !by) {
        status.className = "result-box ok";
        status.textContent = tr(lang, "act5StatusBattery");
      } else if (m && !by) {
        status.className = "result-box ok";
        status.textContent = tr(lang, "act5StatusNormal");
      } else {
        status.className = "result-box bad";
        status.textContent = tr(lang, "act5StatusDead");
      }
    }

    [mains, batt, bypass].forEach(function (input) { input.addEventListener("change", update); });
    update();
  }

  /* ------------------------------------------------------------ */
  /* 6. Oscilloscope                                              */
  /* ------------------------------------------------------------ */
  function renderScope(mount, module, lang) {
    mount.innerHTML =
      '<div class="sim-grid two">' +
        '<div class="sim-panel">' +
          '<div class="switch-row"><span>' + tr(lang, "act6Filter") + '</span>' +
            '<label class="switch"><input type="checkbox" id="scopeFilter" checked><i></i></label></div>' +
          '<div class="field" style="margin-top:10px"><label for="scopeDist">' + tr(lang, "act6Distortion") + '</label>' +
            '<div class="range-row"><input type="range" id="scopeDist" min="0" max="30" step="1" value="9"><output id="scopeDistOut">9%</output></div></div>' +
          '<div class="hero-actions"><button type="button" class="btn danger" id="scopeFault">' + tr(lang, "act6Fault") + '</button></div>' +
        '</div>' +
        '<div class="sim-panel">' +
          '<div class="scope"><canvas id="scopeCanvas"></canvas>' +
            '<div class="scope-legend"><span><i style="background:#fb7185"></i>' + tr(lang, "act6Dirty") + '</span>' +
            '<span><i style="background:#2dd4bf"></i>' + tr(lang, "act6Clean") + '</span></div></div>' +
          '<div class="metric-grid" style="margin-top:10px">' +
            '<div class="metric"><small>' + tr(lang, "act6Thd") + '</small><strong id="scopeThdIn">9%</strong></div>' +
            '<div class="metric"><small>' + tr(lang, "act6OutThd") + '</small><strong id="scopeThdOut">1%</strong></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="result-box" id="scopeStatus" style="margin-top:12px"></div>';

    var filter = mount.querySelector("#scopeFilter");
    var dist = mount.querySelector("#scopeDist");
    var distOut = mount.querySelector("#scopeDistOut");
    var faultBtn = mount.querySelector("#scopeFault");
    var canvas = mount.querySelector("#scopeCanvas");
    var thdIn = mount.querySelector("#scopeThdIn");
    var thdOut = mount.querySelector("#scopeThdOut");
    var status = mount.querySelector("#scopeStatus");
    var ctx = canvas.getContext("2d");
    var phase = 0;
    var faultUntil = 0;
    var raf = 0;
    var dpr = 1;

    function readout() {
      var d = Number(dist.value);
      var faulting = performance.now() < faultUntil;
      var thd = d * 2.4 + (faulting ? 7 : 0);
      var out = filter.checked ? 1.2 : thd * 0.9;
      distOut.value = d + "%";
      thdIn.textContent = fmt(lang, thd, 1) + "%";
      thdOut.textContent = fmt(lang, out, 1) + "%";
      thdOut.className = filter.checked ? "good" : "bad";
      status.className = "result-box " + (filter.checked ? "ok" : "bad");
      status.textContent = filter.checked ? tr(lang, "act6StatusClean") : tr(lang, "act6StatusDirty");
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var w = Math.max(320, rect.width);
      var h = Math.max(180, rect.height || 210);
      dpr = window.devicePixelRatio || 1;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      return { w: w, h: h };
    }

    function drawWave(w, h, amp, base, color, glitch, faulting) {
      ctx.beginPath();
      for (var x = 0; x <= w; x += 1) {
        var p = x / w * Math.PI * 8 + phase;
        var y = Math.sin(p) * amp;
        if (glitch > 0) {
          y += Math.sin(p * 3 + 1.2) * amp * 0.18 * glitch;
          y += Math.sin(p * 7 - 0.4) * amp * 0.09 * glitch;
          if (faulting) {
            y += Math.sin(p * 17) * amp * 0.35;
            if (x % 61 < 3) y += amp * 0.5;
          }
        }
        if (x === 0) ctx.moveTo(x, base + y);
        else ctx.lineTo(x, base + y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;
      ctx.shadowBlur = 9;
      ctx.shadowColor = color;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    function frame() {
      var size = resize();
      var w = size.w, h = size.h;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#051019";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(100,180,220,.10)";
      ctx.lineWidth = 1;
      for (var gx = 0; gx < w; gx += 32) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
      for (var gy = 0; gy < h; gy += 28) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
      ctx.strokeStyle = "rgba(100,180,220,.25)";
      ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();

      var d = Number(dist.value) / 30;
      var faulting = performance.now() < faultUntil;
      var amp = h * 0.28;
      drawWave(w, h, amp, h / 2, "rgba(251,113,133,.9)", d, faulting);
      var outAmp = filter.checked ? amp * 0.92 : amp * (0.8 + d * 0.2);
      drawWave(w, h, outAmp, h / 2, "rgba(45,212,191,.95)", filter.checked ? 0 : d, filter.checked ? false : faulting);
      phase += 0.028;
      raf = requestAnimationFrame(frame);
    }

    function redrawReadout() { readout(); }

    filter.addEventListener("change", redrawReadout);
    dist.addEventListener("input", redrawReadout);
    faultBtn.addEventListener("click", function () {
      faultUntil = performance.now() + 900;
      redrawReadout();
      setTimeout(redrawReadout, 950);
    });

    onCleanup(function () { cancelAnimationFrame(raf); });
    readout();
    frame();
  }

  /* ------------------------------------------------------------ */
  /* 7. Containment                                               */
  /* ------------------------------------------------------------ */
  function renderContainment(mount, module, lang) {
    var cells = "";
    for (var i = 0; i < 6; i++) cells += '<div class="rack-cell cold" data-r="c">R' + (i + 1) + '</div>';
    cells += '<div class="aisle hot-air" style="grid-column:1/-1">' + tr(lang, "act7HotAir") + '</div>';
    for (var j = 0; j < 6; j++) cells += '<div class="rack-cell hot" data-r="h">R' + (j + 7) + '</div>';

    mount.innerHTML =
      '<div class="sim-grid two">' +
        '<div class="sim-panel">' +
          '<div class="switch-row"><span>' + tr(lang, "act7Cold") + '</span>' +
            '<label class="switch"><input type="checkbox" id="acCold" checked><i></i></label></div>' +
          '<div class="switch-row"><span>' + tr(lang, "act7Hot") + '</span>' +
            '<label class="switch"><input type="checkbox" id="acHot"><i></i></label></div>' +
          '<div class="contain-tags" style="margin-top:10px">' +
            '<span class="badge info" id="acColdTag"></span><span class="badge bad" id="acHotTag"></span>' +
          '</div>' +
        '</div>' +
        '<div class="sim-panel">' +
          '<div class="aisle-map"><div class="aisle cold-air" style="grid-column:1/-1">' + tr(lang, "act7ColdAir") + '</div>' + cells + '</div>' +
          '<div class="metric-grid" style="margin-top:10px">' +
            '<div class="metric"><small>' + tr(lang, "act7Mix") + '</small><strong id="acMix">9<span class="unit">%</span></strong></div>' +
            '<div class="metric"><small>' + tr(lang, "act7Inlet") + '</small><strong id="acInlet">24<span class="unit">\u00b0C</span></strong></div>' +
            '<div class="metric"><small>' + tr(lang, "act7Fan") + '</small><strong id="acFan">82<span class="unit">%</span></strong></div>' +
            '<div class="metric"><small>' + tr(lang, "act7Eff") + '</small><strong id="acEff">78<span class="unit">%</span></strong></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="result-box" id="acStatus" style="margin-top:12px"></div>' +
      '<p class="hint" style="margin-top:8px">' + tr(lang, "act7Note") + '</p>';

    var cold = mount.querySelector("#acCold");
    var hot = mount.querySelector("#acHot");
    var coldTag = mount.querySelector("#acColdTag");
    var hotTag = mount.querySelector("#acHotTag");
    var map = mount.querySelector(".aisle-map");
    var status = mount.querySelector("#acStatus");
    var mixEl = mount.querySelector("#acMix");
    var inletEl = mount.querySelector("#acInlet");
    var fanEl = mount.querySelector("#acFan");
    var effEl = mount.querySelector("#acEff");

    function update() {
      var c = cold.checked, h = hot.checked;
      var mix, inlet, fan, eff, st;
      if (c && h) { mix = 3; inlet = 22; fan = 70; eff = 94; st = "act7StatusBoth"; }
      else if (h) { mix = 6; inlet = 23; fan = 78; eff = 88; st = "act7StatusHot"; }
      else if (c) { mix = 9; inlet = 24; fan = 82; eff = 78; st = "act7StatusCold"; }
      else { mix = 22; inlet = 32; fan = 100; eff = 54; st = "act7None"; }

      coldTag.className = "badge " + (c ? "ok" : "warn");
      coldTag.textContent = (c ? tr(lang, "act7Sealed") : tr(lang, "act7Open")) + " \u00b7 " + tr(lang, "act7ColdTag");
      hotTag.className = "badge " + (h ? "ok" : "warn");
      hotTag.textContent = (h ? tr(lang, "act7Sealed") : tr(lang, "act7Open")) + " \u00b7 " + tr(lang, "act7HotTag");
      map.querySelectorAll(".rack-cell.cold").forEach(function (el) { el.classList.toggle("mix", !c); el.classList.toggle("cold", c); });
      map.querySelectorAll(".rack-cell.hot").forEach(function (el) { el.classList.toggle("mix", !h); el.classList.toggle("hot", h); });
      mixEl.innerHTML = mix + '<span class="unit">%</span>';
      inletEl.innerHTML = inlet + '<span class="unit">\u00b0C</span>';
      fanEl.innerHTML = fan + '<span class="unit">%</span>';
      effEl.innerHTML = eff + '<span class="unit">%</span>';
      effEl.className = eff >= 88 ? "good" : (eff >= 70 ? "warn" : "bad");
      status.className = "result-box " + (eff >= 88 ? "ok" : (eff >= 70 ? "warn" : "bad"));
      status.textContent = tr(lang, st);
    }

    cold.addEventListener("change", update);
    hot.addEventListener("change", update);
    update();
  }

  /* ------------------------------------------------------------ */
  /* 8. Chilled water plant                                       */
  /* ------------------------------------------------------------ */
  function renderChilled(mount, module, lang) {
    var dots = "";
    for (var i = 0; i < 3; i++) dots += "<i></i>";
    mount.innerHTML =
      '<div class="sim-grid two">' +
        '<div class="sim-panel">' +
          '<div class="field"><label for="cwLoad">' + tr(lang, "act8Load") + '</label>' +
            '<div class="range-row"><input type="range" id="cwLoad" min="0" max="100" step="1" value="55"><output id="cwLoadOut">55%</output></div></div>' +
          '<div class="switch-row"><span>' + tr(lang, "act8Pumps") + '</span>' +
            '<label class="switch"><input type="checkbox" id="cwPump" checked><i></i></label></div>' +
          '<div class="metric-grid" style="margin-top:12px">' +
            '<div class="metric"><small>' + tr(lang, "act8Flow") + '</small><strong id="cwFlow">64<span class="unit">%</span></strong></div>' +
            '<div class="metric"><small>' + tr(lang, "act8Stage") + '</small><strong id="cwStage">2</strong></div>' +
          '</div>' +
        '</div>' +
        '<div class="sim-panel">' +
          '<div class="plant">' +
            '<div class="plant-loop" id="plCrah"><h6>' + tr(lang, "act8Crah") + '</h6><div class="pipe"><span id="pipeCrah"></span></div><p>' + tr(lang, "act8Return") + '</p></div>' +
            '<div class="plant-loop" id="plChiller"><h6>' + tr(lang, "act8Chiller") + '</h6><div class="pipe hot"><span id="pipeChiller"></span></div><div class="chiller-dots" id="chillerDots">' + dots + '</div></div>' +
            '<div class="plant-loop" id="plTower"><h6>' + tr(lang, "act8Tower") + '</h6><div class="pipe hot"><span id="pipeTower"></span></div><p>' + tr(lang, "act8Reject") + '</p></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="result-box" id="cwStatus" style="margin-top:12px"></div>' +
      '<p class="hint" style="margin-top:8px">' + tr(lang, "act8Note") + '</p>';

    var range = mount.querySelector("#cwLoad");
    var out = mount.querySelector("#cwLoadOut");
    var pump = mount.querySelector("#cwPump");
    var flow = mount.querySelector("#cwFlow");
    var stage = mount.querySelector("#cwStage");
    var status = mount.querySelector("#cwStatus");
    var pipeCrah = mount.querySelector("#pipeCrah");
    var pipeChiller = mount.querySelector("#pipeChiller");
    var pipeTower = mount.querySelector("#pipeTower");
    var dotsEls = mount.querySelectorAll("#chillerDots i");
    var loops = [mount.querySelector("#plCrah"), mount.querySelector("#plChiller"), mount.querySelector("#plTower")];

    function update() {
      var load = Number(range.value);
      var flowPct = Math.round(20 + load * 0.8);
      var chillers = load <= 0 ? 1 : Math.max(1, Math.ceil(load / 33.4));
      out.value = load + "%";
      flow.innerHTML = flowPct + '<span class="unit">%</span>';
      stage.textContent = chillers;
      pipeCrah.style.width = flowPct + "%";
      pipeChiller.style.width = Math.max(12, flowPct - 6) + "%";
      pipeTower.style.width = Math.max(10, flowPct - 10) + "%";
      dotsEls.forEach(function (dot, i) { dot.classList.toggle("on", i < chillers); });
      loops.forEach(function (loop) { loop.classList.toggle("active", load > 0); });
      var st = load < 25 ? "act8StatusIdle" : (load < 85 ? "act8StatusActive" : "act8StatusMax");
      status.className = "result-box " + (load < 25 ? "ok" : (load < 85 ? "warn" : "ok"));
      status.textContent = tr(lang, st) + (pump.checked ? "" : " " + tr(lang, "act8Pumps") + ": OFF.");
    }

    range.addEventListener("input", update);
    pump.addEventListener("change", update);
    update();
  }

  /* ------------------------------------------------------------ */
  /* 9. CRAC vs CRAH assembly                                     */
  /* ------------------------------------------------------------ */
  function renderAssembly(mount, module, lang) {
    var parts = [
      { key: "compressor", type: "crac" },
      { key: "refrigerant", type: "crac" },
      { key: "expansion", type: "crac" },
      { key: "condenser", type: "crac" },
      { key: "chilledCoil", type: "crah" },
      { key: "waterValve", type: "crah" },
      { key: "fans", type: "both" },
      { key: "filters", type: "both" },
      { key: "drain", type: "crac" }
    ];
    var labels = {};
    parts.forEach(function (p) { labels[p.key] = tr(lang, "act9" + p.key.charAt(0).toUpperCase() + p.key.slice(1)); });
    var placed = new Set();
    var type = "crac";

    mount.innerHTML =
      '<div class="sim-grid two">' +
        '<div class="sim-panel">' +
          '<div class="field"><label for="asmType">' + tr(lang, "act9Type") + '</label>' +
            '<select class="select" id="asmType">' +
              '<option value="crac">' + tr(lang, "act9Crac") + '</option>' +
              '<option value="crah">' + tr(lang, "act9Crah") + '</option>' +
            '</select></div>' +
          '<h5 style="margin:12px 0 8px;font-size:10px;letter-spacing:.1em;color:var(--muted)">' + tr(lang, "act9Pool") + '</h5>' +
          '<div class="part-pool" id="asmPool"></div>' +
          '<div class="hero-actions" style="margin-top:12px">' +
            '<button type="button" class="btn primary" id="asmCheck">' + tr(lang, "act9Check") + '</button>' +
            '<button type="button" class="btn ghost" id="asmReset">' + tr(lang, "act9Reset") + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="sim-panel">' +
          '<h5 style="font-size:10px;letter-spacing:.1em;color:var(--muted);margin-bottom:8px">' + tr(lang, "act9Bay") + '</h5>' +
          '<div class="chassis" id="asmBay"><div class="slots" id="asmSlots"></div></div>' +
        '</div>' +
      '</div>' +
      '<div class="result-box" id="asmStatus" style="margin-top:12px">' + tr(lang, "act9Hint") + '</div>';

    var typeSel = mount.querySelector("#asmType");
    var pool = mount.querySelector("#asmPool");
    var bay = mount.querySelector("#asmBay");
    var slots = mount.querySelector("#asmSlots");
    var status = mount.querySelector("#asmStatus");
    var check = mount.querySelector("#asmCheck");
    var reset = mount.querySelector("#asmReset");

    function targetSet() {
      var set = new Set();
      parts.forEach(function (p) {
        if (p.type === type || p.type === "both") set.add(p.key);
      });
      return set;
    }

    function renderPool() {
      pool.innerHTML = "";
      parts.forEach(function (p) {
        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "part" + (placed.has(p.key) ? " used" : "");
        chip.textContent = labels[p.key];
        chip.draggable = true;
        chip.dataset.key = p.key;
        chip.addEventListener("click", function () { addComponent(p.key); });
        chip.addEventListener("dragstart", function (ev) {
          ev.dataTransfer.setData("text/plain", p.key);
          ev.dataTransfer.effectAllowed = "copy";
        });
        pool.appendChild(chip);
      });
    }

    function renderSlots() {
      slots.innerHTML = "";
      placed.forEach(function (key) {
        var slot = document.createElement("span");
        slot.className = "slot";
        slot.textContent = labels[key];
        slots.appendChild(slot);
      });
      var target = targetSet();
      var complete = placed.size === target.size;
      bay.classList.toggle("ok", complete);
    }

    function setStatus(text, kind) {
      status.className = "result-box " + (kind || "");
      status.textContent = text;
    }

    function addComponent(key) {
      var target = targetSet();
      if (placed.has(key)) return;
      if (!target.has(key)) {
        setStatus(tr(lang, "act9Wrong"), "bad");
        return;
      }
      placed.add(key);
      renderPool();
      renderSlots();
      if (placed.size === target.size) {
        setStatus(tr(lang, "act9Complete", { n: placed.size }), "ok");
      } else {
        setStatus(tr(lang, "act9Correct") + " (" + placed.size + "/" + target.size + ")", "ok");
      }
    }

    bay.addEventListener("dragover", function (ev) {
      ev.preventDefault();
      bay.classList.add("drag");
    });
    bay.addEventListener("dragleave", function () { bay.classList.remove("drag"); });
    bay.addEventListener("drop", function (ev) {
      ev.preventDefault();
      bay.classList.remove("drag");
      var key = ev.dataTransfer.getData("text/plain");
      if (key) addComponent(key);
    });

    typeSel.addEventListener("change", function () {
      type = typeSel.value;
      placed.clear();
      renderPool();
      renderSlots();
      setStatus(tr(lang, "act9Hint"), "");
    });
    reset.addEventListener("click", function () {
      placed.clear();
      renderPool();
      renderSlots();
      setStatus(tr(lang, "act9Hint"), "");
    });
    check.addEventListener("click", function () {
      var target = targetSet();
      if (placed.size === target.size) {
        setStatus(tr(lang, "act9Complete", { n: placed.size }), "ok");
      } else {
        setStatus(tr(lang, "act9Wrong") + " (" + placed.size + "/" + target.size + ")", "warn");
      }
    });

    renderPool();
    renderSlots();
  }

  /* ------------------------------------------------------------ */
  /* 10. Eco calculator                                           */
  /* ------------------------------------------------------------ */
  function renderEco(mount, module, lang) {
    var presets = {
      iceland: { factor: 0.05, power: 0.10, water: 0.002 },
      dubai: { factor: 1.0, power: 0.09, water: 0.0045 },
      frankfurt: { factor: 0.45, power: 0.28, water: 0.004 },
      singapore: { factor: 0.95, power: 0.22, water: 0.005 },
      chile: { factor: 0.25, power: 0.14, water: 0.006 },
      custom: { factor: 0.55, power: 0.18, water: 0.004 }
    };
    mount.innerHTML =
      '<div class="sim-grid two">' +
        '<div class="sim-panel">' +
          '<div class="field"><label for="ecoLoc">' + tr(lang, "act10Location") + '</label>' +
            '<select class="select" id="ecoLoc">' +
              '<option value="iceland">' + tr(lang, "act10Iceland") + '</option>' +
              '<option value="dubai">' + tr(lang, "act10Dubai") + '</option>' +
              '<option value="frankfurt" selected>' + tr(lang, "act10Frankfurt") + '</option>' +
              '<option value="singapore">' + tr(lang, "act10Singapore") + '</option>' +
              '<option value="chile">' + tr(lang, "act10Chile") + '</option>' +
              '<option value="custom">' + tr(lang, "act10Custom") + '</option>' +
            '</select></div>' +
          '<div class="sim-grid two" style="gap:8px">' +
            '<div class="field"><label for="ecoRacks">' + tr(lang, "act10Racks") + '</label><input class="input" type="number" id="ecoRacks" min="1" max="2000" value="120"></div>' +
            '<div class="field"><label for="ecoDensity">' + tr(lang, "act10Density") + '</label><input class="input" type="number" id="ecoDensity" min="1" max="200" value="25"></div>' +
          '</div>' +
          '<div class="sim-grid two" style="gap:8px">' +
            '<div class="field"><label for="ecoPower">' + tr(lang, "act10Power") + ' ($/kWh)</label><input class="input" type="number" id="ecoPower" min="0" max="2" step="0.01" value="0.28"></div>' +
            '<div class="field"><label for="ecoWater">' + tr(lang, "act10Water") + ' ($/m\u00b3)</label><input class="input" type="number" id="ecoWater" min="0" max="20" step="0.0005" value="0.004"></div>' +
          '</div>' +
          '<div class="field"><label for="ecoPlant">' + tr(lang, "act10Plant") + '</label>' +
            '<select class="select" id="ecoPlant">' +
              '<option value="air">' + tr(lang, "act10Air") + '</option>' +
              '<option value="water" selected>' + tr(lang, "act10WaterC") + '</option>' +
            '</select></div>' +
        '</div>' +
        '<div class="sim-panel">' +
          '<div class="metric-grid">' +
            '<div class="metric"><small>' + tr(lang, "act10Pue") + '</small><strong id="ecoPue">1.2</strong></div>' +
            '<div class="metric"><small>' + tr(lang, "act10Wue") + '</small><strong id="ecoWue">2.1</strong></div>' +
            '<div class="metric"><small>' + tr(lang, "act10Energy") + '</small><strong id="ecoEnergy">0</strong></div>' +
            '<div class="metric"><small>' + tr(lang, "act10Cost") + '</small><strong id="ecoCost">$0</strong></div>' +
            '<div class="metric"><small>' + tr(lang, "act10WaterUse") + '</small><strong id="ecoWaterUse">0</strong></div>' +
          '</div>' +
          '<div class="eco-bars" style="margin-top:14px">' +
            '<div class="eco-bar"><span>PUE</span><div class="track"><span id="ecoPueBar"></span></div><span class="val" id="ecoPueVal">1.2</span></div>' +
            '<div class="eco-bar water"><span>WUE</span><div class="track"><span id="ecoWueBar"></span></div><span class="val" id="ecoWueVal">2.1</span></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="result-box" id="ecoStatus" style="margin-top:12px"></div>';

    var loc = mount.querySelector("#ecoLoc");
    var racks = mount.querySelector("#ecoRacks");
    var density = mount.querySelector("#ecoDensity");
    var power = mount.querySelector("#ecoPower");
    var water = mount.querySelector("#ecoWater");
    var plant = mount.querySelector("#ecoPlant");
    var pueEl = mount.querySelector("#ecoPue");
    var wueEl = mount.querySelector("#ecoWue");
    var energyEl = mount.querySelector("#ecoEnergy");
    var costEl = mount.querySelector("#ecoCost");
    var waterEl = mount.querySelector("#ecoWaterUse");
    var pueBar = mount.querySelector("#ecoPueBar");
    var wueBar = mount.querySelector("#ecoWueBar");
    var pueVal = mount.querySelector("#ecoPueVal");
    var wueVal = mount.querySelector("#ecoWueVal");
    var status = mount.querySelector("#ecoStatus");

    function update() {
      var preset = presets[loc.value] || presets.custom;
      var factor = preset.factor;
      var r = Math.max(1, Number(racks.value) || 1);
      var d = Math.max(1, Number(density.value) || 1);
      var p = Math.max(0, Number(power.value) || 0);
      var wprice = Math.max(0, Number(water.value) || 0);
      var waterCooled = plant.value === "water";
      var pue = waterCooled ? 1.12 + factor * 0.10 : 1.18 + factor * 0.22;
      var wue = waterCooled ? 0.9 + factor * 2.2 : 0.08;
      var itEnergy = r * d * 8760;
      var totalEnergy = itEnergy * pue;
      var cost = totalEnergy * p;
      var liters = itEnergy * wue;

      pueEl.textContent = fmt(lang, pue, 2);
      wueEl.textContent = fmt(lang, wue, 2);
      energyEl.innerHTML = fmt(lang, totalEnergy / 1000, 0) + '<span class="unit">MWh</span>';
      costEl.textContent = "$" + fmt(lang, cost, 0);
      waterEl.innerHTML = fmt(lang, liters / 1000, 0) + '<span class="unit">m\u00b3</span>';
      pueBar.style.width = Math.min(100, Math.max(6, (pue - 1) / 1.2 * 100)) + "%";
      wueBar.style.width = Math.min(100, Math.max(4, wue / 4 * 100)) + "%";
      pueVal.textContent = fmt(lang, pue, 2);
      wueVal.textContent = fmt(lang, wue, 2);
      pueEl.className = pue <= 1.3 ? "good" : (pue <= 1.6 ? "warn" : "bad");
      wueEl.className = wue <= 1 ? "good" : (wue <= 2.5 ? "warn" : "bad");
      status.className = "result-box " + (waterCooled ? (factor > 0.8 ? "warn" : "ok") : "ok");
      status.textContent = (waterCooled ? tr(lang, "act10WaterNote") : tr(lang, "act10AirNote")) + " " + tr(lang, "act10Note");
    }

    loc.addEventListener("change", function () {
      var preset = presets[loc.value] || presets.custom;
      power.value = preset.power;
      water.value = preset.water;
      update();
    });
    [racks, density, power, water].forEach(function (el) { el.addEventListener("input", update); });
    plant.addEventListener("change", update);
    update();
  }

  var renderers = {
    layers: renderLayers,
    powerflow: renderPowerflow,
    cooling: renderCooling,
    tiers: renderTiers,
    ups: renderUps,
    scope: renderScope,
    containment: renderContainment,
    chilledwater: renderChilled,
    assembly: renderAssembly,
    eco: renderEco
  };

  return {
    render: function (type, mount, module, lang) {
      cleanupAll();
      (renderers[type] || renderLayers)(mount, module, lang);
    },
    cleanupAll: cleanupAll
  };
})();
