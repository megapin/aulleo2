import {v4 as uuidv4} from 'uuid'
import jwt from 'jsonwebtoken'
import { createHash } from 'node:crypto'
import querystring from 'querystring'

export default defineEventHandler(async (e) => {
	const c = useRuntimeConfig(e)

	const access_key = c.upbit.acc_key
	const secret_key = c.upbit.sec_key
	const server_url = c.public.upbit // 'https://api.upbit.com/v1'
	const nonce = uuidv4()

	const body = await readBody(e)
	// const paramQuery = getQuery(e)

	let query, url, jsonBody, method = 'GET'

	if (body.states) { // get asked price
		// const endTime = '2023-01-01T10:00:00+09:00' //???
		const {market, states} = body
		const states_query = states.map(state => `states[]=${state}`).join('&')
		query = querystring.encode({market}) +'&'+ states_query
		url = server_url + "/orders/closed?" + query
		jsonBody = {market, states}
	}
	else if (body.uuids) { // get price & volume
		const {uuids} = body
		query = uuids.map(x => `uuids[]=${x}`).join('&')
		url = server_url + '/orders/uuids?' + query
		jsonBody = {uuids}
	}
	else { // buy & sell
		query = querystring.encode(body)
		url = server_url + '/orders'
		jsonBody = body
		method = 'POST'
	}

	const hash = createHash('sha512')
	const query_hash = hash.update(query, 'utf-8').digest('hex')
	const payload = { access_key, nonce, query_hash, query_hash_alg: 'SHA512' }
	const token = jwt.sign(payload, secret_key)
	const headers = {Authorization: `Bearer ${token}`}
	const option = { method, headers, body: jsonBody }

	const res = await $fetch(url, option)
	return res
})
