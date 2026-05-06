const disabledKeys = ["c", "C", "x", "X", "u", "U", "s", "S", "i", "I"];

const showAlert = (e) => {
  e.preventDefault();
  return alert("This feature is restricted!");
}

document.addEventListener("contextmenu", showAlert);

document.addEventListener("keydown", e => {
  if ((e.ctrlKey && disabledKeys.includes(e.key)) || e.key === "F12") {
    showAlert(e);
  }
});

const terminal1 = "tina",
      terminal2 = "dev",
      showTerminal1 = `${terminal1}`,
      showTerminal2 = `@${terminal2}:~$&nbsp;ls`;

if (terminal1 != null) {
  document.getElementById("terminal1").innerHTML = showTerminal1.toString();
  document.getElementById("terminal2").innerHTML = showTerminal2.toString();
} else {
  document.getElementById("terminal1").innerHTML = showTerminal1.toString();
}

const verStart = 2,
      verBugs = 0,
      verChanges = 7,
      verName = null;

if (verName != null) {
  const showName = `${verName} Version`;
  document.getElementById("currentVersion").innerHTML = showName.toString();
} else {
  const showVer = `Version ${verStart}.${verBugs}.${verChanges}`;

  if (verStart === null) {
    const errMsg = "<code class='text-danger'>ERROR: VERSION NOT FOUND</code>";

document.getElementById("currentVersion").innerHTML = errMsg.toString();
  } else {
    document.getElementById("currentVersion").innerHTML = showVer.toString();
  }
}

const u = new Date("2023"),
      w = new Date(),
      x = u.getFullYear(),
      y = w.getFullYear(),
      copyR = "Copyright &COPY;",
      authorName = "TINA SALADA",
      showYear1 = `${authorName}<br>${copyR} ${x}`,
      showYear2 = `${authorName}<br>${copyR} ${x}-${y}`;

if (x != y && x < y) {
  document.getElementById("currentYear").innerHTML = showYear2.toString();
} else {
  document.getElementById("currentYear").innerHTML = showYear1.toString();
}

const siteTheme = "Theme: Neon Glow";

if (siteTheme != null) {
  document.getElementById("currentTheme").innerHTML = siteTheme.toString();
} else {
  const customThemeMsg = "Custom theme used";
  document.getElementById("currentTheme").innerHTML = customThemeMsg.toString();
}

const footerText = "Host: GitHub Pages"

document.getElementById("moreFooterText").innerHTML = footerText.toString();

function goBack() {
  window.history.back();
}
