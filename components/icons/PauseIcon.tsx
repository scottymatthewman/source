import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function PauseIcon({ width = 28, height = 28, fill = '#000' }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Path d="M8 9.33333C8 8.59695 8.59695 8 9.33333 8H10.4167C11.153 8 11.75 8.59695 11.75 9.33333V18.6667C11.75 19.403 11.153 20 10.4167 20H9.33333C8.59695 20 8 19.403 8 18.6667V9.33333Z" fill={fill}/>
      <Path d="M16.25 9.33333C16.25 8.59695 16.8096 8 17.5 8H18.75C19.4404 8 20 8.59695 20 9.33333V18.6667C20 19.403 19.4404 20 18.75 20H17.5C16.8096 20 16.25 19.403 16.25 18.6667V9.33333Z" fill={fill}/>
    </Svg>
  );
}
