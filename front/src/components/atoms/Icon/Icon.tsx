/// <reference types="vite-plugin-svgr/client" />
import Icons from "../../../assets/svg/icons.svg?react";

interface IconProps {
  name: string;
}

export default function Icon({ name }: IconProps) {
  return (
    <Icons title={name} id={name}>
      <use xlinkHref={`#${name}`}></use>
    </Icons>
  );
}
