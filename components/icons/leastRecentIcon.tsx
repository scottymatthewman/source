import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function LeastRecentIcon({ width = 25, height = 24, fill = '#000' }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 25 24" fill="none">
      <G clipPath="url(#clip0_1036_6345)">
        <Path d="M5.83398 4H6.83398V3C6.83398 2.45 7.28398 2 7.83398 2C8.38398 2 8.83398 2.45 8.83398 3V4H16.834V3C16.834 2.45 17.284 2 17.834 2C18.384 2 18.834 2.45 18.834 3V4H19.834C20.944 4 21.824 4.9 21.824 6L21.834 20C21.834 21.1 20.944 22 19.834 22H5.83398C4.73398 22 3.83398 21.1 3.83398 20V6C3.83398 4.9 4.73398 4 5.83398 4ZM5.83398 19C5.83398 19.55 6.28398 20 6.83398 20H18.834C19.384 20 19.834 19.55 19.834 19V9H5.83398V19Z" fill={fill} />
        <Path d="M15.474 13.1933H12.474V11.3933C12.474 10.9533 11.934 10.7333 11.624 11.0433L8.83398 13.8333C8.63398 14.0333 8.63398 14.3433 8.83398 14.5433L11.624 17.3333C11.934 17.6533 12.474 17.4333 12.474 16.9833V15.1933H15.474C16.024 15.1933 16.474 14.7433 16.474 14.1933C16.474 13.6433 16.024 13.1933 15.474 13.1933Z" fill={fill} />
      </G>
      <Defs>
        <ClipPath id="clip0_1036_6345">
          <Rect width={24} height={24} fill="white" transform="translate(0.833984)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}