# 🚀 Aulleo2 - 암호화폐 거래 대시보드

[![Nuxt 3](https://img.shields.io/badge/Nuxt-3.x-00DC82?logo=nuxt.js)](https://nuxt.com/)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?logo=tailwind-css)](https://tailwindcss.com/)

**Aulleo2**는 실시간 암호화폐 거래 데이터 모니터링과 자동화된 거래 기능을 제공하는 전문적인 웹 애플리케이션입니다.

## ✨ 주요 기능

### 📊 실시간 데이터 모니터링
- **실시간 가격 추적**: Upbit API를 통한 실시간 암호화폐 가격 정보
- **WebSocket 연결**: 지연 없는 실시간 데이터 업데이트
- **시장 요약**: 전체 시장 동향 및 변동률 추적
- **다중 거래소 지원**: Upbit, Coinbase 데이터 통합

### 📈 고급 차트 시각화
- **ApexCharts**: 전문적인 캔들스틱 차트
- **TradingView 위젯**: 업계 표준 차트 도구
- **스파크라인**: 빠른 트렌드 확인
- **다중 시간대**: 분/시간/일/주/월 차트

### 🤖 자동 거래 시스템
- **자동 매수/매도**: 설정된 조건에 따른 자동 거래
- **손절/익절**: 리스크 관리 자동화
- **레벨별 전략**: 단계적 거래 전략 실행
- **포트폴리오 관리**: 실시간 자산 현황 추적

### 🔐 보안 및 인증
- **JWT 기반 인증**: 안전한 사용자 인증
- **API 키 관리**: 환경변수를 통한 보안 키 관리
- **거래 서명**: Upbit API 표준 보안 프로토콜

## 🛠️ 기술 스택

### Frontend
- **[Nuxt 3](https://nuxt.com/)** - Vue.js 메타 프레임워크
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript Framework
- **[TypeScript](https://www.typescriptlang.org/)** - 타입 안전성
- **[Tailwind CSS](https://tailwindcss.com/)** - 유틸리티 퍼스트 CSS 프레임워크
- **[Pinia](https://pinia.vuejs.org/)** - Vue 상태 관리
- **[VueUse](https://vueuse.org/)** - Vue 컴포지션 유틸리티

### Charts & Visualization
- **[ApexCharts](https://apexcharts.com/)** - 모던 차트 라이브러리
- **[TradingView](https://www.tradingview.com/)** - 전문 트레이딩 차트

### Backend & Data
- **[PocketBase](https://pocketbase.io/)** - 백엔드 서비스
- **[Upbit API](https://docs.upbit.com/)** - 암호화폐 거래소 API
- **[Coinbase API](https://docs.cloud.coinbase.com/)** - 추가 거래소 데이터

### Testing
- **[Vitest](https://vitest.dev/)** - 단위 테스트 프레임워크
- **[Playwright](https://playwright.dev/)** - E2E 테스트 도구
- **[@vue/test-utils](https://test-utils.vuejs.org/)** - Vue 컴포넌트 테스트

## 📦 설치 및 실행

### 필수 요구사항
- Node.js 18+ 
- npm, pnpm, 또는 yarn

### 로컬 개발 환경 설정

1. **저장소 클론**
```bash
git clone https://github.com/megapin/aulleo2.git
cd aulleo2
```

2. **의존성 설치**
```bash
# npm 사용
npm install

# pnpm 사용 (권장)
pnpm install

# yarn 사용
yarn install
```

3. **환경 변수 설정**
```bash
# .env 파일 생성
cp .env.example .env
```

`.env` 파일에 다음 값들을 설정하세요:
```env
# Upbit API 키 (필수)
UPBIT_ACCESS_KEY=your_upbit_access_key
UPBIT_SECRET_KEY=your_upbit_secret_key

# PocketBase URL (선택)
POCKETBASE_URL=http://anais.mheen.net/pb
```

4. **개발 서버 실행**
```bash
# 개발 서버 시작 (http://localhost:3000)
npm run dev
```

### 프로덕션 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 미리보기
npm run preview
```

## 🧪 테스팅

### 단위 테스트
```bash
# 테스트 실행
npm run test

# 테스트 UI 모드
npm run test:ui

# 커버리지 포함 테스트
npm run test:coverage
```

### E2E 테스트
```bash
# E2E 테스트 실행
npm run test:e2e

# E2E 테스트 UI 모드
npm run test:e2e:ui
```

## 📁 프로젝트 구조

```
aulleo2/
├── 📁 assets/           # 정적 자산 (CSS, 이미지)
├── 📁 components/       # Vue 컴포넌트
│   ├── Account.vue      # 계정 관리
│   ├── MarketSummary.vue # 시장 요약
│   ├── apexCharts.vue   # 차트 컴포넌트
│   ├── Order2.vue       # 주문 인터페이스
│   └── ...
├── 📁 composables/      # Vue 컴포저블
│   ├── pb.ts            # PocketBase 연동
│   ├── trade.ts         # 거래 로직
│   ├── ticker.ts        # 실시간 데이터
│   └── ...
├── 📁 layouts/          # 레이아웃 템플릿
├── 📁 pages/            # 라우팅 페이지
├── 📁 server/           # 서버 API
│   └── api/
│       ├── order.ts     # 주문 API
│       └── account.ts   # 계정 API
├── 📁 stores/           # Pinia 상태 관리
├── 📁 tests/            # 테스트 파일
├── 📁 utils/            # 유틸리티 함수
└── 📁 data/             # 정적 데이터
```

## 🔧 주요 컴포넌트

### 📊 MarketSummary
시장 전체 요약 정보를 표시합니다.
- 상승/하락 종목 수
- 전체 변동률 합계
- 거래량 정보

### 📈 apexCharts
ApexCharts를 사용한 고급 차트 컴포넌트입니다.
- 캔들스틱 차트
- 거래량 히스토그램
- 다중 시간대 지원

### 💰 Order2
거래 주문 인터페이스입니다.
- 매수/매도 주문
- 지정가/시장가 선택
- 자동 거래 설정

### 💼 Assets
포트폴리오 및 자산 관리 컴포넌트입니다.
- 보유 자산 현황
- 손익 계산
- 자산 분포 차트

## 🔌 API 연동

### Upbit API
- **실시간 시세**: WebSocket을 통한 실시간 데이터
- **주문 관리**: 매수/매도 주문 실행
- **계정 정보**: 잔고 및 거래 내역

### PocketBase
- **사용자 설정**: 개인화된 거래 설정 저장
- **거래 기록**: 자동 거래 로그
- **백업 데이터**: 중요 정보 백업

## 🚨 에러 핸들링

프로젝트는 강력한 에러 핸들링 시스템을 포함합니다:

- **자동 재시도**: 네트워크 오류 시 자동 재시도
- **폴백 메커니즘**: API 실패 시 대체 데이터 사용
- **사용자 알림**: 브라우저 알림을 통한 오류 통지
- **로깅**: 상세한 오류 로그 기록

## 🔒 보안 고려사항

- **API 키 보호**: 환경변수를 통한 민감 정보 관리
- **CORS 설정**: 안전한 API 호출을 위한 프록시 설정
- **입력 검증**: 모든 사용자 입력에 대한 검증
- **JWT 토큰**: 안전한 인증 메커니즘

## 🤝 기여하기

1. 이 저장소를 포크하세요
2. 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 지원 및 문의

- **이슈 신고**: [GitHub Issues](https://github.com/megapin/aulleo2/issues)
- **토론**: [GitHub Discussions](https://github.com/megapin/aulleo2/discussions)

## 🙏 감사의말

- [Upbit](https://upbit.com/) - 암호화폐 거래 API 제공
- [Nuxt.js 팀](https://nuxt.com/) - 훌륭한 프레임워크
- [Vue.js 커뮤니티](https://vuejs.org/) - 지속적인 지원과 개선

---

**⚠️ 면책 조항**: 이 소프트웨어는 교육 및 개발 목적으로 제공됩니다. 실제 거래 시 발생하는 손실에 대해 개발자는 책임을 지지 않습니다. 투자는 본인의 책임 하에 신중하게 진행하세요.