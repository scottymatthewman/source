import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SortIconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function SortIcon({ width = 10, height = 18, fill = '#000000' }: SortIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 10 18" fill="none">
      <Path d="M2.12902 6.64756L4.61061 3.81146C4.81675 3.57587 5.18325 3.57587 5.38939 3.81146L7.87098 6.64756C8.1637 6.9821 7.92612 7.50567 7.48159 7.50567H2.51841C2.07388 7.50567 1.8363 6.9821 2.12902 6.64756Z" fill={fill} />
      <Path d="M2.12902 10.4334L4.61061 13.2695C4.81675 13.5051 5.18325 13.5051 5.38939 13.2695L7.87098 10.4334C8.1637 10.0989 7.92612 9.57529 7.48159 9.57529H2.51841C2.07388 9.57529 1.8363 10.0989 2.12902 10.4334Z" fill={fill} />
    </Svg>
  );
} 