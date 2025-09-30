import {v4 as uuidv4} from 'uuid'
import jwt from 'jsonwebtoken'
import { createHash } from 'node:crypto'
import querystring from 'querystring'

export default defineEventHandler(async (e) => {
	const c = useRuntimeConfig(e)

	const access_key = c.upbit.acc_key
	const secret_key = c.upbit.sec_key
	// const server_url = c.public.upbit 
	const server_url = 'https://api.upbit.com/v1'
	const nonce = uuidv4()

	const body = await readBody(e)
	// const paramQuery = getQuery(e)

	// let url, query_hash, bodyx, method = 'GET'
	// if (e.method == 'DELETE') {
	// 	const query = querystring.encode(body)
	// 	query_hash = createHash('sha512').update(query, 'utf-8').digest('hex')
	//
	// 	url = server_url + "/order?" + query
	// 	bodyx = body
	// 	method = 'DELETE'
	// }
	// else if (body.states) {
	// 	// const start_time = ''
	// 	// const end_time = '2023-01-01T10:00:00+09:00'
	// 	const {market, end_time, states} = body
	//
	// 	// 'closed?states=done&states=cancel&start_time=7%EC%9D%BC%20%EC%A0%84&limit=100&order_by=desc'
	// 	const states_query = states.map(state => `states[]=${state}`).join('&')
	// 	const query = market ? querystring.encode({market}) +'&'+ states_query
	// 		: querystring.encode() +'&'+ states_query // +'&end_time='+ end_time
	// 	query_hash = createHash('sha512').update(query, 'utf-8').digest('hex')
	//
	// 	url = server_url + "/orders/closed?" + query
	// 	bodyx = {market, end_time, states}
	// }
	// else if (body.uuids) {
	// 	const {uuids} = body
	//
	// 	const query = uuids.map(x => `uuids[]=${x}`).join('&')
	// 	query_hash = createHash('sha512').update(query, 'utf-8').digest('hex')
	//
	// 	url = server_url + '/orders/uuids?' + query
	// 	bodyx = {uuids}
	// }
	// else {
	// 	console.log(body)
	// 	const query = querystring.encode(body)
	// 	const hash = createHash('sha512')
	// 	query_hash = hash.update(query, 'utf-8').digest('hex')
	//
	// 	url = server_url + '/orders'
	// 	bodyx = body
	// 	method = 'POST'
	// }
	// const payload = {access_key, nonce, query_hash, query_hash_alg: 'SHA512'}
	// const token = jwt.sign(payload, secret_key)
	// const headers = {Authorization: `Bearer ${token}`}
	// const option = {method, headers, bodyx}
	//
	// return await $fetch(url, option)


	// let url, option
	if (e.method == 'DELETE') {
		const query = querystring.encode(body)
		const query_hash = createHash('sha512').update(query, 'utf-8').digest('hex')

		const payload = { access_key, nonce, query_hash, query_hash_alg: 'SHA512' }
		const token = jwt.sign(payload, secret_key)
		const headers = {Authorization: `Bearer ${token}`}

		const option = { method: "DELETE", headers, body }
		const url = server_url + "/order?" + query

		return await $fetch(url, option)
	}
	else if (body.states) {
		const endTime = '2023-01-01T10:00:00+09:00'
		const {market, states} = body

		const states_query = states.map(state => `states[]=${state}`).join('&')
		// const query = querystring.encode({market}) +'&'+ states_query
		const query = querystring.encode() +'&'+ states_query
		const query_hash = createHash('sha512').update(query, 'utf-8').digest('hex')

		const payload = { access_key, nonce, query_hash, query_hash_alg: 'SHA512' }
		const token = jwt.sign(payload, secret_key)
		const headers = {Authorization: `Bearer ${token}`}

		const option = { method: "GET", headers, body3: {market, states} }
		const url = server_url + "/orders/closed?" + query

		return await $fetch(url, option)
	}
	else if (body.uuids) {
		const {uuids} = body

		const query = uuids.map(x => `uuids[]=${x}`).join('&')
		const query_hash = createHash('sha512').update(query, 'utf-8').digest('hex')

		const payload = { access_key, nonce, query_hash, query_hash_alg: 'SHA512' }
		const token = jwt.sign(payload, secret_key)
		const headers = {Authorization: `Bearer ${token}`}

		const option = { method: 'GET', headers, body2: {uuids} }
		const url = server_url + '/orders/uuids?' + query

		return await $fetch(url, option)
	}
	else {
		const query = querystring.encode(body)
		const hash = createHash('sha512')
		const query_hash = hash.update(query, 'utf-8').digest('hex')

		const payload = { access_key, nonce, query_hash, query_hash_alg: 'SHA512' }
		const token = jwt.sign(payload, secret_key)

		const url = server_url + '/orders'
		const option = { 
			method: "POST", 
			headers: {Authorization: `Bearer ${token}`}, 
			body 
		}

		return await $fetch(url, option)
	}

	// return await $fetch(url, option)
})
