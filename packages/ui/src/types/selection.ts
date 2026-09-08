/**
 * 선택 컨트롤(Checkbox · Radio · Switch)이 선택됐을 때의 채움색.
 *
 * 셋이 한 가족이라 타입도 한자리에 둔다 — 하나만 값이 늘어나면 같아 보이는 것이
 * 다르게 동작하게 된다 (components.md §9).
 *
 * - `"neutral"` 기본. 조용하다. 목록·설정처럼 여럿이 반복되는 자리
 * - `"brand"` 강조. 약관 동의·추천 항목처럼 하나만 도드라져야 하는 자리
 */
export type SelectionTone = "neutral" | "brand";
