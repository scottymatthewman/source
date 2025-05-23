import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function MoonIcon({ width = 24, height = 24, fill = '#000' }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M6.04956 4.76314C7.8157 3.06219 9.96756 2.18931 12.1113 2.0024C12.4944 1.96596 12.7864 2.35165 12.6279 2.69718C11.2762 5.55603 11.304 9.0041 13.004 11.9486C14.704 14.8931 17.6762 16.6412 20.8279 16.9C21.215 16.9305 21.4031 17.3762 21.18 17.6898C20.3715 18.8494 19.303 19.8588 18.004 20.6088C12.7645 23.6338 5.91762 21.3746 3.65633 15.4979C2.2246 11.7981 3.18536 7.50221 6.04956 4.76314Z" fill={fill} />
    </Svg>
  );
}