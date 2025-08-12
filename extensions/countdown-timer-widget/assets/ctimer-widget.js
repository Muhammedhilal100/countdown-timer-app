(function () {
  try {
    const script = document.currentScript;
    if (!script) return;

    const shop = script.getAttribute("data-shop") || "";
    const targetSel = script.getAttribute("data-target") || "#ctimer-root";
    const apiUrl = "https://countdown-timer-app.onrender.com/api/timers/public"; // your Render URL

    // Ensure a mount exists
    let mount = document.querySelector(targetSel);
    if (!mount) {
      mount = document.createElement("div");
      mount.id = targetSel.replace(/^#/, "");
      document.body.prepend(mount);
    }

    // Basic view helpers
    function renderMessage(msg) {
      mount.innerHTML =
        '<div style="font: 14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color:#6b7280;">' +
        msg +
        "</div>";
    }
    function pad(n) {
      return String(n).padStart(2, "0");
    }

    // Pick the currently active timer (start <= now < end), prefer the one ending soonest
    function pickActiveTimer(timers) {
      const now = Date.now();
      const active = timers.filter((t) => {
        const s = new Date(t.startDate).getTime();
        const e = new Date(t.endDate).getTime();
        return !Number.isNaN(s) && !Number.isNaN(e) && s <= now && now < e;
      });
      if (!active.length) return null;
      active.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
      return active[0];
    }

    async function fetchJSON(url) {
      const res = await fetch(url, { credentials: "omit", mode: "cors" });
      const ct = res.headers.get("content-type") || "";
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!ct.includes("application/json")) {
        // Likely a tunnel interstitial or HTML error page
        const text = await res.text();
        throw new Error("Non-JSON response: " + text.slice(0, 120) + "…");
      }
      return res.json();
    }

    async function init() {
      if (!shop) {
        renderMessage("Missing shop info.");
        return;
      }

      // Fetch timers for this shop (array expected: {timers:[...]})
      let data;
      try {
        const url = `${apiUrl}?shop=${encodeURIComponent(shop)}`;
        data = await fetchJSON(url);
      } catch (err) {
        console.error("Error fetching timer:", err);
        renderMessage("Couldn’t load timer. Please try again later.");
        return;
      }

      const timers = Array.isArray(data)
        ? data
        : Array.isArray(data?.timers)
        ? data.timers
        : [];
      if (!timers.length) {
        renderMessage("No active promotions right now.");
        return;
      }

      const t = pickActiveTimer(timers);
      if (!t) {
        renderMessage("No active promotions right now.");
        return;
      }

      const endMs = new Date(t.endDate).getTime();
      if (Number.isNaN(endMs)) {
        renderMessage("Invalid timer end date.");
        return;
      }

      // Styles based on timer config (with sane defaults)
      const barColor = t.color || "#22c55e";
      const size = t.size || "medium"; // small | medium | large
      const sizePx = size === "small" ? 12 : size === "large" ? 20 : 16;
      const position = t.position || "top"; // top | bottom
      const urgency = t.urgency || "none"; // none | colorPulse | banner

      mount.innerHTML = `
        <style>
          @keyframes ctimerPulse {
            0%{ box-shadow: 0 0 0 0 ${barColor}44 }
            70%{ box-shadow: 0 0 0 10px transparent }
            100%{ box-shadow: 0 0 0 0 transparent }
          }
        </style>
        <div id="ctimer-card" style="
          position:relative;border:1px solid #e5e7eb;background:#fff;border-radius:8px;
          padding:10px 12px;box-shadow:0 1px 2px rgba(0,0,0,.05);
          margin:${position === "top" ? "0 0 12px 0" : "12px 0 0 0"};
          animation: ${
            urgency === "colorPulse" ? "ctimerPulse 1s infinite" : "none"
          };">
          ${
            urgency === "banner"
              ? `
            <div style="position:absolute;inset-inline:0;top:-22px;text-align:center;font:600 12px system-ui;color:#b91c1c;">
              Hurry! Offer ends soon
            </div>`
              : ""
          }
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:8px;height:24px;background:${barColor};border-radius:4px;"></div>
            <div style="flex:1;min-width:0;">
              <div style="font:600 ${sizePx}px/1.2 system-ui;">${
        t.name || "Limited-time offer"
      }</div>
              ${
                t.description
                  ? `<div style="color:#6b7280;font:${
                      sizePx - 2
                    }px/1.4 system-ui;">${t.description}</div>`
                  : ""
              }
            </div>
            <div id="ctimer-nums" style="font:${sizePx}px/1.2 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;"></div>
          </div>
        </div>
      `;

      const nums = mount.querySelector("#ctimer-nums");
      const card = mount.querySelector("#ctimer-card");

      function tick() {
        const now = Date.now();
        const diff = endMs - now;
        if (diff <= 0) {
          nums.textContent = "00h 00m 00s";
          // Optionally hide the card after expiry:
          // card.style.display = "none";
          clearInterval(timerId);
          return;
        }
        // Urgency window (last 5 minutes)
        const minsLeft = Math.floor(diff / 60000);
        if (urgency === "banner" && minsLeft <= 5) {
          // already shows banner; you could emphasize more here if needed
        }

        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        const parts = [];
        if (d > 0) parts.push(`${d}d`);
        parts.push(`${pad(h)}h`, `${pad(m)}m`, `${pad(s)}s`);
        nums.textContent = parts.join(" ");
      }

      tick();
      const timerId = setInterval(tick, 1000);
    }

    init();
  } catch (e) {
    // Swallow any boot-time error to avoid breaking theme rendering
    console.error("[ctimer] boot error:", e);
  }
})();
