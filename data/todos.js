export const ideas = [
	'전일대비 상승/하락 종목수',
	'전일 동시간 대비 거래액',
	'종목 선택시 챠트',
	'상승률 상위 5 종목',
	'거래액 상위 5 종목',
	'x분간 거래량 급등 종목',
	'거래량 추이 차트',
	'체결강도',
	'자동매매 시도',
	'자동매매 안전장치',
	'Vue (CSR) & React',
	'My 지수',
	'Sparkline',
]

export const wsFields = [ /* websocket fields */
	/* "type", */ 
	"code",
	"opening_price",
	"high_price",
	"low_price",
	"trade_price",
	"prev_closing_price",
	"acc_trade_price",
	"change",
	"change_price",
	"signed_change_price",

	"change_rate",
	"signed_change_rate",
	"ask_bid",
	"trade_volume",
	"acc_trade_volume",
	"trade_date",
	"trade_time",
	"trade_timestamp",
	"acc_ask_volume",
	"acc_bid_volume",

	"highest_52_week_price",
	"highest_52_week_date",
	"lowest_52_week_price",
	"lowest_52_week_date",
	"market_state",
	"is_trading_suspended",
	"delisting_date",

	"market_warning",
	"timestamp",
	"acc_trade_price_24h",
	"acc_trade_volume_24h",
	/* "stream_type", */
]
export const candleFields = [
	"market",
	"candle_date_time_utc",
	"candle_date_time_kst",

	"opening_price",
	"high_price",
	"low_price",
	"trade_price",
	"timestamp",

	"candle_acc_trade_price",
	"candle_acc_trade_volume",

	// 일봉 
	"prev_closing_price",
	"change_price",
	"change_rate",
	"converted_trade_price",
	// 주봉, 월봉
	"first_day_of_period", 
]
