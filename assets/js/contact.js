/* Native contact links: phone dialer on phones, email compose on computers. */
export function resolveContactHref({ mobile, userAgent = '' } = {}) {
  const isPhone = typeof mobile === 'boolean'
    ? mobile
    : /iPhone|iPod|Android.*Mobile|Windows Phone|IEMobile/i.test(userAgent);
  return isPhone
    ? 'tel:+918758242103'
    : 'mailto:sachinpranami92@gmail.com?subject=Software%20engineering%20opportunity';
}

if (typeof document !== 'undefined') {
  const href = resolveContactHref({
    mobile: navigator.userAgentData?.mobile,
    userAgent: navigator.userAgent
  });
  document.querySelectorAll('[data-smart-contact]').forEach(link => {
    link.href = href;
    link.setAttribute('aria-label', href.startsWith('tel:')
      ? 'Call Sachin Pranami at +91 8758242103'
      : 'Compose an email to sachinpranami92@gmail.com');
  });
}
