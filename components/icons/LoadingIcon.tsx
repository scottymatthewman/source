import React from 'react';
import Svg, { Rect } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function LoadingIcon({ width = 28, height = 28, fill = '#000' }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Rect x="13" y="4" width="2" height="6" rx="1" fill={fill} />
      <Rect x="13" y="18" width="2" height="6" rx="1" fill={fill} />
      <Rect x="4" y="13" width="6" height="2" rx="1" fill={fill} />
      <Rect x="18" y="13" width="6" height="2" rx="1" fill={fill} />
    </Svg>
  );
}