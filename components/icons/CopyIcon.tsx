import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function CopyIcon({ width = 28, height = 28, fill = '#000' }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Path d="M18 22H8V9C8 8.45 7.55 8 7 8C6.45 8 6 8.45 6 9V22C6 23.1 6.9 24 8 24H18C18.55 24 19 23.55 19 23C19 22.45 18.55 22 18 22ZM23 18V6C23 4.9 22.1 4 21 4H12C10.9 4 10 4.9 10 6V18C10 19.1 10.9 20 12 20H21C22.1 20 23 19.1 23 18ZM21 18H12V6H21V18Z" fill={fill}/>
    </Svg>
  );
}
