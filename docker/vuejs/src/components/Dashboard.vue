<template>
  <div class="hello">
    <Header />
    <div class="container mrgnbtm">
          <div class="row">
            <div class="col-md-8">
                <CreateSearch @createSearch="searchCreate($event)" />
            </div>
            <div class="col-md-4">
                <DisplayBoard :numberOfSearches="numberOfSearches" @getAllSearches="getAllSearches()" />
            </div>
          </div>
    </div>
    <div class="row mrgnbtm">
        <Searches v-if="searches.length > 0" :searches="searches" />
    </div>
  </div>
</template>

<script>
import Header from './Header.vue'
import CreateSearch from './CreateSearch.vue'
import DisplayBoard from './DisplayBoard.vue'
import Searches from './Searches.vue'
import { getAllSearches } from '../services/SearchService'

export default {
  name: 'Dashboard',
  components: {
    Header,
    CreateSearch,
    DisplayBoard,
    Searches
  },
  data() {
      return {
          searches: [],
          numberOfSearches: 0
      }
  },
  methods: {
    getAllSearches() {
      getAllSearches().then(response => {
        console.log(response)
        this.searches = response
        this.numberOfSearches = this.searches.length
      })
    }
    // searchCreate(data) {
    //   console.log('data:::', data)
    //   createSearch(data).then(response => {
    //     console.log(response);
    //     this.getAllSearches();
    //   });
    // }
  },
  mounted () {
    this.getAllSearches();
  }
}
</script>