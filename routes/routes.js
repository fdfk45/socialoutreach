module.exports = (app, socialMediaDataCollection, db) => {

    let firebase = require("firebase"),
        firebaseAdmin = require("firebase-admin"),
        serviceAccount = require("../service-account-key.json");

    firebase.initializeApp({
        apiKey: "AIzaSyBMuCmmUxG5Dw8Xt6RJLROuq1BMDhX0eis",
        authDomain: "social-outreach-5c78e.firebaseapp.com",
        databaseURL: "https://social-outreach-5c78e.firebaseio.com",
        storageBucket: "social-outreach-5c78e.appspot.com",
    })

    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount),
        databaseURL: "https://social-outreach-5c78e.firebaseio.com"
    });

    app.post("/logout", function (req, res) {
        req.session = null;
        res.json({
            success: true
        })
    })

    app.post("/isAuth", function (req, res) {

        firebaseAdmin.auth().verifyIdToken(req.body.token).then(function (decodedToken) {
            res.json({
                success: true,
                response: decodedToken
            })
        }).catch(function (err) {
            res.json({
                success: false,
                response: err.message
            })
        });
    })

    app.post("/saveListName", function (req, res) {

        res.json({
            success: true
        })

        console.log(req.body);

        firebaseAdmin.database().ref("users/1").once("value").then(snapshot => {
            console.log(snapshot.exists())
        }).catch(err => console.log(err.message));
    })

    app.post('/signin', function (req, res) {
        console.log("Sign in");
        console.log(req.body);
        firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password).then((user) => {
            firebase.auth().currentUser.getIdToken().then(function (idToken) {
                req.session.token = idToken;
                res.json({
                    success: true
                })
            }).catch(function (err) {
                console.log(err.message);
            });

        }).catch((err) => {
            res.json({
                success: false,
                message: err.message,
                code: err.code
            })
        });
    });

    app.post('/register', function (req, res) {
        console.log(req.body);
        console.log("Register");
        firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password).then((user) => {
            firebase.auth().currentUser.getIdToken().then(function (idToken) {
                req.session.token = idToken;
                res.json({
                    success: true
                })
            }).catch(function (err) {
                console.log(err.message);
            });
        }).catch((err) => {
            res.json({
                success: false,
                message: err.message
            })
        })

    });

    app.post("/searchDb", (req, res) => {

        console.log(req.body.searchKeyword);

        socialMediaDataCollection.find({
            userBio: new RegExp(req.body.searchKeyword, "gi")
        }, {
            skip: req.body.pageNumber === undefined ? 0 : parseInt(req.body.pageNumber) * 12 - 12,
            limit: 12,
            sort: {
                userFollowers: -1
            }
        }).toArray((err, docs) => {

            if (err) {
                console.log(err.message);
            } else {
                socialMediaDataCollection.find({
                    userBio: new RegExp(req.body.searchKeyword, "gi")
                }).count((err, count) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json({
                            results: docs,
                            numOfResults: count
                        });
                    }
                })

            }

        })

    });

    app.post("/filterDb", (req, res) => {

        /* console.log(`Follower ${req.body.followerFilter}`);
         console.log(`Following ${req.body.followingFilter}`);
         console.log(`Gender ${req.body.genderFilter}`);
         console.log(`Platform ${req.body.platformFilter}`);*/
        console.log(`Page Numbers ${req.body.pageNumber}`);

        if (req.body.genderFilter === "all" && req.body.platformFilter === "all") {

            socialMediaDataCollection.find({
                userBio: new RegExp(req.body.searchKeyword, "gi"),
                userFollowing: {
                    $gte: req.body.followingFilter[0] === undefined ? 0 : parseInt(req.body.followingFilter[0]),
                    $lte: req.body.followingFilter[1] === undefined ? 10000 : parseInt(req.body.followingFilter[1])
                },
                userFollowers: {
                    $gte: req.body.followerFilter[0] === undefined ? 0 : parseInt(req.body.followerFilter[0]),
                    $lte: req.body.followerFilter[1] === undefined ? 100000000 : parseInt(req.body.followerFilter[1])
                }
            }, {
                skip: req.body.pageNumber === undefined ? 0 : parseInt(req.body.pageNumber) * 12 - 12,
                limit: 12,
                sort: {
                    userFollowers: -1
                }
            }).toArray((err, docs) => {

                if (err) {
                    console.log(err.message);
                } else {
                    socialMediaDataCollection.find({
                        userBio: new RegExp(req.body.searchKeyword, "gi"),
                        userFollowing: {
                            $gte: req.body.followingFilter[0] === undefined ? 0 : parseInt(req.body.followingFilter[0]),
                            $lte: req.body.followingFilter[1] === undefined ? 10000 : parseInt(req.body.followingFilter[1])
                        },
                        userFollowers: {
                            $gte: req.body.followerFilter[0] === undefined ? 0 : parseInt(req.body.followerFilter[0]),
                            $lte: req.body.followerFilter[1] === undefined ? 100000000 : parseInt(req.body.followerFilter[1])
                        }
                    }).count((err, count) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.json({
                                results: docs,
                                numOfResults: count
                            });
                        }
                    })

                }

            })
        } else if (req.body.genderFilter === "all" && req.body.platformFilter !== "all") {

            socialMediaDataCollection.find({
                userBio: new RegExp(req.body.searchKeyword, "gi"),
                platform: req.body.platformFilter,
                userFollowing: {
                    $gte: req.body.followingFilter[0] === undefined ? 0 : parseInt(req.body.followingFilter[0]),
                    $lte: req.body.followingFilter[1] === undefined ? 10000 : parseInt(req.body.followingFilter[1])
                },
                userFollowers: {
                    $gte: req.body.followerFilter[0] === undefined ? 0 : parseInt(req.body.followerFilter[0]),
                    $lte: req.body.followerFilter[1] === undefined ? 100000000 : parseInt(req.body.followerFilter[1])
                }
            }, {
                skip: req.body.pageNumber === undefined ? 0 : parseInt(req.body.pageNumber) * 12 - 12,
                limit: 12,
                sort: {
                    userFollowers: -1
                }
            }).toArray((err, docs) => {

                if (err) {
                    console.log(err.message);
                } else {
                    socialMediaDataCollection.find({
                        userBio: new RegExp(req.body.searchKeyword, "gi"),
                        platform: req.body.platformFilter,
                        userFollowing: {
                            $gte: req.body.followingFilter[0] === undefined ? 0 : parseInt(req.body.followingFilter[0]),
                            $lte: req.body.followingFilter[1] === undefined ? 10000 : parseInt(req.body.followingFilter[1])
                        },
                        userFollowers: {
                            $gte: req.body.followerFilter[0] === undefined ? 0 : parseInt(req.body.followerFilter[0]),
                            $lte: req.body.followerFilter[1] === undefined ? 100000000 : parseInt(req.body.followerFilter[1])
                        }
                    }).count((err, count) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.json({
                                results: docs,
                                numOfResults: count
                            });
                        }
                    })

                }

            })

        } else if (req.body.genderFilter !== "all" && req.body.platformFilter === "all") {

            socialMediaDataCollection.find({
                userBio: new RegExp(req.body.searchKeyword, "gi"),
                userGender: req.body.genderFilter,
                userFollowing: {
                    $gte: req.body.followingFilter[0] === undefined ? 0 : parseInt(req.body.followingFilter[0]),
                    $lte: req.body.followingFilter[1] === undefined ? 10000 : parseInt(req.body.followingFilter[1])
                },
                userFollowers: {
                    $gte: req.body.followerFilter[0] === undefined ? 0 : parseInt(req.body.followerFilter[0]),
                    $lte: req.body.followerFilter[1] === undefined ? 100000000 : parseInt(req.body.followerFilter[1])
                }
            }, {
                skip: req.body.pageNumber === undefined ? 0 : parseInt(req.body.pageNumber) * 12 - 12,
                limit: 12,
                sort: {
                    userFollowers: -1
                }
            }).toArray((err, docs) => {

                if (err) {
                    console.log(err.message);
                } else {
                    socialMediaDataCollection.find({
                        userBio: new RegExp(req.body.searchKeyword, "gi"),
                        userGender: req.body.genderFilter,
                        userFollowing: {
                            $gte: req.body.followingFilter[0] === undefined ? 0 : parseInt(req.body.followingFilter[0]),
                            $lte: req.body.followingFilter[1] === undefined ? 10000 : parseInt(req.body.followingFilter[1])
                        },
                        userFollowers: {
                            $gte: req.body.followerFilter[0] === undefined ? 0 : parseInt(req.body.followerFilter[0]),
                            $lte: req.body.followerFilter[1] === undefined ? 100000000 : parseInt(req.body.followerFilter[1])
                        }
                    }).count((err, count) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.json({
                                results: docs,
                                numOfResults: count
                            });
                        }
                    })

                }

            })

        } else {

            socialMediaDataCollection.find({
                userBio: new RegExp(req.body.searchKeyword, "gi"),
                userGender: req.body.genderFilter,
                platform: req.body.platformFilter,
                userFollowing: {
                    $gte: req.body.followingFilter[0] === undefined ? 0 : parseInt(req.body.followingFilter[0]),
                    $lte: req.body.followingFilter[1] === undefined ? 10000 : parseInt(req.body.followingFilter[1])
                },
                userFollowers: {
                    $gte: req.body.followerFilter[0] === undefined ? 0 : parseInt(req.body.followerFilter[0]),
                    $lte: req.body.followerFilter[1] === undefined ? 100000000 : parseInt(req.body.followerFilter[1])
                }
            }, {
                skip: req.body.pageNumber === undefined ? 0 : parseInt(req.body.pageNumber) * 12 - 12,
                limit: 12,
                sort: {
                    userFollowers: -1
                }
            }).toArray((err, docs) => {

                if (err) {
                    console.log(err.message);
                } else {
                    socialMediaDataCollection.find({
                        userBio: new RegExp(req.body.searchKeyword, "gi"),
                        userGender: req.body.genderFilter,
                        platform: req.body.platformFilter,
                        userFollowing: {
                            $gte: req.body.followingFilter[0] === undefined ? 0 : parseInt(req.body.followingFilter[0]),
                            $lte: req.body.followingFilter[1] === undefined ? 10000 : parseInt(req.body.followingFilter[1])
                        },
                        userFollowers: {
                            $gte: req.body.followerFilter[0] === undefined ? 0 : parseInt(req.body.followerFilter[0]),
                            $lte: req.body.followerFilter[1] === undefined ? 100000000 : parseInt(req.body.followerFilter[1])
                        }
                    }).count((err, count) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.json({
                                results: docs,
                                numOfResults: count
                            });
                        }
                    })

                }

            })

        }

    })

}
