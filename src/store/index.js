import { createStore } from 'vuex'
import auth from './modules/auth'
import lostAndFound from './modules/lostAndFound'
import suitRental from './modules/suitRental'
import userManagement from './modules/userManagement'

export default createStore({
  modules: {
    auth,
    lostAndFound,
    suitRental,
    userManagement
  }
})
