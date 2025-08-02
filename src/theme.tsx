import type { DefaultTheme } from "styled-components";
import "styled-components";

export const lightTheme: DefaultTheme = {
  background: "#f8f9fa",
  text: "#202124",
  primary: "#1a73e8",
  secondary: "#e8f0fe",
  border: "#dadce0",
};

export const darkTheme: DefaultTheme = {
  background: "#1b1b1d",
  text: "#e9e9e9",
  primary: "#a8c7fa",
  secondary: "#37393b",
  border: "#505257",
};

declare module "styled-components" {
  export interface DefaultTheme {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    border: string;
  }
}
