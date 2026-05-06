// === FILESYSTEM ===
const fs = {
  home: {
    "about.txt": "Hi, I'm Tina. Welcome to my portfolio!",
    "skills.txt": "HTML, CSS, JavaScript",
    projects: {
      "terminal.js": "This is my terminal project",
      "website.html": "<html>...</html>"
    }
  }
};

let currentPath = ["home"];

function getCurrentDir() {
  return currentPath.reduce((dir, key) => dir[key], fs);
}

// === TERMINAL ===
const terminal = document.getElementById("terminal");
const hiddenInput = document.getElementById("hiddenInput");

// Better mobile focus support
["click", "touchstart"].forEach(evt => {
  terminal.addEventListener(evt, () => {
    hiddenInput.focus();
  });
});

// === STATE ===
let history = [];
let historyIndex = -1;

let currentInput = "";
let cursorPos = 0;

let currentLine = null;

// === PROMPT ===
function getPrompt() {
  const path = currentPath.join("/");
  const displayPath = path === "home" ? "~" : "~/" + path.replace("home/", "");
  return `tina@dev:${displayPath}$`;
}

// === CREATE INPUT LINE ===
function createInputLine() {
  currentInput = "";
  cursorPos = 0;

  const line = document.createElement("div");

  const prompt = document.createElement("span");
  prompt.className = "prompt";
  prompt.textContent = getPrompt() + " ";

  const cmd = document.createElement("span");
  cmd.className = "cmd";

  line.appendChild(prompt);
  line.appendChild(cmd);
  terminal.appendChild(line);

  currentLine = cmd;

  renderInput();
}

// === RENDER ===
function renderInput() {
  if (!currentLine) return;

  // Ensure only ONE cursor exists
  document.querySelectorAll(".cursor").forEach(c => c.remove());

  const before = currentInput.slice(0, cursorPos);
  const after = currentInput.slice(cursorPos);

  currentLine.innerHTML =
    escapeHtml(before) +
    '<span class="cursor"></span>' +
    escapeHtml(after);

  scroll();
}

function escapeHtml(str) {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// === PRINT COMMAND ===
function printCommand(cmd) {
  const line = document.createElement("div");

  const prompt = document.createElement("span");
  prompt.className = "prompt";
  prompt.textContent = getPrompt() + " ";

  const text = document.createElement("span");
  text.textContent = cmd;

  line.appendChild(prompt);
  line.appendChild(text);

  terminal.appendChild(line);
}

// === INPUT HANDLING ===
hiddenInput.addEventListener("keydown", (e) => {

  // ENTER
  if (e.key === "Enter") {
    e.preventDefault();

    const input = currentInput;

    // save to history (only if not empty)
    if (input.trim() !== "") {
      history.push(input);
    }
    historyIndex = history.length;

    // print command ONCE
    printCommand(input);

    // run command logic
    runCommand(input);

    // reset input
    currentLine = null;
    createInputLine();

    return;
  }

  // BACKSPACE
  if (e.key === "Backspace") {
    e.preventDefault();
    if (cursorPos > 0) {
      currentInput =
        currentInput.slice(0, cursorPos - 1) +
        currentInput.slice(cursorPos);
      cursorPos--;
      renderInput();
    }
  }

  // DELETE
  if (e.key === "Delete") {
    e.preventDefault();
    currentInput =
      currentInput.slice(0, cursorPos) +
      currentInput.slice(cursorPos + 1);
    renderInput();
  }

  // LEFT
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    if (cursorPos > 0) cursorPos--;
    renderInput();
  }

  // RIGHT
  if (e.key === "ArrowRight") {
    e.preventDefault();
    if (cursorPos < currentInput.length) cursorPos++;
    renderInput();
  }

  // HOME
  if (e.key === "Home") {
    e.preventDefault();
    cursorPos = 0;
    renderInput();
  }

  // END
  if (e.key === "End") {
    e.preventDefault();
    cursorPos = currentInput.length;
    renderInput();
  }

  // HISTORY ↑
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      currentInput = history[historyIndex];
      cursorPos = currentInput.length;
      renderInput();
    }
  }

  // HISTORY ↓
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (historyIndex < history.length - 1) {
      historyIndex++;
      currentInput = history[historyIndex];
    } else {
      currentInput = "";
    }
    cursorPos = currentInput.length;
    renderInput();
  }

});

// Handle actual typing (mobile-safe)
hiddenInput.addEventListener("input", () => {
  const val = hiddenInput.value;

  currentInput =
    currentInput.slice(0, cursorPos) +
    val +
    currentInput.slice(cursorPos);

  cursorPos += val.length;
  hiddenInput.value = "";

  renderInput();
});

// === COMMANDS ===
function runCommand(cmd) {
  if (cmd === "help") {
    print("Available commands:");
    print("────────────────────────");

    const commands = [
      ["help [cmd]", "Show this help menu"],
      ["clear", "Clear the terminal"],
      ["echo [text]", "Print text"],
      ["ls", "List files and directories"],
      ["cd [dir]", "Change directory"],
      ["cat [file]", "View file contents"],
      ["pwd", "Show current directory"],
      ["whoami", "Display current user"],
      ["neofetch", "Show system info"]
    ];

    commands.forEach(([cmd, desc]) => {
      print(cmd.padEnd(10) + " --- " + desc);
    });
  }
  else if (cmd.startsWith("help ")) {
    const topic = cmd.trim().split(/\s+/)[1];

    const helpMap = {
      help: "help [command] - Show help info",
      clear: "clear - Clears the terminal",
      echo: "echo [text] - Prints text",
      ls: "ls - Lists files in current directory",
      cd: "cd [dir] - Change directory",
      cat: "cat [file] - Show file contents",
      pwd: "pwd - Show current path",
      whoami: "whoami - Show current user",
      neofetch: "neofetch - Show system info"
    };

    if (helpMap[topic]) {
      print(helpMap[topic]);
    } else {
      print("No help available for that command");
    }
  }
  else if (cmd === "ls") {
    const dir = getCurrentDir();

    const output = Object.keys(dir).map(name => {
      return typeof dir[name] === "object"
        ? name + "/"   // folder indicator
        : name;
    });

    print(output.join("  "));
  }
  else if (cmd.startsWith("cd ")) {
    const target = cmd.slice(3).trim();

    if (target === "..") {
      if (currentPath.length > 1) currentPath.pop();
    } 
    else if (target === "~" || target === "/") {
      currentPath = ["home"];
    }
    else {
      const dir = getCurrentDir();
      if (dir[target] && typeof dir[target] === "object") {
        currentPath.push(target);
      } else {
        print("No such directory");
      }
    }
  }
  else if (cmd.startsWith("cat ")) {
    const file = cmd.slice(4).trim();
    const dir = getCurrentDir();

    if (typeof dir[file] === "string") {
      print(dir[file]);
    } else {
      print("File not found");
    }
  }
  else if (cmd === "pwd") {
    print("/" + currentPath.join("/"));
  }
  else if (cmd === "clear") {
    terminal.innerHTML = "";
    createInputLine();
  }
  else if (cmd === "echo") {
    print("");
  }
  else if (cmd.startsWith("echo ")) {
    print(cmd.slice(5));
  }
  else if (cmd === "whoami") {
    print("tina");
  }
  else if (cmd === "neofetch") {
    print("tina@dev");
    print("-----------");
    print("OS: Portfolio OS");
    print("Shell: custom.js");
    print("Location: PH");
    print("Skills: HTML, CSS, JS");
  }
  else if (cmd.trim() !== "") {
    print("command not found");
  }
}

// === PRINT ===
function print(text) {
  const div = document.createElement("div");
  div.textContent = text;
  terminal.appendChild(div);
  scroll();
}

// === SCROLL ===
function scroll() {
  terminal.scrollTop = terminal.scrollHeight;
}

// Ensure input is focused initially
hiddenInput.focus();

// === INIT ===
print("Welcome to Tina's Terminal!");
print('Type "help" for commands');
createInputLine();
