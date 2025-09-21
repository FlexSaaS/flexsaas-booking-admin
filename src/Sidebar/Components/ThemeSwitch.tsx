import styled from "styled-components";

interface ThemeSwitchProps {
  checked: boolean; // true if dark mode is enabled
  onChange: () => void; // callback to toggle theme
}

/**
 * ThemeSwitch component
 * ---------------------
 * A toggle switch for switching between light and dark themes.
 * Displays a sun (stars) when light mode and a cloud when dark mode.
 */
export function ThemeSwitch({ checked, onChange }: ThemeSwitchProps) {
  const starPositions = [
    { top: "0.5em", left: "2.5em" },
    { top: "1.2em", left: "2.2em" },
    { top: "0.9em", left: "3em" },
  ];

  return (
    <Switch>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <Slider checked={checked}>
        {/* Sun stars for light mode */}
        {starPositions.map((pos, idx) => (
          <Star key={idx} {...pos} checked={checked} />
        ))}

        {/* Cloud for dark mode */}
        <Cloud viewBox="0 0 16 16" checked={checked}>
          <path
            transform="matrix(.77976 0 0 .78395-299.99-418.63)"
            fill="#fff"
            d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
          />
        </Cloud>
      </Slider>
    </Switch>
  );
}

// Styled Components
const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 4em;
  height: 2.2em;
  border-radius: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const Slider = styled.span<{ checked: boolean }>`
  position: absolute;
  inset: 0;
  border-radius: 30px;
  overflow: hidden;
  background-color: ${({ checked }) => (checked ? "#1a73e8" : "#2a2a2a")};
  transition: 0.4s;
  cursor: pointer;

  &::before {
    content: "";
    position: absolute;
    height: 1.2em;
    width: 1.2em;
    border-radius: 50%;
    left: 0.5em;
    bottom: 0.5em;
    box-shadow: ${({ checked }) =>
      checked ? "inset 15px -4px 0 15px #ffcf48" : "inset 8px -4px 0 0 #fff"};
    transition: 0.4s cubic-bezier(0.81, -0.04, 0.38, 1.5);
    transform: ${({ checked }) => (checked ? "translateX(1.8em)" : "none")};
  }
`;

const Star = styled.div<{ top: string; left: string; checked: boolean }>`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #fff;
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  opacity: ${({ checked }) => (checked ? 0 : 1)};
  transition: all 0.4s;
`;

const Cloud = styled.svg<{ checked: boolean }>`
  position: absolute;
  width: 3.5em;
  bottom: -1.4em;
  left: -1.1em;
  opacity: ${({ checked }) => (checked ? 1 : 0)};
  transition: all 0.4s;
`;
