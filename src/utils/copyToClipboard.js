export default function (copyText, setStatus) {
  setStatus(true);
  navigator.clipboard.writeText(copyText).then(() => {
    setTimeout(() => {
      setStatus(false);
    }, 2000);
  });
}
