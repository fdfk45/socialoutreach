module.exports = {
    dev: false,
    head: {
        title: '{{ name }}',
        meta: [
            {
                charset: 'utf-8'
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                hid: 'description',
                name: 'description',
                content: '{{ description }}'
            }
    ],
        link: [
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
            }
    ]
    },
    plugins: ['~/plugins/vuetify'],
    css: ["./node_modules/vuetify/dist/vuetify.min.css", "~/assets/font-awesome/css/font-awesome.min.css"],
    build: {
        vendor: ['vuetify', 'axios', 'firebase'],
        extractCSS: true
    }
}
