import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function MostRecentIcon({ width = 25, height = 24, fill = '#000' }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 25 24" fill="none">
      <G clipPath="url(#clip0_1036_6342)">
        <Path d="M19.166 4H18.166V3C18.166 2.45 17.716 2 17.166 2C16.616 2 16.166 2.45 16.166 3V4H8.16602V3C8.16602 2.45 7.71602 2 7.16602 2C6.61602 2 6.16602 2.45 6.16602 3V4H5.16602C4.05602 4 3.17602 4.9 3.17602 6L3.16602 20C3.16602 21.1 4.05602 22 5.16602 22H19.166C20.266 22 21.166 21.1 21.166 20V6C21.166 4.9 20.266 4 19.166 4ZM19.166 19C19.166 19.55 18.716 20 18.166 20H6.16602C5.61602 20 5.16602 19.55 5.16602 19V9H19.166V19Z" fill={fill} />
        <Path d="M9.52602 13.1933H12.526V11.3933C12.526 10.9533 13.066 10.7333 13.376 11.0433L16.166 13.8333C16.366 14.0333 16.366 14.3433 16.166 14.5433L13.376 17.3333C13.066 17.6533 12.526 17.4333 12.526 16.9833V15.1933H9.52602C8.97602 15.1933 8.52602 14.7433 8.52602 14.1933C8.52602 13.6433 8.97602 13.1933 9.52602 13.1933Z" fill={fill} />
      </G>
      <Defs>
        <ClipPath id="clip0_1036_6342">
          <Rect width={24} height={24} fill="white" transform="translate(0.166016)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}