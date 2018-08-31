import vueSlider from 'vue-slider-component/src/vue2-slider.vue';

import MugenScroll from 'vue-mugen-scroll';

import axios from '~/plugins/axios';

import firebase from "~/assets/js/firebase.js"

function searchDb($this, $$this) {

    axios.post('/searchDb', {
            searchKeyword: $$this.searchKeyword,
            pageNumber: 1
        })
        .then(function (response) {
            window.scrollTo(0, 0);
            $this.displayLoader = false;
            $this.shouldHandle = $this.$store.state.auth === false ? false : true;;
            $this.pageNumber = 1;
            $this.searchMadeAgain = false
            $this.searchMade = true;
            $this.searchKeywordNotFound = $this.searchKeyword;
            $this.numberOfResults = response.data.numOfResults;
            $this.searchResult = [];
            response.data.results.forEach(function (result) {
                $this.searchResult.push(result);
            })
            history.pushState({
                url: {
                    q: $$this.searchKeyword
                }
            }, null, `?q=${$$this.searchKeyword}`)
        })
        .catch(function (error) {
            $$this.displayLoader = false;
            console.log(error);
        });

}

function onPageLoad(query, store) {
    console.log("Query", query)
    return axios.post('/filterDb', {
            searchKeyword: query === "" ? query : query.q === null ? "" : query.q,
            genderFilter: query.g === undefined ? "all" : (query.g == "M" || query.g == "F" || query.g == "U") ? query.g : "all",
            platformFilter: query.p === undefined ? "all" : (query.p == "instagram" || query.p == "twitter" || query.p == "all") ? query.p : "all",
            followerFilter: query.followers === undefined ? [0, 100000000] : query.followers.split(","),
            followingFilter: query.following === undefined ? [0, 10000] : query.following.split(","),
            pageNumber: 1

        })
        .then(function (response) {
            return {
                searchKeyword: typeof (query) === "string" ? query : query.q,
                gender: (query.g == "M" || query.g == "F" || query.g == "U") ? query.g : "all",
                platform: (query.p == "instagram" || query.p == "twitter" || query.p == "all") ? query.p : "all",
                searchKeywordNotFound: query.q,
                previousSearchKeyword: query.q,
                shouldHandle: store.state.auth === false ? false : true,
                searchMade: true,
                numberOfResults: response.data.numOfResults,
                searchResult: response.data.results
            }

        })
        .catch(function (error) {
            console.log(error);
            console.log("There is an error")
        });
}

export default {
    head: {
        title: "Search"
    },
    asyncData({
        query,
        store
    }) {
        if (query.q !== undefined) {
            return onPageLoad(query, store);
        } else {
            return onPageLoad("", store);
        }

    },
    components: {
        vueSlider,
        MugenScroll
    },
    data() {
        return {
            dialog: false,
            pageNumber: 1,
            shouldHandle: false,
            handleOnMount: false,
            fetchMoreLoader: false,
            noMoreSearchResults: false,
            gender: "all",
            platform: "all",
            followerValue: [0, 100000000],
            followerMin: 0,
            followerInterval: 1000,
            followerMax: 100000000,
            followingMin: 0,
            followingInterval: 100,
            followingMax: 10000,
            followingValue: [0, 10000],
            showFollowerSlider: false,
            showFollowingSlider: false,
            searchKeyword: "",
            numberOfResults: "",
            searchKeywordNotFound: "",
            displayLoader: false,
            searchMade: false,
            searchMadeAgain: false,
            previousSearchKeyword: "",
            filterMade: false,
            isDialogForList: false,
            isDialogForListName: false,
            isSaveListNameBtnDisabled: true,
            isListAvailable: false,
            listname: "",
            selectedListName: "",
            list: [],
            searchResult: []
        }
    },
    watch: {
        showFollowerSlider: function (val) {
            if (val === true) {
                this.$nextTick(() => this.$refs.followerSlider.refresh());
            }
        },
        showFollowingSlider: function (val) {
            if (val === true) {
                this.$nextTick(() => this.$refs.followingSlider.refresh());
            }
        }
    },
    methods: {
        search() {
            var $this = this;
            this.noMoreSearchResults = false;
            if (this.searchKeyword !== "") {
                if (this.searchMade === true && this.searchKeyword !== this.previousSearchKeyword) {
                    this.searchMadeAgain = true;
                    this.previousSearchKeyword = this.searchKeyword;
                    searchDb($this, this);
                } else {
                    if (this.searchMade === false) {
                        this.displayLoader = true;
                        this.previousSearchKeyword = this.searchKeyword;
                        searchDb($this, this)
                    }

                }

            } else {
                alert("Please enter a keyword");
            }

        },
        filter() {
            var $this = this;
            this.filterMade = true;
            this.dialog = false;
            this.noMoreSearchResults = false;
            axios.post('/filterDb', {
                    searchKeyword: this.searchKeyword,
                    genderFilter: this.gender,
                    platformFilter: this.platform,
                    followerFilter: this.followerValue,
                    followingFilter: this.followingValue,
                    pageNumber: 1
                })
                .then(function (response) {
                    $this.filterMade = false;
                    $this.pageNumber = 1;
                    $this.numberOfResults = response.data.numOfResults;
                    $this.searchResult = [];
                    response.data.results.forEach(function (result) {
                        $this.searchResult.push(result);
                    })
                    history.pushState({
                        url: {
                            q: $this.searchKeyword,
                            g: $this.gender,
                            p: $this.platform,
                            followers: $this.followerValue,
                            following: $this.followingValue
                        }
                    }, null, `?q=${$this.searchKeyword}&g=${$this.gender}&p=${$this.platform}&followers=${$this.followerValue}&following=${$this.followingValue}`)
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        fetchData() {
            var searchParam = new URLSearchParams(window.location.search),
                $this = this;
            if (this.numberOfResults !== this.searchResult.length) {
                this.fetchMoreLoader = true;
                this.shouldHandle = false;
                axios.post('/filterDb', {
                        searchKeyword: searchParam.get("q") === null ? this.searchKeyword : searchParam.get("q"),
                        genderFilter: searchParam.get("g") === null ? this.gender : searchParam.get("g"),
                        platformFilter: searchParam.get("p") === null ? this.platform : searchParam.get("p"),
                        followerFilter: searchParam.get("followers") === null ? this.followerValue : searchParam.get("followers").split(","),
                        followingFilter: searchParam.get("following") === null ? this.followingValue : searchParam.get("following").split(","),
                        pageNumber: this.pageNumber + 1
                    })
                    .then(function (response) {
                        $this.fetchMoreLoader = false;
                        response.data.results.forEach(function (result) {
                            $this.searchResult.push(result);
                        })
                        $this.pageNumber = $this.pageNumber + 1;
                        $this.shouldHandle = true;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                if (this.searchResult.length !== 0) {
                    this.noMoreSearchResults = true;
                }
            }
        },
        createListBtn() {
            this.isDialogForList = false;
            this.isDialogForListName = true;
        },
        saveListNameBtn() {
            axios.post("/saveListName", {
                userId: this.$store.state.userInfo.uid,
                listName: this.listname
            }).then(function (response) {
                console.log(response.data);
            }).catch(function (err) {
                console.log(err.message);
            })
        },
        saveToList() {
            firebase.database().ref(`users/${this.$store.state.userInfo.uid}`).once("value").then(snapshot => {
                if (snapshot.exists() === true) {
                    this.isListAvailable = true;
                    this.isDialogForList = true;
                    console.log("There is data");
                    this.list = Object.keys(snapshot.val());
                } else {
                    this.isListAvailable = false;
                    this.isDialogForList = true;
                    console.log("There is no data");
                }
            }).catch(err => console.log(err.message));
        },
        validateListNameField() {
            if (this.listname !== "") {
                this.isSaveListNameBtnDisabled = false;
            } else {
                this.isSaveListNameBtnDisabled = true;
            }
        },
        logout() {
            axios.post("/logout").then(function (response) {
                location.reload();
            }).catch(function (err) {
                console.log(err.message);
            })
        }
    }
}
