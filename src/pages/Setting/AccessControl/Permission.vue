<template>
  <q-page padding>
    <!-- datatable -->
    <div class="q-pa-md">
      <q-table
        :grid="$q.screen.xs"
        :title="$t($options.name)"
        :data="permissions"
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
          <q-form v-if="permission"
            ref="permissionForm"
            @submit="onSubmit"
            class="q-gutter-md"
          >
            <q-input
              filled
              v-model="permission.permission"
              :label="$t('accessControl.permission')"
              lazy-rules
              :rules="[ val => val && val.length > 0 || $t('systemLabel.requiredField')]"
            />

            <q-input
              filled
              v-model="permission.description"
              :label="$t('accessControl.description')"
              lazy-rules
              :rules="[ val => val && val.length > 0 || $t('systemLabel.requiredField')]"
            />

            <q-input
              v-if="permission.createdOn"
              :value="permission.createdOn | toDateTime"
              :label="$t('systemLabel.createdOn')"
              readonly
            />

            <q-input
              v-if="permission.updatedOn"
              :value="permission.updatedOn | toDateTime"
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
  name: 'accessControl.permission',
  mixins: [timestamp2Datetime],
  data () {
    return {
      dialog: false,
      action: 'add',
      deleteAction: false,
      filter: '',
      permissions: [],
      permission: {
        permission: '',
        description: '',
        createdOn: this.$Timestamp.now(),
        createdBy: this.userName,
        updatedOn: this.$Timestamp.now(),
        updatedBy: this.userName
      }
    }
  },
  firestore: {
    permissions: db.collection('permission')
  },
  computed: {
    ...mapGetters('auth', ['userName']),
    columns () {
      const columns = [
        {
          name: 'permission',
          field: 'permission',
          label: this.$t('accessControl.permission'),
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
      this.$bind('permission', db.collection('permission').doc(row.id))
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
      this.permission = {
        permission: '',
        description: '',
        createdOn: this.$Timestamp.now(),
        createdBy: this.userName,
        updatedOn: this.$Timestamp.now(),
        updatedBy: this.userName
      }
    },
    onSubmit () {
      this.$refs.permissionForm.validate().then(success => {
        if (success) {
          if (this.action === 'create') {
            db.collection('permission').doc(this.permission.permission).set({
              permission: this.permission.permission,
              description: this.permission.description,
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
              // นำรายการ permission ที่กำลังจะลบ ออกจากที่บันทึไว้ใน group เสียก่อน
              const vm = this
              db.collection('group')
                .where('permission', 'array-contains-any', [vm.permission.id])
                .get()
                .then(querySnapshot => {
                  const batch = db.batch()
                  querySnapshot.forEach((doc) => {
                    const element = doc.data()
                    vm._.remove(element.permission, function (n) {
                      return n === vm.permission.id
                    })
                    batch.update(db.collection('group')
                      .doc(doc.id), { permission: element.permission })
                  })
                  batch.commit().then(() => {
                    this.$firestoreRefs.permission.delete()
                  })
                })
            } else {
              this.$firestoreRefs.permission.update({
                permission: this.permission.permission,
                description: this.permission.description,
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
  }
}
</script>
