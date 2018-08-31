<template>
   <v-app>
      <v-toolbar dark class="primary" fixed>
    <v-toolbar-title class="white--text">Social Outreach</v-toolbar-title>
<!--    <v-spacer></v-spacer>-->
     <v-layout justify-center>
      <v-flex xs10 sm10 md8 lg8>
           <v-text-field
        solo        
        label="Enter a keyword"
        append-icon="search"
            @keyup.enter="search"
            v-model="searchKeyword"
      ></v-text-field>  
          </v-flex>
    </v-layout>
    <div v-if="$store.state.auth === true">
       <v-btn icon>
      <v-icon>search</v-icon>
    </v-btn>
        <v-btn icon>
      <v-icon>apps</v-icon>
    </v-btn>
     <v-btn icon @click="logout" title="Logout">
      <v-avatar class="teal" size="38px">
      <span class="white--text headline">C</span>
    </v-avatar>
    </v-btn>
    </div>
    <div v-else>
        <v-btn class="black--text" to="/signup">Sign Up</v-btn>
    </div>
  </v-toolbar>
      
       <v-container grid-list-md dark>
            <v-layout justify-center v-if="searchMade === true && numberOfResults !== 0" style="margin-top:100px;">
                <v-flex lg4>
                    <p style="font-size:20px; margin-top:8px">About {{numberOfResults}} results</p>
                </v-flex>
                <v-flex lg4>
                    <v-btn flat style="float:right" @click.native.stop="dialog = true">
<v-icon>filter_list</v-icon>Filter</v-btn>
                </v-flex>
            </v-layout>
             <v-dialog v-model="dialog" width="400px">
      <v-card>
        <v-card-title class="headline">Filter By:</v-card-title>
        <v-card-text>
            <v-expansion-panel>
    <v-expansion-panel-content key="gender">
      <div slot="header">Gender</div>
        <v-card-text class="grey lighten-3">
        <v-radio-group v-model="gender">
           <v-radio label="All" value="all"></v-radio>
        <v-radio label="Male" value="M"></v-radio>
            <v-radio label="Female" value="F"></v-radio>
            <v-radio label="Unknown" value="U"></v-radio> 
        </v-radio-group>
      </v-card-text>
    </v-expansion-panel-content>
    
     <v-expansion-panel-content key="platform">
      <div slot="header">Platform</div>
        <v-card-text class="grey lighten-3">
       <v-radio-group v-model="platform">
           <v-radio label="All" value="all"></v-radio>
        <v-radio label="Twitter" value="twitter"></v-radio>
            <v-radio label="Instagram" value="instagram"></v-radio>
        </v-radio-group>
        </v-card-text>      
    </v-expansion-panel-content>
    
    <v-expansion-panel-content key="follower-slider" v-model="showFollowerSlider">
      <div slot="header">Followers</div>
        <v-card-text class="grey lighten-3">
		<vue-slider ref="followerSlider" v-model="followerValue" :min="followerMin" :max="followerMax" :interval="followerInterval"></vue-slider>
</v-card-text>
</v-expansion-panel-content>
<v-expansion-panel-content key="following-slider" v-model="showFollowingSlider">
    <div slot="header">Following</div>
    <v-card-text class="grey lighten-3">
    <vue-slider ref="followingSlider" v-model="followingValue" :min="followingMin" :max="followingMax" :interval="followingInterval"></vue-slider>
    </v-card-text>
</v-expansion-panel-content>

</v-expansion-panel>

</v-card-text>
<v-divider></v-divider>
<v-card-actions>
   <v-spacer></v-spacer>
    <v-btn flat class="light-blue--text" @click="filter">Done</v-btn>
</v-card-actions>
</v-card>
</v-dialog>
             <v-layout wrap class="search-result" justify-center>
                 <v-flex xs12 sm6 md4 lg4 xl4 text-xs-center v-for="(result,index) in searchResult" key="index">
              <v-card style="overflow:hidden;" class="white black--text">
                  <v-card-media height="150px" class="light-blue">
                <v-icon class="white--text" style="width:100%; margin-top:20px" v-if="result.platform === 'instagram'">fa-instagram fa-5x</v-icon>
                <v-icon v-else class="white--text" style="width:100%; margin-top:20px">fa-twitter fa-5x</v-icon>
            </v-card-media>
             <v-avatar size="70px" tile class="grey lighten-4" style="position:relative; top:-40px; margin-bottom:-60px;">
                <img :src="result.userProfilePic" :alt="'@'+result.username" style="overflow:hidden">
            </v-avatar>
             <v-card-text>
                 <p style="font-size:18px;">{{result.userFullName}}</p>
                 <v-layout justify-center style="position:relative; top:-20px; margin-bottom:-30px;">
                    <v-flex xs3 sm4 lg3>
                       <v-list style="background:none">
                            <v-list-tile-content>
                                <v-list-tile-title style="text-align:center">Followers</v-list-tile-title>
                                <v-list-tile-sub-title style="text-align:center">{{result.userFollowers}}</v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list>  
                    </v-flex>
                      
                      <v-flex xs3 sm4 lg3>
                       <v-list style="background:none">
                            <v-list-tile-content>
                                <v-list-tile-title style="text-align:center">Following</v-list-tile-title>
                                <v-list-tile-sub-title style="text-align:center">{{result.userFollowing}}</v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list>  
                    </v-flex>
                 </v-layout>
                 <p v-if="result.userBio.match(/[a-z0-9]+[_a-z0-9\.-]*[a-z0-9]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})/ig) === null">{{result.userBio}}</p>
                 
                 <p v-else>
                 <p v-html="result.userBio.replace(/[a-z0-9]+[_a-z0-9\.-]*[a-z0-9]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})/ig,function(t) {return '<b>' + t + '</b>'})"></p>
                 </p>
                <a :href="result.userExternalUrl" target="_blank" v-if="result.userExternalUrl !== null">
{{result.userExternalUrl.replace(/(^http:\/\/|\/$)/g,"")}}</a>
             </v-card-text>
             <v-divider></v-divider>
<!--             @click.native.stop="isDialogForList = true"-->
            <v-card-actions>
                <v-btn flat class="light-blue--text" @click="saveToList">Save To List</v-btn>
                <v-spacer></v-spacer>
                <v-btn flat class="light-blue--text" :href="'http://instagram.com/'+result.username" target="_blank">Visit Profile</v-btn>
            </v-card-actions>
              </v-card>
          </v-flex> 
          <mugen-scroll :handler="fetchData" :handleOnMount="handleOnMount" :shouldHandle="shouldHandle" style="margin-top:50px">
      <v-progress-circular indeterminate v-bind:size="40" class="primary--text loader" v-if="fetchMoreLoader"></v-progress-circular>
<!--      Loading.....-->
    </mugen-scroll>
         </v-layout>
          
          <v-layout justify-center text-xs-center style="margin-top:70px; font-size:30px;" v-if="searchMade === true && searchResult.length === 0">
             <v-flex xs8>
                 <p>Your keyword search for <b>{{searchKeywordNotFound}}</b> does not match any accounts. Please try another keyword</p>
             </v-flex>
          </v-layout>
          
          <v-layout justify-center text-xs-center style="margin-top:70px; font-size:30px;" v-if="displayLoader === true && searchResult.length === 0">
         <v-progress-circular indeterminate v-bind:size="50" class="primary--text"></v-progress-circular>
          </v-layout>
         
          <v-layout justify-center text-xs-center style="margin-top:70px; font-size:30px;"v-if="noMoreSearchResults">
             <v-flex xs8>
                 <p>No more results found</p>
             </v-flex>
          </v-layout>
         
         <div class="overlay" v-if="filterMade || searchMadeAgain">
         <v-progress-circular indeterminate v-bind:size="50" class="primary--text loader"></v-progress-circular>
         </div>
           
           <v-dialog v-model="isDialogForList" width="400px">
               <v-card>
                  <div v-if="$store.state.auth === true && isListAvailable === true">
                     <v-card-text>
                    <v-subheader style="padding:0">Choose a list name</v-subheader>
                      <v-select 
                     :items="list"
              v-model="selectedListName"
              label="Select"
                  autocomplete
            ></v-select>
                 </v-card-text> 
                 <v-card-actions> 
                  <v-spacer></v-spacer>
                       <v-btn class="primary" >Save</v-btn>
                   </v-card-actions>  
                   </div>
                   <div v-else-if="$store.state.auth === true && isListAvailable === false">
                      <v-card-title class="headline" style="text-align:center">You have not created any list yet, click the button below to create a list</v-card-title> 
                      <v-card-actions>
                      <v-spacer></v-spacer>
                       <v-btn class="primary" @click.native.stop="createListBtn">Create List</v-btn>
                       <v-spacer></v-spacer>
                   </v-card-actions> 
                   </div>
                   <div v-else>
         <v-card-title class="headline" style="text-align:center">Please sign up to be able to use this feature.</v-card-title> 
          <v-card-actions>
                      <v-spacer></v-spacer>
                       <v-btn class="primary" to="/signup">Sign Up</v-btn>
                       <v-spacer></v-spacer>
                   </v-card-actions>             
    </div>
                  
               </v-card>
           </v-dialog>
           
           <v-dialog v-model="isDialogForListName">
               <v-card @keyup="validateListNameField">
                   <v-card-title>
                        <span class="headline">Please enter a list name</span>
                 </v-card-title>
                 <v-card-text>
                     <v-text-field label="List name" v-model="listname"></v-text-field>
                 </v-card-text>
                 <v-card-actions>
                    <v-spacer></v-spacer>
                     <v-btn class="primary" @click="saveListNameBtn" :disabled="isSaveListNameBtnDisabled">Save</v-btn>
                 </v-card-actions>
               </v-card>
           </v-dialog>
           
</v-container>
</v-app>
</template>

<script src="~/assets/js/search.js"></script>

<style src="~/assets/css/search.css"></style>
