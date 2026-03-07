"use client";
import React from 'react';
import './GlassIcons.css';
import Link from "next/link";
import { useWebHaptics } from "web-haptics/react";

export interface GlassIconsItem {
  icon: React.ReactElement;
  color: string;
  label: string;
  href: string;
  customClass?: string;
}

export interface GlassIconsProps {
  items: GlassIconsItem[];
  className?: string;
}

const gradientMapping: Record<string, string> = {
  blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
  purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
  red: 'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
  indigo: 'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))',
  orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
  green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))'
};

const GlassIcons: React.FC<GlassIconsProps> = ({ items, className }) => {
  const { trigger } = useWebHaptics();
  const getBackgroundStyle = (color: string): React.CSSProperties => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  return (
    <div className={`icon-btns ${className || ''}`}>
      {items.map((item, index) => (
          <Link
              key={index}
              href={item.href}
              className={`icon-btn ${item.customClass || ''}`}
              onMouseDown={() => trigger()}
              onTouchStart={() => trigger()}
          >
            <span className="icon-btn__back" style={getBackgroundStyle(item.color)}></span>

            <span className="icon-btn__front">
      <span className="icon-btn__icon" aria-hidden="true">
        {item.icon}
      </span>
    </span>

            <span className="icon-btn__label">{item.label}</span>
          </Link>
      ))}
    </div>
  );
};

export default GlassIcons;
