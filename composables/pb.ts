import PocketBase from 'pocketbase'

export const usePb = () => {
	const pb = new PocketBase('http://anais.mheen.net/pb')
	
	const getFirstListItem = async (coll, opt) => await pb.collection(coll).getFirstListItem(opt)
	const getFullList = async (coll, opt) => await pb.collection(coll).getFullList(opt)
	const create = async (coll, data) => await pb.collection(coll).create(data)
	const update = async (coll, id, data) => await pb.collection(coll).update(id, data)
	const detach = async (coll, id) => await pb.collection(coll).delete(id)

	return {
		pb,
		getFirstListItem,
		getFullList,
		create,
		update,
		detach,
	}
}
