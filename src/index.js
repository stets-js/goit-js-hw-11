import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getPhotos, options } from './modules/fetchAPI';
import tempGallery from './templates/gallery.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

searchForm.addEventListener('submit', onSearchForm);
loadMore.addEventListener('click', onMoreClick);

loadMore.classList.add('is-hidden');
let query = '';

function markupGallery(hits) {
  gallery.insertAdjacentHTML('beforeend', tempGallery(hits));
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
        query = q;
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}

function onMoreClick(e) {
  options.params.page += 1;
  getPhotos(query)
    .then(({ data }) => {
      markupGallery(data.hits);
      SimpleLightBox = new SimpleLightbox('.gallery a').refresh();

      const totalPages = Math.ceil(data.totalHits / options.params.per_page);

      if (options.params.page > totalPages) {
        loadMore.classList.add('is-hidden');
        Notify.success(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => console.log(error));
}
