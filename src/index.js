import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getPhotos, options } from './modules/fetchAPI';
import tempGallary from './templates/gallary.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

searchForm.addEventListener('submit', onSearchForm);
loadMore.addEventListener('click', onMoreClick);

loadMore.classList.add('is-hidden');

function markupGallery(hits) {
  gallery.insertAdjacentHTML('beforeend', tempGallary(hits));
}

function onSearchForm(e) {
  e.preventDefault();
  loadMore.classList.remove('is-hidden');
  const q = e.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';

  if (q === '') {
    Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
  }
  options.params.page = 1;
  getPhotos(q)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        markupGallery(data.hits);
        SimpleLightBox = new SimpleLightbox('.gallery a').refresh();
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}

function onMoreClick() {
  options.params.page += 1;
  getPhotos()
    .then(({ data }) => {
      markupGallery(data.hits) += markupGallery(data.hits)
      SimpleLightBox = new SimpleLightbox('.gallery a').refresh();

      const totalPages = Math.ceil(data.totalHits / perPage);

      if (options.params.page > totalPages) {
        loadMore.classList.add('is-hidden');
        Notify.success(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => console.log(error));
}
