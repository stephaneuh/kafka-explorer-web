<template>
  <div class="container">
    <div class="row">
        <div class="col-md-auto mrgnbtm">
        <h2>Create Search</h2>
            <form>
                <div class="row mrgnbtm">
                    <div class="form-group col-md-6">
                        <label htmlFor="exampleInputEmail1">startDate</label>
<!--                        <input type="text" class="form-control" v-model="startDate" name="startDate" id="startDate" aria-describedby="emailHelp" placeholder="startDate" />-->
                        <date-time v-model="startDate" format="yyyy-dd-MM"></date-time>
                    </div>
                    <div class="form-group col-md-6">
                        <label htmlFor="exampleInputPassword1">endDate</label>
<!--                        <input type="text" class="form-control" v-model="endDate" name="endDate" id="endDate" placeholder="endDate" />-->
                      <date-time v-model="endDate" format="yyyy-dd-MM"></date-time>
                    </div>
                </div>
                <div class="row mrgnbtm">
                    <div class="form-group col-md-12">
                        <label htmlFor="exampleInputEmail1">email</label>
                        <input type="text" class="form-control" v-model="email" name="email" id="email" aria-describedby="emailHelp" placeholder="email" />
                    </div>
                </div>
                <div class="row mrgnbtm">
                    <div class="form-group col-md-12">
                        <label htmlFor="exampleInputEmail1">parkIdList</label>
                        <input type="text" class="form-control" v-model="parkIdList" name="parkIdList" id="parkIdList" aria-describedby="emailHelp" placeholder="parkIdList" />
                    </div>
                </div>
                <div class="row mrgnbtm">
                    <div class="form-group col-md-12">
                        <label htmlFor="exampleInputEmail1">schedule</label>
                        <input type="text" class="form-control" v-model="schedule" name="schedule" id="schedule" aria-describedby="emailHelp" placeholder="schedule" />
                    </div>
                </div>
                <div class="row mrgnbtm">
                    <div class="form-group col-md-6">
                        <button type="button" @click='createSearch()' class="btn btn-danger">Create</button>
                    </div>
                   <div class="form-group col-md-6">
                       {{ createdMessage }}
                   </div>
                </div>
            </form>
        </div>
    </div>
    </div>
</template>

<script>


export default {
  name: 'CreateSearch',
  data() {
    return {
      startDate: '2023-06-16',
      endDate: '2023-06-20',
      email: 'stephane.ris@icloud.com',
      parkIdList: '["centre-touristique-du-lac-simon"]',
      schedule: '1H',
      createdMessage: ''
    }
  },
  methods: {
      createSearch() {
              console.log(this.email)
              const payload = {
                  startDate: this.startDate.substr(0,10),
                  endDate: this.endDate.substr(0,10),
                  email: this.email,
                  parkIdList: this.parkIdList,
                  schedule: this.schedule
              }

            const axios = require('axios');

            axios.post(`/api/search`, payload)
            .then(response => {
                console.log("DONE!!!!!!!!!!!!!!!!!!!", response.data)
                this.createdMessage = "OK!";
                })
            .catch(error => {
                console.error('There was an error!', error.response.status);
                this.createdMessage = "KO!";
            });
        this.$parent.getAllSearches()
            this.clearForm();
      },
      clearForm() {
          this.startDate = "";
          this.endDate = "";
          this.email = "";
          this.parkIdList = "";
          this.schedule = "";
          this.errorMessage = "";
      }
  }
}
</script>