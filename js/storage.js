/**
 * The token used for authentication with the remote storage.
 * @const {string}
 */
const STORAGE_TOKEN = 'T8IB87MOO0BRJLZ0W0I4O7DAUN6QZYEBWX8ZNG9M';

/**
 * The URL endpoint for the remote storage service.
 * @const {string}
 */
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * Asynchronously sets an item in the remote storage.
 * @param {string} key - The key under which the item should be stored.
 * @param {string} value - The value to be stored.
 * @returns {Promise<Object>} A promise that resolves to the response from the storage service.
 */
async function setItem(key, value) {
  const payload = {key, value, token: STORAGE_TOKEN};
  return fetch(STORAGE_URL, {method: 'POST', body: JSON.stringify(payload)}).then(res => res.json());
}

/**
 * Asynchronously retrieves an item from the remote storage.
 * @param {string} key - The key under which the item is stored.
 * @returns {Promise<string>} A promise that resolves to the retrieved value.
 * @throws Will throw an error if the item with the specified key is not found.
 */
async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url)
    .then(res => res.json())
    .then(res => {
      if (res.data) {
        return res.data.value;
      }
      throw `Could not find data with key "${key}".`;
    });
}
