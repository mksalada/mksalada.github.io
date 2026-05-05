const terminal = document.getElementById("terminal");

// ===== STATE =====
let history = [];
let historyIndex = -1;

let currentInput = "";
let cursorPos = 0;

// ===== PROMPT =====
function getPrompt() {
  return "user@portfolio:~$";
}

// ===== CREATE LINE =====
let currentLine;

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

// ===== RENDER INPUT WITH CURSOR =====
function renderInput() {
  const before = currentInput.slice(0, cursorPos);
  const after = currentInput.slice(cursorPos);

  currentLine.innerHTML =
    escape(before) +
    `<span class="cursor">█</span>` +
    escape(after);

  scroll();
}

// Prevent HTML injection
function escape(str) {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ===== KEY HANDLER =====
document.addEventListener("keydown", (e) => {

  // Ignore if no active line
  if (!currentLine) return;

  // ENTER
  if (e.key === "Enter") {
    e.preventDefault();

    print(getPrompt() + " " + currentInput);

    history.push(currentInput);
    historyIndex = history.length;

    runCommand(currentInput);

    currentLine.parentElement.remove(); // remove editable line
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

  // HISTORY ↑ ↓
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      currentInput = history[historyIndex];
      cursorPos = currentInput.length;
      renderInput();
    }
  }

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

// ===== COMMANDS (simple demo) =====
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

// Boot
print("Advanced Terminal Ready");
createInputLine();
