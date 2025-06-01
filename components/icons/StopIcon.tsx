import React from 'react';
import Svg, { Rect } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function StopIcon({ width = 28, height = 28, fill = '#242424' }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Rect x="8" y="8" width="12" height="12" rx="1" fill={fill} />
    </Svg>
  );
}