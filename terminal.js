const terminal = document.getElementById("terminal");
const input = document.getElementById("terminal-input");

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
          "portfolio.txt": {
            type: "file",
            content: "My personal website built with Bootstrap + Neon Glow."
          },
          "terminal.txt": {
            type: "file",
            content: "Interactive terminal UI built with vanilla JavaScript."
          }
        }
      },
      socials: {
        type: "dir",
        children: {
          "github.txt": {
            type: "file",
            content: "https://github.com/yourname"
          },
          "twitter.txt": {
            type: "file",
            content: "https://twitter.com/yourname"
          }
        }
      },
      "about.txt": {
        type: "file",
        content: "Hi, I'm a developer who likes building cool UI."
      }
    }
  }
};

// ===== HELPERS =====
function getDir(pathArray) {
  let dir = fs;
  for (let p of pathArray) {
    dir = dir[p].children;
  }
  return dir;
}

function resolvePath(path) {
  if (!path) return currentPath;

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

  help() {
    return `
help       list commands
ls         list files
cd         change directory
pwd        show path
cat        read file
clear      clear terminal
echo       print text
open       open link
    `;
  },

  ls() {
    const dir = getDir(currentPath);
    return Object.keys(dir)
      .map(name => {
        const item = dir[name];
        return item.type === "dir"
          ? `[${name}]`
          : name;
      })
      .join("    ");
  },

  cd(args) {
    const path = args[0];
    if (!path) return "";

    const newPath = resolvePath(path);

    try {
      let dir = fs;
      for (let p of newPath) {
        dir = dir[p];
        if (dir.type !== "dir") throw "Not a directory";
        dir = dir.children;
      }
      currentPath = newPath;
    } catch {
      return `cd: no such directory: ${path}`;
    }

    return "";
  },

  pwd() {
    return "/" + currentPath.join("/");
  },

  cat(args) {
    const file = args[0];
    if (!file) return "cat: missing file";

    const dir = getDir(currentPath);

    if (!dir[file]) return `cat: file not found: ${file}`;
    if (dir[file].type !== "file") return "cat: not a file";

    return dir[file].content;
  },

  clear() {
    terminal.innerHTML = "";
    return "";
  },

  echo(args) {
    return args.join(" ");
  },

  open(args) {
    const links = {
      github: "https://github.com/yourname",
      twitter: "https://twitter.com/yourname"
    };

    const key = args[0];
    if (links[key]) {
      window.open(links[key], "_blank");
      return `Opening ${key}...`;
    }
    return "Unknown link";
  }
};

// ===== ALIASES =====
const aliases = {
  cls: "clear",
  dir: "ls"
};

// ===== EXECUTION =====
function runCommand(inputText) {
  let [cmd, ...args] = inputText.split(" ");

  if (aliases[cmd]) cmd = aliases[cmd];

  if (commands[cmd]) {
    const output = commands[cmd](args);
    if (output) print(output);
  } else {
    print(`Command not found: ${cmd}`);
  }
}

// ===== INPUT =====
input.addEventListener("keydown", function(e) {

  if (e.key === "Enter") {
    const raw = input.value.trim();
    if (!raw) return;

    print(`${getPrompt()} ${raw}`);

    history.push(raw);
    historyIndex = history.length;

    runCommand(raw);

    input.value = "";
    scroll();
  }

  else if (e.key === "ArrowUp") {
    if (historyIndex > 0) {
      historyIndex--;
      input.value = history[historyIndex];
    }
    e.preventDefault();
  }

  else if (e.key === "ArrowDown") {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      input.value = history[historyIndex];
    } else {
      input.value = "";
    }
    e.preventDefault();
  }

  else if (e.key === "Tab") {
    e.preventDefault();
    autocomplete();
  }
});

// ===== AUTOCOMPLETE =====
function autocomplete() {
  const value = input.value.trim();
  const cmds = Object.keys(commands);

  const match = cmds.filter(c => c.startsWith(value));

  if (match.length === 1) {
    input.value = match[0];
  } else if (match.length > 1) {
    print(match.join("   "));
  }
}

// ===== PRINT =====
function print(text) {
  text.split("\n").forEach(line => {
    const div = document.createElement("div");

    // Color directories
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

// Boot message
print("Welcome to Tina's Terminal");
print('Type "help" to begin');
