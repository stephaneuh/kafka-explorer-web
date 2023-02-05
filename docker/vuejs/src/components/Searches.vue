<template>
  <div class="container w-50" >
  <div class="row-cols-1" >

        <h2>Searches</h2>

        <table class="table table-bordered">
            <thead>
            <tr>
                <th>Search Id</th>
                <th>processId</th>
                <th>schedule</th>
                <th>email</th>
               <th>creationTime</th>
              <th>lastRan</th>
            </tr>
            </thead>
            <tbody>
              <tr v-for="item in Searches" :key="item.processId">
                  <td>{{ item._id }}</td>
                  <td>{{ item.processId }}</td>
                  <td>{{ item.schedule }}</td>
                  <td>{{ item.email }}</td>
                <td>{{  moment.unix(item.creationTime).format("DD-MM-YYYY h:mm:ss") }}</td>
<!--                   <td>{{ moment(item.creationTime*1000).format("DD-MM-YYYY h:mm:ss") }}</td>-->
                <td>N/A</td>
              </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>

<script>

    export default {
        name: 'Searches',
        props: ['Searches']
     }
</script>