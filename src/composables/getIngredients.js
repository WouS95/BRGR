import {ref} from 'vue'
import {projectFirestore} from '../firebase/config'

const getIngredients = () => {
    const restaurantIngredients = ref([])
    const error = ref(null)

    const load = async () => {
      try {
        const res = await projectFirestore.collection('ingredients').get()
        restaurantIngredients.value = res.docs.map(doc => {
          return { ...doc.data(), id: doc.id}
        })
      }
      catch(err){
        error.value = err.message
        console.log(error.value)  
      }
    }

    return {restaurantIngredients, error, load}
}

export default getIngredients