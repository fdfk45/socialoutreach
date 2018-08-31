let app = require("express")(),
    {
        Nuxt,
        Builder
    } = require("nuxt"),
    config = require("./nuxt.config.js"),
    nuxt = new Nuxt(config),
    MongoClient = require('mongodb').MongoClient,
    dotenv = require('dotenv').config(),
    db_url = process.env.MONGODB_URL,
    bodyParser = require('body-parser'),
    routes = require("./routes/routes"),
    cookieSession = require('cookie-session');

app.set("port", (process.env.PORT || 9080))

app.use(cookieSession({
    secret: "kdjfmh8745nkmdhfjsjdk34"
}));

config.dev = process.env.NODE_ENV === "development"

app.use(bodyParser.json());

connectToDb();

function connectToDb() {

    MongoClient.connect(db_url, function (err, db) {

        let socialMediaDataCollection;

        if (err) {
            console.log(err.message);
            console.log("Error connecting to database");
        } else {

            console.log("Connected correctly to database");

            socialMediaDataCollection = db.collection('socialmediadatas');

            startServer(socialMediaDataCollection);

        }
    })

    function startServer(socialMediaDataCollection) {

        routes(app, socialMediaDataCollection);

        app.use(nuxt.render);

        if (config.dev) {
            new Builder(nuxt).build()
                .then(listen)
                .catch((error) => {
                    console.error(error)
                    process.exit(1)
                });
        } else {
            listen();
        }

        function listen() {

            app.listen(app.get("port"), function () {

                console.log(`Server started on port ${app.get("port")}`)

            });
        }

    }

}
