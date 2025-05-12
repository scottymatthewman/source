import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function PlayIcon({ width = 28, height = 28, fill = '#000' }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Path d="M9.25 7.87299V20.1273C9.25 21.0617 10.2791 21.6295 11.0716 21.1209L20.7 14.9937C21.4333 14.5324 21.4333 13.4679 20.7 12.9947L11.0716 6.87939C10.2791 6.37077 9.25 6.93854 9.25 7.87299Z" fill={fill}/>
    </Svg>
  );
}
