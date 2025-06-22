import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function EmptyIcon({ width = 28, height = 28, fill = '#000' }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Path d="M6 22C5.45 22 4.97933 21.8043 4.588 21.413C4.196 21.021 4 20.55 4 20V8C4 7.45 4.196 6.97933 4.588 6.588C4.97933 6.196 5.45 6 6 6H11.175C11.4417 6 11.696 6.05 11.938 6.15C12.1793 6.25 12.3917 6.39167 12.575 6.575L14 8H22C22.55 8 23.021 8.196 23.413 8.588C23.8043 8.97933 24 9.45 24 10H6V20L7.975 13.425C8.10833 12.9917 8.35433 12.6457 8.713 12.387C9.071 12.129 9.46667 12 9.9 12H22.8C23.4833 12 24.021 12.2707 24.413 12.812C24.8043 13.354 24.9083 13.9417 24.725 14.575L22.925 20.575C22.7917 21.0083 22.546 21.3543 22.188 21.613C21.8293 21.871 21.4333 22 21 22H6ZM8.1 20H21L22.8 14H9.9L8.1 20Z" fill={fill}/>
    </Svg>
  );
}