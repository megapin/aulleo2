/*
const body = {
    amount: '10000',
    two_factor_type: 'naver'
}
const query = queryEncode(body)
const hash = crypto.createHash('sha512')
const queryHash = hash.update(query, 'utf-8').digest('hex')
const payload = {
    access_key: access_key,
    nonce: uuidv4(),
    query_hash: queryHash,
    query_hash_alg: 'SHA512',
}
const token = sign(payload, secret_key)
const options = {
    method: "POST",
    url: server_url + "/v1/withdraws/krw",
    headers: {Authorization: `Bearer ${token}`},
    json: body
}
*/

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

	const query = querystring.encode(body)
	const hash = createHash('sha512')
	const query_hash = hash.update(query, 'utf-8').digest('hex')

	const payload = { access_key, nonce, query_hash, query_hash_alg: 'SHA512', }
	const token = jwt.sign(payload, secret_key)
	const url = server_url + "/withdraws/krw"
	const option = {
		method: 'POST',
		headers: {Authorization: `Bearer ${token}`},
		body,
	}
	const res = await $fetch(url, option)
	return res

// {
//   "type": "withdraw",
//   "uuid": "9f432943-54e0-40b7-825f-b6fec8b42b79",
//   "currency": "KRW",
//   "txid": "ebe6937b-130e-4066-8ac6-4b0e67f28adc",
//   "state": "processing",
//   "created_at": "2018-04-13T11:24:01+09:00",
//   "done_at": null,
//   "amount": "10000",
//   "fee": "0.0",
//   "transaction_type": "default"
// }


	/*
	if (body.states) {
		const endTime = '2023-01-01T10:00:00+09:00'
		const {market, states} = body

		const non_array_body = {market}
		const array_body = {states}
		const body3 = {...non_array_body, ...array_body}

		const states_query = states.map(state => `states[]=${state}`).join('&')
		const query = querystring.encode(non_array_body) +'&'+ states_query
		const hash = createHash('sha512')
		const query_hash = hash.update(query, 'utf-8').digest('hex')

		const payload = { access_key, nonce, query_hash, query_hash_alg: 'SHA512' }
		const token = jwt.sign(payload, secret_key)
		const url = server_url + "/orders/closed?" + query
		const option = {
			method: "GET",
			headers: {Authorization: `Bearer ${token}`},
			body3
		}
		const res = await $fetch(url, option)
		return res
	}
	else if (body.uuids) {
		const uuids = body.uuids
		const array_body = { uuids: uuids, }
		const body2 = { ...array_body }

		const query = body.uuids.map(x => `uuids[]=${x}`).join('&')
		const hash = createHash('sha512')
		const query_hash = hash.update(query, 'utf-8').digest('hex')

		const payload = { access_key, nonce, query_hash, query_hash_alg: 'SHA512' }
		const token = jwt.sign(payload, secret_key)
		const url = server_url + '/orders/uuids?' + query
		const option = {
			method: 'GET',
			headers: {Authorization: `Bearer ${token}`},
			body2
		}
		const res = await $fetch(url, option)
		return res
	}
	else {
		const query = querystring.encode(body)
		const hash = createHash('sha512')
		const query_hash = hash.update(query, 'utf-8').digest('hex')

		const payload = { access_key, nonce, query_hash, query_hash_alg: 'SHA512', }
		const token = jwt.sign(payload, secret_key)
		const url = server_url + '/orders'
		const option = {
			method: 'POST',
			headers: {Authorization: `Bearer ${token}`},
			body,
		}
		const res = await $fetch(url, option)
		return res
	}
	*/

	// let query, url, jsonBody, method
	// if (body.states) {
	// 	const endTime = '2023-01-01T10:00:00+09:00'
	// 	const {market, states} = body
	// 	const non_array_body = {market}
	// 	const array_body = {states}
	// 	jsonBody = {...non_array_body, ...array_body}
	// 	const states_query = states.map(state => `states[]=${state}`).join('&')
	// 	query = querystring.encode(non_array_body) +'&'+ states_query
	// 	url = server_url + "/orders/closed?" + query
	// 	method = 'GET'
	// }
	// else if (body.uuids) {
	// 	const uuids = body.uuids
	// 	const array_body = { uuids: uuids, }
	// 	jsonBody = { ...array_body }
	// 	query = body.uuids.map(x => `uuids[]=${x}`).join('&')
	// 	url = server_url + '/orders/uuids?' + query
	// 	method = 'GET'
	// }
	// else {
	// 	query = querystring.encode(body)
	// 	url = server_url + '/orders'
	// 	jsonBody = body
	// 	method = 'POST'
	// }
	//
	// const hash = createHash('sha512')
	// const query_hash = hash.update(query, 'utf-8').digest('hex')
	// const payload = { access_key, nonce, query_hash, query_hash_alg: 'SHA512', }
	// const token = jwt.sign(payload, secret_key)
	// const option = {
	// 	method,
	// 	headers: {Authorization: `Bearer ${token}`},
	// 	jsonBody,
	// }
	//
	// const res = await $fetch(url, option)
	// return res
})
