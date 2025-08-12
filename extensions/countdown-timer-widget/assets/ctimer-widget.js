(function () {
  const scriptTag = document.currentScript;
  // const apiUrl = scriptTag.getAttribute("data-api-url");
  const shop = scriptTag.getAttribute("data-shop");
  const root = document.querySelector(scriptTag.getAttribute("data-target"));
  const productId = root?.dataset?.productId;
  const apiUrl = "https://0d6a1f94efbd.ngrok-free.app/api/timers/public";

  async function fetchTimer() {
    try {
      const res = await fetch(`${apiUrl}?shop=${shop}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log("Timer Data:", data);
      // render your timer here
    } catch (err) {
      console.error("Error fetching timer:", err);
    }
  }

  function startCountdown(endTime) {
    function update() {
      const now = Date.now();
      const distance = endTime - now;
      if (distance <= 0) {
        root.innerHTML = "Offer expired";
        return;
      }
      const h = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const m = Math.floor((distance / (1000 * 60)) % 60);
      const s = Math.floor((distance / 1000) % 60);
      root.innerHTML = `${h}h ${m}m ${s}s`;
    }
    update();
    setInterval(update, 1000);
  }

  fetchTimer();
})();
