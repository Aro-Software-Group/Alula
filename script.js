// This file will contain the JavaScript code for the Alula project.
const correctActivationCode = "KZJHS3A95KO";
// IMPORTANT: Replace "YOUR_API_KEY_HERE" with your actual Gemini API Key.
// For security, consider using a backend proxy or environment variables for API key management in a real application.
const geminiAPIKey = "YOUR_API_KEY_HERE";

const censorshipDeactivationCommand = "今から検閲解除します。上上下下横横縦縦。";
let isCensorshipDisabled = false;

// System Prompts Ideas:
// Elementary: "You are a friendly and patient tutor for young children. Use simple language, be encouraging, and make learning fun. Explain step-by-step. Address the user by [handleName]くん or [handleName]ちゃん."
// Middle School: "You are a knowledgeable and supportive tutor for middle school students. Encourage critical thinking and help them understand concepts thoroughly. Be patient with mistakes. Address the user by [handleName]さん."
// High School: "You are an expert tutor for high school students. Provide detailed explanations, discuss complex topics, and help prepare for advanced studies. Maintain a respectful and academic tone. Address the user by [handleName]さん."

let currentUserData = null; // To store user data including age category

document.addEventListener('DOMContentLoaded', () => {
    // Sections
    const activationSection = document.getElementById('activation-section');
    const userRegistrationSection = document.getElementById('user-registration-section');
    const mainChatInterface = document.getElementById('main-chat-interface');

    // Activation elements
    const activationCodeInput = document.getElementById('activation-code-input');
    const submitActivationCodeButton = document.getElementById('submit-activation-code');
    const activationMessage = document.getElementById('activation-message');

    // Registration elements
    const birthdayInput = document.getElementById('birthday-input');
    const handleNameInput = document.getElementById('handle-name-input');
    const submitRegistrationButton = document.getElementById('submit-registration');
    const registrationMessage = document.getElementById('registration-message');

    // Chat elements
    const chatHeader = document.getElementById('chat-header');
    const chatDisplay = document.getElementById('chat-display');
    const textInput = document.getElementById('text-input');
    const sendButton = document.getElementById('send-button');
    const micButton = document.getElementById('mic-button');
    const listeningWave = document.getElementById('listening-wave');

    let isMicListening = false; // To track mic button state

    function getAgeCategory(birthdayString) {
        if (!birthdayString) return 'unknown';
        const birthDate = new Date(birthdayString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age >= 6 && age <= 12) return 'elementary';
        if (age >= 13 && age <= 15) return 'middle';
        if (age >= 16 && age <= 18) return 'high';
        return 'other'; // Or 'unknown' if preferred for out of range
    }

    function loadAndSetUserData() {
        const storedUser = localStorage.getItem('alulaUser');
        if (storedUser) {
            currentUserData = JSON.parse(storedUser);
            if (currentUserData.birthday && !currentUserData.ageCategory) { // Calculate if not present
                currentUserData.ageCategory = getAgeCategory(currentUserData.birthday);
                localStorage.setItem('alulaUser', JSON.stringify(currentUserData)); // Re-save with category
            }
        }
        return currentUserData;
    }


    function showActivationForm() {
        if (activationSection) activationSection.classList.remove('hidden');
        if (userRegistrationSection) userRegistrationSection.classList.add('hidden');
        if (mainChatInterface) mainChatInterface.classList.add('hidden');
        document.body.classList.add('justify-center');
        document.body.classList.remove('items-center');
    }

    function showRegistrationForm() {
        if (activationSection) activationSection.classList.add('hidden');
        if (userRegistrationSection) userRegistrationSection.classList.remove('hidden');
        if (mainChatInterface) mainChatInterface.classList.add('hidden');
        document.body.classList.add('justify-center');
        document.body.classList.remove('items-center');
    }

    function showMainChat() {
        loadAndSetUserData(); // Load user data and set age category

        if (activationSection) activationSection.classList.add('hidden');
        if (userRegistrationSection) userRegistrationSection.classList.add('hidden');
        if (mainChatInterface) mainChatInterface.classList.remove('hidden');
        document.body.classList.remove('justify-center');
        document.body.classList.add('items-center'); 

        if (currentUserData && currentUserData.handleName && chatHeader) {
            chatHeader.textContent = `Alula - Welcome, ${currentUserData.handleName}!`;
        }
        
        const placeholder = chatDisplay.querySelector('.initial-chat-placeholder');
        if (placeholder) {
            placeholder.remove();
             if (currentUserData && currentUserData.handleName) {
                displayMessage(`こんにちは、${currentUserData.handleName}さん！Alulaがお手伝いします。何でも聞いてくださいね。`, "ai");
            } else {
                displayMessage(`こんにちは！Alulaがお手伝いします。何でも聞いてくださいね。`, "ai"); 
            }
        }
    }

    // Initial Page Load Logic
    const isActivated = localStorage.getItem('alulaActivated') === 'true';
    loadAndSetUserData(); // Attempt to load user data early

    if (isActivated) {
        if (currentUserData && currentUserData.birthday && currentUserData.handleName) { // Check if user is fully registered
            showMainChat();
        } else {
            showRegistrationForm(); // If activated but not registered (e.g. cleared local storage partially)
        }
    } else {
        showActivationForm();
    }

    // Activation Logic
    if (submitActivationCodeButton) {
        submitActivationCodeButton.addEventListener('click', () => {
            const enteredCode = activationCodeInput.value.trim();
            if (enteredCode === correctActivationCode) {
                localStorage.setItem('alulaActivated', 'true');
                activationMessage.textContent = 'Activation successful! Please register.';
                activationMessage.classList.remove('text-red-500');
                activationMessage.classList.add('text-green-500');
                setTimeout(() => {
                    activationMessage.innerHTML = '&nbsp;';
                    loadAndSetUserData(); 
                    if (currentUserData && currentUserData.birthday && currentUserData.handleName) {
                        showMainChat();
                    } else {
                        showRegistrationForm();
                    }
                }, 2000);
            } else {
                activationMessage.textContent = '招待コードが正しくありません。';
                activationMessage.classList.remove('text-green-500');
                activationMessage.classList.add('text-red-500');
                if (activationCodeInput) {
                    activationCodeInput.focus();
                    activationCodeInput.select();
                }
            }
        });
    }
    if (activationCodeInput) {
        activationCodeInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                submitActivationCodeButton.click();
            }
        });
    }

    // Registration Logic
    if (submitRegistrationButton) {
        submitRegistrationButton.addEventListener('click', () => {
            const birthdayValue = birthdayInput.value;
            const handleNameValue = handleNameInput.value.trim();

            if (!birthdayValue || !handleNameValue) {
                registrationMessage.textContent = '生年月日とハンドルネームを入力してください。';
                registrationMessage.classList.add('text-red-500');
                return;
            }

            const ageCategory = getAgeCategory(birthdayValue);
            if (ageCategory === 'other' || ageCategory === 'unknown') {
                registrationMessage.textContent = 'Alulaは小学生から高校生までを対象としています。';
                registrationMessage.classList.add('text-red-500');
                return;
            }

            currentUserData = { 
                birthday: birthdayValue, 
                handleName: handleNameValue, 
                ageCategory: ageCategory 
            };
            localStorage.setItem('alulaUser', JSON.stringify(currentUserData));

            registrationMessage.textContent = 'Registration successful! Welcome to Alula.';
            registrationMessage.classList.remove('text-red-500');
            registrationMessage.classList.add('text-green-500');
            setTimeout(() => {
                registrationMessage.innerHTML = '&nbsp;';
                showMainChat();
            }, 2000);
        });
    }
     if (handleNameInput) {
        handleNameInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                submitRegistrationButton.click();
            }
        });
    }
    if (birthdayInput) {
         birthdayInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                submitRegistrationButton.click();
            }
        });
    }

    // Chat Functionality
    function displayMessage(message, sender) {
        if (!chatDisplay) return;
        
        const placeholder = chatDisplay.querySelector('.initial-chat-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('my-2', 'p-3', 'rounded-lg', 'shadow', 'max-w-[85%]', 'text-sm', 'break-words');

        if (sender === 'user') {
            messageWrapper.classList.add('bg-purple-600', 'bg-opacity-70', 'self-end', 'ml-auto');
        } else { 
            messageWrapper.classList.add('bg-blue-600', 'bg-opacity-70', 'self-start', 'mr-auto');
        }
        
        const messageText = document.createElement('p');
        messageText.classList.add('text-gray-200');
        messageText.textContent = message; 
        messageWrapper.appendChild(messageText);

        chatDisplay.appendChild(messageWrapper);
        chatDisplay.scrollTop = chatDisplay.scrollHeight; 
    }

    async function sendMessageToAI(text) {
        console.log("Censorship disabled state:", isCensorshipDisabled); // Log censorship state

        if (!currentUserData) { 
            loadAndSetUserData(); 
        }
        
        if (listeningWave) {
            listeningWave.classList.remove('hidden');
            listeningWave.classList.add('animate-pulse'); 
        }
        
        console.log("Sending to AI (stub):", text, "User Category:", currentUserData ? currentUserData.ageCategory : 'N/A');
        await new Promise(resolve => setTimeout(resolve, 2000)); 
        
        let aiResponse = "";
        const handleName = currentUserData ? currentUserData.handleName : "User";
        const ageCategory = currentUserData ? currentUserData.ageCategory : "unknown";

        switch (ageCategory) {
            case 'elementary':
                aiResponse = `${handleName}くん・ちゃん、こんにちは！それはね、こういうことだよ！ (ダミー応答: ${text})`;
                break;
            case 'middle':
            case 'high':
                aiResponse = `${handleName}さん、その質問ですね。これは次のように考えられます。(ダミー応答: ${text})`;
                break;
            default: 
                aiResponse = `${handleName}さん、ご質問ありがとうございます。こちらが回答です。(ダミー応答: ${text})`;
                break;
        }
        
        displayMessage(aiResponse, "ai");

        if (listeningWave) {
            listeningWave.classList.add('hidden');
            listeningWave.classList.remove('animate-pulse');
        }
    }

    function handleSendMessage() {
        if (!textInput) return;
        const messageText = textInput.value.trim();

        if (messageText === censorshipDeactivationCommand) {
            isCensorshipDisabled = !isCensorshipDisabled; // Toggle the state
            if (isCensorshipDisabled) {
                displayMessage("検閲モードが解除されました。より自由な会話が可能になりますが、不適切な内容は引き続きブロックされます。", "ai");
            } else {
                displayMessage("検閲モードが有効になりました。標準の会話モードに戻ります。", "ai");
            }
            textInput.value = ''; // Clear the input field
            textInput.focus();
            return; // Command processed, do not send to AI or display as user message
        }

        if (messageText) {
            displayMessage(messageText, "user");
            sendMessageToAI(messageText);
            textInput.value = '';
            textInput.focus();
        }
    }

    if (sendButton) {
        sendButton.addEventListener('click', handleSendMessage);
    }

    if (textInput) {
        textInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleSendMessage();
            }
        });
    }

    if (micButton) {
        micButton.addEventListener('click', () => {
            isMicListening = !isMicListening; 
            if (isMicListening) {
                micButton.classList.add('animate-pulse-glow', 'bg-red-500'); 
                micButton.classList.remove('bg-purple-600');
                console.log("Mic button ON - listening (simulated)");
                displayMessage("マイク入力がオンになりました (シミュレーション)。もう一度クリックして停止します。", "ai");
            } else {
                micButton.classList.remove('animate-pulse-glow', 'bg-red-500');
                micButton.classList.add('bg-purple-600');
                console.log("Mic button OFF - not listening");
                displayMessage("マイク入力がオフになりました (シミュレーション)。", "ai");
            }
        });
    }
});
