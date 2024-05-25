export function copyToClipboard(url) {
  navigator.clipboard.writeText(url)
    .then(() => {
      console.log('URL copied to clipboard:', url);
      // You can optionally show a success message or perform other actions here
    })
    .catch(error => {
      console.error('Error copying URL to clipboard:', error);
      // You can handle errors here
    });
}