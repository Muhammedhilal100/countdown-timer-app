import { h } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import dayjs from 'dayjs';

type Timer = {
  name: string; description: string; startDate: string; endDate: string; color: string;
  size: 'small'|'medium'|'large'; position: 'top'|'bottom'; urgency: 'none'|'colorPulse'|'banner';
};

export function Countdown({ timer }: { timer: Timer }) {
  const [now, setNow] = useState(dayjs());
  const end = useMemo(() => dayjs(timer.endDate), [timer.endDate]);
  const remaining = end.diff(now, 'second');
  const minRemaining = end.diff(now, 'minute');

  useEffect(() => {
    const id = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(id);
  }, []);

  if (remaining <= 0) return null;

  const d = Math.floor(remaining / 86400);
  const h_ = Math.floor((remaining % 86400) / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;

  const urgent = minRemaining <= 5 && minRemaining >= 0 && timer.urgency !== 'none';
  const sizePx = timer.size === 'small' ? 12 : timer.size === 'large' ? 20 : 16;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      border: '1px solid #e5e7eb',
      background: '#ffffff',
      padding: '10px 12px',
      boxShadow: '0 1px 2px rgba(0,0,0,.05)',
      marginBottom: timer.position === 'top' ? '12px' : '0',
      marginTop: timer.position === 'bottom' ? '12px' : '0',
      borderRadius: 8,
      animation: urgent && timer.urgency === 'colorPulse' ? 'ctimer-pulse 1s infinite' as any : undefined,
    }}>
      {urgent && timer.urgency === 'banner' && (
        <div style={{
          position: 'absolute', insetInline: 0, top: -24, textAlign: 'center', fontSize: 12,
          color: '#b91c1c', fontWeight: 600
        }}>
          Hurry! Offer ends soon
        </div>
      )}
      <style>{`
        @keyframes ctimer-pulse { 0%{ box-shadow: 0 0 0 0 ${timer.color}44 } 70%{ box-shadow: 0 0 0 10px transparent } 100%{ box-shadow: 0 0 0 0 transparent } }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 8, height: 24, background: timer.color, borderRadius: 4 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{timer.name}</div>
          {timer.description && <div style={{ color: '#6b7280', fontSize: sizePx - 2 }}>{timer.description}</div>}
        </div>
        <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', fontSize: sizePx }}>
          {d}d {h_}h {m}m {s}s
        </div>
      </div>
    </div>
  );
}
