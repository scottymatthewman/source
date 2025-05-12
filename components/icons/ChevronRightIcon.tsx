import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function ChevronRightIcon({ width = 28, height = 28, fill = '#000' }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Path d="M10.1627 7.82855C10.6177 7.37355 11.3527 7.37355 11.8077 7.82855L17.1627 13.1836C17.6177 13.6386 17.6177 14.3736 17.1627 14.8286L11.8077 20.1836C11.3527 20.6386 10.6177 20.6386 10.1627 20.1836C9.70766 19.7286 9.70766 18.9936 10.1627 18.5386L14.6893 14.0002L10.1627 9.47355C9.70766 9.01855 9.71932 8.27189 10.1627 7.82855Z" fill={fill}/>
    </Svg>
  );
}
