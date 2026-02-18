
import React, { ReactNode } from 'react';

export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

export type User = {
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'editor';
};

export interface NavItem {
  icon: React.ElementType;
  label: string;
  id: string;
}

export interface Stat {
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
}

export interface Order {
  id: string;
  customer: string;
  amount: string;
  status: 'completed' | 'pending' | 'cancelled';
  date: string;
}
