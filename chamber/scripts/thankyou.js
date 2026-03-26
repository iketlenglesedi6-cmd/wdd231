function getParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || '--';
}

const mappings = {
  first: 'ty-first',
  last: 'ty-last',
  email: 'ty-email',
  phone: 'ty-phone',
  organization: 'ty-organization',
  timestamp: 'ty-timestamp'
};

Object.keys(mappings).forEach((key) => {
  const el = document.getElementById(mappings[key]);
  if (el) {
    el.textContent = getParam(key);
  }
});
