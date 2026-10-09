document.addEventListener('DOMContentLoaded', () => {
  const cityPicker = document.querySelector('.city-picker');
  const languagePicker = document.querySelector('.language-picker');
  if (!cityPicker || !languagePicker) return;
  const cityButton = document.querySelector('.city-button');
  const cityMenu = document.querySelector('.city-menu');
  const languageButton = document.querySelector('.language-button');
  const languageMenu = document.querySelector('.language-menu');
  const safeGet = (key) => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
  const restoreChoice = (button, menu, attribute, storageKey) => {
    const saved = safeGet(storageKey);
    const option = saved && menu.querySelector(`[${attribute}="${saved}"]`);
    if (option) button.textContent = option.textContent;
    menu.querySelectorAll('[role="option"]').forEach((item) => {
      item.setAttribute('aria-selected', String(item === option || (!option && item.textContent.trim() === button.textContent.trim())));
    });
  };
  restoreChoice(cityButton, cityMenu, 'data-city', 'cleano-city');
  restoreChoice(languageButton, languageMenu, 'data-language', 'cleano-language');

  const syncRequestCity = (cityLabel) => {
    const cityField = document.querySelector('select[name="city"]');
    if (cityField) cityField.value = cityLabel === 'Астана' ? 'astana' : 'almaty';
  };
  syncRequestCity(cityButton.textContent.trim());

  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navigation a').forEach((link) => {
    const targetFile = link.getAttribute('href').split('#')[0];
    if (targetFile === currentFile || (!currentFile && targetFile === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });

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
    safeSet('cleano-city', option.dataset.city);
    syncRequestCity(option.dataset.city);
    cityMenu.querySelectorAll('[role="option"]').forEach((item) => item.setAttribute('aria-selected', String(item === option)));
    closeCityMenu();
  });

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
    safeSet('cleano-language', option.dataset.language);
    languageMenu.querySelectorAll('[role="option"]').forEach((item) => item.setAttribute('aria-selected', String(item === option)));
    closeLanguageMenu();
  });

  document.addEventListener('click', (event) => {
    if (!cityPicker.contains(event.target)) closeCityMenu();
    if (!languagePicker.contains(event.target)) closeLanguageMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const cityWasOpen = cityMenu.classList.contains('is-open');
    const languageWasOpen = languageMenu.classList.contains('is-open');
    closeCityMenu();
    closeLanguageMenu();
    if (cityWasOpen) cityButton.focus();
    else if (languageWasOpen) languageButton.focus();
  });

  const propertyType = document.querySelector('#property-type');
  const dateField = document.querySelector('input[name="date"]');
  const getLocalDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  if (dateField) dateField.min = getLocalDate();
  const areaField = document.querySelector('#area-field');
  const furnitureFields = document.querySelector('#furniture-fields');

  const updateRequestFields = () => {
    if (!propertyType || !areaField || !furnitureFields) return;
    const isFurniture = propertyType.value === 'Мягкая мебель';
    areaField.hidden = isFurniture;
    furnitureFields.hidden = !isFurniture;
  };

  propertyType?.addEventListener('change', updateRequestFields);
  updateRequestFields();


  const requestProgress = document.querySelector('.request-progress');
  const requestSteps = document.querySelectorAll('.request-modern-section[id]');
  const progressItems = document.querySelectorAll('[data-scroll-target]');

  progressItems.forEach((item) => {
    item.addEventListener('click', () => {
      const target = document.getElementById(item.dataset.scrollTarget);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const updateActiveStep = (id) => {
    progressItems.forEach((item) => {
      item.classList.toggle('is-active', item.dataset.scrollTarget === id);
    });
  };

  if (requestProgress && requestSteps.length && progressItems.length) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) updateActiveStep(visible.target.id);
    }, {
      root: null,
      rootMargin: '-18% 0px -55% 0px',
      threshold: [0.1, 0.35, 0.6]
    });

    requestSteps.forEach((step) => observer.observe(step));
  }

  const requestForm = document.querySelector('.request-form-modern');
  const requestSuccess = document.querySelector('#request-success');

  const clearFieldError = (field) => {
    field.classList.remove('has-error');
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
    const error = field.closest('.request-modern-field')?.querySelector('.request-field-error');
    error?.remove();
  };

  const showFieldError = (field, message) => {
    clearFieldError(field);
    field.classList.add('has-error');
    field.setAttribute('aria-invalid', 'true');
    const wrapper = field.closest('.request-modern-field');
    if (!wrapper) return;
    const error = document.createElement('small');
    error.className = 'request-field-error';
    error.id = `${field.name || 'field'}-error`;
    error.textContent = message;
    field.setAttribute('aria-describedby', error.id);
    wrapper.appendChild(error);
  };

  const validateRequestForm = () => {
    const fields = [
      [requestForm.querySelector('[name="name"]'), 'Введите имя.'],
      [requestForm.querySelector('[name="phone"]'), 'Введите номер телефона.'],
      [requestForm.querySelector('[name="city"]'), 'Выберите город.'],
      [requestForm.querySelector('[name="property"]'), 'Выберите тип объекта.'],
      [requestForm.querySelector('[name="address"]'), 'Укажите адрес объекта.'],
      [requestForm.querySelector('[name="date"]'), 'Укажите предпочтительную дату.'],
      [requestForm.querySelector('[name="time"]'), 'Выберите удобный временной интервал.']
    ];

    const propertyValue = propertyType?.value;
    if (propertyValue === 'Мягкая мебель') {
      fields.push(
        [requestForm.querySelector('[name="furniture"]'), 'Укажите, какую мебель нужно очистить.'],
        [requestForm.querySelector('[name="furniture_count"]'), 'Укажите количество изделий.']
      );
    } else {
      fields.push([requestForm.querySelector('[name="area"]'), 'Укажите примерную площадь.']);
    }

    const invalid = fields.filter(([field]) => field && !field.value.trim());
    const phoneField = requestForm.querySelector('[name="phone"]');
    if (phoneField?.value.trim()) {
      const digits = phoneField.value.replace(/\\D/g, '');
      if (digits.length < 10 || digits.length > 15) {
        invalid.push([phoneField, 'Проверьте номер: укажите от 10 до 15 цифр с кодом страны.']);
      }
    }
    if (dateField?.value && dateField.value < getLocalDate()) {
      invalid.push([dateField, 'Выберите сегодняшнюю или будущую дату.']);
    }
    requestForm.querySelectorAll('.request-modern-field input, .request-modern-field select').forEach((field) => {
      if (!invalid.some(([item]) => item === field)) clearFieldError(field);
    });

    invalid.forEach(([field, message]) => showFieldError(field, message));

    if (!invalid.length) return true;

    const firstInvalid = invalid[0][0];
    firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => firstInvalid?.focus({ preventScroll: true }), 350);
    const targetStep = firstInvalid?.closest('.request-modern-section');
    if (targetStep) updateActiveStep?.(targetStep.id);
    return false;
  };

  requestForm?.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('input', () => {
      if (field.value.trim()) clearFieldError(field);
    });
    field.addEventListener('change', () => {
      if (field.value.trim()) clearFieldError(field);
    });
  });

  requestForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!requestSuccess || !validateRequestForm()) return;

    requestForm.querySelectorAll(':scope > *:not(#request-success)').forEach((element) => {
      element.style.display = 'none';
    });

    requestSuccess.classList.add('is-visible');
    requestSuccess.setAttribute('aria-hidden', 'false');
    requestSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  const serviceModal = document.querySelector('#service-modal');
  const serviceModalTitle = document.querySelector('#service-modal-title');
  const serviceModalKicker = document.querySelector('#service-modal-kicker');
  const serviceModalLead = document.querySelector('#service-modal-lead');
  const serviceModalButtons = document.querySelectorAll('[data-service-modal]');
  const galleryTrack = document.querySelector('#service-gallery-track');
  const galleryDots = document.querySelector('#service-gallery-dots');
  const galleryPrev = document.querySelector('.service-gallery-prev');
  const galleryNext = document.querySelector('.service-gallery-next');
  const includedList = document.querySelector('#service-included');
  const extraList = document.querySelector('#service-extra');
  const price = document.querySelector('#service-price');
  const priceNote = document.querySelector('#service-price-note');
  const duration = document.querySelector('#service-duration');
  const durationNote = document.querySelector('#service-duration-note');
  const prep = document.querySelector('#service-prep');
  const prepNote = document.querySelector('#service-prep-note');
  const serviceNote = document.querySelector('#service-note');
  const serviceCta = document.querySelector('#service-cta');

  const serviceData = {
    apartments: {
      kicker: 'Уборка квартир',
      title: 'Чистота и порядок в каждой комнате',
      lead: 'Профессиональная уборка квартиры с учётом площади, состояния помещений и ваших задач. Подходит как для разового заказа, так и для регулярного поддержания чистоты.',
      included: [
        'Сухая и влажная уборка доступных поверхностей',
        'Удаление пыли с мебели, подоконников и других открытых поверхностей',
        'Пылесос и влажная уборка полов',
        'Кухня: мойка рабочих поверхностей, фартука, мойки и плиты снаружи',
        'Санузел: раковина, унитаз, ванна или душ, зеркала и доступные поверхности',
        'Протирка дверных ручек и других часто используемых поверхностей',
        'Вынос бытового мусора и замена пакетов'
      ],
      extra: [
        'Мытьё окон и стеклянных поверхностей',
        'Уборка внутри шкафов и бытовой техники',
        'Химчистка мягкой мебели и ковров',
        'Уборка балкона или лоджии',
        'Уборка после ремонта, переезда или длительного простоя'
      ],
      price: 'Рассчитывается индивидуально',
      priceNote: 'Основные факторы — площадь, тип уборки, состояние квартиры и дополнительные работы.',
      duration: 'Зависит от объёма',
      durationNote: 'Перед подтверждением заявки менеджер согласует ориентировочное время.',
      prep: 'Минимальная',
      prepNote: 'Достаточно убрать личные вещи, которые не должны перемещаться или обрабатываться.',
      note: 'Состав работ можно адаптировать под квартиру. Если помещение сильно загрязнено или требуется уборка после ремонта, объём и стоимость согласовываются отдельно до начала работ.',
      slides: [
        { label: 'Светлый интерьер квартиры', alt: 'Светлый интерьер квартиры', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85' },
        { label: 'Специалист за уборкой', alt: 'Специалист выполняет уборку пола в жилом помещении', image: 'https://images.unsplash.com/photo-1758272421516-9593de0fb5bf?auto=format&fit=crop&w=1400&q=85' },
        { label: 'Современная гостиная', alt: 'Современная гостиная с аккуратной мебелью', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85' }
      ]
    },
    houses: {
      kicker: 'Уборка частных домов',
      title: 'Чистый дом без лишних забот',
      lead: 'Убираем частные дома и коттеджи с учётом площади, количества помещений, этажности и фактического состояния объекта. Состав работ согласовываем до начала уборки.',
      included: [
        'Удаление пыли с доступных поверхностей и мебели',
        'Пылесос и влажная уборка полов в согласованных помещениях',
        'Протирка подоконников, дверных ручек и доступных поверхностей',
        'Кухня: рабочие поверхности, мойка, плита и внешние поверхности техники',
        'Санузлы: сантехника, зеркала и доступные поверхности',
        'Уборка лестниц и проходных зон при необходимости',
        'Вынос бытового мусора'
      ],
      extra: [
        'Мытьё окон и остекления',
        'Уборка террас, балконов и других дополнительных зон',
        'Уборка внутри пустых шкафов и отдельных зон хранения',
        'Химчистка мебели и ковровых покрытий',
        'Глубокая уборка после ремонта, переезда или длительного простоя'
      ],
      price: 'Рассчитывается индивидуально',
      priceNote: 'Учитываются площадь, количество помещений, этажность, состояние объекта и дополнительные зоны.',
      duration: 'Зависит от объёма',
      durationNote: 'Для больших домов может потребоваться несколько специалистов и больше времени.',
      prep: 'По согласованию',
      prepNote: 'Перед визитом желательно определить зоны, которые входят в уборку, и убрать ценные личные вещи.',
      note: 'Для домов большой площади или объектов со сложным состоянием сначала желательно уточнить детали с менеджером. Это позволяет заранее определить необходимый состав работ и время.',
      slides: [
        { label: 'Современный частный дом', alt: 'Экстерьер современного частного дома', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=85' },
        { label: 'Уютный жилой интерьер', alt: 'Светлый интерьер жилого дома', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=85' },
        { label: 'Просторное жилое пространство', alt: 'Просторный современный интерьер', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56c0a?auto=format&fit=crop&w=1400&q=85' }
      ]
    },
    commercial: {
      kicker: 'Уборка коммерческих помещений',
      title: 'Порядок, который работает на ваш бизнес',
      lead: 'Организуем уборку офисов, кафе, ресторанов, магазинов и других коммерческих помещений. Формат обслуживания подбирается под площадь, режим работы и задачи бизнеса.',
      included: [
        'Сухая и влажная уборка полов и доступных поверхностей',
        'Удаление пыли с мебели, рабочих поверхностей и подоконников',
        'Уборка санузлов и санитарных зон',
        'Очистка дверей, ручек и других часто используемых поверхностей',
        'Уборка кухонных и бытовых зон в пределах согласованного объёма',
        'Вынос мусора и поддержание порядка в общих зонах',
        'Работа по согласованному чек-листу и графику'
      ],
      extra: [
        'Генеральная уборка',
        'Мытьё окон и стеклянных перегородок',
        'Химчистка мебели и ковровых покрытий',
        'Уборка после мероприятий или переезда',
        'Периодические дополнительные работы по согласованному графику'
      ],
      price: 'Рассчитывается индивидуально',
      priceNote: 'Стоимость зависит от площади, типа помещения, частоты уборки, графика и состава работ.',
      duration: 'По согласованному графику',
      durationNote: 'Для регулярного обслуживания время и частота определяются после оценки объекта.',
      prep: 'Минимальная',
      prepNote: 'Заранее согласовываются рабочие зоны, график доступа и особенности помещения.',
      note: 'Для бизнеса особенно важен график: уборку можно планировать до открытия, после закрытия или в другое удобное время. Точный состав работ фиксируется до начала обслуживания.',
      slides: [
        { label: 'Офисное пространство', alt: 'Современное офисное пространство', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=85' },
        { label: 'Уборка офисного помещения', alt: 'Специалист выполняет уборку пола в офисе', image: 'https://images.unsplash.com/photo-1781637590564-01c65dbf2039?auto=format&fit=crop&w=1400&q=85' },
        { label: 'Рабочая зона', alt: 'Организованная рабочая зона в офисе', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85' }
      ]
    },
    furniture: {
      kicker: 'Химчистка мягкой мебели',
      title: 'Возвращаем мебели свежий вид',
      lead: 'Выездная химчистка диванов, кресел и другой мягкой мебели. Специалист оценивает материал и состояние обивки, подбирает подходящий способ обработки и работает непосредственно на объекте.',
      included: [
        'Осмотр мебели и оценка состояния обивки',
        'Определение подходящего способа и состава обработки',
        'Удаление поверхностных загрязнений и пыли',
        'Предварительная обработка загрязнённых участков',
        'Глубокая очистка с использованием профессионального оборудования',
        'Удаление остатков чистящего состава и лишней влаги',
        'Финальная проверка результата'
      ],
      extra: [
        'Обработка от отдельных запахов',
        'Удаление шерсти домашних животных',
        'Работа со сложными и застарелыми загрязнениями',
        'Чистка съёмных подушек и дополнительных элементов',
        'Дополнительная защитная обработка — если подходит для материала'
      ],
      price: 'Рассчитывается индивидуально',
      priceNote: 'Основные факторы — размер и тип мебели, материал обивки, количество изделий и состояние загрязнения.',
      duration: 'Зависит от мебели',
      durationNote: 'После очистки мебели требуется время на высыхание; оно зависит от материала и условий в помещении.',
      prep: 'Желательна',
      prepNote: 'Нужно обеспечить доступ к мебели, электричеству и, при необходимости, воде.',
      note: 'Результат зависит от материала обивки, возраста и характера загрязнения. Не каждое пятно или запах можно удалить полностью, поэтому специалист оценивает риски до начала работы.',
      slides: [
        { label: 'Диван в современной гостиной', alt: 'Диван в современной гостиной', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=85' },
        { label: 'Мягкая мебель', alt: 'Кресло и мягкая мебель в интерьере', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1400&q=85' },
        { label: 'Мебель в жилом интерьере', alt: 'Мягкая мебель в светлой гостиной', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85' }
      ]
    }
  };

  let currentService = null;
  let currentSlide = 0;
  let modalReturnFocus = null;

  const renderList = (element, items) => {
    if (!element) return;
    element.innerHTML = items.map((item) => '<li>' + item + '</li>').join('');
  };

  const renderGallery = (slides) => {
    if (!galleryTrack || !galleryDots) return;
    galleryTrack.innerHTML = slides.map((slide, index) =>
      '<div class="service-gallery-slide' + (index === 0 ? ' is-active' : '') + '" aria-hidden="' + (index !== 0) + '">' +
      '<img src="' + slide.image + '" alt="' + slide.alt + '" loading="' + (index === 0 ? 'eager' : 'lazy') + '" decoding="async">' +
      '<div class="service-gallery-caption"><span>Иллюстративное фото</span><small>' + slide.label + '</small></div></div>'
    ).join('');
    galleryDots.innerHTML = slides.map((slide, index) =>
      '<button type="button" class="' + (index === 0 ? 'is-active' : '') + '" data-gallery-index="' + index + '" aria-label="Показать фото: ' + slide.label + '" aria-pressed="' + (index === 0) + '"></button>'
    ).join('');
    currentSlide = 0;
  };

  const showSlide = (index) => {
    const slides = galleryTrack?.querySelectorAll('.service-gallery-slide');
    const dots = galleryDots?.querySelectorAll('[data-gallery-index]');
    if (!slides?.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === currentSlide);
      slide.setAttribute('aria-hidden', String(i !== currentSlide));
    });
    dots?.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentSlide);
      dot.setAttribute('aria-pressed', String(i === currentSlide));
    });
  };

  const closeServiceModal = () => {
    if (!serviceModal || !serviceModal.classList.contains('is-open')) return;
    serviceModal.classList.remove('is-open');
    serviceModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    modalReturnFocus?.focus();
  };

  if (serviceModal) {
    serviceModalButtons.forEach((button) => {
      button.addEventListener('click', () => {
        modalReturnFocus = button;
        currentService = serviceData[button.dataset.serviceModal];
        if (!currentService) return;
        serviceModalKicker.textContent = currentService.kicker;
        serviceModalTitle.textContent = currentService.title;
        serviceModalLead.textContent = currentService.lead;
        renderGallery(currentService.slides);
        renderList(includedList, currentService.included);
        renderList(extraList, currentService.extra);
        price.textContent = currentService.price;
        priceNote.textContent = currentService.priceNote;
        duration.textContent = currentService.duration;
        durationNote.textContent = currentService.durationNote;
        prep.textContent = currentService.prep;
        prepNote.textContent = currentService.prepNote;
        serviceNote.textContent = currentService.note;
        serviceModal.classList.add('is-open');
        serviceModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        serviceModal.querySelector('.service-modal-close')?.focus();
      });
    });

    galleryPrev?.addEventListener('click', () => showSlide(currentSlide - 1));
    galleryNext?.addEventListener('click', () => showSlide(currentSlide + 1));
    galleryDots?.addEventListener('click', (event) => {
      const dot = event.target.closest('[data-gallery-index]');
      if (dot) showSlide(Number(dot.dataset.galleryIndex));
    });

    serviceModal.querySelectorAll('[data-modal-close]').forEach((element) => {
      element.addEventListener('click', closeServiceModal);
    });

    document.addEventListener('keydown', (event) => {
      if (!serviceModal.classList.contains('is-open')) return;
      if (event.key === 'Escape') {
        closeServiceModal();
        return;
      }
      if (event.key === 'ArrowLeft') showSlide(currentSlide - 1);
      if (event.key === 'ArrowRight') showSlide(currentSlide + 1);

      if (event.key === 'Tab') {
        const focusable = [...serviceModal.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )].filter((element) => element.getClientRects().length > 0);
        if (!focusable.length) {
          event.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && (document.activeElement === first || !serviceModal.contains(document.activeElement))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !serviceModal.contains(document.activeElement))) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }
});
