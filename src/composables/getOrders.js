import { ref } from 'vue'
import { projectFirestore } from '../firebase/config'

const getOrders = () => {
  const orders = ref(null)
  const error = ref(null)

  // register the firestore collection reference
  let collectionRef = projectFirestore.collection('orders')
    .orderBy('orderTime', 'desc')

  collectionRef.onSnapshot(snap => {
    let results = [];
    snap.docs.forEach(doc => {
      // must wait for the server to create the timestamp & send it back
      // we don't want to edit data until it has done this
      doc.data().orderTime && results.push({...doc.data(), id: doc.id})
    });
    
    // update values
    orders.value = results;
    error.value = null;
  }, err => {
    console.log(err.message)
    orders.value = null
    error.value = 'could not fetch the data'
  })

  return { error, orders }
}

export default getOrders