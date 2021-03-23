<template>
  <q-page padding>
    <!-- datatable -->
    <div class="q-pa-md">
      <q-table
        :grid="$q.screen.xs"
        :title="$t($options.name)"
        :data="groups"
        :columns="columns"
        :filter="filter"
        row-key="id"
        @row-click="onRowClick"
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" :placeholder="$t('systemLabel.search')">
            <template v-slot:append>
              <q-icon name="search" />
              <q-btn flat color="white" text-color="primary" round icon="add"
                class="q-ma-md"
                @click="onCreateBtnClick" />
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
        <q-banner inline-actions
          :class="{ 'text-white': true, 'bg-primary': action=='update', 'bg-secondary': action=='create' }">
          <q-icon v-if="action=='create'" name="add" size="sm" />
          <q-icon v-else name="drive_file_rename_outline" size="sm" />
          {{ $t($options.name) }}
          <template v-slot:action>
            <q-btn dense flat icon="close" v-close-popup />
          </template>
        </q-banner>

        <q-card-section>
          <q-form v-if="group"
            ref="groupForm"
            @submit="onSubmit"
            class="q-gutter-md"
          >
            <q-input
              filled
              v-model="group.role"
              :label="$t('accessControl.role')"
              :readonly="this.action == 'update'"
              lazy-rules
              :rules="[ val => val && val.length > 0 || $t('systemLabel.requiredField')]"
            />

            <q-input
              filled
              v-model="group.description"
              :label="$t('accessControl.description')"
              lazy-rules
              :rules="[ val => val && val.length > 0 || $t('systemLabel.requiredField')]"
            />

            <q-select
              filled
              v-model="group.user"
              :options="userOption"
              :label="$t('systemLabel.userList')"
              multiple use-chips
              emit-value
              map-options
            />

            <q-select
              filled
              v-model="group.permission"
              multiple use-chips
              :options="permissionOption"
              :label="$t('systemLabel.permissionList')"
            />

            <q-input
              v-if="group.createdOn"
              :value="group.createdOn | toDateTime"
              :label="$t('systemLabel.createdOn')"
              readonly
            />

            <q-input
              v-if="group.updatedOn"
              :value="group.updatedOn | toDateTime"
              :label="$t('systemLabel.updatedOn')"
              readonly
            />

            <div align="right">
              <q-checkbox
                v-if="action=='update'"
                class="q-pr-lg"
                keep-color
                v-model="deleteAction"
                :label="$t('systemLabel.checkToDelete')"
                color="red" />
              <q-btn :label="$t('systemLabel.submit')" type="submit" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { db } from 'src/boot/firebase'
import { mapGetters } from 'vuex'
import { showMessage } from 'src/functions/function-show-message'
import timestamp2Datetime from 'src/mixins/filter-timestamp-datetime'

export default {
  name: 'accessControl.group',
  mixins: [timestamp2Datetime],
  data () {
    return {
      dialog: false,
      action: 'add',
      deleteAction: false,
      filter: '',
      groups: [],
      group: {
        role: '',
        description: '',
        user: [],
        permission: [],
        createdOn: this.$Timestamp.now(),
        createdBy: this.userName,
        updatedOn: this.$Timestamp.now(),
        updatedBy: this.userName
      },
      userOption: [],
      permissionOption: []
    }
  },
  firestore: {
    groups: db.collection('group')
  },
  computed: {
    ...mapGetters('auth', ['userName']),
    columns () {
      const columns = [
        {
          name: 'role',
          field: 'role',
          label: this.$t('accessControl.role'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'description',
          field: 'description',
          label: this.$t('accessControl.description'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'createdOn',
          field: 'createdOn',
          format: val => `${new Date(val.toDate()).toDateString()}`,
          label: this.$t('systemLabel.createdOn'),
          sortable: true,
          align: 'left'
        }
      ]
      return columns
    }
  },
  methods: {
    onRowClick (evt, row) {
      this.$bind('group', db.collection('group').doc(row.id))
        .then(() => {
          this.dialog = true
          this.action = 'update'
          this.deleteAction = false
        })
    },
    onCreateBtnClick () {
      this.dialog = true
      this.action = 'create'
      this.deleteAction = false
      this.group = {
        role: '',
        description: '',
        user: [],
        permission: [],
        createdOn: this.$Timestamp.now(),
        createdBy: this.userName,
        updatedOn: this.$Timestamp.now(),
        updatedBy: this.userName
      }
    },
    onSubmit () {
      this.$refs.groupForm.validate().then(success => {
        if (success) {
          if (this.action === 'create') {
            db.collection('group').doc(this.group.role).set({
              role: this.group.role,
              description: this.group.description,
              user: this.group.user,
              permission: this.group.permission,
              createdOn: this.$Timestamp.now(),
              createdBy: this.userName,
              updatedOn: this.$Timestamp.now(),
              updatedBy: this.userName
            }).then(() => {
              showMessage('systemMessage.infoTitle', 'systemMessage.success')
            }).catch(error => {
              showMessage('systemMessage.errorTitle', 'systemMessage.error')
              console.log(error)
            })
          } else if (this.action === 'update') {
            if (this.deleteAction) {
              this.$firestoreRefs.group.delete()
            } else {
              this.$firestoreRefs.group.update({
                role: this.group.role,
                description: this.group.description,
                user: this.group.user,
                permission: this.group.permission,
                updatedOn: this.$Timestamp.now(),
                updatedBy: this.userName
              }).then(() => {
                showMessage('systemMessage.infoTitle', 'systemMessage.success')
              }).catch(error => {
                showMessage('systemMessage.errorTitle', 'systemMessage.error')
                console.log(error)
              })
            }
          }
        } else {
          showMessage('systemMessage.errorTitle', 'systemMessage.error')
        }
      })
    }
  },
  created () {
    db.collection('user').get()
      .then(snapshot => {
        snapshot.forEach(element => {
          this.userOption.push({
            value: element.id,
            label: element.data().email
          })
        })
      })
    db.collection('permission').get()
      .then(snapshot => {
        snapshot.forEach(element => {
          this.permissionOption.push(element.id)
        })
      })
  }
}
</script>
