// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

	modules: [
		'@nuxtjs/tailwindcss',
		'nuxt-tradingview',
		'@pinia/nuxt',
		'@vueuse/nuxt',
	],
	routeRules: {
		// '/api/auth/**': { cors: true },
		'/upbit/**': { proxy: {to: 'https://api.upbit.com/v1/**'} },
		'/coinbase/**': {proxy: {to: 'https://api.exchange.coinbase.com/products/**'}}, //GST-USD/ticker'}},
	},
	tradingview: {
		prefix: 'TV', 
		importOnly: ['Chart', 'CryptoMarket', 'TopStories', 'Screener'],
	},
	css: [
		'~/assets/main.scss',
	],
	runtimeConfig: {
		upbit: {
			acc_key: process.env.UPBIT_ACCESS_KEY || '',
			sec_key: process.env.UPBIT_SECRET_KEY || '',
		},
		public: {
			// upbit: 'https://api.upbit.com/v1',
			upbit: '/upbit',
			bithumb: {
				wssPublic: 'wss://ws-api.bithumb.com/websocket/v1',
				wssPrivate: 'wss://ws-api.bithumb.com/websocket/v1/private',
			},
			coinbase: '/coinbase',
		},
	},
	vite: {
		css: {
			preprocessorOptions: {
				scss: { api: 'modern-compiler', }
			}
		},
		// server: {
		//	proxy: {
		//		'/api': {
		//			target: 'https://api.upbit.com/v1', // 실제 백엔드 서버 주소
		//			changeOrigin: true,
		//		},
		//	},
		// },
	},
})
