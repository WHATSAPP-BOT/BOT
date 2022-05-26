const {default:
       makeWASocket,
       DisconnectReason,
       useSingleFileAuthState,
       makeInMemoryStore,
       fetchLatestBaileysVersion} = require("@adiwajshing/baileys");
const { state, saveState } = useSingleFileAuthState('./KaoriMD.json')
const fs = require('fs')
const pino = require('pino')
const chalk = require('chalk')
const axios = require("axios")
const ffmpeg = require('fluent-ffmpeg')
const moment = require("moment-timezone")
const { exec, spawn, execSync } = require("child_process")
const { color, bgcolor } = require('./lib/color')
const { addBanned, unBanned, BannedExpired, cekBannedUser } = require('./lib/banned.js')

const prefix = "."
//
const _registered = JSON.parse(fs.readFileSync('./src/registered.json'))
const ban = JSON.parse(fs.readFileSync('./src/banned.json'))
//const fakae = fs.readFileSync('./media/imagen/fake.jpg')
//const { reglas, logos } = require ('./lib/reglas')

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const antilink = JSON.parse(fs.readFileSync('./src/antilink.json'))
const antifake = JSON.parse(fs.readFileSync('./src/antifake.json'))
const chatban = JSON.parse(fs.readFileSync('./src/ban.json'))
const mas18 = JSON.parse(fs.readFileSync('./src/porni.json'))
const multiprefix = JSON.parse(fs.readFileSync('./src/multiprefix.json'))
const _leveling = JSON.parse(fs.readFileSync('./src/leveling.json'))
const autostick = JSON.parse(fs.readFileSync('./src/autostick.json'))
const autolevel = JSON.parse(fs.readFileSync('./src/autolevel.json'))

//
const config = JSON.parse(fs.readFileSync("./config.json"))
const owner = config.owner
const mods = config.mods
const fake = 'Leon'
var public = config.public

async function start() {
    let { version, isLatest } = await fetchLatestBaileysVersion()

        const ghost = makeWASocket({
        printQRInTerminal: true,
		logger: pino({ level: 'silent' }),
        browser: ['XXxxxxxxxxx',],
		auth: state,
        version,
	})

    store.bind(ghost.ev)
    ghost.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update	    
        if (connection === 'close') {
        let reason = lastDisconnect.error ? lastDisconnect?.error?.output.statusCode : 0;
            if (reason === DisconnectReason.badSession) { console.log(`Bad Session File, Please Delete Session and Scan Again`); process.exit(); }
            else if (reason === DisconnectReason.connectionClosed) { console.log("Connection closed, reconnecting...."); start(); }
            else if (reason === DisconnectReason.connectionLost) { console.log("Connection Lost from Server, reconnecting..."); start(); }
            else if (reason === DisconnectReason.connectionReplaced) { console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First"); process.exit(); }
            else if (reason === DisconnectReason.loggedOut) { console.log(`Device Logged Out, Please Delete Session and Scan Again.`); process.exit(); }
            else if (reason === DisconnectReason.restartRequired) { console.log("Restart Required, Restarting..."); start(); }
            else if (reason === DisconnectReason.timedOut) { console.log("Connection TimedOut, Reconnecting..."); start(); }
            else { console.log(`Unknown DisconnectReason: ${reason}|${connection}`) }
        }
        console.log('Connected...', update)
    })
    console.log(color('Conectado :D'))
    const getRegisteredRandomId = () => {
        return _registered[Math.floor(Math.random() * _registered.length)].id
        }
        const addRegisteredUser = (Usuario, NameUser, nombre, edad, DNI, hora,) => {
          const obj = { id: Usuario, Nick: NameUser, name: nombre, edad: edad, dni: DNI, hora: hora }
          _registered.push(obj)
          fs.writeFileSync('./src/registered.json', JSON.stringify(_registered))
          }
        const checkRegisteredUser = (Usuario) => {
        let status = false
        Object.keys(_registered).forEach((i) => {
        if (_registered[i].id === Usuario) {
        status = true
        }
        })
            return status
        }
	ghost.ev.on('messages.upsert', async (up) => {
		try {
			if (!up.messages) return
        const vip = up.messages[0]
        if (!vip.message) return
        vip.message = (Object.keys(vip.message)[0] === 'ephemeralMessage') ? vip.message.ephemeralMessage.message : vip.message
        if (vip.key && vip.key.remoteJid === 'status@broadcast') return
        if (vip.key.id.startsWith('BAE5') && vip.key.id.length === 16) return
        const fromMe = vip.key.fromMe
        const content = JSON.stringify(vip.message)
        const from = vip.key.remoteJid
        const type = Object.keys(vip.message)[0]
        const body = (type === 'conversation') ? vip.message.conversation : (type == 'imageMessage') ? vip.message.imageMessage.caption : (type == 'videoMessage') ? vip.message.videoMessage.caption : (type == 'extendedTextMessage') ? vip.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? vip.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? vip.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ? vip.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (vip.message.buttonsResponseMessage?.selectedButtonId || vip.message.listResponseMessage?.singleSelectReply.selectedRowId || (type == 'listResponseMessage' ? vip.msg.singleSelectReply.selectedRowId : '') || vip.msg.text || vip.msg.caption || vip.msg || '') : ''
const budy = (type === 'conversation') ? vip.message.conversation : (type === 'extendedTextMessage') ? vip.message.extendedTextMessage.text : ''
const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
const isCmd = body.startsWith(prefix)
const args = body.trim().split(/ +/).slice(1)
const ar = args.map((v) => v.toLowerCase())
const q = args.join(' ')
const ownerNumber = ["#####@s.whatsapp.net"]

// Group
const isGroup = from.endsWith('@g.us')
const sender = isGroup ? (vip.key.participant ? vip.key.participant : vip.participant) : vip.key.remoteJid
const senderNumber = sender.split("@")[0]
const botNumber = ghost.user.id.split(':')[0] + '@s.whatsapp.net'
const isOwner = senderNumber == owner || senderNumber == botNumber || mods.includes(senderNumber)

const itsMe = sender == botNumber ? true : false
const pushname = vip.pushName || "No Name"
const groupMetadata = isGroup ? await ghost.groupMetadata(from).catch(e => {}) : ''

const groupName = isGroup ? groupMetadata.subject : ''
const groupMembers = isGroup ? await groupMetadata.participants : ''
const groupAdmins = isGroup ? await groupMembers.filter(v => v.admin !== null).map(v => v.id) : ''
const isAdmin = isGroup ? groupAdmins.includes(sender) : false
const botAdmin = isGroup ? groupAdmins.includes(botNumber) : false
const mentionUser = vip.mentionedJid ? vip.mentionedJid : vip.quoted ? vip.quoted.Usuario : q.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
        const isBan = cekBannedUser(sender, ban)
        const isRegister = checkRegisteredUser(sender)

        const isWelkom = isGroup ? welkom.includes(from) : false
        const isAutolevel = isGroup ? autolevel.includes(from) : false
      
        const isAntiFake = isGroup ? antifake.includes(from) : false
        const isAntiLink = isGroup ? antilink.includes(from) : false
        const isSex = isGroup ? mas18.includes(from) : false
        const isBanChat = chatban.includes(from)
        if (isBanChat && !isOwner) return
        const isMultiPrefix = isGroup ? multiprefix.includes(from) : false
        const quoted = vip.quoted ? vip.quoted : vip
        const mime = (quoted.msg || quoted).mimetype || ''
        const isMedia = /image|video|sticker|audio/.test(mime)
        const reply = (text) => {
            ghost.sendMessage(from, { text: text }, {quoted: vip, sendEphemeral: true})
        }
        
        mess = {
            wait: '*EN PROCESO*',
            success: '*LISTO PANA*',
            ferr: 'Intentalo de nuevo mas tarde',
            error: {
            stick: 'Mmmmm',
            Iv: 'Mmmmm'
            },
            only: {
                group: 'Este comando solo puede ser usado en grupos.',
                benned: 'Eres un usario *BANEADO* no puedes usar el bot',
                ownerG: 'Este comando solo puede ser utilizado por el creador del grupo',
                ownerB: 'Este comandos solo puede ser utilizado desde el numero del bot',
                admin: 'Este comando es solo para administradores del grupo',
                Badmin: 'Botcito debe ser admin para poder usar este comando',
                usrReg: `No estas registrado para registrarte utiliza\n${prefix}reg\n\n*Ejemplo:*\n\n${prefix}reg Ghost|14`
              }
            }        
switch (command) {
case 'test':
reply(`*Hola ${pushname}!*`)
break

case 'kick':
case 'eliminar':
case 'fuera':
            if (!isRegister) return reply(mess.only.usrReg)
            if (isBan) return reply  (mess.only.benned)	
            if (!isGroup) return reply(mess.only.group)
            if (!isAdmin) return reply(mess.only.admin)
            if (!botAdmin) return reply (mess.only.Badmin)
            if (!mentionUser) return reply('Eliqueta un mensaje de aquien debo eliminar, no etiquete un mensaje, sino mencionalo ')
            reply('Al toque elimino a la rata')
            //reply(`@${mentionUser[0].split('@')[0]} Seras eliminado de grupo, gracia por tu atencion`, text, {contextInfo: { mentionedJid: [mentionUser]}})
            {await ghost.groupParticipantsUpdate(from, [mentionUser], 'remove')}
            break

case 'grupo cerrar':
case 'cerrar':

            if (!isRegister) return reply(mess.only.usrReg)
            if (isBan) return reply  (mess.only.benned)	
            if (!isGroup) return reply(mess.only.group)
            if (!isAdmin) return reply(mess.only.admin)
            if (!botAdmin) return reply (mess.only.Badmin)
            ghost.groupSettingUpdate(from, 'announcement')
            reply('*Grupo Cerrado Correctamente*')
            break


case 'grupo abrir':
case 'abrir':

            if (!isRegister) return reply(mess.only.usrReg)
            if (isBan) return reply  (mess.only.benned)	
            if (!isGroup) return reply(mess.only.group)
            if (!isAdmin) return reply(mess.only.admin)
            if (!botAdmin) return reply (mess.only.Badmin)
            ghost.groupSettingUpdate(from, 'not_announcement')
            reply('*Grupo Abierto Correctamente*')
            break
case 'admin':
case 'promote':
                  if (!isRegister) return reply(mess.only.usrReg)
                  if (isBan) return reply  (mess.only.benned)	
                  if (!isGroup) return reply(mess.only.group)
                  if (!isAdmin) return reply(mess.only.admin)
                  if (!botAdmin) return reply (mess.only.Badmin)

                  if (!mentionUser) return reply(`Menciona a la persona que le debo dar admin, ejemplo: ${prefix + command} @participante... o etiqueta el mensaje de la persona a eliminar`)
                  {await ghost.groupParticipantsUpdate(from, [mentionUser], 'promote')}

                  break 

case 'demote':
              if (!isRegister) return reply(mess.only.usrReg)
              if (isBan) return reply  (mess.only.benned)	
              if (!isGroup) return reply(mess.only.group)
              if (!isAdmin) return reply(mess.only.admin)
              if (!botAdmin) return reply (mess.only.Badmin)
              if (!mentionUser.length == 1) return reply('Menciona a la persona que debo quitarle admin')
              {await ghost.groupParticipantsUpdate(from, [mentionUser], 'demote')}
              break    

case 'kick':
case 'eliminar':
            if (!isRegister) return reply(mess.only.usrReg)
            if (isBan) return reply  (mess.only.benned)	
            if (!isGroup) return reply(mess.only.group)
            if (!isAdmin) return reply(mess.only.admin)
            if (!botAdmin) return reply (mess.only.Badmin)
            if (!mentionUser) return reply('Eliqueta un mensaje de aquien debo eliminar o mencionalo')
            reply('Al toque elimino a la rata')
            //reply(`@${mentionUser[0].split('@')[0]} Seras eliminado de grupo, gracia por tu atencion`, text, {contextInfo: { mentionedJid: [mentionUser]}})
            {await ghost.groupParticipantsUpdate(from, [mentionUser], 'remove')}
            break

case 'añadir':
case 'add':
case 'agregar':
case 'unir':
case 'añadir':
            if (!isGroup) return reply(mess.only.group)
            if (!isAdmin) return reply(mess.only.admin)
            if (!botAdmin) return reply (mess.only.Badmin)
            if (vip.message.extendedTextMessage != undefined){
            mentioned = vip.message.extendedTextMessage.contextInfo.mentionedJid                             
            } if (args.length < 1) return reply('Y el numero?')
            try {
            num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
            ghost.groupAdd(from, [num])
            } catch (e) {
            if (mentionUser.length == 1)
            ghost.groupAdd(from, mentionUser)
            console.log('Error :', e)
            return ghost.sendMessage(from, 'Modo privado dice:v', MessageType.text)
            }
            break
 
            
            case 'listonline': case 'liston': {
              let id = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : m.chat
              let online = [...Object.keys(store.presences[id]), botNumber]
              ghost.sendMessaget(from, {text: 'List Online:\n\n' + online.map(v => '⭔ @' + v.replace(/@.+/, '')).join`\n`},  { mentions: online })
       }
       break
//MENCION
case 'hidetag':
       
            if (!isRegister) return reply(mess.only.usrReg)
            if (isBan) return reply  (mess.only.benned)	
            if (!isGroup) return reply(mess.only.group)
            if (!isAdmin) return reply(mess.only.admin)
            ghost.sendMessage(from, { text : q, mentions: groupMembers.map(a => a.id)})
            break



case 'miembros':
case 'todos':
case 'tangall':
case 'tagall':
case 'alltang':
case 'xd':
            if (!isRegister) return reply(mess.only.usrReg)
            if (isBan) return reply  (mess.only.benned)	
            if (!isGroup) return reply(mess.only.group)
            if (!isAdmin) return reply(mess.only.admin)    
            members_id = []
            teks = (args.length > 1) ? body.slice(8).trim(): ''
            teks += ` *𝐓𝐨𝐭𝐚𝐥* : ${groupMembers.length}\n`
            for (let mem of groupMembers) {
            teks += `╠ @${mem.id.split('@')[0]}\n`
            members_id.push(mem.id)
            }    
            ghost.sendMessage(from, {text:
              `*𝐌𝐈𝐄𝐌𝐁𝐑𝐎𝐒  𝐃𝐄𝐋  𝐆𝐑𝐔𝐏𝐎*\n╔════ *GHOST BOT*\n╠ ● `+teks+`╠═══════ *GHOST* ═════\n╚══════`, mentions: groupMembers.map(a => a.id)}, {quoted: vip})
            break

case 'link':
case 'enlace':
            if (isBan) return reply  (mess.only.benned)	
            if (!isRegister) return reply(mess.only.usrReg)
            if (!isGroup) return reply(mess.only.group)
            if (!botAdmin) return reply (mess.only.Badmin)
            let link = await ghost.groupInviteCode(from)
            reply(`El lik de este grupo es ${link}`)
            break  



}
} catch (e) {
e = String(e)
console.log(color('[ERROR]', 'red'), color(e, 'cyan'))
}
})
}
start()