import {v4 as uuidv4} from 'uuid'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (e) => {
	const c = useRuntimeConfig(e)

	const access_key = c.upbit.acc_key
	const secret_key = c.upbit.sec_key
	const server_url = c.public.upbit
	// const server_url = 'https://api.upbit.com/v1'

	const payload = {access_key, nonce: uuidv4()}
	const token = jwt.sign(payload, secret_key)
	const url = server_url + '/accounts'
	const option = {
		headers: {Authorization: `Bearer ${token}`}
	}
	const res = await $fetch(url, option)

	return res
})
