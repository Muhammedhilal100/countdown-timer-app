import React, { useMemo, useState } from 'react';
import { Modal, TextField, Select, InlineStack, InlineGrid } from '@shopify/polaris';
import dayjs from 'dayjs';
import type { Timer } from '../types';
import ColorPickerField from './ColorPickerField';

const sizeOpts = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' }
];
const posOpts = [
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' }
];
const urgencyOpts = [
  { label: 'None', value: 'none' },
  { label: 'Color pulse', value: 'colorPulse' },
  { label: 'Notification banner', value: 'banner' }
];

export default function TimerFormModal({ open, onClose, onSubmit, initial, shop }: {
  open: boolean; onClose: () => void; onSubmit: (t: Timer) => void; initial?: Partial<Timer>; shop: string;
}) {
  const [name, setName] = useState(initial?.name || '');
  const [startDate, setStartDate] = useState(initial?.startDate || '');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState(initial?.endDate || '');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState(initial?.description || '');
  const [color, setColor] = useState(initial?.color || '#22c55e');
  const [size, setSize] = useState((initial?.size as any) || 'medium');
  const [position, setPosition] = useState((initial?.position as any) || 'top');
  const [urgency, setUrgency] = useState((initial?.urgency as any) || 'none');

  const disabled = !name || !startDate || !endDate;

  const payload: Timer = useMemo(() => {
  const start = startDate && startTime
    ? dayjs(`${startDate} ${startTime}`).toISOString()
    : '';
  const end = endDate && endTime
    ? dayjs(`${endDate} ${endTime}`).toISOString()
    : '';

  return {
    shop,
    name,
    startDate: start,
    endDate: end,
    description,
    color,
    size,
    position,
    urgency,
  };
}, [shop, name, startDate, startTime, endDate, endTime, description, color, size, position, urgency]);

  return (
    <Modal open={open} onClose={onClose} title="Create New Timer" primaryAction={{ content: 'Create timer', onAction: () => onSubmit(payload), disabled }}>
      <Modal.Section>
       <InlineStack gap="400" direction="column">
          <TextField label="Timer name" value={name} onChange={setName} autoComplete="off" requiredIndicator />
          <InlineGrid columns={2} gap="400">
            <TextField type="date" label="Start date" value={startDate} onChange={setStartDate} />
            <TextField type="time" label="Start time" value={startTime} onChange={setStartTime} />
            <TextField type="date" label="End date" value={endDate} onChange={setEndDate} />
            <TextField type="time" label="End time" value={endTime} onChange={setEndTime} />
          </InlineGrid>
          <TextField label="Promotion description" value={description} onChange={setDescription} multiline={4} />
          <ColorPickerField value={color} onChange={setColor} />
          <InlineGrid columns={3} gap="400">
            <Select label="Timer size" options={sizeOpts} value={size} onChange={setSize as any} />
            <Select label="Timer position" options={posOpts} value={position} onChange={setPosition as any} />
            <Select label="Urgency notification" options={urgencyOpts} value={urgency} onChange={setUrgency as any} />
          </InlineGrid>
        </InlineStack>
      </Modal.Section>
    </Modal>
  );
}
