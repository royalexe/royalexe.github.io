/* ──────────────────────────────────────────────────────────
   royal@sec · interactions
   ────────────────────────────────────────────────────────── */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── clock + year ─────────────────────────────────────── */
  const clock = $("#clock");
  const tick = () => {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    clock.title = now.toLocaleString();
  };
  tick();
  setInterval(tick, 15_000);
  $("#year").textContent = new Date().getFullYear();

  /* ── type the terminal command ────────────────────────── */
  const typed = $("#typedCmd");
  const cmdText = "cat bio.txt";
  if (reduceMotion) {
    typed.textContent = cmdText;
  } else {
    typed.textContent = "";
    let i = 0;
    setTimeout(function step() {
      typed.textContent = cmdText.slice(0, ++i);
      if (i < cmdText.length) setTimeout(step, 55);
    }, 550);
  }

  /* ── window reveal ────────────────────────────────────── */
  const windows = $$(".window");
  document.body.classList.add("reveal-ready");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    windows.forEach((w) => w.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
    windows.forEach((w) => io.observe(w));
  }

  /* ── active nav link ──────────────────────────────────── */
  const navLinks = new Map($$(".topnav a").map((a) => [a.hash.slice(1), a]));
  const sections = ["focus", "projects", "writeups", "shell", "contact"]
    .map((id) => document.getElementById(id));
  let scrollQueued = false;

  const markActive = () => {
    scrollQueued = false;
    const line = scrollY + 120;
    let current = null;
    for (const sec of sections) {
      if (sec.getBoundingClientRect().top + scrollY <= line) current = sec.id;
    }
    if (innerHeight + scrollY >= document.body.scrollHeight - 40) current = "contact";
    if (!current) current = "focus";
    navLinks.forEach((a, id) => a.classList.toggle("active", id === current));

    const max = document.documentElement.scrollHeight - innerHeight;
    $("#scrollProgress").style.width = `${max > 0 ? Math.min(100, (scrollY / max) * 100) : 0}%`;
  };

  addEventListener("scroll", () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(markActive);
  }, { passive: true });
  addEventListener("resize", () => requestAnimationFrame(markActive));
  markActive();

  /* ── spotlight (background reacts to cursor) ──────────── */
  const spot = $("#spotlight");
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let mx = 0, my = 0, raf = 0;
    addEventListener("pointermove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        spot.style.setProperty("--mx", `${mx}px`);
        spot.style.setProperty("--my", `${my}px`);
      });
    }, { passive: true });
  }

  /* ── copy helper ──────────────────────────────────────── */
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.append(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    }
  };

  /* ── copy email ───────────────────────────────────────── */
  const copyBtn = $("#copyEmail");
  copyBtn.addEventListener("click", async () => {
    const ok = await copyText(copyBtn.dataset.email);
    copyBtn.textContent = ok ? "[ copied ✓ ]" : "[ select + ctrl-c ]";
    copyBtn.classList.add("copied");
    setTimeout(() => {
      copyBtn.textContent = "[ copy ]";
      copyBtn.classList.remove("copied");
    }, 1600);
  });

  /* ── interactive shell ────────────────────────────────── */
  const termOut = $("#termOut");
  const termForm = $("#termForm");
  const termInput = $("#termInput");
  const history = [];
  let histIndex = 0;

  const esc = (str) => str.replace(/[&<>"']/g, (ch) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
  ));

  const print = (html = "", cls = "") => {
    const p = document.createElement("p");
    p.className = "tline" + (cls ? ` ${cls}` : "");
    p.innerHTML = html;
    termOut.append(p);
    termOut.scrollTop = termOut.scrollHeight;
  };

  const echo = (cmd) => {
    const p = document.createElement("p");
    p.className = "tline cmd-echo";
    p.innerHTML = '<span class="p-user">royal@sec</span><span class="p-path">:~$</span> ';
    const span = document.createElement("span");
    span.className = "t-cmd";
    span.textContent = cmd;
    p.append(span);
    termOut.append(p);
    termOut.scrollTop = termOut.scrollHeight;
  };

  const go = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    el.classList.add("in");
  };

  const commands = {
    help() {
      print(
        `<pre>  <span class="c-acc">whoami</span>         the short version
  <span class="c-acc">cat bio.txt</span>    read the bio
  <span class="c-acc">ls</span>             list the sections
  <span class="c-acc">focus</span>          jump to core domains
  <span class="c-acc">projects</span>       jump to projects
  <span class="c-acc">writeups</span>       jump to writing
  <span class="c-acc">contact</span>        open a channel
  <span class="c-acc">socials</span>        github · x · email
  <span class="c-acc">copy email</span>     copy the address
  <span class="c-acc">banner</span>         say it again
  <span class="c-acc">neofetch</span>       system info
  <span class="c-acc">date</span>           current date / time
  <span class="c-acc">history</span>        commands from this session
  <span class="c-acc">clear</span>          clear the screen
  <span class="c-dim">( ↑ / ↓ history · tab autocompletes · ctrl+L clears )</span></pre>`
      );
    },
    whoami() {
      print('royal — builder, breaker, terminal dweller.');
      print('<span class="c-dim">github:</span> <a href="https://github.com/royalexe" target="_blank" rel="me noopener">@royalexe</a>  <span class="c-dim">x:</span> <a href="https://x.com/royal_govv" target="_blank" rel="me noopener">@royal_govv</a>');
      print('<span class="c-dim">currently:</span> offensive security &amp; tooling');
    },
    ls() {
      print('<span class="c-acc">bio.txt</span>   focus/   projects/   writeups/   shell/   contact/');
    },
    cat(args) {
      const file = (args[0] || "").toLowerCase();
      if (!file || file === "bio.txt" || file === "bio") {
        print("builder, breaker, lifelong tinkerer. i pull systems apart —");
        print("binaries, web apps, my own dotfiles — to understand how they");
        print("hold together, then write down what i learn.");
        print("&nbsp;");
        print('<span class="c-dim">currently focused on:</span> <span class="c-ok">offensive security &amp; tooling</span>');
      } else {
        print(`<span class="c-err">cat:</span> ${esc(file)}: no such file`, "t-err");
      }
    },
    focus() { print('<span class="c-dim">opening</span> focus.dir'); go("focus"); },
    projects() { print('<span class="c-dim">opening</span> projects.dir'); go("projects"); },
    writeups() { print('<span class="c-dim">opening</span> writeups.log'); go("writeups"); },
    contact() { print('<span class="c-dim">opening channel ...</span>'); go("contact"); },
    socials() {
      print('<span class="c-dim">github</span>   <a href="https://github.com/royalexe" target="_blank" rel="me noopener">github.com/royalexe ↗</a>');
      print('<span class="c-dim">x</span>        <a href="https://x.com/royal_govv" target="_blank" rel="me noopener">x.com/royal_govv ↗</a>');
      print('<span class="c-dim">email</span>    <a href="mailto:royal.exe@proton.me?subject=Hello%20Royal">royal.exe@proton.me</a>');
    },
    github() { print('<span class="c-dim">github</span> <a href="https://github.com/royalexe" target="_blank" rel="me noopener">github.com/royalexe ↗</a>'); },
    x() { print('<span class="c-dim">x</span> <a href="https://x.com/royal_govv" target="_blank" rel="me noopener">x.com/royal_govv ↗</a>'); },
    email() {
      print('royal.exe@proton.me');
      print('<span class="c-dim">tip:</span> <span class="c-ok">copy email</span> <span class="c-dim">puts it on your clipboard</span>');
    },
    async copy(args) {
      if ((args[0] || "").toLowerCase() !== "email") return print('<span class="c-dim">usage: copy email</span>');
      const ok = await copyText("royal.exe@proton.me");
      print(ok
        ? '<span class="c-ok">copied</span> royal.exe@proton.me <span class="c-dim">to clipboard</span>'
        : '<span class="c-err">copy failed</span> <span class="c-dim">— the address is royal.exe@proton.me</span>');
    },
    banner() {
      print('<div class="term-banner">royal</div>');
      print('<span class="c-dim">builder / breaker / tinkerer</span>');
    },
    shell() { go("shell"); },
    pwd() { print("/home/royal"); },
    date() { print(new Date().toString()); },
    history() {
      if (!history.length) return print('<span class="c-dim">nothing here yet.</span>');
      history.forEach((cmd, i) => print(`<span class="c-dim">${String(i + 1).padStart(2, "0")}</span>  ${esc(cmd)}`));
    },
    neofetch() {
      print(
        `<pre>   <span class="c-acc">▄▄▄▄▄▄▄▄▄</span>        <span class="c-acc">royal@sec</span>
   <span class="c-acc">█  &gt;_   █</span>        <span class="c-dim">─────────────</span>
   <span class="c-acc">█       █</span>        os      arch linux
   <span class="c-acc">▀▀▀▀▀▀▀▀▀</span>        shell   zsh
                    editor  neovim
                    theme   terminal-dark
                    uptime  perpetually online</pre>`
      );
    },
    sudo() {
      print('nice try. this incident has been logged.');
      print('<span class="c-dim">(just kidding — nothing leaves this page.)</span>');
    },
    rm(args) {
      if (args.join(" ").includes("-rf")) print("absolutely not. i just got this shell set up.");
      else print("rm: missing operand");
    },
    exit() { print('there is no exit. only <span class="c-ok">clear</span>.'); },
    clear() { termOut.innerHTML = ""; },
    echo(args) { print(esc(args.join(" "))); },
  };

  const run = (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    echo(trimmed);
    history.push(trimmed);
    histIndex = history.length;

    const [name, ...args] = trimmed.split(/\s+/);
    const key = name.toLowerCase();
    const fn = commands[key];
    if (fn) {
      fn(args);
    } else {
      print(`<span class="c-err">command not found:</span> ${esc(name)} <span class="c-dim">— type 'help'</span>`);
    }
  };

  termForm.addEventListener("submit", (e) => {
    e.preventDefault();
    run(termInput.value);
    termInput.value = "";
  });

  termInput.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const value = termInput.value.trim().toLowerCase();
      if (!value) return;
      const matches = Object.keys(commands).filter((name) => name.startsWith(value));
      if (matches.length === 1) {
        termInput.value = `${matches[0]} `;
      } else if (matches.length > 1) {
        print(matches.map((m) => `<span class="c-acc">${m}</span>`).join("   "));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      histIndex = Math.max(0, histIndex - 1);
      termInput.value = history[histIndex] ?? "";
      termInput.setSelectionRange(termInput.value.length, termInput.value.length);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      histIndex = Math.min(history.length, histIndex + 1);
      termInput.value = history[histIndex] ?? "";
    } else if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      termOut.innerHTML = "";
    } else if (e.key === "Escape") {
      termInput.blur();
    }
  });

  $("#terminal").addEventListener("click", (e) => {
    if (getSelection().toString()) return;
    if (e.target.closest("a")) return;
    termInput.focus();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    e.preventDefault();
    go("shell");
    termInput.focus({ preventScroll: true });
  });
})();
