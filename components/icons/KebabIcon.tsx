import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function KebabIcon({ width = 28, height = 28, fill = '#000' }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Path
        d="M14 10.8662C14.825 10.8662 15.5 10.1912 15.5 9.36621C15.5 8.54121 14.825 7.86621 14 7.86621C13.175 7.86621 12.5 8.54121 12.5 9.36621C12.5 10.1912 13.175 10.8662 14 10.8662ZM14 12.3662C13.175 12.3662 12.5 13.0412 12.5 13.8662C12.5 14.6912 13.175 15.3662 14 15.3662C14.825 15.3662 15.5 14.6912 15.5 13.8662C15.5 13.0412 14.825 12.3662 14 12.3662ZM14 16.8662C13.175 16.8662 12.5 17.5412 12.5 18.3662C12.5 19.1912 13.175 19.8662 14 19.8662C14.825 19.8662 15.5 19.1912 15.5 18.3662C15.5 17.5412 14.825 16.8662 14 16.8662Z"
        fill={fill}
      />
    </Svg>
  );
}
