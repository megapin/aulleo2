export const fields = [
	// ['market', '종목'],
	['code', '종목'], 
	['prev_closing_price', '전일종가'],
	// ['trade_date', '거래일'], ['trade_time', '거래시'], ['trade_date_kst', '거래일(한국)'], ['trade_time_kst', '거래시(한국)'], ['trade_timestamp', '최근거래타임스탬프'],
	['opening_price', '시가'], 
	['high_price', '최고'], 
	['low_price', '최저'], 
	['trade_price', '거래가'],
	// ['change', '등락'],
	['change_price', '등락가'],
	// ['change_rate', '등락률'], ['signed_change_price', '등락가(+/-)'],
	['signed_change_rate', '등락률(+/-)'], 
	['trade_volume', '거래량'],
	['acc_trade_price', '누적거래액'], 
	['acc_trade_price_24h', '누적거래액(24h)'], 
	['acc_trade_volume', '누적거래량'], 
	['acc_trade_volume_24h', '누적거래량(24h)'],
	// ['highest_52_week_price', '52주신고가'], ['highest_52_week_date', '52주신고일'], ['lowest_52_week_price', '52주신저가'], ['lowest_52_week_date', '52주신저일'], ['timestamp', '타임스탬프'],
]
export const wsFields = [ /* websocket fields */
	/* "type",*/ "code","opening_price","high_price","low_price","trade_price","prev_closing_price","acc_trade_price","change","change_price","signed_change_price",
	"change_rate","signed_change_rate","ask_bid","trade_volume","acc_trade_volume","trade_date","trade_time","trade_timestamp","acc_ask_volume","acc_bid_volume",
	"highest_52_week_price","highest_52_week_date","lowest_52_week_price","lowest_52_week_date","market_state","is_trading_suspended","delisting_date",
	"market_warning","timestamp","acc_trade_price_24h","acc_trade_volume_24h", /* "stream_type",*/
]
export const candleFields = [
	"market", "candle_date_time_utc", "candle_date_time_kst",
	"opening_price", "high_price", "low_price", "trade_price", "timestamp",
	"candle_acc_trade_price", "candle_acc_trade_volume",
	"prev_closing_price", "change_price", "change_rate", "converted_trade_price", // 일봉 
	"first_day_of_period", // 주봉, 월봉
]
export const menubars = [
	// { label: 'Home', icon: 'pi pi-home' },
	{ label: '업비트', to: '/', icon: 'pi pi-star', /* command: () => { market.value = 'KRW' }*/ },
	{ label: '빗썸', icon: 'pi pi-star', /* command: () => { market.value = 'BTC'; console.log(market, market.value) }*/ },
	{ label: '코인원', icon: 'pi pi-star', /* command: () => { market.value = 'USDT' }*/ },
	{
		label: '테스트',
		to: '/test',
		icon: 'pi pi-search',
		items: [
			{ label: 'Anims', icon: 'pi pi-bolt', route: '/anims'},
			{ label: 'Blocks', icon: 'pi pi-server' },
			{ label: 'Candle fields', icon: 'pi pi-pencil', items: candleFields.map(label => ({label}))},
			{ label: 'WebSocket fields', icon: 'pi pi-palette', items: wsFields.map(x => ({label: x, icon: ''})) }
		]
	},
	// { label: 'marketAni', icon: 'pi pi-envelope', route: '/marketAni' }
]
export const coins = [ /* 20241023 v1/market/all */
	{ "name": "비트코인", "code": "KRW-BTC" }, { "name": "이더리움", "code": "KRW-ETH" }, { "name": "네오", "code": "KRW-NEO" }, { "name": "메탈", "code": "KRW-MTL" }, { "name": "리플", "code": "KRW-XRP" }, 
	{ "name": "이더리움클래식", "code": "KRW-ETC" }, { "name": "스테이터스네트워크토큰", "code": "KRW-SNT" }, { "name": "웨이브", "code": "KRW-WAVES" }, { "name": "넴", "code": "KRW-XEM" }, { "name": "퀀텀", "code": "KRW-QTUM" }, 
	{ "name": "리스크", "code": "KRW-LSK" }, { "name": "스팀", "code": "KRW-STEEM" }, { "name": "스텔라루멘", "code": "KRW-XLM" }, { "name": "아더", "code": "KRW-ARDR" }, { "name": "아크", "code": "KRW-ARK" }, 
	{ "name": "스토리지", "code": "KRW-STORJ" }, { "name": "그로스톨코인", "code": "KRW-GRS" }, { "name": "에이다", "code": "KRW-ADA" }, { "name": "스팀달러", "code": "KRW-SBD" }, { "name": "파워렛저", "code": "KRW-POWR" }, 
	{ "name": "비트코인골드", "code": "KRW-BTG" }, { "name": "아이콘", "code": "KRW-ICX" }, { "name": "이오스", "code": "KRW-EOS" }, { "name": "트론", "code": "KRW-TRX" }, { "name": "시아코인", "code": "KRW-SC" }, 
	{ "name": "온톨로지", "code": "KRW-ONT" }, { "name": "질리카", "code": "KRW-ZIL" }, { "name": "폴리매쉬", "code": "KRW-POLYX" }, { "name": "제로엑스", "code": "KRW-ZRX" }, { "name": "룸네트워크", "code": "KRW-LOOM" }, 
	{ "name": "비트코인캐시", "code": "KRW-BCH" }, { "name": "베이직어텐션토큰", "code": "KRW-BAT" }, { "name": "아이오에스티", "code": "KRW-IOST" }, { "name": "시빅", "code": "KRW-CVC" }, { "name": "아이큐", "code": "KRW-IQ" }, 
	{ "name": "아이오타", "code": "KRW-IOTA" }, { "name": "하이파이", "code": "KRW-HIFI" }, { "name": "온톨로지가스", "code": "KRW-ONG" }, { "name": "가스", "code": "KRW-GAS" }, { "name": "센티넬프로토콜", "code": "KRW-UPP" }, 
	{ "name": "엘프", "code": "KRW-ELF" }, { "name": "카이버네트워크", "code": "KRW-KNC" }, { "name": "비트코인에스브이", "code": "KRW-BSV" }, { "name": "쎄타토큰", "code": "KRW-THETA" }, { "name": "쿼크체인", "code": "KRW-QKC" }, 
	{ "name": "비트토렌트", "code": "KRW-BTT" }, { "name": "모스코인", "code": "KRW-MOC" }, { "name": "쎄타퓨엘", "code": "KRW-TFUEL" }, { "name": "디센트럴랜드", "code": "KRW-MANA" }, { "name": "앵커", "code": "KRW-ANKR" }, 
	{ "name": "아르고", "code": "KRW-AERGO" }, { "name": "코스모스", "code": "KRW-ATOM" }, { "name": "썬더코어", "code": "KRW-TT" }, { "name": "게임빌드", "code": "KRW-GAME2" }, { "name": "무비블록", "code": "KRW-MBL" }, 
	{ "name": "왁스", "code": "KRW-WAXP" }, { "name": "헤데라", "code": "KRW-HBAR" }, { "name": "메디블록", "code": "KRW-MED" }, { "name": "밀크", "code": "KRW-MLK" }, { "name": "에스티피", "code": "KRW-STPT" }, 
	{ "name": "오브스", "code": "KRW-ORBS" }, { "name": "비체인", "code": "KRW-VET" }, { "name": "칠리즈", "code": "KRW-CHZ" }, { "name": "스톰엑스", "code": "KRW-STMX" }, { "name": "디카르고", "code": "KRW-DKA" }, 
	{ "name": "하이브", "code": "KRW-HIVE" }, { "name": "카바", "code": "KRW-KAVA" }, { "name": "아하토큰", "code": "KRW-AHT" }, { "name": "체인링크", "code": "KRW-LINK" }, { "name": "테조스", "code": "KRW-XTZ" }, 
	{ "name": "보라", "code": "KRW-BORA" }, { "name": "저스트", "code": "KRW-JST" }, { "name": "크로노스", "code": "KRW-CRO" }, { "name": "토카막네트워크", "code": "KRW-TON" }, { "name": "솔라", "code": "KRW-SXP" }, 
	{ "name": "헌트", "code": "KRW-HUNT" }, { "name": "폴카닷", "code": "KRW-DOT" }, { "name": "엠블", "code": "KRW-MVL" }, { "name": "스트라티스", "code": "KRW-STRAX" }, { "name": "알파쿼크", "code": "KRW-AQT" }, 
	{ "name": "골렘", "code": "KRW-GLM" }, { "name": "메타디움", "code": "KRW-META" }, { "name": "피르마체인", "code": "KRW-FCT2" }, { "name": "코박토큰", "code": "KRW-CBK" }, { "name": "샌드박스", "code": "KRW-SAND" }, 
	{ "name": "히포크랏", "code": "KRW-HPO" }, { "name": "도지코인", "code": "KRW-DOGE" }, { "name": "스트라이크", "code": "KRW-STRIKE" }, { "name": "펀디엑스", "code": "KRW-PUNDIX" }, { "name": "플로우", "code": "KRW-FLOW" }, 
	{ "name": "엑시인피니티", "code": "KRW-AXS" }, { "name": "스택스", "code": "KRW-STX" }, { "name": "이캐시", "code": "KRW-XEC" }, { "name": "솔라나", "code": "KRW-SOL" }, { "name": "폴리곤에코시스템토큰", "code": "KRW-POL" }, 
	{ "name": "에이브", "code": "KRW-AAVE" }, { "name": "1인치네트워크", "code": "KRW-1INCH" }, { "name": "알고랜드", "code": "KRW-ALGO" }, { "name": "니어프로토콜", "code": "KRW-NEAR" }, { "name": "아발란체", "code": "KRW-AVAX" }, 
	{ "name": "쓰레스홀드", "code": "KRW-T" }, { "name": "셀로", "code": "KRW-CELO" }, { "name": "스테픈", "code": "KRW-GMT" }, { "name": "앱토스", "code": "KRW-APT" }, { "name": "시바이누", "code": "KRW-SHIB" }, 
	{ "name": "마스크네트워크", "code": "KRW-MASK" }, { "name": "아비트럼", "code": "KRW-ARB" }, { "name": "멀티버스엑스", "code": "KRW-EGLD" }, { "name": "수이", "code": "KRW-SUI" }, { "name": "더그래프", "code": "KRW-GRT" }, 
	{ "name": "블러", "code": "KRW-BLUR" }, { "name": "이뮤터블엑스", "code": "KRW-IMX" }, { "name": "세이", "code": "KRW-SEI" }, { "name": "미나", "code": "KRW-MINA" }, { "name": "크레딧코인", "code": "KRW-CTC" }, 
	{ "name": "아스타", "code": "KRW-ASTR" }, { "name": "스페이스아이디", "code": "KRW-ID" }, { "name": "피스네트워크", "code": "KRW-PYTH" }, { "name": "맨틀", "code": "KRW-MNT" }, { "name": "아카시네트워크", "code": "KRW-AKT" }, 
	{ "name": "제타체인", "code": "KRW-ZETA" }, { "name": "바운스토큰", "code": "KRW-AUCTION" }, { "name": "스타게이트파이낸스", "code": "KRW-STG" }, { "name": "빔", "code": "KRW-BEAM" }, { "name": "타이코", "code": "KRW-TAIKO" }, 
	{ "name": "테더", "code": "KRW-USDT" }, { "name": "온도파이낸스", "code": "KRW-ONDO" }, { "name": "레이어제로", "code": "KRW-ZRO" }, { "name": "블라스트", "code": "KRW-BLAST" }, { "name": "주피터", "code": "KRW-JUP" }, 
	{ "name": "이더리움네임서비스", "code": "KRW-ENS" }, { "name": "그래비티", "code": "KRW-G" }, { "name": "펜들", "code": "KRW-PENDLE" }, { "name": "에이셔", "code": "KRW-ATH" }, { "name": "유에스디코인", "code": "KRW-USDC" }, 
	{ "name": "유엑스링크", "code": "KRW-UXLINK" }, { "name": "빅타임", "code": "KRW-BIGTIME" }, { "name": "너보스", "code": "KRW-CKB" }, { "name": "웜홀", "code": "KRW-W" }, { "name": "카브", "code": "KRW-CARV" }, 
	{ "name": "인젝티브", "code": "KRW-INJ" }, { "name": "캣인어독스월드", "code": "KRW-MEW" }, { "name": "유니스왑", "code": "KRW-UNI" },
]
export const favors = [
	{name: '비트코인', code: 'KRW-BTC'},
	{name: '이더리움', code: 'KRW-ETH'},
	{name: '솔라나', code: 'KRW-SOL'},
	{name: '리플', code: 'KRW-XRP'},
	{name: '이더리움클래식', code: 'KRW-ETC'},
	{name: '시바이누', code: 'KRW-SHIB'},
	{name: '앱토스', code: 'KRW-APT'},
	{name: '에이다', code: 'KRW-ADA'},
	{name: '스택스', code: 'KRW-STX'},
	{name: '니어프로토콜', code: 'KRW-NEAR'},
	{name: '아비트럼', code: 'KRW-ARB'},
	{name: '디센트럴랜드', code: 'KRW-MANA'},
	{name: '폴카닷', code: 'KRW-DOT'},
	{name: '코스모스', code: 'KRW-ATOM'},
]

export const overviews = [
	[
		{sparkline: 'up', label: '상승', key: 'signed_change_rate', filt: (x) => x.signed_change_price > 0, bgColor: 'bg-orange-600', color: 'text-red-600'},
		{sparkline: 'down', label: '하락', key: 'signed_change_rate', filt: (x) => 0 > x.signed_change_price, bgColor: 'bg-sky-600', color: 'text-blue-600'}
	],
	[
		{sparkline: 'upAbove', label: '상승 2.73% 이상', key: 'signed_change_rate', filt: (x) => x.signed_change_rate > 2.73/100, bgColor: 'bg-red-700', color: ''},
		{sparkline: 'downAbove', label: '하락 1.83% 이상', key: 'signed_change_rate', filt: (x) => -1.83/100 > x.signed_change_rate, bgColor: 'bg-blue-700', color: ''},
	],
	[
		{sparkline: 'accTradePriceAbove5', label: '거래 5억 이상', key: 'acc_trade_price', filt: (x) => x.acc_trade_price > 5*1e8, bgColor: 'bg-orange-300', color: ''},
		{sparkline: 'accTradePriceAbove15', label: '거래 15억 이상', key: 'acc_trade_price', filt: (x) => x.acc_trade_price > 15*1e8, bgColor: 'bg-orange-500', color: ''}
	],
	[
		{sparkline: 'marketAccTradePrice', label: '누적거래액', key: 'acc_trade_price', bgColor: 'bg-[#14bb51]', color: ''},
		{sparkline: 'marketAccTradePrice24h', label: '누적거래액(24h)', key: 'acc_trade_price_24h', bgColor: 'bg-[#8f46c5]', color: ''}
	],
]
export const dockItems = ref([
	{ label: 'Finder', icon: 'https://primefaces.org/cdn/primevue/images/dock/finder.svg' },
	{ label: 'App Store', icon: 'https://primefaces.org/cdn/primevue/images/dock/appstore.svg' },
	{ label: 'Photos', icon: 'https://primefaces.org/cdn/primevue/images/dock/photos.svg' },
	{ label: 'Trash', icon: 'https://primefaces.org/cdn/primevue/images/dock/trash.png' }
])
