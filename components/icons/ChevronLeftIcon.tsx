import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function ChevronLeftIcon({ width = 28, height = 28, fill = '#000' }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Path 
        d="M17.5 7L10.5 14L17.5 21" 
        stroke={fill}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
