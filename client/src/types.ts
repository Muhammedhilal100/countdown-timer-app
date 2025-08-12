export type Timer = {
  _id?: string;
  shop: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  color: string;
  size: 'small' | 'medium' | 'large';
  position: 'top' | 'bottom';
  urgency: 'none' | 'colorPulse' | 'banner';
};
