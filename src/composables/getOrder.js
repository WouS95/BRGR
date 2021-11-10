import { ref } from 'vue'
import { projectFirestore } from '../firebase/config'


const getOrder = (id) => {

const order = ref(null)
const error = ref(null)

  // register the firestore collection reference
  let collectionRef = projectFirestore.collection('orders').doc(id)

  collectionRef.onSnapshot(snap => {
        order.value = snap.data()
    }, err => {
    console.log(err.message)
    order.value = null
    error.value = 'could not fetch the data'
  })

  
    return { error, order}
}

export default getOrder