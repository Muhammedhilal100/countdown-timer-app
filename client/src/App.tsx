import React from 'react';
import { AppProvider } from '@shopify/polaris';
import en from '@shopify/polaris/locales/en.json';
import TimerList from './components/TimerList';

export default function App() {
  const shop = new URLSearchParams(location.search).get('shop') || 'dev-shop.myshopify.com';
  return (
    <AppProvider i18n={en}>
      <TimerList shop={shop} />
    </AppProvider>
  );
}
