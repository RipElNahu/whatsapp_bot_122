const { create, Client } = require('@open-wa/wa-automate') // As consts aqui declaram as funções de outros arquivos
const welcome = require('./lib/welcome') // Ou de modulos que usei
const kconfig = require('./config')
const options = require('./options')
const color = require('./lib/color')

// Cria um cliente de inicialização da BOT
const start = (kill = new Client()) => {
    console.log(color('\n> DEV OFICIAL ='), color('SAMU330', 'yellow'))
	console.log(color('\n>'), color('Instalacion finalizada, ya puede usar comandos...\n', 'red'))
	
		// Forçar recarregamento caso obtenha erros
		kill.onStateChanged((state) => {
			console.log('[Estado de Íris]', state)
			if (state === 'CONFLICT' || state === 'UNLAUNCHED') kill.forceRefocus()
		})
	
		
        // Le as mensagens e limpa cache
        kill.onMessage((async (message) => {
            kill.getAmountOfLoadedMessages()
            .then((msg) => {
                if (msg >= 500) {
                    kill.cutMsgCache()
                }
            })
            kconfig(kill, message)
        }))
		
		// Configuração do welcome
        kill.onGlobalParicipantsChanged((async (heuh) => {
            await welcome(kill, heuh)
            }))
        
		
		// Funções para caso seja adicionada em um grupo
        kill.onAddedToGroup(((chat) => {
            let totalMem = chat.groupMetadata.participants.length
            if (totalMem < 20) { 
            	kill.sendText(chat.id, `Un nuevo grupo, uwu! 😃\nLástima que no tenga el requisito, que es tener al menos [20] miembros. Tienes ${totalMem}, reune más gente! 😉`).then(() => kill.leaveGroup(chat.id))
            } else {
                kill.sendText(chat.groupMetadata.id, `Hola! 🌟\nMe solicitaron como BOT para este grupo, ¡y estaré a su disposición! 🤖\nSi quieres ver mis funciones usa /menu!`)
            }
        }))
		
		
		// analise de mensagens
		kill.onAnyMessage((lise) => { 
			messageLog(lise.fromMe, lise.type)
		})
		

        // Bloqueia na call
        kill.onIncomingCall(( async (call) => {
            await kill.sendText(call.peerJid, 'Que pena! ¡Las llamadas no son compatibles y se interponen en el camino! 😊\nTe bloqueé para evitar nuevos incidentes, contacta al propietario para desbloquear. 👋')
            .then(() => kill.contactBlock(call.peerJid)) // se quiser, pode inserir seu numero acima na sendText com wa.me ou apenas o numero, ou pode mudar pra kill.sendTextWithMentions pra enviar te marcando
        }))
    }

create(options(true, start))
    .then((kill) => start(kill))
    .catch((err) => new Error(err))
