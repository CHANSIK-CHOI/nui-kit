---
"@nui-kit/react": patch
---

`nui-theme --preset` · `--accent` 가 **`pnpm dlx` · `yarn dlx` · yarn PnP · pnpm 으로 설치한 프로젝트**에서도 동작합니다.

0.2.0 에서는 이 네 경로로 명령을 부르면 색 생성기의 개발용 명령까지 함께 돌았습니다.

- `--preset <번호>` 는 `…/node_modules/@nui-kit/presets.json` 을 찾지 못해 `ENOENT` 로 멈췄습니다
- `--accent <#hex>` 는 원하는 `./nui-theme.css` 와 별개로 **패키지 폴더 안에** `dist/nui-theme.css` 를 한 장 더 썼습니다. 패키지 폴더가 읽기 전용인 `yarn dlx` · yarn PnP 에서는 `EROFS` 로 멈췄습니다

npm 으로 설치한 프로젝트와 `npx` 는 영향이 없었습니다. 명령 · 옵션 · 만드는 파일은 그대로이고, 옮길 것은 없습니다. 0.2.0 을 pnpm 으로 쓰면서 `--accent` 를 돌린 적이 있다면 `node_modules` 안에 남은 `@nui-kit/react/dist/nui-theme.css` 는 쓰이지 않는 파일이라 지워도 됩니다.
