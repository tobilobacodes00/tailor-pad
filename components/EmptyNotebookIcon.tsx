import Svg, { Line, Path, Rect } from "react-native-svg";

type Props = {
  size?: number;
  color: string;
};

export function EmptyNotebookIcon({ size = 120, color }: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      style={{ transform: [{ rotate: "-4deg" }] }}
    >
      <Rect
        x="22"
        y="20"
        width="68"
        height="84"
        rx="6"
        stroke={color}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <Path
        d="M76 20 L96 40 L96 98 a6 6 0 0 1 -6 6 H32 a6 6 0 0 1 -6 -6 V26 a6 6 0 0 1 6 -6 Z"
        stroke={color}
        strokeWidth="3"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M76 20 L76 40 L96 40"
        stroke={color}
        strokeWidth="3"
        strokeLinejoin="round"
        fill="none"
      />
      <Line
        x1="38"
        y1="56"
        x2="74"
        y2="56"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Line
        x1="38"
        y1="70"
        x2="84"
        y2="70"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Line
        x1="38"
        y1="84"
        x2="78"
        y2="84"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}
