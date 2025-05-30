// close function

// function clickDisappear() {
//   // obj.style.display = "none";
//   obj.class = "d-none";
// }

////////////////////////////////////////////////

// shortcut keys that will be disabled
const disabledKeys = ["c", "C", "x", "X", "u", "U", "s", "S", "i", "I"];

const showAlert = (e) => {
  e.preventDefault(); // prevent default behavior
  return alert("This feature is restricted!");
}

// call showAlert on mouse right-click
document.addEventListener("contextmenu", showAlert);

document.addEventListener("mousedown", e => {
  // call showAlert, if the pressed key is F12 or matched to disable keys
  if ((e.ctrlKey && disabledKeys.includes(e.key)) || e.key === "F12") {
    showAlert(e);
  }
});


//////////////////////////////////////////////////

// Display Current Version
const verStart = 0,
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


//////////////////////////////////////////////////

// Display Current Year
const u = new Date("2025"),
      w = new Date(),
      x = u.getFullYear(),
      y = w.getFullYear(),
      copyR = "Copyright &COPY;",
      authorName = "TINA",
      showYear1 = `${copyR} ${x} ${authorName}`,
      showYear2 = `${copyR} ${x}-${y} ${authorName}`;

if (x != y && x < y) {
  document.getElementById("currentYear").innerHTML = showYear2.toString();
} else {
  document.getElementById("currentYear").innerHTML = showYear1.toString();
}


//////////////////////////////////////////////////

// Dispaly Used Theme
const siteTheme = "Theme: Neon Glow";

if (siteTheme != null) {
  document.getElementById("currentTheme").innerHTML = siteTheme.toString();
} else {
  const customThemeMsg = "Custom theme used";
  document.getElementById("currentTheme").innerHTML = customThemeMsg.toString();
}


//////////////////////////////////////////////////

// Display more details on footer
const footerText = "Host: GitHub"

document.getElementById("moreFooterText").innerHTML = footerText.toString();

//////////////////////////////////////////////////

// Go Back Function
function goBack() {
  window.history.back();
}


//////////////////////////////////////////////////

// Right Click Checker Function
// const message = "Warning: Function has been disabled!";

// function rtclickcheck(keyp) {
//   if (navigator.userAgentData == "Netscape" && keyp.which == 3) {
//     alert(message);
//     return false;
//   }

//   if (navigator.userAgentData.indexOf("MSIE") != -1 && window.event.button == 2) {
//     alert(message);
//     return false;
//   }
// }

//? document.oncontextmenu = rtclickcheck();
//? document.onmousedown = rtclickcheck();
//? document.onmouseup = rtclickcheck();

//! function rtclickcheck(keyp) {
//!   if (navigator.appName == "Netscape" && keyp.which == 3) {
//!     alert(message);
//!     return false;
//!   }
//!
//!   if (navigator.appVersion.indexOf("MSIE") != -1 && event.button == 2) {
//!     alert(message);
//!     return false;
//!   }
//! }
//! document.onmousedown = rtclickcheck;


//////////////////////////////////////////////////

// Mouse Handler Function
// function mousehandler(e) {
//   const myevent = isNS ? e : window.event;
//   const eventbutton = isNS ? myevent.which : myevent.button;

//   if (eventbutton == 2 || eventbutton == 3) {
//     return false;
//   }
// }

//? document.oncontextmenu = mousehandler();
//? document.onmousedown = mousehandler();
//? document.onmouseup = mousehandler();


//////////////////////////////////////////////////

// Disable Control Key Combinations
// function disableCtrlKeyCombination(e) {
//   const forbiddenKeys = new Array("a", "s", "c", "x", "u");
//   let key,
//       isCtrl;

//   if (window.event) {
//     key = window.event.keyCode;

//     if (window.event.ctrlKey) {
//       isCtrl = true;
//     } else {
//       isCtrl = false;
//     }
//   } else {
//     key = e.which;

//     if (e.ctrlKey) {
//       isCtrl = true;
//     } else {
//       isCtrl = false;
//     }
//   }

//   if (isCtrl) {
//     for (i = 0; i < forbiddenKeys.length; i++) {
//       if (forbiddenKeys[i].toLowerCase() == String.fromCharCode(key).toLowerCase()) {
//         return false;
//       }
//     }
//   }

//   return true;
// }

//? document.oncontextmenu = disableCtrlKeyCombination();
//? document.onmousedown = disableCtrlKeyCombination();
//? document.onmouseup = disableCtrlKeyCombination();
