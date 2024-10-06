const express = require('express');
const router = express.Router();

const entities = [
    {
        name: 'Орк',
        type: 'neutral',
        dialogues: {
            start: {
                options: [
                    { message: 'Привет, как дела?', nextStep: 'greetingReply' },
                    { message: 'Что ты здесь делаешь?', nextStep: 'occupationReply' },
                    { message: 'Я думал, здесь никого нет.', nextStep: 'unexpectedReply' }
                ]
            },
            greetingReply: {
                responses: ['Всё нормально, а у тебя?', 'Неплохо. А что тебе нужно?'],
                options: [
                    { message: 'Просто мимо проходил.', nextStep: 'end' },
                    { message: 'Хотел поговорить.', nextStep: 'talkReply' }
                ]
            },
            occupationReply: {
                responses: ['Охраняю эту территорию.', 'Просто тут стою.'],
                options: [
                    { message: 'Можно пройти?', nextStep: 'passReply' },
                    { message: 'Понятно, удачи.', nextStep: 'end' }
                ]
            },
            unexpectedReply: {
                responses: ['Я тут уже давно.', 'Сложно не заметить меня.'],
                options: [
                    { message: 'Извини, не хотел обидеть.', nextStep: 'friendlyReply' },
                    { message: 'Да ты просто чудовище.', nextStep: 'angryReply' }
                ]
            },
            talkReply: {
                responses: ['О чем хочешь поговорить?', 'У меня мало времени.'],
                options: [
                    { message: 'Как давно ты здесь?', nextStep: 'howLongReply' },
                    { message: 'Есть какие-то новости?', nextStep: 'newsReply' }
                ]
            },
            howLongReply: {
                responses: ['Слишком долго.', 'Я здесь уже несколько лет.'],
                options: [
                    { message: 'Тяжело, наверное.', nextStep: 'end' },
                    { message: 'Понятно, удачи тебе.', nextStep: 'end' }
                ]
            },
            newsReply: {
                responses: ['Недавно прошел купец.', 'Да всё по-старому.'],
                options: [
                    { message: 'Интересно.', nextStep: 'end' },
                    { message: 'Спасибо за информацию.', nextStep: 'end' }
                ]
            },
            friendlyReply: {
                responses: ['Ничего страшного.', 'Бывает.'],
                options: [
                    { message: 'Спасибо, удачи.', nextStep: 'end' }
                ]
            },
            angryReply: {
                responses: ['Эй, поаккуратнее!', 'Ты что, нарываешься?'],
                options: [
                    { message: 'Извини, погорячился.', nextStep: 'friendlyReply' },
                    { message: 'Да, хочу подраться.', nextStep: 'fight' }
                ]
            },
            passReply: {
                responses: ['Проходи, только не мешай.', 'Ладно, можешь идти.'],
                options: [
                    { message: 'Спасибо!', nextStep: 'end' }
                ]
            },
            fight: {
                responses: ['Ну держись!', 'Сейчас начнется бой!'],
                options: [] // Здесь может быть логика начала боя
            },
            end: {
                responses: ['Прощай.', 'Удачи тебе.'],
                options: [] // Диалог завершён, игроку больше нечего сказать
            }
        }
    }
];

// Текущее состояние диалога
let currentDialogueStep = 'start';

router.get('/entity', (req, res) => {
    const entity = entities[0]; // Используем первую сущность — Орк
    res.json({ entity, step: currentDialogueStep });
});

// Обработка выбора фразы игроком
router.post('/dialogue', (req, res) => {
    const { message } = req.body;
    const entity = entities[0]; // Орк
    const currentStep = entity.dialogues[currentDialogueStep];

    // Найти следующий шаг по выбранной фразе
    const selectedOption = currentStep.options.find(option => option.message === message);

    if (selectedOption) {
        currentDialogueStep = selectedOption.nextStep;
        const nextStep = entity.dialogues[currentDialogueStep];

        res.json({
            response: nextStep.responses[Math.floor(Math.random() * nextStep.responses.length)], // Случайный ответ
            options: nextStep.options // Новые фразы для выбора игрока
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