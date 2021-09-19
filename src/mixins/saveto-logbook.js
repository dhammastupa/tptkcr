import { db } from 'src/boot/firebase'
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState('auth', ['uid', 'email']),
    ...mapGetters('auth', ['userName'])
  },
  methods: {
    saveToLogbook (collection, action, collectionReference, details) {
      db.collection('logbook').add({
        collection,
        collectionReference,
        action,
        details,
        userName: this.userName,
        createdOn: this.$Timestamp.now()
      })
    }
  }
}
