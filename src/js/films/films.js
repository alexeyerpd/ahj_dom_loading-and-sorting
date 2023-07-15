import "./films.css";

import Image from "../../img/arrow.svg";

import data from "./data.json";

export class Films {
  constructor(root) {
    this._root = root;
    this.headerColumns = [];
    this.headerColumnsDict = {};
    this.films = [];
    this.currentFilter = null;
    this.filteredFilms = [];
    this.filterIndex = 0;
    this.filters = [
      { field: "id", direction: "asc" },
      { field: "id", direction: "desc" },
      { field: "title", direction: "asc" },
      { field: "title", direction: "desc" },
      { field: "year", direction: "asc" },
      { field: "year", direction: "desc" },
      { field: "imdb", direction: "asc" },
      { field: "imdb", direction: "desc" },
    ];

    this.changeFilter = this.changeFilter.bind(this);
    this.sortFilms = this.sortFilms.bind(this);
  }

  init() {
    this.getFilms();
    this.renderFilms();
    this.setInitialProperty();
    this.runChangeFilter();
  }

  getFilms() {
    this.films = data;
  }

  changeFilter() {
    this.updateFilter();
    this.updateFilms();

    this.currentFilter = this.filters[this.filterIndex];
    this.filterIndex = ++this.filterIndex % this.filters.length;
  }

  runChangeFilter() {
    clearInterval(this.intervalId);

    this.changeFilter();

    window.changeFilter = () => this.changeFilter();
    this.intervalId = setInterval(this.changeFilter, 2000);
  }

  updateFilter() {
    const currentFilter = this.currentFilter;

    this.headerColumns.forEach((columnEl) =>
      columnEl.classList.remove("column_filtered_asc", "column_filtered_desc")
    );
    if (!currentFilter) {
      return;
    }
    const currentElem = this.headerColumnsDict[currentFilter.field];
    currentElem.classList.add(`column_filtered_${currentFilter.direction}`);
  }

  renderFilms() {
    this._root.insertAdjacentHTML(
      "beforeend",
      `
        <table class="films">
            <thead>
                <tr>
                    <th class="column" data-filter="id">id<img class="direction" src="${Image}" alt="direction"></th>
                    <th class="column" data-filter="title">title<img class="direction" src="${Image}" alt="direction"></th>
                    <th class="column" data-filter="year">year<img class="direction" src="${Image}" alt="direction"></th>
                    <th class="column" data-filter="imdb">imdb<img class="direction" src="${Image}" alt="direction"></th>
                </tr>
            </thead>
            <tbody class="films-content">
                ${this.films.map((film) => this.getFilmRowText(film)).join("")}
            </tbody>
        </table>
    `
    );
  }

  updateFilms() {
    const sortedFilms = this.films
      .toSorted(this.sortFilms)
      .map(({ id }) => document.querySelector(`.film-row[data-id="${id}"]`));

    sortedFilms.map((elem, i) => {
      let tbody = [...document.querySelector(".films-content").children];
      if (tbody[i] === elem) {
        return;
      }
      this.swapElement(elem, tbody[i]);
    });
  }

  checkIsEqualId(element, sortedFilm) {
    return element.dataset.id === String(sortedFilm.id);
  }

  swapElement(elem1, elem2) {
    const clonedElem1 = elem1.cloneNode(true);
    const clonedElem2 = elem2.cloneNode(true);
    elem2.replaceWith(clonedElem1);
    elem1.replaceWith(clonedElem2);
    return elem1.parentElement;
  }

  sortFilms(a, b) {
    const currentFilter = this.currentFilter;

    if (!currentFilter) {
      return 1;
    }

    if (currentFilter.direction === "desc") {
      [a, b] = [b, a];
    }

    if (typeof a[currentFilter.field] === "string") {
      return a[currentFilter.field].localeCompare(b[currentFilter.field]);
    }

    return a[currentFilter.field] - b[currentFilter.field];
  }

  setInitialProperty() {
    const columns = [...document.querySelectorAll(".column[data-filter]")];
    this.headerColumns = columns;

    columns.forEach((columnElement) => {
      const dataFilterValue = columnElement.dataset.filter;
      this.headerColumnsDict[dataFilterValue] = columnElement;
    });
  }

  getFilmRowText(data) {
    return `
        <tr class="film-row" data-id="${data.id}" data-title="${
      data.title
    }" data-year="${data.year}" data-imdb="${data.imdb}">
            <td class="column">${data.id}</td>
            <td class="column">${data.title}</td>
            <td class="column">(${data.year})</td>
            <td class="column">imdb: ${data.imdb.toFixed(2)}</td>
        </tr>
    `;
  }
}
