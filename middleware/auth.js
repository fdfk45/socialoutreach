export default function ({
    store,
    redirect
}) {
    if (store.state.auth === true) {
        redirect("/search")
    }
}
