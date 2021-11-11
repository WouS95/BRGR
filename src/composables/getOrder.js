import { ref } from 'vue'
import { projectFirestore } from '../firebase/config'


const getOrder = (id) => {

const order = ref(null)
const error = ref(null)

  // register the firestore collection reference
  let collectionRef = projectFirestore.collection('orders').doc(id)

  // updates the data when it is changed
  collectionRef.onSnapshot(snap => {
      // stores the snapshot inside the variable
      order.value = snap.data()
    }, err => {
    console.log(err.message)
    order.value = null
    error.value = 'could not fetch the data'
  })

  
    return { error, order}
}
// exports function that returns the order and error
export default getOrder