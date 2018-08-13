import './style.scss';

function getAcquisitionData() {
  // data passed by parent as GET parameters
  let referrerPageViewId;
  let referrerUrl;
  try {
      const optimizeEpicUrl = new URL(window.location.href);
      referrerPageViewId = optimizeEpicUrl.searchParams.get('pvid');
      referrerUrl = optimizeEpicUrl.searchParams.get('url');
  } catch(_) {}

  return {
      componentType: 'ACQUISITIONS_EPIC',
      source: 'GUARDIAN_WEB',
      componentId: 'iframe_control_epic',
      abTest: {
          name: 'iframe_or_not',
          variant: 'iframe'
      },
      referrerPageViewId: referrerPageViewId,
      referrerUrl: referrerUrl,
  };
}

function enrichClickThroughURL(acquisitionData) {

  const button = document.querySelector('.js-epic-single-button');
  if (!button) {
      return;
  }

  let clickThroughUrl;
  try {
      clickThroughUrl = new URL(button.href);
  } catch (_) {
      return;
  }

  // Acquisition data percent encoded by set() method
  clickThroughUrl.searchParams.set('acquisitionData', JSON.stringify(acquisitionData));
  button.href = clickThroughUrl.toString();
}

function useLocalCurrencySymbol() {
  const currencySymbol = document.querySelector('.js-currency-symbol');
  if (!currencySymbol) {
    return;
  }

  try {
      const optimizeEpicUrl = new URL(window.location.href);
      const localCurrencySymbol = optimizeEpicUrl.searchParams.get('lcs');
      if (localCurrencySymbol) {
          currencySymbol.innerHTML = localCurrencySymbol;
      }
  } catch (_) {};
}

function init() {
  const acquisitionData = getAcquisitionData();
  enrichClickThroughURL(acquisitionData);
  useLocalCurrencySymbol();
}

init();
