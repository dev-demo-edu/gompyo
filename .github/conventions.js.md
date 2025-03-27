# Conventions

- [Package Manager](#package-manager)
- [Git Convention](#git-convention)
  - [Branch Type Description](#branch-type-description)
  - [Commit Message Convention](#commit-message-convention)
  - [Issue Label Setting](#issue-label-setting)
- [Code Style Convention](#code-style-convention)
  - [prettier](#prettier)
  - [pre-commit](#pre-commit)
- [NextJS Convention](#nextjs-convention)
  - [File Convention](#file-convention)
  - [Function/Variable Convention](#functionvariable-convention)
  - [Component Convention](#component-convention)
  - [Directory Convention](#directory-convention)
    - [src/app](#srcapp)
    - [src/containers](#srccontainers)
    - [src/components](#srccomponents)
    - [src/constants](#srcconstants)
    - [src/hooks](#srchooks)
    - [src/libs](#srclibs)
    - [src/services](#srcservices)
    - [src/states](#srcstates)
    - [src/types](#srctypes)
  - [Testing Environment](#testing-environment)
    - [Jest](#jest)
- [Module Convention](#module-convention)
  - [ShadCN Component](#shadcn-component)
  - [Lucide React](#lucide-react)

## Package Manager

[pnpm](https://pnpm.io/)을 사용합니다.

## Git Convention

- 깃 브랜치 전략은 [GitFlow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)를 따르며 이를 기반으로 한 브랜치 네이밍 컨벤션을 사용합니다.
- 브랜치 네이밍 형식: `type/[branch/]description[-#issue]`
  - [] 안의 내용은 선택 사항입니다.
  - `type`: 브랜치 타입
  - `branch`: 분기한 브랜치명 (e.g. `dev`, `main`)
  - `description`: 브랜치 설명
  - `issue`: 관련된 이슈 번호

### Branch Type Description

- **feat** (feature)
  새로운 기능을 추가할 때 사용합니다.
  예: `feat/login-#123`
- **fix** (bug fix)
  버그를 수정할 때 사용합니다.
  예: `fix/button-click-#456`
- **docs** (documentation)
  문서 작업(README, 주석 등)을 할 때 사용합니다.
  예: `docs/api-docs-#789`
- **style** (formatting, missing semi colons, …)
  코드 스타일(포맷 수정, 세미콜론 추가 등)을 수정할 때 사용합니다. 기능 수정은 포함되지 않습니다.
  예: `style/css-format-#101`
- **refactor**
  코드 리팩토링(기능 변경 없이 코드 구조 개선)을 할 때 사용합니다.
  예: `refactor/auth-service-#102`
- **test** (when adding missing tests)
  테스트 코드를 추가하거나 수정할 때 사용합니다.
  예: `test/unit-tests-#103`
- **chore** (maintain)
  프로젝트 유지 보수 작업(빌드 설정, 패키지 업데이트 등)을 할 때 사용합니다.
  예: `chore/dependency-update-#104`

### Commit Message Convention

`git config --local commit.template .github/.gitmessage` 명령어를 통해 커밋 메시지 템플릿을 설정할 수 있습니다.
컨벤션 내용은 [AngularJS Git Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)와 [Conventional Commits](https://www.conventionalcommits.org/ko/v1.0.0/)을 기반으로 작성되어 있으며 `.gitmessage` 파일에 작성되어 있습니다.

### Issue Label Setting

`github-label-sync --access-token <access_token> --labels .github/labels.json <owner>/<repo>`

## Code Style Convention

- [Prettier](https://prettier.io/)와 [ESLint](https://eslint.org/)를 사용하여 코드 스타일을 관리합니다.

### [prettier](https://prettier.io/docs/options)

```json
{
  "printWidth": 80, // 한 줄의 최대 길이
  "tabWidth": 2, // 들여쓰기에 사용할 공백 수
  "useTabs": false, // 탭 대신 공백 사용
  "singleQuote": false, // 문자열에 쌍따옴표 사용
  "semi": true, // 문장 끝에 세미콜론 사용
  "endOfLine": "lf", // 줄바꿈

  "proseWrap": "preserve", // 마크다운 텍스트 안 건드리기
  "bracketSpacing": true, // 객체 리터럴에서 괄호에 공백 삽입
  "arrowParens": "always", // 화살표 함수 인자에 괄호 사용
  "htmlWhitespaceSensitivity": "css", // HTML 파일의 공백 처리 방식
  "jsxSingleQuote": false, // JSX에서 쌍따옴표 사용
  "jsxBracketSameLine": false, // 여는 태그의 `>`를 다음 줄로 내림
  "quoteProps": "as-needed", // 객체 속성 이름에 따옴표가 필요한 경우에만 따옴표 사용
  "trailingComma": "all", // 마지막 요소 뒤에 쉼표 사용
  "overrides": [
    {
      "files": "*.json",
      "options": {
        "printWidth": 200
      }
    }
  ]
}
```

### pre-commit

```shell
pnpm install --save-dev husky prettier eslint lint-staged eslint-config-prettier

pnpm dlx husky-init
pnpm pkg set scripts.prepare="husky install"
pnpm run prepare
chmod +x .husky/*
```

`package.json`에 추가

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

`.husky/pre-commit` 수정

```shell
. "$(dirname -- "$0")/_/husky.sh"

pnpm dlx lint-staged
```

## NextJS Convention

### File Convention

- `kebab-case` 로 작성합니다.
- `not-found.js`, `date-picker.js` 처럼, 최대한 간결하게 하되, 단어 사이는 [하이픈으로 연결](https://nextjs.org/docs/app/api-reference/file-conventions)합니다.

### Function/Variable Convention

- `camelCase` 로 작성합니다.
- TypeScript 타입은 반드시 정의해야 합니다.

### Component Convention

- `PascalCase` 로 작성합니다.
- Component는 재사용 가능하도록 설계해야 합니다.

### Directory Convention

nextjs에서는 여러 디렉토리 구조를 사용할 수 있지만, [`app` 외부에 프로젝트 파일 저장](https://nextjs.org/docs/app/getting-started/project-structure#store-project-files-outside-of-app)하는 방법을 사용합니다.

- [Next.js 폴더/파일 구조 잡기](https://miriya.net/blog/cliz752zc000lwb86y5gtxstu)
- [NextJS 14 Folder Structure](https://medium.com/@mertenercan/nextjs-13-folder-structure-c3453d780366)
- [Project structure and organization](https://nextjs.org/docs/app/getting-started/project-structure)

#### src/app

- 라우팅 용으로 사용한다. (라우팅과 관련된 파일만 넣어놓는다)
- e.g., `page.tsx`, `layout.tsx`, `opengraph-image.tsx`

#### src/containers

- `page.tsx` 안에서 보여줄 컨텐츠들을 넣어놓는다.

#### src/components

- 여러 페이지에서 공통으로 사용할 컴포넌트
- Button, Loading...

#### src/constants

- 공통으로 사용 할 상수

#### src/hooks

- 페이지 곳곳에서 사용되는 공통 훅

#### src/libs

- 외부 라이브러리를 모아둔다. package.json때문에 쓸 일이 많지 않지만 튜닝해서 사용할 경우 발생

#### src/services

- DB CRUD함수들
- CREATE, GET, DELETE...

#### src/states

- 페이지 곳곳에서 사용되는 state를 모아두는 곳
- 전역 상태관리 남발하지 않는다. (props drilling을 막기 위해서는 `Jotai`를 사용)

#### src/types

- 각종 타입 스크립트의 정의가 들어가는 곳

### Testing Environment

- [NetxJS/Testing](https://nextjs.org/docs/pages/building-your-application/testing)

#### Jest

- [Setting ui Jest with NextJS](https://nextjs.org/docs/pages/building-your-application/testing/jest)

```bash
pnpm install -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node

pnpm create jest@latest
```

## Module Convention

### ShadCN Component

- 모든 UI 컴포넌트는 ShadCN을 사용해야 합니다.
- 컴포넌트 사용 전 설치 여부를 확인해야 합니다: `/component/ui` 디렉토리 체크
- 컴포넌트 설치 명령어를 사용해야 합니다: `pnpx shadcn@latest add [component-name]`

### Heroicons

- 모든 아이콘은 Heroicons를 사용해야 합니다.
- 아이콘 임포트 방법: `import { IconName } from '@heroicons/react/24/outline';`
- 예시: `import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';`
