import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export default function CloseIcon({ width = 28, height = 28, fill = '#000' }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Path d="M19.3795 7.27419C19.7508 6.9086 20.3493 6.9086 20.7206 7.27419C21.0918 7.63232 21.0919 8.22862 20.7282 8.58673L15.2352 13.9964L20.7206 19.4052C21.0919 19.7707 21.0919 20.3603 20.7206 20.7259C20.3493 21.0913 19.7507 21.0914 19.3795 20.7259L14 15.4293L8.62051 20.7259C8.24929 21.0914 7.65077 21.0913 7.27945 20.7259C6.90816 20.3603 6.90816 19.7707 7.27945 19.4052L12.7648 13.9964L7.27182 8.58673C6.9081 8.2286 6.90816 7.63231 7.27945 7.27419C7.65075 6.9086 8.24922 6.9086 8.62051 7.27419L14 12.5699L19.3795 7.27419Z" fill={fill}/>
    </Svg>
  );
}
