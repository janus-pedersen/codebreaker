import { useState } from "react";

export function useForceUpdate() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}