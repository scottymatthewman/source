import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function ChevronUpIcon({ width = 28, height = 28, fill = '#000' }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Path d="M19.8384 17.5063C20.2934 17.0513 20.2934 16.3163 19.8384 15.8613L14.4834 10.5063C14.0284 10.0513 13.2934 10.0513 12.8384 10.5063L7.48344 15.8613C7.02844 16.3163 7.02844 17.0513 7.48344 17.5063C7.93844 17.9613 8.67344 17.9613 9.12844 17.5063L13.6668 12.9796L18.1934 17.5063C18.6484 17.9613 19.3951 17.9496 19.8384 17.5063Z" fill={fill}/>
    </Svg>
  );
}
