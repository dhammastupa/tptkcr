<template>
  <q-page padding>
    <!-- datatable -->
    <div class="q-pa-md">
      <q-table
        :grid="$q.screen.xs"
        :title="$t($options.name)"
        :data="tipitakaEditions"
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
          <q-form v-if="tipitakaEdition"
            ref="tipitakaEditionForm"
            @submit="onSubmit"
            class="q-gutter-md"
          >
            <q-input
              filled
              v-model="tipitakaEdition.sequence"
              :label="$t('configuration.sequence')"
              lazy-rules
              :rules="[ val => val && val.length > 0 || $t('systemLabel.requiredField')]"
            />

            <q-input
              filled
              :readonly="this.action == 'update'"
              v-model="tipitakaEdition.code"
              :label="$t('configuration.code')"
              lazy-rules
              :rules="[ val => val && val.length > 0 || $t('systemLabel.requiredField')]"
            />

            <q-input
              filled
              v-model="tipitakaEdition.name"
              :label="$t('configuration.name')"
              lazy-rules
              :rules="[ val => val && val.length > 0 || $t('systemLabel.requiredField')]"
            />

            <q-editor
              v-model="tipitakaEdition.description"
              :placeholder="$t('configuration.description')"
              min-height="5rem"
            />

            <q-input
              filled
              type="number"
              v-model="tipitakaEdition.yearOfPublication"
              :label="$t('configuration.yearOfPublication')"
              lazy-rules
              :rules="[ val => val && val.length > 0 || $t('systemLabel.notValid')]"
            >
              <template v-slot:hint>
                {{ $t('configuration.buddhistEra') }}
              </template>
            </q-input>

            <q-select
              filled
              v-model="tipitakaEdition.language"
              :options="languageOptions"
              :label="$t('configuration.language')"
              emit-value
              map-options
              lazy-rules
              :rules="[ val => val && val.length > 0 || $t('systemLabel.requiredField')]"
            />

            <q-select
              filled
              v-model="tipitakaEdition.script"
              :options="scriptOptions"
              :label="$t('configuration.script')"
              emit-value
              map-options
              lazy-rules
              :rules="[ val => val && val.length > 0 || $t('systemLabel.requiredField')]"
            />

            <q-input
              filled
              type="number"
              v-model="tipitakaEdition.volumes"
              :label="$t('configuration.volumes')"
              lazy-rules
              :rules="[ val => val && _.isNumber(parseInt(val)) || $t('systemLabel.notValid')]"
            />

            <q-card class="my-card">
              <q-card-section class="bg-grey-2">
                <div class="text-h6">{{ $t('operation.volume') }}</div>
              </q-card-section>
                <q-card-section v-for="(v, index) in volume" :key="index">
                  <div class="rounded-borders">
                    <div class="q-gutter-md row items-start">
                      <q-input
                        filled dense
                        style="width: 150px"
                        type="number"
                        v-model="v.number"
                        :label="$t('operation.number')"
                        lazy-rules
                        :rules="[ val => val && val.length > 0 || $t('systemLabel.requiredField')]"
                      />
                      <q-input
                        filled dense
                        style="width: 150px"
                        type="number"
                        v-model="v.totalPages"
                        :label="$t('operation.totalPages')"
                        lazy-rules
                        :rules="[ val => val && val.length > 0 || $t('systemLabel.requiredField')]"
                      />
                    </div>
                    <q-input
                      filled dense
                      v-model="v.name"
                      :label="$t('operation.name')"
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || $t('systemLabel.requiredField')]"
                    />
                  </div>

                </q-card-section>
              <q-separator />
              <q-card-actions align="right">
                <q-btn @click="onAddVolume" flat round color="primary" icon="add" />
              </q-card-actions>
            </q-card>

            <q-input
              filled
              v-model="tipitakaEdition.publisher"
              :label="$t('configuration.publisher')"
              lazy-rules
              :rules="[ val => val && val.length > 0 || $t('systemLabel.requiredField')]"
            />

            <q-select
              filled
              v-model="tipitakaEdition.country"
              :options="countryOptions"
              :label="$t('configuration.country')"
              emit-value
              map-options
              lazy-rules
              :rules="[ val => val && val.length > 0 || $t('systemLabel.requiredField')]"
            />

            <q-input
              v-if="tipitakaEdition.createdOn"
              :value="tipitakaEdition.createdOn | toDateTime"
              :label="$t('systemLabel.createdOn')"
              readonly
            />

            <q-input
              v-if="tipitakaEdition.updatedOn"
              :value="tipitakaEdition.updatedOn | toDateTime"
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
  name: 'configuration.tipitakaEdition',
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
      countryOptions: [
        {
          value: 'thai',
          label: this.$t('configuration.thai')
        },
        {
          value: 'sriLanka',
          label: this.$t('configuration.sriLanka')
        },
        {
          value: 'myanmar',
          label: this.$t('configuration.myanmar')
        }
      ],
      volume: [
        {
          number: '',
          name: '',
          totalPages: ''
        }
      ],
      tipitakaEditions: [],
      tipitakaEdition: {
        sequence: 0,
        code: '',
        name: '',
        description: '',
        yearOfPublication: '',
        language: 'pali',
        script: '',
        volumes: '',
        volume: [
          {
            number: '',
            name: '',
            totalPages: ''
          }
        ],
        publisher: '',
        country: '',
        createdOn: this.$Timestamp.now(),
        createdBy: this.userName,
        updatedOn: this.$Timestamp.now(),
        updatedBy: this.userName
      }
    }
  },
  firestore: {
    tipitakaEditions: db.collection('tipitakaEdition')
  },
  computed: {
    ...mapState('settings', ['configuration']),
    ...mapGetters('auth', ['userName']),
    columns () {
      const columns = [
        {
          name: 'code',
          field: 'code',
          label: this.$t('configuration.code'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'name',
          field: 'name',
          label: this.$t('configuration.name'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'yearOfPublication',
          field: 'yearOfPublication',
          label: this.$t('configuration.yearOfPublication'),
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
        },
        {
          name: 'volumes',
          field: 'volumes',
          label: this.$t('configuration.volumes'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'country',
          field: 'country',
          label: this.$t('configuration.country'),
          sortable: true,
          align: 'left'
        }
      ]
      return columns
    }
  },
  methods: {
    onRowClick (evt, row) {
      this.volume = [
        {
          number: '',
          name: '',
          totalPages: ''
        }
      ]
      this.$bind('tipitakaEdition', db.collection('tipitakaEdition').doc(row.id))
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
      this.tipitakaEdition = {
        code: '',
        name: '',
        description: '',
        yearOfPublication: '',
        language: 'pali',
        script: '',
        volumes: '',
        volume: {
          number: '',
          name: '',
          totalPages: ''
        },
        publisher: '',
        country: '',
        createdOn: this.$Timestamp.now(),
        createdBy: this.userName,
        updatedOn: this.$Timestamp.now(),
        updatedBy: this.userName
      }
      this.volume = [
        {
          number: '',
          name: '',
          totalPages: ''
        }
      ]
    },
    onAddVolume () {
      this.volume.push({
        number: '',
        name: '',
        totalPages: ''
      })
    },
    onSubmit () {
      this.$refs.tipitakaEditionForm.validate().then(success => {
        if (success) {
          if (this.action === 'create') {
            db.collection('tipitakaEdition').doc(this.tipitakaEdition.code).set({
              sequence: this.tipitakaEdition.sequence,
              code: this.tipitakaEdition.code,
              name: this.tipitakaEdition.name,
              description: this.tipitakaEdition.description,
              yearOfPublication: this.tipitakaEdition.yearOfPublication,
              language: this.tipitakaEdition.language,
              script: this.tipitakaEdition.script,
              volumes: this.tipitakaEdition.volumes,
              volume: this.volume,
              publisher: this.tipitakaEdition.publisher,
              country: this.tipitakaEdition.country,
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
              this.$firestoreRefs.tipitakaEdition.delete()
            } else {
              this.$firestoreRefs.tipitakaEdition.update({
              // db.collection('tipitakaEdition').doc(this.tipitakaEdition.code).set({
                sequence: this.tipitakaEdition.sequence,
                code: this.tipitakaEdition.code,
                name: this.tipitakaEdition.name,
                description: this.tipitakaEdition.description,
                yearOfPublication: this.tipitakaEdition.yearOfPublication,
                language: this.tipitakaEdition.language,
                script: this.tipitakaEdition.script,
                volumes: this.tipitakaEdition.volumes,
                volume: this.volume,
                publisher: this.tipitakaEdition.publisher,
                country: this.tipitakaEdition.country,
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
