# Countdown Timer — Shopify App

Implements the PRD: Admin (React + Polaris), Node/Express API + MongoDB, Theme App Extension + Preact widget.

## Prerequisites
- Node 18+
- pnpm (or npm/yarn)
- MongoDB Atlas URI
- Shopify Partners account + Dev store
- Shopify CLI 3.0
- ngrok (or HTTPS domain)

## 1) Configure App
1. Create an app in Shopify Partners. Get **API key/secret**.
2. Create a **Dev store** and add sample products.
3. In App setup > **App proxy**: set Prefix=`/apps`, Subpath=`ctimer`, and Proxy URL to `https://YOUR_HOST/proxy`.
4. Copy `.env.example` to `.env` and fill values.

## 2) Install dependencies
```bash
pnpm install
pnpm --filter client install
pnpm --filter widget install
```

## 3) Dev mode
Terminal A (server):
```bash
pnpm dev
```
Terminal B (admin):
```bash
cd client && pnpm dev
```
Terminal C (widget build):
```bash
cd widget && pnpm build
```

Expose your server with **ngrok** and set HOST in `.env` to the https ngrok URL.

## 4) Admin UI quick test (no OAuth)
Open: `http://localhost:5173/?shop=dev-shop.myshopify.com`

## 5) Theme App Extension
1. In Theme editor, add **Countdown timer** block to your product template.
2. The block loads `ctimer-widget.js`, which then loads `/widget/widget.js` from your server.
3. The widget requests the active timer from your proxy endpoint `/apps/ctimer/active?shop=...` and renders it.

## 6) Production build
```bash
pnpm build
pnpm start
```

## Notes
- Urgency cues enabled in last 5 minutes: color pulse or red banner.
- Data is store-scoped via the `shop` field on timers.
