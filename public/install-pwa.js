/* Custom Install */
let installSource;
let deferredPrompt;
const btnAdd = document.querySelectorAll("#installButton");
const dissmissInstall = document.getElementById("dissmissInstall");
const divInstallStatus = document.getElementById("installAvailable");

const installContainer = document.querySelectorAll("#installContainer");

// dismiss
dissmissInstall.addEventListener("click", () => {
  installContainer.forEach((e) => {
    e.classList.remove("flex");
  });
  installContainer.forEach((e) => {
    e.classList.add("hidden");
  });

  deferredPrompt = null;
});

// Handle install available
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  console.log(e);
  showInstallPromo(e);
  deferredPrompt = e;
});

// Handle user request to install
btnAdd.forEach((e) => {
  e.addEventListener("click", (e) => {
    console.log(deferredPrompt);
    deferredPrompt?.prompt();
    deferredPrompt?.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      deferredPrompt = null;
    });
  });
});

// Hide the install button
window.addEventListener("appinstalled", (evt) => {
  installContainer.forEach((e) => {
    e.classList.add("hidden");
  });
  installContainer.forEach((e) => {
    e.classList.remove("flex");
  });

  // divInstallStatus.textContent = 'false';
  // btnAdd.setAttribute('disabled', 'disabled');
  deferredPrompt = null;
});

// Show the install button
function showInstallPromo(e) {
  installContainer.forEach((e) => {
    e.classList.remove("flex");
  });
  installContainer.forEach((e) => {
    e.classList.add("hidden");
  });
  // divInstallStatus.textContent = 'true';
  // btnAdd.removeAttribute('disabled');
}
