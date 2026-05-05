const terminal = document.getElementById("terminal");

// ===== STATE =====
let history = [];
let historyIndex = -1;
let currentPath = ["home"];

// ===== FILE SYSTEM =====
const fs = {
  home: {
    type: "dir",
    children: {
      projects: {
        type: "dir",
        children: {
          "portfolio.txt": { type: "file", content: "My portfolio site." },
          "terminal.txt": { type: "file", content: "A fake OS terminal UI." }
        }
      },
      "about.txt": {
        type: "file",
        content: "Hi, I'm a dev who builds cool stuff."
      }
    }
  }
};

// ===== HELPERS =====
function getDir(path) {
  let dir = fs;
  for (let p of path) dir = dir[p].children;
  return dir;
}

function resolvePath(path) {
  let parts = path.split("/").filter(Boolean);
  let newPath = path.startsWith("/") ? [] : [...currentPath];

  for (let part of parts) {
    if (part === "..") newPath.pop();
    else newPath.push(part);
  }

  return newPath;
}

function getPrompt() {
  return `user@portfolio:~/${currentPath.join("/")}$`;
}

// ===== COMMANDS =====
const commands = {
  help: () => `
help  ls  cd  pwd  cat  clear  echo
  `,

  ls: () => {
    const dir = getDir(currentPath);
    return Object.keys(dir).map(name =>
      dir[name].type === "dir" ? `[${name}]` : name
    ).join("   ");
  },

  cd: (args) => {
    const newPath = resolvePath(args[0] || "");

    try {
      let dir = fs;
      for (let p of newPath) {
        dir = dir[p];
        if (dir.type !== "dir") throw "";
        dir = dir.children;
      }
      currentPath = newPath;
    } catch {
      return "cd: no such directory";
    }
    return "";
  },

  pwd: () => "/" + currentPath.join("/"),

  cat: (args) => {
    const dir = getDir(currentPath);
    const file = dir[args[0]];
    if (!file) return "file not found";
    if (file.type !== "file") return "not a file";
    return file.content;
  },

  clear: () => {
    terminal.innerHTML = "";
    return "";
  },

  echo: (args) => args.join(" ")
};

// ===== CREATE INPUT LINE =====
function createInputLine() {
  const line = document.createElement("div");

  const prompt = document.createElement("span");
  prompt.className = "prompt";
  prompt.textContent = getPrompt() + " ";

  const input = document.createElement("span");
  input.className = "cmd";
  input.contentEditable = true;
  input.spellcheck = false;

  line.appendChild(prompt);
  line.appendChild(input);
  terminal.appendChild(line);

  focusInput(input);
  handleInput(input, line);
}

// ===== FOCUS CARET =====
function focusInput(el) {
  el.focus();

  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);

  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

// ===== HANDLE INPUT =====
function handleInput(input, line) {
  input.addEventListener("keydown", function(e) {

    // ENTER → execute
    if (e.key === "Enter") {
      e.preventDefault();

      const text = input.innerText.trim();
      history.push(text);
      historyIndex = history.length;

      runCommand(text);

      input.contentEditable = false;
      createInputLine();
      scroll();
    }

    // BACKSPACE (prevent deleting prompt)
    if (e.key === "Backspace" && input.innerText.length === 0) {
      e.preventDefault();
    }

    // HISTORY ↑ ↓
    if (e.key === "ArrowUp") {
      if (historyIndex > 0) {
        historyIndex--;
        input.innerText = history[historyIndex];
        focusInput(input);
      }
      e.preventDefault();
    }

    if (e.key === "ArrowDown") {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.innerText = history[historyIndex];
      } else {
        input.innerText = "";
      }
      focusInput(input);
      e.preventDefault();
    }
  });
}

// ===== RUN COMMAND =====
function runCommand(text) {
  if (!text) return;

  const [cmd, ...args] = text.split(" ");

  if (commands[cmd]) {
    const output = commands[cmd](args);
    if (output) print(output);
  } else {
    print("command not found");
  }
}

// ===== PRINT OUTPUT =====
function print(text) {
  text.split("\n").forEach(line => {
    const div = document.createElement("div");

    if (line.startsWith("[")) {
      div.innerHTML = `<span style="color:#00aaff">${line}</span>`;
    } else {
      div.textContent = line;
    }

    terminal.appendChild(div);
  });
}

// ===== SCROLL =====
function scroll() {
  terminal.scrollTop = terminal.scrollHeight;
}

// Boot
print("Welcome to Portfolio OS");
print('Type "help" to start');
createInputLine();
