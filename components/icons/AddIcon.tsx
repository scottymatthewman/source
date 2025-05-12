import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function AddIcon({ width = 28, height = 28, fill = '#000' }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Path d="M13 15V22C13 22.2833 13.096 22.5207 13.288 22.712C13.4793 22.904 13.7167 23 14 23C14.2833 23 14.521 22.904 14.713 22.712C14.9043 22.5207 15 22.2833 15 22V15H22C22.2833 15 22.521 14.904 22.713 14.712C22.9043 14.5207 23 14.2833 23 14C23 13.7167 22.9043 13.479 22.713 13.287C22.521 13.0957 22.2833 13 22 13H15V6C15 5.71667 14.9043 5.479 14.713 5.287C14.521 5.09567 14.2833 5 14 5C13.7167 5 13.4793 5.09567 13.288 5.287C13.096 5.479 13 5.71667 13 6V13H6C5.71667 13 5.47933 13.0957 5.288 13.287C5.096 13.479 5 13.7167 5 14C5 14.2833 5.096 14.5207 5.288 14.712C5.47933 14.904 5.71667 15 6 15H13Z" fill={fill} />
    </Svg>
  );
}
