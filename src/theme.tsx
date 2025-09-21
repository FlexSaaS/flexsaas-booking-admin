import type { DefaultTheme } from "styled-components";
import "styled-components";

/**
 * Light theme colors
 */
export const lightTheme: DefaultTheme = {
  background: "#f8f9fa",
  text: "#202124",
  primary: "#1a73e8",
  secondary: "#e8f0fe",
  border: "#dadce0",
  appointmentBg: "#e8f0fe",
};

/**
 * Dark theme colors
 */
export const darkTheme: DefaultTheme = {
  background: "#1f1f22",
  text: "#e9e9e9",
  primary: "#a8c7fa",
  secondary: "#37393b",
  border: "#858891",
  appointmentBg: "#37393b",
};

/**
 * Extend styled-components DefaultTheme interface
 */
declare module "styled-components" {
  export interface DefaultTheme {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    border: string;
    appointmentBg: string;
  }
}
