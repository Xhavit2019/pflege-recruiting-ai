import bcrypt from "bcryptjs";

export async function createPasswordHash() {
  return bcrypt.hash("123456", 10);
}

export function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}