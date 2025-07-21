import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function ChevronLeftIcon({ width = 28, height = 28, fill = '#000' }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Path
        d="M17.1616 7.82855C16.7066 7.37355 15.9716 7.37355 15.5166 7.82855L10.1616 13.1836C9.70656 13.6386 9.70656 14.3736 10.1616 14.8286L15.5166 20.1836C15.9716 20.6386 16.7066 20.6386 17.1616 20.1836C17.6166 19.7286 17.6166 18.9936 17.1616 18.5386L12.6349 14.0002L17.1616 9.47355C17.6166 9.01855 17.6049 8.27189 17.1616 7.82855Z"
        fill={fill}
      />
    </Svg>
  );
}
