<template>
  <q-page padding>
    <!-- toolbar -->
    <q-toolbar class="text-black bg-blue-grey-2">
      <!-- title -->
      <q-toolbar-title>
        {{ $t($options.name) }}
      </q-toolbar-title>
    </q-toolbar>

    <!-- splitter -->
    <q-splitter
      v-model="splitterModel"
      style="height: 80vh"
    >
      <template v-slot:before>
        <div class="q-pa-md">
          <q-card class="card-dialog">
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
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
        </div>
      </template>

    </q-splitter>

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
      // user data
      uid: this.$store.state.auth.uid,
      user: {
        firstName: '',
        lastName: ''
      },
      // splitter
      // spliter
      splitterModel: 40,
      // charts
      series: [{
        name: 'Bubble1',
        data: this.generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
          min: 10,
          max: 60
        })
      },
      {
        name: 'Bubble2',
        data: this.generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
          min: 10,
          max: 60
        })
      },
      {
        name: 'Bubble3',
        data: this.generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
          min: 10,
          max: 60
        })
      },
      {
        name: 'Bubble4',
        data: this.generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
          min: 10,
          max: 60
        })
      }],
      chartOptions: {
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1000
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'vertical',
            shadeIntensity: 0.5,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 0.8,
            stops: [0, 100]
          }
        },
        grid: {
          show: true,
          strokeDashArray: 0,
          xaxis: {
            lines: {
              show: true
            }
          }
        },
        title: {
          text: 'Bubble',
          align: 'left',
          style: {
            color: '#FFF'
          }
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          labels: {
            colors: '#FFF'
          }
        },
        xaxis: {
          tickAmount: 12,
          type: 'category',
          labels: {
            style: {
              colors: '#fff'
            }
          }
        },
        yaxis: {
          max: 70,
          labels: {
            style: {
              colors: '#fff'
            }
          }
        }
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
    },
    generateData (baseval, count, yrange) {
      var i = 0
      var series = []
      while (i < count) {
        var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1
        var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
        var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15

        series.push([x, y, z])
        baseval += 86400000
        i++
      }
      return series
    }
  }
}
</script>
