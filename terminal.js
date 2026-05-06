const terminal = document.getElementById("terminal");

// ===== STATE =====
let history = [];
let historyIndex = -1;

let currentInput = "";
let cursorPos = 0;

let currentLine = null;

// ===== PROMPT =====
function getPrompt() {
  return "user@portfolio:~$";
}

// ===== CREATE INPUT LINE =====
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

// ===== RENDER =====
function renderInput() {
  if (!currentLine) return;

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

// ===== INPUT HANDLING =====
document.addEventListener("keydown", (e) => {

  // Ensure terminal is focused (clicked)
  if (!isFocused) return;

  // ENTER
  if (e.key === "Enter") {
    e.preventDefault();

    print(getPrompt() + " " + currentInput);

    history.push(currentInput);
    historyIndex = history.length;

    runCommand(currentInput);

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

  // TEXT INPUT
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();

    currentInput =
      currentInput.slice(0, cursorPos) +
      e.key +
      currentInput.slice(cursorPos);

    cursorPos++;
    renderInput();
  }
});

// ===== FOCUS HANDLING =====
let isFocused = false;

terminal.addEventListener("click", () => {
  isFocused = true;
});

// ===== COMMANDS =====
function runCommand(cmd) {
  if (cmd === "help") {
    print("help  clear  echo");
  }
  else if (cmd === "clear") {
    terminal.innerHTML = "";
  }
  else if (cmd.startsWith("echo ")) {
    print(cmd.slice(5));
  }
  else if (cmd.trim() !== "") {
    print("command not found");
  }
}

// ===== PRINT =====
function print(text) {
  const div = document.createElement("div");
  div.textContent = text;
  terminal.appendChild(div);
}

// ===== SCROLL =====
function scroll() {
  terminal.scrollTop = terminal.scrollHeight;
}

// ===== INIT =====
print("Welcome to Portfolio Terminal");
print('Type "help"');
createInputLine();
