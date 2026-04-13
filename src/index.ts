import { scrypt, randomBytes, timingSafeEqual } from "crypto";

const KEY_LEN = 32;
const SALT_LEN = 16;

export async function genSalt(rounds = 12): Promise<{ rounds: number; salt: Buffer }> {
  if (rounds < 4 || rounds > 20) throw new Error("rounds must be 4..20");
  return { rounds, salt: randomBytes(SALT_LEN) };
}

function derive(password: string, salt: Buffer, rounds: number): Promise<Buffer> {
  const N = 1 << rounds;
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LEN, { N, r: 8, p: 1, maxmem: 256 * 1024 * 1024 }, (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });
}

export async function hash(password: string, rounds = 12): Promise<string> {
  const { salt } = await genSalt(rounds);
  const key = await derive(password, salt, rounds);
  const r = rounds.toString().padStart(2, "0");
  return `$bcmini$${r}$${salt.toString("base64")}$${key.toString("base64")}`;
}

export async function compare(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  // ["", "bcmini", "rr", "salt", "key"]
  if (parts.length !== 5 || parts[1] !== "bcmini") return false;
  const rounds = parseInt(parts[2], 10);
  const salt = Buffer.from(parts[3], "base64");
  const expected = Buffer.from(parts[4], "base64");
  const actual = await derive(password, salt, rounds);
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function getRounds(stored: string): number {
  const parts = stored.split("$");
  if (parts.length !== 5 || parts[1] !== "bcmini") throw new Error("invalid hash");
  return parseInt(parts[2], 10);
}
