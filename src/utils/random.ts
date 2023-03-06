import { Ip } from './../types';
import { Pin } from "../types";

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomBoolean(): boolean {
  return Math.random() >= 0.5;
}

export function randomPin(): Pin {
  return `${randomNumber(0, 9)}${randomNumber(0, 9)}${randomNumber(
    0,
    9
  )}${randomNumber(0, 9)}` as Pin;
}

export function randomIp(): Ip {
	return `${randomNumber(0, 255)}.${randomNumber(
		0,
		255
	)}.${randomNumber(0, 255)}.${randomNumber(0, 255)}` as Ip;
}
