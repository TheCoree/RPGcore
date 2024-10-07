const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const creaturesDir = path.join(__dirname, '../creatures');
let currentCreatureIndex = 0;
let creatures = [];
let currentDialogueStep = 'start';

// Загрузка всех существ из папки
const loadCreatures = () => {
    const creatureFiles = fs.readdirSync(creaturesDir);
    creatures = creatureFiles.map(file => {
        const filePath = path.join(creaturesDir, file);
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    });
};

// Загрузка существ при старте сервера
loadCreatures();

// Получение текущего существа
router.get('/entity', (req, res) => {
    const entity = creatures[currentCreatureIndex];
    res.json({ entity, step: currentDialogueStep });
});

router.post('/next-entity', (req, res) => {
    currentCreatureIndex = (currentCreatureIndex + 1) % creatures.length;
    currentDialogueStep = 'start'; // Сброс диалога для нового существа
    const entity = creatures[currentCreatureIndex];
    res.json({ message: 'Следующее существо загружено.', entity });
});

// Обработка диалога
router.post('/dialogue', (req, res) => {
    const { message } = req.body;
    const entity = creatures[currentCreatureIndex];
    const currentStep = entity.dialogues[currentDialogueStep];

    const selectedOption = currentStep.options.find(option => option.message === message);

    if (selectedOption) {
        currentDialogueStep = selectedOption.nextStep;
        const nextStep = entity.dialogues[currentDialogueStep];

        res.json({
            response: nextStep.responses[Math.floor(Math.random() * nextStep.responses.length)],
            options: nextStep.options
        });
    } else {
        res.json({ response: 'Не понял тебя.', options: currentStep.options });
    }
});

// Сброс состояния диалога
router.post('/reset', (req, res) => {
    currentDialogueStep = 'start';
    res.json({ message: 'Диалог начат заново.' });
});

module.exports = router;
