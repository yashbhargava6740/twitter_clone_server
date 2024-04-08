import { initServer } from "./app";


async function init() {
    const app = await initServer();
    app.listen(process.env.PORT, () => console.log("Server Started at 8000"));
}
init();