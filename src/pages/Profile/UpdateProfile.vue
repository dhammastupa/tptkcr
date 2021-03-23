<template>
  <q-page class="q-pa-lg">
    <q-card class="card-dialog-500">
      <!-- หัวเรื่อง -->
      <q-card-section>
        <div class="text-bold">{{ $t($options.name) }}</div>
      </q-card-section>

      <q-separator />

      <!-- ฟอร์ม -->
      <q-card-section>
        <q-form
          ref="updateProfileForm"
          @submit="onSubmit"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="user.firstName"
            :label="$t('profile.firstName')"
            lazy-rules
            :rules="[ val => val && val.length > 0 || $t('systemLabel.requiredField')]"
          />

          <q-input
            filled
            v-model="user.lastName"
            :label="$t('profile.lastName')"
            lazy-rules
            :rules="[ val => val && val.length > 0 || $t('systemLabel.requiredField')]"
          />

          <div align="right">
            <q-btn :label="$t('systemLabel.submit')" type="submit" color="primary" align="center" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { db } from 'src/boot/firebase'
import store from 'src/store'
import { showMessage } from 'src/functions/function-show-message'

export default {
  name: 'profile.updateProfile',
  data () {
    return {
      uid: this.$store.state.auth.uid,
      user: {
        firstName: '',
        lastName: ''
      }
    }
  },
  firestore: {
    user: db.collection('user').doc(store.state.auth.uid)
  },
  methods: {
    onSubmit () {
      this.$refs.updateProfileForm.validate().then(success => {
        if (success) {
          this.$firestoreRefs.user.update({
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            updatedOn: this.$Timestamp.now(),
            updatedBy: this.user.firstName + ' ' + this.user.lastName
          }).then(() => {
            showMessage('systemMessage.infoTitle', 'systemMessage.success')
          })
        } else {
          showMessage('systemMessage.errorTitle', 'systemMessage.error')
        }
      })
    }
  }
}
</script>
