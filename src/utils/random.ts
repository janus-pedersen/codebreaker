import { Ip } from "./../types";
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
  return `${randomNumber(10, 255)}.${randomNumber(10, 255)}.${randomNumber(
    10,
    255
  )}.${randomNumber(10, 255)}` as Ip;
}

export function randomString(len: number = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let str = "";
  for (let i = 0; i < len; i++) {
    str += chars.charAt(randomNumber(0, chars.length - 1));
  }
  return str;
}

export function randomBusinessName() {
  const names = [
    "Bloom Marketing",
    "Hearty Pancake",
    "The Auto DNA",
    "Urban Philosophy",
    "Raven",
    "Gourmet Sandwich",
    "Office Tile",
    "The Crunchy Croissant",
    "Smart Phone Repair",
    "Ready Continental",
    "Fix Guru",
    "Service Scientist",
    "House Brush",
    "Hospital Tutor",
    "Art Fade",
    "Office Brush",
    "Brew Bean",
    "Trendy Scissor",
    "My Vegetarian Dinner",
    "Bean Morning",
    "Beep Sports",
    "Clean Scissor",
    "Urban Safari",
    "Active Body",
    "Evergrow",
    "The Loop",
    "The Fresh Breakfast",
    "Gawk Beauty",
    "The Glow Up",
    "Wood Works",
    "My Plumber",
    "Gadget Man",
    "Smart Fitness",
    "Urban Gallery",
    "Sky Tours",
    "Puff Lounge",
    "Easy Wings",
    "Zip Ride",
    "The Spice Route",
    "Garden Store",
    "Think Ink",
    "First Step",
    "The Fresh Breakfast",
    "Death By Milkshake",
    "Brunchies",
    "Satan's Sister",
    "The Zone",
    "Garden Glow",
    "Coal Kings",
    "Panic Room",
    "The Bunker",
    "The Vault",
    "The Safe House",
  ];

  return names[randomNumber(0, names.length - 1)];
}

export function randomPerson() {
  const names = [
    "Jordyn Dunn",
    "Ronin Charles",
    "Amber Chen",
    "Ellis Doyle",
    "Ryann Marquez",
    "Semaj Lamb",
    "Yurem Downs",
    "Iliana Hensley",
    "Kyler Gross",
    "Devin Gray",
    "Isaias Brewer",
    "Kristian Esparza",
    "Tatiana Shields",
    "Noemi Pitts",
    "Ruben Fowler",
    "Santos Lawrence",
    "Harrison Castaneda",
    "Aubrie Leon",
    "Cecilia Hansen",
    "Fernanda Hickman",
    "Kiara Baird",
    "Briley Chan",
    "Zackary Ward",
    "Justice Pineda",
    "Kobe Huff",
    "Donna Tanner",
    "Sidney Ferrell",
    "Cecilia Roberts",
    "Elianna Mendez",
    "Zion Reid",
    "Lena Guerrero",
    "Maxim Cuevas",
    "Alexis Mayo",
    "Savanah Ortiz",
    "Phoenix Dorsey",
    "Kyle Schaefer",
    "Kale Mcclure",
    "Denzel Frost",
    "Caroline Padilla",
    "Kiersten Murphy",
    "Aliana Mcdowell",
    "Miles Friedman",
    "Kale Chung",
    "Cora Mathis",
    "Morgan Zuniga",
    "Davon Wolf",
    "Brenden Delgado",
    "Caroline Boyer",
    "Camron Bradford",
    "Nancy Blake",
  ];

  const firstNames = names.map((name) => name.split(" ")[0]);
  const lastNames = names.map((name) => name.split(" ")[1]);

  return {
    firstName: firstNames[randomNumber(0, firstNames.length - 1)],
    lastName: lastNames[randomNumber(0, lastNames.length - 1)],
  };
}
