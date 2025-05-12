import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function FolderIcon({ width = 28, height = 28, fill = '#000' }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Path d="M6 22C5.45 22 4.97933 21.8043 4.588 21.413C4.196 21.021 4 20.55 4 20V8C4 7.45 4.196 6.97933 4.588 6.588C4.97933 6.196 5.45 6 6 6H11.175C11.4417 6 11.696 6.05 11.938 6.15C12.1793 6.25 12.3917 6.39167 12.575 6.575L14 8H22C22.55 8 23.021 8.196 23.413 8.588C23.8043 8.97933 24 9.45 24 10V20C24 20.55 23.8043 21.021 23.413 21.413C23.021 21.8043 22.55 22 22 22H6ZM6 10V20H22V10H6Z" fill={fill}/>
    </Svg>
  );
}
