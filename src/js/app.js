import { Films } from "./films/films";

import "./app.css";

const films = new Films(document.body);

document.addEventListener("DOMContentLoaded", () => {
  films.init();
});
