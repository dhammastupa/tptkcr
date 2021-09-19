import { Dialog, Loading } from 'quasar'
import { i18n } from 'boot/i18n'

export function showMessage (type, message) {
  Loading.hide()
  const dialog = Dialog.create({
    title: i18n.t(type),
    message: i18n.t(message),
    html: true
  })

  setTimeout(() => {
    dialog.hide()
  }, 1500)
}
