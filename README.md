[![CI](https://img.shields.io/github/actions/workflow/status/Tox1469/bcrypt-mini/ci.yml?style=flat-square&label=ci)](https://github.com/Tox1469/bcrypt-mini/actions)
[![License](https://img.shields.io/github/license/Tox1469/bcrypt-mini?style=flat-square)](LICENSE)
[![Release](https://img.shields.io/github/v/release/Tox1469/bcrypt-mini?style=flat-square)](https://github.com/Tox1469/bcrypt-mini/releases)
[![Stars](https://img.shields.io/github/stars/Tox1469/bcrypt-mini?style=flat-square)](https://github.com/Tox1469/bcrypt-mini/stargazers)

---

# bcrypt-mini

API estilo bcrypt (`hash`, `compare`, `genSalt`) implementada sobre `scrypt` nativo. Ideal quando voce nao pode usar bindings nativos do bcrypt original.

## Instalacao

```bash
npm install bcrypt-mini
```

## Uso

```ts
import { hash, compare } from "bcrypt-mini";

const stored = await hash("minhaSenha", 12);
const ok = await compare("minhaSenha", stored);
```

## Seguranca

- O parametro `rounds` controla o custo de scrypt (`N = 2^rounds`).
- Nao e 100% compativel com hashes bcrypt reais (`$2a$...`) — o formato e `$bcmini$...`.
- Para ambientes em que bindings nativos sao permitidos, prefira `bcrypt` ou `argon2`.

## Licenca

MIT