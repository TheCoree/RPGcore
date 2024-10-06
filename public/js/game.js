document.addEventListener('DOMContentLoaded', () => {
    const entityDiv = document.getElementById('entity');
    const dialogueContainer = document.getElementById('dialogue-container');
    const dialogueResponseDiv = document.getElementById('dialogue-response');
    const dialogueOptionsDiv = document.getElementById('dialogue-options');
    const resetButton = document.getElementById('reset-button');

    // Загрузка сущности и начального диалога
    const loadEntity = async () => {
        const response = await fetch('/game/entity');
        const { entity, step } = await response.json();
        entityDiv.innerHTML = `<h2>${entity.name} (Тип: ${entity.type})</h2>`;
        loadDialogueOptions(entity.dialogues[step].options);
        dialogueResponseDiv.innerHTML = ''; // Очищаем ответы
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

    // Обработка диалога
    const handleDialogue = async (message) => {
        const response = await fetch('/game/dialogue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });
        const { response: reply, options } = await response.json();
        
        // Добавляем ответ сущности на экран
        dialogueResponseDiv.innerHTML = `<p class="entity-response">${reply}</p>`;
        
        if (options && options.length > 0) {
            loadDialogueOptions(options); // Обновляем варианты фраз
        } else {
            dialogueOptionsDiv.innerHTML = `<p class="end-message">Диалог завершен.</p>`;
        }
    };

    // Сброс диалога
    resetButton.addEventListener('click', async () => {
        await fetch('/game/reset', { method: 'POST' });
        loadEntity(); // Перезагрузка сущности и диалога
    });

    loadEntity(); // Загрузка сущности при запуске
});