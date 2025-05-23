import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function AIcon({ width = 24, height = 24, fill = '#000' }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_1036_6336)">
        <Path d="M16.7992 20.0003C15.6747 20.0003 14.7422 19.0937 14.7422 18.0004V16.0005H9.2567V18.0004C9.2567 19.0937 8.32416 20.0003 7.19964 20.0003C6.07511 20.0003 5.14258 19.0937 5.14258 18.0004V6.66753C5.14258 5.20093 6.37681 4.00098 7.88532 4.00098H16.1136C17.6221 4.00098 18.8563 5.20093 18.8563 6.66753V18.0004C18.8563 19.0937 17.9238 20.0003 16.7992 20.0003ZM14.7422 8.00081H9.2567V12.0007H14.7422V8.00081Z" fill={fill} />
      </G>
      <Defs>
        <ClipPath id="clip0_1036_6336">
          <Rect width={24} height={24} fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}