"use client";

import { useState } from "react";
import { CircleHelp } from "lucide-react";
import {
  Field,
  Icon,
  Tooltip,
  Textfield,
  Textarea,
  Password,
  Select,
  MultiSelect,
  Datepicker,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Switch,
  type SelectOption,
  type SingleSelectValue,
  type MultiSelectValue,
} from "@nui-kit/react";
import { Search } from "@nui-kit/react/textfield";
import { Example } from "@/components/guide";

const CITIES: SelectOption[] = [
  { label: "서울", value: "seoul" },
  { label: "부산", value: "busan" },
  { label: "대구", value: "daegu" },
  { label: "인천", value: "incheon" },
];

const CHANNELS = [
  { value: "email", label: "이메일" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "앱 푸시" },
];

const PAYMENTS = [
  { value: "card", label: "신용카드" },
  { value: "transfer", label: "계좌이체" },
];

/**
 * Field 계열 다섯과 폼 컨트롤 열 개를 한 폼에 전부 놓은 데모.
 * Field 가 받는 prop 은 빠짐없이 한 번씩 쓴다 — direction · align · required ·
 * requiredLabel · optionalLabel · infoMessage · errorMessage · isError · inputId,
 * Label 의 as · htmlFor, Header 의 suffix, Grid 의 columns, Item, Message 슬롯.
 */
export function FieldFullDemo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("1234");
  const [city, setCity] = useState<SingleSelectValue>(null);
  const [interests, setInterests] = useState<MultiSelectValue>(["seoul"]);
  const [date, setDate] = useState<Date | undefined>();
  const [memo, setMemo] = useState("");
  const [keyword, setKeyword] = useState("");
  const [channels, setChannels] = useState<string[]>([]);
  const [payment, setPayment] = useState("card");
  const [night, setNight] = useState(true);
  const [agreed, setAgreed] = useState(false);

  const toggleChannel = (value: string) =>
    setChannels((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );

  return (
    <Example
      row={false}
      overflow
      caption="Field 의 prop 전부와 폼 컨트롤 열 개를 한 폼에 놓았다. 세로 간격은 Field.Grid columns={1} 이 만든다"
      code={`<Field required requiredLabel="필수 입력" infoMessage="회사 메일로 입력해 주세요">
  <Field.Header suffix={<Tooltip content="…"><span aria-label="도움말" tabIndex={0}><Icon icon={<CircleHelp />} size={16} /></span></Tooltip>}>
    <Field.Label>이메일</Field.Label>
  </Field.Header>
  <Textfield … />
</Field>`}
    >
      <form
        onSubmit={(event) => event.preventDefault()}
        style={{ maxWidth: 640 }}
      >
        {/* 세로로 쌓는 것도 Grid 다 — columns={1}. 필드는 바깥 여백을 갖지 않는다.
            data-* 는 Grid 가 DOM 에 그대로 넘긴다 */}
        <Field.Grid columns={1} data-demo="signup">
          {/* Grid columns · required(기본 문구) · requiredLabel · Header suffix · infoMessage */}
          <Field.Grid columns={2}>
            <Field required>
              <Field.Label>이름</Field.Label>
              <Textfield
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="홍길동"
                autoComplete="name"
              />
            </Field>
            <Field
              required
              requiredLabel="필수 입력"
              infoMessage="회사 메일로 입력해 주세요"
            >
              {/* Header — 좌 라벨 · 우 suffix(도움말 아이콘 16px · 라벨 색). suffix 는 label 밖이다.
                  text 버튼은 보류 — <Button type="button" variant="text">인증 메일 보내기</Button> */}
              <Field.Header
                suffix={
                  <Tooltip content="회사 도메인이 아니면 인증 메일이 반려될 수 있어요">
                    <span
                      tabIndex={0}
                      aria-label="도움말"
                      style={{
                        display: "inline-flex",
                        cursor: "help",
                        color: "var(--nui-text-primary)",
                      }}
                    >
                      <Icon icon={<CircleHelp />} size={16} />
                    </span>
                  </Tooltip>
                }
              >
                <Field.Label>이메일</Field.Label>
              </Field.Header>
              <Textfield
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
              />
            </Field>
          </Field.Grid>

          {/* optionalLabel · infoMessage */}
          <Field optionalLabel="선택" infoMessage="하이픈 없이 입력해 주세요">
            <Field.Label>휴대폰 번호</Field.Label>
            <Textfield
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="01012345678"
              autoComplete="tel"
            />
          </Field>

          {/* errorMessage — 하위 컨트롤이 에러 상태가 된다 */}
          <Field required errorMessage="8자 이상 입력해 주세요">
            <Field.Label>비밀번호</Field.Label>
            <Password
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onClear={() => setPassword("")}
              isClearable
              placeholder="8자 이상"
              autoComplete="new-password"
            />
          </Field>

          {/* Grid columns={3} · Select · MultiSelect · Datepicker */}
          <Field.Grid columns={3}>
            <Field required>
              <Field.Label>거주 지역</Field.Label>
              <Select
                options={CITIES}
                value={city}
                onChange={(next) => setCity(next)}
                placeholder="지역을 고르세요"
              />
            </Field>
            <Field optionalLabel="선택">
              <Field.Label>관심 지역</Field.Label>
              <MultiSelect
                options={CITIES}
                value={interests}
                onChange={(next) => setInterests(next)}
                placeholder="여러 곳을 고르세요"
                isClearable
              />
            </Field>
            <Field>
              <Field.Label>방문 희망일</Field.Label>
              <Datepicker
                selected={date}
                onSelectedChange={setDate}
                placeholder="날짜를 고르세요"
                isClearable
              />
            </Field>
          </Field.Grid>

          {/* direction="row" align="start" — 여러 줄 컨트롤 옆에 라벨 */}
          <Field direction="row" align="start">
            <Field.Label>요청 사항</Field.Label>
            <Textarea
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
              rows={3}
              maxLength={200}
              placeholder="배송 기사에게 전할 말"
            />
          </Field>

          {/* direction="row" align="center" — 한 줄 컨트롤 옆에 라벨 */}
          <Field direction="row" align="center">
            <Field.Label>검색어</Field.Label>
            <Search
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              onSearch={() => undefined}
              onClear={() => setKeyword("")}
              isClearable
              placeholder="상품명 · 브랜드"
            />
          </Field>

          {/* Label as="span" · isError · Message 슬롯 · Item 반복 · CheckboxGroup */}
          <Field isError={channels.length === 0}>
            <Field.Label as="span">알림 수신</Field.Label>
            <CheckboxGroup name="channel" direction="row">
              {CHANNELS.map((option) => (
                <Field.Item key={option.value} direction="row" align="center">
                  <Checkbox
                    value={option.value}
                    checked={channels.includes(option.value)}
                    onChange={() => toggleChannel(option.value)}
                  />
                  <Field.Label>{option.label}</Field.Label>
                </Field.Item>
              ))}
            </CheckboxGroup>
            <Field.Message
              data-demo="channels"
              infoMessage="받을 채널을 하나 이상 고르세요"
              errorMessage={
                channels.length === 0 ? "채널을 하나 이상 골라 주세요" : ""
              }
            />
          </Field>

          {/* Label as="span" · required 가 그룹 라벨에 · RadioGroup */}
          <Field required>
            <Field.Label as="span">결제 수단</Field.Label>
            <RadioGroup name="payment" direction="row">
              {PAYMENTS.map((option) => (
                <Field.Item key={option.value} direction="row" align="center">
                  <Radio
                    value={option.value}
                    checked={payment === option.value}
                    onChange={() => setPayment(option.value)}
                  />
                  <Field.Label>{option.label}</Field.Label>
                </Field.Item>
              ))}
            </RadioGroup>
          </Field>

          {/* inputId 를 직접 준다 · htmlFor 로 그 id 를 가리킨다 · Item 의 infoMessage */}
          <Field.Item
            inputId="night-notice"
            direction="row"
            align="center"
            infoMessage="밤 10시부터 아침 8시까지 알림을 멈춰요"
          >
            <Switch
              checked={night}
              onChange={(event) => setNight(event.target.checked)}
            />
            <Field.Label htmlFor="night-notice">야간 알림 끄기</Field.Label>
          </Field.Item>

          {/* Item 의 required · errorMessage */}
          <Field.Item
            required
            errorMessage={agreed ? "" : "약관에 동의해 주세요"}
          >
            <Checkbox
              tone="brand"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
            />
            <Field.Label>이용약관에 동의합니다</Field.Label>
          </Field.Item>
        </Field.Grid>
      </form>
    </Example>
  );
}
