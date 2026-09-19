const tasks = [
  {
    title: "Решить, как дальше работать с клиентом",
    professional: true,
    self: { minutes: 30, energy: 5 },
    ai: { minutes: 30, energy: 5 },
    selfMessage: "Верное решение. Эта задача требует профессиональной оценки психолога.",
    aiMessage: "Здесь лучше не передавать решение ИИ. ИИ может быть помощником, но профессиональное решение остается за психологом."
  },
  {
    title: "Расшифровать запись вебинара",
    saving: 50,
    self: { minutes: 60, energy: 10 },
    ai: { minutes: 10, energy: 2 }
  },
  {
    title: "Интерпретировать результаты тестов клиента",
    professional: true,
    self: { minutes: 35, energy: 6 },
    ai: { minutes: 35, energy: 6 },
    selfMessage: "Верное решение. Результаты теста важно интерпретировать с учетом конкретного клиента.",
    aiMessage: "ИИ может помочь с обработкой данных, но окончательная интерпретация результатов остается за психологом."
  },
  {
    title: "Собрать презентацию из готового текста",
    saving: 60,
    self: { minutes: 90, energy: 15 },
    ai: { minutes: 30, energy: 5 }
  },
  {
    title: "Решить, нужен ли клиенту другой специалист",
    professional: true,
    self: { minutes: 20, energy: 4 },
    ai: { minutes: 20, energy: 4 }
  },
  {
    title: "Придумать темы для постов на месяц",
    saving: 40,
    self: { minutes: 60, energy: 10 },
    ai: { minutes: 20, energy: 3 }
  },
  {
    title: "Обсудить с клиентом сложную ситуацию на консультации",
    professional: true,
    self: { minutes: 30, energy: 6 },
    ai: { minutes: 30, energy: 6 }
  },
  {
    title: "Разобрать ответы участников опроса",
    saving: 40,
    self: { minutes: 60, energy: 10 },
    ai: { minutes: 20, energy: 4 }
  },
  {
    title: "Оценить изменения в состоянии клиента",
    professional: true,
    self: { minutes: 25, energy: 5 },
    ai: { minutes: 25, energy: 5 }
  },
  {
    title: "Сделать простую страницу для вебинара",
    saving: 75,
    self: { minutes: 120, energy: 18 },
    ai: { minutes: 45, energy: 7 }
  },
  {
    title: "Решить, готов ли клиент завершить терапию",
    professional: true,
    self: { minutes: 20, energy: 4 },
    ai: { minutes: 20, energy: 4 }
  },
  {
    title: "Подготовить письмо участникам вебинара",
    saving: 20,
    self: { minutes: 30, energy: 5 },
    ai: { minutes: 10, energy: 2 }
  }
];

const screens = {
  start: document.getElementById("start-screen"),
  game: document.getElementById("game-screen"),
  final: document.getElementById("final-screen")
};

const elements = {
  startButton: document.getElementById("start-button"),
  restartButton: document.getElementById("restart-button"),
  nextButton: document.getElementById("next-button"),
  timeStatus: document.getElementById("time-status"),
  energyStatus: document.getElementById("energy-status"),
  timeValue: document.getElementById("time-value"),
  energyValue: document.getElementById("energy-value"),
  energyFill: document.getElementById("energy-fill"),
  taskProgress: document.getElementById("task-progress"),
  taskCard: document.getElementById("task-card"),
  taskNumber: document.getElementById("task-number"),
  taskTitle: document.getElementById("task-title"),
  resultMessage: document.getElementById("result-message"),
  resultText: document.getElementById("result-text"),
  savingText: document.getElementById("saving-text"),
  selfZone: document.getElementById("self-zone"),
  aiZone: document.getElementById("ai-zone"),
  finalTitle: document.getElementById("final-title"),
  finalDescription: document.getElementById("final-description"),
  finalTime: document.getElementById("final-time"),
  finalEnergy: document.getElementById("final-energy"),
  finalSaved: document.getElementById("final-saved"),
  deadlineResult: document.getElementById("deadline-result")
};

let state;
let dragState = null;

function resetState() {
  state = {
    currentTask: 0,
    elapsedMinutes: 0,
    energy: 100,
    savedMinutes: 0,
    professionalAiMistakes: 0,
    missedAiOpportunities: 0,
    decisionMade: false
  };
}

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

function formatTime(elapsedMinutes) {
  const totalMinutes = 9 * 60 + elapsedMinutes;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function getRussianPlural(value, forms) {
  const lastTwoDigits = value % 100;
  const lastDigit = value % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return forms[2];
  }

  if (lastDigit === 1) {
    return forms[0];
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return forms[1];
  }

  return forms[2];
}

function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const parts = [];

  if (hours > 0) {
    parts.push(`${hours} ${getRussianPlural(hours, ["час", "часа", "часов"])}`);
  }

  if (minutes > 0 || hours === 0) {
    parts.push(`${minutes} ${getRussianPlural(minutes, ["минута", "минуты", "минут"])}`);
  }

  return parts.join(" ");
}

function updateStatus(animate = false) {
  elements.timeValue.textContent = formatTime(state.elapsedMinutes);
  elements.energyValue.textContent = `${state.energy}%`;
  elements.energyFill.style.width = `${state.energy}%`;

  if (state.energy <= 30) {
    elements.energyFill.style.backgroundColor = "#e5484d";
  } else if (state.energy <= 60) {
    elements.energyFill.style.backgroundColor = "#f2b824";
  } else {
    elements.energyFill.style.backgroundColor = "";
  }

  if (animate) {
    [elements.timeStatus, elements.energyStatus].forEach((element) => {
      element.classList.remove("status-pulse");
      void element.offsetWidth;
      element.classList.add("status-pulse");
    });
  }
}

function renderTask() {
  const task = tasks[state.currentTask];
  state.decisionMade = false;
  elements.taskProgress.textContent = `${state.currentTask + 1} из ${tasks.length}`;
  elements.taskNumber.textContent = String(state.currentTask + 1).padStart(2, "0");
  elements.taskTitle.textContent = task.title;
  elements.nextButton.textContent = state.currentTask === tasks.length - 1
    ? "ПОСМОТРЕТЬ РЕЗУЛЬТАТ"
    : "СЛЕДУЮЩАЯ ЗАДАЧА";
  elements.taskCard.className = "task-card";
  elements.taskCard.style.transform = "";
  elements.resultMessage.classList.remove("visible");
  elements.selfZone.disabled = false;
  elements.aiZone.disabled = false;
}

function getResultMessage(task, choice) {
  if (task.professional) {
    if (choice === "self") {
      return {
        message: task.selfMessage || "Верное решение. Эта задача требует профессионального решения психолога.",
        saving: ""
      };
    }

    return {
      message: task.aiMessage || "ИИ может быть помощником, но профессиональное решение остается за психологом.",
      saving: ""
    };
  }

  if (choice === "self") {
    return {
      message: "Можно и самостоятельно. Но с ИИ эту задачу можно было выполнить быстрее.",
      saving: `Можно было сэкономить: ${task.saving} минут`
    };
  }

  return {
    message: "Хороший выбор. ИИ помог ускорить эту задачу.",
    saving: `Вы сэкономили: ${task.saving} минут`
  };
}

function makeChoice(choice) {
  if (state.decisionMade) {
    return;
  }

  state.decisionMade = true;
  const task = tasks[state.currentTask];
  const result = task[choice];
  const message = getResultMessage(task, choice);

  state.elapsedMinutes += result.minutes;
  state.energy = Math.max(0, state.energy - result.energy);

  if (task.professional && choice === "ai") {
    state.professionalAiMistakes += 1;
  }

  if (!task.professional && choice === "self") {
    state.missedAiOpportunities += 1;
  }

  if (!task.professional && choice === "ai") {
    state.savedMinutes += task.saving;
  }

  elements.selfZone.disabled = true;
  elements.aiZone.disabled = true;
  elements.taskCard.style.transform = "";
  elements.taskCard.classList.add(choice === "self" ? "chosen-self" : "chosen-ai");
  updateStatus(true);

  window.setTimeout(() => {
    elements.taskCard.classList.remove("chosen-self", "chosen-ai");
    elements.taskCard.style.display = "none";
    elements.resultText.textContent = message.message;
    elements.savingText.textContent = message.saving;
    elements.resultMessage.classList.add("visible");
    elements.nextButton.focus();
  }, 300);
}

function showFinalScreen() {
  const finalElapsedMinutes = state.elapsedMinutes + 120;
  let title;
  let description;

  if (state.professionalAiMistakes >= 3) {
    title = "Вы отлично видите возможности ИИ, но иногда доверяете ему слишком много.";
    description = "ИИ может быть сильным ассистентом психолога, но не заменяет профессиональное решение специалиста.";
  } else if (state.missedAiOpportunities >= 3) {
    title = "Вы берете слишком много задач на себя.";
    description = "В вашем рабочем дне есть процессы, которые ИИ может существенно ускорить.";
  } else {
    title = "Отличный баланс.";
    description = "Вы используете ИИ как ассистента, но оставляете за психологом профессиональные задачи.";
  }

  elements.finalTitle.textContent = title;
  elements.finalDescription.textContent = description;
  elements.finalTime.textContent = formatTime(finalElapsedMinutes);
  elements.finalEnergy.textContent = `${state.energy}%`;
  elements.finalSaved.textContent = formatDuration(state.savedMinutes);

  if (finalElapsedMinutes <= 9 * 60) {
    elements.deadlineResult.textContent = "Вы успели до 18:00.";
    elements.deadlineResult.classList.remove("late");
  } else {
    elements.deadlineResult.textContent = "Сегодня вы не успели закончить все дела до 18:00.";
    elements.deadlineResult.classList.add("late");
  }

  showScreen("final");
}

function startGame() {
  resetState();
  elements.taskCard.style.display = "";
  updateStatus();
  renderTask();
  showScreen("game");
}

function goToNextTask() {
  if (state.currentTask === tasks.length - 1) {
    showFinalScreen();
    return;
  }

  state.currentTask += 1;
  elements.taskCard.style.display = "";
  renderTask();
}

function zoneAtPoint(x, y) {
  for (const zone of [elements.selfZone, elements.aiZone]) {
    const rectangle = zone.getBoundingClientRect();
    if (x >= rectangle.left && x <= rectangle.right && y >= rectangle.top && y <= rectangle.bottom) {
      return zone;
    }
  }
  return null;
}

function clearZoneHighlights() {
  elements.selfZone.classList.remove("drop-hover");
  elements.aiZone.classList.remove("drop-hover");
}

elements.taskCard.addEventListener("pointerdown", (event) => {
  if (state.decisionMade || event.button !== 0) {
    return;
  }

  dragState = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    x: event.clientX,
    y: event.clientY
  };
  elements.taskCard.setPointerCapture(event.pointerId);
});

elements.taskCard.addEventListener("pointermove", (event) => {
  if (!dragState || event.pointerId !== dragState.pointerId) {
    return;
  }

  dragState.x = event.clientX;
  dragState.y = event.clientY;
  const deltaX = event.clientX - dragState.startX;
  const deltaY = event.clientY - dragState.startY;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance > 6) {
    elements.taskCard.classList.add("dragging");
    elements.taskCard.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${deltaX / 80}deg)`;
    clearZoneHighlights();
    const zone = zoneAtPoint(event.clientX, event.clientY);
    if (zone) {
      zone.classList.add("drop-hover");
    }
  }
});

function finishDrag(event) {
  if (!dragState || event.pointerId !== dragState.pointerId) {
    return;
  }

  const distance = Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY);
  const zone = distance > 6 ? zoneAtPoint(event.clientX, event.clientY) : null;
  elements.taskCard.classList.remove("dragging");
  elements.taskCard.style.transform = "";
  clearZoneHighlights();
  dragState = null;

  if (zone) {
    makeChoice(zone.dataset.choice);
  }
}

elements.taskCard.addEventListener("pointerup", finishDrag);
elements.taskCard.addEventListener("pointercancel", (event) => {
  if (dragState && event.pointerId === dragState.pointerId) {
    elements.taskCard.classList.remove("dragging");
    elements.taskCard.style.transform = "";
    clearZoneHighlights();
    dragState = null;
  }
});

elements.startButton.addEventListener("click", startGame);
elements.restartButton.addEventListener("click", startGame);
elements.nextButton.addEventListener("click", goToNextTask);
elements.selfZone.addEventListener("click", () => makeChoice("self"));
elements.aiZone.addEventListener("click", () => makeChoice("ai"));

resetState();
