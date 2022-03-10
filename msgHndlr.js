const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const axios = require('axios')
const moment = require('moment-timezone')
const os = require('os')
const { BikinTikel } = require('./lib/tikel_makel')
const urlShortener = require('./lib/shortener')
const get = require('got')
const speed = require('performance-now')
const color = require('./lib/color')
const fetch = require('node-fetch')
const { spawn, exec } = require('child_process')
const nhentai = require('nhentai-js')
const { API } = require('nhentai-api')
const google = require('google-it')
const tiktok = require('tiktok-scraper')
const { getStickerMaker } = require('./lib/ttp')
const translatte = require('translatte')
const { wallpaper } = require('./wallpaper');
const getZodiak = require('./zodiak');
const { downloader, liriklagu, quotemaker, randomNimek, fb, sleep, jadwalTv, ss, msgFilter, processTime, nulis } = require('./lib/functions')
const { help, menuadmin, an, gm, gr, md, mk, ot, sc, menuowner } = require('./lib/help')
const { stdout } = require('process')
const { uploadImages, custom, fetchBase64, getBase64 } = require('./lib/fetcher')
const quotedd = require('./settings/quote.json')
const nsfw_ = JSON.parse(fs.readFileSync('./settings/NSFW.json'))
const welkom = JSON.parse(fs.readFileSync('./settings/welcome.json'))
const intr = JSON.parse(fs.readFileSync('./settings/intro.json'))
const setting = JSON.parse(fs.readFileSync('./settings/config.json'))
const limit = JSON.parse(fs.readFileSync('./lib/limit.json'));
const msgLimit = JSON.parse(fs.readFileSync('./lib/msgLimit.json'));
const left = JSON.parse(fs.readFileSync('./settings/left.json')) 
const banned = JSON.parse(fs.readFileSync('./lib/banned.json'))
const muted = JSON.parse(fs.readFileSync('./lib/muted.json'))
const premiumNumber = JSON.parse(fs.readFileSync('./settings/premium.json'))
let antilink = JSON.parse(fs.readFileSync('./settings/antilink.json'))
let antibadword = JSON.parse(fs.readFileSync('./settings/antibadword.json'))
const afk = JSON.parse(fs.readFileSync('./lib/afk.json'))
const daftar = JSON.parse(fs.readFileSync('./lib/daftar.json'))
const { ind, eng } = require('./lib/text')
const bent = require('bent')
var request = require('request');
const meme = require('./lib/meme.js')
const rugaapi = require('./lib/rugaapi')
const resep = require('./lib/resep')
const images = require('./lib/images')
const shortlink = require('./lib/shortener')
const ubah = "```"

const {
    toxic,
    quotes,
    quotes2,
    quotes3,
    hilih,
    alay,
    ninja,
    pantunpakboy,

} = require('./lib/tools')
const { ar } = require('translatte/languages')
let { 
    limitCount,
    memberLimit, 
    groupLimit,
    banChats,
    prefix,
    restartState: isRestart,
    mtc: mtcState
    } = setting

let state = {
    status: () => {
        if(banChats){
            return 'Nonaktif'
        }else if(mtcState){
            return 'Nonaktif'
        }else if(!mtcState){
            return 'Aktif'
        }else{
            return 'Aktif'
        }
    }
}

moment.tz.setDefault('Asia/Jakarta').locale('id')
module.exports = msgHandler = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, chatId, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, author, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        const arg = body.trim().substring(body.indexOf(' ') + 1)
        const args =  commands.split(' ')
        const isCmd = command.startsWith(prefix)
        const chats = (type === 'chat') ? body : (type === 'image' || type === 'video') ? caption : ''
                const isMuted = (chatId) => {
            if(muted.includes(chatId)){
                return false
            }else{
                return true
            }
        }

        const addAfkUser = (userId, time, reason) => {
            const obj = {id: `${userId}`, time: `${time}`, reason: `${reason}`}
            afk.push(obj)
            fs.writeFileSync('./lib/afk.json', JSON.stringify(afk))
        }

        const checkAfkUser = (userId) => {
            let status = false
            Object.keys(afk).forEach((i) => {
                if (afk[i].id === userId) {
                    status = true
                }
            })
            return status
        }

        const getAfkReason = (userId) => {
            let position = false
            Object.keys(afk).forEach((i) => {
                if (afk[i].id === userId) {
                    position = i
                }
            })
            if (position !== false) {
                return afk[position].reason
            }
        }

        const getAfkTime = (userId) => {
            let position = false
            Object.keys(afk).forEach((i) => {
                if (afk[i].id === userId) {
                    position = i
                }
            })
            if (position !== false) {
                return afk[position].time
            }
        }

        const getAfkId = (userId) => {
            let position = false
            Object.keys(afk).forEach((i) => {
                if (afk[i].id === userId) {
                    position = i
                }
            })
            if (position !== false) {
                return afk[position].id
            }
        }

        const getAfkPosition = (userId) => {
            let position = false
            Object.keys(afk).forEach((i) => {
                if (afk[i].id === userId) {
                    position = i
                }
            })
            return position
        }

        function restartAwal(client){
            setting.restartState = false
            isRestart = false
            client.sendText(setting.restartId, 'Restart Succesfull!')
            setting.restartId = 'undefined'
            fs.writeFileSync('./lib/setting.json', JSON.stringify(setting, null,2));
        }


       
        function banChat () {
            if(banChats == true) {
            return false
        }else{
            return true
            }
        }

        // AFK
        if (isGroupMsg) {
            for (let ment of mentionedJidList) {
                if (checkAfkUser(ment)) {
                    const getId = getAfkId(ment)
                    const getReason = getAfkReason(getId)
                    const getTime = getAfkTime(getId)
                    await client.reply(from, ind.afkMentioned(getReason, getTime), id)
                }
            }
            if (checkAfkUser(sender.id) && !isCmd) {
                afk.splice(getAfkPosition(sender.id), 1)
                fs.writeFileSync('./lib/afk.json', JSON.stringify(afk))
                await client.sendText(from, ind.afkDone(pushname))
            }
        }
                // END HELPER FUNCTION


        //BEGIN HELPER


        if (typeof Array.prototype.splice === 'undefined') {
            Array.prototype.splice = function (index, howmany, elemes) {
                howmany = typeof howmany === 'undefined' || this.length;
                var elems = Array.prototype.slice.call(arguments, 2), newArr = this.slice(0, index), last = this.slice(index + howmany);
                newArr = newArr.concat.apply(newArr, elems);
                newArr = newArr.concat.apply(newArr, last);
                return newArr;
            }
        }

        function isMsgLimit(id){
            if (isSadmin) {return false;}
            let found = false;
            const addmsg = JSON.parse(fs.readFileSync('./lib/msgLimit.json'))
            for (let i of addmsg){
                if(i.id === id){
                    if (i.msg >= 12) {
                        found === true 
                        console.log(i)
                        client.reply(from, '*[ANTI-SPAM]*\nMaaf, akun anda kami blok karena SPAM, dan tidak bisa di UNBLOK!', id)
                        client.contactBlock(id)
                        banned.push(id)
                        fs.writeFileSync('./lib/banned.json', JSON.stringify(banned))
                        return true;
                    }else if(i.msg >= 7){
                        found === true
                        client.reply(from, '*[ANTI-SPAM]*\nNomor anda terdeteksi spam!\nMohon tidak spam 5 pesan lagi atau nomor anda AUTO BLOK!', id)
                        return true
                    }else{
                        found === true
                        return false;
                    }   
                }
            }
            if (found === false){
                let obj = {id: `${id}`, msg:1};
                addmsg.push(obj);
                fs.writeFileSync('./lib/msgLimit.json',JSON.stringify(addmsg));
                return false;
            }  
        }

        function addMsgLimit(id){
            if (isSadmin) {return;}
            var found = false
            const addmsg = JSON.parse(fs.readFileSync('./lib/msgLimit.json'))
            Object.keys(addmsg).forEach((i) => {
                if(addmsg[i].id == id){
                    found = i
                    console.log(addmsg[0])
                }
            })
            if (found !== false) {
                addmsg[found].msg += 1;
                fs.writeFileSync('./lib/msgLimit.json',JSON.stringify(addmsg));
                console.log(addmsg[0])
            }
        }

        function isLimit(id){
            if (isSadmin) {return false;}
            let found = false;
            for (let i of limit){
                if(i.id === id){
                    let limits = i.limit;
                    if (limits >= limitCount) {
                        found = true;
                        console.log(`Limit Abis : ${serial}`)
                        return true;
                    }else{
                        limit
                        found = true;
                        return false;
                    }
                    }
            }
            if (found === false){
                let obj = {id: `${id}`, limit:1};
                limit.push(obj);
                fs.writeFileSync('./lib/limit.json',JSON.stringify(limit));
                return false;
            }  
        }

        function limitAdd (id) {
            if (isSadmin) {return;}
            var found = false;
            const limidat = JSON.parse(fs.readFileSync('./lib/limit.json'))
            Object.keys(limidat).forEach((i) => {
                if(limidat[i].id == id){
                    found = i
                    console.log(limidat[i])
                }
            })
            if (found !== false) {
                limidat[found].limit += 1;
                console.log(limidat[found])
                fs.writeFileSync('./lib/limit.json',JSON.stringify(limidat));
            }
        }
        
        const msgs = (message) => {
            if (command.startsWith('#')) {
                if (message.length >= 10){
                    return `${message.substr(0, 15)}`
                }else{
                    return `${message}`
                }
            }
        }

        const isWhite = (chatId) => premiumNumber.includes(chatId) ? true : false
        const isWhiteList = (chatId) => {
            if(premiumNumber.includes(sender.id)){
                if(muted.includes(chatId)) return false
                return true
            }else{
                return false
            }
        }

        const apakah = [
            'Ya',
            'Tidak',
            'Coba Ulangi'
            ]

        const bisakah = [
            'Bisa',
            'Tidak Bisa',
            'Coba Ulangi'
            ]

        const kapankah = [
            '1 Minggu lagi',
            '1 Bulan lagi',
            '1 Tahun lagi'
            ]

        const rate = [
            '100%',
            '90%',
            '80%',
            '70%',
            '60%',
            '50%',
            '40%',
            '30%',
            '20%',
            '10%'
            ]

        const mess = {
            wait: 'Proses bor tunggu aja sabar ^_^',
            error: {
                St: '[❗] Kirim gambar dengan caption *#sticker* atau tag gambar yang sudah dikirim',
                Qm: '[❗] Terjadi kesalahan, mungkin themenya tidak tersedia!',
                Yt3: '[❗] Terjadi kesalahan, tidak dapat meng konversi ke mp3!',
                Yt4: '[❗] Terjadi kesalahan, mungkin error di sebabkan oleh sistem.',
                Ig: '[❗] Terjadi kesalahan, mungkin karena akunnya private',
                Ki: '[❗] Bot tidak bisa mengeluarkan Admin group!',
                Sp: '[❗] Bot tidak bisa mengeluarkan Admin',
                Ow: '[❗] Bot tidak bisa mengeluarkan Owner',
                Bk: '[❗] Bot tidak bisa memblockir Owner',
                Ad: '[❗] Tidak dapat menambahkan target, mungkin karena di private',
                Iv: '[❗] Link yang anda kirim tidak valid!'
            }
        }

        
        // PROTECT
        const isDetectorLink = antilink.includes(chatId)
        const isDetectorBadword = antibadword.includes(chatId)

        const puppeteer = require('puppeteer')
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const botNumber = await client.getHostNumber()
        const blockNumber = await client.getBlockedIds()
        const isAfkOn = checkAfkUser(sender.id)
        const serial = sender.id
        const isSadmin = serial
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
        
        const isdaftar = daftar.includes(sender.id)
        const adminNumber = ['628119001453@c.us']
        const isAdmin = adminNumber.includes(sender.id)
        const ownerNumber = '628119001453@c.us'
        const isOwner = ownerNumber.includes(sender.id)
        const isPrem = premiumNumber.includes(sender.id)
        const isBanned = banned.includes(sender.id)
        const isBlocked = blockNumber.includes(sender.id)
        const isNsfw = isGroupMsg ? nsfw_.includes(chat.id) : false
        /* const isSimi = isGroupMsg ? simi_.includes(chat.id) : false */
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
        const url = args.length !== 0 ? args[0] : ''
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        

        const vhtearkey = 'ridho2k99KKYli' // https://api.vhtear.com
        const barbarkey = 'xXvQeSgB0iWpJbri4TyU' // https://mhankbarbar.herokuapp.com/api

        const errorurl = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
        const errorurl2 = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'

                // END HELPER FUNCTION
                if(body === '#mute' && isMuted(chatId) == true){
                    if(isGroupMsg) {
                        if (!isGroupAdmins) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh admin grup!', id)
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        muted.push(chatId)
                        fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
                        client.reply(from, 'Bot telah di mute pada chat ini! #unmute untuk unmute!', id)
                    }else{
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        muted.push(chatId)
                        fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
                        client.reply(from, 'Bot telah di mute pada chat ini! #unmute untuk unmute!', id)
                    }
                }

                if(body === '#unmute' && isMuted(chatId) == false){
                    if(isGroupMsg) {
                        if (!isGroupAdmins) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh admin grup!', id)
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        let index = muted.indexOf(chatId);
                        muted.splice(index,1)
                        fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
                        client.reply(from, 'Bot telah di unmute!', id)         
                    }else{
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        let index = muted.indexOf(chatId);
                        muted.splice(index,1)
                        fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
                        client.reply(from, 'Bot telah di unmute!', id)                   
                    }
                }
                if(body === '#banchat enable' && banChats == true){
                    if(isGroupMsg) {
                        if (!isOwner) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh Owner bot', id)
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        if(setting.banChats === true) return
                        setting.banChats = true
                        banChats = true
                        fs.writeFileSync('./lib/setting.json', JSON.stringify(setting, null, 2))
                       client.reply(from,'Global chat has been enable!', id)
                    }else{
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        if(setting.banChats === false) return
                        setting.banChats = true
                        banChats = true
                        fs.writeFileSync('./lib/setting.json', JSON.stringify(setting, null, 2))
                        client.reply(from, 'Global chat has been disable!', id)
                    }
                }
                if(body === '#banchat disable' && banChats == false){
                    if(isGroupMsg) {
                        if (!isOwner) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh Owner bot!', id)
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        setting.banChats = false
                        banChats = false
                        fs.writeFileSync('./lib/setting.json', JSON.stringify(setting, null, 2))
                        client.reply(from, 'Global chat has been disable!', id)
                    }else{
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        setting.banChats = false
                        banChats = false
                        fs.writeFileSync('./lib/setting.json', JSON.stringify(setting, null, 2))
                        client.reply(from, 'Global chat has been disable!', id)
                    }
                }
                if(body === '#mute' && isMuted(chatId) == true){
                    if(isGroupMsg) {
                        if (!isAdmin) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh admin bot!', id)
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        muted.push(chatId)
                        fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
                        client.reply(from, 'Bot telah di mute pada chat ini! #unmute untuk unmute!', id)
                    }else{
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        muted.push(chatId)
                        fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
                        client.reply(from, 'Bot telah di mute pada chat ini! #unmute untuk unmute!', id)
                    }
                }
                if(body === '#unmute' && isMuted(chatId) == false){
                    if(isGroupMsg) {
                        if (!isAdmin) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh admin bot!', id)
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        let index = muted.indexOf(chatId);
                        muted.splice(index,1)
                        fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
                        client.reply(from, 'Bot telah di unmute!', id)         
                    }else{
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        let index = muted.indexOf(chatId);
                        muted.splice(index,1)
                        fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
                        client.reply(from, 'Bot telah di unmute!', id)                   
                    }
                }

                // END HELPER FUNCTION
                if (isGroupMsg && isDetectorLink && !isGroupAdmins && !isPrem && !isOwner){
                    if (chats.match(/(https:\/\/chat.whatsapp.com)/gi)) {
                        const check = await client.inviteInfo(chats);
                        if (!check) {
                            return
                        } else {
                            client.reply(from, `*「 GROUP LINK DETECTOR 」*\nKamu mengirimkan link grup chat, maaf kamu di kick dari grup :(`, id).then(() => {
                                client.removeParticipant(groupId, sender.id)
                            })
                        }
                    }
                }
                // MRHRTZ
                if (isGroupMsg && isDetectorBadword && !isGroupAdmins && !isPrem && !isOwner){
                    if (chats.match("anjing") || chats.match("gblk") || chats.match("tolol") || chats.match("kntl")) {
                        if (!isGroupAdmins) {
                            return client.reply(from, "JAGA UCAPAN DONG!! 😠", id)
                            .then(() => client.removeParticipant(groupId, sender.id))
                            .then(() => {
                                client.sendText(from, `*「 ANTI BADWORD 」*\nKamu mengirimkan link grup chat, maaf kamu di kick dari grup 🙁`)
                            }).catch(() => client.sendText(from, `Untung SANKYU BOT Bukan Admin, Kalo Jadi Admin Udah Aku Kick Tuh! 😑`))
                        } else {
                            return client.reply(from, "Tolong Jaga Ucapan Min 😇", id)
                        }
                    }
                }


        if (isCmd && !isGroupMsg) {console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))}
        if (isCmd && isGroupMsg) {console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle))}

        if (isBanned) return
        if (mtcState) return
        if (!banChat()) return
        if (!isMuted(chatId)) return
        if (isBlocked) return
        switch(command) {

        case "#restart":
            client.restartAwal
            break
        case 'bot':
        case 'halo':
        case 'halo bot':
        case 'ini bot?':
        case 'bg':
        case 'SANKYU':
        case 'bg SANKYU':
        case 'hai':
        case 'cok':
        case 'cuk':
        case 'bro':
        case 'kak':
        case 'bang':
        case 'bor':
        case 'kk':
            client.reply(from, mystest,`Iya ? ada apa ?`, id)
            break

        case 'p':
             client.reply(from, `utamakan salam, *Assalamualaikum*`, id)
             break
        
        case 'assalamualaikum':
        case '*Assalamualaikum*':
             client.reply(from, `waallaikumsallam`, id)
             break
            
            // MENU UTAMA //
        case "#help":
            client.sendText(from, help, id)
            break
        case "#menuadmin":
            client.sendText(from, menuadmin)
            break
        case "#menuowner":
            client.sendText(from, menuowner)
            break
        case "#menu":
            if (args[1] == 'gr' ){ client.sendText(from, gr) }
            if (args[1] == 'md' ){ client.sendText(from, md) }
            if (args[1] == 'mk' ){ client.sendText(from, mk) }
            if (args[1] == 'gm' ){ client.sendText(from, gm) }
            if (args[1] == 'sc' ){ client.sendText(from, sc) }
            if (args[1] == 'an' ){ client.sendText(from, an) }
            if (args[1] == 'ot' ){ client.sendText(from, ot) }
            if (args.length[1]){ client.sendText(from, help) }
            break

        // OWNER //
        case '#creategroup':
        case '#bikingroup':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', id)
            arg = body.trim().split(' ')
            client.reply(from, mess.wait, id)
            const jhoin = '6281289096745@c.us'
            const gcname = arg[1]
            client.createGroup(gcname, jhoin)
            await client.reply(from, 'Group Created ✨️', id)
            break
        case '#culik':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk bot', id)
            arg = body.trim().split(' ')
            const gcnamo = arg[1]
            client.createGroup(gcnamo, mentionedJidList)
            await client.sendText(from, 'Group Created ✨️')
            break
        case '#setprofilepic':
            if (!isOwner) return client.reply(from, `Perintah ini hanya bisa di gunakan oleh Owner SANKYU bot!`, id)
            if (isMedia) {
                const mediaData = await decryptMedia(message)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await client.setProfilePic(imageBase64)
                client.sendTextWithMentions(`Makasih @${sender.id.replace('@c.us','')} Foto Profilenya 😘`)
            } else if (quotedMsg && quotedMsg.type == 'image') {
                const mediaData = await decryptMedia(quotedMsg)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await client.setProfilePic(imageBase64)
                client.sendTextWithMentions(from, `Makasih @${sender.id.replace('@c.us','')} Foto Profilenya 😘`)
            } else {
                client.reply(from, `Wrong Format!\n⚠️ Harap Kirim Gambar Dengan #setprofilepic`, id)
            }
            break
        case '#setname':
            if (!isOwner) return client.reply(from, `Perintah ini hanya bisa di gunakan oleh Owner SANKYU bot!`, id)
                const setnem = body.slice(9)
                await client.setMyName(setnem)
                client.sendTextWithMentions(from, `Makasih Nama Barunya @${sender.id.replace('@c.us','')} 😘`)
            break
        case '#setstatus':
            if (!isOwner) return client.reply(from, `Perintah ini hanya bisa di gunakan oleh Owner SANKYU bot!`, id)
                const setstat = body.slice(11)
                await client.setMyStatus(setstat)
                client.sendTextWithMentions(from, `Makasih Status Barunya @${sender.id.replace('@c.us','')} 😘`)
            break
        case '#bc':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot!', id)
            let msg = body.slice(4)
            const chatz = await client.getAllChatIds()
            for (let ids of chatz) {
                var cvk = await client.getChatById(ids)
                if (!cvk.isReadOnly) await client.sendText(ids, `[ Info ]\n\n${msg}`)
            }
            client.reply(from, 'Broadcast Success!', id)
            break
        case '#leaveall':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', id)
            const allChats = await client.getAllChatIds()
            const allGroups = await client.getAllGroups()
            for (let gclist of allGroups) {
                await client.sendText(gclist.contact.id, `Maaf bot sedang pembersihan, total chat aktif : ${allChats.length}`)
                await client.leaveGroup(gclist.contact.id)
            }
            client.reply(from, 'Succes leave all group!', id)
            break
        case '#clearall':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', id)
            const allChatz = await client.getAllChats()
            for (let dchat of allChatz) {
                await client.deleteChat(dchat.id)
            }
            client.reply(from, 'Succes clear all chat!', id)
            break
        case '#reg':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner SANKYU BOT!', id)
           const reg = body.slice(5)
            {
            daftar.push(reg+'@c.us')
            fs.writeFileSync('./lib/daftar.json', JSON.stringify(daftar))
            client.reply(from, 'SUKSES MENDAFTARKAN TARGET', id)
            }
            break
        case '#listdaftar':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI SANKYU BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|SANKYU|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isOwner) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner SANKYU BOT!', id)
            let ld = `INI ADALAH USER YANG SUDAH DAFTAR DI SANKYU BOT\nTotal : ${daftar.length}\n`
            for (let i of daftar) {
                ld += `➸ ${i.replace(/@c.us/g,'')}\n`
            }
            await client.reply(from, ld, id)
            break
        case '#listprem':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI SANKYU BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|SANKYU|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            let lv = `Ini adalah list User premium SANKYU BOT\nTotal : ${premiumNumber.length}\n`
            for (let i of premiumNumber) {
                lv += `➸ ${i.replace(/@c.us/g,'')}\n`
            }
            await client.reply(from, lv, id)
            break
        case '#listblock':
            //if(!isOwner) return client.reply(from, 'Perintah ini hanya untuk owner bot!', id)
            let hih = `This is list of blocked number\nTotal : ${blockNumber.length}\n`
            for (let i of blockNumber) {
                hih += `➸ ${i.replace(/@c.us/g,'')}\n`
            }
            await client.reply(from, hih, id)
            break
        case '#listgroup':
                client.getAllGroups().then((res) => {
                let berhitung1 = 1
                let gc = `*This is list of group* :\n`
                for (let i = 0; i < res.length; i++) {
                    gc += `\n═════════════════\n\n*No : ${i+1}*\n*Nama* : ${res[i].name}\n*Pesan Belum Dibaca* : ${res[i].unreadCount} chat\n*Tidak Spam* : ${res[i].notSpam}\n`
                }
                client.reply(from, gc, id)
            })
            break
        case '#getses':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', id)            
            const sesPic = await client.getSnapshot()
            client.sendFile(from, sesPic, 'session.png', '_onegaishimasu_', id)
            break

        // ADMIN //
        case '#join':
            if (args.length === 1) return client.reply(from, 'Hanya Owner yang bisa memasukan Bot ke dalam Grup!', id)
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', id)
            const link = body.slice(6)
            const tGr = await client.getAllGroups()
            const minMem = 5
            const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi)
            const check = await client.inviteInfo(link)
            if (!isLink) return client.reply(from, 'Ini link? 👊🤬', id)
            if (tGr.length > 256) return client.reply(from, 'Maaf jumlah group sudah maksimal!', id)
            if (check.size < minMem) return client.reply(from, 'Member group tidak melebihi 5, bot tidak bisa masuk', id)
            if (check.status === 200) {
                await client.joinGroupViaLink(link).then(() => client.reply(from, 'Bot akan segera masuk!', id))
            } else {
                client.reply(from, 'Link group tidak valid!', id)
            }
            break
        case '#setgroupname':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI SANKYU BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|SANKYU|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isGroupMsg) return client.reply(from, `Fitur ini hanya bisa di gunakan dalam group`, id)
            if (!isGroupAdmins) return client.reply(from, `Fitur ini hanya bisa di gunakan oleh admin group`, id)
            if (!isBotGroupAdmins) return client.reply(from, `Fitur ini hanya bisa di gunakan ketika bot menjadi admin`, id)
            const namagrup = body.slice(14)
            let sebelum = chat.groupMetadata.formattedName
            let halaman = global.page ? global.page : await client.getPage()
            await halaman.evaluate((chatId, subject) =>
            Store.WapQuery.changeSubject(chatId, subject),groupId, `${namagrup}`)
            client.sendTextWithMentions(from, `Nama group telah diubah oleh admin @${sender.id.replace('@c.us','')}\n\n• Before: ${sebelum}\n• After: ${namagrup}`)
            break
        case '#setgroupicon':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI SANKYU BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|SANKYU|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isGroupMsg) return client.reply(from, `Fitur ini hanya bisa di gunakan dalam group`, id)
            if (!isGroupAdmins) return client.reply(from, `Fitur ini hanya bisa di gunakan oleh admin group`, id)
            if (!isBotGroupAdmins) return client.reply(from, `Fitur ini hanya bisa di gunakan ketika bot menjadi admin`, id)
            if (isMedia) {
                const mediaData = await decryptMedia(message)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await client.setGroupIcon(from, imageBase64)
                client.sendTextWithMentions(from, `Profile group telah diubah oleh admin @${sender.id.replace('@c.us','')}`)
            } else if (quotedMsg && quotedMsg.type == 'image') {
                const mediaData = await decryptMedia(quotedMsg)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await client.setGroupIcon(from, imageBase64)
                client.sendTextWithMentions(from, `Profile group telah diubah oleh admin @${sender.id.replace('@c.us','')}`)
            } else {
                client.reply(from, `Wrong Format!\n⚠️ Harap Kirim Gambar Dengan #setgroupicon`, id)
            }
            break
        case '#tagall':
        case '#mentionall':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
            const groupMem = await client.getGroupMembers(groupId)
            let hehe = '╔══✪〘 Mention All 〙✪══\n'
            for (let i = 0; i < groupMem.length; i++) {
                hehe += '╠➥'
                hehe += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
            }
            hehe += '╚═〘 SANKYU BOT 〙✪══'
            await sleep(2000)
            await client.sendTextWithMentions(from, hehe)
            break
        case '#add':
            const orgh = args[1]
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (args.length === 1) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *#add* 628xxxxx', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            try {
                await client.addParticipant(from,`${orgh}@c.us`)
            } catch {
                client.reply(from, mess.error.Ad, id)
            }
            break
        case '#kick':
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan Perintah ini, kirim perintah *#kick* @tagmember', id)
            await client.sendText(from, `Perintah diterima, mengeluarkan:\n${mentionedJidList.join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return client.reply(from, mess.error.Sp, id)
                await client.removeParticipant(groupId, mentionedJidList[i])
            }
            break
        case '#promote':
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *#promote* @tagmember', id)
            if (mentionedJidList.length >= 2) return client.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 user.', id)
            if (groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, user tersebut sudah menjadi admin.', id)
            await client.promoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Perintah diterima, menambahkan @${mentionedJidList[0]} sebagai admin.`)
            break
        case '#demote':
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *#demote* @tagadmin', id)
            if (mentionedJidList.length >= 2) return client.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 orang.', id)
            if (!groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, user tersebut tidak menjadi admin.', id)
            await client.demoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Perintah diterima, menghapus jabatan @${mentionedJidList[0]}.`)
            break
        case '#ban':
            if (!isAdmin) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin SANKYU BOT!', id)
                for (let i = 0; i < mentionedJidList.length; i++) {
                banned.push(mentionedJidList[i])
                fs.writeFileSync('./settings/banned.json', JSON.stringify(banned))
                client.reply(from, 'Succes ban target!',id)
            }
            if (args[0] == 'del') {
                let xnxx = banned.indexOf(args[1]+'@c.us')
                banned.splice(xnxx,1)
                fs.writeFileSync('./settings/banned.json', JSON.stringify(banned))
                client.reply(from, 'Success unbanned target!')
            }
            break
        case '#unban':
            if (!isAdmin) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin SANKYU!', id)
                let xnxx = banned.indexOf(args[0]+'@c.us')
                banned.splice(xnxx, 0)
                fs.writeFileSync('./settings/banned.json', JSON.stringify(banned))
                client.reply(from, 'Unbanned User!', id)
            break
        case '#leave':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
            await client.sendText(from,'Sayonara').then(() => client.leaveGroup(groupId))
            break
        case '#delete':
            if (!quotedMsg) return client.reply(from, 'Salah!!, kirim perintah *#delete [tag pesan bot]*', id)
            if (!quotedMsgObj.fromMe) return client.reply(from, 'Salah!!, Bot tidak bisa mengahpus chat user lain!', id)
            client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break
        case '#left':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Admin group!', id)
            if (args.length === 1) return client.reply(from, 'Pilih enable atau disable!', id)
            if (args[1].toLowerCase() === 'enable') {
                left.push(chat.id)
                fs.writeFileSync('./lib/left.json', JSON.stringify(left))
                client.reply(from, 'Fitur left berhasil di aktifkan di group ini!', id)
            } else if (args[1].toLowerCase() === 'disable') {
                left.splice(chat.id, 1)
                fs.writeFileSync('./lib/left.json', JSON.stringify(left))
                client.reply(from, 'Fitur left berhasil di nonaktifkan di group ini!', id)
            } else {
                client.reply(from, 'Pilih enable atau disable udin!', id)
            }
            break
        case '#welcome':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Admin group!', id)
            if (args.length === 1) return client.reply(from, 'Pilih enable atau disable!', id)
            if (args[1].toLowerCase() === 'enable') {
                welkom.push(chat.id)
                fs.writeFileSync('./settings/welcome.json', JSON.stringify(welkom))
                client.reply(from, 'Fitur welcome berhasil di aktifkan di group ini!', id)
            } else if (args[1].toLowerCase() === 'disable') {
                welkom.splice(chat.id, 1)
                fs.writeFileSync('./settings/welcome.json', JSON.stringify(welkom))
                client.reply(from, 'Fitur welcome berhasil di nonaktifkan di group ini!', id)
            } else {
                client.reply(from, 'Pilih enable atau disable!', id)
            }
            break
        case '#intro':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Admin group!', id)
            if (args.length === 1) return client.reply(from, 'Pilih enable atau disable!', id)
            if (args[1].toLowerCase() === 'enable') {
                intr.push(chat.id)
                fs.writeFileSync('./settings/intro.json', JSON.stringify(intr))
                client.reply(from, 'Fitur intro berhasil di aktifkan di group ini!', id)
            } else if (args[1].toLowerCase() === 'disable') {
                intr.splice(chat.id, 1)
                fs.writeFileSync('./settings/intro.json', JSON.stringify(intr))
                client.reply(from, 'Fitur intro berhasil di nonaktifkan di group ini!', id)
            } else {
                client.reply(from, 'Pilih enable atau disable!', id)
            }
            break
        
        // GROUP //
                
        case '#groupinfo' :
        case '#infogroup' :
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', message.id)
            var totalMem = chat.groupMetadata.participants.length
            var desc = chat.groupMetadata.desc
            var groupname = name
            var welgrp = welkom.includes(chat.id)
            var intro = intr.includes(chat.id)
            var leftgrp = left.includes(chat.id)
            var antbad = antibadword.includes(chat.id)
            var antlink = antilink.includes(chat.id)
            var ngrp = nsfw_.includes(chat.id)
            var grouppic = await client.getProfilePicFromServer(chat.id)
            if (grouppic == undefined) {
                 var pfp = errorurl
            } else {
                 var pfp = grouppic 
            }
            await client.sendFileFromUrl(from, pfp, 'group.png', `➸ *Name : ${groupname}* 
*➸ Members : ${totalMem}*
*➸ Welcome : ${welgrp ? 'Aktif' : 'Tidak Aktif'}*
*➸ Left : ${leftgrp ? 'Aktif' : 'Tidak Aktif'}*
*➸ NSFW : ${ngrp ? 'Aktif' : 'Tidak Aktif'}*
*➸ Intro : ${intro ? 'Aktif' : 'Tidak Aktif'}*
*➸ Anti Link : ${antlink ? 'Aktif' : 'Tidak Aktif'}*
*➸ Anti Badword : ${antbad ? 'Aktif' : 'Tidak Aktif'}*
*➸ Group Description* 
${desc}`)
            break
        case '#linkgrup':
        case '#linkgroup':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            
            if (isGroupMsg) {
                const inviteLink = await client.getGroupInviteLink(groupId);
                client.sendLinkWithAutoPreview(from, inviteLink, `\nLink group *${name}*`)
            } else {
                client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            }
            await client.sendSeen(from)
            break
        case '#adminlist':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            let mimin = ''
            for (let admon of groupAdmins) {
                mimin += `➸ @${admon.replace(/@c.us/g, '')}\n` 
            }
            await sleep(2000)
            await client.sendTextWithMentions(from, mimin)
            break
        case '#ownergroup':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const Owner_ = chat.groupMetadata.owner
            await client.sendTextWithMentions(from, `Owner Group : @${Owner_}`)
            break
        case '#sankyuadmin':
        case '#admin':
            let admn = `This is list of SANKYU Admin\nTotal : ${adminNumber.length}\n`
            for (let i of adminNumber) {
                admn += `➸ ${i.replace(/@c.us/g,'')}\n`
            }
            await client.reply(from, admn, id)
            break
        case '#afk':
                if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id)
                //if (!isOwner) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user owner SANKYU BOT', id)
                const qa = args.join(' ').slice(5)
                if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (isAfkOn) return await client.reply(from, ind.afkOnAlready(), id)
                const reason = qa ? qa : 'Nothing.'
                addAfkUser(sender.id, time, reason)
                await client.reply(from, ind.afkOn(pushname, reason), id)
            break
        // MEDIA //
         case '#profile':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            var role = 'None'
            //if (isGroupMsg) {
              if (!quotedMsg) {
              var block = banned.includes(author)
              var pic = await client.getProfilePicFromServer(author)
              var namae = pushname
              var sts = await client.getStatus(author)
              var adm = isGroupAdmins
              var donate = isAdmin
              const { status } = sts
               if (pic == undefined) {
               var pfp = errorurl 
               } else {
               var pfp = pic
               } 
             await client.sendFileFromUrl(from, pfp, 'pfp.jpg', `*User Profile* ✨️ \n\n➸ *Username: ${namae}*\n\n➸ *User Info: ${status}*\n\n*➸ Ban: ${block}*\n\n➸ *Role: ${role}*\n\n➸ *Admin: ${adm}*\n\n➸ *Special: ${donate}*`)
             } else if (quotedMsg) {
             var qmid = quotedMsgObj.sender.id
             var block = blockNumber.includes(qmid)
             var pic = await client.getProfilePicFromServer(qmid)
             var namae = quotedMsgObj.sender.name
             var sts = await client.getStatus(qmid)
             var adm = isGroupAdmins
             var donate = isAdmin
             const { status } = sts
              if (pic == undefined) {
              var pfp = errorurl 
              } else {
              var pfp = pic
              } 
             await client.sendFi

             leFromUrl(from, pfp, 'pfo.jpg', `**User Profile* ✨️ \n\n➸ *Username: ${namae}*\n\n➸ *User Info: ${status}*\n\n*➸ Ban: ${block}*\n\n➸ *Role: ${role}*\n\n➸ *Admin: ${adm}*\n\n➸ *Special: ${donate}*`)
            }
            break
        case '#covid':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
            arg = body.trim().split(' ')
            console.log(...arg[1])
            var slicedArgs = Array.prototype.slice.call(arg, 1);
            console.log(slicedArgs)
            const country = await slicedArgs.join(' ')
            console.log(country)
            const response2 = await axios.get('https://coronavirus-19-api.herokuapp.com/countries/' + country + '/')
            const { cases, todayCases, deaths, todayDeaths, active } = response2.data
                await client.sendText(from, '🌎️ Covid Info - ' + country + ' 🌍️\n\n✨️ Total Cases: ' + `${cases}` + '\n📆️ Today\'s Cases: ' + `${todayCases}` + '\n☣️ Total Deaths: ' + `${deaths}` + '\n☢️ Today\'s Deaths: ' + `${todayDeaths}` + '\n⛩️ Active Cases: ' + `${active}` + '.')
            break
        case '#covidindo':
            rugaapi.covidindo()
            .then(async (res) => {
                await client.reply(from, `${res}`, id)
            })
            break
        case '#maps':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#maps [optional]*, Contoh : *#maps Jakarta*')
            arg = body.trim().split(' ')
            console.log(...arg[1])
            var slicedArgs = Array.prototype.slice.call(arg, 1);
            console.log(slicedArgs)
            const mapz = await slicedArgs.join(' ')
            console.log(mapz)
            try {
            const mapz2 = await axios.get('https://mnazria.herokuapp.com/api/maps?search=' + mapz)
            const { gambar } = mapz2.data
            const pictk = await bent("buffer")(gambar)
            const base64 = `data:image/jpg;base64,${pictk.toString("base64")}`
            client.sendImage(from, base64, 'maps.jpg', `*Hasil Maps : ${mapz}*`)
            } catch (err) {
             console.error(err.message)
             await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, User tidak ditemukan')
             client.sendText(ownerNumber, 'Error Maps : '+ err)
            }
            break
        case '#pantun':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/pantun.txt')
            .then(res => res.text())
            .then(body => {
                let splitpantun = body.split('\n')
                let randompantun = splitpantun[Math.floor(Math.random() * splitpantun.length)]
                client.reply(from, randompantun.replace(/aruga-line/g,"\n"), id)
            })
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break
        case '#fakta':
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/faktaunix.txt')
            .then(res => res.text())
            .then(body => {
                let splitnix = body.split('\n')
                let randomnix = splitnix[Math.floor(Math.random() * splitnix.length)]
                client.reply(from, randomnix, id)
            })
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break
        case '#katabijak':
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/katabijax.txt')
            .then(res => res.text())
            .then(body => {
                let splitbijak = body.split('\n')
                let randombijak = splitbijak[Math.floor(Math.random() * splitbijak.length)]
                client.reply(from, randombijak, id)
            })
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break
        case '#quran':
            //if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI SANKYU BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|SANKYU|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isGroupMsg) return client.reply(from, `Perintah ini hanya bisa di gunakan dalam group!`, id)
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (args.length === 1) return client.reply(from, `Kirim perintah Surah Quran kamu dengan cara ketik perintah :\n*#quran* [ Urutan Surat ]\nContoh :\n*#quran 1*`, id)
            const qura = `https://api.vhtear.com/quran?no=${args[1]}&apikey=${vhtearkey}`
            const quraan = await axios.get(qura)
            const quraann = quraan.data
            let hasqu = `*「 AL-QURAN 」*\n\n*Surah : ${quraann.result.surah}*\n*Quran* : ${quraann.result.quran}*`
            await client.reply(from, `${hasqu}`, id).catch((e) => client.reply(from, `*Terdapat kesalahan saat mencari surat ${args[1]}*`, id))
            break
        case '#cuaca':
            if (args.length == 1) return client.reply(from, `Untuk melihat cuaca pada suatu daerah\nketik: ${prefix}cuaca [daerah]`, id)
            const cuacaq = body.slice(7)
            const cuacap = await rugaapi.cuaca(cuacaq)
            await client.reply(from, cuacap, id)
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break
        case "#tts":
            if (args.length == 0) return client.reply(from, `Mengubah teks menjadi sound (google voice)\nketik: ${prefix}tts <kode_bahasa> <teks>\ncontoh : ${prefix}tts id halo\nuntuk kode bahasa cek disini : https://anotepad.com/note/read/5xqahdy8`)
            const ttsGB = require('node-gtts')(args[1])
            const dataText = body.slice(8)
                if (dataText === '') return client.reply(from, 'apa teksnya syg..', id)
                try {
                    ttsGB.save('./media/tts/resId.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resId.mp3', id)
                    })
                } catch (err) {
                    client.reply(from, err, id)
                }
            break
        case '#berita':
        if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
        if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
        const respons = await axios.get('http://newsapi.org/v2/top-headlines?country=id&apiKey=b2d3b1c264c147ae88dba39998c23279')
        const { totalResults, articles } = respons.data
        res = totalResults
        if (args[1] >= totalResults) {
            res = totalResults
          } else {
            res = args[1]
          }
          i = 0
          pesan = '_*Berita Terbaru Hari Ini*_\n\n'
          for (const isi of articles) {
            i++
            pesan = pesan + i + '. ' + '_' + isi.title + '_' + '\n' + isi.publishedAt + '\n' + isi.description + '\n' + isi.url
            if (i<res) {
              pesen = pesan + '\n\n'
            } else if(i > res){
              break
            }
          }
          await client.sendText(from, pesan)
          break 
        case '#toimage':
        case '#toimg':
        case '#stoimg':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (args.length === 2) return client.reply(from, `Hai ${pushname} untuk menggunakan fitur sticker to image, mohon tag stiker! dan kirim pesan *!toimage*`, id)
            if (quotedMsg) {
                client.reply(from, '_Mohon tunggu sedang mengkonversi stiker..._', id)
                if( quotedMsg.type === 'sticker') {
                mediaData = await decryptMedia(quotedMsg, uaOverride)
                await client.sendImage(from, `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`, `${pushname}.jpg`, `Sticker berhasil dikonversi! ${pushname}`)
                   } else {
                        client.reply(from, `Hai ${pushname} sepertinya yang ada tag bukan stiker, untuk menggunakan fitur sticker to image, mohon tag stiker! dan kirim pesan *!toimage*`, id)
                   }
                } else {
                    client.reply(from, `Hai ${pushname} untuk menggunakan fitur sticker to image, mohon tag stiker! dan kirim pesan *#toimage*`, id)
                }
            await client.sendSeen(from)
            break
        case '#sticker':
        case '#stiker':
        case '#s':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (isMedia && type === 'image') {
                const mediaData = await decryptMedia(message, uaOverride)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (quotedMsg && quotedMsg.type == 'image') {
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (args.length === 2) {
                const url = args[1]
                if (url.match(isUrl)) {
                    await client.sendStickerfromUrl(from, url, { method: 'get' })
                        .catch(err => console.log('Caught exception: ', err))
                } else {
                    client.reply(from, mess.error.Iv, id)
                }
            } else {
                    client.reply(from, mess.error.St, id)
            }
            break
        case '#stickergif':
        case '#stikergif':
        case '#sgif':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            client.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
            if (isMedia && type === 'video' || mimetype === 'image/gif') {
                try {
                    const mediaData = await decryptMedia(message, uaOverride)
                    await client.sendMp4AsSticker(from, mediaData, {fps: 17, startTime: `00:00:00.0`, endTime : `00:00:05.0`,loop: 0})
                } catch (e) {
                    client.reply(from, `Size media terlalu besar! mohon kurangi durasi video.`, id)
                }
            } else if (quotedMsg && quotedMsg.type == 'video' || quotedMsg && quotedMsg.mimetype == 'image/gif') {
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                await client.sendMp4AsSticker(from, mediaData, {fps: 15, startTime: `00:00:00.0`, endTime : `00:00:05.0`,loop: 0})
            } else {
                client.reply(from, `Kesalahan ⚠️ Hanya bisa video/gif apabila file media berbentuk gambar ketik #stiker`, id)
            } 
            await client.sendSeen(from)
            break
        
        // MAKER //
        case '#quotemaker':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            arg = body.trim().split('|')
            if (arg.length >= 4) {
                client.reply(from, mess.wait, id)
                const quotes = arg[1]
                const author = arg[2]
                const theme = arg[3]
                await quotemaker(quotes, author, theme).then(amsu => {
                    client.sendFile(from, amsu, 'quotesmaker.jpg','neh...').catch(() => {
                       client.reply(from, mess.error.Qm, id)
                    })
                })
            } else {
                client.reply(from, 'Usage: \n#quotemaker |teks|watermark|theme\n\nEx :\n#quotemaker |ini contoh|bicit|random', id)
            }
            break
        case '#alay':
            if (args.length == 1) return client.reply(from, `Mengubah kalimat menjadi alayyyyy\n\nketik ${prefix}alay kalimat`, id)
            rugaapi.bapakfont(body.slice(6))
            .then(async(res) => {
                await client.reply(from, `${res}`, id)
            })
            break
        case '#nulis':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            if (args.length == 1) return client.reply(from, `Membuat bot menulis teks yang dikirim menjadi gambar\nPemakaian: ${prefix}nulis [teks]\n\ncontoh: ${prefix}nulis i love you 3000`, id)
            const nulisq = body.slice(7)
            const nulisp = await rugaapi.tulis(nulisq)
            await client.sendImage(from, `${nulisp}`, '', 'Nih...', id)
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break
        case '#tostiker':
        case '#tosticker':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id)
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (args.length === 1) return client.reply(from, `Penggunaan teks to sticker : *!tosticker [Teks]*\n\nContoh : !tosticker bot ganteng`)
            /* if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6282235205986 untuk pertanyaan lebih lanjut', id) */
            if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') return client.reply(from, 'Fitur ini hanya untuk teks! bukan gambar.', id)
           
            const texk = body.slice(10)
            client.reply(from, '_Sedang mengkonversi teks ke stiker..._', id)
            try {
                 if (quotedMsgObj == 'stiker') {
                     const GetData = await BikinTikel(texk)
                     if (GetData.status == false) return client.reply(from, 'Kesalahan dalam mengkonversi teks! tag tulisan atau gunakan teks setelah perintah *#tosticker [teks]*', id)
                     try {
                         await client.sendImageAsSticker(from, GetData.base64)
                     } catch (err) {
                         console.log(err)
                     }
                 } else {
                     const GetData = await BikinTikel(quotedMsgObj.body)
                     if (GetData.status == false) return client.reply(from, 'Kesalahan dalam mengkonversi teks! tag tulisan atau gunakan teks setelah perintah *!tosticker [teks]*', id)
                     try {
                         await client.sendImageAsSticker(from, GetData.base64)
                     } catch (err) {
                         console.log(err)
                     }
                 }
            } catch (err){
                console.log(err)
            }

            try
                 {
                     const string = body.toLowerCase().includes('#ttp') ? body.slice(5) : body.slice(5)
                     if(args)
                     {
                         if(quotedMsgObj == null)
                         {
                             const gasMake = await getStickerMaker(string)
                             if(gasMake.status == true)
                             {
                                 try{
                                     await client.sendImageAsSticker(from, gasMake.base64)
                                 }catch(err) {
                                     await client.reply(from, 'Gagal membuat.', id)
                                 } 
                             }else{
                                 await client.reply(from, gasMake.reason, id)
                             }
                         }else if(quotedMsgObj != null){
                             const gasMake = await getStickerMaker(quotedMsgObj.body)
                             if(gasMake.status == true)
                             {
                                 try{
                                     await client.sendImageAsSticker(from, gasMake.base64)
                                 }catch(err) {
                                     await client.reply(from, 'Gagal membuat.', id)
                                 } 
                             }else{
                                 await client.reply(from, gasMake.reason, id)
                             }
                   }
                       
                     }else{
                         await client.reply(from, 'Tidak boleh kosong.', id)
                     }
                 }catch(error)
                 {
                     console.log(error)
                 }
            await client.sendSeen(from)
            break
        case '#esticker':
        case '#es':
                    if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id)
                        const emojiUnicode = require('emoji-unicode')
                        const bjbjbja = emojiUnicode(args[1])
                        client.sendStickerfromUrl(from, "https://api.vhtear.com/emojitopng?code="+ bjbjbja +"&apikey=" + vhtearkey)
                        break
        // SEARCH //
        case '#movie':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            if (args.length == 1) return client.reply(from, `Untuk mencari suatu movie dari website sdmovie.fun\nketik: ${prefix}movie judulnya`, id)
            rugaapi.movie((body.slice(7)))
            .then(async (res) => {
                if (res.status == 'error') return client.reply(from, res.hasil, id)
                await client.sendFileFromUrl(from, res.link, 'movie.jpg', res.hasil, id)
            })
            break
        case '#images':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            if (args.length == 1) return client.reply(from, `Untuk mencari gambar di pinterest\nketik: ${prefix}images [search]\ncontoh: ${prefix}images naruto`, id)
            const cariwall = body.slice(8)
            const hasilwall = await images.fdci(cariwall)
            await client.sendFileFromUrl(from, hasilwall, '', '', id)
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break
        case '#sreddit':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            if (args.length == 1) return client.reply(from, `Untuk mencari gambar di sub reddit\nketik: ${prefix}sreddit [search]\ncontoh: ${prefix}sreddit naruto`, id)
            const carireddit = body.slice(9)
            const hasilreddit = await images.sreddit(carireddit)
            await client.sendFileFromUrl(from, hasilreddit, '', '', id)
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break
        case '#kbbi':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI SANKYU BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|SANKYU|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (args.length === 1) return client.reply(from, `Kirim perintah *#kbbi [ Query ]*\nContoh : *#kbbi asu*`, id)
            const kbbl = body.slice(6)
            const kbbl2 = await axios.get(`https://api.vhtear.com/kbbi?query=${kbbl}&apikey=${vhtearkey}`)

            if (kbbl2.data.error) {
                client.reply(from, kbbl2.data.error, id)
            } else {
                client.sendText(from, `*「 KBBI 」*\n\n➸ *Query* : ${kbbl}\n\n➸ *Result* : ${kbbl2.data.result.hasil}`, id)
                await limitAdd(serial)
            }
            break
        case '#wiki':
            if (args.length == 1) return client.reply(from, `Untuk mencari suatu kata dari wikipedia\nketik: ${prefix}wiki [kata]`, id)
            const wikip = body.slice(7)
            const wikis = await rugaapi.wiki(wikip)
            await client.reply(from, wikis, id)
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break
         case '#translate':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            /* if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id) */
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if(args[1] == undefined || args[2] == undefined) return
            if(args.length >= 2){
                var codelang = args[1]
                var text = body.slice(11+codelang.length);
                translatte(text, {to: codelang}).then(res => {
                    client.sendText(from,res.text);
                    limitAdd(serial)
                }).catch(err => {
                     client.sendText(from,`[ERROR] Teks tidak ada, atau kode bahasa ${codelang} tidak support\n~> *#bahasa* untuk melihat list kode bahasa`);
                });
            }
            break
        case '#brainly':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            /* if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6282235205986 untuk pertanyaan lebih lanjut', id) */
           
            if (args.length >= 2){
                const BrainlySearch = require('./lib/brainly')
                let tanya = body.slice(9)
                let jum = Number(tanya.split('|')[1]) || 2
                if (jum > 10) return client.reply(from, 'Max 10!', id)
                if (Number(tanya[tanya.length-1])){
                    tanya
                }
                client.reply(from, `➣ *Pertanyaan* : ${tanya.split('.')[0]}\n\n➣ *Jumlah jawaban* : ${Number(jum)}`, id)
                await BrainlySearch(tanya.split('.')[0],Number(jum), function(res){
                    res.forEach(x=>{
                        if (x.jawaban.fotoJawaban.length == 0) {
                            client.reply(from, `➣ *Pertanyaan* : ${x.pertanyaan}\n\n➣ *Jawaban* : ${x.jawaban.judulJawaban}\n`, id)
                        } else {
                            client.reply(from, `➣ *Pertanyaan* : ${x.pertanyaan}\n\n➣ *Jawaban* 〙: ${x.jawaban.judulJawaban}\n\n➣ *Link foto jawaban* : ${x.jawaban.fotoJawaban.join('\n')}`, id)
                        }
                    })
                })
            } else {
                client.reply(from, 'Usage :\n!brainly [pertanyaan] [|jumlah]\n\nEx : \n!brainly NKRI |2', id)
            }
            await client.sendSeen(from)
            break
        case '#lirik':
            if (args.length == 1) return aruga.reply(from, `Untuk mencari lirik dari sebuah lagu\bketik: ${prefix}lirik [judul_lagu]`, id)
            rugaapi.lirik(body.slice(8))
            .then(async (res) => {
                await aruga.reply(from, `Lirik Lagu: ${body.slice(8)}\n\n${res}`, id)
            })
            break
        case '#chord':
            if (args.length == 1) return client.reply(from, `Untuk mencari lirik dan chord dari sebuah lagu\bketik: ${prefix}chord [judul_lagu]`, id)
            const chordq = body.slice(7)
            const chordp = await rugaapi.chord(chordq)
            await client.reply(from, chordp, id)
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break
        case '#resep':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            if (args.length == 0) return client.reply(from, `Untuk mencari resep makanan\nCaranya ketik: ${prefix}resep [search]\n\ncontoh: ${prefix}resep tahu`, id)
            const cariresep = body.slice(8)
            const hasilresep = await resep.resep(cariresep)
            await client.reply(from, hasilresep + '\n\nIni kak resep makanannya..', id)
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break
        case '#pinterest':
            if (args.length == 1) return client.reply(from, `Untuk mencari gambar dari pinterest\nketik: ${prefix}images [search]\ncontoh: ${prefix}images naruto`, id)
            const cariwalll = body.slice(12)
            const hasilwalll = await images.fdci(cariwalll)
            await client.sendFileFromUrl(from, hasilwalll, '', '', id)
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break
        case '#google':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id)
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah seperti contoh berikut *#google gta sfile.mobi*')
            var googleQuery1 = body.slice(8)
            if(googleQuery1 == undefined || googleQuery1 == ' ') return
            google({ 'query': googleQuery1, 'limit': '2' }).then(results => {
                let vars = results[0];
                    client.sendText(from, `_*Hasil Pencarian Google*_\n\n~> Judul : \n${vars.title}\n\n~> Deskripsi : \n${vars.snippet}\n\n~> Link : \n${vars.link}`);
            }).catch(e => {
                client.sendText(e);
            })
            break
        case '#search':
            if (args.length === 1) return client.reply(from, `Kirim perintah Google search dengan cara ketik perintah :\n*#search* _Query search_\nContoh :\n*!search* _Detik News hari ini_`, id)
            client.reply(from, mess.wait, id)
            const googleQuery = body.slice(8)
            if(googleQuery == undefined || googleQuery == ' ') return client.reply(from, `_Kesalahan tidak bisa menemukan hasil from ${googleQuery}_`, id)
            google({ 'query': googleQuery }).then(results => {
            let captserch = `_*Hasil Pencarian Google from*_ ${googleQuery}\n`
            for (let i = 0; i < results.length; i++) {
                captserch += `\n\n=============================\n\n`
                captserch +=  `\n*Judul* : ${results[i].title}\n*Deskripsi* : ${results[i].snippet}\n*Link* : ${results[i].link}\n`
            }
                client.reply(from, captserch, id);
            }).catch(e => {
                ERRLOG(e)
                client.sendText(ownerNumber, e);
            })
            await client.sendSeen(from)
            break
        case '#zodiak':
            if (args.length !== 5) return client.reply(from, `Untuk mengecek zodiak, gunakan ${prefix}zodiak nama tanggallahir bulanlahir tahunlahir\nContoh: ${prefix}zodiak fikri 13 06 2004`, id)
            const cekzodiak = await rugaapi.cekzodiak(args[1],args[2],args[3])
            await client.reply(from, cekzodiak, id)
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break
        // anime //
        case '#loli':
            const lolip = fs.readFileSync('./lib/loli.json')
            const loliJsina = JSON.parse(lolip)
            const loliIndix = Math.floor(Math.random() * loliJsina.length)
            const loliKiy = loliJsina[loliIndix]
            client.sendFileFromUrl(from, loliKiy.image, 'loli.jpg', loliKiy.teks, id)
            break
        case '#anime':
            if (args.length == 1) return client.reply(from, `Untuk menggunakan ${prefix}anime\nSilahkan ketik: ${prefix}anime [query]\nContoh: ${prefix}anime random\n\nquery yang tersedia:\nrandom, waifu, husbu, neko`, id)
            if (args[1] == 'random' || args[1] == 'waifu' || args[1] == 'husbu' || args[1] == 'neko') {
                fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/anime/' + args[1] + '.txt')
                .then(res => res.text())
                .then(body => {
                    let randomnime = body.split('\n')
                    let randomnimex = randomnime[Math.floor(Math.random() * randomnime.length)]
                    client.sendFileFromUrl(from, randomnimex, '', 'Nee..', id)
                })
                .catch(() => {
                    client.reply(from, 'Ada yang Error!', id)
                })
            } else {
                client.reply(from, `Maaf query tidak tersedia. Silahkan ketik ${prefix}anime untuk melihat list query`)
            }
            break
        case '#shota':
            /* if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id) */
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            const imageToBase64 = require('image-to-base64')
            var shouta = ['shota anime','anime shota'];
            var shotaa = shouta[Math.floor(Math.random() * shouta.length)];
            var urlshot = "https://api.fdci.se/rep.php?gambar=" + shotaa;
            
            axios.get(urlshot)
            .then((result) => {
            var sht = JSON.parse(JSON.stringify(result.data));
            var shotaak =  sht[Math.floor(Math.random() * sht.length)];
            imageToBase64(shotaak)
            .then(
                (response) => {
            let img = 'data:image/jpeg;base64,'+response
            client.sendFile(from, img, "shota.jpg", `*SHOTA*`, id)
                    }) 
                .catch(
                    (error) => {
                        console.log(error);
                    })
            })
            break
        case '#husbu':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const diti = fs.readFileSync('./lib/husbu.json')
            const ditiJsin = JSON.parse(diti)
            const rindIndix = Math.floor(Math.random() * ditiJsin.length)
            const rindKiy = ditiJsin[rindIndix]
            client.sendFileFromUrl(from, rindKiy.image, 'Husbu.jpg', rindKiy.teks, id)
            break
        case '#quotesnime':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
           // if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const skya = await get.get('https://mhankbarbars.herokuapp.com/api/quotesnime/random').json()
            skya_ = skya.data
            client.reply(from, `➸ *Quotes* : ${skya_.quote}\n➸ *Character* : ${skya_.character}\n➸ *Anime* : ${skya_.anime}`, id)
            break
        case '#wallanime' :
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const walnime = ['https://wallpaperaccess.com/full/395986.jpg','https://wallpaperaccess.com/full/21628.jpg','https://wallpaperaccess.com/full/21622.jpg','https://wallpaperaccess.com/full/21612.jpg','https://wallpaperaccess.com/full/21611.png','https://wallpaperaccess.com/full/21597.jpg','https://cdn.nekos.life/wallpaper/QwGLg4oFkfY.png','https://wallpaperaccess.com/full/21591.jpg','https://cdn.nekos.life/wallpaper/bUzSjcYxZxQ.jpg','https://cdn.nekos.life/wallpaper/j49zxzaUcjQ.jpg','https://cdn.nekos.life/wallpaper/YLTH5KuvGX8.png','https://cdn.nekos.life/wallpaper/Xi6Edg133m8.jpg','https://cdn.nekos.life/wallpaper/qvahUaFIgUY.png','https://cdn.nekos.life/wallpaper/leC8q3u8BSk.jpg','https://cdn.nekos.life/wallpaper/tSUw8s04Zy0.jpg','https://cdn.nekos.life/wallpaper/sqsj3sS6EJE.png','https://cdn.nekos.life/wallpaper/HmjdX_s4PU4.png','https://cdn.nekos.life/wallpaper/Oe2lKgLqEXY.jpg','https://cdn.nekos.life/wallpaper/GTwbUYI-xTc.jpg','https://cdn.nekos.life/wallpaper/nn_nA8wTeP0.png','https://cdn.nekos.life/wallpaper/Q63o6v-UUa8.png','https://cdn.nekos.life/wallpaper/ZXLFm05K16Q.jpg','https://cdn.nekos.life/wallpaper/cwl_1tuUPuQ.png','https://cdn.nekos.life/wallpaper/wWhtfdbfAgM.jpg','https://cdn.nekos.life/wallpaper/3pj0Xy84cPg.jpg','https://cdn.nekos.life/wallpaper/sBoo8_j3fkI.jpg','https://cdn.nekos.life/wallpaper/gCUl_TVizsY.png','https://cdn.nekos.life/wallpaper/LmTi1k9REW8.jpg','https://cdn.nekos.life/wallpaper/sbq_4WW2PUM.jpg','https://cdn.nekos.life/wallpaper/QOSUXEbzDQA.png','https://cdn.nekos.life/wallpaper/khaqGIHsiqk.jpg','https://cdn.nekos.life/wallpaper/iFtEXugqQgA.png','https://cdn.nekos.life/wallpaper/deFKIDdRe1I.jpg','https://cdn.nekos.life/wallpaper/OHZVtvDm0gk.jpg','https://cdn.nekos.life/wallpaper/YZYa00Hp2mk.jpg','https://cdn.nekos.life/wallpaper/R8nPIKQKo9g.png','https://cdn.nekos.life/wallpaper/_brn3qpRBEE.jpg','https://cdn.nekos.life/wallpaper/ADTEQdaHhFI.png','https://cdn.nekos.life/wallpaper/MGvWl6om-Fw.jpg','https://cdn.nekos.life/wallpaper/YGmpjZW3AoQ.jpg','https://cdn.nekos.life/wallpaper/hNCgoY-mQPI.jpg','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/iQ2FSo5nCF8.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/CmEmn79xnZU.jpg','https://cdn.nekos.life/wallpaper/MAL18nB-yBI.jpg','https://cdn.nekos.life/wallpaper/FUuBi2xODuI.jpg','https://cdn.nekos.life/wallpaper/ez-vNNuk6Ck.jpg','https://cdn.nekos.life/wallpaper/K4-z0Bc0Vpc.jpg','https://cdn.nekos.life/wallpaper/Y4JMbswrNg8.jpg','https://cdn.nekos.life/wallpaper/ffbPXIxt4-0.png','https://cdn.nekos.life/wallpaper/x63h_W8KFL8.jpg','https://cdn.nekos.life/wallpaper/lktzjDRhWyg.jpg','https://cdn.nekos.life/wallpaper/j7oQtvRZBOI.jpg','https://cdn.nekos.life/wallpaper/MQQEAD7TUpQ.png','https://cdn.nekos.life/wallpaper/lEG1-Eeva6Y.png','https://cdn.nekos.life/wallpaper/Loh5wf0O5Aw.png','https://cdn.nekos.life/wallpaper/yO6ioREenLA.png','https://cdn.nekos.life/wallpaper/4vKWTVgMNDc.jpg','https://cdn.nekos.life/wallpaper/Yk22OErU8eg.png','https://cdn.nekos.life/wallpaper/Y5uf1hsnufE.png','https://cdn.nekos.life/wallpaper/xAmBpMUd2Zw.jpg','https://cdn.nekos.life/wallpaper/f_RWFoWciRE.jpg','https://cdn.nekos.life/wallpaper/Y9qjP2Y__PA.jpg','https://cdn.nekos.life/wallpaper/eqEzgohpPwc.jpg','https://cdn.nekos.life/wallpaper/s1MBos_ZGWo.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/32EAswpy3M8.png','https://cdn.nekos.life/wallpaper/Z6eJZf5xhcE.png','https://cdn.nekos.life/wallpaper/xdiSF731IFY.jpg','https://cdn.nekos.life/wallpaper/Y9r9trNYadY.png','https://cdn.nekos.life/wallpaper/8bH8CXn-sOg.jpg','https://cdn.nekos.life/wallpaper/a02DmIFzRBE.png','https://cdn.nekos.life/wallpaper/MnrbXcPa7Oo.png','https://cdn.nekos.life/wallpaper/s1Tc9xnugDk.jpg','https://cdn.nekos.life/wallpaper/zRqEx2gnfmg.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/0ECCRW9soHM.jpg','https://cdn.nekos.life/wallpaper/kAw8QHl_wbM.jpg','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/WVEdi9Ng8UE.png','https://cdn.nekos.life/wallpaper/IRu29rNgcYU.png','https://cdn.nekos.life/wallpaper/LgIJ_1AL3rM.jpg','https://cdn.nekos.life/wallpaper/DVD5_fLJEZA.jpg','https://cdn.nekos.life/wallpaper/siqOQ7k8qqk.jpg','https://cdn.nekos.life/wallpaper/CXNX_15eGEQ.png','https://cdn.nekos.life/wallpaper/s62tGjOTHnk.jpg','https://cdn.nekos.life/wallpaper/tmQ5ce6EfJE.png','https://cdn.nekos.life/wallpaper/Zju7qlBMcQ4.jpg','https://cdn.nekos.life/wallpaper/CPOc_bMAh2Q.png','https://cdn.nekos.life/wallpaper/Ew57S1KtqsY.jpg','https://cdn.nekos.life/wallpaper/hVpFbYJmZZc.jpg','https://cdn.nekos.life/wallpaper/sb9_J28pftY.jpg','https://cdn.nekos.life/wallpaper/JDoIi_IOB04.jpg','https://cdn.nekos.life/wallpaper/rG76AaUZXzk.jpg','https://cdn.nekos.life/wallpaper/9ru2luBo360.png','https://cdn.nekos.life/wallpaper/ghCgiWFxGwY.png','https://cdn.nekos.life/wallpaper/OSR-i-Rh7ZY.png','https://cdn.nekos.life/wallpaper/65VgtPyweCc.jpg','https://cdn.nekos.life/wallpaper/3vn-0FkNSbM.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/3VjNKqEPp58.jpg','https://cdn.nekos.life/wallpaper/NoG4lKnk6Sc.jpg','https://cdn.nekos.life/wallpaper/xiTxgRMA_IA.jpg','https://cdn.nekos.life/wallpaper/yq1ZswdOGpg.png','https://cdn.nekos.life/wallpaper/4SUxw4M3UMA.png','https://cdn.nekos.life/wallpaper/cUPnQOHNLg0.jpg','https://cdn.nekos.life/wallpaper/zczjuLWRisA.jpg','https://cdn.nekos.life/wallpaper/TcxvU_diaC0.png','https://cdn.nekos.life/wallpaper/7qqWhEF_uoY.jpg','https://cdn.nekos.life/wallpaper/J4t_7DvoUZw.jpg','https://cdn.nekos.life/wallpaper/xQ1Pg5D6J4U.jpg','https://cdn.nekos.life/wallpaper/aIMK5Ir4xho.jpg','https://cdn.nekos.life/wallpaper/6gneEXrNAWU.jpg','https://cdn.nekos.life/wallpaper/PSvNdoISWF8.jpg','https://cdn.nekos.life/wallpaper/SjgF2-iOmV8.jpg','https://cdn.nekos.life/wallpaper/vU54ikOVY98.jpg','https://cdn.nekos.life/wallpaper/QjnfRwkRU-Q.jpg','https://cdn.nekos.life/wallpaper/uSKqzz6ZdXc.png','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/N1l8SCMxamE.jpg','https://cdn.nekos.life/wallpaper/n2cBaTo-J50.png','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/7bwxy3elI7o.png','https://cdn.nekos.life/wallpaper/7VW4HwF6LcM.jpg','https://cdn.nekos.life/wallpaper/YtrPAWul1Ug.png','https://cdn.nekos.life/wallpaper/1p4_Mmq95Ro.jpg','https://cdn.nekos.life/wallpaper/EY5qz5iebJw.png','https://cdn.nekos.life/wallpaper/aVDS6iEAIfw.jpg','https://cdn.nekos.life/wallpaper/veg_xpHQfjE.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/Xa_GtsKsy-s.png','https://cdn.nekos.life/wallpaper/6Bx8R6D75eM.png','https://cdn.nekos.life/wallpaper/zXOGXH_b8VY.png','https://cdn.nekos.life/wallpaper/VQcviMxoQ00.png','https://cdn.nekos.life/wallpaper/CJnRl-PKWe8.png','https://cdn.nekos.life/wallpaper/zEWYfFL_Ero.png','https://cdn.nekos.life/wallpaper/_C9Uc5MPaz4.png','https://cdn.nekos.life/wallpaper/zskxNqNXyG0.jpg','https://cdn.nekos.life/wallpaper/g7w14PjzzcQ.jpg','https://cdn.nekos.life/wallpaper/KavYXR_GRB4.jpg','https://cdn.nekos.life/wallpaper/Z_r9WItzJBc.jpg','https://cdn.nekos.life/wallpaper/Qps-0JD6834.jpg','https://cdn.nekos.life/wallpaper/Ri3CiJIJ6M8.png','https://cdn.nekos.life/wallpaper/ArGYIpJwehY.jpg','https://cdn.nekos.life/wallpaper/uqYKeYM5h8w.jpg','https://cdn.nekos.life/wallpaper/h9cahfuKsRg.jpg','https://cdn.nekos.life/wallpaper/iNPWKO8d2a4.jpg','https://cdn.nekos.life/wallpaper/j2KoFVhsNig.jpg','https://cdn.nekos.life/wallpaper/z5Nc-aS6QJ4.jpg','https://cdn.nekos.life/wallpaper/VUFoK8l1qs0.png','https://cdn.nekos.life/wallpaper/rQ8eYh5mXN8.png','https://cdn.nekos.life/wallpaper/D3NxNISDavQ.png','https://cdn.nekos.life/wallpaper/Z_CiozIenrU.jpg','https://cdn.nekos.life/wallpaper/np8rpfZflWE.jpg','https://cdn.nekos.life/wallpaper/ED-fgS09gik.jpg','https://cdn.nekos.life/wallpaper/AB0Cwfs1X2w.jpg','https://cdn.nekos.life/wallpaper/DZBcYfHouiI.jpg','https://cdn.nekos.life/wallpaper/lC7pB-GRAcQ.png','https://cdn.nekos.life/wallpaper/zrI-sBSt2zE.png','https://cdn.nekos.life/wallpaper/_RJhylwaCLk.jpg','https://cdn.nekos.life/wallpaper/6km5m_GGIuw.png','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/oggceF06ONQ.jpg','https://cdn.nekos.life/wallpaper/ELdH2W5pQGo.jpg','https://cdn.nekos.life/wallpaper/Zun_n5pTMRE.png','https://cdn.nekos.life/wallpaper/VqhFKG5U15c.png','https://cdn.nekos.life/wallpaper/NsMoiW8JZ60.jpg','https://cdn.nekos.life/wallpaper/XE4iXbw__Us.png','https://cdn.nekos.life/wallpaper/a9yXhS2zbhU.jpg','https://cdn.nekos.life/wallpaper/jjnd31_3Ic8.jpg','https://cdn.nekos.life/wallpaper/Nxanxa-xO3s.png','https://cdn.nekos.life/wallpaper/dBHlPcbuDc4.jpg','https://cdn.nekos.life/wallpaper/6wUZIavGVQU.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/H9OUpIrF4gU.jpg','https://cdn.nekos.life/wallpaper/xlRdH3fBMz4.jpg','https://cdn.nekos.life/wallpaper/7IzUIeaae9o.jpg','https://cdn.nekos.life/wallpaper/FZCVL6PyWq0.jpg','https://cdn.nekos.life/wallpaper/5dG-HH6d0yw.png','https://cdn.nekos.life/wallpaper/ddxyA37HiwE.png','https://cdn.nekos.life/wallpaper/I0oj_jdCD4k.jpg','https://cdn.nekos.life/wallpaper/ABchTV97_Ts.png','https://cdn.nekos.life/wallpaper/58C37kkq39Y.png','https://cdn.nekos.life/wallpaper/HMS5mK7WSGA.jpg','https://cdn.nekos.life/wallpaper/1O3Yul9ojS8.jpg','https://cdn.nekos.life/wallpaper/hdZI1XsYWYY.jpg','https://cdn.nekos.life/wallpaper/h8pAJJnBXZo.png','https://cdn.nekos.life/wallpaper/apO9K9JIUp8.jpg','https://cdn.nekos.life/wallpaper/p8f8IY_2mwg.jpg','https://cdn.nekos.life/wallpaper/HY1WIB2r_cE.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/jzN74LcnwE8.png','https://cdn.nekos.life/wallpaper/IeAXo5nJhjw.jpg','https://cdn.nekos.life/wallpaper/7lgPyU5fuLY.jpg','https://cdn.nekos.life/wallpaper/f8SkRWzXVxk.png','https://cdn.nekos.life/wallpaper/ZmDTpGGeMR8.jpg','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/ZhP-f8Icmjs.jpg','https://cdn.nekos.life/wallpaper/7FyUHX3fE2o.jpg','https://cdn.nekos.life/wallpaper/CZoSLK-5ng8.png','https://cdn.nekos.life/wallpaper/pSNDyxP8l3c.png','https://cdn.nekos.life/wallpaper/AhYGHF6Fpck.jpg','https://cdn.nekos.life/wallpaper/ic6xRRptRes.jpg','https://cdn.nekos.life/wallpaper/89MQq6KaggI.png','https://cdn.nekos.life/wallpaper/y1DlFeHHTEE.png']
            let walnimek = walnime[Math.floor(Math.random() * walnime.length)]
            client.sendFileFromUrl(from, walnimek, 'Nimek.jpg', '', id)
            break
        case '#wait':
        case '#whatanime':
            if ((isMedia || isQuotedImage)) {
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const getUrl = await uploadImages(mediaData, false)
                const linkawal = await fetch(`https://api.trace.moe/search?cutBorders&url=${getUrl}`)
                const mencari = await linkawal.json()
                if (!mencari) {
                    await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Anime tidak ditemukan', id)
                    return null
                }
                const {  filename, episode, to, similarity, video, image } = mencari.result[0]
                const simpersen = `${(similarity*100)}`
                const pisahkan = simpersen.split('.')[0]
                const titles = `
Name: ${filename}
Epi: ${episode}
Kesamaan: ${pisahkan}%`
                const imageaa = await bent("buffer")(image)
                const base6444 = `data:image/jpg;base64,${imageaa.toString("base64")}`
                client.sendImage(from, base6444, filename, titles)
                var vidioo = `${video}`
                client.sendFileFromUrl(from, vidioo, 'anime.mp4', id)
                //client.sendImage(from, base6444, filename, titles)
            }
            break
        case '#malanime':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const keyword = body.slice(11)
            try {
            const data = await fetch(
           `https://api.jikan.moe/v3/search/anime?q=${keyword}`
            )
            const parsed = await data.json()
            if (!parsed) {
              await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Anime tidak ditemukan', id)
              return null
              }
            const { title, synopsis, episodes, url, rated, score, image_url } = parsed.results[0]
            const content = `*Anime Ditemukan!*
✨️ *Title:* ${title}
🎆️ *Episodes:* ${episodes}
💌️ *Rating:* ${rated}
❤️ *Score:* ${score}
💚️ *Synopsis:* ${synopsis}
🌐️ *URL*: ${url}`
            const imagea = await bent("buffer")(image_url)
            const base64 = `data:image/jpg;base64,${imagea.toString("base64")}`
            client.sendImage(from, base64, title, content)
           } catch (err) {
             console.error(err.message)
             await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Anime tidak ditemukan')
           }
          break
        // OTHER //
        case '#runtime':
            function format(seconds){
            function pad(s){
            return (s < 10 ? '0' : '') + s;
            }
            var hours = Math.floor(seconds / (60*60));
            var minutes = Math.floor(seconds % (60*60) / 60);
            var seconds = Math.floor(seconds % 60);
            return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
            }
            var uptime = process.uptime();
            client.reply(from, `\n\n*BOT TELAH BERJALAN SELAMA*\n\n*TIME : ${format(uptime)} ✨*\n\n`, id)
            break
        case 'speed':
        case '#speed':
        case 'ping':
            const timestamp1 = speed()
            const latensi1 = speed() - timestamp1
            await client.sendText(from, `Pong!!!!\nSpeed: ${latensi1.toFixed(3)} _Second_`)
            break
        case '#owner':
        case '#creator':
            client.sendContact(chatId, `6281289096745@c.us`)
            client.reply(from, 'tu owner saya:) ada yang di tanyakan, jangan di spam atau telpon', id)
            break
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
        //client.kill().then(a => console.log(a))
    }
}