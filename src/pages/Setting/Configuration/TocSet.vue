<template>
  <q-page padding>
    <!-- datatable -->
    <div class="q-pa-md">
      <q-table
        :grid="$q.screen.xs"
        :title="$t($options.name)"
        :data="tocSets"
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
          <q-form v-if="tocSet"
            ref="tocSetForm"
            @submit="onSubmit"
            class="q-gutter-md"
          >
            <q-input
              filled
              v-model="tocSet.sequence"
              :label="$t('configuration.sequence')"
              lazy-rules
              :rules="[ val => val && val.length > 0 || $t('systemLabel.requiredField')]"
            />

            <q-input
              filled
              v-model="tocSet.name"
              :label="$t('configuration.name')"
              lazy-rules
              :rules="[ val => val && val.length > 0 || $t('systemLabel.requiredField')]"
            />

            <q-editor
              v-model="tocSet.description"
              :placeholder="$t('configuration.description')"
              min-height="5rem"
            />

            <q-select
              filled
              v-model="tocSet.language"
              :options="languageOptions"
              :label="$t('configuration.language')"
              emit-value
              map-options
              lazy-rules
              :rules="[ val => val && val.length > 0 || $t('systemLabel.requiredField')]"
            />

            <q-select
              filled
              v-model="tocSet.script"
              :options="scriptOptions"
              :label="$t('configuration.script')"
              emit-value
              map-options
              lazy-rules
              :rules="[ val => val && val.length > 0 || $t('systemLabel.requiredField')]"
            />

            <q-input
              v-if="tocSet.createdOn"
              :value="tocSet.createdOn | toDateTime"
              :label="$t('systemLabel.createdOn')"
              readonly
            />

            <q-input
              v-if="tocSet.updatedOn"
              :value="tocSet.updatedOn | toDateTime"
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
import { mapState, mapGetters } from 'vuex'
import { showMessage } from 'src/functions/function-show-message'
import timestamp2Datetime from 'src/mixins/filter-timestamp-datetime'

export default {
  name: 'configuration.tocSet',
  mixins: [timestamp2Datetime],
  data () {
    return {
      // grid
      dialog: false,
      action: 'add',
      deleteAction: false,
      filter: '',
      // options
      languageOptions: [
        {
          value: 'pali',
          label: this.$t('configuration.pali')
        },
        {
          value: 'thai',
          label: this.$t('configuration.thai')
        }
      ],
      scriptOptions: [
        {
          value: 'burmese',
          label: this.$t('configuration.burmese')
        },
        {
          value: 'devanagari',
          label: this.$t('configuration.devanagari')
        },
        {
          value: 'khmer',
          label: this.$t('configuration.khmer')
        },
        {
          value: 'lanna',
          label: this.$t('configuration.lanna')
        },
        {
          value: 'laos',
          label: this.$t('configuration.laos')
        },
        {
          value: 'roman',
          label: this.$t('configuration.roman')
        },
        {
          value: 'sinhala',
          label: this.$t('configuration.sinhala')
        },
        {
          value: 'thai',
          label: this.$t('configuration.thai')
        }
      ],
      tocSets: [],
      tocSet: {
        sequence: 0,
        name: '',
        description: '',
        language: 'pali',
        script: '',
        createdOn: this.$Timestamp.now(),
        createdBy: this.userName,
        updatedOn: this.$Timestamp.now(),
        updatedBy: this.userName
      }
    }
  },
  firestore: {
    tocSets: db.collection('tocSet')
  },
  computed: {
    ...mapState('settings', ['configuration']),
    ...mapGetters('auth', ['userName']),
    columns () {
      const columns = [
        {
          name: 'name',
          field: 'name',
          label: this.$t('configuration.name'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'language',
          field: 'language',
          label: this.$t('configuration.language'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'script',
          field: 'script',
          label: this.$t('configuration.script'),
          sortable: true,
          align: 'left'
        }
      ]
      return columns
    }
  },
  methods: {
    onRowClick (evt, row) {
      this.$bind('tocSet', db.collection('tocSet').doc(row.id))
        .then((doc) => {
          this.dialog = true
          this.action = 'update'
          this.deleteAction = false
          if (doc.volume) {
            this.volume = doc.volume
          }
        })
    },
    onCreateBtnClick () {
      this.dialog = true
      this.action = 'create'
      this.deleteAction = false
      // ล้างฟอร์ม
      this.tocSet = {
        name: '',
        description: '',
        language: 'pali',
        script: '',
        createdOn: this.$Timestamp.now(),
        createdBy: this.userName,
        updatedOn: this.$Timestamp.now(),
        updatedBy: this.userName
      }
    },
    onSubmit () {
      this.$refs.tocSetForm.validate().then(success => {
        if (success) {
          if (this.action === 'create') {
            db.collection('tocSet').add({
              sequence: this.tocSet.sequence,
              name: this.tocSet.name,
              description: this.tocSet.description,
              language: this.tocSet.language,
              script: this.tocSet.script,
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
              this.$firestoreRefs.tocSet.delete()
            } else {
              this.$firestoreRefs.tocSet.update({
                sequence: this.tocSet.sequence,
                name: this.tocSet.name,
                description: this.tocSet.description,
                language: this.tocSet.language,
                script: this.tocSet.script,
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
