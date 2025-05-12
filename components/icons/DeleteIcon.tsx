import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function DeleteIcon({ width = 28, height = 28, fill = '#000' }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Path fillRule="evenodd" clipRule="evenodd" d="M18 9C19.1 9 20 9.9 20 11V21C20 22.1 19.1 23 18 23H10C8.9 23 8 22.1 8 21V11C8 9.9 8.9 9 10 9H18ZM10 11V21H18V11H10Z" fill={fill}/>
      <Path d="M16.0898 5C16.3498 5 16.61 5.11004 16.79 5.29004L17.5 6H20C20.55 6 21 6.45 21 7C21 7.55 20.55 8 20 8H8C7.45 8 7 7.55 7 7C7 6.45 7.45 6 8 6H10.5L11.21 5.29004C11.39 5.11004 11.6502 5 11.9102 5H16.0898Z" fill={fill}/>
    </Svg>
  );
}
