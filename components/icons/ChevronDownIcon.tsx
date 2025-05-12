import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function ChevronDownIcon({ width = 28, height = 28, fill = '#000' }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Path d="M7.48383 10.5064C7.02883 10.9614 7.02883 11.6964 7.48383 12.1514L12.8388 17.5064C13.2938 17.9614 14.0288 17.9614 14.4838 17.5064L19.8388 12.1514C20.2938 11.6964 20.2938 10.9614 19.8388 10.5064C19.3838 10.0514 18.6488 10.0514 18.1938 10.5064L13.6555 15.0331L9.12883 10.5064C8.67383 10.0514 7.92716 10.0631 7.48383 10.5064Z" fill={fill}/>
    </Svg>
  );
}
