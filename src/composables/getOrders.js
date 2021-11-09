import { projectFirestore } from '../firebase/config'
import { ref } from 'vue'

const getOrders = () => {
    const orders = ref([])
    const error = ref(null)

    const load = async () => {
        console.log('loading')
        try{
            const res = await projectFirestore.collection('orders').get()
            orders.value = res.docs.map(doc => {
                return { ...doc.data(), id: doc.id }
            })
        } catch(err){
            error.value = err.message
            console.log(error.value)
        }
    }

    return{orders, load, error}
}

export default getOrders
