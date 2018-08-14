function isDocumentLoaded() {
    return document.readyState === 'complete' 
        ? Promise.resolve()
        : new Promise(resolve => window.addEventListener('load', resolve))
}

function isPaymentImageLoaded() {
    const image = document.querySelector('.js-payment-image');
    if (!image || image.complete) {
        return Promise.resolve();
    }
    return new Promise(resolve => image.onload = resolve);
}

function read(fn) {
    return new Promise(resolve => window.requestAnimationFrame(() => {
        resolve(fn());
    }));
}

export {
    isDocumentLoaded,
    isPaymentImageLoaded,
    read
}