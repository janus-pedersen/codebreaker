import { createElement } from "react";
import { TerminalOutput } from "react-terminal-ui";
import { randomString } from "../utils/random";
import { wait } from "../utils/wait";
import { System } from "./System";

export interface TerminalEvents {
  input: (input: string) => void;
  setup: () => void;
  render: () => void;
}

export class Terminal {
  public history: TerminalOutput[] = [];
  public commandHistory: string[] = [];
  public prompt: string = "";
  public readonly system: System;
  private ignoreNextN = 0;

  private listeners: Map<keyof TerminalEvents, Function[]> = new Map();

  public constructor(system: System) {
    this.system = system;

    this.on("setup", () => {
      this.updatePrompt();
      this.clear();
    });
  }

  public on<K extends keyof TerminalEvents>(
    event: K,
    callback: TerminalEvents[K]
  ) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    const callbacks = this.listeners.get(event);
    if (!callbacks) return; // This should never happen (but TS doesn't know that
    return callbacks.push(callback);
  }

  public off<K extends keyof TerminalEvents>(
    event: K,
    callback: TerminalEvents[K]
  ) {
    if (!this.listeners.has(event)) {
      return;
    }

    const callbacks = this.listeners.get(event);
    if (!callbacks) return; // This should never happen (but TS doesn't know that
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  public once<K extends keyof TerminalEvents>(
    event: K,
    callback: TerminalEvents[K]
  ) {
    const onceCallback = (...args: any[]) => {
      this.off(event, onceCallback);
      (callback as any)(...(args as any[]));
    };
    this.on(event, onceCallback);
  }

  public emit<K extends keyof TerminalEvents>(event: K, ...args: any[]) {
    if (!this.listeners.has(event)) {
      return;
    }

    const callbacks = this.listeners.get(event);
    if (!callbacks) return; // This should never happen (but TS doesn't know that
    callbacks.forEach((callback) => {
      callback(...args);
    });
  }

  public blank(n: number = 1) {
    for (let i = 0; i < n; i++) {
      this.basic(" ", false);
    }
  }

  public basic(message: string, withPrompt = true) {
    this.pushColored("LightGray", message, withPrompt);
  }

  public info(message: string, withPrompt = true) {
    this.pushColored("DarkCyan", message, withPrompt);
  }

  public error(message: string, withPrompt = true) {
    this.pushColored("Tomato", message, withPrompt);
  }

  public success(message: string, withPrompt = true) {
    this.pushColored("ForestGreen", message, withPrompt);
  }

  public printTable(rows: string[], items: string[][]) {
    const padding = 6;
    const widths: number[] = [];
    items.forEach((item) => {
      item.forEach((value, index) => {
        if (!widths[index]) {
          widths[index] = 0;
        }
        widths[index] = Math.max(widths[index], value.length);
      });
    });

    const table: string[] = [];
    items.forEach((item) => {
      const row: string[] = [];
      item.forEach((value, index) => {
        row.push(value.padEnd(widths[index] + padding));
      });
      table.push(row.join(""));
    });

    this.info(rows.map((row, index) => row.padEnd(widths[index] + padding)).join(""), false);
    this.basic(table.join("\n"), false);
  }

  public async wait(ms: number): Promise<void> {
    const time = new Date().getTime();

    const timeMultiplier = this.system.upgrades.reduce(
      (acc, upgrade) => acc * upgrade.timeMultiplier,
      1
    );

    const targetTime = time + ms * timeMultiplier;
    const barLength = 30;

    const empty = " ";
    const full = "#";

    const key = randomString(20);

    while (new Date().getTime() <= targetTime) {
      const progress =
        Math.round(
          ((new Date().getTime() - time) / (ms * timeMultiplier)) * barLength
        ) || 0;
      const newLine = createElement(
        "span",
        { key: key},
        "[" +
          full.repeat(progress) +
          empty.repeat(barLength - progress) +
          "] (" +
          Math.round((progress / barLength) * 100) +
          "%",
        timeMultiplier !== 1
          ? createElement(
              "span",
              { style: { color: "DarkCyan" } },
              ` x${timeMultiplier}`
            )
          : "",
        ")"
      );
      this.history = this.history.filter((x) => x.key !== key);
      this.pushHistory(newLine as any, false);

      await wait(1);
    }

    this.history = this.history.filter((x) => x.key !== key);
  }

  public pushStyled(
    style: React.CSSProperties,
    message: string,
    withPrompt = true
  ) {
    this.pushHistory(
      createElement(
        "span",
        { style },
        [
          withPrompt
            ? createElement(
                "span",
                { style: { color: "#a2a2a2" } },
                this.prompt + " "
              )
            : undefined,
          message,
        ].filter((x) => x)
      ) as any,
      withPrompt
    );
  }

  public pushColored(color: string, message: string, withPrompt = true) {
    this.pushStyled({ color }, message, withPrompt);
  }

  public pushHistory(
    value: string | React.ComponentElement<any, any>,
    withPrompt: boolean = true
  ) {
    const component =
      typeof value === "string"
        ? createElement(
            "span",
            { key: this.history.length },
            withPrompt ? `${this.prompt} ${value}` : value
          )
        : value;
    this.history.push(component);
    this.emit("render");
  }

  public ignoreNext(n: number = 1) {
    this.ignoreNextN += n;
  }

  public shouldIgnore() {
    if (this.ignoreNextN > 0) {
      this.ignoreNextN--;
      return true;
    }
    return false;
  }

  public ask(question: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.pushHistory(
        createElement(
          "span",
          { style: { color: "teal" } },
          "? ",
          createElement("span", { style: { color: "white" } }, question)
        ) as any,
        false
      );
      this.ignoreNext();
      this.once("input", (input: string) => {
        this.info("  " + input);
        resolve(input);
      });
    });
  }

  public clear() {
    this.history.length = 0;
    this.info(`Your ip is: ${this.system.ip}`, false);
    this.basic(
      "Your system is ready. Type 'help' for a list of commands. \n",
      false
    );
    this.blank();
    this.emit("render");
  }

  public updatePrompt() {
    this.prompt =
      this.system.user.name +
      "@" +
      (this.system.currentDirectory || "/") +
      " $";
  }

  public handleInput(input: string) {
    this.emit("input", input);
  }
}
