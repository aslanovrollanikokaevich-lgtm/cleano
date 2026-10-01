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

  const propertyType = document.querySelector('#property-type');
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

  if (requestProgress && requestSteps.length && progressItems.length) {
    const updateActiveStep = (id) => {
      progressItems.forEach((item) => {
        item.classList.toggle('is-active', item.dataset.scrollTarget === id);
      });
    };

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
    error.textContent = message;
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
      slides: ['Общий вид квартиры', 'Кухня и рабочие поверхности', 'Санузел и детали уборки']
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
      slides: ['Жилая зона дома', 'Кухня', 'Лестница и дополнительные помещения']
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
      slides: ['Офисное пространство', 'Коммерческая зона', 'Санитарная зона']
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
      slides: ['Диван до и после обработки', 'Обработка обивки', 'Результат химчистки']
    }
  };

  let currentService = null;
  let currentSlide = 0;

  const renderList = (element, items) => {
    if (!element) return;
    element.innerHTML = items.map((item) => '<li>' + item + '</li>').join('');
  };

  const renderGallery = (slides) => {
    if (!galleryTrack || !galleryDots) return;
    galleryTrack.innerHTML = slides.map((label, index) =>
      '<div class="service-gallery-slide' + (index === 0 ? ' is-active' : '') + '"><span>Фото</span><small>' + label + '</small></div>'
    ).join('');
    galleryDots.innerHTML = slides.map((_, index) =>
      '<button type="button" class="' + (index === 0 ? 'is-active' : '') + '" data-gallery-index="' + index + '" aria-label="Фото ' + (index + 1) + '"></button>'
    ).join('');
    currentSlide = 0;
  };

  const showSlide = (index) => {
    const slides = galleryTrack?.querySelectorAll('.service-gallery-slide');
    const dots = galleryDots?.querySelectorAll('[data-gallery-index]');
    if (!slides?.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === currentSlide));
    dots?.forEach((dot, i) => dot.classList.toggle('is-active', i === currentSlide));
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
      if (event.key === 'Escape') closeServiceModal();
      if (!serviceModal.classList.contains('is-open')) return;
      if (event.key === 'ArrowLeft') showSlide(currentSlide - 1);
      if (event.key === 'ArrowRight') showSlide(currentSlide + 1);
    });
  }
});
