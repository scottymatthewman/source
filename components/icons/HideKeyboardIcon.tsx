import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

interface HideKeyboardIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function HideKeyboardIcon({ width = 28, height = 28, color = '#000' }: HideKeyboardIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <G clipPath="url(#clip0_1582_235)">
        <Path
          d="M8.49547 12.9788L12.8239 17.4905C13.4756 18.1698 14.5285 18.1698 15.1803 17.4905L19.5086 12.9788C20.5615 11.8813 19.8095 10 18.3221 10H9.66531C8.17794 10 7.44262 11.8813 8.49547 12.9788Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1582_235">
          <Rect width={28} height={28} fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}