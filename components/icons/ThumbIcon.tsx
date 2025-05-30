import React from 'react';
import Svg, { Rect } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function VerticalBarIcon({ width = 24, height = 24, fill = '#242424' }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Rect x="17" y="7" width="3" height="10" rx="1.5" fill={fill} />
    </Svg>
  );
}