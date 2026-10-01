document.addEventListener('DOMContentLoaded', () => {
  const cityPicker = document.querySelector('.city-picker');
  const cityButton = document.querySelector('.city-button');
  const cityMenu = document.querySelector('.city-menu');

  const closeCityMenu = () => {
    cityMenu.classList.remove('is-open');
    cityButton.setAttribute('aria-expanded', 'false');
    cityMenu.setAttribute('aria-hidden', 'true');
  };

  const toggleCityMenu = (event) => {
    event.stopPropagation();
    const isOpen = cityMenu.classList.contains('is-open');
    if (isOpen) {
      closeCityMenu();
    } else {
      cityMenu.classList.add('is-open');
      cityButton.setAttribute('aria-expanded', 'true');
      cityMenu.setAttribute('aria-hidden', 'false');
    }
  };

  cityButton.addEventListener('click', toggleCityMenu);

  cityMenu.addEventListener('click', (event) => {
    const option = event.target.closest('[data-city]');
    if (!option) return;
    cityButton.textContent = option.dataset.city;
    closeCityMenu();
  });

  document.addEventListener('click', (event) => {
    if (!cityPicker.contains(event.target)) closeCityMenu();
  });
});