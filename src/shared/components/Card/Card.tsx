import type { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  tone?: 'light' | 'dark';
}

export function Card({ children, className = '', tone = 'light' }: CardProps) {
  return <section className={[styles.card, styles[tone], className].filter(Boolean).join(' ')}>{children}</section>;
}
