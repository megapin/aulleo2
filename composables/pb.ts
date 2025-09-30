import PocketBase from 'pocketbase'
import { useErrorHandler } from '../utils/errorHandler'

export const usePb = () => {
	const pb = new PocketBase('http://anais.mheen.net/pb')
	const { apiCall } = useErrorHandler()
	
	const getFirstListItem = async (coll: string, opt?: any) => {
		return await apiCall(
			() => pb.collection(coll).getFirstListItem(opt),
			null,
			`${coll} 데이터를 가져오는데 실패했습니다.`
		)
	}

	const getFullList = async (coll: string, opt?: any) => {
		return await apiCall(
			() => pb.collection(coll).getFullList(opt),
			[],
			`${coll} 목록을 가져오는데 실패했습니다.`
		)
	}

	const create = async (coll: string, data: any) => {
		return await apiCall(
			() => pb.collection(coll).create(data),
			null,
			`${coll}에 데이터를 생성하는데 실패했습니다.`
		)
	}

	const update = async (coll: string, id: string, data: any) => {
		return await apiCall(
			() => pb.collection(coll).update(id, data),
			null,
			`${coll} 데이터를 업데이트하는데 실패했습니다.`
		)
	}

	const detach = async (coll: string, id: string) => {
		return await apiCall(
			() => pb.collection(coll).delete(id),
			null,
			`${coll} 데이터를 삭제하는데 실패했습니다.`
		)
	}

	return {
		pb,
		getFirstListItem,
		getFullList,
		create,
		update,
		detach,
	}
}
