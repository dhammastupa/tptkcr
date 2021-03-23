<template>
  <q-page padding>
    <!-- datatable -->
    <div class="q-pa-md">
      <q-table
        :grid="$q.screen.xs"
        :title="$t($options.name)"
        :data="users"
        :columns="columns"
        :filter="filter"
        row-key="uid"
        @row-click="onRowClick"
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" :placeholder="$t('systemLabel.search')">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
    </div>
    <!-- dialog -->
    <q-dialog
      v-model="dialog"
      position="right"
      :maximized="true"
      transition-show="slide-left"
      transition-hide="slide-right"
    >
      <q-card class="card-dialog-500">
        <q-banner inline-actions class="text-white bg-primary">
          {{ $t($options.name) }}
          <template v-slot:action>
            <q-btn dense flat icon="close" v-close-popup />
          </template>
        </q-banner>

        <q-card-section>
          <q-form v-if="user"
            ref="updateProfileForm"
            @submit="onUpdate"
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

            <q-toggle
              v-model="userEmailVerified"
              checked-icon="check"
              color="red"
              :label="$t('systemLabel.verified')"
              unchecked-icon="clear"
              disable
            />

            <q-input
              v-if="user.creationDate"
              :value="user.creationDate | toDateTime"
              :label="$t('accessControl.creationDate')"
              readonly
            />

            <q-input
              v-if="user.updatedOn"
              :value="user.updatedOn | toDateTime"
              :label="$t('systemLabel.updatedOn')"
              readonly
            />

            <div align="right">
              <q-btn :label="$t('systemLabel.submit')" type="submit" color="primary" align="center" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { db } from 'src/boot/firebase'
import { mapState } from 'vuex'
import { showMessage } from 'src/functions/function-show-message'
import timestamp2Datetime from 'src/mixins/filter-timestamp-datetime'

export default {
  name: 'accessControl.user',
  mixins: [timestamp2Datetime],
  data () {
    return {
      dialog: false,
      filter: '',
      users: [],
      user: {
        firstName: '',
        lastName: '',
        updatedOn: '',
        updatedBy: ''
      }
    }
  },
  firestore: {
    users: db.collection('user')
  },
  computed: {
    ...mapState('auth', ['userEmailVerified', 'permissionList', 'firstName', 'lastName']),
    columns () {
      const columns = [
        {
          name: 'email',
          field: 'email',
          label: this.$t('accessControl.email'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'firstName',
          field: 'firstName',
          label: this.$t('accessControl.firstName'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'lastName',
          field: 'lastName',
          label: this.$t('accessControl.lastName'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'creationDate',
          field: 'creationDate',
          format: val => `${new Date(val.toDate()).toDateString()}`,
          label: this.$t('accessControl.creationDate'),
          sortable: true,
          align: 'left'
        }
      ]
      return columns
    }
  },
  methods: {
    onRowClick (evt, row) {
      this.$bind('user', db.collection('user').doc(row.uid))
        .then(() => { this.dialog = true })
    },
    onUpdate () {
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
