/* Data Center desde 0 — SPA core */
(function () {
  "use strict";

  var STORAGE = {
    lang: "dc0.lang",
    theme: "dc0.theme",
    config: "dc0.config",
    done: "dc0.done",
    tab: "dc0.tab"
  };

  var DEFAULT_CONFIG = {
    provider: "omniroute",
    endpoint: "http://localhost:20128/v1/chat/completions",
    apiKey: "",
    model: "",
    models: []
  };

  var ACTIVITY_KEY = {
    layers: "act1",
    powerflow: "act2",
    cooling: "act3",
    tiers: "act4",
    ups: "act5",
    scope: "act6",
    containment: "act7",
    chilledwater: "act8",
    assembly: "act9",
    eco: "act10"
  };

  var LANG_NAME = { en: "English", es: "Spanish", it: "Italian" };
  var LOCALE = { en: "en-US", es: "es-ES", it: "it-IT" };

  var state = {
    lang: "es",
    theme: "dark",
    tab: 0,
    config: clone(DEFAULT_CONFIG),
    done: new Set(),
    chats: {},
    configVerified: false,
    aiStatus: "offline",
    aiTesting: false,
    aiTestSeq: 0,
    aiTestController: null
  };

  var els = {};

  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

  function $(sel) { return document.querySelector(sel); }

  function pad2(n) { return String(n).padStart(2, "0"); }

  function t(key, vars) {
    var dict = window.I18N[state.lang] || window.I18N.en;
    var value = dict[key] != null ? dict[key] : key;
    if (typeof value !== "string") return value;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        value = value.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]);
      });
    }
    return value;
  }

  function modules() {
    return (window.CONTENT[state.lang] || window.CONTENT.en).modules;
  }

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw == null ? fallback : raw;
    } catch (e) {
      return fallback;
    }
  }

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* storage blocked */ }
  }

  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked */ }
  }

  function init() {
    els.brandName = $("#brandName");
    els.brandTag = $("#brandTag");
    els.sidebarKicker = $("#sidebarKicker");
    els.sidebarTitle = $("#sidebarTitle");
    els.progressLabel = $("#progressLabel");
    els.progressValue = $("#progressValue");
    els.progressBar = $("#progressBar");
    els.progressHint = $("#progressHint");
    els.footerLeft = $("#footerLeft");
    els.footerRight = $("#footerRight");
    els.themeIcon = $("#themeIcon");
    els.themeLabel = $("#themeLabel");
    els.themeToggle = $("#themeToggle");
    els.langSwitch = $("#langSwitch");
    els.tabs = $("#tabs");
    els.app = $("#app");
    els.toasts = $("#toasts");
    els.brandLink = $("#brandLink");
    els.aiStatus = $("#aiStatus");
    els.aiStatusLabel = $("#aiStatusLabel");

    var savedLang = read(STORAGE.lang, "");
    var browser = (navigator.language || "es").slice(0, 2).toLowerCase();
    state.lang = /^(en|es|it)$/.test(savedLang) ? savedLang : (/^(en|es|it)$/.test(browser) ? browser : "es");

    var savedTheme = read(STORAGE.theme, "dark");
    state.theme = savedTheme === "light" ? "light" : "dark";

    var cfg = readJSON(STORAGE.config, null);
    if (cfg && typeof cfg === "object") {
      state.config = Object.assign(clone(DEFAULT_CONFIG), cfg);
      if (!Array.isArray(state.config.models)) state.config.models = [];
      if (!state.config.endpoint) state.config.endpoint = DEFAULT_CONFIG.endpoint;
    }

    var done = readJSON(STORAGE.done, []);
    if (Array.isArray(done)) state.done = new Set(done);

    var savedTab = parseInt(read(STORAGE.tab, "0"), 10);
    state.tab = Number.isFinite(savedTab) ? savedTab : 0;
    var hash = location.hash.replace("#", "");
    if (hash === "config") state.tab = 10;
    else {
      var idx = modules().findIndex(function (m) { return m.id === hash; });
      if (idx >= 0) state.tab = idx;
    }

    applyTheme();
    renderStatic();
    renderTabs();
    renderPanel();
    bindGlobal();
    if (state.config.model) {
      setAIStatus("checking");
      window.setTimeout(function () { testAIConnection({ silent: true }); }, 600);
    }
  }

  function bindGlobal() {
    els.langSwitch.addEventListener("click", function (ev) {
      var btn = ev.target.closest("button[data-lang]");
      if (!btn) return;
      var lang = btn.getAttribute("data-lang");
      if (lang === state.lang) return;
      if (state.tab === 10) captureConfigForm();
      state.lang = lang;
      write(STORAGE.lang, lang);
      document.documentElement.lang = lang;
      renderStatic();
      renderTabs();
      renderPanel();
      toast(t("toastLang"), "ok");
    });

    els.themeToggle.addEventListener("click", function () {
      state.theme = state.theme === "dark" ? "light" : "dark";
      write(STORAGE.theme, state.theme);
      applyTheme();
      toast(t("toastTheme"), "ok");
    });

    els.tabs.addEventListener("click", function (ev) {
      var btn = ev.target.closest(".tab-btn");
      if (!btn) return;
      goTab(Number(btn.getAttribute("data-index")));
    });

    els.brandLink.addEventListener("click", function (ev) {
      ev.preventDefault();
      goTab(0);
    });

    if (els.aiStatus) {
      els.aiStatus.addEventListener("click", function () {
        if (state.tab === 10) {
          var testBtn = document.getElementById("cfgTest");
          if (testBtn) testBtn.focus();
          return;
        }
        goTab(10);
      });
    }

    window.addEventListener("hashchange", function () {
      var hash = location.hash.replace("#", "");
      if (hash === "config") goTab(10, true);
      else {
        var idx = modules().findIndex(function (m) { return m.id === hash; });
        if (idx >= 0) goTab(idx, true);
      }
    });
  }

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.theme);
    document.documentElement.lang = state.lang;
    if (els.themeLabel) els.themeLabel.textContent = state.theme === "dark" ? t("themeDark") : t("themeLight");
    if (els.themeIcon) els.themeIcon.textContent = state.theme === "dark" ? "\u25d0" : "\u25d1";
    if (els.themeToggle) els.themeToggle.setAttribute("aria-label", t("themeToggleAria"));
  }

  function renderStatic() {
    els.brandName.textContent = t("brandName");
    els.brandTag.textContent = t("brandTag");
    els.sidebarKicker.textContent = t("sidebarKicker");
    els.sidebarTitle.textContent = t("sidebarTitle");
    els.progressLabel.textContent = t("progressLabel");
    els.progressHint.textContent = t("progressHint");
    els.footerLeft.textContent = t("footerLeft");
    els.footerRight.textContent = t("footerRight");
    els.langSwitch.querySelectorAll("button").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang") === state.lang ? "true" : "false");
    });
    applyTheme();
    updateProgress();
    updateAIStatus();
  }

  function renderTabs() {
    var list = modules();
    var html = list.map(function (m, i) {
      var active = state.tab === i;
      var done = state.done.has(m.id);
      return '<button type="button" class="tab-btn' + (active ? " active" : "") + (done ? " done" : "") + '" data-index="' + i + '">' +
        '<span class="tab-num">' + pad2(i + 1) + '</span>' +
        '<span class="tab-copy"><strong>' + m.title + '</strong><small>' + m.kicker + '</small></span>' +
        '<span class="tab-dot" aria-hidden="true"></span></button>';
    }).join("");
    html += '<button type="button" class="tab-btn' + (state.tab === 10 ? " active" : "") + '" data-index="10">' +
      '<span class="tab-num">AI</span>' +
      '<span class="tab-copy"><strong>' + t("navConfig") + '</strong><small>' + t("navConfigSmall") + '</small></span>' +
      '<span class="tab-dot" aria-hidden="true"></span></button>';
    els.tabs.innerHTML = html;
    updateProgress();
  }

  function updateProgress() {
    var total = modules().length || 10;
    var doneCount = modules().filter(function (m) { return state.done.has(m.id); }).length;
    var pct = Math.round(doneCount / total * 100);
    if (els.progressValue) els.progressValue.textContent = pct + "%";
    if (els.progressBar) els.progressBar.style.width = pct + "%";
  }

  function goTab(index, fromHash) {
    if (index < 0 || index > 10) return;
    if (state.tab === 10 && index !== 10) captureConfigForm();
    state.tab = index;
    window.Activities.cleanupAll();
    write(STORAGE.tab, String(index));
    renderTabs();
    renderPanel();
    if (!fromHash) {
      var hash = index === 10 ? "config" : modules()[index].id;
      if (location.hash !== "#" + hash) {
        try { history.replaceState(null, "", "#" + hash); } catch (e) { location.hash = hash; }
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function renderPanel() {
    window.Activities.cleanupAll();
    if (state.tab === 10) renderConfig();
    else renderModule(modules()[state.tab] || modules()[0], state.tab);
  }

  function moduleNav(index) {
    var list = modules();
    var prev = index > 0 ? '<button type="button" class="btn ghost" data-goto="' + (index - 1) + '">\u2190 ' + t("prevModule") + '</button>' : "";
    var next = index < list.length - 1 ? '<button type="button" class="btn primary" data-goto="' + (index + 1) + '">' + t("nextModule") + ' \u2192</button>' : "";
    var config = '<button type="button" class="btn" data-goto="10">' + t("navConfig") + '</button>';
    return '<div class="hero-actions" style="justify-content:space-between;border-top:1px solid var(--border);padding-top:18px;margin-top:6px">' +
      '<div class="hero-actions" style="margin:0">' + prev + next + '</div>' + config + '</div>';
  }

  function renderModule(module, index) {
    var actKey = ACTIVITY_KEY[module.activity] || "act1";
    var html = '<div class="panel">' +
      '<section class="hero">' +
        '<div class="hero-top"><span class="eyebrow">' + t("moduleLabel") + " " + pad2(index + 1) + " \u00b7 " + module.kicker + '</span>' +
          '<span class="badge info">24/7/365</span></div>' +
        '<h1><span>' + module.title + '</span></h1>' +
        '<p class="hero-summary">' + module.summary + '</p>' +
        '<div class="hero-actions">' +
          '<a class="btn primary" href="' + module.video + '" target="_blank" rel="noopener noreferrer">' + t("video") + '</a>' +
          '<a class="btn" href="#activity">' + t("activityTitle") + '</a>' +
        '</div>' +
        '<div class="hero-stats">' +
          '<span class="stat-chip"><b>' + pad2(index + 1) + '</b> / 10</span>' +
          '<span class="stat-chip"><b>3</b> ' + t("quizTitle") + '</span>' +
          '<span class="stat-chip"><b>' + module.tables.length + '</b> ' + t("tablesTitle") + '</span>' +
        '</div>' +
      '</section>';

    html += '<section class="card" id="reference">' +
      '<div class="section-head"><div class="section-title"><span class="section-icon">TAB</span><div>' +
        '<h3>' + t("tablesTitle") + '</h3><p>' + t("tablesSub") + '</p></div></div></div>' +
      '<div class="section-body">';
    module.tables.forEach(function (table, ti) {
      html += '<div class="table-wrap"' + (ti ? ' style="margin-top:14px"' : "") + '>' +
        '<table class="data-table"><caption>' + table.title + '</caption><thead><tr>' +
        table.headers.map(function (h) { return '<th>' + h + '</th>'; }).join("") +
        '</tr></thead><tbody>' +
        table.rows.map(function (row) {
          return '<tr>' + row.map(function (cell, ci) { return ci === 0 ? '<td>' + cell + '</td>' : '<td>' + cell + '</td>'; }).join("") + '</tr>';
        }).join("") +
        '</tbody></table></div>';
    });
    html += '</div></section>';

    html += '<section class="card" id="activity">' +
      '<div class="section-head"><div class="section-title"><span class="section-icon">LAB</span><div>' +
        '<h3>' + t("activityTitle") + '</h3><p>' + t("activitySub") + '</p></div></div>' +
        '<span class="badge info">' + t(actKey + "Title") + '</span></div>' +
      '<div class="sim-head"><div><h4>' + t(actKey + "Title") + '</h4><p>' + t(actKey + "Sub") + '</p></div></div>' +
      '<div id="activityMount"></div></section>';

    html += '<section class="card" id="quiz">' +
      '<div class="section-head"><div class="section-title"><span class="section-icon">Q&amp;A</span><div>' +
        '<h3>' + t("quizTitle") + '</h3><p>' + t("quizSub") + '</p></div></div>' +
        '<span class="badge" id="quizBadge">0/3</span></div>' +
      '<div id="quizMount"></div></section>';

    html += '<section class="card" id="assistant">' +
      '<div class="section-head"><div class="section-title"><span class="section-icon">AI</span><div>' +
        '<h3>' + t("chatTitle") + '</h3><p>' + t("chatSub") + '</p></div></div></div>' +
      '<div id="chatMount"></div></section>';

    html += moduleNav(index) + '</div>';
    els.app.innerHTML = html;

    els.app.querySelectorAll("[data-goto]").forEach(function (btn) {
      btn.addEventListener("click", function () { goTab(Number(btn.getAttribute("data-goto"))); });
    });

    var activityMount = document.getElementById("activityMount");
    window.Activities.render(module.activity, activityMount, module, state.lang);

    var quizMount = document.getElementById("quizMount");
    var badge = document.getElementById("quizBadge");
    renderQuiz(quizMount, module, badge);

    renderChat(document.getElementById("chatMount"), module);
  }

  /* ---------------- Quiz ---------------- */
  function renderQuiz(mount, module, badge) {
    var questions = module.quiz;
    var checked = 0;
    var correct = 0;

    function updateBadge() {
      if (!badge) return;
      badge.textContent = correct + "/3";
      badge.className = "badge " + (checked === 3 && correct === 3 ? "ok" : (checked ? "warn" : ""));
    }

    function complete() {
      if (correct !== 3 || checked !== 3) return;
      if (!state.done.has(module.id)) {
        state.done.add(module.id);
        writeJSON(STORAGE.done, Array.from(state.done));
        renderTabs();
        toast(t("quizPassed") + " \u00b7 " + module.title, "ok");
      }
    }

    mount.innerHTML = '<div class="quiz-list">' + questions.map(function (q, qi) {
      return '<div class="quiz-q" data-q="' + qi + '">' +
        '<div class="quiz-stem"><span class="qn">' + pad2(qi + 1) + '</span><span>' + q.q + '</span></div>' +
        '<div class="options">' + q.options.map(function (opt, oi) {
          return '<button type="button" class="option" data-q="' + qi + '" data-o="' + oi + '">' +
            '<span class="letter">' + String.fromCharCode(65 + oi) + '</span><span>' + opt + '</span></button>';
        }).join("") + '</div>' +
        '<div class="explain">' + q.explain + '</div>' +
        '<div class="quiz-foot"><button type="button" class="btn small quiz-check" data-q="' + qi + '">' + t("quizCheck") + '</button>' +
        '<span class="badge q-result" data-q="' + qi + '" style="display:none"></span></div>' +
        '</div>';
    }).join("") + '</div>' +
      '<div class="quiz-foot"><span class="quiz-score" id="quizScore">' + t("quizScore", { n: 0 }) + '</span>' +
      '<div class="hero-actions" style="margin:0"><span class="badge" id="quizPass" style="display:none">' + t("quizPassed") + '</span>' +
      '<button type="button" class="btn small ghost" id="quizReset">' + t("quizReset") + '</button></div></div>';

    var selection = {};
    var locked = {};

    mount.querySelectorAll(".option").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var qi = Number(btn.getAttribute("data-q"));
        if (locked[qi]) return;
        var q = mount.querySelector('.quiz-q[data-q="' + qi + '"]');
        q.querySelectorAll(".option").forEach(function (o) { o.classList.remove("selected"); });
        btn.classList.add("selected");
        selection[qi] = Number(btn.getAttribute("data-o"));
      });
    });

    mount.querySelectorAll(".quiz-check").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var qi = Number(btn.getAttribute("data-q"));
        if (locked[qi]) return;
        if (selection[qi] == null) {
          toast(t("quizSelect"), "bad");
          return;
        }
        locked[qi] = true;
        var q = questions[qi];
        var qEl = mount.querySelector('.quiz-q[data-q="' + qi + '"]');
        var chosen = selection[qi];
        var isRight = chosen === q.answer;
        qEl.classList.add(isRight ? "correct" : "wrong");
        qEl.querySelectorAll(".option").forEach(function (o) {
          var oi = Number(o.getAttribute("data-o"));
          o.disabled = true;
          if (oi === q.answer) o.classList.add("ok");
          else if (oi === chosen) o.classList.add("ko");
        });
        qEl.querySelector(".explain").classList.add("show");
        var res = qEl.querySelector(".q-result");
        res.style.display = "inline-flex";
        res.className = "badge q-result " + (isRight ? "ok" : "bad");
        res.textContent = isRight ? t("quizCorrect") : t("quizIncorrect");
        btn.disabled = true;
        checked += 1;
        if (isRight) correct += 1;
        var score = document.getElementById("quizScore");
        if (score) score.textContent = t("quizScore", { n: correct });
        updateBadge();
        if (checked === 3) {
          var pass = document.getElementById("quizPass");
          if (pass) pass.style.display = correct === 3 ? "inline-flex" : "none";
          complete();
        }
      });
    });

    var reset = mount.querySelector("#quizReset");
    reset.addEventListener("click", function () {
      renderQuiz(mount, module, badge);
    });

    updateBadge();
  }

  /* ---------------- Chat ---------------- */
  function renderChat(mount, module) {
    var messages = state.chats[module.id] || [];
    var modelLabel = state.config.model || t("noModel");
    mount.innerHTML =
      '<div class="chat">' +
        '<div class="chat-head"><div class="who"><span class="chat-avatar">AI</span><div>' +
          '<h4>' + t("chatTitle") + '</h4><p>' + t("chatSub") + '</p></div></div>' +
          '<span class="chat-model" title="' + modelLabel + '">' + modelLabel + '</span></div>' +
        '<div class="chat-log" id="chatLog"></div>' +
        '<form class="chat-form" id="chatForm">' +
          '<textarea class="input" id="chatInput" rows="1" placeholder="' + t("chatPlaceholder") + '"></textarea>' +
          '<button class="btn primary" type="submit" id="chatSend">' + t("send") + '</button>' +
        '</form>' +
        '<p class="chat-note">' + t("configNote") + '</p>' +
      '</div>';

    var log = mount.querySelector("#chatLog");
    var form = mount.querySelector("#chatForm");
    var input = mount.querySelector("#chatInput");
    var send = mount.querySelector("#chatSend");

    function paint() {
      log.innerHTML = "";
      if (!messages.length) {
        var hint = document.createElement("div");
        hint.className = "msg assistant";
        hint.textContent = t("chatEmpty");
        log.appendChild(hint);
      } else {
        messages.forEach(function (m) {
          var bubble = document.createElement("div");
          bubble.className = "msg " + (m.role === "user" ? "user" : "assistant");
          bubble.textContent = m.content;
          log.appendChild(bubble);
        });
      }
      log.scrollTop = log.scrollHeight;
    }

    function typing(on) {
      var existing = log.querySelector(".msg.typing");
      if (existing) existing.remove();
      if (on) {
        var bubble = document.createElement("div");
        bubble.className = "msg assistant typing";
        for (var i = 0; i < 3; i++) bubble.appendChild(document.createElement("i"));
        log.appendChild(bubble);
        log.scrollTop = log.scrollHeight;
      }
    }

    paint();

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var text = input.value.trim();
      if (!text) return;

      if (!state.config.model) {
        setAIStatus("offline");
        messages.push({ role: "assistant", content: t("chatNeedConfig") });
        state.chats[module.id] = messages;
        paint();
        input.value = "";
        return;
      }

      cancelAITest();
      messages.push({ role: "user", content: text });
      state.chats[module.id] = messages;
      input.value = "";
      send.disabled = true;
      paint();
      typing(true);

      var system = {
        role: "system",
        content: "You are the contextual AI assistant for the module \"" + module.title +
          "\" of the educational platform Data Center desde 0. Source of truth: " + module.summary +
          " Answer in " + (LANG_NAME[state.lang] || "English") +
          ". Be precise, technical and concise (maximum 180 words). Use data center infrastructure terminology. If the question is unrelated, redirect it to this module."
      };
      var payloadMessages = [system].concat(messages.filter(function (m) {
        return m.role === "user" || m.role === "assistant";
      }).slice(-10));

      var controller = new AbortController();
      var timeout = setTimeout(function () { controller.abort(); }, 90000);

      fetch(state.config.endpoint, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          model: state.config.model,
          messages: payloadMessages,
          temperature: 0.35,
          max_tokens: 800
        }),
        signal: controller.signal
      }).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      }).then(function (data) {
        var content = "";
        if (data && data.choices && data.choices[0]) {
          var c = data.choices[0];
          content = (c.message && c.message.content) || c.text || "";
        } else if (data && data.output_text) {
          content = data.output_text;
        }
        if (!content) throw new Error("empty");
        setAIStatus("online");
        messages.push({ role: "assistant", content: String(content).trim() });
        state.chats[module.id] = messages;
      }).catch(function (err) {
        setAIStatus("offline");
        var msg = (err && err.name === "AbortError") ? t("chatError") : t("chatError");
        if (err && String(err.message).indexOf("HTTP") === 0) msg = t("chatApiError") + " (" + err.message + ")";
        messages.push({ role: "assistant", content: msg });
        state.chats[module.id] = messages;
      }).finally(function () {
        clearTimeout(timeout);
        if (!mount.isConnected) return;
        send.disabled = false;
        typing(false);
        paint();
      });
    });

    input.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" && !ev.shiftKey) {
        ev.preventDefault();
        form.requestSubmit();
      }
    });
  }

  function authHeaders() {
    var headers = { "Content-Type": "application/json" };
    if (state.config.apiKey) {
      if (state.config.provider === "foundry") {
        headers["api-key"] = state.config.apiKey;
        headers["Authorization"] = "Bearer " + state.config.apiKey;
      } else {
        headers["Authorization"] = "Bearer " + state.config.apiKey;
      }
    }
    return headers;
  }

  /* ---------------- Configuration ---------------- */
  function captureConfigForm() {
    var provider = document.getElementById("cfgProvider");
    if (!provider) return;
    state.config.provider = provider.value;
    state.config.endpoint = document.getElementById("cfgEndpoint").value.trim();
    state.config.apiKey = document.getElementById("cfgApiKey").value;
    state.config.model = document.getElementById("cfgModel").value.trim();
  }

  function saveConfig(showToast) {
    writeJSON(STORAGE.config, state.config);
    if (showToast) toast(t("saved"), "ok");
  }

  function renderConfig() {
    var cfg = state.config;
    var statusClass = "bad";
    var statusText = t("statusAiOffline");
    if (state.aiStatus === "online") {
      statusClass = "ok";
      statusText = t("statusAiOnline");
    } else if (state.aiStatus === "checking") {
      statusClass = "busy";
      statusText = t("testTesting");
    }

    var html = '<div class="panel">' +
      '<section class="hero">' +
        '<div class="hero-top"><span class="eyebrow">' + t("configKicker") + '</span><span class="badge warn">' + t("noChat") + '</span></div>' +
        '<h1><span>' + t("configTitle") + '</span></h1>' +
        '<p class="hero-summary">' + t("configSub") + '</p>' +
        '<div class="hero-actions"><button type="button" class="btn primary" id="cfgSaveTop">' + t("save") + '</button>' +
        '<button type="button" class="btn ghost" id="cfgResetTop">' + t("reset") + '</button></div>' +
      '</section>' +
      '<div class="config-grid">' +
        '<section class="card">' +
          '<div class="section-head"><div class="section-title"><span class="section-icon">LLM</span><div>' +
            '<h3>' + t("provider") + '</h3><p>' + t("modelHint") + '</p></div></div></div>' +
          '<div class="field"><label for="cfgProvider">' + t("provider") + '</label>' +
            '<select class="select" id="cfgProvider">' +
              '<option value="omniroute"' + (cfg.provider === "omniroute" ? " selected" : "") + '>' + t("omniroute") + '</option>' +
              '<option value="foundry"' + (cfg.provider === "foundry" ? " selected" : "") + '>' + t("foundry") + '</option>' +
              '<option value="custom"' + (cfg.provider === "custom" ? " selected" : "") + '>' + t("custom") + '</option>' +
            '</select></div>' +
          '<div class="field"><label for="cfgEndpoint">' + t("endpointLabel") + '</label>' +
            '<input class="input" type="url" id="cfgEndpoint" value="' + escapeAttr(cfg.endpoint) + '" spellcheck="false">' +
            '<span class="hint">' + t("endpointHint") + '</span></div>' +
          '<div class="field"><label for="cfgApiKey">' + t("apiKeyLabel") + '</label>' +
            '<input class="input" type="password" id="cfgApiKey" value="' + escapeAttr(cfg.apiKey) + '" autocomplete="off" spellcheck="false">' +
            '<span class="hint">' + t("apiKeyHint") + '</span></div>' +
          '<div class="field"><label for="cfgModel">' + t("modelLabel") + '</label>' +
            '<input class="input" type="text" id="cfgModel" value="' + escapeAttr(cfg.model) + '" spellcheck="false">' +
            '<span class="hint">' + t("modelHint") + '</span></div>' +
          '<div class="hero-actions" style="margin-top:4px">' +
            '<button type="button" class="btn primary" id="cfgTest"' + (state.aiTesting ? ' disabled' : '') + '>' + t(state.aiTesting ? "testTesting" : "testConnection") + '</button>' +
            '<button type="button" class="btn" id="cfgScan">' + t("scan") + '</button>' +
            '<button type="button" class="btn" id="cfgSave">' + t("save") + '</button>' +
            '<button type="button" class="btn ghost" id="cfgReset">' + t("reset") + '</button>' +
          '</div>' +
          '<div class="status-line ' + statusClass + '" id="cfgStatus" style="margin-top:14px"><span class="led"></span><span id="cfgStatusText">' + statusText + '</span></div>' +
          '<div class="model-list" id="cfgModels"></div>' +
        '</section>' +
        '<div class="config-aside">' +
          '<section class="card">' +
            '<div class="section-head"><div class="section-title"><span class="section-icon">NET</span><div>' +
              '<h3>' + t("configAsideTitle") + '</h3><p>' + t("configAsideSub") + '</p></div></div></div>' +
            '<div class="info-list">' +
              '<div class="info-row"><span>' + t("routes") + '</span><b>' + t("omnirouteDefault") + '</b></div>' +
              '<div class="info-row"><span>' + t("modelsFound") + '</span><b>' + t("modelsDefault") + '</b></div>' +
              '<div class="info-row"><span>' + t("currentModel") + '</span><b id="cfgActiveModel">' + (cfg.model || t("noModel")) + '</b></div>' +
              '<div class="info-row"><span>' + t("storage") + '</span><b>' + t("storageValue") + '</b></div>' +
              '<div class="info-row"><span>' + t("chatScope") + '</span><b>' + t("chatScopeValue") + '</b></div>' +
            '</div>' +
            '<div class="result-box" style="margin-top:14px"><span class="big">' + t("helpTitle") + '</span>' + t("helpBody") + '</div>' +
          '</section>' +
          '<section class="card"><div class="section-body" style="white-space:pre-line;font-size:13px">' + t("configSteps") + '</div></section>' +
        '</div>' +
      '</div></div>';

    els.app.innerHTML = html;
    paintModelChips();

    var testBtn = document.getElementById("cfgTest");
    var scanBtn = document.getElementById("cfgScan");
    var saveBtns = [document.getElementById("cfgSave"), document.getElementById("cfgSaveTop")];
    var resetBtns = [document.getElementById("cfgReset"), document.getElementById("cfgResetTop")];
    var provider = document.getElementById("cfgProvider");
    var endpoint = document.getElementById("cfgEndpoint");
    var modelInput = document.getElementById("cfgModel");

    provider.addEventListener("change", function () {
      if (provider.value === "omniroute") {
        endpoint.value = DEFAULT_CONFIG.endpoint;
      } else if (provider.value === "foundry" && endpoint.value.indexOf("openai.azure.com") === -1) {
        endpoint.value = "https://YOUR-RESOURCE.openai.azure.com/openai/deployments/YOUR-DEPLOYMENT/chat/completions?api-version=2024-10-21";
      }
      cancelAITest();
      state.configVerified = false;
      setAIStatus("offline");
      setConfigStatus("", t("statusUntested"));
    });

    endpoint.addEventListener("input", function () {
      cancelAITest();
      state.configVerified = false;
      setAIStatus("offline");
      setConfigStatus("", t("statusUntested"));
    });

    modelInput.addEventListener("input", function () {
      cancelAITest();
      state.config.model = modelInput.value.trim();
      state.configVerified = false;
      setAIStatus("offline");
      var active = document.getElementById("cfgActiveModel");
      if (active) active.textContent = state.config.model || t("noModel");
      setConfigStatus("", t("statusUntested"));
      paintModelChips();
    });

    testBtn.addEventListener("click", function () {
      testAIConnection({ silent: false });
    });

    scanBtn.addEventListener("click", function () {
      scanModels(scanBtn);
    });

    saveBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        cancelAITest();
        captureConfigForm();
        saveConfig(true);
        var active = document.getElementById("cfgActiveModel");
        if (active) active.textContent = state.config.model || t("noModel");
        paintModelChips();
        if (state.config.model) {
          testAIConnection({ silent: true });
        } else {
          setAIStatus("offline");
          setConfigStatus("bad", t("statusAiOffline"));
        }
      });
    });

    resetBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        cancelAITest();
        state.config = clone(DEFAULT_CONFIG);
        state.configVerified = false;
        setAIStatus("offline");
        saveConfig(false);
        renderPanel();
        toast(t("reset"), "ok");
      });
    });
  }

  function paintModelChips() {
    var box = document.getElementById("cfgModels");
    if (!box) return;
    var models = state.config.models || [];
    if (!models.length) { box.innerHTML = ""; return; }
    box.innerHTML = models.map(function (id) {
      return '<button type="button" class="model-chip' + (id === state.config.model ? " active" : "") + '" data-model="' + escapeAttr(id) + '">' + escapeAttr(id) + '</button>';
    }).join("");
    box.querySelectorAll(".model-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        cancelAITest();
        state.config.model = chip.getAttribute("data-model");
        state.configVerified = false;
        var input = document.getElementById("cfgModel");
        if (input) input.value = state.config.model;
        var active = document.getElementById("cfgActiveModel");
        if (active) active.textContent = state.config.model;
        saveConfig(false);
        paintModelChips();
        toast(t("currentModel") + ": " + state.config.model, "ok");
        testAIConnection({ silent: true });
      });
    });
  }

  function setConfigStatus(kind, text) {
    var line = document.getElementById("cfgStatus");
    var txt = document.getElementById("cfgStatusText");
    if (txt) txt.textContent = text;
    if (line) line.className = "status-line " + (kind || "");
  }

  function setAIStatus(status) {
    state.aiStatus = status;
    updateAIStatus();
  }

  function updateAIStatus() {
    if (!els.aiStatus) return;
    var status = ["online", "checking", "offline"].indexOf(state.aiStatus) >= 0 ? state.aiStatus : "offline";
    var labelKey = status === "online" ? "aiStatusOnline" : (status === "checking" ? "aiStatusChecking" : "aiStatusOffline");
    els.aiStatus.className = "ai-status is-" + status;
    if (els.aiStatusLabel) els.aiStatusLabel.textContent = t(labelKey);
    var detail = state.config.model || t("aiStatusNoModel");
    els.aiStatus.title = t("aiStatusTitle") + " \u00b7 " + detail;
    els.aiStatus.setAttribute("aria-label", t("aiStatusTitle") + ": " + t(labelKey) + " \u00b7 " + detail);
  }

  function updateTestButton() {
    var btn = document.getElementById("cfgTest");
    if (!btn) return;
    btn.disabled = state.aiTesting;
    btn.textContent = state.aiTesting ? t("testTesting") : t("testConnection");
  }

  function cancelAITest() {
    state.aiTestSeq++;
    if (state.aiTestController) {
      try { state.aiTestController.abort(); } catch (e) { /* ignore */ }
      state.aiTestController = null;
    }
    state.aiTesting = false;
    updateTestButton();
  }

  function testAIConnection(options) {
    options = options || {};
    if (state.aiTesting) return;
    captureConfigForm();

    if (!state.config.model || !state.config.endpoint) {
      setAIStatus("offline");
      setConfigStatus("bad", t("statusAiOffline"));
      if (!options.silent) toast(t("testFail"), "bad");
      return;
    }

    state.aiTesting = true;
    state.aiTestSeq++;
    var seq = state.aiTestSeq;
    var controller = new AbortController();
    state.aiTestController = controller;
    updateTestButton();
    setAIStatus("checking");
    setConfigStatus("busy", t("testTesting"));

    var timeout = setTimeout(function () { controller.abort(); }, 15000);

    fetch(state.config.endpoint, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        model: state.config.model,
        messages: [{ role: "user", content: "Reply with OK." }],
        temperature: 0,
        max_tokens: 8
      }),
      signal: controller.signal
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    }).then(function (data) {
      if (seq !== state.aiTestSeq) return;
      if (!data || !Array.isArray(data.choices) || !data.choices.length) throw new Error("empty");
      state.configVerified = true;
      saveConfig(false);
      setAIStatus("online");
      setConfigStatus("ok", t("statusAiOnline"));
      if (!options.silent) toast(t("testOk", { model: state.config.model }), "ok");
    }).catch(function (err) {
      if (seq !== state.aiTestSeq) return;
      state.configVerified = false;
      setAIStatus("offline");
      setConfigStatus("bad", t("statusAiOffline"));
      if (!options.silent) toast(t("testFail"), "bad");
      if (err && err.message) console.warn("[testAIConnection]", err.message);
    }).finally(function () {
      clearTimeout(timeout);
      if (seq !== state.aiTestSeq) return;
      state.aiTesting = false;
      state.aiTestController = null;
      updateTestButton();
    });
  }

  function deriveModelsUrl(endpoint) {
    var fallback = "http://localhost:20128/v1/models";
    try {
      var url = new URL(endpoint);
      var path = url.pathname.replace(/\/+$/, "");
      path = path.replace(/\/chat\/completions$/, "/models");
      if (!/\/models$/.test(path)) {
        var idx = path.indexOf("/v1");
        if (idx >= 0) path = path.slice(0, idx) + "/v1/models";
        else path = path + "/v1/models";
      }
      url.pathname = path;
      url.search = "";
      url.hash = "";
      return url.toString();
    } catch (e) {
      return fallback;
    }
  }

  function extractModelIds(payload) {
    var rows = [];
    if (Array.isArray(payload)) rows = payload;
    else if (payload && Array.isArray(payload.data)) rows = payload.data;
    else if (payload && Array.isArray(payload.models)) rows = payload.models;
    else if (payload && Array.isArray(payload.results)) rows = payload.results;
    var ids = [];
    rows.forEach(function (row) {
      var id = typeof row === "string" ? row : (row && (row.id || row.model || row.name || row.modelId));
      if (id && ids.indexOf(id) === -1) ids.push(String(id));
    });
    return ids;
  }

  function scanModels(button) {
    cancelAITest();
    captureConfigForm();
    if (!state.config.endpoint) {
      setAIStatus("offline");
      setConfigStatus("bad", t("scanErr"));
      toast(t("scanErr"), "bad");
      return;
    }
    var url = deriveModelsUrl(state.config.endpoint);
    button.disabled = true;
    button.textContent = t("scanning");
    setAIStatus("checking");
    setConfigStatus("busy", t("statusBusy"));

    fetch(url, { headers: authHeaders() }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    }).then(function (data) {
      var ids = extractModelIds(data);
      if (!ids.length) throw new Error("empty");
      state.config.models = ids;
      state.config.model = ids[0];
      state.configVerified = true;
      saveConfig(false);
      var input = document.getElementById("cfgModel");
      if (input) input.value = ids[0];
      var active = document.getElementById("cfgActiveModel");
      if (active) active.textContent = ids[0];
      paintModelChips();
      setConfigStatus("ok", t("scanOk", { model: ids[0] }));
      toast(t("scanOk", { model: ids[0] }), "ok");
      testAIConnection({ silent: true });
    }).catch(function (err) {
      state.configVerified = false;
      setAIStatus("offline");
      setConfigStatus("bad", t("scanErr"));
      toast(t("scanErr"), "bad");
      if (err && err.message) console.warn("[scanModels]", err.message);
    }).finally(function () {
      if (button.isConnected) {
        button.disabled = false;
        button.textContent = t("scan");
      }
    });
  }

  /* ---------------- Utilities ---------------- */
  function escapeAttr(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function toast(message, kind) {
    if (!els.toasts) return;
    var el = document.createElement("div");
    el.className = "toast " + (kind || "");
    el.textContent = message;
    els.toasts.appendChild(el);
    setTimeout(function () { el.classList.add("out"); }, 2800);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 3150);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
