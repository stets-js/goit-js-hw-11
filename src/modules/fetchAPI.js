import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';

const options = {
  params: {
    key: '29464455-01c51d89f246e5a0f625124f5',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: 1,
    per_page: 40,
  },
};

export async function getPhotos(q) {
  try {
    const response = await axios.get(`${BASE_URL}?q=${q}`, options);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

//getPhotos('cat');

//?key=${options.params.key}&q=${q}&image_type=${options.params.image_type}&orientation=${options.params.orientation}&safesearch=${options.params.safesearch}&page=${options.params.page}&per_page=${options.params.per_page}
