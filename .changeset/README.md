# Changesets — 변경 큐

컴포넌트 제작/수정 시 **문서 갱신·배포까지 원스텝으로 진행하지 않는다**는 원칙에 따라,
"무엇이 바뀌었는지"를 이 폴더에 쌓아두고 나중에 문서 반영·배포로 넘긴다.

```
컴포넌트 작업 → npx changeset  → .changeset/*.md 생성 (변경 큐 적재)
                                    ↓
                        (나중에) 문서 동기화 / 릴리스
```

- 변경 기록: `npm run changeset`
- 버전 반영: `npm run version-packages`
- 배포:      `npm run release`
