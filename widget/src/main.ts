import { h, render } from 'preact';
import { Countdown } from './Countdown';

type ApiResult = { timer: any };

(function init() {
  const el = document.currentScript as HTMLScriptElement | null;
  const shop = el?.dataset.shop || (window as any).Shopify?.shop || '';
  const host = el?.dataset.host || location.origin;
  const targetSelector = el?.dataset.target || '#ctimer-root';

  fetch(`${host}/apps/ctimer/active?shop=${encodeURIComponent(shop)}`)
    .then(r => r.json())
    .then((data: ApiResult) => {
      if (!data?.timer) return;
      let mount = document.querySelector(targetSelector);
      if (!mount) {
        mount = document.createElement('div');
        mount.id = targetSelector.replace('#','');
        const container = document.querySelector('[data-ctimer-position="top"]') || document.body;
        container.prepend(mount);
      }
      render(h(Countdown, { timer: data.timer }), mount as Element);
    })
    .catch(() => {});
})();
