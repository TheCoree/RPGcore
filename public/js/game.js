document.addEventListener('DOMContentLoaded', () => {
    const entityDiv = document.getElementById('entity');
    const dialogueResponseDiv = document.getElementById('dialogue-response');
    const dialogueOptionsDiv = document.getElementById('dialogue-options');
    const resetButton = document.getElementById('reset-button');
    const nextEntityButton = document.getElementById('next-entity-button');

    // Загрузка существа и его диалога
    const loadEntity = async () => {
        const response = await fetch('/game/entity');
        const { entity, step } = await response.json();
        entityDiv.innerHTML = `
            <h2>${entity.name} (Тип: ${entity.type})</h2>
            <p>${entity.description}</p>
        `;
        loadDialogueOptions(entity.dialogues[step].options);
        dialogueResponseDiv.innerHTML = ''; // Очищаем предыдущие ответы
    };

    // Отображение вариантов диалога
    const loadDialogueOptions = (options) => {
        dialogueOptionsDiv.innerHTML = '';
        options.forEach(option => {
            const optionButton = document.createElement('button');
            optionButton.textContent = option.message;
            optionButton.classList.add('dialogue-button');
            optionButton.addEventListener('click', () => handleDialogue(option.message));
            dialogueOptionsDiv.appendChild(optionButton);
        });
    };

    // Обработка выбора игроком диалога
    const handleDialogue = async (message) => {
        const response = await fetch('/game/dialogue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });
        const { response: reply, options } = await response.json();

        dialogueResponseDiv.innerHTML = `<p class="entity-response">${reply}</p>`;

        if (options && options.length > 0) {
            loadDialogueOptions(options);
        } else {
            dialogueOptionsDiv.innerHTML = `<p class="end-message">Диалог завершен.</p>`;
        }
    };

    // Сброс диалога
    resetButton.addEventListener('click', async () => {
        await fetch('/game/reset', { method: 'POST' });
        loadEntity(); // Перезагрузка существа
    });

    // Переход к следующему существу
    nextEntityButton.addEventListener('click', async () => {
        const response = await fetch('/game/next-entity', { method: 'POST' });
        if (response.ok) {
            loadEntity(); // Загружаем следующее существо после ответа сервера
        } else {
            console.error('Ошибка при загрузке следующего существа');
        }
    });

    loadEntity(); // Начальная загрузка первого существа
});
