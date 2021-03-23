import { date } from 'quasar'

export default {
  filters: {
    toDateTime (value) {
      let creationDate = new Date(value.toDate())
      creationDate = date.formatDate(creationDate, 'YYYY-MM-DD HH:mm:ss')
      return creationDate
    }
  }
}
