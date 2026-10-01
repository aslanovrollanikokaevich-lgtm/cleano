document.addEventListener('DOMContentLoaded', () => {
  const cityPicker = document.querySelector('.city-picker');
  const languagePicker = document.querySelector('.language-picker');
  if (!cityPicker || !languagePicker) return;
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

  const languageButton = document.querySelector('.language-button');
  const languageMenu = document.querySelector('.language-menu');

  const closeLanguageMenu = () => {
    languageMenu.classList.remove('is-open');
    languageButton.setAttribute('aria-expanded', 'false');
    languageMenu.setAttribute('aria-hidden', 'true');
  };

  languageButton.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = languageMenu.classList.contains('is-open');
    if (isOpen) {
      closeLanguageMenu();
    } else {
      languageMenu.classList.add('is-open');
      languageButton.setAttribute('aria-expanded', 'true');
      languageMenu.setAttribute('aria-hidden', 'false');
    }
  });

  languageMenu.addEventListener('click', (event) => {
    const option = event.target.closest('[data-language]');
    if (!option) return;
    languageButton.textContent = option.dataset.language;
    closeLanguageMenu();
  });

  document.addEventListener('click', (event) => {
    if (!cityPicker.contains(event.target)) closeCityMenu();
    if (!languagePicker.contains(event.target)) closeLanguageMenu();
  });

  const serviceModal = document.querySelector('#service-modal');
  const serviceModalTitle = document.querySelector('#service-modal-title');
  const serviceModalButtons = document.querySelectorAll('[data-service-modal]');
  const serviceModalTitles = {
    apartments: 'Уборка квартир',
    houses: 'Уборка частных домов',
    commercial: 'Уборка коммерческих помещений',
    furniture: 'Химчистка мягкой мебели'
  };

  const closeServiceModal = () => {
    if (!serviceModal) return;
    serviceModal.classList.remove('is-open');
    serviceModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  if (serviceModal) {
    serviceModalButtons.forEach((button) => {
      button.addEventListener('click', () => {
        serviceModalTitle.textContent = serviceModalTitles[button.dataset.serviceModal] || '';
        serviceModal.classList.add('is-open');
        serviceModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
      });
    });

    serviceModal.querySelectorAll('[data-modal-close]').forEach((element) => {
      element.addEventListener('click', closeServiceModal);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeServiceModal();
    });
  }
});
