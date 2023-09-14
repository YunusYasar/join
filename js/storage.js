/**
 * The storage token used for authentication with the remote storage service.
 */
const STORAGE_TOKEN = 'T8IB87MOO0BRJLZ0W0I4O7DAUN6QZYEBWX8ZNG9M';


/**
 * The base URL for the remote storage service.
 */
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


/**
 * Asynchronously stores a value under a given key in the remote storage.
 *
 * @param {string} key - The key under which the value will be stored.
 * @param {string} value - The value to be stored.
 * @returns {Promise<Object>} A promise that resolves to the server's response.
 */
async function setItem(key, value) {
  const payload = {key, value, token: STORAGE_TOKEN};
  return fetch(STORAGE_URL, {method: 'POST', body: JSON.stringify(payload)}).then(res => res.json());
}


/**
 * Asynchronously retrieves a value stored under a given key from the remote storage.
 *
 * @param {string} key - The key for which the value will be retrieved.
 * @returns {Promise<string>} A promise that resolves to the retrieved value or rejects if the key is not found.
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