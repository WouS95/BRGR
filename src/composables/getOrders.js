import { ref } from 'vue'
import { projectFirestore } from '../firebase/config'

const getOrders = () => {
    const documents = ref(null)
    const error = ref(null)

    let ordersRef = projectFirestore.collection('orders')
        .orderBy('orderTime')
        console.log(ordersRef)

    ordersRef.onSnapshot((snap) => {
        let results = []
        snap.docs.forEach(doc => {
            doc.data.orderTime && results.push({ ...doc.data(), id: doc.id })
        })
        documents.value = results
        error.value = null
    }), (err) => {
        console.log(err.message)
        documents.value = null
        error.value = "could not fetch data for document"
    }

    return {documents, error}
    
}

export default getOrders