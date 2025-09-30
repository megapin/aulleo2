export const {format: formatNumber} = Intl.NumberFormat('ko-KR', {
	notation: 'compact',
	maximumFractionDigits: 1
})

export const shuffle = (arr) => {
	// return arr.sort(() => .5 - Math.random())
	// or Fisher-Yates Shuffle
	for (let i = arr.length-1; i > 0; i--) {
		const j = ~~(Math.random() * (i+1));
		[arr[i], arr[j]] = [arr[j], arr[i]]
	}
	return arr
}

export const getUnit = (trade_price) => {
	const excepts = [
		// 다음 원화마켓 종목에 한정해 주문 가격 단위 1원으로 적용 (24.10.14 ~): 
		'KRW-ADA','KRW-ALGO','KRW-BLUR','KRW-CELO','KRW-ELF','KRW-EOS','KRW-GRS','KRW-GRT','KRW-ICX','KRW-MANA',
		'KRW-MINA','KRW-POL','KRW-SAND','KRW-SEI','KRW-STG','KRW-TRX'
	]

	// if (1 <= trade_price && trade_price <= 11) { // making sure in range 1..11
	// 	if (trade_price <= 4) alert("1 to 4");
	// 	else if (trade_price <= 8) alert("5 to 8");
	// 	else alert("9 to 11");
	// } else { alert("not in range"); }

	return trade_price < 0.0001 ? 0.00000001
		: trade_price < 0.001 ? 0.0000001
		: trade_price < 0.01 ? 0.000001
		: trade_price < 0.1 ? 0.00001
		: trade_price < 1 ? 0.0001
		: trade_price < 10 ? 0.001
		: trade_price < 100 ? 0.01
		: trade_price < 1000 ? 0.1
		: trade_price < 10000 ? 1
		: trade_price < 100000 ? 10
		: trade_price < 500000 ? 50
		: trade_price < 1000000 ? 100
		: trade_price < 2000000 ? 500
		: 1000
}

export const getVolStep = (trade_price) => {
	return trade_price > 1e8 ? 0.00001 // 1e-5
		: trade_price > 1e7 ? 0.0001
		: trade_price > 1e6 ? 0.001
		: trade_price > 1e5 ? 0.01
		: trade_price > 1e4 ? 0.1
		: trade_price > 1e3 ? 1
		: trade_price > 1e2 ? 10
		: trade_price > 1e1 ? 100
		: 1000
}

export const shortNo = (num) => {
	return num > 1e6 ? ~~(num/1e3)+'K' 
		: num > 999 ? ~~num
		: num > 99 ? num.toFixed(1)
		: num > 0.01 ? num.toFixed(4)
		: num.toFixed(2)
}

export const shortVol = (trade_price, vol) => 
	trade_price > 1e8 ? +vol.toFixed(5) 
		: trade_price > 1e7 ? vol.toFixed(4)
		: trade_price > 1e6 ? vol.toFixed(3)
		: trade_price > 1e5 ? vol.toFixed(2)
		: trade_price > 1e4 ? vol.toFixed(1)
		: trade_price > 1e3 ? vol.toFixed(1)
		: vol.toFixed()

export const shortChartPrice = (val) =>
	val > 1e12 ? ~~(val/1e12) +'T' 
		: val > 1e9 ? ~~(val/1e9) +'B' 
		: val > 1e7 ? ~~(val/1e6) +'M' 
		: val > 1e4 ? ~~(val/1e3) +'K' 
		: val > 999 ? ~~val 
		: val > 99 ? val.toFixed(1) 
		: val.toFixed(2)
export const shortChartVol = (val) => {
	return val > 1e12 ? ~~(val/1e12) +'T' 
		: val > 1e9 ? ~~(val/1e9) +'B' 
		: val > 1e7 ? ~~(val/1e6) +'M' 
		: val > 1e4 ? ~~(val/1e3) +'K' 
		: val > 999 ? ~~val 
		: val > 99 ? val.toFixed(1) 
		: val.toFixed(2)
}

export const textColor = (tf) => (!tf || tf < 0) ? 'text-blue-700' : 'text-red-600' 

import {format, formatDistanceToNow} from 'date-fns'
import {ko} from 'date-fns/locale'

export const formatDate = (date) => {
	// const au = useAuStore()
	// const pb = usePb()
	// const res = await pb.getFullList('upbit_orders')
  const d = new Date(date);
  const now = Date.now();
  const diff = (now - d.getTime()) / 1000; // 현재 시간과의 차이(초)
  if (diff < 60 * 1) { // 1분 미만일땐 방금 전 표기
    return "방금 전";
  }
  if (diff < 60 * 60 * 24 * 7) { // 3일 미만일땐 시간차이 출력(몇시간 전, 몇일 전)
		return formatDistanceToNow(d, {addSuffix: true, locale: ko});
  }
  // return format(d, 'PPP EEE p', {locale: ko}); // 날짜 포맷: PPP(2024년..), EEE(요일), p(hh:mm)
  return format(d, 'MM-dd hh', {locale: ko}) 
}

// Generic helper function that can be used for the three operations:        
// const operation = (prop, arr1, arr2, isUnion = false) => arr1.filter(
// 	(set => a => isUnion === set.has(a[prop]))(new Set(arr2.map(b => b[prop])))
// );
// const inBoth = (prop, arr1, arr2) => operation(prop, arr1, arr2, true),
// inFirstOnly = operation,
// inSecondOnly = (prop, arr1, arr2) => inFirstOnly(prop, arr2, arr1);
export const venn = (prop, arr1, arr2, intersect=true) => arr1.filter(x => 
	intersect === new Set(arr2.map(y => y[prop])).has(x[prop]))

